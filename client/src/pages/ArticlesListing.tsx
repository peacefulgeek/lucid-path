import { useState, useMemo, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
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

  // Infinite scroll
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
      {/* JSON-LD CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "All Articles",
            description: `Browse ${getPublishedCount()} articles on lucid dreaming, dream science, and consciousness.`,
            url: `${SITE_DOMAIN}/articles`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: filtered.length,
            },
          }),
        }}
      />

      <section className="container py-10">
        <h1 className="font-heading text-3xl md:text-4xl font-800 mb-2" style={{ color: "var(--twilight)" }}>
          {query ? `Search: "${query}"` : "All Articles"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {query
            ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} found`
            : `${getPublishedCount()} articles on lucid dreaming and consciousness`}
        </p>

        {/* Filter tabs */}
        {!query && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => { setActiveCategory(null); setVisibleCount(24); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !activeCategory ? "bg-[var(--twilight)] text-[var(--starlight)]" : "bg-muted hover:bg-muted/80"
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.slug ? "bg-[var(--twilight)] text-[var(--starlight)]" : "bg-muted hover:bg-muted/80"
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

        {/* Loading indicator */}
        {hasMore && (
          <div className="text-center mt-10">
            <div className="w-6 h-6 border-2 border-[var(--aurora)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Loading more articles...</p>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-4">No articles found.</p>
            <a href="/articles" className="text-[var(--aurora-dim)] underline">View all articles</a>
          </div>
        )}
      </section>
    </>
  );
}
