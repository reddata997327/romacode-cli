<p align="center">
  <a href="https://romacode.dev">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="RomaCode logo">
    </picture>
  </a>
</p>
<p align="center">The open source AI coding agent.</p>
<p align="center">
  <a href="https://romacode.dev/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/@romacode/cli"><img alt="npm" src="https://img.shields.io/npm/v/@romacode/cli?style=flat-square" /></a>
  <a href="https://github.com/reddata997327/romacode-cli/actions/workflows/release.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/reddata997327/romacode-cli/release.yml?style=flat-square&branch=main" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![RomaCode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://romacode.dev)

---

### Installation

```bash
# YOLO
curl -fsSL https://romacode.dev/v2/install | bash

# Package managers
npm i -g @romacode/cli@latest      # or bun/pnpm/yarn
brew install reddata997327/tap/romacode-v2 # macOS and Linux (recommended, always up to date)
brew install romacode              # macOS and Linux (official brew formula, updated less)
sudo pacman -S romacode            # Arch Linux (Stable)
paru -S romacode-beta              # Arch Linux (Latest from AUR)
mise use -g romacode               # Any OS
nix run github:reddata997327/romacode-cli  # Nix
```

> [!TIP]
> Remove versions older than 0.1.x before installing.

### Desktop App (BETA)

RomaCode is also available as a desktop application. Download it from [romacode.dev/download](https://romacode.dev/download).

| Platform              | Download                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `romacode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `romacode-desktop-mac-x64.dmg`     |
| Windows               | `romacode-desktop-win-x64.exe`     |
| Linux                 | `.deb`, `.rpm`, or `.AppImage`     |

```bash
# macOS (Homebrew)
brew install --cask romacode-desktop
```

#### Installation Directory

The install script installs RomaCode to `$HOME/.romacode/bin`.

### Agents

RomaCode includes two built-in agents you can switch between with the `Tab` key.

- **build** - Default, full-access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar codebases or planning changes

Also included is a **general** subagent for complex searches and multistep tasks.
This is used internally and can be invoked using `@general` in messages.

Learn more about [agents](https://romacode.dev/v2/docs/agents).

### Documentation

For more info on how to configure RomaCode, [**head over to our docs**](https://romacode.dev/v2/docs).

### Contributing

If you're interested in contributing to RomaCode, please read our [contributing docs](./CONTRIBUTING.md) before submitting a pull request.

### Building on RomaCode

If you are working on a project that's related to RomaCode and is using "romacode" as part of its name, for example "romacode-dashboard" or "romacode-mobile", please add a note to your README to clarify that it is not built by the RomaCode team and is not affiliated with us in any way.

---

**Join our community** [Discord](https://discord.gg/romacode) | [X.com](https://x.com/romacode)
