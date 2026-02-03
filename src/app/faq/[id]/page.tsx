import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';
import { Megaphone, Palette, Briefcase, MessageCircle, Users, BookOpen, BarChart3, HelpCircle, Lightbulb, Key } from 'lucide-react';
import './animations.css';

const iconMap = {
  'Megaphone': Megaphone,
  'Palette': Palette,
  'Briefcase': Briefcase,
  'MessageCircle': MessageCircle,
  'Users': Users,
  'BookOpen': BookOpen,
  'BarChart3': BarChart3,
};

interface Props {
  params: Promise<{ id: string }>;
}

async function getFaq(id: string) {
  const faq = await prisma.faq.findUnique({
    where: { id },
    include: {
      domain: true,
      keywords: {
        include: {
          keyword: true,
        },
      },
    },
  });

  return faq;
}

async function getRelatedFaqs(domainId: string, currentId: string) {
  const faqs = await prisma.faq.findMany({
    where: {
      domainId,
      id: { not: currentId },
      status: 'published',
    },
    include: {
      domain: true,
      keywords: {
        include: {
          keyword: true,
        },
      },
    },
    take: 3,
    orderBy: { order: 'asc' },
  });

  return faqs;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const faq = await getFaq(id);

  if (!faq) {
    return {
      title: 'Q&A が見つかりません | AI Solution Hint',
    };
  }

  return {
    title: `${faq.question.slice(0, 50)}... | AI Solution Hint`,
    description: faq.answer.slice(0, 160),
  };
}

export default async function FaqDetailPage({ params }: Props) {
  const { id } = await params;
  const faq = await getFaq(id);

  if (!faq) {
    notFound();
  }

  const relatedFaqs = await getRelatedFaqs(faq.domainId, faq.id);

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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center gap-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-primary-600">トップ</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/faq" className="hover:text-primary-600">Q&A一覧</Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/faq?domain=${faq.domain?.slug}`} className="hover:text-primary-600">
                {faq.domain?.nameJa}
              </Link>
            </li>
          </ol>
        </nav>

        {/* タグ */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {(() => {
              const Icon = faq.domain?.emoji ? iconMap[faq.domain.emoji as keyof typeof iconMap] : null;
              return Icon ? <Icon className="w-4 h-4" /> : null;
            })()}
            {faq.domain?.nameJa}
          </span>
          {faq.keywords?.slice(0, 3).map(({ keyword: kw }) => (
            <Link
              key={kw.id}
              href={`/faq?keyword=${kw.category}`}
              className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm hover:bg-primary-100 transition"
            >
              {kw.name}
            </Link>
          ))}
        </div>

        {/* 2カラムレイアウト：質問と解決策 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 左：悩み（質問） - ダークで重厚感 */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-10 shadow-2xl overflow-hidden">
            {/* 背景パターン */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-500 p-3 rounded-xl">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-red-400">こんな悩み、ありませんか？</h2>
              </div>

              <h1 className="text-2xl font-bold text-white leading-relaxed mb-8 typing-text">
                {faq.question}
              </h1>

              {/* 詳細エピソード */}
              {faq.episode && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 fade-in-episode">
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {faq.episode}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 右：解決策（回答） - 明るく爽やか */}
          <div className="relative bg-gradient-to-br from-blue-50 via-primary-50 to-cyan-50 rounded-3xl p-10 shadow-2xl overflow-hidden border-2 border-primary-200 right-column-hidden">
            {/* 背景の装飾 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-xl shadow-lg icon-bounce">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-primary-700">AIでこう解決できます</h2>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg mb-6 border border-primary-100">
                <ul className="space-y-4">
                  {faq.answer.split('。').filter(sentence => sentence.trim()).slice(0, 3).map((sentence, index) => (
                    <li key={index} className={`flex items-start gap-3 slide-in-solution solution-item-${index + 1}`}>
                      <span className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm mt-1">
                        {index + 1}
                      </span>
                      <span className="text-gray-900 text-lg leading-relaxed font-medium flex-1">
                        {sentence.trim()}。
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AIチャットへの誘導 */}
              <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-blue-500 text-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-start gap-4 mb-4">
                  <MessageCircle className="w-10 h-10 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-xl mb-2">もっと詳しく相談したい？</h3>
                    <p className="text-white/90">
                      AIがあなたの具体的な状況をヒアリングし、最適な解決策を提案します。
                    </p>
                  </div>
                </div>
                <Link
                  href="/chat"
                  className="block text-center bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-lg transform hover:scale-105"
                >
                  AIに相談する
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 解決キーワード詳細 */}
        {faq.keywords && faq.keywords.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
            <h3 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-3">
              <Key className="w-6 h-6 text-primary-600" />
              関連する解決キーワード
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {faq.keywords.map(({ keyword: kw }) => (
                <Link
                  key={kw.id}
                  href={`/faq?keyword=${kw.category}`}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition group"
                >
                  <div className="font-medium text-gray-900 group-hover:text-primary-600 transition">
                    {kw.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {kw.category}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 関連する悩み */}
        {relatedFaqs.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {faq.domain?.nameJa}のほかの悩み
            </h2>
            <div className="space-y-4">
              {relatedFaqs.map((related) => (
                <Link
                  key={related.id}
                  href={`/faq/${related.id}`}
                  className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-primary-200 transition group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {related.keywords?.slice(0, 2).map(({ keyword: kw }) => (
                      <span
                        key={kw.id}
                        className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded"
                      >
                        {kw.category}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-gray-900 group-hover:text-primary-600 transition line-clamp-2">
                    {related.question}
                  </h3>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href={`/faq?domain=${faq.domain?.slug}`}
                className="text-primary-600 hover:underline"
              >
                {faq.domain?.nameJa}のすべての悩みを見る →
              </Link>
            </div>
          </section>
        )}
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
