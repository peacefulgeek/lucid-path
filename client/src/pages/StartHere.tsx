import { useMemo, useEffect } from "react";
import { Link } from "wouter";
import {
  getPublishedArticles,
  CATEGORIES,
  SITE_NAME,
  AUTHOR_NAME,
  AUTHOR_LINK,
  AUTHOR_IMAGE,
  getPublishedCount,
} from "@/lib/articles";

const START_HERO = "https://lucid-path.b-cdn.net/heroes/hero-start.webp";

export default function StartHere() {
  useEffect(() => {
    document.title = `Start Here — ${SITE_NAME}`;
  }, []);

  const published = useMemo(() => getPublishedArticles(), []);

  const pillarArticles = useMemo(() => {
    const pillars: typeof published = [];
    for (const cat of CATEGORIES) {
      const catArticles = published.filter((a) => a.category === cat.slug);
      if (catArticles.length > 0) pillars.push(catArticles[0]);
    }
    if (pillars.length < 6 && published.length > 5) {
      pillars.push(published[5]);
    }
    return pillars;
  }, [published]);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={START_HERO} alt="A luminous path through a dreamscape forest" className="w-full h-full object-cover" loading="eager" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a2e]/90 via-[#1a0a2e]/40 to-transparent" />
        <div className="container relative z-10 pb-12 pt-32">
          <span className="text-[var(--aurora)] text-sm font-medium tracking-widest uppercase">Begin</span>
          <h1 className="font-heading text-4xl md:text-5xl font-800 text-white mt-2 mb-3">
            Start Here
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Your guided introduction to lucid dreaming, from first steps to deeper practice.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <div className="space-y-5 text-foreground/80 leading-relaxed text-lg">
            <p>
              Welcome to {SITE_NAME}. There is a quality of attention that most people never discover, not because it is hidden or esoteric, but because the noise of ordinary sleep drowns it out before it has a chance to register. Lucid dreaming is the practice of waking up inside your dreams, and it changes everything about how you understand consciousness.
            </p>
            <p>
              This site exists because the gap between knowing something intellectually and knowing it in your body is where all the real work happens. We have {getPublishedCount()} articles covering techniques, science, daily practice, and the deeper dimensions of dream consciousness. Whether you have never had a lucid dream or you are exploring advanced dream yoga, there is something here for you.
            </p>
            <p>
              The articles below are the best starting points. Read them in order, or follow your curiosity. Both approaches work.
            </p>
          </div>
        </div>
      </section>

      {/* Pillar articles */}
      <section className="py-12 bg-gradient-to-b from-background to-[var(--twilight)]/[0.04]">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-[var(--aurora)] text-sm font-medium tracking-widest uppercase">Foundation</span>
            <h2 className="font-heading text-3xl font-800 mt-2 text-foreground">Essential Reading</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillarArticles.map((article, i) => (
              <Link
                key={article.slug}
                href={`/article/${article.slug}`}
                className="group block rounded-2xl overflow-hidden bg-card border border-border/50 hover:shadow-xl hover:shadow-[var(--twilight)]/10 transition-all duration-500"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    loading={i < 3 ? "eager" : "lazy"}
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="w-8 h-8 rounded-full bg-[var(--twilight)] text-white text-xs font-bold flex items-center justify-center shadow-lg">
                      {i + 1}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs text-[var(--aurora)] font-medium uppercase tracking-wider">
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
        </div>
      </section>

      {/* Category overview */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-[var(--aurora)] text-sm font-medium tracking-widest uppercase">Explore</span>
            <h2 className="font-heading text-3xl font-800 mt-2 text-foreground">Five Paths of Lucidity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => {
              const catArticles = published.filter((a) => a.category === cat.slug);
              const coverImage = catArticles[0]?.heroImage;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group relative block rounded-2xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-500"
                >
                  {coverImage && (
                    <img src={coverImage} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a2e]/90 via-[#1a0a2e]/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-heading text-lg font-700 text-white mb-1 group-hover:text-[var(--aurora)] transition-colors">{cat.name}</h3>
                    <p className="text-white/60 text-xs leading-relaxed line-clamp-2">{cat.description}</p>
                    <span className="inline-block mt-2 text-[var(--aurora)] text-xs font-medium">{catArticles.length} articles</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guide */}
      <section className="py-12">
        <div className="container max-w-3xl">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--twilight)] to-[var(--twilight-light)]" />
            <div className="relative flex flex-col sm:flex-row items-center gap-6 p-8">
              <img
                src={AUTHOR_IMAGE}
                alt={AUTHOR_NAME}
                className="w-24 h-24 rounded-full object-cover border-3 border-[var(--aurora)]/30 shadow-lg flex-shrink-0"
              />
              <div className="text-center sm:text-left">
                <span className="text-[var(--aurora)] text-xs font-medium tracking-widest uppercase">Your Guide</span>
                <h3 className="font-heading text-xl font-700 text-white mt-1 mb-2">{AUTHOR_NAME}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-3">
                  Consciousness Teacher and Writer bridging ancient wisdom with modern research. Guiding seekers toward embodied awareness through meditation, breathwork, and the art of lucid dreaming.
                </p>
                <a
                  href={AUTHOR_LINK}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 text-[var(--aurora)] text-sm font-medium hover:underline"
                >
                  Visit {AUTHOR_NAME}'s Website
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
