import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = "http://localhost:4321";
const MOCKUPS_DIR = join(__dirname, "..", "docs", "mockups");

const pages = [
  { name: "login", path: "/login.html", viewports: [{ w: 1280, h: 800 }, { w: 390, h: 844 }] },
  { name: "signup", path: "/signup.html", viewports: [{ w: 1280, h: 800 }, { w: 390, h: 844 }] },
  { name: "feed", path: "/feed.html", viewports: [{ w: 1280, h: 900 }] },
  { name: "feed-tech", path: "/feed-tech.html", viewports: [{ w: 1280, h: 900 }] },
  { name: "topic-detail", path: "/topic-detail.html", viewports: [{ w: 1280, h: 900 }, { w: 390, h: 844 }] },
  { name: "news", path: "/news.html", viewports: [{ w: 390, h: 844 }] },
];

async function captureMockups() {
  await mkdir(MOCKUPS_DIR, { recursive: true });
  
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
  });

  for (const page of pages) {
    for (const vp of page.viewports) {
      console.log(`Capturing ${page.name} at ${vp.w}x${vp.h}...`);
      
      const tab = await browser.newPage();
      await tab.setViewport({ width: vp.w, height: vp.h });
      
      try {
        await tab.goto(`${BASE_URL}${page.path}`, { waitUntil: "networkidle0", timeout: 30000 });
        await tab.screenshot({ 
          path: join(MOCKUPS_DIR, `${page.name}-${vp.w}x${vp.h}.png`), 
          fullPage: true 
        });
        console.log(`✓ Saved ${page.name}-${vp.w}x${vp.h}.png`);
      } catch (error) {
        console.error(`✗ Failed to capture ${page.name} at ${vp.w}x${vp.h}:`, error.message);
      }
      
      await tab.close();
    }
  }

  await browser.close();
  console.log("\nMockup capture complete!");
}

captureMockups().catch(console.error);
