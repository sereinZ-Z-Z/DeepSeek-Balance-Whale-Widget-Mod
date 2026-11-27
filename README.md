# DeepSeek-Balance-Whale-Widget —— 二改

**简体中文** · [English](README.en.md)

DeepSeek Harness（DSH）右下角那只小鲸鱼，我给它加了点自己想要的东西。

> **本仓库**：[sereinZ-Z-Z / DeepSeek-Balance-Whale-Widget-Mod](https://github.com/sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod)
> **这是一份二改（衍生）版本。**
> 原项目：[**MeteorNOX / DeepSeek-Balance-Whale-Widget**](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget)
> 本仓库是在原作者 **v0.4.2** 源码的基础上修改而来：**只改了前端挂件脚本 `assets/whale-widget.js`**，
> 宿主侧（`lib/`）、接口、安全栅栏、泡泡系统等一律没动。
> 版权归原作者所有，按 **MIT** 许可分发。**感谢原作者做出这么好用的挂件**，尤其是那套模块化泡泡系统，
> 才让下面这些改动能用几十行接上去，而不是重写一遍。

> **装之前先看这句**：npm 上的 `dsh-whale-widget` 是**原版**（`0.4.2`），本仓库从未发布到 npm。
> `dsh plugin add dsh-whale-widget` 只写包名，装到的一定是原版；要装这份二改版，用
> `github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod`。细节见 [安装](#安装)。

---

## 我加了什么

| # | 功能 | 说明 |
|---|---|---|
| 1 | **气泡余额显示源切换** | 气泡里显示「内置 DeepSeek 官方余额」还是「第三方 API（中转站）余额」，菜单里点一下循环切换。**v0.5.1 起开箱即用**：出厂默认气泡、或者你从没改过泡泡配置，切到第三方时余额和「今日已用」会自动换成中转站的数，峰谷 / 峰谷倒计时 / 赠金 / 充值余额这些只属于官方的模块自动隐藏，**不用手改 JSON** |
| 2 | **余额颜色自定义** | 菜单「余额颜色」打开调色面板：**24 种纯色 + 6 种流动渐变**（马卡龙炫彩、靛蓝夜曲、极光幻彩、日落橙霞、薄荷汽水、银河星紫）。点一下即时生效，面板不关，可以连着试 |
| 3 | **一键重载页面** | 菜单「重载页面 → 重新加载」。DSH 桌面版（Windows）没有菜单栏，`Ctrl+R` / `Ctrl+F5` 都收不到，改完插件代码只能靠这个刷新 |

顺带修掉的问题：

- **切换显示源「没反应」**（v0.5.1）—— 老版本只把带 `only` 标记的模块切成中转站数据，而出厂默认气泡一个标记都没有，所以切了等于没切：上面还是官方余额，下面还挂着峰谷。现在没标记的整组模块按「切到谁就显示谁」自动处理；有标记的配置（v0.5.0 那套手写规则）行为一字不变。
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

## 配置第三方中转站

气泡里能选的「第三方余额」不是一个单独的设置项，而是**模型列表里的一个模型**。所以顺序是：先加模型，再在菜单「气泡余额」里选它。

### 四步

1. 打开鲸鱼菜单 → 底部「**- = 小鲸鱼记账 = -**」；
2. 面板里「**模型（提醒 / 预算 / 额度）**」→「**+ 添加模型（自定义 API）**」；
3. 厂商模板选「**OpenAI 兼容中转站**」（OneAPI / New API 系）或「**自定义 HTTP**」，填名称、Base URL、API key、凭据名；
4. 保存 → 列表里出现该模型 → 点它右边的「设置」→ 子菜单底部「**密钥 / 接口**」→「**测试连通性**」→ 回菜单「气泡余额」切到它。

> 「测试连通性」只在**保存之后**的编辑表单里有，新增表单上没有这个按钮。

密钥存在 DSH 官方凭据里（`~/.dsh/.credentials.yaml`），`~/.dsh/.dshw-api.json` 只记凭据名，**不存明文**。「凭据名」只能字母、数字、下划线（≤64 字符），写 `MY-RELAY-KEY` 会保存失败。

### 先判断：你的站到底给不给余额

拿 key 直接问接口，比在面板里反复试快得多：

```powershell
curl -s -H "Authorization: Bearer sk-你的key" https://你的站/v1/dashboard/billing/subscription
```

| 返回 | 属于哪一档 | 看哪节 |
|---|---|---|
| JSON 里有 `hard_limit_usd` / `soft_limit_usd` | OneAPI / New API 系，账单接口开着 | 「一」 |
| 404 / 401 / HTML 首页 / `{"error":…}` | 站方关掉了账单接口，或者有自己的接口 | 「二」 |
| 怎么都找不到余额相关的返回 | 完全不开放余额 | 「三」 |

### 一、OneAPI / New API 系（最省事）

模板已经预置了两段接口：`{base}/v1/dashboard/billing/subscription`（总额度）和 `.../usage`（已用），余额由两者相减。所以**余额字段、总量字段、已用字段、数值乘数这四个不用填**，留空即用模板默认值。

- **Base URL** 填站点根地址，例如 `https://api.example.com` —— **不要带 `/v1`**，模板自己会拼成 `/v1/dashboard/...`，填了会变成 `/v1/v1/...` 直接 404。末尾斜杠会自动去掉。
- **币种**：这类接口的额度单位是美元，一般保持 `USD`；如果你的站把人民币数值塞进 `hard_limit_usd`，改成 `CNY`（数字不变，只换符号）。
- 保存后进「密钥 / 接口」点「测试连通性」确认。

### 二、站点有自己的余额接口 → 选「自定义 HTTP」

先抓到一次真实返回：浏览器 F12 → Network，在站点的「钱包 / 额度」页面刷新，找到返回余额的那个请求，把 **URL、请求头、返回 JSON** 三样抄下来，再对着填：

| 面板字段 | 填什么 | 例子 |
|---|---|---|
| 余额接口 | 完整 URL，可用 `{base}` 占位，也可在 URL 里写 `{key}` | `{base}/api/user/self` |
| 请求头 | `头名:值` 列表，`{key}` 替换成密钥，多个头用英文分号分隔；不写头名时按 `Authorization` 处理 | `Authorization: Bearer {key}`；`x-api-key:{key};anthropic-version:2023-06-01` |
| 请求方法 / 请求体 / 请求参数 | 默认 GET，非 GET 时填；请求体支持 `{key}`、`{base}` 和自定义参数 | `POST` + `{"uuid":"{uuid}"}` + `uuid=abc123` |
| 余额字段 | 余额在 JSON 里的路径，数组用 `[0]` | `data.balance`、`balance_infos[0].total_balance` |
| 总量字段 / 已用字段 | 只给总额和已用时填这两个，余额 = 总量 − 已用 | `data.total` / `data.used` |
| 数值乘数 | 返回值到「元」的换算，统一乘 | 分→元填 `0.01`；单位 1e-4 填 `0.0001` |

**必须勾**「允许把凭据发送到自定义地址」。地址不是内置端点时，插件默认拒绝把密钥发出去，不勾就会一直报「已拒绝把凭据发出去……」。这个开关只能由**本机**来源的写请求置位，远端会话改不了它。

### 三、站方没有余额接口

不用折腾，把「余额接口」留空即可（模板选「自定义 HTTP」也行）：余额显示 `—`，「今日已用」按**本机会话事件**估算，记账照常。

想让估算准一点，补两个可选字段：

- **事件匹配**：会话事件里模型名的关键字，逗号分隔（如 `deepseek,gpt-4o`）。插件靠它把每轮消耗归到这个模型；不填的话「今日已用」会一直是 0。
- **单价**（缓存命中 / 未命中输入 / 输出，单位「币种 / 百万 token」）：填了就不再用内置价目表，记账金额更贴近账单。币种选美元时记得填汇率，账本统一按人民币结算。

### 气泡里想直接看这个模型的余额

两条路，按需要选：

- **切显示源**：菜单「气泡余额」→ 选模型名。v0.5.1 起默认气泡会自动把「余额」「今日已用」换成它的数，峰谷那组自动隐藏。
- **单独加一个模块**：「自定义泡泡」的调色板里，每个自定义模型都有一个「**余额·模型名**」色块，点一下或拖进气泡即可。适合官方和第三方**同时**显示。

### 常见错误

| 现象 | 原因 | 怎么办 |
|---|---|---|
| 保存报「凭据名只能包含字母、数字与下划线」 | 凭据名写了横杠或中文 | 改成 `MY_RELAY_KEY` 这种 |
| 余额一直 `—`，但「测试连通性」通过 | 探活只验证「接口能通、能拿到 JSON」（优先用模板的 `probeUrl`，没有就用余额接口），**不校验字段路径** | 按「二」核对余额字段 / 总量字段的 JSON 路径 |
| 余额接口 404 | Base URL 带了 `/v1` | 去掉，只留站点根地址 |
| 报「接口返回里没找到配置的字段（检查 JSON 路径）」 | 路径写错，或该层是数组 | 数组用 `[0]`，如 `data[0].balance` |
| 余额数值差 100 倍 | 接口单位是「分」 | 数值乘数填 `0.01` |
| 报「已拒绝把凭据发出去」 | 没勾允许发往自定义地址 | 在本机面板勾上后重试 |
| 切到该模型后气泡还是官方余额 | 插件版本低于 v0.5.1 | 升级；旧版要按「泡泡配置」手标 `only` |

## 泡泡配置（v0.5.1 起默认不用改）

**开箱即用**。切到第三方后气泡里应该只剩「余额」和「今日已用」两行数字（数值换成中转站的），峰谷那一块消失。如果确实如此，本节可以直接跳过。

它的规则是：**整组模块一个 `only` 都没标时，进入自动模式**——余额 / 今日已用自动跟随当前显示源，峰谷 / 峰谷倒计时 / 赠金 / 充值余额这些只属于官方计价的模块在第三方态隐藏。

想精细控制（比如官方和第三方两个余额**同时**显示），再给模块加 `only` 字段。只要组里出现任意一个 `only`，就完全按标记来，自动模式让位：

```json
{ "type": "balance", "tpl": "{balance_ds}", "only": "builtin" }   // 只在「官方」时显示
{ "type": "balance", "tpl": "{balance}",    "only": "custom"  }   // 只在第三方时显示
{ "type": "peak",    "tpl": "{status}",     "only": "builtin" }   // 峰谷同理
```

- `only: "builtin"` → 只在显示官方余额时出现
- `only: "custom"` → 只在显示第三方余额时出现，渲染前会把 `modelId` 换成当前选中的模型
- **不带 `only`** → 官方态照常显示；第三方态按上面的自动规则处理

> `tpl` 写 `{balance_ds}` 还是 `{balance}` 都行：模块一旦有了 `modelId`，两个占位符都会取该模型的数据（源码里 `map['balance_ds'] = map['balance']`）。真正决定"切不切"的是 `only` / `modelId`，不是 `tpl`。

配置文件位置：`~/.dsh/.dshw-bubble.json`（Windows：`%USERPROFILE%\.dsh\.dshw-bubble.json`）。
这个文件**只有你在菜单「自定义泡泡」里点过一次保存才会生成**；没有它时插件用出厂默认气泡，正好就是自动模式覆盖的场景。桌面端和网页端各存一份，两边都要改。

### 更新记录

完整记录（每版的上游基版、保留的增量、修复根因，以及合并上游的步骤）见 [`CHANGELOG.md`](CHANGELOG.md)。

| 版本 | 变更 |
|---|---|
| `v0.5.1-mod.1` | 修「切到第三方后余额/峰谷没变」：无 `only` 标记的模块进入自动模式；峰谷、赠金、充值余额在第三方态一律隐藏 |
| `v0.5.0-mod.1` | 首版：显示源切换、余额颜色（24 纯色 + 6 流动）、一键重载页面 |

## 安装

> **一句话**：**桌面客户端（Electron）不能用命令行装**，要在会话里让 DSH 自己装；只有 `dsh web` 才用 `dsh plugin`。
> 两者读的是**不同 profile**（桌面 = `desktop`，网页 = `web`），装错了的表现就是「右下角什么都没有、连 ☰ 也没有、控制台还不报错」。

本仓库的 `package.json` 里 **`name` 仍是 `dsh-whale-widget`**，和原版是同一个插件身份：

- 属于**直接替换**，不能和原版同时安装；
- 装之前如果已经装过原版（`github:MeteorNOX/DeepSeek-Balance-Whale-Widget`，或 npm 上的 `dsh-whale-widget`），先卸载；
- 卸载**不会**删你的数据：泡泡配置、API 配置、记账账本全在 `~/.dsh/` 下，跟插件安装目录无关。

> ⚠️ **别拿包名去装，那样装到的是原版。**
> npm 上的 `dsh-whale-widget` 属于原作者（latest `0.4.2`，2026-11-05），本仓库的版本**从未发布到 npm**。
> 所以 `dsh plugin add dsh-whale-widget`（只写包名、不带来源）拿到的一定是**原版**，二改功能一个都没有 ——
> 而且它装得上、跑得起来、不报错，你只会觉得「怎么跟我看到的不一样」。
> 装本仓库只认这三种来源写法：`github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod`（可加 `#v0.5.1-mod.1` 锁版本）、`link:<本地目录>`、`file:<本地目录>`。

### 第 0 步：先确认你在哪种宿主里用

| 你在哪看到小鲸鱼 | 宿主 | 读哪个 profile | 怎么装 |
|---|---|---|---|
| 桌面应用窗口（官方 Electron 客户端） | desktop | `%USERPROFILE%\.dsh\profiles\desktop` | 在会话里让 DSH 用内置 `plugin_manager` 装（见「一」） |
| 浏览器里的 `dsh web` 页面 | web | `%USERPROFILE%\.dsh\profiles\web` | `dsh plugin --profile web add …`（见「二」） |

### 一、官方桌面客户端（Electron）

`dsh plugin` 命令行**按设计拒绝**操作用户的 desktop profile：

```
error: profile "desktop" is managed exclusively by the Electron application
```

所以**不要**照着网页版命令装。按 `--profile web` 装完，插件落在 `web` profile 里，而桌面窗口读的是 `desktop`，一个字也读不到 —— 而且控制台不报错，很难自己发现。

**正确做法**：在桌面客户端的会话里，把下面这段直接发给 DSH。

```text
请使用当前桌面端内置的 plugin_manager 安装 dsh-whale-widget，
来源是 github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod

安装前请先核对：
1. 当前 profile 是不是 desktop；
2. 是否已经装了同名插件 dsh-whale-widget（很可能是 MeteorNOX 原版）。
   如果已装，报告它的来源与版本，然后替换成上面的来源。
   注意两者包名相同，属于替换安装，不能共存。

按该工具支持的操作装完后，告诉我安装结果，以及是否需要重启。
不要自行构造认证 cookie、调用底层 RPC，也不要手改宿主管理的 profile 文件。
```

几点说明：

- `plugin_manager` 的作用域就是当前 profile（桌面端为 `desktop`），由宿主用自带的包管理器完成安装与挂载登记，不需要你开终端。
- 安装规格的写法和 `dsh plugin` 一致：`github:<用户>/<仓库>`、`link:<本地目录>`、`<包名>@<版本>`。具体支持到哪一步以工具实际返回为准。
- 想固定版本：GitHub 源可以带 ref 锁到某个标签，例如 `github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod#v0.5.1-mod.1`；不带 ref 就跟 `main`。本仓库**没有发布到 npm**（npm 上的 `dsh-whale-widget` 是原版 `0.4.2`），所以 `dsh-whale-widget@0.5.1-mod.1` 这种写法在这里用不上；写成裸包名 `dsh-whale-widget` 只会装回原版。
- 工具不可用、或它不支持你要做的操作时，先让 DSH 说明缺哪项宿主能力，**不要**绕过限制改用 `--profile web`。

**装完要重启**：工具可能返回 `"application":"applied"`，但这不代表当前窗口已经渲染出挂件。若右下角没东西，**完全退出客户端（含系统托盘）再打开**。

**两条自检**，用来区分「没装到位」和「装了但没渲染」：

| 半区 | 检查什么 |
|---|---|
| 宿主半区 | `%USERPROFILE%\.dsh\.dshw-turn.json` 存在，且 `seq` 随对话递增 |
| 客户端半区 | `%APPDATA%\@deepseek-ai\dsh-desktop\Local Storage\leveldb` 里出现 `dshw-pos` / `dshw-last-seq`（这两个键**只有挂件前端**会写） |

桌面端界面里看不到版本号时，翻 `%USERPROFILE%\.dsh\profiles\desktop\package.json` 的 `dsh.profile.bundles`，以及同目录的 `pnpm-lock.yaml`。

### 二、网页版（`dsh web`）

#### 方式 A：直接从 GitHub 安装（最省事）

```powershell
# 1) 装过原版先卸载 —— 同一个包名，不卸会冲突
dsh plugin --profile web remove dsh-whale-widget

# 2) 从本仓库安装
dsh plugin --profile web add github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod

# 3) 重启 dsh web，再在浏览器按 Ctrl+F5
```

装完插件会出现在 DSH 的**插件管理页面**里，之后可以直接在页面里更新，不用再敲命令。

#### 方式 B：装本地目录（想改代码 / 没网络）

```powershell
# 目录里必须有这几样，缺 assets/ 会没图没声
Test-Path "D:\Plugins\DeepSeek-Balance-Whale-Widget-Mod\package.json",
          "D:\Plugins\DeepSeek-Balance-Whale-Widget-Mod\lib\index.js",
          "D:\Plugins\DeepSeek-Balance-Whale-Widget-Mod\assets\whale-widget.js"

# 装过原版先卸载
dsh plugin --profile web remove dsh-whale-widget

# 用绝对路径安装（路径含空格要加引号）
dsh plugin --profile web add link:D:\Plugins\DeepSeek-Balance-Whale-Widget-Mod
```

- `link:` 是**软链安装**：源目录改了立即生效；但装完**不能移动或重命名该目录**，移动了要重新 `add` 一次。
- 想要一份独立副本、之后互不同步，就把 `link:` 换成 `file:`。
- 在仓库根目录里也可以直接 `dsh plugin --profile web add link:.` —— **仓库根目录本身就是插件包**，不要写成 `link:.\dsh-whale-widget`（没有这个子目录，那样会装成普通依赖）。
- 解压目录要放在**固定位置**（如 `D:\Plugins\…`），不要放下载目录或临时目录。

#### 网络需要代理时

先设环境变量再执行安装，否则 `github:` 拉取会 `Failed to fetch`：

```powershell
$env:http_proxy="http://127.0.0.1:7890"
$env:https_proxy="http://127.0.0.1:7890"
$env:all_proxy="socks5://127.0.0.1:7890"
dsh plugin --profile web add github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod
```

### 三、装完验证

网页版（默认端口 3080，跟你实际启动参数为准）：

```powershell
# 插件是否登记进 bundles
dsh --profile web --dump-config | Select-String "whale"

# 三个接口应全部 200
curl http://127.0.0.1:3080/dsh-whale/balance.json   # 含 totalBalance 的 JSON
curl http://127.0.0.1:3080/dsh-whale/widget.js      # 前端脚本
curl "http://127.0.0.1:3080/dsh-whale/audio-fragment.wav?id=exp_orb"   # 音效，404 说明 assets/ 不全
```

桌面端就按上一节的两条自检看，不看端口。

### 四、卸载 / 换回原版

```powershell
# 网页版
dsh plugin --profile web remove dsh-whale-widget

# 换回原版
dsh plugin --profile web add github:MeteorNOX/DeepSeek-Balance-Whale-Widget
```

桌面端同样是在会话里让 DSH 用 `plugin_manager` 卸载 / 换源，不要手删 profile 目录。卸载后 `~/.dsh/` 下的配置和账本都还在，重新装回来即可继续用。

### 五、装不上怎么排查

| 症状 | 原因 | 怎么办 |
|---|---|---|
| 桌面端右下角空白，**连 ☰ 都没有**，控制台无报错 | 装进了 `web` profile，桌面读的是 `desktop` | 用 `plugin_manager` 重装到 desktop，别用 `--profile web` |
| 报 `profile "desktop" is managed exclusively by the Electron application` | 这是设计如此，不是 bug | 同上，改用 `plugin_manager` |
| 菜单能打开，但那三行（气泡余额 / 余额颜色 / 重载页面）**一个都没有** | 两种原因，先查来源：**裸包名装成了原版 `0.4.2`**；来源没问题则是前端脚本是旧的（缓存）或换了目录没重启宿主 | 如果装的是 `add dsh-whale-widget`，`remove` 后按 `github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod` 重装；来源没问题就桌面端完全退出（含托盘）重开、网页版重启 `dsh web` + `Ctrl+F5`，或用菜单里的「重载页面」 |
| 只看到 `exit 1` / `pnpm failed` | 汇总错误，不能据此判断是代码问题 | 先看 `.plugin-manager/logs/operation-*/pnpm.log` 和 `hub.log` 里**最早的底层报错** |
| 提示找不到 pnpm | 宿主自带的包管理器和终端 PATH 里的不是同一个 | 先报告宿主用的 pnpm 路径与版本，按该 DSH 版本的安装说明处理，别急着重装插件 |
| `ERR_PNPM_ADDING_TO_ROOT` | 依赖被加到了 profile 根而不是插件 | 清掉多出来的依赖后重装，不要手改 `package.json` |
| 余额显示 `--` / 「未配置」 | 凭据没配，或账号没登录 | 见「六、装完还要配什么」 |
| 版本混乱 / 两个来源并存 | 先用 `remove` 清掉再 `add` 一次 | 见「四」 |

### 六、装完还要配什么

1. **余额从哪来**：内置 DeepSeek 官方余额靠 `DEEPSEEK_API_KEY`（或在 DSH 里登录 DeepSeek 账号，较新版本不配 key 也能取）；第三方中转站在菜单里「+ 添加模型（自定义 API）」加进来，完整步骤与字段说明见上文「[配置第三方中转站](#配置第三方中转站)」。注册表落在 `~/.dsh/.dshw-api.json`，密钥存 DSH 凭据，不落明文。
2. **泡泡配置**：装完就能用，不用改。切到第三方后如果余额没变、峰谷还挂着，先确认版本是 `v0.5.1-mod.1` 以上（旧版要手标 `only`），再看上面「泡泡配置」一节。
3. **插件更新后**：本仓库若合并了上游新版本，`assets/whale-widget.js` 里带 `// 二改 ·` 的几处需要重新对锚点，否则新菜单可能不出现。

## 目录结构

```
lib/                   宿主侧（未修改）
  index.js             路由、余额请求、配置读写
  accounting.mjs       记账 / 用量统计
assets/
  whale-widget.js      前端挂件本体（二改都在这一个文件里）
  *.png *.gif *.mp3    角色、动图、音效
tools/                 原作者自带的 CI 审计脚本（未修改）
test/                  二改不变量自检（`npm test`，14 条断言）
screenshots.json       市场详情页用的截图清单
cordis.patch.yml       插件挂载声明（未修改）
README.original.md     原项目 README 原文（存档，方便对照）
README.en.md           英文版说明
CHANGELOG.md           版本记录（上游基版 / 保留增量 / 修复根因）
```

改动集中在 `assets/whale-widget.js` 的四个位置，都带 `// 二改 ·` 注释，方便 review：

1. 菜单构建处：新增「气泡余额 / 余额颜色 / 重载页面」三行
2. `bubbleRowsTo()` 之前：显示源、颜色、模块过滤（v0.5.1 的自动模式就在 `bubbleModsForMode()` 里）、调色面板的实现
3. `bubbleRowsTo()` 开头：`mods = bubbleModsForMode(mods)`
4. `onDocPointerDown()` 开头：面板内点击不算外部点击

## 自检：`npm test`

二改份最怕的不是写错，是**跟随上游时改动被悄悄覆盖**——上游每次发版整体替换 `assets/whale-widget.js`，漏一处锚点的表现是「菜单少一行」「切了显示源没反应」，不报错、不崩，只是功能没了。

`test/fork-invariants.test.mjs` 就是防这个的，14 条断言覆盖：显示源切换的三种配置形态（默认自动 / 显式标记 / 边界）、24 色与 6 套流动的数量与唯一性、菜单三行入口、`localStorage` 键名、`{balance_ds}` 别名、二改标记数量、包名与 patch 声明一致性。

它**从源码里抽出函数现场求值**，不复制实现，所以实现改了测试会跟着走；断言写行为不写行号，上游重排格式不会误报。0 依赖、只读文件：

```bash
npm test
```

CI 每次 push 都会跑这一步，红了就说明有增量掉了，按报错里的函数名去 `assets/whale-widget.js` 里找回来即可。

## 兼容性与限制

- **只作用于 `type: 'balance'` 模块**（余额那个大数字）。「今日已用」是 `type: 'today'`，颜色不受影响。
- **只测过 Web 与 Windows 桌面端**。作者原有的 Codex 模式分支、音效、角色、吸附等功能都没动，但也没有逐个回归。
- 上游若修改了 `bubbleRowsTo` 的签名或删除 `menuRow() / menuLabel()`，合并上游版本时需要重新对一遍锚点。
- 原作者的 CI（`.github/workflows/ci.yml`）在本仓库**保持通过**：图层审计、语法、开发机路径、死设置检查均为绿，另外多加了 `npm test` 这一层二改自检。
  （注：`publish.yml` 一并保留自上游，仅手动触发且本仓库未配置 npm token，不会自动发版。）

## 致谢

- 原作者：[**MeteorNOX**](https://github.com/MeteorNOX) —— 整个挂件、泡泡系统、记账与安全设计都是他的工作；
- 原项目：[https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget)
- 以及原项目里那 40 多位贡献者：本仓库虽然只留一次提交，但功能基础是他们的。

## 许可

- **代码**：MIT，见 [`LICENSE`](LICENSE)。文件保留原作者与二改者的两行版权声明，正文为标准 MIT，未附加额外条款，以便 GitHub 正确识别为 MIT 许可。
- **美术素材**（`assets/` 下的图片 / 动图 / 音效、`icon.png`）：**不在 MIT 范围内**，随插件原样提供，说明见 [`PROVENANCE.md`](PROVENANCE.md)，该文件同样保留自原项目并追加了二改说明（衍生关系与改动范围见第五节）。
