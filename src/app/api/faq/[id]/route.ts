import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
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

    if (!faq) {
      return NextResponse.json(
        { success: false, error: 'FAQ が見つかりません' },
        { status: 404 }
      );
    }

    // 同じ領域の関連FAQ（自身を除く）
    const relatedFaqs = await prisma.faq.findMany({
      where: {
        domainId: faq.domainId,
        id: { not: faq.id },
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

    return NextResponse.json({
      success: true,
      data: faq,
      related: relatedFaqs,
    });
  } catch (error) {
    console.error('FAQ詳細取得エラー:', error);
    return NextResponse.json(
      { success: false, error: 'FAQ の取得に失敗しました' },
      { status: 500 }
    );
  }
}
