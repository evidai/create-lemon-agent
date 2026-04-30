# 🍋 my-lemon-agent

Claude が MCP 経由で USDC 課金しながら有料 API を呼ぶ最小サンプル。
freee / Money Forward を連携していれば、決済が日次で自動仕訳に転記されます。

## 90秒セットアップ

```bash
npm install
cp .env.example .env
# .env を開いて LEMON_CAKE_PAY_TOKEN と ANTHROPIC_API_KEY を貼る
npm start
```

トークンは [lemoncake.xyz/dashboard](https://lemoncake.xyz/dashboard) で発行。

🎁 **GW2026 限定**: 初回 $10 無料 — 登録時にコード `LCGW2026`

## 実行例

```bash
$ npm start "東京の天気は？"
🍋 Asking Claude: "東京の天気は？"
[tool] mcp__lemon-cake__call_service({"service":"serper",…)
今日の東京は晴れ、最高気温22℃です。
✓ Done. Cost: 0.0042 USD (Claude) + LemonCake charges
📊 Charges sync to freee/Money Forward daily if connected
```

## カスタマイズ

`src/index.ts` を編集して、自分のエージェントを書きましょう。MCP ツールが
そのまま `mcp__lemon-cake__*` で生えてくるので、Claude はサービス一覧を見て
自分で課金 API を選びます。

## ライセンス

MIT
