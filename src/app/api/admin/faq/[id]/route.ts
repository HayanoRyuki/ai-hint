import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// FAQ詳細取得
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

    return NextResponse.json({ success: true, data: faq });
  } catch (error) {
    console.error('FAQ取得エラー:', error);
    return NextResponse.json(
      { success: false, error: 'FAQ の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// FAQ更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { domainId, question, answer, status, keywordIds } = body;

    // 更新データを構築
    const updateData: Record<string, unknown> = {};
    if (domainId !== undefined) updateData.domainId = domainId;
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (status !== undefined) updateData.status = status;

    // FAQ更新
    const faq = await prisma.faq.update({
      where: { id },
      data: updateData,
    });

    // キーワード更新（指定された場合）
    if (keywordIds !== undefined) {
      // 既存のキーワード紐付けを削除
      await prisma.faqKeyword.deleteMany({
        where: { faqId: id },
      });

      // 新しいキーワード紐付けを作成
      if (keywordIds.length > 0) {
        await prisma.faqKeyword.createMany({
          data: keywordIds.map((keywordId: string) => ({
            faqId: id,
            keywordId,
          })),
        });
      }
    }

    return NextResponse.json({ success: true, data: faq });
  } catch (error) {
    console.error('FAQ更新エラー:', error);
    return NextResponse.json(
      { success: false, error: 'FAQ の更新に失敗しました' },
      { status: 500 }
    );
  }
}

// FAQ削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // キーワード紐付けを先に削除
    await prisma.faqKeyword.deleteMany({
      where: { faqId: id },
    });

    // FAQ削除
    await prisma.faq.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('FAQ削除エラー:', error);
    return NextResponse.json(
      { success: false, error: 'FAQ の削除に失敗しました' },
      { status: 500 }
    );
  }
}
