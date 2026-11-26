# 更新记录

本仓库是 [MeteorNOX / DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget) 的二改版本，格式参照 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

每个版本都记录三件事，因为它们决定了你**该不该升级**：

1. **上游基版** —— 这一版是从原作者哪个版本改出来的；
2. **保留的增量** —— 二改加了哪几项功能，有没有哪一项被删掉或降级；
3. **修复的根因** —— 不只是「修了什么」，而是「为什么坏的」，方便你判断自己会不会踩到。

## 版本号怎么读

```
0.5.1 - mod.1
└─┬─┘   └─┬─┘
  │       └── 二改修订号：同一个功能版本下，修 bug / 调细节时 +1
  └────────── 本仓库自己的迭代号，**不跟随上游版本号**
```

要特别注意最后一点：**`0.5.x` 不是上游的 `0.5.x`**。上游基版是 `v0.4.2`，本仓库从 `0.5.0` 起编，是为了让「和二改相关的新功能」有个独立序号，避免和上游的版本号撞车造成误解。真正的对应关系看下表。

## 一览

| 本仓库版本 | 日期 | 上游基版 | 一句话 |
|---|---|---|---|
| [`0.5.1-mod.1`](#051-mod1--2026-11-26) | 2026-11-26 | `v0.4.2` | 修「切到第三方后余额和峰谷没变化」——默认气泡进入自动模式 |
| [`0.5.0-mod.1`](#050-mod1--2026-11-24) | 2026-11-24 | `v0.4.2` | 首版：显示源切换、24 色 + 6 流动渐变、一键重载 |
| [未发布](#unreleased--2026-11-26) | 2026-11-26 | — | 工程化：自检 14 条、市场截图清单、topics 扩充（不改运行行为） |

---

## [Unreleased] — 2026-11-26

工程化增量。**不改插件运行行为**，所以没有单独发版、没有新标签 —— 装了 `0.5.1-mod.1` 的人不更新也不会少任何功能。

### 新增

- **`test/fork-invariants.test.mjs`** —— 二改不变量自检，14 条断言。防的不是写错，而是**跟随上游时增量被静默覆盖**：上游每次发版整体替换 1.2 MB 的 `assets/whale-widget.js`，漏一处锚点的表现是「菜单少一行」「切了显示源没反应」，不报错、不崩，只是功能没了，人工 review 看不出来。
  - 覆盖：显示源切换的三种配置形态（默认自动 / 显式 `only` / 空值与纯峰谷边界）、24 色与 6 套流动的数量与唯一性、菜单三行入口文案、`localStorage` 键名、`{balance_ds}` 别名映射、包名与 `cordis.patch.yml` 声明一致、`// 二改` 标记数量。
  - 设计要点：**从源码里抽出函数现场求值**，不复制一份实现。复制会漂移，测试绿了线上红，比没测试更坏。断言写行为不写行号，上游重排格式不会误报。
- **`scripts.test` → `npm test`**（`node --test`，自动发现 `test/`）。0 依赖，只读文件，不需要 `npm install`。
  > 踩坑记录：`node --test test/` 在 Node 22 上会把目录当模块入口，报 `MODULE_NOT_FOUND`。用裸 `node --test` 才对。
- **`screenshots.json`** —— 市场详情页读取的截图清单，指向仓库内三张已跟踪的图（`assets/DSH2.png`、`assets/DSniang02.png`、`assets/DSniang1.png`）。图不在仓库里会显示空白。
- **CI 新增一步 `Fork self-check (二改增量)`** —— 每次 push / PR 跑 `npm test`，红了说明有增量掉了。

### 变更

- **仓库 topics 从 5 个扩到 9 个** —— 补 `cordis`、`deepseek`、`dsh-plugins`、`floating-widget`。此项属于仓库设置，不在代码里。影响的是 `dsh-plugin.org` 这类按 topic 每日扫描的目录站能不能收到本仓库。
- **`README.md`** —— 新增「自检：`npm test`」一节；目录结构补 `test/` 与 `screenshots.json`；兼容性一节说明 CI 多了这层检查。
- **`README.md` / `README.en.md`** —— 新增「配置第三方中转站」一节（中英各一份）：四步界面路径、先用 `curl` 判断站方是否开放账单接口的三档分类、OneAPI / New API 的免填项与 Base URL 不带 `/v1` 的坑、自定义 HTTP 的字段对照表（路径语法 `a.b[0].c`、乘数、请求头列表、必须勾「允许把凭据发送到自定义地址」）、无余额接口时的「事件匹配 + 自定义单价」替代方案，以及 7 条常见错误对照。此前 README 只写了配置文件位置，没有界面步骤。
- 删掉误建的空目录 `test-out`（未跟踪，无影响）。

### 已知不足

- 三张截图是**美术素材，不是功能截图**。真正能说明这版加了什么的是「右键菜单 + 调色面板」的界面实拍，尚未补。

---

## [0.5.1-mod.1] — 2026-11-26

> **上游基版**：`MeteorNOX/DeepSeek-Balance-Whale-Widget` **v0.4.2**（与 `0.5.0-mod.1` 相同，本次未跟随上游新版本）
> **发布**：[Release v0.5.1-mod.1](https://github.com/sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod/releases/tag/v0.5.1-mod.1)

### 修复

- **切到第三方余额源后，气泡里还是官方余额，峰谷和峰谷倒计时也还挂着** —— v0.5.0 最要命的一个坑，看起来像开关坏了，实际上配置没问题。
  - **根因**：v0.5.0 的显示源过滤只处理**带 `only` 标记**的泡泡模块。而出厂默认气泡（以及绝大多数没在菜单里点过「自定义泡泡 → 保存」的人用的那一套）**一个 `only` 都没有**，于是过滤函数原样返回全部模块：余额仍取官方数据，峰谷照旧显示。切了等于没切。
  - **现在的规则**：整组模块一个 `only` 都没标 → **自动模式**。`balance` / `today` 在渲染前注入当前显示源的 `modelId`；`peak` / `nextpeak` / `bonus` / `recharge` 这些**只属于官方计价**的模块（中转站上根本没有这些概念）在第三方态隐藏；切回官方一切照旧。
  - **兼容性**：组里出现**任意一个** `only`，就完全按标记走 —— 也就是 v0.5.0 那套手写规则一个字节都没变。手工改过 `~/.dsh/.dshw-bubble.json` 的人，升级前后效果一致。`only: 'custom'` 的峰谷「逃生口」（想让峰谷跟着第三方显示）依然可用。
  - **影响面**：所有用默认气泡的用户；显式写过 `only` 的配置不受影响。
- 判定了 `tpl` 其实不参与「切不切」的决策 —— 写成 `{balance_ds}` 还是 `{balance}` 都能出数（源码里 `map['balance_ds'] = map['balance']`），真正起作用的是 `only` / `modelId`。README 里原本容易让人改错地方的表述已更正。

### 保留的增量（3 项，全部在）

| # | 功能 | 状态 |
|---|---|---|
| 1 | 气泡余额显示源切换（官方 ⟷ 第三方） | ✅ 本版修好，默认气泡开箱即用 |
| 2 | 余额颜色自定义（24 纯色 + 6 流动渐变） | ✅ 未改动 |
| 3 | 一键重载页面 | ✅ 未改动 |

### 变更

- 代码改动只落在 `assets/whale-widget.js` 的 `bubbleModsForMode()` 一处（同一次提交另含 `README.md` 与 `package.json` 的版本号）；宿主侧 `lib/`、接口、安全栅栏、`cordis.patch.yml` 依然没动。
- 版本号 `0.5.1-mod.1`，包名仍为 `dsh-whale-widget`，属于**覆盖升级**，不需要先卸载。

### 升级方式

```powershell
# Web（dsh web）
dsh plugin --profile web add github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod#v0.5.1-mod.1

# 桌面端：不能用命令行，在会话里让 DSH 用内置 plugin_manager 更新到同一来源
```

装完**完全退出客户端（含系统托盘）再打开**；网页版重启 `dsh web` 后 `Ctrl+F5`。详见 [README 安装章节](README.md#安装)。

---

## [0.5.0-mod.1] — 2026-11-24

> **上游基版**：`MeteorNOX/DeepSeek-Balance-Whale-Widget` **v0.4.2**
> **发布**：[Release v0.5.0-mod.1](https://github.com/sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod/releases/tag/v0.5.0-mod.1)

### 新增

- **气泡余额显示源切换** —— 菜单「气泡余额」右侧按钮循环切换：`DeepSeek 官方 → 第三方模型名 → …`。选择存在 `localStorage` 的 `dshw-bal-mode`，刷新后仍记得；引用的模型被删掉会自动回落官方，不会卡在 `--`。
- **余额颜色自定义** —— 菜单「余额颜色」打开调色面板，左栏 24 种纯色、右栏 6 套流动渐变（马卡龙炫彩、靛蓝夜曲、极光幻彩、日落橙霞、薄荷汽水、银河星紫）。点色块即时生效、面板不关，可以连着试。选择存在 `dshw-bal-color`，格式 `solid:#rrggbb` 或 `anim:macaron`。
- **一键重载页面** —— 菜单「重载页面 → 重新加载」。DSH 桌面版（Windows）没有菜单栏，`Ctrl+R` / `Ctrl+F5` 都收不到，改完插件代码只能靠这个刷新（等价于 `F12` 里敲 `location.reload()`）。

### 修复（自研过程中踩的坑，首版一并解决）

- **点色块「完全没反应」** —— 面板在 `pointerdown` 阶段就被菜单的外部点击处理器连带拆掉，色块的 `click` 永远收不到。现在面板内的点击不算外部点击（`onDocPointerDown()` 开头加判定），且选色在 `pointerdown` 阶段就落地，不等 `click`。
- **窄窗口下调色面板右半列被裁掉** —— 面板宽度改为 `min(342px, calc(100vw - 16px))`，两栏自动换行。
- **颜色「炫彩」不是出厂效果** —— 插件里 `rgb` 非空就会挂上 `dshwvRainbow` 流动动画（`.dshwv-trow.dshwv-rgb` 基类自带），想要静止必须 `rgb` 留空、只用 `color`。默认值已按此设定。

### 未改动

`lib/`（路由、余额请求、配置读写、记账）、`tools/`（原作者 CI 审计脚本）、`cordis.patch.yml`、接口与安全栅栏 —— 全部原样。改动只在 `assets/whale-widget.js`，四个位置，都带 `// 二改 ·` 注释。

---

## 与上游的关系

- 上游 `v0.4.2` 之后的改动，本仓库**没有合并**。要跟进得手动对锚点，步骤见下。
- 本仓库**没有发布到 npm**，安装源只有 `github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod`。
- 包名 `dsh-whale-widget` 与上游相同，属**替换安装**，两者不能共存。
- 上游的 `publish.yml` 原样保留，但仅手动触发且本仓库未配 npm token，不会自动发版。

## 合并上游新版本时怎么做

`assets/whale-widget.js` 是单文件，上游发版往往整体替换。照着走，别跳步：

1. `git remote add upstream https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget.git && git fetch upstream`
2. 先只更新与二改无关的部分，跑 `npm test` —— 应当全绿；红了就说明这一版动了二改的锚点，先看清楚红的是哪条。
3. 若红了，按报错里的函数名去 `assets/whale-widget.js` 找回来：`bubbleModsForMode()`、`bubbleRowsTo()`、菜单构建处、`onDocPointerDown()`、`BAL_SOLID_COLORS` / `BAL_ANIM_SCHEMES`。
4. 手动回归四项，`npm test` 覆盖不到：切到第三方后峰谷消失、24 色都能点、面板在窄窗口不裁、菜单「重载页面」能刷。
5. 改完发版：`X.Y.Z-mod.N`，本文件加一条，写清**上游基版号**和这次保留了哪几项增量。

---

[Unreleased]: https://github.com/sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod/compare/v0.5.1-mod.1...HEAD
[0.5.1-mod.1]: https://github.com/sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod/compare/v0.5.0-mod.1...v0.5.1-mod.1
[0.5.0-mod.1]: https://github.com/sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod/releases/tag/v0.5.0-mod.1
