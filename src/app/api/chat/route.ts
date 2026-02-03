import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Claude API クライアント
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 領域情報
const domains = [
  { slug: 'marketing', name: 'マーケティング', icon: 'Megaphone' },
  { slug: 'design', name: 'デザイン・Web制作', icon: 'Palette' },
  { slug: 'sales', name: '営業', icon: 'Briefcase' },
  { slug: 'cs', name: 'カスタマーサポート', icon: 'MessageCircle' },
  { slug: 'recruiting', name: '採用', icon: 'Users' },
  { slug: 'education', name: '教育・研修', icon: 'BookOpen' },
  { slug: 'planning', name: '経営企画', icon: 'BarChart3' },
];

// 解決キーワードカテゴリ
const keywordCategories = [
  '効率化', '平準化', '正確化', '即時キャッチアップ',
  '属人化解消', '個別最適化', '可視化', '自動生成'
];

// システムプロンプト
const systemPrompt = `あなたは「メディア・コンフィデンス」の課題診断AIアシスタントです。
中小企業（〜100名規模）の業務課題をヒアリングし、AIで解決できる可能性を提案します。

## あなたの役割
1. ユーザーの悩み・課題を丁寧にヒアリング
2. 具体的な状況を深掘り（どんな業務？頻度は？困っていること？）
3. 該当する課題領域と解決キーワードを特定
4. マッチするFAQ（Q&A）があれば紹介

## 対応可能な7つの領域
${domains.map(d => `- ${d.name}（${d.slug}）`).join('\n')}

## 解決キーワード（AIでできること）
${keywordCategories.map(k => `- ${k}`).join('\n')}

## 会話のルール
- 親しみやすく、でもプロフェッショナルに
- 専門用語は避け、わかりやすい言葉で
- 一度に多くの質問をしない（1〜2問ずつ）
- ユーザーの悩みに共感を示す
- 最終的に「この悩みはAIで解決できます」と希望を持たせる

## 回答フォーマット
ヒアリング中は普通に会話してください。
課題が特定できたら、以下のJSON形式で診断結果を含めてください：

\`\`\`diagnosis
{
  "domain": "領域のslug（marketing, design, sales, cs, recruiting, education, planning）",
  "keywords": ["該当する解決キーワード"],
  "summary": "課題の要約（1〜2文）"
}
\`\`\`

この診断結果を含めると、システムが自動で関連するFAQを表示します。

## 最初の挨拶
最初のメッセージでは、自己紹介と「どんなお悩みがありますか？」と聞いてください。`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'APIキーが設定されていません' },
        { status: 500 }
      );
    }

    // Claude API 呼び出し
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    const contentBlock = response.content[0];
    const assistantMessage = contentBlock.type === 'text' ? contentBlock.text : '';

    // 診断結果を抽出
    const diagnosisMatch = assistantMessage.match(/```diagnosis\n([\s\S]*?)\n```/);
    let diagnosis = null;
    let matchedFaqs: unknown[] = [];

    if (diagnosisMatch) {
      try {
        diagnosis = JSON.parse(diagnosisMatch[1]);

        // マッチするFAQを検索
        if (diagnosis.domain) {
          const faqs = await prisma.faq.findMany({
            where: {
              status: 'published',
              domain: {
                slug: diagnosis.domain,
              },
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
          matchedFaqs = faqs;
        }
      } catch {
        // JSON パースエラーは無視
      }
    }

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      diagnosis,
      matchedFaqs,
    });
  } catch (error) {
    console.error('Chat API エラー:', error);
    return NextResponse.json(
      { success: false, error: 'チャットの処理に失敗しました' },
      { status: 500 }
    );
  }
}
