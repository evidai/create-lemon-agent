# 🍋 create-lemon-agent

> Scaffold an AI agent that pays per API call with USDC — running in 90 seconds.

```bash
npx create-lemon-agent my-agent
cd my-agent
npm install
cp .env.example .env  # paste your LEMON_CAKE_PAY_TOKEN
npm start
```

Generates a Claude Agent SDK project wired to the
[`lemon-cake-mcp`](https://www.npmjs.com/package/lemon-cake-mcp) server, so your
agent can call paid APIs autonomously and have each charge auto-journaled into
freee or Money Forward.

🎁 **GW2026**: first $10 free with code `LCGW2026` at
[lemoncake.xyz/dashboard](https://lemoncake.xyz/dashboard).

## What you get

```
my-agent/
├── package.json          # @anthropic-ai/claude-agent-sdk + lemon-cake-mcp
├── .env.example          # LEMON_CAKE_PAY_TOKEN= placeholder
├── README.md
└── src/
    └── index.ts          # 30-line Claude agent that uses paid services
```

## Why

- **No infra to host.** `lemon-cake-mcp` runs locally via `npx`, no servers to deploy.
- **No token plumbing.** Claude Agent SDK auto-discovers the MCP tools.
- **Real receipts.** Connect freee/MF in the dashboard and every call shows up as a journal entry.

## Links

- [LemonCake](https://lemoncake.xyz)
- [lemon-cake-mcp](https://www.npmjs.com/package/lemon-cake-mcp)
- [Claude Agent SDK](https://docs.anthropic.com/en/api/agent-sdk)

## License

MIT
