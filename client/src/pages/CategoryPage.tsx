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
  const coverImage = articles[0]?.heroImage;

  useEffect(() => {
    if (category) {
      document.title = `${category.name} — ${SITE_NAME}`;
    }
  }, [category]);

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
        <Link href="/articles" className="text-[var(--aurora)] underline">Browse all articles</Link>
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
            mainEntity: { "@type": "ItemList", numberOfItems: articles.length },
          }),
        }}
      />

      {/* Hero with category cover image */}
      <section className="relative min-h-[40vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {coverImage && (
            <img src={coverImage} alt={category.name} className="w-full h-full object-cover" loading="eager" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a2e]/90 via-[#1a0a2e]/40 to-transparent" />
        <div className="container relative z-10 pb-10 pt-28">
          <span className="text-[var(--aurora)] text-sm font-medium tracking-widest uppercase">Category</span>
          <h1 className="font-heading text-4xl md:text-5xl font-800 text-white mt-2 mb-3">
            {category.name}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            {category.description} — {articles.length} article{articles.length !== 1 ? "s" : ""}.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
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
        </div>
      </section>
    </>
  );
}
