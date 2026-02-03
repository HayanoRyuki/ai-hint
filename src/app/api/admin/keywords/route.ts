import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// キーワード一覧取得
export async function GET() {
  try {
    const keywords = await prisma.keyword.findMany({
      orderBy: { category: 'asc' },
    });

    return NextResponse.json({ success: true, data: keywords });
  } catch (error) {
    console.error('キーワード取得エラー:', error);
    return NextResponse.json(
      { success: false, error: 'キーワードの取得に失敗しました' },
      { status: 500 }
    );
  }
}
