import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // クエリパラメータ
  const domain = searchParams.get('domain');
  const keyword = searchParams.get('keyword');
  const search = searchParams.get('search');
  const status = searchParams.get('status') || 'published';

  try {
    const faqs = await prisma.faq.findMany({
      where: {
        status: status,
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

    return NextResponse.json({
      success: true,
      data: faqs,
      count: faqs.length,
    });
  } catch (error) {
    console.error('FAQ取得エラー:', error);
    return NextResponse.json(
      { success: false, error: 'FAQ の取得に失敗しました' },
      { status: 500 }
    );
  }
}
