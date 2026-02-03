import { Suspense } from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Megaphone, Palette, Briefcase, MessageCircle, Users, BookOpen, BarChart3, Search, FolderOpen, Key, Lightbulb } from 'lucide-react';

const iconMap = {
  'Megaphone': Megaphone,
  'Palette': Palette,
  'Briefcase': Briefcase,
  'MessageCircle': MessageCircle,
  'Users': Users,
  'BookOpen': BookOpen,
  'BarChart3': BarChart3,
};

// 領域データ
const domains = [
  { slug: 'marketing', name: 'Marketing', nameJa: 'マーケティング', icon: 'Megaphone' },
  { slug: 'design', name: 'Design / Web', nameJa: 'デザイン・Web制作', icon: 'Palette' },
  { slug: 'sales', name: 'Sales', nameJa: '営業', icon: 'Briefcase' },
  { slug: 'cs', name: 'Customer Support', nameJa: 'カスタマーサポート', icon: 'MessageCircle' },
  { slug: 'recruiting', name: 'Recruiting', nameJa: '採用', icon: 'Users' },
  { slug: 'education', name: 'Education', nameJa: '教育・研修', icon: 'BookOpen' },
  { slug: 'planning', name: 'Planning', nameJa: '経営企画', icon: 'BarChart3' },
];

// 解決キーワードカテゴリ
const keywordCategories = [
  '効率化', '平準化', '正確化', '即時キャッチアップ',
  '属人化解消', '個別最適化', '可視化', '自動生成'
];

interface Props {
  searchParams: Promise<{ domain?: string; keyword?: string; search?: string }>;
}

async function getFaqs(domain?: string, keyword?: string, search?: string) {
  const faqs = await prisma.faq.findMany({
    where: {
      status: 'published',
      ...(domain && {
        domain: {
          slug: domain,
        },
      }),
      ...(keyword && {
        keywords: {
          some: {
            keyword: {
              category: keyword,
            },
          },
        },
      }),
      ...(search && {
        OR: [
          { question: { contains: search } },
          { answer: { contains: search } },
        ],
      }),
    },
    include: {
      domain: true,
      keywords: {
        include: {
          keyword: true,
        },
      },
    },
    orderBy: [
      { domain: { slug: 'asc' } },
      { order: 'asc' },
    ],
  });

  return faqs;
}

export default async function FaqPage({ searchParams }: Props) {
  const params = await searchParams;
  const { domain, keyword, search } = params;
  const faqs = await getFaqs(domain, keyword, search);

  const currentDomain = domains.find(d => d.slug === domain);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ヘッダー */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-primary-600 transition">
            それ、AIで解決できるかも。
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/faq" className="text-primary-600 font-medium">Q&A一覧</Link>
            <Link href="/chat" className="text-gray-600 hover:text-gray-900">AIに相談</Link>
            <Link href="/admin" className="text-gray-400 hover:text-gray-600">管理</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ページタイトル */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            {currentDomain ? (
              <>
                {(() => {
                  const Icon = iconMap[currentDomain.icon as keyof typeof iconMap];
                  return Icon ? <Icon className="w-8 h-8 text-primary-600" /> : null;
                })()}
                <span>{currentDomain.nameJa}</span>
              </>
            ) : keyword ? (
              <>
                <Key className="w-8 h-8 text-primary-600" />
                <span>{keyword}</span>
              </>
            ) : (
              'Q&A一覧'
            )}
          </h1>
          <p className="text-gray-600">
            {faqs.length}件の悩みが見つかりました
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバー（フィルター） */}
          <aside className="lg:w-72 flex-shrink-0 space-y-6">
            {/* 検索 */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-200">
              <form action="/faq" method="get">
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="キーワードで検索..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* 領域フィルター */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                領域で絞り込み
              </h3>
              <div className="space-y-2">
                <Link
                  href="/faq"
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${
                    !domain && !keyword ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  すべて
                </Link>
                {domains.map((d) => {
                  const Icon = iconMap[d.icon as keyof typeof iconMap];
                  return (
                    <Link
                      key={d.slug}
                      href={`/faq?domain=${d.slug}`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                        domain === d.slug ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      <span>{d.nameJa}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* キーワードフィルター */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-primary-600" />
                解決キーワード
              </h3>
              <div className="flex flex-wrap gap-2">
                {keywordCategories.map((k) => (
                  <Link
                    key={k}
                    href={`/faq?keyword=${k}`}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition shadow-sm ${
                      keyword === k
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700 hover:scale-105'
                    }`}
                  >
                    {k}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* FAQ一覧 */}
          <div className="flex-1">
            {faqs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>該当する悩みが見つかりませんでした</p>
                <Link href="/faq" className="text-primary-600 hover:underline mt-2 inline-block">
                  すべてのQ&Aを見る
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <Link
                    key={faq.id}
                    href={`/faq/${faq.id}`}
                    className="block relative group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.01] overflow-hidden border border-gray-200">
                      {/* 上部カラーヘッダー */}
                      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const Icon = faq.domain?.emoji ? iconMap[faq.domain.emoji as keyof typeof iconMap] : null;
                            return Icon ? (
                              <div className="bg-white/20 p-1.5 rounded-lg">
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                            ) : null;
                          })()}
                          <span className="text-white font-bold text-sm">{faq.domain?.nameJa}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {faq.keywords?.slice(0, 2).map(({ keyword: kw }) => (
                            <span
                              key={kw.id}
                              className="text-xs font-bold bg-white text-primary-600 px-2.5 py-1 rounded-full"
                            >
                              {kw.category}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* コンテンツ部分 */}
                      <div className="p-4">
                        {/* 質問 */}
                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition mb-3 line-clamp-2 leading-snug">
                          {faq.question}
                        </h2>

                        {/* もっと見る */}
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-primary-600 group-hover:translate-x-2 transition-transform flex items-center gap-1">
                            詳しく見る
                            <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AIチャットへの誘導 */}
        <div className="mt-12 relative bg-gradient-to-r from-primary-600 via-primary-500 to-blue-500 rounded-3xl p-12 text-center shadow-2xl overflow-hidden">
          {/* 背景装飾 */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <MessageCircle className="w-8 h-8 text-white" />
              <p className="text-2xl font-bold text-white">
                探している悩みが見つからない？
              </p>
            </div>
            <p className="text-primary-100 mb-6 text-lg">
              AIがあなたの具体的な状況をヒアリングして、最適な解決策を提案します
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-3 bg-white text-primary-600 px-10 py-4 rounded-full hover:bg-gray-50 transition text-xl font-bold shadow-xl transform hover:scale-105"
            >
              AIに相談してみる
              <span className="text-2xl">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="border-t bg-gray-50 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
          <p>© 2024 Media Confidence Inc. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
