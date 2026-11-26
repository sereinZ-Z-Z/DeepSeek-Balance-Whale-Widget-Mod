// ============================================================================
// 二改不变量自检 —— 防止「跟随上游」时本仓库的增量被悄悄覆盖掉。
//
// 为什么需要它：assets/whale-widget.js 是 1.2 MB 的单文件，上游每次发版都会整体替换。
//   合并时如果漏了某处锚点，结果是**不报错的功能消失** —— 菜单里少一行、切了显示源没反应、
//   颜色被改回上游的旧常量。这类问题人工 review 一万行 diff 看不出来，只能靠断言。
//
// 三条原则：
//   ① 只读源码文本 + 从源码里抽出纯函数现场求值，**不复制实现**。复制一份会漂移，
//      测试绿了但线上红，比没有测试更坏。
//   ② 不启动宿主、不读 $DSH_HOME、不写任何文件 —— 可以放心在 CI 里跑。
//   ③ 断言写「行为」而不是「行号 / 具体字符串位置」，上游重排格式不会误报。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const WIDGET = fs.readFileSync(path.join(ROOT, 'assets', 'whale-widget.js'), 'utf8')
const PKG = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))

// 从 fromIdx 处的 open 字符开始做括号配平，返回整段文本（含首尾括号）
function balanced(src, fromIdx, open, close) {
  let depth = 0
  for (let i = fromIdx; i < src.length; i++) {
    if (src[i] === open) depth++
    else if (src[i] === close) {
      depth--
      if (depth === 0) return src.slice(fromIdx, i + 1)
    }
  }
  throw new Error(`从位置 ${fromIdx} 开始的 ${open} 没有闭合`)
}

// 抽出整个函数体，找不到就直接失败（说明被上游覆盖了）
function pickFunction(name) {
  const at = WIDGET.indexOf(`function ${name}(`)
  assert.notEqual(at, -1, `assets/whale-widget.js 里找不到 ${name}() —— 合并上游时大概率被覆盖了`)
  const braceAt = WIDGET.indexOf('{', at)
  return WIDGET.slice(at, braceAt + balanced(WIDGET, braceAt, '{', '}').length)
}

// 抽出 `var NAME = [...]` 这种数组字面量并求值
function pickArray(name) {
  const at = WIDGET.indexOf(`var ${name}`)
  assert.notEqual(at, -1, `assets/whale-widget.js 里找不到 ${name} —— 合并上游时大概率被覆盖了`)
  const bracketAt = WIDGET.indexOf('[', at)
  const literal = balanced(WIDGET, bracketAt, '[', ']')
  return new Function(`return ${literal}`)()
}

// 把 bubbleModsForMode 装进一个只有 stub 的沙箱里跑，避免拉起整个前端
function bubbleFilter(mode) {
  const fn = pickFunction('bubbleModsForMode')
  const make = new Function('balModeGet', 'balColorOf', `${fn}\nreturn bubbleModsForMode`)
  return make(
    () => mode,
    (m) => Object.assign({}, m, { __colored: true })
  )
}

// 出厂默认气泡：一个 only 都没标（这就是当初「切了没反应」的那份配置）
const DEFAULT_MODS = [
  { type: 'text', tpl: '余额' },
  { type: 'balance', tpl: '{balance_ds}', size: 20 },
  { type: 'today', tpl: '今日已用 {expense_ds}' },
  { type: 'peak', tpl: '{status}' },
  { type: 'peak', tpl: '{countdown}', peakStyle: 'count' },
]

// 手标 only 的老配置（v0.5.0 的写法），行为必须原地不动
const MARKED_MODS = [
  { type: 'text', tpl: '余额' },
  { type: 'balance', tpl: '{balance_ds}', only: 'builtin' },
  { type: 'today', tpl: '今日已用 {expense_ds}', only: 'builtin' },
  { type: 'balance', tpl: '{balance}', only: 'custom' },
  { type: 'today', tpl: '今日已用 {today}', only: 'custom' },
  { type: 'peak', tpl: '{status}', only: 'builtin' },
  { type: 'peak', tpl: '{countdown}', only: 'builtin' },
]

// ---------------------------------------------------------------------------
// 增量一：气泡余额显示源切换
// ---------------------------------------------------------------------------

test('默认气泡 · 官方态：五条模块原样显示，不注入 modelId', () => {
  const out = bubbleFilter('deepseek')(DEFAULT_MODS)
  assert.equal(out.length, 5)
  assert.equal(out.filter((m) => m.type === 'balance').length, 1)
  assert.equal(out.filter((m) => m.type === 'balance')[0].modelId, undefined)
  assert.equal(out.filter((m) => m.type === 'peak').length, 2, '官方态必须留着峰谷两条')
})

test('默认气泡 · 第三方态：余额与今日已用跟随当前源，峰谷消失', () => {
  const out = bubbleFilter('api_test')(DEFAULT_MODS)
  assert.equal(out.length, 3, '文字 + 余额 + 今日已用，峰谷两条要被藏掉')
  for (const m of out.filter((x) => x.type === 'balance' || x.type === 'today')) {
    assert.equal(m.modelId, 'api_test', `${m.type} 必须挂到当前选中的源上`)
  }
  assert.equal(out.filter((m) => m.type === 'peak').length, 0)
})

test('默认气泡 · 第三方态：赠金 / 充值余额 / 时段倒计时同样隐藏', () => {
  const out = bubbleFilter('api_test')([
    { type: 'text', tpl: '余额' },
    { type: 'bonus' },
    { type: 'recharge' },
    { type: 'nextpeak' },
  ])
  assert.deepEqual(out.map((m) => m.type), ['text'], '这四类都只属于官方计价，第三方态不该出现')
})

test('显式 only 的老配置：官方态 / 第三方态都沿用 v0.5.0 行为', () => {
  const builtin = bubbleFilter('deepseek')(MARKED_MODS)
  assert.equal(builtin.length, 5)
  assert.equal(builtin.some((m) => m.only === 'custom'), false, '官方态不能出现自定义模块')

  const custom = bubbleFilter('api_test')(MARKED_MODS)
  assert.equal(custom.length, 3)
  assert.equal(custom.some((m) => m.only === 'builtin'), false, '第三方态不能出现内置模块')
  assert.equal(custom.filter((m) => m.type === 'balance')[0].modelId, 'api_test')
})

test('逃生口：显式标了 only:"custom" 的峰谷模块在第三方态保留', () => {
  const out = bubbleFilter('api_test')([{ type: 'peak', tpl: '{status}', only: 'custom' }])
  assert.equal(out.length, 1, '文档里承诺过「真要留就标 custom」，这条不能被删掉')
})

test('边界：null 原样返回、空数组不炸、只剩峰谷时输出空', () => {
  assert.equal(bubbleFilter('api_test')(null), null)
  assert.deepEqual(bubbleFilter('api_test')([]), [])
  assert.deepEqual(bubbleFilter('api_test')([{ type: 'peak' }]), [])
})

// ---------------------------------------------------------------------------
// 增量二：余额颜色自定义
// ---------------------------------------------------------------------------

test('24 种纯色：数量正确且互不重复', () => {
  const colors = pickArray('BAL_SOLID_COLORS')
  assert.equal(colors.length, 24, 'README 对外写的是 24 色，数量变了要同步改文档')
  assert.equal(new Set(colors).size, 24, '出现了重复色号')
  for (const c of colors) assert.match(c, /^#[0-9A-Fa-f]{6}$/, `色号格式不对：${c}`)
})

test('6 套流动方案：id 唯一、都有名字', () => {
  const schemes = pickArray('BAL_ANIM_SCHEMES')
  assert.equal(schemes.length, 6, 'README 对外写的是 6 套，数量变了要同步改文档')
  assert.equal(new Set(schemes.map((s) => s.id)).size, 6, 'id 重复了')
  for (const s of schemes) {
    assert.ok(s.id && s.name, `方案缺字段：${JSON.stringify(s)}`)
  }
})

test('颜色是「点一下立刻生效」的：调色面板与重绘函数都还在', () => {
  for (const fn of ['balColorOf', 'balColorGet', 'balColorSet', 'balColorOpen', 'balColorClose', 'balColorRepaint']) {
    assert.notEqual(WIDGET.indexOf(`function ${fn}(`), -1, `缺少 ${fn}() —— 颜色功能被覆盖了`)
  }
})

// ---------------------------------------------------------------------------
// 增量三：一键重载页面（Windows 桌面端没有菜单栏，Ctrl+R 收不到）
// ---------------------------------------------------------------------------

test('菜单三行入口与重载动作都还在', () => {
  for (const label of ['气泡余额', '余额颜色', '重载页面', '重新加载']) {
    assert.ok(WIDGET.includes(label), `菜单文案「${label}」不见了`)
  }
  assert.ok(WIDGET.includes('location.reload()'), '「重载页面」的落地动作不见了')
})

test('本地存储键没被改名（改名等于用户配置全丢）', () => {
  for (const key of ['dshw-bal-mode', 'dshw-bal-color']) {
    assert.ok(WIDGET.includes(key), `localStorage 键 ${key} 不见了`)
  }
})

test('余额占位符别名：{balance_ds} 在自定义模型下等同 {balance}', () => {
  assert.match(
    WIDGET,
    /map\['balance_ds'\]\s*=\s*map\['balance'\]/,
    '少了这行，tpl 写 {balance_ds} 的模块就永远读官方余额'
  )
})

// ---------------------------------------------------------------------------
// 合并上游时用来定位的锚点，以及包身份一致性
// ---------------------------------------------------------------------------

test('二改标记不少于 6 处（合并上游时的定位锚点）', () => {
  const n = (WIDGET.match(/\/\/ 二改/g) || []).length
  assert.ok(n >= 6, `// 二改 标记只剩 ${n} 处，说明有改动被覆盖或标记被清掉了`)
})

test('包身份三处一致：package.json / patch 声明 / 挂载文件', () => {
  assert.equal(PKG.name, 'dsh-whale-widget', '包名是插件身份，改了会被当成另一个插件')
  assert.match(String(PKG.version), /^\d+\.\d+\.\d+/, `version 不是 semver：${PKG.version}`)
  assert.ok(PKG.dsh && PKG.dsh.bundle && PKG.dsh.bundle.patch, 'package.json 缺少 dsh.bundle.patch')

  const patchRel = PKG.dsh.bundle.patch.replace(/^\.\//, '')
  const patchPath = path.join(ROOT, patchRel)
  assert.ok(fs.existsSync(patchPath), `挂载声明文件不存在：${patchRel}`)

  const declared = (fs.readFileSync(patchPath, 'utf8').match(/^\s*name:\s*(.+)$/m) || [])[1]
  assert.equal(declared && declared.trim(), PKG.name, 'patch 里声明的 name 与 package.json 不一致')
})
