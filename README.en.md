# DeepSeek-Balance-Whale-Widget — Fork

**English** · [简体中文](README.md)

The little whale in the bottom-right corner of DeepSeek Harness (DSH). I added a few things I wanted.

> **This repo**: [sereinZ-Z-Z / DeepSeek-Balance-Whale-Widget-Mod](https://github.com/sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod)
> **This is a fork.**
> Upstream: [**MeteorNOX / DeepSeek-Balance-Whale-Widget**](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget)
> Based on upstream **v0.4.2**. **Only the front-end script `assets/whale-widget.js` was modified** —
> the host side (`lib/`), the API, the security gate, and the bubble system are untouched.
> Copyright belongs to the original author. Distributed under **MIT**. Huge thanks to the upstream author,
> especially for the modular bubble system — it let these changes be a few dozen lines instead of a rewrite.

---

## What this fork adds

| # | Feature | Notes |
|---|---|---|
| 1 | **Switch the bubble balance source** | Show either the built-in DeepSeek official balance or a third-party API (relay/proxy) balance. One button in the menu cycles through sources. **Works out of the box since v0.5.1**: with the default bubble — or any bubble config you never edited — switching to a third party moves the balance and "used today" to that source, and hides the modules that only make sense for official pricing (peak/off-peak, peak countdown, bonus, top-up balance). **No JSON editing required** |
| 2 | **Custom balance color** | Menu → "余额颜色" opens a palette: **24 solid colors + 6 animated gradients**. Applies on click, palette stays open so you can try several |
| 3 | **One-click page reload** | Menu → "重载页面" → "重新加载". The DSH desktop app (Windows) has no menu bar and does not receive `Ctrl+R` / `Ctrl+F5`, so this is the only way to reload after changing plugin code |

Bugs fixed along the way:

- **Switching the source did nothing** (v0.5.1) — v0.5.0 only remapped modules carrying an `only` marker, but the default bubble has no markers at all, so switching was a no-op: official balance on top, peak block still underneath. Now a group with no `only` enters *auto mode*; configs with markers (the hand-written v0.5.0 rules) behave byte-for-byte the same.
- **Clicking a color swatch did nothing** — the palette was torn down by the menu's outside-click handler during `pointerdown`, so the swatch's `click` never fired. Clicks inside the palette no longer count as outside, and selection lands on `pointerdown`.
- **Right column of the palette clipped in narrow windows** — width is now `min(342px, calc(100vw - 16px))`, columns wrap automatically.
- **"Rainbow" wasn't the default look** — a non-empty `rgb` on a color installs the `dshwvRainbow` animation (via the `.dshwv-trow.dshwv-rgb` base class). For a static color, leave `rgb` empty and use `color` only. Defaults now follow this.

## Usage

Click the menu button next to the whale; three new rows appear:

| Menu row | What it does |
|---|---|
| **气泡余额** (balance source) | Cycles `DeepSeek official → third-party model name → …` |
| **余额颜色** (balance color) | Opens the palette (24 solid / 6 animated); click a swatch to apply instantly |
| **重载页面** (reload page) | "重新加载" reloads the page (same as `location.reload()` in DevTools) |

Selections are stored in `localStorage`:

- `dshw-bal-mode` — which balance source (`deepseek` or a third-party model id)
- `dshw-bal-color` — `solid:#rrggbb` or `anim:macaron`

They survive reloads. If the referenced model is deleted, the source falls back to official rather than getting stuck at `--`.

## Bubble config (no editing needed since v0.5.1)

**Out of the box.** After switching to a third party, the bubble should show only "balance" and "used today", with the third party's numbers, and no peak block. If that's what you see, skip this section.

The rule: **when no module in the group carries `only`, auto mode applies** — balance and used-today follow the selected source; peak, peak countdown, bonus and top-up balance (official-pricing-only concepts) are hidden in third-party mode.

For fine control (e.g. showing official *and* third-party balances at the same time), add `only` to modules. As soon as **any** `only` appears in the group, markers take over completely and auto mode steps aside:

```json
{ "type": "balance", "tpl": "{balance_ds}", "only": "builtin" }   // official only
{ "type": "balance", "tpl": "{balance}",    "only": "custom"  }   // third party only
{ "type": "peak",    "tpl": "{status}",     "only": "builtin" }   // same for peak info
```

- `only: "builtin"` → shown only when displaying the official balance
- `only: "custom"` → shown only in third-party mode; `modelId` is swapped to the selected model before rendering
- **no `only`** → normal in official mode; in third-party mode the auto rules above apply

> `tpl` can be `{balance_ds}` or `{balance}` — once a module has a `modelId`, both placeholders read that model's data (`map['balance_ds'] = map['balance']` in the source). What actually decides the switch is `only` / `modelId`, not `tpl`.

Config file: `~/.dsh/.dshw-bubble.json` (`%USERPROFILE%\.dsh\.dshw-bubble.json` on Windows). It only exists **after you save once** from the "custom bubble" menu; without it the plugin uses the default bubble, which is exactly the case auto mode covers. Desktop and web keep separate copies — edit both if you use both.

### Changelog

Full history: [`CHANGELOG.md`](CHANGELOG.md).

| Version | Change |
|---|---|
| `v0.5.1-mod.1` | Fix "balance/peak unchanged after switching": markerless module groups enter auto mode; peak, bonus and top-up hidden in third-party mode |
| `v0.5.0-mod.1` | Initial fork: source switching, 24 solid + 6 animated colors, one-click reload |

## Install

> **TL;DR**: **the desktop (Electron) app cannot be installed from the CLI** — ask DSH itself to install it in a session. Only `dsh web` uses `dsh plugin`.
> They read **different profiles** (desktop = `desktop`, web = `web`). Installing into the wrong one looks like "nothing in the bottom-right corner, not even ☰, and no console errors".

`package.json` keeps **`name: dsh-whale-widget`**, the same plugin identity as upstream:

- it is a **drop-in replacement**, it cannot coexist with upstream;
- if upstream is installed (`github:MeteorNOX/DeepSeek-Balance-Whale-Widget`, or `dsh-whale-widget` from npm), remove it first;
- removing the plugin **does not** delete your data: bubble config, API config and the ledger all live under `~/.dsh/`, independent of the install directory.

### Step 0: which host are you in?

| Where you see the whale | Host | Profile | How to install |
|---|---|---|---|
| The desktop app window (official Electron client) | desktop | `%USERPROFILE%\.dsh\profiles\desktop` | Ask DSH to use its built-in `plugin_manager` (section 1) |
| A `dsh web` page in a browser | web | `%USERPROFILE%\.dsh\profiles\web` | `dsh plugin --profile web add …` (section 2) |

### 1. Desktop app (Electron)

`dsh plugin` **refuses** to touch the user's desktop profile by design:

```
error: profile "desktop" is managed exclusively by the Electron application
```

So do **not** follow the web instructions. Installing with `--profile web` puts the plugin in the `web` profile while the desktop window reads `desktop` — it sees nothing, and nothing errors out, which makes it very hard to notice.

**Correct approach**: paste this into a session in the desktop app.

```text
Please install dsh-whale-widget using the built-in plugin_manager available in
this desktop app. Source:
github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod

Before installing, check:
1. Whether the current profile is "desktop".
2. Whether a plugin named dsh-whale-widget is already installed (likely the
   original from MeteorNOX). If so, report its source and version, then replace
   it with the source above. Both packages share the same name, so this is a
   replacement install — they cannot coexist.

When done, tell me the result and whether a restart is needed. Do not build
authentication cookies yourself, do not call low-level RPCs, and do not
hand-edit profile files managed by the host.
```

Notes:

- `plugin_manager` is scoped to the current profile (`desktop` in the app); the host installs and registers the bundle with its own package manager. No terminal needed.
- Spec syntax matches `dsh plugin`: `github:<user>/<repo>`, `link:<local dir>`, `<name>@<version>`. What is actually supported depends on the tool's response.
- To pin a version, add a ref: `github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod#v0.5.1-mod.1`. Without a ref it tracks `main`. This fork is **not published to npm**, so `dsh-whale-widget@0.5.1-mod.1` will not work here.
- If the tool is unavailable or lacks the operation, ask DSH which host capability is missing — do **not** work around it with `--profile web`.

**Restart after installing**: the tool may return `"application":"applied"`, which does not mean the current window has rendered the widget. If the corner is empty, **fully quit the app (including the tray icon)** and reopen it.

Two checks to tell "not installed" apart from "installed but not rendered":

| Side | What to check |
|---|---|
| Host | `%USERPROFILE%\.dsh\.dshw-turn.json` exists and its `seq` increases with each turn |
| Client | `%APPDATA%\@deepseek-ai\dsh-desktop\Local Storage\leveldb` contains `dshw-pos` / `dshw-last-seq` (only the widget front end writes these) |

If the desktop UI shows no version, inspect `dsh.profile.bundles` in `%USERPROFILE%\.dsh\profiles\desktop\package.json` and the `pnpm-lock.yaml` next to it.

### 2. Web (`dsh web`)

#### Option A: install straight from GitHub (simplest)

```powershell
# 1) Remove upstream first — same package name, otherwise it conflicts
dsh plugin --profile web remove dsh-whale-widget

# 2) Install from this repo
dsh plugin --profile web add github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod

# 3) Restart dsh web, then Ctrl+F5 in the browser
```

Afterwards the plugin shows up on DSH's plugin management page and can be updated there without the CLI.

#### Option B: install a local directory (editing code / offline)

```powershell
# These must exist; without assets/ you get no images and no sound
Test-Path "D:\Plugins\DeepSeek-Balance-Whale-Widget-Mod\package.json",
          "D:\Plugins\DeepSeek-Balance-Whale-Widget-Mod\lib\index.js",
          "D:\Plugins\DeepSeek-Balance-Whale-Widget-Mod\assets\whale-widget.js"

# Remove upstream first
dsh plugin --profile web remove dsh-whale-widget

# Install by absolute path (quote paths containing spaces)
dsh plugin --profile web add link:D:\Plugins\DeepSeek-Balance-Whale-Widget-Mod
```

- `link:` is a **symlink install**: edits in the source directory take effect immediately, but you must not move or rename that directory afterwards — re-run `add` if you do.
- Want an independent copy that no longer syncs? Use `file:` instead of `link:`.
- Inside the repo root you can also run `dsh plugin --profile web add link:.` — **the repo root is the plugin package**; do not write `link:.\dsh-whale-widget`, that subdirectory does not exist and it would be installed as a plain dependency.
- Keep the directory in a **fixed location** (e.g. `D:\Plugins\…`), not in Downloads or a temp folder.

#### Behind a proxy

Set the environment variables first, otherwise `github:` fetches fail with `Failed to fetch`:

```powershell
$env:http_proxy="http://127.0.0.1:7890"
$env:https_proxy="http://127.0.0.1:7890"
$env:all_proxy="socks5://127.0.0.1:7890"
dsh plugin --profile web add github:sereinZ-Z-Z/DeepSeek-Balance-Whale-Widget-Mod
```

### 3. Verify

Web (default port 3080; use whatever you actually started with):

```powershell
# Is the plugin registered in bundles?
dsh --profile web --dump-config | Select-String "whale"

# All three endpoints should return 200
curl http://127.0.0.1:3080/dsh-whale/balance.json   # JSON containing totalBalance
curl http://127.0.0.1:3080/dsh-whale/widget.js      # front-end script
curl "http://127.0.0.1:3080/dsh-whale/audio-fragment.wav?id=exp_orb"   # 404 means assets/ is incomplete
```

For the desktop app, use the two checks above instead — there is no port.

### 4. Uninstall / switch back to upstream

```powershell
# Web
dsh plugin --profile web remove dsh-whale-widget

# Switch back to upstream
dsh plugin --profile web add github:MeteorNOX/DeepSeek-Balance-Whale-Widget
```

On desktop, ask DSH to uninstall or re-source via `plugin_manager`; do not delete the profile directory by hand. Your config and ledger under `~/.dsh/` survive an uninstall — reinstall and continue.

### 5. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Desktop corner empty, **not even ☰**, no console errors | Installed into the `web` profile; desktop reads `desktop` | Reinstall into desktop with `plugin_manager`, never `--profile web` |
| `profile "desktop" is managed exclusively by the Electron application` | By design, not a bug | Same as above |
| Widget appears but the menu lacks "气泡余额 / 余额颜色 / 重载页面" | Stale front-end script (cache), or host not restarted after switching directories | Fully quit desktop (tray included) and reopen; restart `dsh web` + `Ctrl+F5`; or use the menu's reload row |
| Only `exit 1` / `pnpm failed` | Aggregate error, tells you nothing about the code | Read the **earliest** underlying error in `.plugin-manager/logs/operation-*/pnpm.log` and `hub.log` |
| "pnpm not found" | The host's bundled package manager differs from the one on PATH | Report the host's pnpm path and version, follow that DSH version's install notes; don't reinstall the plugin blindly |
| `ERR_PNPM_ADDING_TO_ROOT` | Dependencies were added to the profile root instead of the plugin | Remove the stray dependencies and reinstall; do not hand-edit `package.json` |
| Balance shows `--` / "not configured" | Missing credentials, or not signed in | See section 6 |
| Version confusion / two sources side by side | `remove` first, then `add` once | See section 4 |

### 6. After install

1. **Where the balance comes from**: official DeepSeek balance uses `DEEPSEEK_API_KEY` (or signing in to a DeepSeek account inside DSH; recent versions work without a key); a third-party relay uses `~/.dsh/.dshw-api.json`. Field reference: "credentials" section of `README.original.md`.
2. **Bubble config**: works after install, nothing to edit. If the balance does not change and the peak block stays after switching to a third party, confirm you are on `v0.5.1-mod.1` or newer (older builds need manual `only` markers), then read the bubble-config section above.
3. **After a plugin update**: if this repo merges a new upstream release, the places marked `// 二改 ·` in `assets/whale-widget.js` must be re-anchored, or the new menu rows may not appear.

## Project layout

```
lib/                   host side (unmodified)
  index.js             routes, balance requests, config read/write
  accounting.mjs       accounting / usage stats
assets/
  whale-widget.js      the widget itself (every fork change lives in this file)
  *.png *.gif *.mp3    characters, animations, sound effects
tools/                 upstream's CI audit scripts (unmodified)
test/                  fork invariant self-check (`npm test`, 14 assertions)
screenshots.json       screenshot list used by the marketplace page
cordis.patch.yml       plugin mount declaration (unmodified)
README.original.md     upstream README, archived for reference
README.md              Chinese README
```

Four locations hold all fork changes, each marked with `// 二改 ·` comments for easy review:

1. Menu construction: the three new rows
2. Before `bubbleRowsTo()`: source switching, color, module filtering (the v0.5.1 auto mode lives in `bubbleModsForMode()`), the palette
3. Start of `bubbleRowsTo()`: `mods = bubbleModsForMode(mods)`
4. Start of `onDocPointerDown()`: clicks inside the palette are not "outside" clicks

## Tests: `npm test`

The real risk for a fork is not writing something wrong — it is **silently losing changes while following upstream**. Upstream replaces the whole 1.2 MB `assets/whale-widget.js` each release; a missed anchor shows up as "one menu row missing" or "switching does nothing" — no error, no crash, just a missing feature.

`test/fork-invariants.test.mjs` guards against that with 14 assertions: the three config shapes of source switching (default auto / explicit markers / empty and peak-only edge cases), count and uniqueness of the 24 colors and 6 animations, the three menu rows, `localStorage` key names, the `{balance_ds}` alias, the number of fork markers, and consistency between the package name and the patch declaration.

It **extracts functions from the source and evaluates them live** rather than copying the implementation, so the tests move with the implementation, and assertions target behavior instead of line numbers — upstream reformatting does not trigger false alarms. Zero dependencies, read-only:

```bash
npm test
```

CI runs this on every push; if it goes red, an increment was dropped — use the function name in the error to find it in `assets/whale-widget.js`.

## Compatibility & limits

- **Only applies to `type: 'balance'` modules** (the big number). "Used today" is `type: 'today'`; its color is unaffected.
- **Only tested on web and the Windows desktop app.** Upstream's Codex branch, sound, characters and edge-snapping are untouched but not individually regression-tested.
- If upstream changes the `bubbleRowsTo` signature or removes `menuRow() / menuLabel()`, anchors must be re-checked when merging.
- Upstream's CI (`.github/workflows/ci.yml`) **stays green** in this repo: layer audit, syntax, dev-machine paths and dead-settings checks all pass, plus the extra `npm test` fork layer.
  (`publish.yml` is kept from upstream, manual-trigger only, and this repo has no npm token, so it will not publish.)

## Credits

- Original author: [**MeteorNOX**](https://github.com/MeteorNOX) — the entire widget, bubble system, accounting and security design are his work.
- Upstream: [https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget)
- And the 40+ contributors there: this repo squashes history into a single commit, but the foundation is theirs.

## License

- **Code**: MIT, see [`LICENSE`](LICENSE). The file keeps two copyright lines (original author and fork author) with the standard MIT body and no extra clauses, so GitHub detects it as MIT.
- **Art assets** (images / animations / sounds under `assets/`, plus `icon.png`): **not covered by MIT**, provided as-is with the plugin. See [`PROVENANCE.md`](PROVENANCE.md), which is inherited from upstream with a fork section appended (derivation and scope of changes in section 5).
