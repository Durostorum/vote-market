import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user1 = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: hashedPassword,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      passwordHash: hashedPassword,
    },
  })

  // Create RSS feeds
  const techFeed = await prisma.rssFeed.upsert({
    where: { url: 'https://techcrunch.com/feed/' },
    update: {},
    create: {
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      category: 'TECH',
    },
  })

  const worldFeed = await prisma.rssFeed.upsert({
    where: { url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
    update: {},
    create: {
      name: 'BBC World',
      url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
      category: 'WORLD',
    },
  })

  // Create sample topics
  const topic1 = await prisma.topic.create({
    data: {
      title: 'AI Breakthrough in Natural Language Processing',
      description: 'Researchers achieve new milestone in language understanding capabilities',
      slug: 'ai-breakthrough-nlp',
      category: 'TECH',
      sourceUrl: 'https://example.com/ai-breakthrough',
      promotedById: user1.id,
      upCount: 42,
      downCount: 8,
    },
  })

  const topic2 = await prisma.topic.create({
    data: {
      title: 'Global Climate Summit Reaches Agreement',
      description: 'World leaders commit to new carbon reduction targets',
      slug: 'climate-summit-agreement',
      category: 'WORLD',
      sourceUrl: 'https://example.com/climate-summit',
      promotedById: user2.id,
      upCount: 35,
      downCount: 12,
    },
  })

  const topic3 = await prisma.topic.create({
    data: {
      title: 'New Programming Language Gains Popularity',
      description: 'Developers flock to new language with improved performance',
      slug: 'new-language-popularity',
      category: 'TECH',
      sourceUrl: 'https://example.com/new-language',
      promotedById: user1.id,
      upCount: 28,
      downCount: 5,
    },
  })

  // Create votes
  await prisma.vote.create({
    data: {
      userId: user1.id,
      topicId: topic1.id,
      direction: 'UP',
    },
  })

  await prisma.vote.create({
    data: {
      userId: user2.id,
      topicId: topic2.id,
      direction: 'UP',
    },
  })

  // Create comments
  await prisma.comment.create({
    data: {
      userId: user1.id,
      topicId: topic1.id,
      body: 'This is a significant development in the field. Looking forward to seeing the applications.',
    },
  })

  await prisma.comment.create({
    data: {
      userId: user2.id,
      topicId: topic1.id,
      body: 'Agreed. The implications for various industries could be transformative.',
    },
  })

  console.log('Seed data created successfully')
  console.log({ user1, user2, topic1, topic2, topic3 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
