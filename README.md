# vim-jk

Accelerated `j/k`-style vertical movement for VS Code, designed to be used alongside VSCodeVim without breaking count-based motions like `10j`.

## How to build

- Install deps: `pnpm install`
- Compile once: `pnpm run compile`
- Watch mode: `pnpm run watch`

The compiled extension entrypoint is `out/extension.js`.

## How to debug (recommended)

- Open `my-fork/vim-jk` in VS Code
- Press `F5` (Run → Start Debugging)
- In the new “Extension Development Host” window, bind keys and try the commands

## How to install locally

- Easiest: use the debug method above
- Or: VS Code command “Developer: Install Extension from Location...” and pick the `my-fork/vim-jk` folder

## Usage with VSCodeVim (keeps `10j/10k` working)

Bind *different keys* (e.g. `<C-j>/<C-k>`) to the accelerated commands, and keep plain `j/k` untouched so numeric prefixes remain precise.

Example `settings.json` snippet:

```json
{
  "vim.normalModeKeyBindingsNonRecursive": [
    { "before": ["<C-j>"], "commands": [{ "command": "vim-jk.cursorDown" }] },
    { "before": ["<C-k>"], "commands": [{ "command": "vim-jk.cursorUp" }] }
  ]
}
```

## Settings

- `vim-jk.accelerationTable`: repeat thresholds for increasing per-press motion
- `vim-jk.resetTime`: idle time (ms) before acceleration resets
- `vim-jk.commandMode`:
  - `vscodevim`: uses `vim.remap` with `j/k`
  - `vscodevim-gj-gk`: uses `vim.remap` with `gj/gk` (visual line movement)
  - `cursormove`: uses VS Code `cursorMove`
