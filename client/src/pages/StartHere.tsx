import { useMemo, useEffect } from "react";
import { Link } from "wouter";
import {
  getPublishedArticles,
  CATEGORIES,
  SITE_NAME,
  SITE_DOMAIN,
  AUTHOR_NAME,
  AUTHOR_TITLE,
  AUTHOR_LINK,
  getPublishedCount,
} from "@/lib/articles";

export default function StartHere() {
  useEffect(() => {
    document.title = `Start Here — ${SITE_NAME}`;
  }, []);

  const published = useMemo(() => getPublishedArticles(), []);

  // Pick pillar articles: first from each category
  const pillarArticles = useMemo(() => {
    const pillars: typeof published = [];
    for (const cat of CATEGORIES) {
      const catArticles = published.filter((a) => a.category === cat.slug);
      if (catArticles.length > 0) pillars.push(catArticles[0]);
    }
    // Add one more if we have space
    if (pillars.length < 6 && published.length > 5) {
      pillars.push(published[5]);
    }
    return pillars;
  }, [published]);

  return (
    <section className="container py-10">
      <h1 className="font-heading text-3xl md:text-4xl font-800 mb-4" style={{ color: "var(--twilight)" }}>
        Start Here
      </h1>

      <div className="max-w-3xl mb-12">
        <p className="text-lg leading-relaxed mb-4">
          Welcome to {SITE_NAME}. There is a quality of attention that most people never discover — not because it is hidden or esoteric, but because the noise of ordinary sleep drowns it out before it has a chance to register. Lucid dreaming is the practice of waking up inside your dreams, and it changes everything about how you understand consciousness.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          This site exists because the gap between knowing something intellectually and knowing it in your body is where all the real work happens. We have {getPublishedCount()} articles covering techniques, science, daily practice, and the deeper dimensions of dream consciousness. Whether you have never had a lucid dream or you are exploring advanced dream yoga, there is something here for you.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          The articles below are the best starting points. Read them in order, or follow your curiosity. Both approaches work.
        </p>
      </div>

      {/* Pillar articles */}
      <h2 className="font-heading text-2xl font-700 mb-6" style={{ color: "var(--twilight)" }}>
        Essential Reading
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {pillarArticles.map((article, i) => (
          <Link
            key={article.slug}
            href={`/article/${article.slug}`}
            className="group block rounded-xl overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-300"
          >
            <div className="relative overflow-hidden">
              <img
                src={article.heroImage}
                alt={article.title}
                width={1200}
                height={675}
                loading={i < 3 ? "eager" : "lazy"}
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-[var(--twilight)] text-white text-xs font-semibold">
                  #{i + 1}
                </span>
              </div>
            </div>
            <div className="p-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {article.categoryName}
              </span>
              <h3 className="font-heading text-base font-700 mt-1 group-hover:text-[var(--aurora-dim)] transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {article.metaDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Category overview */}
      <h2 className="font-heading text-2xl font-700 mb-6" style={{ color: "var(--twilight)" }}>
        Explore by Category
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {CATEGORIES.map((cat) => {
          const count = published.filter((a) => a.category === cat.slug).length;
          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="p-5 rounded-xl border border-border hover:border-[var(--aurora)] hover:shadow-md transition-all duration-300"
            >
              <h3 className="font-heading text-lg font-700 mb-2">{cat.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{cat.description}</p>
              <span className="text-xs font-medium text-[var(--aurora-dim)]">{count} articles →</span>
            </Link>
          );
        })}
      </div>

      {/* About the guide */}
      <div className="max-w-2xl p-6 rounded-xl border border-border bg-card">
        <h3 className="font-heading text-lg font-700 mb-2">Your Guide</h3>
        <p className="text-sm leading-relaxed mb-2">
          {AUTHOR_NAME} is a consciousness teacher and writer whose work explores the intersection of ancient contemplative traditions and modern neuroscience. With decades of practice in meditation, breathwork, and somatic inquiry, he guides others toward embodied awareness.
        </p>
        <a href={AUTHOR_LINK} className="text-sm text-[var(--aurora-dim)] hover:underline">
          Visit Kalesh's Website →
        </a>
      </div>
    </section>
  );
}
