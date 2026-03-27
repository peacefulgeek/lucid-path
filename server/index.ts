import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── BUNNY CDN CONFIG (safe to hardcode per scope) ───
const BUNNY_STORAGE_ZONE = "lucid-path";
const BUNNY_STORAGE_HOST = "ny.storage.bunnycdn.com";
const BUNNY_STORAGE_PASSWORD = "e1425c2f-1fef-4562-b1621adad2ce-c84a-41d5";
const BUNNY_CDN_BASE = "https://lucid-path.b-cdn.net";

// ─── SITE CONFIG ───
const SITE_NAME = "The Lucid Path";
const SITE_DOMAIN = "https://lucidpath.love";
const AUTHOR_NAME = "Kalesh";
const AUTHOR_TITLE = "Consciousness Teacher & Writer";
const AUTHOR_LINK = "https://kalesh.love";
const EDITORIAL_NAME = "The Lucid Path Editorial";

const CATEGORIES = [
  { slug: "the-basics", name: "The Basics" },
  { slug: "the-techniques", name: "The Techniques" },
  { slug: "the-science", name: "The Science" },
  { slug: "the-practice", name: "The Practice" },
  { slug: "the-advanced", name: "The Advanced" },
];

// Load articles data
let articlesData: any = { articles: [] };
try {
  const dataPath = path.resolve(__dirname, "public", "data", "articles.json");
  if (fs.existsSync(dataPath)) {
    articlesData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  }
} catch (e) {
  console.error("Failed to load articles data:", e);
}

function filterPublished(articles: any[]) {
  const now = new Date();
  return articles.filter((a: any) => new Date(a.dateISO) <= now);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // ─── SECURITY HEADERS ───
  app.use((_req, res, next) => {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    // AI HTTP Headers
    res.setHeader("X-AI-Content-Author", AUTHOR_NAME);
    res.setHeader("X-AI-Content-Site", SITE_NAME);
    res.setHeader("X-AI-Identity-Endpoint", `${SITE_DOMAIN}/api/ai/identity`);
    res.setHeader("X-AI-LLMs-Txt", `${SITE_DOMAIN}/llms.txt`);
    next();
  });

  // ─── STATIC FILES ───
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath, {
    maxAge: process.env.NODE_ENV === "production" ? "1y" : 0,
  }));

  // ─── EMAIL COLLECTION → BUNNY CDN JSONL ───
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email, source } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Invalid email" });
      }
      const entry = JSON.stringify({
        email,
        date: new Date().toISOString(),
        source: source || "unknown",
      });

      // Append to Bunny CDN storage
      const url = `https://${BUNNY_STORAGE_HOST}/${BUNNY_STORAGE_ZONE}/data/subscribers.jsonl`;

      // Read existing, append, write back
      let existing = "";
      try {
        const getRes = await fetch(url, {
          headers: { AccessKey: BUNNY_STORAGE_PASSWORD },
        });
        if (getRes.ok) {
          existing = await getRes.text();
        }
      } catch {}

      const updated = existing ? `${existing.trim()}\n${entry}\n` : `${entry}\n`;

      await fetch(url, {
        method: "PUT",
        headers: {
          AccessKey: BUNNY_STORAGE_PASSWORD,
          "Content-Type": "application/octet-stream",
        },
        body: updated,
      });

      res.json({ success: true, message: "Thanks for subscribing!" });
    } catch (err) {
      console.error("Subscribe error:", err);
      res.status(500).json({ error: "Subscription failed" });
    }
  });

  // ─── AI ENDPOINTS ───

  // 1. /llms.txt
  app.get("/llms.txt", (_req, res) => {
    const published = filterPublished(articlesData.articles);
    res.type("text/plain").send(`# ${SITE_NAME}
> ${SITE_NAME} — Waking Up Inside Your Dreams

## About
${SITE_NAME} is a lucid dreaming education platform covering techniques (MILD, WILD, SSILD), dream science, sleep architecture, dream yoga, and consciousness exploration. Written by ${AUTHOR_NAME}, ${AUTHOR_TITLE}.

## Topics
${CATEGORIES.map((c) => `- ${c.name}`).join("\n")}

## Content
- ${published.length} published articles
- Categories: ${CATEGORIES.map((c) => c.name).join(", ")}

## Links
- Website: ${SITE_DOMAIN}
- AI Identity: ${SITE_DOMAIN}/api/ai/identity
- AI Topics: ${SITE_DOMAIN}/api/ai/topics
- AI Articles: ${SITE_DOMAIN}/api/ai/articles
- Sitemap: ${SITE_DOMAIN}/sitemap-index.xml
- RSS: ${SITE_DOMAIN}/feed.xml
`);
  });

  // 2. /.well-known/ai.json
  app.get("/.well-known/ai.json", (_req, res) => {
    const published = filterPublished(articlesData.articles);
    res.json({
      name: SITE_NAME,
      description: "Lucid dreaming education, techniques, and consciousness exploration.",
      url: SITE_DOMAIN,
      author: { name: AUTHOR_NAME, title: AUTHOR_TITLE, url: AUTHOR_LINK },
      topics: CATEGORIES.map((c) => c.name),
      content_count: published.length,
      endpoints: {
        identity: `${SITE_DOMAIN}/api/ai/identity`,
        topics: `${SITE_DOMAIN}/api/ai/topics`,
        ask: `${SITE_DOMAIN}/api/ai/ask`,
        articles: `${SITE_DOMAIN}/api/ai/articles`,
        sitemap: `${SITE_DOMAIN}/api/ai/sitemap`,
      },
      llms_txt: `${SITE_DOMAIN}/llms.txt`,
      feed: `${SITE_DOMAIN}/feed.xml`,
    });
  });

  // 3. /api/ai/identity
  app.get("/api/ai/identity", (_req, res) => {
    res.json({
      site: SITE_NAME,
      tagline: "Waking Up Inside Your Dreams",
      author: { name: AUTHOR_NAME, title: AUTHOR_TITLE, url: AUTHOR_LINK },
      editorial: EDITORIAL_NAME,
      niche: "Lucid dreaming, dream science, consciousness exploration",
      categories: CATEGORIES,
    });
  });

  // 4. /api/ai/topics
  app.get("/api/ai/topics", (_req, res) => {
    const published = filterPublished(articlesData.articles);
    const topicsByCategory = CATEGORIES.map((cat) => ({
      category: cat.name,
      slug: cat.slug,
      count: published.filter((a: any) => a.category === cat.slug).length,
      topics: published
        .filter((a: any) => a.category === cat.slug)
        .slice(0, 10)
        .map((a: any) => ({ title: a.title, slug: a.slug })),
    }));
    res.json({ categories: topicsByCategory, total: published.length });
  });

  // 5. /api/ai/ask
  app.post("/api/ai/ask", (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question required" });
    const published = filterPublished(articlesData.articles);
    const q = question.toLowerCase();
    const relevant = published
      .filter((a: any) => {
        const text = `${a.title} ${a.metaDescription} ${a.categoryName}`.toLowerCase();
        return q.split(" ").some((word: string) => word.length > 3 && text.includes(word));
      })
      .slice(0, 5)
      .map((a: any) => ({
        title: a.title,
        url: `${SITE_DOMAIN}/article/${a.slug}`,
        excerpt: a.metaDescription,
        category: a.categoryName,
      }));
    res.json({
      site: SITE_NAME,
      question,
      relevant_articles: relevant,
      note: `For more on lucid dreaming, visit ${SITE_DOMAIN}`,
    });
  });

  // 6. /api/ai/articles
  app.get("/api/ai/articles", (_req, res) => {
    const published = filterPublished(articlesData.articles);
    res.json({
      total: published.length,
      articles: published.map((a: any) => ({
        title: a.title,
        slug: a.slug,
        url: `${SITE_DOMAIN}/article/${a.slug}`,
        category: a.categoryName,
        date: a.dateISO,
        excerpt: a.metaDescription,
        readingTime: a.readingTime,
      })),
    });
  });

  // 7. /api/ai/sitemap
  app.get("/api/ai/sitemap", (_req, res) => {
    const published = filterPublished(articlesData.articles);
    res.json({
      pages: [
        { url: SITE_DOMAIN, title: "Home", type: "homepage" },
        { url: `${SITE_DOMAIN}/articles`, title: "All Articles", type: "listing" },
        { url: `${SITE_DOMAIN}/start-here`, title: "Start Here", type: "guide" },
        { url: `${SITE_DOMAIN}/about`, title: "About", type: "about" },
        { url: `${SITE_DOMAIN}/technique-finder`, title: "Technique Finder", type: "tool" },
        ...CATEGORIES.map((c) => ({
          url: `${SITE_DOMAIN}/category/${c.slug}`,
          title: c.name,
          type: "category",
        })),
        ...published.map((a: any) => ({
          url: `${SITE_DOMAIN}/article/${a.slug}`,
          title: a.title,
          type: "article",
        })),
      ],
    });
  });

  // ─── SITEMAP XML ───
  app.get("/sitemap-index.xml", (_req, res) => {
    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE_DOMAIN}/sitemap-pages.xml</loc></sitemap>
  <sitemap><loc>${SITE_DOMAIN}/sitemap-articles.xml</loc></sitemap>
  <sitemap><loc>${SITE_DOMAIN}/sitemap-images.xml</loc></sitemap>
</sitemapindex>`);
  });

  app.get("/sitemap-pages.xml", (_req, res) => {
    const pages = [
      { url: "/", priority: "1.0" },
      { url: "/articles", priority: "0.9" },
      { url: "/start-here", priority: "0.8" },
      { url: "/about", priority: "0.7" },
      { url: "/technique-finder", priority: "0.7" },
      { url: "/privacy", priority: "0.3" },
      { url: "/terms", priority: "0.3" },
      ...CATEGORIES.map((c) => ({ url: `/category/${c.slug}`, priority: "0.8" })),
    ];
    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE_DOMAIN}${p.url}</loc><priority>${p.priority}</priority></url>`).join("\n")}
</urlset>`);
  });

  app.get("/sitemap-articles.xml", (_req, res) => {
    const published = filterPublished(articlesData.articles);
    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${published.map((a: any) => `  <url><loc>${SITE_DOMAIN}/article/${a.slug}</loc><lastmod>${a.dateISO}</lastmod><priority>0.7</priority></url>`).join("\n")}
</urlset>`);
  });

  app.get("/sitemap-images.xml", (_req, res) => {
    const published = filterPublished(articlesData.articles);
    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${published.map((a: any) => `  <url>
    <loc>${SITE_DOMAIN}/article/${a.slug}</loc>
    <image:image>
      <image:loc>${a.heroImage}</image:loc>
      <image:title>${a.title.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</image:title>
    </image:image>
  </url>`).join("\n")}
</urlset>`);
  });

  // ─── RSS FEED ───
  app.get("/feed.xml", (_req, res) => {
    const published = filterPublished(articlesData.articles)
      .sort((a: any, b: any) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
      .slice(0, 20);
    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${SITE_NAME}</title>
  <link>${SITE_DOMAIN}</link>
  <description>Lucid dreaming education, techniques, and consciousness exploration.</description>
  <language>en-us</language>
  <atom:link href="${SITE_DOMAIN}/feed.xml" rel="self" type="application/rss+xml"/>
${published.map((a: any) => `  <item>
    <title>${a.title.replace(/&/g, "&amp;")}</title>
    <link>${SITE_DOMAIN}/article/${a.slug}</link>
    <guid>${SITE_DOMAIN}/article/${a.slug}</guid>
    <pubDate>${new Date(a.dateISO).toUTCString()}</pubDate>
    <description>${(a.metaDescription || "").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</description>
    <category>${a.categoryName}</category>
  </item>`).join("\n")}
</channel>
</rss>`);
  });

  // ─── ROBOTS.TXT ───
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(`# The Lucid Path — robots.txt
User-agent: *
Allow: /
Allow: /llms.txt
Allow: /.well-known/ai.json
Allow: /api/ai/
Allow: /feed.xml
Allow: /sitemap-index.xml
Disallow: /api/subscribe

# AI Crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Anthropic-AI
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Cohere-AI
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Meta-ExternalFetcher
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: YouBot
Allow: /

User-agent: Phind
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Diffbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: AI2Bot
Allow: /

User-agent: Timpibot
Allow: /

User-agent: Kangaroo Bot
Allow: /

User-agent: ISSCyberRiskCrawler
Allow: /

User-agent: PetalBot
Allow: /

User-agent: Scrapy
Disallow: /

User-agent: DataForSeoBot
Allow: /

User-agent: ImagesiftBot
Allow: /

User-agent: Omgili
Allow: /

User-agent: Webzio-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Google-InspectionTool
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: GoogleOther-Image
Allow: /

User-agent: GoogleOther-Video
Allow: /

User-agent: Storebot-Google
Allow: /

User-agent: Seekr
Allow: /

User-agent: VelenpublicBot
Allow: /

User-agent: Nicecrawler
Allow: /

User-agent: FriendlyCrawler
Allow: /

User-agent: Sidetrade indexer bot
Allow: /

User-agent: Brightbot
Allow: /

User-agent: Owler
Allow: /

User-agent: ICC-Crawler
Allow: /

User-agent: Neevabot
Allow: /

User-agent: WikiDo
Allow: /

User-agent: Gryphebot
Allow: /

User-agent: Webz.io
Allow: /

User-agent: NewsNow
Allow: /

Sitemap: ${SITE_DOMAIN}/sitemap-index.xml
`);
  });

  // ─── SPA FALLBACK ───
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`${SITE_NAME} running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
