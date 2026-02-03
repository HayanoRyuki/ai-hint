# AI Solution Hint - 引き継ぎメモ

**最終更新**: 2026年1月23日
**プロジェクト**: メディア・コンフィデンス FAQサイト＆AI診断システム

---

## 🎯 プロジェクト概要

**コンセプト**: 「それ、AIで解決できるかも。」

メディア・コンフィデンスのサービスを「ユーザー目線の悩み」から理解してもらうためのコンテンツ基盤。
- 悩みを入り口に、AI解決キーワードを出口として整理
- このサイト自体が「自社開発のショーケース」として機能

---

## ✅ 完了した作業

### Phase 1: 設計・初期開発 ✅
- [x] 6領域 × 6エピソード = 36件の「あるある悩み」作成
- [x] 各悩みに対応する「AI解決キーワード」の整理
- [x] サイト構造設計（FAQ型）
- [x] 技術スタック選定
- [x] Next.js 14 プロジェクト初期化
- [x] Prisma DBスキーマ作成（6テーブル）
- [x] 36件のQ&A初期データ投入
- [x] トップページUI作成

### Phase 2: Q&A一覧・詳細・検索 ✅
- [x] `/faq` Q&A一覧ページ（領域・キーワードフィルタ、検索機能）
- [x] `/faq/[id]` Q&A詳細ページ（関連FAQ表示）
- [x] `/api/faq` API（検索・絞り込み対応）

### Phase 3: AIチャット ✅
- [x] `/chat` チャット画面UI
- [x] `/api/chat` Claude API連携
- [x] 対話型課題診断ロジック（深掘りヒアリング）
- [x] 診断結果 → 関連Q&A表示

### Phase 4: 管理画面 ✅
- [x] `/admin` ダッシュボード（統計表示）
- [x] Q&A一覧・編集・削除
- [x] Q&A新規作成
- [x] 公開/下書きステータス切り替え
- [x] 領域フィルタ

---

## 📋 残りの作業

### Phase 5: デプロイ
- [ ] Vercelアカウント作成・連携
- [ ] GitHubリポジトリ作成・push
- [ ] Vercelデプロイ設定
- [ ] 環境変数設定（ANTHROPIC_API_KEY）
- [ ] 本番URL決定（サブドメイン推奨）
- [ ] DNS設定（CNAME → cname.vercel-dns.com）

### その他（任意）
- [ ] チャットログ分析機能
- [ ] 管理画面の認証（Basic認証 or NextAuth）
- [ ] Q&Aコンテンツの精査・追加

---

## 📁 フォルダ構成

```
ai-solution-hint/
├── .env                    # 環境変数（APIキー）※Git管理外
├── package.json
├── prisma/
│   ├── schema.prisma       # DBスキーマ
│   ├── seed.ts             # 初期データ投入
│   └── data.db             # SQLiteファイル
├── data/
│   └── faq-seed.json       # 36件のQ&Aマスタ
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx        # トップページ
    │   ├── faq/
    │   │   ├── page.tsx    # Q&A一覧
    │   │   └── [id]/
    │   │       └── page.tsx # Q&A詳細
    │   ├── chat/
    │   │   └── page.tsx    # AIチャット
    │   ├── admin/
    │   │   └── page.tsx    # 管理画面
    │   └── api/
    │       ├── faq/        # FAQ API
    │       ├── chat/       # チャットAPI（Claude連携）
    │       └── admin/      # 管理用API
    └── lib/
        ├── prisma.ts       # DBクライアント
        └── types.ts        # 型定義
```

---

## 🗃️ データ構造

### 6領域
| slug | 名前 |
|------|------|
| marketing | マーケティング／広報 |
| recruiting | 採用・リクルーティング |
| cs | CS・ヘルプサイト |
| education | スクール・教育 |
| consulting | コンサルティング／診断 |
| data | データ管理・経営判断 |

### 解決キーワードカテゴリ
- 効率化
- 平準化
- 正確化
- 即時キャッチアップ
- 属人化解消
- 個別最適化
- 可視化
- 自動生成

---

## 🖥️ 起動方法

```bash
cd /Users/hayanoryuki12/Local\ Sites/ai-solution-hint
npm run dev
```

http://localhost:3000 でアクセス

### ページ一覧
- `/` - トップページ
- `/faq` - Q&A一覧
- `/faq/[id]` - Q&A詳細
- `/chat` - AIチャット
- `/admin` - 管理画面

### その他コマンド
```bash
npm run db:seed      # データ再投入
npm run db:studio    # DB管理GUI（Prisma Studio）
```

---

## 🔑 環境変数

`.env` ファイルに以下を設定：

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

※ APIキーは https://console.anthropic.com/ で取得
※ 現在のキーはチャットに貼ったため、再生成推奨

---

## 📝 決定事項メモ

- **ターゲット**: 中小企業（〜100名）
- **悩みのトーン**: リアルな愚痴・本音
- **CMS**: WordPressは使わない（自社開発のショーケース）
- **URL**: 未定（サブドメイン `ai-solution-hint.media-confidence.com` など）
- **AIチャット**: 対話型課題診断（深掘りヒアリング → 診断結果 → 関連FAQ）
- **デプロイ先**: Vercel（無料枠で十分）

---

## 💡 次回やること

**Phase 5: デプロイ**
1. GitHubリポジトリ作成
2. Vercel連携
3. 環境変数設定
4. DNS設定（サブドメイン）

**または**
- Q&Aコンテンツの精査・調整
- 管理画面からの追加・編集

---

*このファイルは ai-solution-hint フォルダ内に保存されています*
