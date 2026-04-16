import { useEffect } from "react";
import { Link } from "wouter";
import { SITE_NAME, AUTHOR_NAME } from "@/lib/articles";
import { ExternalLink } from "lucide-react";

const TAG = "spankyspinola-20";
const amz = (asin: string) => `https://www.amazon.com/dp/${asin}?tag=${TAG}`;

interface Product {
  name: string;
  url: string;
  description: string;
  isAmazon: boolean;
  internalLink?: { text: string; href: string };
}

interface Category {
  title: string;
  products: Product[];
}

const categories: Category[] = [
  {
    title: "Essential Lucid Dreaming Books",
    products: [
      {
        name: "Exploring the World of Lucid Dreaming — Stephen LaBerge",
        url: amz("034537410X"),
        description: "The foundational text that brought lucid dreaming into mainstream consciousness. LaBerge's research at Stanford laid the groundwork for everything we know about dream awareness. If you read one book on this list, make it this one.",
        isAmazon: true,
        internalLink: { text: "our guide to the MILD technique", href: "/article/mild-technique-complete-guide" },
      },
      {
        name: "Lucid Dreaming: Gateway to the Inner Self — Robert Waggoner",
        url: amz("193049114X"),
        description: "Waggoner goes where LaBerge's scientific approach stops — into the deeper territory of what lucid dreams reveal about consciousness itself. Over 1,000 documented lucid dreams inform this deeply personal and practical guide.",
        isAmazon: true,
      },
      {
        name: "Why We Sleep — Matthew Walker",
        url: amz("1501144324"),
        description: "Not strictly a lucid dreaming book, but understanding sleep architecture is essential for any serious dreamer. Walker's research on REM sleep and dream function will change how you approach your entire sleep practice.",
        isAmazon: true,
        internalLink: { text: "our article on sleep science and dreaming", href: "/article/science-of-rem-sleep-and-lucid-dreaming" },
      },
      {
        name: "Dreams of Awakening — Charlie Morley",
        url: amz("1781802025"),
        description: "Charlie Morley bridges Western lucid dreaming with Tibetan Buddhist dream yoga traditions. Written with warmth and clarity, this is essential for anyone drawn to the contemplative side of dream work.",
        isAmazon: true,
      },
      {
        name: "Are You Dreaming? — Daniel Love",
        url: amz("0957497709"),
        description: "A modern, no-nonsense guide that cuts through the noise. Love's critical thinking approach helps you separate what actually works from what sounds good on paper. Particularly strong on reality testing methods.",
        isAmazon: true,
        internalLink: { text: "our reality testing guide", href: "/article/reality-testing-methods-for-lucid-dreaming" },
      },
      {
        name: "Advanced Lucid Dreaming: The Power of Supplements — Thomas Yuschak",
        url: amz("1430305428"),
        description: "The definitive guide to supplement-assisted lucid dream induction. Yuschak details the science behind galantamine, alpha-GPC, and other compounds that support conscious dreaming.",
        isAmazon: true,
      },
      {
        name: "The Tibetan Yogas of Dream and Sleep — Tenzin Wangyal Rinpoche",
        url: amz("1559391014"),
        description: "The definitive text on the Bon tradition's approach to dream practice. Rinpoche's teachings on the sleep of clear light represent some of the most advanced consciousness work available in any tradition.",
        isAmazon: true,
      },
    ],
  },
  {
    title: "Dream Journals & Workbooks",
    products: [
      {
        name: "Dream Journal for Lucid Dreaming Practices",
        url: amz("B09T39P48Z"),
        description: "A purpose-built dream journal with prompts for reality checks, dream signs, and lucidity triggers. The structured format helps build the recall habit that makes everything else possible.",
        isAmazon: true,
      },
      {
        name: "Moleskine Cahier Journal — Pocket Ruled",
        url: amz("B07J33Q4V1"),
        description: "Some dreamers prefer a blank canvas. The Moleskine lies flat on a nightstand, opens easily in the dark, and the paper quality holds up to half-asleep scrawling. Keep a pen clipped to the elastic band.",
        isAmazon: true,
      },
      {
        name: "Dream Journal Notebook — Guided Diary",
        url: amz("B0D8KQ3LBH"),
        description: "A guided dream journal with structured prompts that help beginners develop their dream recall practice. Includes space for dream signs, reality checks, and lucidity triggers.",
        isAmazon: true,
      },
    ],
  },
  {
    title: "Supplements & Nootropics",
    products: [
      {
        name: "Galantamine 8mg — Lucid Dreaming Nootropic",
        url: amz("B0758FYZVC"),
        description: "The most research-backed supplement for lucid dream induction. Galantamine works by increasing acetylcholine during REM sleep. Best used with the Wake-Back-to-Bed method — not as a nightly supplement.",
        isAmazon: true,
        internalLink: { text: "our guide to supplements for lucid dreaming", href: "/article/supplements-and-lucid-dreaming-what-works" },
      },
      {
        name: "Dream Leaf Pro — Lucid Dreaming Supplement",
        url: amz("B07PCVWM6N"),
        description: "A two-step supplement system designed specifically for lucid dreamers. The blue pill supports deep sleep in the first half of the night; the red pill enhances REM vividness when taken during a WBTB wake-up.",
        isAmazon: true,
      },
      {
        name: "Lucidimine Galantamine Lucid Dream Supplement",
        url: amz("B00IJQCA6E"),
        description: "A galantamine-based supplement designed specifically for lucid dream induction. Works by increasing acetylcholine levels during REM sleep, making conscious dreaming significantly more likely.",
        isAmazon: true,
      },
      {
        name: "Natural Dried Mugwort Herb Tea",
        url: amz("B0CH15QX8V"),
        description: "Used for centuries across cultures as a dream herb. Brew as a tea before bed or place a sachet under your pillow. The effects are subtle but many dreamers report more vivid and memorable dreams.",
        isAmazon: true,
      },
    ],
  },
  {
    title: "Sleep Masks & Devices",
    products: [
      {
        name: "MZOO Luxury Sleep Mask — 100% Blackout",
        url: amz("B0B14QQV6R"),
        description: "Total darkness is non-negotiable for quality REM sleep. This contoured mask creates zero-pressure blackout without touching your eyelids — critical for REM eye movement.",
        isAmazon: true,
      },
      {
        name: "MZOO Contoured Sleeping Blindfold",
        url: amz("B07YXLYTBN"),
        description: "A blackout contoured mask that blocks all light while leaving space for your eyes to move during REM sleep. Many lucid dreamers swear by total darkness for longer, more vivid dream periods.",
        isAmazon: true,
        internalLink: { text: "our WILD technique guide", href: "/article/wild-technique-wake-initiated-lucid-dreaming" },
      },
      {
        name: "Philips SmartSleep Wake-up Light",
        url: amz("B0093162RM"),
        description: "A gentle sunrise simulation that supports natural wake-ups during lighter sleep stages — ideal for dream recall. The gradual light increase brings you through lighter sleep where dreams are most accessible.",
        isAmazon: true,
      },
    ],
  },
  {
    title: "Meditation & Mindfulness Tools",
    products: [
      {
        name: "Mindful & Modern Large Meditation Cushion",
        url: amz("B077P4336Y"),
        description: "Meditation is the foundation of sustained lucid dreaming practice. A proper zafu makes the difference between a practice you maintain and one you abandon. This cushion provides the stable, comfortable base needed for longer sessions.",
        isAmazon: true,
        internalLink: { text: "our meditation and lucid dreaming guide", href: "/article/meditation-practices-that-support-lucid-dreaming" },
      },
      {
        name: "Jumbo Kapok Zafu Meditation Cushion",
        url: amz("B07D1XWJ3D"),
        description: "A traditional zafu cushion elevates your hips above your knees, making it easier to maintain the alertness needed for awareness meditation. The kapok filling provides firm, supportive comfort.",
        isAmazon: true,
      },
      {
        name: "Insight Timer — Meditation App",
        url: "https://insighttimer.com/",
        description: "The largest free meditation library in the world, with specific guided sessions for lucid dreaming, yoga nidra, and sleep meditation. The timer function is perfect for WBTB alarm scheduling.",
        isAmazon: false,
      },
      {
        name: "Headspace — Mindfulness App",
        url: "https://www.headspace.com/",
        description: "Structured meditation courses that build the awareness skills lucid dreaming requires. Their sleep content is particularly well-designed for dreamers.",
        isAmazon: false,
      },
    ],
  },
  {
    title: "Apps & Digital Tools",
    products: [
      {
        name: "Lucidity — Lucid Dream Journal App",
        url: "https://play.google.com/store/apps/details?id=ch.b3nz.lucidity",
        description: "The most comprehensive digital dream journal available. Features reality check reminders, dream sign tracking, lucidity statistics, and pattern recognition that helps you identify your personal dream triggers.",
        isAmazon: false,
      },
      {
        name: "Awoken — Lucid Dreaming App",
        url: "https://play.google.com/store/apps/details?id=com.lucid_dreaming.awoken",
        description: "Sends customizable reality check notifications throughout the day. The totem feature plays a sound that you train yourself to recognize in dreams — a digital version of the classic reality testing approach.",
        isAmazon: false,
      },
      {
        name: "Sleep Cycle — Smart Alarm Clock",
        url: "https://www.sleepcycle.com/",
        description: "Tracks your sleep stages and wakes you during light sleep for optimal dream recall. The sleep analysis data helps you identify your best windows for Wake-Back-to-Bed practice.",
        isAmazon: false,
      },
      {
        name: "Binaural Beats Generator — Brain.fm",
        url: "https://www.brain.fm/",
        description: "AI-generated audio designed to influence brainwave states. Their sleep and focus modes can support the theta-wave states associated with lucid dream onset.",
        isAmazon: false,
      },
    ],
  },
];

export default function ToolsPage() {
  useEffect(() => {
    document.title = `Best Lucid Dreaming Tools & Resources We Recommend | ${SITE_NAME}`;
  }, []);

  const totalProducts = categories.reduce((sum, cat) => sum + cat.products.length, 0);
  const amazonProducts = categories.reduce((sum, cat) => sum + cat.products.filter(p => p.isAmazon).length, 0);

  // ItemList schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best Lucid Dreaming Tools & Resources — ${SITE_NAME}`,
    description: `Curated list of the best books, tools, apps, and resources for lucid dreaming. Personally vetted recommendations from ${AUTHOR_NAME}.`,
    numberOfItems: totalProducts,
    itemListElement: categories.flatMap((cat, ci) =>
      cat.products.map((product, pi) => ({
        "@type": "ListItem",
        position: ci * 10 + pi + 1,
        name: product.name,
        url: product.url,
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="container py-10 max-w-4xl">
        {/* Affiliate disclosure */}
        <div className="mb-6 p-4 rounded-lg border border-amber-200 bg-amber-50/50 text-sm text-amber-900">
          This page contains affiliate links. We may earn a small commission if you make a purchase — at no extra cost to you.
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-800 mb-4" style={{ color: "var(--twilight)" }}>
          The Lucid Dreamer's Toolkit
        </h1>

        <p className="text-lg leading-relaxed text-muted-foreground mb-4">
          These are the tools, books, and resources we actually trust. Every recommendation here has been chosen because it serves the practice of lucid dreaming — from foundational reading to supplements that support dream vividness to the meditation tools that make sustained awareness possible.
        </p>
        <p className="text-base leading-relaxed text-muted-foreground mb-10">
          We have tested, researched, or personally used each item on this list. Nothing here is filler.
        </p>

        {/* Table of contents */}
        <nav className="mb-10 p-4 rounded-lg bg-muted/50" aria-label="Categories">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Jump to Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <a
                key={i}
                href={`#cat-${i}`}
                className="px-3 py-1 rounded-full text-xs font-medium bg-background border border-border hover:bg-muted transition-colors"
              >
                {cat.title}
              </a>
            ))}
          </div>
        </nav>

        {/* Categories */}
        {categories.map((cat, ci) => (
          <section key={ci} id={`cat-${ci}`} className="mb-12">
            <h2 className="font-heading text-2xl font-700 mb-6" style={{ color: "var(--twilight)" }}>
              {cat.title}
            </h2>
            <div className="space-y-4">
              {cat.products.map((product, pi) => (
                <div
                  key={pi}
                  className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
                >
                  <h3 className="font-heading text-base font-700 mb-2">
                    <a
                      href={product.url}
                      target="_blank"
                      rel={product.isAmazon ? "noopener" : "noopener noreferrer"}
                      className="hover:text-[var(--aurora-dim)] transition-colors inline-flex items-center gap-1.5"
                    >
                      {product.name}
                      <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </a>
                    {product.isAmazon && (
                      <span className="text-xs text-muted-foreground font-normal ml-2">(paid link)</span>
                    )}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                    {product.internalLink && (
                      <>
                        {" "}We wrote about this in{" "}
                        <Link href={product.internalLink.href} className="text-[var(--aurora-dim)] hover:underline">
                          {product.internalLink.text}
                        </Link>.
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Bottom CTA */}
        <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-[var(--twilight)]/5 to-[var(--aurora)]/5 border border-border text-center">
          <h2 className="font-heading text-xl font-700 mb-2" style={{ color: "var(--twilight)" }}>
            Ready to Begin?
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Start with our beginner's guide and build your practice from the ground up.
          </p>
          <Link
            href="/start-here"
            className="inline-block px-6 py-2.5 rounded-full bg-[var(--twilight)] text-[var(--starlight)] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start Here
          </Link>
        </div>
      </section>
    </>
  );
}
