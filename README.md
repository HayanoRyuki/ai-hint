# AI Solution Hint - それ、AIで解決できるかも。

業務の悩みをAIで解決するためのFAQ＆対話型診断サイト

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` を編集して、必要に応じてANTHROPIC_API_KEYを設定してください。

### 3. データベースの初期化

```bash
# DBスキーマを適用
npx prisma db push

# 初期データを投入（36件のQ&A）
npm run db:seed
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

## 📁 プロジェクト構成

```
ai-solution-hint/
├── prisma/
│   ├── schema.prisma    # DBスキーマ定義
│   ├── seed.ts          # 初期データ投入スクリプト
│   └── data.db          # SQLiteデータベース（自動生成）
├── data/
│   └── faq-seed.json    # 初期データ（36件のQ&A）
├── src/
│   ├── app/
│   │   ├── page.tsx     # トップページ
│   │   ├── faq/         # Q&A一覧・詳細
│   │   ├── chat/        # AIチャット
│   │   ├── admin/       # 管理画面
│   │   └── api/         # APIエンドポイント
│   ├── components/      # UIコンポーネント
│   └── lib/             # ユーティリティ
└── public/
```

## 🛠 コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run db:push` | DBスキーマ適用 |
| `npm run db:seed` | 初期データ投入 |
| `npm run db:studio` | Prisma Studio（DB管理GUI） |

## 🎯 機能

### 公開側（ユーザー向け）
- **検索**: キーワードで悩みを検索
- **領域から探す**: 6つの領域（Marketing, Recruiting等）から絞り込み
- **解決キーワードから探す**: 効率化、平準化等のキーワードで絞り込み
- **AIチャット**: 対話型で課題を診断し、関連Q&Aを提示

### 管理側
- **Q&A管理**: CRUD操作
- **解決キーワード管理**: マスタメンテナンス
- **チャットログ分析**: よく聞かれる悩みの把握

## 📄 ライセンス

Media Confidence Inc.
