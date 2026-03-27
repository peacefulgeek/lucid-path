import { useParams, Link } from "wouter";
import { useState, useMemo, useEffect } from "react";
import ArticleCard from "@/components/ArticleCard";
import {
  getArticlesByCategory,
  getCategoryBySlug,
  SITE_NAME,
  SITE_DOMAIN,
} from "@/lib/articles";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const [visibleCount, setVisibleCount] = useState(24);

  const category = useMemo(() => getCategoryBySlug(params.slug || ""), [params.slug]);
  const articles = useMemo(() => getArticlesByCategory(params.slug || ""), [params.slug]);
  const visible = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  useEffect(() => {
    if (category) {
      document.title = `${category.name} — ${SITE_NAME}`;
    }
  }, [category]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800 && hasMore) {
        setVisibleCount((c) => c + 24);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  if (!category) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-3xl font-700 mb-4">Category Not Found</h1>
        <Link href="/articles" className="text-[var(--aurora-dim)] underline">Browse all articles</Link>
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category.name,
            description: category.description,
            url: `${SITE_DOMAIN}/category/${category.slug}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: articles.length,
            },
          }),
        }}
      />

      <section className="container py-10">
        <h1 className="font-heading text-3xl md:text-4xl font-800 mb-2" style={{ color: "var(--twilight)" }}>
          {category.name}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          {category.description} — {articles.length} article{articles.length !== 1 ? "s" : ""}.
        </p>

        <div className="masonry-grid">
          {visible.map((article, i) => (
            <ArticleCard key={article.slug} article={article} priority={i < 6} />
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-10">
            <div className="w-6 h-6 border-2 border-[var(--aurora)] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}
      </section>
    </>
  );
}
