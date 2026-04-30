/**
 * LemonCake starter agent
 *
 * Claude が MCP 経由で LemonCake のサービス一覧を取得し、Serper API などの
 * 有料エンドポイントを USDC で自動課金しながら呼び出します。
 *
 * 課金が走った後、freee / Money Forward を連携していれば、決済が日次で
 * 自動仕訳として転記されます。
 *
 * Setup:
 *   1. https://lemoncake.xyz/dashboard で Pay Token を発行
 *   2. .env に LEMON_CAKE_PAY_TOKEN を貼り付け
 *   3. npm start
 *
 * 🎁 GW2026 — 初回 $10 無料: コード LCGW2026
 */
import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";

const PAY_TOKEN = process.env.LEMON_CAKE_PAY_TOKEN;
if (!PAY_TOKEN) {
  console.error("✗ LEMON_CAKE_PAY_TOKEN is not set. Copy .env.example → .env and paste your token.");
  console.error("  Get one at: https://lemoncake.xyz/dashboard");
  process.exit(1);
}

const userPrompt = process.argv.slice(2).join(" ") || "東京の今日の天気を1行で教えて";

console.log(`\n🍋 Asking Claude: "${userPrompt}"\n`);

for await (const message of query({
  prompt: userPrompt,
  options: {
    mcpServers: {
      "lemon-cake": {
        command: "npx",
        args: ["-y", "lemon-cake-mcp"],
        env: { LEMON_CAKE_PAY_TOKEN: PAY_TOKEN },
      },
    },
    allowedTools: ["mcp__lemon-cake__list_services", "mcp__lemon-cake__call_service"],
  },
})) {
  if (message.type === "assistant") {
    for (const block of message.message.content) {
      if (block.type === "text") process.stdout.write(block.text);
      if (block.type === "tool_use") console.log(`\n[tool] ${block.name}(${JSON.stringify(block.input).slice(0, 80)}…)`);
    }
  }
  if (message.type === "result") {
    console.log(`\n\n✓ Done. Cost: ${message.total_cost_usd?.toFixed(4) ?? "0"} USD (Claude) + LemonCake charges`);
    console.log("📊 Charges sync to freee/Money Forward daily if connected: https://lemoncake.xyz/dashboard");
  }
}
