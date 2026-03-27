import { useState, useMemo } from "react";
import { Link } from "wouter";
import ArticleCard from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import {
  getPublishedArticles,
  CATEGORIES,
  SITE_NAME,
  getPublishedCount,
} from "@/lib/articles";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(18);

  const published = useMemo(() => getPublishedArticles(), []);

  const filtered = useMemo(() => {
    if (!activeCategory) return published;
    return published.filter((a) => a.category === activeCategory);
  }, [published, activeCategory]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://lucid-path.b-cdn.net/images/hero/what-is-lucid-dreaming-and-why-does-it-matter.webp)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--twilight)]/80 via-[var(--twilight)]/60 to-[var(--twilight)]/90" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-6xl font-800 text-white mb-4 leading-tight">
            {SITE_NAME}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 font-light leading-relaxed">
            Waking Up Inside Your Dreams
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/start-here"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--aurora)] text-[var(--twilight)] font-semibold hover:opacity-90 transition-opacity"
            >
              Start Your Journey
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
            >
              Explore {getPublishedCount()} Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Category filter tabs */}
      <section className="container pt-10 pb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => { setActiveCategory(null); setVisibleCount(18); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !activeCategory ? "bg-[var(--twilight)] text-[var(--starlight)]" : "bg-muted hover:bg-muted/80"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => { setActiveCategory(cat.slug); setVisibleCount(18); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.slug ? "bg-[var(--twilight)] text-[var(--starlight)]" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry grid with inline newsletter */}
      <section className="container pb-16">
        <div className="masonry-grid">
          {visible.map((article, i) => (
            <div key={article.slug}>
              <ArticleCard article={article} priority={i < 3} />
              {/* Newsletter inline after row 3 (9th item on desktop) */}
              {i === 8 && (
                <div className="masonry-item">
                  <div className="rounded-xl p-6 bg-gradient-to-br from-[var(--twilight)] to-[var(--twilight-light)] text-white">
                    <h3 className="font-heading text-lg font-700 mb-2">
                      Explore Lucidity with Us
                    </h3>
                    <p className="text-sm opacity-80 mb-4">
                      Join a growing community of lucid dreamers. No spam, just consciousness.
                    </p>
                    <NewsletterForm source="homepage-inline" variant="dark" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount((c) => c + 18)}
              className="px-8 py-3 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
            >
              Load More Articles
            </button>
          </div>
        )}
      </section>
    </>
  );
}
