const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const faq = await prisma.faq.findFirst({
    include: { domain: true }
  });
  console.log('FAQ ID:', faq.id);
  console.log('Question:', faq.question.substring(0, 50) + '...');
  console.log('Episode exists:', !!faq.episode);
  console.log('Episode preview:', faq.episode ? faq.episode.substring(0, 100) + '...' : 'NULL');
  await prisma.$disconnect();
}

check().catch(console.error);
