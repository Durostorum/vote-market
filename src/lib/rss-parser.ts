import Parser from "rss-parser"
import { prisma } from "./db"

const parser = new Parser()

const RSS_FEEDS = [
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "TECH",
  },
  {
    name: "BBC World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    category: "WORLD",
  },
  {
    name: "BBC Technology",
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    category: "TECH",
  },
  {
    name: "Reuters Technology",
    url: "https://www.reuters.com/rssFeed/technologyNews",
    category: "TECH",
  },
]

export async function syncRSSFeeds() {
  console.log("Starting RSS feed sync...")

  for (const feedConfig of RSS_FEEDS) {
    try {
      console.log(`Fetching ${feedConfig.name}...`)
      
      // Get or create RSS feed in database
      const feed = await prisma.rssFeed.upsert({
        where: { url: feedConfig.url },
        update: {},
        create: {
          name: feedConfig.name,
          url: feedConfig.url,
          category: feedConfig.category,
        },
      })

      // Parse RSS feed
      const feedData = await parser.parseURL(feedConfig.url)
      
      let newArticlesCount = 0

      for (const item of feedData.items) {
        if (!item.guid || !item.link || !item.title) continue

        // Check if article already exists
        const existing = await prisma.newsArticle.findUnique({
          where: {
            feedId_guid: {
              feedId: feed.id,
              guid: item.guid,
            },
          },
        })

        if (existing) continue

        // Create new article
        await prisma.newsArticle.create({
          data: {
            feedId: feed.id,
            guid: item.guid,
            title: item.title,
            summary: item.contentSnippet || item.content || null,
            link: item.link,
            imageUrl: extractImageUrl(item),
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          },
        })

        newArticlesCount++
      }

      // Update last fetched timestamp
      await prisma.rssFeed.update({
        where: { id: feed.id },
        data: { lastFetchedAt: new Date() },
      })

      console.log(`${feedConfig.name}: ${newArticlesCount} new articles`)
    } catch (error) {
      console.error(`Error fetching ${feedConfig.name}:`, error)
    }
  }

  console.log("RSS feed sync completed")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractImageUrl(item: any): string | null {
  // Try to extract image from various RSS feed formats
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image/")) {
    return item.enclosure.url
  }
  
  if (item["media:content"]?.url) {
    return item["media:content"].url
  }
  
  if (item["media:thumbnail"]?.url) {
    return item["media:thumbnail"].url
  }
  
  // Try to extract from content
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^"]+)"/)
    if (imgMatch) return imgMatch[1]
  }
  
  return null
}
