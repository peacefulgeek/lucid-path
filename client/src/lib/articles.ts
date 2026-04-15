import articlesData from "@/data/articles.json";

export interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  categoryName: string;
  dateISO: string;
  wordCount: number;
  readingTime: string;
  openerType: string;
  opener: string;
  livedExperience: string;
  namedReference: { text: string; name: string } | string;
  sections: Array<{ heading: string; content: string }>;
  selectedPhrases: string[];
  faqs: Array<{ question: string; answer: string }>;
  conclusionType: string;
  conclusion: string;
  backlinkType: string;
  outboundLink: { url: string; anchor: string; rel?: string } | null;
  internalLinks: Array<{ slug: string; anchor: string }>;
  imageDescription: string;
  ogImageDescription: string;
  metaDescription: string;
  heroImage: string;
  ogImage: string;
  body?: string;
}

export const CATEGORIES = [
  { slug: "the-basics", name: "The Basics", description: "Foundational concepts of lucid dreaming — what it is, how it works, and why it matters for consciousness exploration." },
  { slug: "the-techniques", name: "The Techniques", description: "Proven induction methods from MILD and WILD to dream yoga and supplement protocols for achieving lucidity." },
  { slug: "the-science", name: "The Science", description: "Neuroscience, sleep research, and the brain mechanisms behind dream consciousness and lucid awareness." },
  { slug: "the-practice", name: "The Practice", description: "Daily habits, dream journaling, meditation practices, and lifestyle adjustments that support lucid dreaming." },
  { slug: "the-advanced", name: "The Advanced", description: "Dream yoga, shared dreaming, consciousness exploration, and the deeper dimensions of lucid dream work." },
];

export const SITE_NAME = "The Lucid Path";
export const SITE_TAGLINE = "Waking Up Inside Your Dreams";
export const SITE_DOMAIN = "https://lucidpath.love";
export const BUNNY_CDN = "https://lucid-path.b-cdn.net";
export const AUTHOR_NAME = "Kalesh";
export const AUTHOR_TITLE = "Consciousness Teacher & Writer";
export const AUTHOR_LINK = "https://kalesh.love";
export const EDITORIAL_NAME = "The Lucid Path Editorial";
export const AUTHOR_IMAGE = "https://lucid-path.b-cdn.net/images/author/kalesh.webp";
export const AUTHOR_BIO = "Kalesh is a mystic and spiritual advisor who brings ancient wisdom and depth to life's biggest decisions. His work bridges contemplative traditions and modern consciousness research, guiding seekers toward embodied awareness through meditation, breathwork, and somatic inquiry.";

const allArticles: Article[] = (articlesData as any).articles;

export function filterPublished(articles: Article[] = allArticles): Article[] {
  const now = new Date();
  return articles.filter((a) => new Date(a.dateISO) <= now);
}

export function getPublishedArticles(): Article[] {
  return filterPublished()
    .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
}

export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return filterPublished().filter((a) => a.category === categorySlug)
    .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
}

export function getRelatedArticles(article: Article, count: number = 4): Article[] {
  const published = filterPublished();
  // Same category first, then cross-category
  const sameCategory = published.filter((a) => a.category === article.category && a.slug !== article.slug);
  const crossCategory = published.filter((a) => a.category !== article.category);
  const combined = [...sameCategory, ...crossCategory].filter((a) => a.slug !== article.slug);
  return combined.slice(0, count);
}

export function getPopularArticles(exclude: string[] = [], count: number = 5): Article[] {
  return filterPublished()
    .filter((a) => !exclude.includes(a.slug))
    .slice(0, count);
}

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryPillClass(categorySlug: string): string {
  const map: Record<string, string> = {
    "the-basics": "category-pill-basics",
    "the-techniques": "category-pill-techniques",
    "the-science": "category-pill-science",
    "the-practice": "category-pill-practice",
    "the-advanced": "category-pill-advanced",
  };
  return `category-pill ${map[categorySlug] || "category-pill-basics"}`;
}

export function formatDate(dateISO: string): string {
  return new Date(dateISO).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getPublishedCount(): number {
  return filterPublished().length;
}

export function searchArticles(query: string): Article[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return filterPublished().filter((a) => {
    const text = `${a.title} ${a.metaDescription} ${a.categoryName} ${a.opener}`.toLowerCase();
    return q.split(" ").every((word) => word.length > 1 && text.includes(word));
  });
}
