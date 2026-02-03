# Vercel Postgres セットアップ後の手順

## 1. Vercel Dashboard での作業

1. **Storage** タブをクリック
2. **Create Database** → **Postgres** を選択
3. データベース名: `ai-hint-db`
4. リージョン: `Tokyo (nrt1)` 推奨
5. **Create** をクリック

→ 環境変数が自動的にプロジェクトに追加されます

## 2. 環境変数をローカルにコピー

Vercel Dashboard の Settings → Environment Variables から、以下をコピーして `.env` ファイルを作成:

```
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
ANTHROPIC_API_KEY=
```

## 3. データベースのマイグレーション

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 4. データベースのシード（42件のFAQデータを投入）

```bash
npm run db:seed
```

## 5. GitHub へプッシュ

```bash
git push
```

→ Vercel で自動デプロイが開始されます

## 6. 動作確認

デプロイ完了後、以下を確認:
- トップページが表示される
- FAQ一覧ページで42件のデータが表示される
- AIチャットが動作する
- 管理画面でFAQの作成・編集ができる

---

## トラブルシューティング

**Q: マイグレーションでエラーが出る**
- `.env` ファイルに環境変数が正しく設定されているか確認
- Vercel Dashboard で環境変数が正しく生成されているか確認

**Q: デプロイは成功するがエラーが出る**
- Vercel Dashboard の Logs を確認
- データベースのマイグレーションが実行されているか確認
