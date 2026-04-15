import { useState, useMemo, useEffect } from "react";
import { useSearch } from "wouter";
import ArticleCard from "@/components/ArticleCard";
import {
  getPublishedArticles,
  searchArticles,
  CATEGORIES,
  SITE_NAME,
  SITE_DOMAIN,
  getPublishedCount,
} from "@/lib/articles";

export default function ArticlesListing() {
  const searchParams = useSearch();
  const query = new URLSearchParams(searchParams).get("q") || "";
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    document.title = `All Articles — ${SITE_NAME}`;
  }, []);

  const published = useMemo(() => getPublishedArticles(), []);

  const filtered = useMemo(() => {
    if (query) return searchArticles(query);
    if (!activeCategory) return published;
    return published.filter((a) => a.category === activeCategory);
  }, [published, activeCategory, query]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 800 &&
        hasMore
      ) {
        setVisibleCount((c) => c + 24);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "All Articles",
            description: `Browse ${getPublishedCount()} articles on lucid dreaming, dream science, and consciousness.`,
            url: `${SITE_DOMAIN}/articles`,
            mainEntity: { "@type": "ItemList", numberOfItems: filtered.length },
          }),
        }}
      />

      {/* Header */}
      <section className="pt-12 pb-8 bg-gradient-to-b from-[var(--twilight)]/[0.04] to-background">
        <div className="container">
          <span className="text-[var(--aurora)] text-sm font-medium tracking-widest uppercase">
            {query ? "Search Results" : "Library"}
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-800 mt-2 text-foreground">
            {query ? `Results for "${query}"` : "All Articles"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {query
              ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} found`
              : `${getPublishedCount()} articles on lucid dreaming and consciousness`}
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          {/* Filter tabs */}
          {!query && (
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => { setActiveCategory(null); setVisibleCount(24); }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  !activeCategory
                    ? "bg-[var(--twilight)] text-white shadow-lg shadow-[var(--twilight)]/30"
                    : "bg-white/80 border border-border hover:border-[var(--aurora)]/50 hover:bg-[var(--aurora)]/5"
                }`}
              >
                All ({published.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = published.filter((a) => a.category === cat.slug).length;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => { setActiveCategory(cat.slug); setVisibleCount(24); }}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === cat.slug
                        ? "bg-[var(--twilight)] text-white shadow-lg shadow-[var(--twilight)]/30"
                        : "bg-white/80 border border-border hover:border-[var(--aurora)]/50 hover:bg-[var(--aurora)]/5"
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Masonry grid */}
          <div className="masonry-grid">
            {visible.map((article, i) => (
              <ArticleCard key={article.slug} article={article} priority={i < 6} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((c) => c + 24)}
                className="px-10 py-4 rounded-full bg-[var(--twilight)] text-white font-medium hover:shadow-lg hover:shadow-[var(--twilight)]/30 hover:scale-105 transition-all duration-300"
              >
                Load More Articles
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground mb-4">No articles found.</p>
              <a href="/articles" className="text-[var(--aurora)] hover:underline">View all articles</a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
