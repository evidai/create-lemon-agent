# 🍋 create-lemon-agent

[![npm version](https://img.shields.io/npm/v/create-lemon-agent)](https://www.npmjs.com/package/create-lemon-agent)
[![npm downloads](https://img.shields.io/npm/dm/create-lemon-agent)](https://www.npmjs.com/package/create-lemon-agent)
[![CI](https://github.com/evidai/create-lemon-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/evidai/create-lemon-agent/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Scaffold an AI agent that pays per API call with USDC — running in 90 seconds.

![demo](https://raw.githubusercontent.com/evidai/create-lemon-agent/main/demo.gif)

```bash
npx create-lemon-agent my-agent
cd my-agent
npm install
cp .env.example .env   # paste your LEMON_CAKE_PAY_TOKEN
npm start "東京の天気は？"
```

A 30-line Claude Agent SDK project, pre-wired to
[`lemon-cake-mcp`](https://www.npmjs.com/package/lemon-cake-mcp). Your agent
discovers paid services, pays in USDC autonomously, and every charge is
auto-journaled into freee or Money Forward when connected.

## What you get

```
my-agent/
├── package.json          # @anthropic-ai/claude-agent-sdk + lemon-cake-mcp
├── .env.example          # LEMON_CAKE_PAY_TOKEN= placeholder
├── tsconfig.json
├── README.md
└── src/
    └── index.ts          # 30-line Claude agent that uses paid services
```

## Run output

```
$ npm start "東京の天気は？"

🍋 Asking Claude: "東京の天気は？"
[tool] mcp__lemon-cake__list_services({…})
[tool] mcp__lemon-cake__call_service({"service":"serper",…})
今日の東京は晴れ、最高22℃です。
✓ Done. Cost: 0.004 USD (Claude) + LemonCake charges
📊 Charges sync to freee/Money Forward daily if connected
```

## Why

- **No infra to host.** `lemon-cake-mcp` runs locally via `npx`, no servers to deploy.
- **No token plumbing.** Claude Agent SDK auto-discovers the MCP tools.
- **Real receipts.** Connect freee / Money Forward in the dashboard and every
  call shows up as a journal entry — qualified-invoice & withholding-tax aware.

## Companion projects

| Surface | Package | For |
|---------|---------|-----|
| MCP server | [`lemon-cake-mcp`](https://www.npmjs.com/package/lemon-cake-mcp) | Claude Desktop / Cursor / Cline users |
| ElizaOS plugin | [`eliza-plugin-lemoncake`](https://www.npmjs.com/package/eliza-plugin-lemoncake) | ElizaOS agent builders |
| Starter kit | **`create-lemon-agent`** (this) | Anyone with `npx` |

## Links

- 🌐 [LemonCake](https://lemoncake.xyz)
- 📚 [Quickstart docs](https://lemoncake.xyz/docs/quickstart)
- 💬 [Issues](https://github.com/evidai/create-lemon-agent/issues)

## License

MIT
