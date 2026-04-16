import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import ArticleCard from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import {
  getPublishedArticles,
  CATEGORIES,
  SITE_NAME,
  SITE_TAGLINE,
  getPublishedCount,
  AUTHOR_NAME,
  AUTHOR_LINK,
  AUTHOR_IMAGE,
} from "@/lib/articles";
import { PRODUCT_CATALOG, amazonUrl } from "@/lib/product-catalog";
import { ShoppingBag, ArrowRight, BookOpen, Moon, Pill, Volume2, Brain } from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/JcafQeocBTr8RyvmVji4gn/hero-main-G8BGiPee7cKWnu546UahU7.webp";
const NEWSLETTER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/JcafQeocBTr8RyvmVji4gn/hero-newsletter-f6YB5NtpTcbbPgA3nEpMJj.webp";

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

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

  const featuredArticles = published.slice(0, 3);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Dreamscape with luminous lotus flowers and cosmic sky"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a2e]/50 via-transparent to-[#1a0a2e]/50" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
            <span className="text-white/90 text-sm tracking-widest uppercase">Consciousness Exploration</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-800 text-white mb-6 leading-[1.05] tracking-tight">
            {SITE_NAME}
          </h1>
          <p className="text-xl md:text-2xl text-white/85 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
            {SITE_TAGLINE}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/start-here"
              className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-[var(--aurora)] text-[#1a0a2e] font-semibold text-lg shadow-lg shadow-[var(--aurora)]/30 hover:shadow-xl hover:shadow-[var(--aurora)]/40 hover:scale-105 transition-all duration-300"
            >
              Start Your Journey
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/30 text-white font-medium text-lg backdrop-blur-sm bg-white/5 hover:bg-white/15 transition-all duration-300"
            >
              Explore {getPublishedCount()} Articles
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* ===== FEATURED ARTICLES ===== */}
      <section className="relative py-20 overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-[var(--twilight)]/[0.03] to-background" />

        <div className="container relative">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-[var(--aurora)] text-sm font-medium tracking-widest uppercase">Featured</span>
              <h2 className="font-heading text-3xl md:text-4xl font-800 mt-2 text-foreground">Latest Explorations</h2>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {featuredArticles.map((article, i) => (
              <FadeInSection key={article.slug} delay={i * 150}>
                <Link href={`/article/${article.slug}`} className="group block relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg hover:shadow-2xl transition-all duration-500">
                  <img
                    src={article.heroImage}
                    alt={article.imageDescription || article.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-[var(--aurora)]/20 text-[var(--aurora)] text-xs font-medium backdrop-blur-sm border border-[var(--aurora)]/30 mb-3">
                      {article.categoryName}
                    </span>
                    <h3 className="font-heading text-xl font-700 text-white leading-tight mb-2 group-hover:text-[var(--aurora)] transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-2">{article.metaDescription}</p>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORY FILTER + MASONRY GRID ===== */}
      <section className="py-16 bg-gradient-to-b from-background to-[var(--twilight)]/[0.04]">
        <div className="container">
          <FadeInSection>
            <div className="text-center mb-10">
              <span className="text-[var(--aurora)] text-sm font-medium tracking-widest uppercase">Browse</span>
              <h2 className="font-heading text-3xl md:text-4xl font-800 mt-2 text-foreground">All Articles</h2>
            </div>
          </FadeInSection>

          {/* Category filter tabs */}
          <FadeInSection>
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              <button
                onClick={() => { setActiveCategory(null); setVisibleCount(18); }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  !activeCategory
                    ? "bg-[var(--twilight)] text-white shadow-lg shadow-[var(--twilight)]/30"
                    : "bg-white/80 border border-border hover:border-[var(--aurora)]/50 hover:bg-[var(--aurora)]/5"
                }`}
              >
                All ({published.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = published.filter(a => a.category === cat.slug).length;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => { setActiveCategory(cat.slug); setVisibleCount(18); }}
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
          </FadeInSection>

          {/* Masonry grid */}
          <div className="masonry-grid">
            {visible.map((article, i) => (
              <div key={article.slug}>
                <ArticleCard article={article} priority={i < 6} />
                {/* Newsletter inline after 9th item */}
                {i === 8 && (
                  <div className="masonry-item">
                    <div className="relative rounded-2xl overflow-hidden p-8 shadow-lg">
                      <div className="absolute inset-0">
                        <img src={NEWSLETTER_IMG} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-[#1a0a2e]/75 backdrop-blur-[2px]" />
                      <div className="relative z-10">
                        <h3 className="font-heading text-xl font-700 text-white mb-2">
                          Explore Lucidity with Us
                        </h3>
                        <p className="text-white/75 text-sm mb-5 leading-relaxed">
                          Join a growing community of lucid dreamers. No spam, just consciousness.
                        </p>
                        <NewsletterForm source="homepage-inline" variant="dark" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((c) => c + 18)}
                className="px-10 py-4 rounded-full bg-[var(--twilight)] text-white font-medium hover:shadow-lg hover:shadow-[var(--twilight)]/30 hover:scale-105 transition-all duration-300"
              >
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== CATEGORIES OVERVIEW ===== */}
      <section className="py-20">
        <div className="container">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-[var(--aurora)] text-sm font-medium tracking-widest uppercase">Explore</span>
              <h2 className="font-heading text-3xl md:text-4xl font-800 mt-2 text-foreground">Five Paths of Lucidity</h2>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => {
              const catArticles = published.filter(a => a.category === cat.slug);
              const coverImage = catArticles[0]?.heroImage;
              return (
                <FadeInSection key={cat.slug} delay={i * 100}>
                  <Link
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
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-20 bg-gradient-to-b from-[var(--twilight)]/[0.04] to-background">
        <div className="container">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-[var(--aurora)] text-sm font-medium tracking-widest uppercase">Gear Guide</span>
              <h2 className="font-heading text-3xl md:text-4xl font-800 mt-2 text-foreground">Essential Dreaming Tools</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Hand-picked products that support every stage of your lucid dreaming practice.</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              { asin: "034537410X", name: "Exploring the World of Lucid Dreaming", cat: "The Classic Guide", icon: <BookOpen className="w-4 h-4" /> },
              { asin: "B09T39P48Z", name: "Dream Journal for Lucid Dreaming", cat: "Dream Journal", icon: <BookOpen className="w-4 h-4" /> },
              { asin: "B0B14QQV6R", name: "MZOO Luxury Sleep Mask", cat: "Sleep Mask", icon: <Moon className="w-4 h-4" /> },
              { asin: "B07PCVWM6N", name: "Dream Leaf Pro Supplement", cat: "Supplement", icon: <Pill className="w-4 h-4" /> },
              { asin: "B07RWRJ4XW", name: "Magicteam Sound Machine", cat: "Sound Machine", icon: <Volume2 className="w-4 h-4" /> },
              { asin: "B0093162RM", name: "Philips SmartSleep Wake-up Light", cat: "Sleep Tech", icon: <Brain className="w-4 h-4" /> },
              { asin: "B0CH15QX8V", name: "Mugwort Dream Tea", cat: "Dream Herb", icon: <Pill className="w-4 h-4" /> },
              { asin: "B07T8DSTW3", name: "ASAKUKI Essential Oil Diffuser", cat: "Aromatherapy", icon: <Moon className="w-4 h-4" /> },
            ].map((item, i) => (
              <FadeInSection key={item.asin} delay={i * 80}>
                <a
                  href={amazonUrl(item.asin)}
                  target="_blank"
                  rel="nofollow noopener"
                  className="group block p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:border-[var(--aurora)]/30 transition-all duration-300 h-full"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-md bg-[var(--twilight)]/10 flex items-center justify-center text-[var(--twilight)]">
                      {item.icon}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium">{item.cat}</span>
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-white border border-border/50 overflow-hidden mb-3 mx-auto flex items-center justify-center">
                    <img
                      src={`https://m.media-amazon.com/images/P/${item.asin}.01._SCLZZZZZZZ_SX200_.jpg`}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <h3 className="font-heading text-sm font-700 leading-snug group-hover:text-[var(--aurora-dim)] transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-muted-foreground/50 italic">paid link</span>
                </a>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={300}>
            <div className="text-center mt-10">
              <Link
                href="/recommended-products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--twilight)] text-white font-medium hover:shadow-lg hover:shadow-[var(--twilight)]/30 hover:scale-105 transition-all duration-300"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse All 67 Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== ABOUT KALESH STRIP ===== */}
      <section className="py-16 bg-gradient-to-r from-[var(--twilight)] via-[var(--twilight-light)] to-[var(--twilight)]">
        <div className="container">
          <FadeInSection>
            <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
              <img
                src={AUTHOR_IMAGE}
                alt={AUTHOR_NAME}
                className="w-28 h-28 rounded-full object-cover border-3 border-[var(--aurora)]/40 shadow-lg shadow-[var(--aurora)]/20 flex-shrink-0"
              />
              <div className="text-center md:text-left">
                <p className="text-[var(--aurora)] text-sm font-medium tracking-widest uppercase mb-2">Your Guide</p>
                <h3 className="font-heading text-2xl font-700 text-white mb-3">{AUTHOR_NAME}</h3>
                <p className="text-white/75 leading-relaxed mb-4">
                  Consciousness Teacher and Writer bridging ancient wisdom with modern research. Guiding seekers toward embodied awareness through meditation, breathwork, and the art of lucid dreaming.
                </p>
                <a
                  href={AUTHOR_LINK}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--aurora)]/40 text-[var(--aurora)] text-sm font-medium hover:bg-[var(--aurora)]/10 transition-colors"
                >
                  Visit {AUTHOR_NAME}'s Website
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== FINAL NEWSLETTER CTA ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={NEWSLETTER_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-[#1a0a2e]/80 backdrop-blur-sm" />
        <div className="container relative z-10">
          <FadeInSection>
            <div className="max-w-xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-800 text-white mb-4">Begin Your Lucid Journey</h2>
              <p className="text-white/75 mb-8 leading-relaxed">
                Get weekly insights on lucid dreaming techniques, consciousness exploration, and the science of sleep. Join thousands of seekers already on the path.
              </p>
              <NewsletterForm source="homepage-bottom" variant="dark" />
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  );
}
