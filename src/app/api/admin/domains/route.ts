import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ビルド時の静的生成をスキップ
export const dynamic = 'force-dynamic';

// 領域一覧取得
export async function GET() {
  try {
    const domains = await prisma.domain.findMany({
      orderBy: { slug: 'asc' },
    });

    return NextResponse.json({ success: true, data: domains });
  } catch (error) {
    console.error('領域取得エラー:', error);
    return NextResponse.json(
      { success: false, error: '領域の取得に失敗しました' },
      { status: 500 }
    );
  }
}
