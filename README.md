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
npm start "anthropic.com の主要連絡先メールを5件取得して"
```

> **Token scope:** When issuing a Pay Token at [lemoncake.xyz/dashboard](https://lemoncake.xyz/dashboard), choose **ALL services** so the agent can discover and call any available API. A `SINGLE`-service token will be rejected when the agent tries a different service.

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
$ npm start "anthropic.com の主要連絡先メールを5件取得して"

🍋 Asking Claude: "anthropic.com の主要連絡先メールを5件取得して"
[tool] mcp__lemon-cake__list_services({…})
[tool] mcp__lemon-cake__call_service({"service":"hunter.io","path":"/domain-search?domain=anthropic.com"…})

## anthropic.com の主要連絡先

1. miguel@anthropic.com — Head of Marketing Strategy & Ops
2. will@anthropic.com    — Head of Corporate Accounting
3. mike@anthropic.com    — Head of Corporate Finance & Strategy
4. elizabeth@anthropic.com — Head of Technical Department
5. yash@anthropic.com   — Event Director

✓ Done. Cost: 0.018 USD (Claude) + 0.005 USDC (Hunter.io)
📊 Charges sync to freee/Money Forward daily if connected
```

> **Why this works in LemonCake but not in ChatGPT/Claude.ai**: Hunter.io
> requires a paid API key ($49/mo) and billing setup. Your agent uses
> LemonCake's pre-funded marketplace — discover, pay per call, no key
> management.

## Cost breakdown (Hunter.io demo)

| | Hunter.io 直接契約 | LemonCake 経由 |
|---|---|---|
| 初期費用 | API key 発行 + 月額契約 | **0 円** |
| ランニング (使わない月) | $49/mo | **$0** |
| 1 回の呼び出し | $49 ÷ N (固定費按分) | **$0.005** (従量) |
| API キー管理 | エージェントに秘密鍵渡す | **不要** (LemonCake が代理) |
| 1 件呼んだ時の損益分岐 | $49 → 9,800 calls 必要 | **1 call から黒字** |

→ 月数十回しか叩かない B2B エージェントなら **LemonCake が圧倒的に安い**。

## Other use cases

| 質問例 | 使う API | 1 コール |
|--------|---------|---------|
| "USD/JPY の最新レートと過去 30 日推移" | Open Exchange Rates | $0.005 |
| "https://example.com の本文を Markdown で" | Jina Reader | $0.005 |
| "インボイス番号 T1234567890123 が有効か" | 国税庁 invoice API | $0.005 |
| "8.8.8.8 の地理情報と ISP" | IPinfo | $0.005 |
| "<企業名> の法人番号と概要" | gBizINFO | $0.005 |
| "この URL を Slack 経由で人間に確認依頼" | Slack | $0.005 |

[全 16 サービス一覧 →](https://lemoncake.xyz/services)

## Why USDC / JPYC — not plain yen?

AI agents need **micro-payments**: $0.001 per API call. Bank transfers minimum is ¥1 and cards eat the fee. USDC/JPYC settle instantly with near-zero cost.

Want yen? Use **JPYC** (Polygon ERC-20 pegged 1:1 to yen). No FX risk, no crypto-asset tax complexity.

## vs. alternatives

| | LemonCake | Composio | RapidAPI | Skyfire |
|---|---|---|---|---|
| Micro-payments ($0.001/call) | ✅ | ❌ | ❌ | ✅ |
| Japan tax (withholding + invoice) | ✅ | ❌ | ❌ | ❌ |
| freee / MF auto-journal | ✅ | ❌ | ❌ | ❌ |
| JPYC (yen-pegged) | ✅ | ❌ | ❌ | ❌ |
| MCP server support | ✅ | ❌ | ❌ | ❌ |
| `npx` scaffold in 90 sec | ✅ | ❌ | ❌ | ❌ |

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
