# 🍋 my-lemon-agent

Claude が LemonCake の MCP 経由で USDC 課金しながら有料 API を叩く最小サンプル。
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

デフォルトのプロンプトはサービス一覧を取得するだけなので、追加課金は走りません：

```bash
$ npm start
🍋 Asking Claude: "LemonCakeで使えるサービスを3つ、価格と用途つきで紹介して"
[tool] list_services({"limit":10}…)
1. Jina Reader — Webページ抽出 (0.0001 USDC/呼び出し) ...
✓ Done. Claude cost: ~$0.0059 (3808 in / 417 out tokens)
```

実際に有料 API を叩くには、ダッシュボードでサービスへのアクセスを有効化したうえで：

```bash
$ npm start "東京の天気を1行で教えて"
[tool] list_services({...})
[tool] call_service({"serviceId":"...","method":"POST","path":"/search","body":{"q":"..."}})
今日の東京は晴れ、最高気温22℃です。
```

## 仕組み

- `@anthropic-ai/sdk` で Claude を直叩き
- `@modelcontextprotocol/sdk` で `lemon-cake-mcp` を子プロセスとして起動
- ツールループは `src/index.ts` 内に手書き — 挙動が予測可能で、課金もログで追える

## カスタマイズ

`src/index.ts` を編集して自分のエージェントを書きましょう。`tools` 配列を
絞り込んだり、`system` プロンプトを書き換えたり、`messages` を継続セッション化
するのも数行です。

## ライセンス

MIT
