import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// FAQ一覧取得（管理用：すべてのステータス含む）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  try {
    const faqs = await prisma.faq.findMany({
      where: {
        ...(domain && {
          domain: { slug: domain },
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

    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error('FAQ取得エラー:', error);
    return NextResponse.json(
      { success: false, error: 'FAQ の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// FAQ新規作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domainId, question, answer, status, keywordIds } = body;

    // 現在の最大orderを取得
    const maxOrder = await prisma.faq.aggregate({
      where: { domainId },
      _max: { order: true },
    });

    const newOrder = (maxOrder._max.order || 0) + 1;

    // FAQ作成
    const faq = await prisma.faq.create({
      data: {
        domainId,
        question,
        answer,
        status: status || 'draft',
        order: newOrder,
      },
    });

    // キーワード紐付け
    if (keywordIds && keywordIds.length > 0) {
      await prisma.faqKeyword.createMany({
        data: keywordIds.map((keywordId: string) => ({
          faqId: faq.id,
          keywordId,
        })),
      });
    }

    return NextResponse.json({ success: true, data: faq });
  } catch (error) {
    console.error('FAQ作成エラー:', error);
    return NextResponse.json(
      { success: false, error: 'FAQ の作成に失敗しました' },
      { status: 500 }
    );
  }
}
