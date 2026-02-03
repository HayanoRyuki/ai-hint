# AI Solution Hint - プロジェクト概要

**Media Confidence Inc. のAIソリューション提案サイト**

ビジネス上の課題を抱えるユーザーに対して、AIで解決できる可能性を提示し、具体的な相談へと導くWebサイト。

## 🌐 本番環境

- **Production URL**: https://ai-hint.vercel.app
- **管理画面**: https://ai-hint.vercel.app/admin
- **リポジトリ**: https://github.com/HayanoRyuki/ai-hint

## 🎯 プロジェクトの目的

- ビジネスパーソンの「あるある悩み」を42件のFAQで網羅
- 7つのビジネス領域別に分類し、検索性を向上
- 視覚的なコントラストで「問題→解決」の流れを明確化
- Lucideアイコンで統一された洗練されたUI/UX
- AIチャット機能で個別相談に対応

## ✨ 主要機能

### 1. FAQ詳細ページ（2カラムデザイン）
- **左カラム（問題）**: ダークグラデーション背景で深刻さを表現
  - 質問タイトル
  - 詳細エピソード（具体的な数値・状況を含む）
- **右カラム（解決策）**: 明るいグラデーション背景で希望を表現
  - 箇条書き（1, 2, 3）で解決策を提示
  - AI相談CTAボタン
- **アニメーション**: タイトル→エピソード→解決策の順に表示

### 2. FAQ一覧ページ
- **コンパクトなカードデザイン**
  - カラーヘッダー（ドメイン名＋アイコン）
  - キーワードタグ
  - 質問タイトル（2行まで）
- **サイドバーフィルター**
  - 検索ボックス
  - 領域フィルター（ダークグラデーション背景）
  - キーワードフィルター
- **レスポンシブ対応**: モバイル〜デスクトップまで最適化

### 3. AIチャット機能
- Anthropic Claude API を使用
- FAQ データベースに基づいた回答生成
- 自然な対話形式でユーザーの悩みを解決

### 4. 管理画面 🔒
- **セキュリティ**: HTTP Basic 認証で保護
  - ユーザー名: `admin`
  - パスワード: 環境変数で設定
- **機能**:
  - FAQ一覧・編集・削除
  - ステータス管理（公開中/下書き）
  - 領域・キーワードによるフィルタリング
  - モーダルでの編集フォーム
- **アクセス**: `/admin` (ナビゲーションからは非表示)

## 🛠️ 技術スタック

```
フレームワーク: Next.js 14 (App Router)
言語: TypeScript
データベース: PostgreSQL (Neon)
ORM: Prisma
スタイリング: Tailwind CSS
アイコン: Lucide React
AI: Anthropic Claude API
デプロイ: Vercel
ホスティング: Vercel (ap-southeast-1 / Singapore)
```

## 🔐 セキュリティ機能

### 管理画面の保護
- **HTTP Basic 認証**: Middleware で `/admin` パスを保護
- **環境変数管理**: パスワードは環境変数で管理
- **ナビゲーション非表示**: 一般ユーザーには管理画面の存在を非表示

### データベースセキュリティ
- **PostgreSQL**: Neon のサーバーレス PostgreSQL
- **接続プール**: Prisma による効率的な接続管理
- **SSL接続**: すべての DB 接続は SSL で暗号化

## 📁 プロジェクト構造

```
ai-solution-hint/
├── prisma/
│   ├── schema.prisma          # データベーススキーマ (PostgreSQL)
│   └── seed.ts                # シードデータ投入スクリプト
├── src/
│   ├── app/
│   │   ├── page.tsx           # トップページ
│   │   ├── faq/
│   │   │   ├── page.tsx       # FAQ一覧
│   │   │   └── [id]/
│   │   │       └── page.tsx   # FAQ詳細（2カラム・アニメーション）
│   │   ├── chat/
│   │   │   └── page.tsx       # AIチャット
│   │   ├── admin/
│   │   │   └── page.tsx       # 管理画面（認証必須）
│   │   └── api/
│   │       ├── admin/         # 管理API
│   │       ├── faq/           # FAQ取得API
│   │       └── chat/          # チャットAPI
│   ├── middleware.ts          # 認証ミドルウェア
│   ├── lib/
│   │   ├── prisma.ts          # Prismaクライアント
│   │   └── types.ts           # 型定義
│   └── globals.css            # グローバルスタイル
├── .env                       # 環境変数（ローカル）
├── .env.example               # 環境変数テンプレート
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🌍 環境変数

### 必須環境変数

```bash
# Database (Neon Postgres)
POSTGRES_URL=                    # 接続プール用URL
POSTGRES_PRISMA_URL=             # Prisma用URL（接続プール + タイムアウト）
POSTGRES_URL_NON_POOLING=        # 直接接続URL（マイグレーション用）
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Anthropic API (AIチャット用)
ANTHROPIC_API_KEY=               # Claude API キー

# Admin Panel Protection (管理画面パスワード保護)
ADMIN_USERNAME=admin             # 管理画面ユーザー名
ADMIN_PASSWORD=                  # 管理画面パスワード
```

### 環境変数の設定場所

1. **ローカル開発**: `.env` ファイル
2. **Vercel 本番**: Settings → Environment Variables
   - Production, Preview, Development すべてにチェック

## 📊 データ構造

### 7つのビジネス領域
1. **マーケティング** (Megaphone)
2. **デザイン・Web制作** (Palette)
3. **営業** (Briefcase)
4. **カスタマーサポート** (MessageCircle)
5. **採用** (Users)
6. **教育・研修** (BookOpen)
7. **経営企画** (BarChart3)

### 8つの解決キーワード
- 効率化
- 平準化
- 正確化
- 即時キャッチアップ
- 属人化解消
- 個別最適化
- 可視化
- 自動生成

### データベーススキーマ

```prisma
model Domain {
  id       String @id @default(cuid())
  slug     String @unique
  name     String
  nameJa   String
  emoji    String
  faqs     Faq[]
}

model Keyword {
  id       String @id @default(cuid())
  name     String @unique
  category String
  faqs     FaqKeyword[]
}

model Faq {
  id        String       @id @default(cuid())
  domainId  String
  domain    Domain       @relation(fields: [domainId], references: [id])
  question  String
  episode   String?
  answer    String
  status    String       @default("draft")
  order     Int          @default(0)
  keywords  FaqKeyword[]
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
}

model FaqKeyword {
  faqId     String
  keywordId String
  faq       Faq      @relation(fields: [faqId], references: [id], onDelete: Cascade)
  keyword   Keyword  @relation(fields: [keywordId], references: [id])
  @@id([faqId, keywordId])
}
```

## 🚀 セットアップ手順

### 初回セットアップ

```bash
# 1. リポジトリをクローン
git clone https://github.com/HayanoRyuki/ai-hint.git
cd ai-solution-hint

# 2. 依存関係をインストール
npm install

# 3. 環境変数を設定
cp .env.example .env
# .env ファイルを編集して、必要な環境変数を設定

# 4. データベースをセットアップ
npx prisma generate
npx prisma db push

# 5. シードデータを投入（42件のFAQ）
npm run db:seed

# 6. 開発サーバー起動
npm run dev
```

→ http://localhost:3000 でアクセス

### 管理画面へのアクセス

1. ブラウザで `/admin` にアクセス
2. Basic 認証ダイアログが表示される
3. ユーザー名: `admin`
4. パスワード: `.env` で設定したパスワード

## 📝 デプロイ手順（Vercel）

### 1. Vercel プロジェクト作成
```bash
# Vercel CLI でデプロイ（初回のみ）
vercel
```

### 2. Neon Postgres データベース作成

1. Vercel Dashboard → Storage → Create Database
2. Postgres を選択
3. Database name: `ai-hint-db`
4. Region: Singapore (ap-southeast-1) 推奨
5. Plan: Free
6. Create

→ 環境変数が自動的に設定されます

### 3. 追加の環境変数を設定

Vercel Dashboard → Settings → Environment Variables で追加：

- `ANTHROPIC_API_KEY`: Claude API キー
- `ADMIN_USERNAME`: `admin`
- `ADMIN_PASSWORD`: 安全なパスワード

すべて Production, Preview, Development にチェック

### 4. データベースマイグレーション

ローカルで実行：
```bash
# Prisma クライアント生成
npx prisma generate

# データベースにテーブルを作成
npx prisma db push

# シードデータを投入
npm run db:seed
```

### 5. デプロイ

```bash
git push
```

→ Vercel が自動的にビルド・デプロイを開始

## 🎨 デザインの特徴

### カラーパレット
- **Primary**: Blue-600 (ブランドカラー)
- **Problem側**: Gray-900 〜 Gray-800 (ダークグラデーション)
- **Solution側**: Blue-50 〜 Primary-50 (明るいグラデーション)
- **Accent**: Red-500 (問題アイコン)

### 視覚的コントラスト
- 左右2カラムで「暗い（問題）」vs「明るい（解決）」を対比
- アニメーションで段階的に情報を表示
- カードヘッダーにカラーグラデーションで視認性向上

### レスポンシブデザイン
- モバイル: 1カラム（縦スタック）
- タブレット: 2カラム（一部）
- デスクトップ: 完全な2カラムレイアウト

## 📝 更新履歴

### 2026年2月3日 - Vercel デプロイ完了 🎉

#### デプロイ関連
- ✅ GitHub リポジトリ作成 & 初回プッシュ
- ✅ Vercel プロジェクト作成
- ✅ SQLite → PostgreSQL (Neon) マイグレーション
- ✅ Neon Postgres データベース接続設定
- ✅ 環境変数設定（Vercel & ローカル）
- ✅ データベースマイグレーション & シード実行
- ✅ 本番環境デプロイ成功
- ✅ Production URL: https://ai-hint.vercel.app

#### セキュリティ強化
- ✅ 管理画面に HTTP Basic 認証を実装
- ✅ Middleware で `/admin` パスを保護
- ✅ パスワードを環境変数で管理
- ✅ ナビゲーションから管理リンクを削除
- ✅ 直接 URL 入力でのみアクセス可能に

#### ビルド最適化
- ✅ `postinstall` スクリプトで Prisma 自動生成
- ✅ `force-dynamic` でデータベース依存ページを動的レンダリング
- ✅ ビルド時間: 約47秒

#### データベース
- ✅ PostgreSQL への移行完了
- ✅ 42件の FAQ データ投入完了
- ✅ 7つのドメイン & 35個のキーワード設定完了

### 過去の更新
- ✅ 絵文字をすべてLucideアイコンに統一
- ✅ FAQ詳細ページに2カラムレイアウト実装
- ✅ アニメーション追加（タイピング風→フェードイン）
- ✅ FAQカードをコンパクト化（スクロール負荷軽減）
- ✅ カードデザイン改善（カラーヘッダー＋影）
- ✅ エピソード機能の実装（全42件に追加）

## 🔧 開発時の注意点

### Prismaの変更時
```bash
# スキーマ変更後
npx prisma db push
npx prisma generate

# シードデータ再投入
npm run db:seed
```

### アイコンの追加
`lucide-react`からインポート:
```typescript
import { IconName } from 'lucide-react'
```

### 管理画面の認証
- `/admin` パスは自動的に認証が必要
- 認証情報は環境変数 `ADMIN_USERNAME` と `ADMIN_PASSWORD` で管理
- ローカル開発時も `.env` に設定が必要

### データベース接続
- 開発環境では直接接続 (`POSTGRES_URL_NON_POOLING`)
- 本番環境では接続プール (`POSTGRES_PRISMA_URL`)
- Vercel では自動的に最適な接続方式を使用

## 🎯 今後の拡張予定

- [ ] AIチャット機能の強化（コンテキスト保持）
- [ ] ケーススタディページの追加
- [ ] 問い合わせフォームの実装
- [ ] OGP画像の自動生成
- [ ] SEO最適化
- [ ] Google Analytics 統合
- [ ] NextAuth.js による高度な認証（オプション）

## 🐛 既知の問題

現在、特になし。

## 📊 パフォーマンス

- **ビルド時間**: 約47秒
- **初回表示**: < 1秒
- **データベース**: Neon Postgres (Singapore)
- **CDN**: Vercel Edge Network

## 📄 ライセンス

© 2026 Media Confidence Inc. All rights reserved.

## 🤝 開発者

- **早野 龍輝** (Media Confidence Inc.)
- **Claude Sonnet 4.5** (Anthropic)

---

**本番環境**: https://ai-hint.vercel.app
**リポジトリ**: https://github.com/HayanoRyuki/ai-hint
**管理画面**: https://ai-hint.vercel.app/admin (要認証)
