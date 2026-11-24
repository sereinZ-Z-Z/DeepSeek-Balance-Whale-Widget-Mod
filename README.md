# DeepSeek-Balance-Whale-Widget —— 二改

DeepSeek Harness（DSH）右下角那只小鲸鱼，我给它加了点自己想要的东西。

> **本仓库**：[sereinZ-Z-Z / DeepSeek-Balance-Whale-Widget-Mod](https://github.com/sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod)
> **这是一份二改（衍生）版本。**
> 原项目：[**MeteorNOX / DeepSeek-Balance-Whale-Widget**](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget)
> 本仓库是在原作者 **v0.4.2** 源码的基础上修改而来：**只改了前端挂件脚本 `assets/whale-widget.js`**，
> 宿主侧（`lib/`）、接口、安全栅栏、泡泡系统等一律没动。
> 版权归原作者所有，按 **MIT** 许可分发。**感谢原作者做出这么好用的挂件**，尤其是那套模块化泡泡系统，
> 才让下面这些改动能用几十行接上去，而不是重写一遍。

---

## 我加了什么

| # | 功能 | 说明 |
|---|---|---|
| 1 | **气泡余额显示源切换** | 气泡里显示「内置 DeepSeek 官方余额」还是「第三方 API（中转站）余额」，菜单里点一下循环切换。切到第三方时，**峰谷 / 峰谷倒计时模块自动隐藏**（中转站不分时段，留着没意义） |
| 2 | **余额颜色自定义** | 菜单「余额颜色」打开调色面板：**24 种纯色 + 6 种流动渐变**（马卡龙炫彩、靛蓝夜曲、极光幻彩、日落橙霞、薄荷汽水、银河星紫）。点一下即时生效，面板不关，可以连着试 |
| 3 | **一键重载页面** | 菜单「重载页面 → 重新加载」。DSH 桌面版（Windows）没有菜单栏，`Ctrl+R` / `Ctrl+F5` 都收不到，改完插件代码只能靠这个刷新 |

顺带修掉的问题：

- 点色块「完全没反应」——面板在 `pointerdown` 阶段就被菜单的外部点击处理器连带拆掉，色块的 `click` 永远收不到。现在面板内的点击不算外部点击，且选色在 `pointerdown` 阶段就落地。
- 窄窗口下调色面板右半列（流动渐变）被裁掉——面板宽度改成 `min(342px, calc(100vw - 16px))`，两栏自动换行。
- 颜色「炫彩」不是出厂效果——插件里 `rgb` 非空就会挂上 `dshwvRainbow` 流动动画（`.dshwv-trow.dshwv-rgb` 基类自带），想要静止必须 `rgb` 留空、只用 `color`。默认值已按此设定。

## 怎么用

点鲸鱼旁边的菜单按钮，主菜单里多了三行：

| 菜单行 | 操作 |
|---|---|
| **气泡余额** | 点右侧按钮循环切换：`DeepSeek 官方 → 第三方模型名 → …` |
| **余额颜色** | 点右侧按钮弹出调色面板（左 24 纯色 / 右 6 流动），点色块即时生效 |
| **重载页面** | 点「重新加载」= 刷新页面（等于 `F12` → `location.reload()`） |

选择记在浏览器 `localStorage`：

- `dshw-bal-mode`：显示哪个余额源（`deepseek` 或第三方模型 id）
- `dshw-bal-color`：颜色，格式 `solid:#rrggbb` 或 `anim:macaron`

刷新后仍然记得；引用的模型被删掉会自动回落官方，不会卡在 `--`。

## 泡泡配置里要写什么（重要）

显示源切换靠模块上的一个可选字段 **`only`**：

```json
{
  "type": "balance", "tpl": "{balance_ds}", "only": "builtin"   // 只在「官方」时显示
}
{
  "type": "balance", "tpl": "{balance}", "modelId": "api_xxx", "only": "custom"  // 只在第三方时显示
}
```

- `only: "builtin"` → 只在显示官方余额时出现（峰谷 / 峰谷倒计时也用这个）
- `only: "custom"` → 只在显示第三方余额时出现，渲染前会把 `modelId` 换成当前选中的模型
- **不带 `only`** → 两种状态都显示（兼容原版配置，不会因为你没改配置就变空白）

配置文件位置：`~/.dsh/.dshw-bubble.json`（Windows：`%USERPROFILE%\.dsh\.dshw-bubble.json`）。

## 安装

本仓库是标准 DSH bundle 插件，安装方式与原项目一致：

```bash
# Web profile（CLI 支持）
dsh plugin --profile web add link:<本仓库绝对路径>

# 或直接从 GitHub 装
dsh plugin --profile web add github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod
```

**桌面端（Electron 客户端）读的是 `desktop` profile，`dsh plugin` 命令行按设计拒绝碰它** —— 桌面端怎么装、怎么手动放进 profile，请按原项目 README 的说明操作（本仓库的 `README.original.md` 就是原 README 原文，一字未改）。

> 本仓库的 `package.json` 里 `name` 仍是 `dsh-whale-widget`：它和原版是**同一个插件**，属于直接替换，不要两个同时装。

## 目录结构

```
lib/                   宿主侧（未修改）
  index.js             路由、余额请求、配置读写
  accounting.mjs       记账 / 用量统计
assets/
  whale-widget.js      前端挂件本体（二改都在这一个文件里）
  *.png *.gif *.mp3    角色、动图、音效
tools/                 原作者自带的 CI 审计脚本（未修改）
cordis.patch.yml       插件挂载声明（未修改）
README.original.md     原项目 README 原文（存档，方便对照）
```

改动集中在 `assets/whale-widget.js` 的四个位置，都带 `// 二改 ·` 注释，方便 review：

1. 菜单构建处：新增「气泡余额 / 余额颜色 / 重载页面」三行
2. `bubbleRowsTo()` 之前：显示源、颜色、模块过滤、调色面板的实现
3. `bubbleRowsTo()` 开头：`mods = bubbleModsForMode(mods)`
4. `onDocPointerDown()` 开头：面板内点击不算外部点击

## 兼容性与限制

- **只作用于 `type: 'balance'` 模块**（余额那个大数字）。「今日已用」是 `type: 'today'`，颜色不受影响。
- **只测过 Web 与 Windows 桌面端**。作者原有的 Codex 模式分支、音效、角色、吸附等功能都没动，但也没有逐个回归。
- 上游若修改了 `bubbleRowsTo` 的签名或删除 `menuRow() / menuLabel()`，合并上游版本时需要重新对一遍锚点。
- 原作者的 CI（`.github/workflows/ci.yml`）在本仓库**保持通过**：图层审计、语法、开发机路径、死设置检查均为绿。
  （注：`publish.yml` 一并保留自上游，仅手动触发且本仓库未配置 npm token，不会自动发版。）

## 致谢

- 原作者：[**MeteorNOX**](https://github.com/MeteorNOX) —— 整个挂件、泡泡系统、记账与安全设计都是他的工作；
- 原项目：[https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget)
- 以及原项目里那 40 多位贡献者：本仓库虽然只留一次提交，但功能基础是他们的。

## 许可

- **代码**：MIT，见 [`LICENSE`](LICENSE)。文件保留原作者与二改者的两行版权声明，正文为标准 MIT，未附加额外条款，以便 GitHub 正确识别为 MIT 许可。
- **美术素材**（`assets/` 下的图片 / 动图 / 音效、`icon.png`）：**不在 MIT 范围内**，随插件原样提供，说明见 [`PROVENANCE.md`](PROVENANCE.md)，该文件同样保留自原项目并追加了二改说明（衍生关系与改动范围见第五节）。
