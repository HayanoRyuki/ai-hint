import { PrismaClient } from '@prisma/client';
import seedData from '../data/faq-seed.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 既存データをクリア（開発用）
  await prisma.faqKeyword.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.keyword.deleteMany();
  await prisma.domain.deleteMany();
  await prisma.chatLog.deleteMany();

  console.log('  ✓ Cleared existing data');

  // 領域マスタを作成
  const domainMap = new Map<string, string>();
  for (const domain of seedData.domains) {
    const created = await prisma.domain.create({
      data: {
        slug: domain.slug,
        name: domain.name,
        nameJa: domain.nameJa,
        emoji: (domain as any).icon || (domain as any).emoji,
      },
    });
    domainMap.set(domain.slug, created.id);
  }
  console.log(`  ✓ Created ${seedData.domains.length} domains`);

  // 解決キーワードマスタを作成
  const keywordMap = new Map<string, string>();
  for (const keyword of seedData.keywords) {
    const created = await prisma.keyword.create({
      data: {
        slug: keyword.slug,
        name: keyword.name,
        category: keyword.category,
      },
    });
    keywordMap.set(keyword.slug, created.id);
  }
  console.log(`  ✓ Created ${seedData.keywords.length} keywords`);

  // Q&Aを作成
  let faqCount = 0;
  for (const faq of seedData.faqs) {
    const domainId = domainMap.get(faq.domainSlug);
    if (!domainId) {
      console.warn(`  ⚠ Domain not found: ${faq.domainSlug}`);
      continue;
    }

    const created = await prisma.faq.create({
      data: {
        domainId,
        question: faq.question,
        episode: faq.episode,
        answer: faq.answer,
        status: 'published',
        order: faqCount,
      },
    });

    // キーワードとの紐付け
    for (const keywordSlug of faq.keywordSlugs) {
      const keywordId = keywordMap.get(keywordSlug);
      if (keywordId) {
        await prisma.faqKeyword.create({
          data: {
            faqId: created.id,
            keywordId,
          },
        });
      }
    }

    faqCount++;
  }
  console.log(`  ✓ Created ${faqCount} FAQs with keyword relations`);

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
