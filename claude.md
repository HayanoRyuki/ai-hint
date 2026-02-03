# AI Solution Hint - プロジェクト概要

**Media Confidence Inc. のAIソリューション提案サイト**

ビジネス上の課題を抱えるユーザーに対して、AIで解決できる可能性を提示し、具体的な相談へと導くWebサイト。

## 🎯 プロジェクトの目的

- ビジネスパーソンの「あるある悩み」を42件のFAQで網羅
- 7つのビジネス領域別に分類し、検索性を向上
- 視覚的なコントラストで「問題→解決」の流れを明確化
- Lucideアイコンで統一された洗練されたUI/UX

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

### 3. 管理画面
- FAQ一覧・編集・削除
- ステータス管理（公開中/下書き）
- 領域・キーワードによるフィルタリング
- モーダルでの編集フォーム

### 4. エピソード機能
- 各FAQに「詳細エピソード」を追加
- 具体的な数値（月56時間、月20万円など）
- 現実的なシナリオ（100-200文字）
- データベースに永続化

## 🛠️ 技術スタック

```
- フレームワーク: Next.js 14 (App Router)
- 言語: TypeScript
- データベース: SQLite + Prisma ORM
- スタイリング: Tailwind CSS
- アイコン: Lucide React
- デプロイ: （未定）
```

## 📁 プロジェクト構造

```
ai-solution-hint/
├── prisma/
│   ├── schema.prisma          # データベーススキーマ
│   └── seed.ts                # シードデータ投入スクリプト
├── data/
│   └── faq-seed.json          # 42件のFAQデータ（エピソード含む）
├── src/
│   ├── app/
│   │   ├── page.tsx           # トップページ
│   │   ├── faq/
│   │   │   ├── page.tsx       # FAQ一覧
│   │   │   └── [id]/
│   │   │       ├── page.tsx   # FAQ詳細（2カラム・アニメーション）
│   │   │       └── animations.css
│   │   ├── admin/
│   │   │   └── page.tsx       # 管理画面
│   │   ├── chat/
│   │   │   └── page.tsx       # AIチャット（未実装）
│   │   └── api/
│   │       ├── admin/         # 管理API
│   │       ├── faq/           # FAQ取得API
│   │       └── chat/          # チャットAPI（未実装）
│   ├── lib/
│   │   ├── prisma.ts          # Prismaクライアント
│   │   └── types.ts           # 型定義
│   └── globals.css            # グローバルスタイル
├── .env.example               # 環境変数テンプレート
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

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

### FAQ構造
```typescript
interface Faq {
  id: string
  domainId: string
  question: string      // 悩み（質問）
  episode?: string      // 詳細エピソード（追加機能）
  answer: string        // 解決策
  keywords: Keyword[]   // 関連キーワード
  status: string        // published/draft
  order: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 🚀 セットアップ手順

### 1. 環境構築
```bash
npm install
```

### 2. データベース初期化
```bash
# Prisma Clientを生成
npx prisma generate

# データベースをプッシュ
npx prisma db push

# シードデータを投入（42件のFAQ）
npm run db:seed
```

### 3. 開発サーバー起動
```bash
npm run dev
```

→ http://localhost:3000 でアクセス

### 4. 管理画面
→ http://localhost:3000/admin

## 📝 最近の更新履歴

### 2024年2月3日
- ✅ 絵文字をすべてLucideアイコンに統一
- ✅ FAQ詳細ページに2カラムレイアウト実装
- ✅ アニメーション追加（タイピング風→フェードイン）
- ✅ FAQカードをコンパクト化（スクロール負荷軽減）
- ✅ カードデザイン改善（カラーヘッダー＋影）
- ✅ エピソード機能の実装（全42件に追加）
- ✅ GitHubリポジトリに初回プッシュ完了

### デザイン変更の詳細
1. **FAQ詳細ページ**
   - 左：ダーク背景 + 白文字（問題を強調）
   - 右：明るい背景 + 色付きボックス（解決策を強調）
   - アニメーション: 1.2s でタイトル → 1.2s後にエピソード → 2s後に解決策

2. **FAQ一覧ページ**
   - カードの上部にカラーヘッダー（ドメイン情報）
   - 回答プレビューを削除してコンパクト化
   - サイドバーをダークテーマに変更

3. **管理画面**
   - Settingsアイコンをヘッダーに追加
   - テーブルにLucideアイコン表示

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

### CSSアニメーション
`/src/app/faq/[id]/animations.css` に定義済み:
- `typing-text`: タイトルフェードイン
- `fade-in-episode`: エピソード表示
- `slide-in-solution`: 解決策スライドイン
- `icon-bounce`: アイコンバウンス

## 🎯 今後の拡張予定

- [ ] AIチャット機能の実装
- [ ] ケーススタディページの追加
- [ ] 問い合わせフォームの実装
- [ ] Vercelへのデプロイ
- [ ] OGP画像の自動生成
- [ ] SEO最適化

## 📄 ライセンス

© 2024 Media Confidence Inc. All rights reserved.

## 🤝 開発者

- **早野 龍輝** (Media Confidence Inc.)
- **Claude Sonnet 4.5** (Anthropic)

---

**リポジトリ**: https://github.com/HayanoRyuki/ai-hint
