import { Megaphone, Palette, Briefcase, MessageCircle, Users, BookOpen, BarChart3, User, UserCircle, UserCheck, UserCog, UserPlus, UserSquare } from 'lucide-react';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const iconMap = {
  'Megaphone': Megaphone,
  'Palette': Palette,
  'Briefcase': Briefcase,
  'MessageCircle': MessageCircle,
  'Users': Users,
  'BookOpen': BookOpen,
  'BarChart3': BarChart3,
};

const personIconMap = {
  'marketing': User,
  'design': UserCircle,
  'sales': UserCheck,
  'cs': UserCog,
  'recruiting': UserPlus,
  'education': UserSquare,
  'planning': User,
};

export default async function Home() {
  // 新着FAQを取得
  const recentFaqs = await prisma.faq.findMany({
    where: { status: 'published' },
    include: {
      domain: true,
      keywords: {
        include: {
          keyword: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ヘッダー */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            それ、AIで解決できるかも。
          </h1>
          <nav className="flex gap-6 text-sm">
            <a href="/faq" className="text-gray-600 hover:text-gray-900">Q&A一覧</a>
            <a href="/chat" className="text-gray-600 hover:text-gray-900">AIに相談</a>
          </nav>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="bg-gradient-to-r from-primary-600 via-blue-600 to-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              業務の困りごと、<br className="sm:hidden" />ここで解決。
            </h2>
            <p className="text-lg md:text-xl text-primary-50">
              悩みを検索、またはAIに相談。あなたの課題に合った解決策を見つけます。
            </p>
          </div>

          {/* 新着ケーススライダー */}
          <div className="relative overflow-hidden py-4">
            <div className="flex gap-6 animate-scroll hover:[animation-play-state:paused]">
              {/* カード1セット目 */}
              {recentFaqs.map((faq) => {
                const Icon = faq.domain?.emoji ? iconMap[faq.domain.emoji as keyof typeof iconMap] : null;
                const PersonIcon = faq.domain?.slug ? personIconMap[faq.domain.slug as keyof typeof personIconMap] : User;
                return (
                  <Link
                    key={faq.id}
                    href={`/faq/${faq.id}`}
                    className="flex-shrink-0 w-[340px] bg-white/95 backdrop-blur-sm rounded-xl p-6 hover:bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative"
                  >
                    {/* 新着バッジ（右上） */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      NEW
                    </div>

                    {/* 領域アイコンとラベル */}
                    <div className="flex items-center gap-2 mb-3">
                      {Icon && <Icon className="w-4 h-4 text-primary-600" />}
                      <span className="text-xs font-medium text-primary-600">
                        {faq.domain?.nameJa}
                      </span>
                    </div>

                    {/* 質問タイトル */}
                    <h3 className="text-lg font-bold text-gray-900 mb-auto line-clamp-3 group-hover:text-primary-600 transition leading-relaxed">
                      {faq.question}
                    </h3>

                    {/* 下部エリア：人のアイコンとキーワードタグ */}
                    <div className="flex items-end justify-between mt-4">
                      {/* 人のアイコン（左下） */}
                      <div className="relative bg-primary-100 rounded-full p-2 shadow-sm inline-block">
                        <PersonIcon className="w-4 h-4 text-primary-600" />
                        <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-primary-100 rotate-45 rounded-sm"></div>
                      </div>

                      {/* キーワードタグ（右下） */}
                      <div className="flex flex-wrap gap-1 justify-end">
                        {faq.keywords.slice(0, 2).map((kw) => (
                          <span key={kw.keyword.id} className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                            #{kw.keyword.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
              {/* カード2セット目（無限ループ用） */}
              {recentFaqs.map((faq) => {
                const Icon = faq.domain?.emoji ? iconMap[faq.domain.emoji as keyof typeof iconMap] : null;
                const PersonIcon = faq.domain?.slug ? personIconMap[faq.domain.slug as keyof typeof personIconMap] : User;
                return (
                  <Link
                    key={`duplicate-${faq.id}`}
                    href={`/faq/${faq.id}`}
                    className="flex-shrink-0 w-[340px] bg-white/95 backdrop-blur-sm rounded-xl p-6 hover:bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative"
                  >
                    {/* 新着バッジ（右上） */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      NEW
                    </div>

                    {/* 領域アイコンとラベル */}
                    <div className="flex items-center gap-2 mb-3">
                      {Icon && <Icon className="w-4 h-4 text-primary-600" />}
                      <span className="text-xs font-medium text-primary-600">
                        {faq.domain?.nameJa}
                      </span>
                    </div>

                    {/* 質問タイトル */}
                    <h3 className="text-lg font-bold text-gray-900 mb-auto line-clamp-3 group-hover:text-primary-600 transition leading-relaxed">
                      {faq.question}
                    </h3>

                    {/* 下部エリア：人のアイコンとキーワードタグ */}
                    <div className="flex items-end justify-between mt-4">
                      {/* 人のアイコン（左下） */}
                      <div className="relative bg-primary-100 rounded-full p-2 shadow-sm inline-block">
                        <PersonIcon className="w-4 h-4 text-primary-600" />
                        <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-primary-100 rotate-45 rounded-sm"></div>
                      </div>

                      {/* キーワードタグ（右下） */}
                      <div className="flex flex-wrap gap-1 justify-end">
                        {faq.keywords.slice(0, 2).map((kw) => (
                          <span key={kw.keyword.id} className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                            #{kw.keyword.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* メインコンテンツ - 2カラム */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：領域から探す（2カラム分） */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              領域から探す
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'marketing', name: 'Marketing', nameJa: 'マーケティング', icon: 'Megaphone' },
            { id: 'design', name: 'Design / Web', nameJa: 'デザイン・Web制作', icon: 'Palette' },
            { id: 'sales', name: 'Sales', nameJa: '営業', icon: 'Briefcase' },
            { id: 'cs', name: 'Customer Support', nameJa: 'カスタマーサポート', icon: 'MessageCircle' },
            { id: 'recruiting', name: 'Recruiting', nameJa: '採用', icon: 'Users' },
            { id: 'education', name: 'Education', nameJa: '教育・研修', icon: 'BookOpen' },
            { id: 'planning', name: 'Planning', nameJa: '経営企画', icon: 'BarChart3' },
          ].map((domain) => {
            const Icon = iconMap[domain.icon as keyof typeof iconMap];
            return (
              <a
                key={domain.id}
                href={`/faq?domain=${domain.id}`}
                className="bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100 rounded-xl p-6 hover:shadow-lg hover:from-primary-100 hover:to-blue-100 transition group"
              >
                <Icon className="w-8 h-8 mb-3 text-primary-600" />
                <h4 className="font-bold text-gray-900 group-hover:text-primary-700 transition">
                  {domain.name}
                </h4>
                <p className="text-sm text-gray-600">{domain.nameJa}</p>
              </a>
            );
          })}
            </div>
          </div>

          {/* 右側：AIチャット */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-primary-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
                <MessageCircle className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">
                  AIに相談する
                </h3>
                <p className="mb-6 text-primary-50">
                  何から探せばいいかわからない？AIがあなたの悩みを聞いて、最適な解決策を提案します。
                </p>
                <a
                  href="/chat"
                  className="block w-full bg-white text-primary-600 text-center px-6 py-3 rounded-xl hover:bg-primary-50 transition font-medium shadow-lg"
                >
                  AIに相談してみる →
                </a>
              </div>

              {/* 検索ボックス */}
              <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-3">キーワード検索</h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="悩みを検索..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm">
                    検索
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 解決キーワードから探す */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          解決キーワードから探す
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            '効率化', '平準化', '正確化', '即時キャッチアップ',
            '属人化解消', '個別最適化', '可視化', '自動生成'
          ].map((keyword) => (
            <a
              key={keyword}
              href={`/faq?keyword=${keyword}`}
              className="px-5 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition"
            >
              {keyword}
            </a>
          ))}
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t bg-gray-50 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
          <p>© 2024 Media Confidence Inc. All rights reserved.</p>
          <p className="mt-2">
            このサイト自体が、私たちが提供するAIシステムのデモです。
          </p>
        </div>
      </footer>
    </main>
  );
}
