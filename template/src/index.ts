/**
 * LemonCake starter agent
 *
 * Claude が LemonCake の MCP サーバー経由で USDC 課金しながら有料 API を叩く最小サンプル。
 * Anthropic SDK を直叩きしてツールループを手動で回しているので、挙動が予測可能で
 * 課金もログで追えます。
 *
 * Setup:
 *   1. https://lemoncake.xyz/dashboard で Pay Token を発行
 *   2. https://console.anthropic.com/settings/keys で API キーを発行
 *   3. .env に両方を貼り付け
 *   4. npm start
 *
 */
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const PAY_TOKEN = process.env.LEMON_CAKE_PAY_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!PAY_TOKEN) {
  console.error("✗ LEMON_CAKE_PAY_TOKEN is not set. Copy .env.example → .env and paste your token.");
  console.error("  Get one at: https://lemoncake.xyz/dashboard");
  process.exit(1);
}
if (!ANTHROPIC_API_KEY) {
  console.error("✗ ANTHROPIC_API_KEY is not set.");
  console.error("  Get one at: https://console.anthropic.com/settings/keys");
  process.exit(1);
}

const userPrompt =
  process.argv.slice(2).join(" ") || "LemonCakeで使えるサービスを3つ、価格と用途つきで紹介して";
console.log(`\n🍋 Asking Claude: "${userPrompt}"\n`);

const transport = new StdioClientTransport({
  command: "npx",
  args: ["-y", "lemon-cake-mcp"],
  env: { ...process.env, LEMON_CAKE_PAY_TOKEN: PAY_TOKEN },
});
const mcp = new Client({ name: "create-lemon-agent", version: "1.0.0" });
await mcp.connect(transport);

const { tools: mcpTools } = await mcp.listTools();
const tools = mcpTools
  .filter((t) => t.name === "list_services" || t.name === "call_service")
  .map((t) => ({
    name: t.name,
    description: t.description ?? "",
    input_schema: t.inputSchema as Anthropic.Tool.InputSchema,
  }));

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const messages: Anthropic.MessageParam[] = [{ role: "user", content: userPrompt }];

let inputTokens = 0;
let outputTokens = 0;

for (let turn = 0; turn < 8; turn++) {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system:
      "You answer the user's question by calling LemonCake's paid API marketplace. " +
      "First call list_services to see what's available, then call_service with a serviceId you found. " +
      "For web/weather questions, the Serper service works well — POST to /search with body { q: \"...\" }. " +
      "Make one tool call per turn. Be concise.",
    tools,
    messages,
  });

  inputTokens += response.usage.input_tokens;
  outputTokens += response.usage.output_tokens;

  for (const block of response.content) {
    if (block.type === "text") process.stdout.write(block.text);
    if (block.type === "tool_use")
      console.log(`\n[tool] ${block.name}(${JSON.stringify(block.input).slice(0, 100)}…)`);
  }

  if (response.stop_reason !== "tool_use") break;

  messages.push({ role: "assistant", content: response.content });

  const toolResults: Anthropic.ToolResultBlockParam[] = [];
  for (const block of response.content) {
    if (block.type !== "tool_use") continue;
    const result = await mcp.callTool({ name: block.name, arguments: block.input as Record<string, unknown> });
    const text = Array.isArray(result.content)
      ? result.content.map((c) => (c.type === "text" ? c.text : "")).join("\n")
      : "";
    toolResults.push({ type: "tool_result", tool_use_id: block.id, content: text });
  }
  messages.push({ role: "user", content: toolResults });
}

await mcp.close();

const claudeCost = (inputTokens * 1.0 + outputTokens * 5.0) / 1_000_000;
console.log(
  `\n\n✓ Done. Claude cost: ~$${claudeCost.toFixed(4)} (${inputTokens} in / ${outputTokens} out tokens)`,
);
console.log("📊 LemonCake charges sync to freee/Money Forward daily: https://lemoncake.xyz/dashboard");
