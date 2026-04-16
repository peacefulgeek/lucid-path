/**
 * RecommendedProducts.tsx
 * Standalone gear guide page showcasing all 67 verified Amazon products by category.
 * Design: Twilight Ethereal — editorial gear guide with premium card layout.
 */
import { useEffect, useState, useMemo } from "react";
import { Link } from "wouter";
import { SITE_NAME, AUTHOR_NAME } from "@/lib/articles";
import { PRODUCT_CATALOG, amazonUrl, type Product } from "@/lib/product-catalog";
import {
  ExternalLink,
  BookOpen,
  Moon,
  Volume2,
  Pill,
  Leaf,
  Brain,
  Lamp,
  Glasses,
  Droplets,
  BedDouble,
  Sparkles,
  ChevronDown,
  Star,
  ShoppingBag,
} from "lucide-react";

/* ── Category display config ── */
interface CategoryConfig {
  slug: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    slug: "books",
    title: "Lucid Dreaming Books",
    description: "The essential reading list for dream explorers — from beginner guides to advanced consciousness research.",
    icon: <BookOpen className="w-5 h-5" />,
    gradient: "from-[var(--twilight)]/8 to-[var(--twilight)]/2",
  },
  {
    slug: "journals",
    title: "Dream Journals & Notebooks",
    description: "The single most important tool for building dream recall. Keep one on your nightstand tonight.",
    icon: <Star className="w-5 h-5" />,
    gradient: "from-amber-50 to-amber-50/30",
  },
  {
    slug: "supplements",
    title: "Supplements & Nootropics",
    description: "Research-backed supplements that support acetylcholine levels and dream vividness during REM sleep.",
    icon: <Pill className="w-5 h-5" />,
    gradient: "from-emerald-50 to-emerald-50/30",
  },
  {
    slug: "herbs",
    title: "Dream Herbs & Teas",
    description: "Traditional herbs used for centuries across cultures to enhance dream vividness and recall.",
    icon: <Leaf className="w-5 h-5" />,
    gradient: "from-green-50 to-green-50/30",
  },
  {
    slug: "sleep-masks",
    title: "Sleep Masks & Light Blocking",
    description: "Total darkness is non-negotiable for quality REM sleep. These masks create the blackout your brain needs.",
    icon: <Moon className="w-5 h-5" />,
    gradient: "from-indigo-50 to-indigo-50/30",
  },
  {
    slug: "sound",
    title: "Sound Machines & White Noise",
    description: "Consistent ambient sound masks disruptions and supports uninterrupted sleep cycles.",
    icon: <Volume2 className="w-5 h-5" />,
    gradient: "from-sky-50 to-sky-50/30",
  },
  {
    slug: "sleep-tech",
    title: "Sleep Technology & Trackers",
    description: "Understand your personal sleep architecture and time your lucid dreaming attempts for peak REM windows.",
    icon: <Brain className="w-5 h-5" />,
    gradient: "from-violet-50 to-violet-50/30",
  },
  {
    slug: "brain-tech",
    title: "Brain Sensing & Neurofeedback",
    description: "EEG headbands and neurofeedback devices for advanced practitioners exploring brainwave states.",
    icon: <Sparkles className="w-5 h-5" />,
    gradient: "from-fuchsia-50 to-fuchsia-50/30",
  },
  {
    slug: "meditation",
    title: "Meditation Cushions & Tools",
    description: "Meditation is the foundation of sustained dream awareness. A proper cushion makes the practice stick.",
    icon: <Lamp className="w-5 h-5" />,
    gradient: "from-orange-50 to-orange-50/30",
  },
  {
    slug: "aromatherapy",
    title: "Aromatherapy & Essential Oils",
    description: "Scent-based anchors for your pre-sleep ritual that promote relaxation and may enhance dream vividness.",
    icon: <Droplets className="w-5 h-5" />,
    gradient: "from-purple-50 to-purple-50/30",
  },
  {
    slug: "blue-light",
    title: "Blue Light Blocking",
    description: "Protect your natural melatonin production in the evening for healthier sleep cycles and vivid dreams.",
    icon: <Glasses className="w-5 h-5" />,
    gradient: "from-amber-50 to-amber-50/30",
  },
  {
    slug: "weighted-blankets",
    title: "Weighted Blankets",
    description: "Deep pressure stimulation that reduces anxiety and promotes the calm, deep sleep where dreams thrive.",
    icon: <BedDouble className="w-5 h-5" />,
    gradient: "from-slate-50 to-slate-50/30",
  },
  {
    slug: "decor",
    title: "Dream Catchers & Decor",
    description: "Symbolic objects that serve as powerful intention-setting reminders for your dream practice.",
    icon: <Sparkles className="w-5 h-5" />,
    gradient: "from-rose-50 to-rose-50/30",
  },
];

/* ── Product card component ── */
function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <div className="group relative p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:border-[var(--aurora)]/30 transition-all duration-300">
      {/* Number badge */}
      <div className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full bg-[var(--twilight)] text-white text-xs font-bold flex items-center justify-center shadow-sm">
        {index + 1}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-base font-700 mb-1.5 leading-snug">
            <a
              href={amazonUrl(product.asin)}
              target="_blank"
              rel="nofollow noopener"
              className="hover:text-[var(--aurora-dim)] transition-colors inline-flex items-start gap-1.5"
            >
              <span>{product.name}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-70 mt-1 shrink-0 transition-opacity" />
            </a>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.embedding}
          </p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
          {product.category.replace(/-/g, " ")}
        </span>
        <a
          href={amazonUrl(product.asin)}
          target="_blank"
          rel="nofollow noopener"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--twilight)] text-white hover:bg-[var(--twilight-light)] transition-colors"
        >
          <ShoppingBag className="w-3 h-3" />
          View on Amazon
        </a>
      </div>

      <p className="text-[10px] text-muted-foreground/50 mt-2 italic">paid link</p>
    </div>
  );
}

/* ── Main page component ── */
export default function RecommendedProducts() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Recommended Lucid Dreaming Products & Gear Guide | ${SITE_NAME}`;
  }, []);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    for (const product of PRODUCT_CATALOG) {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    }
    return grouped;
  }, []);

  // Filter categories that have products
  const visibleCategories = useMemo(() => {
    return CATEGORY_CONFIG.filter((cat) => {
      // Books category includes multiple catalog categories
      if (cat.slug === "books") {
        return productsByCategory["books"] && productsByCategory["books"].length > 0;
      }
      return productsByCategory[cat.slug] && productsByCategory[cat.slug].length > 0;
    });
  }, [productsByCategory]);

  // Get products for a category config
  const getProducts = (catSlug: string): Product[] => {
    return productsByCategory[catSlug] || [];
  };

  const totalProducts = PRODUCT_CATALOG.length;

  // JSON-LD schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best Lucid Dreaming Products & Gear Guide — ${SITE_NAME}`,
    description: `Curated list of ${totalProducts} verified products for lucid dreaming, including books, supplements, sleep masks, journals, and more. Personally vetted by ${AUTHOR_NAME}.`,
    numberOfItems: totalProducts,
    itemListElement: PRODUCT_CATALOG.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: product.name,
      url: amazonUrl(product.asin),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--twilight)] via-[var(--twilight)]/90 to-background" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(1.5px 1.5px at 20px 30px, white, transparent), radial-gradient(1px 1px at 40px 70px, white, transparent), radial-gradient(1.5px 1.5px at 80px 50px, white, transparent), radial-gradient(1px 1px at 120px 90px, white, transparent), radial-gradient(1.5px 1.5px at 160px 40px, white, transparent)",
          backgroundSize: "200px 120px"
        }} />

        <div className="container relative py-16 md:py-20 text-center">
          <p className="text-[var(--aurora)] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            Curated Gear Guide
          </p>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-white mb-4 leading-tight">
            The Lucid Dreamer's<br className="hidden md:block" /> Product Guide
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
            {totalProducts} verified products we trust for building and maintaining a serious lucid dreaming practice.
            Every item has been researched, tested, or personally used.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-white/50">
            <span>{totalProducts} products</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>{visibleCategories.length} categories</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>All verified</span>
          </div>
        </div>
      </section>

      <section className="container py-10 max-w-5xl">
        {/* Affiliate disclosure */}
        <div className="mb-8 p-4 rounded-lg border border-amber-200 bg-amber-50/50 text-sm text-amber-900">
          <strong>Affiliate Disclosure:</strong> As an Amazon Associate, {SITE_NAME} earns from qualifying purchases.
          Product links on this page are affiliate links — they cost you nothing extra and help support our work.
          Every product listed here has been selected for its relevance to lucid dreaming practice, not for commission rates.
          All links are marked with <em>(paid link)</em>.
        </div>

        {/* Jump-to navigation */}
        <nav className="mb-10 p-5 rounded-xl bg-muted/40 border border-border" aria-label="Product categories">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Jump to Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {visibleCategories.map((cat) => (
              <a
                key={cat.slug}
                href={`#products-${cat.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-background border border-border hover:bg-[var(--twilight)]/5 hover:border-[var(--aurora)]/30 transition-all"
                onClick={() => setActiveCategory(cat.slug)}
              >
                {cat.icon}
                {cat.title}
                <span className="text-muted-foreground/60 ml-0.5">
                  ({getProducts(cat.slug).length})
                </span>
              </a>
            ))}
          </div>
        </nav>

        {/* Category sections */}
        {visibleCategories.map((cat) => {
          const products = getProducts(cat.slug);
          return (
            <section
              key={cat.slug}
              id={`products-${cat.slug}`}
              className="mb-14 scroll-mt-24"
            >
              {/* Category header */}
              <div className={`p-5 rounded-xl bg-gradient-to-r ${cat.gradient} mb-6`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-[var(--twilight)]/10 flex items-center justify-center text-[var(--twilight)]">
                    {cat.icon}
                  </div>
                  <div>
                    <h2 className="font-heading text-xl md:text-2xl font-700" style={{ color: "var(--twilight)" }}>
                      {cat.title}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {products.length} product{products.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-12">
                  {cat.description}
                </p>
              </div>

              {/* Product cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product, pi) => (
                  <ProductCard key={product.asin} product={product} index={pi} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Bottom CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-[var(--twilight)]/5 via-[var(--aurora)]/5 to-transparent border border-border text-center">
          <h2 className="font-heading text-2xl font-700 mb-3" style={{ color: "var(--twilight)" }}>
            Ready to Start Your Practice?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Products are just tools. The real work happens when you commit to the practice.
            Start with our beginner's guide and build your foundation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/start-here"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--twilight)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start Here Guide
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Tools & Apps
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Browse Articles
            </Link>
          </div>
        </div>

        {/* Final disclaimer */}
        <p className="mt-8 text-xs text-muted-foreground/60 text-center leading-relaxed max-w-2xl mx-auto">
          As an Amazon Associate I earn from qualifying purchases. All product recommendations are based on research and personal experience.
          Always consult a healthcare professional before starting any supplement regimen. Prices and availability are subject to change.
        </p>
      </section>
    </>
  );
}
