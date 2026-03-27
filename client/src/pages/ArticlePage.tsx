import { useParams, Link, useLocation } from "wouter";
import { useMemo, useEffect, useState } from "react";
import {
  getArticleBySlug,
  getRelatedArticles,
  getPopularArticles,
  getCategoryPillClass,
  formatDate,
  AUTHOR_NAME,
  AUTHOR_TITLE,
  AUTHOR_LINK,
  AUTHOR_BIO,
  SITE_NAME,
  SITE_DOMAIN,
  type Article,
} from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import { Clock, Share2, Facebook, Twitter, Linkedin, Copy, Check, ChevronLeft } from "lucide-react";

function ShareButtons({ article }: { article: Article }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_DOMAIN}/article/${article.slug}`;
  const title = article.title;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Share:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-muted transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-muted transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-muted transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>
      <button
        onClick={copyLink}
        className="p-2 rounded-full hover:bg-muted transition-colors"
        aria-label="Copy link"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

function TableOfContents({ sections }: { sections: Article["sections"] }) {
  return (
    <nav className="flex flex-wrap gap-2 mb-6" aria-label="Table of contents">
      {sections.map((s, i) => (
        <a
          key={i}
          href={`#section-${i}`}
          className="px-3 py-1 rounded-full text-xs font-medium bg-muted hover:bg-muted/80 transition-colors"
        >
          {s.heading}
        </a>
      ))}
    </nav>
  );
}

function ArticleJsonLd({ article }: { article: Article }) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: article.heroImage,
    datePublished: article.dateISO,
    dateModified: article.dateISO,
    author: { "@type": "Person", name: AUTHOR_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_DOMAIN,
    },
    mainEntityOfPage: `${SITE_DOMAIN}/article/${article.slug}`,
    wordCount: article.wordCount,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".article-opener", ".article-conclusion"],
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_DOMAIN },
      { "@type": "ListItem", position: 2, name: article.categoryName, item: `${SITE_DOMAIN}/category/${article.category}` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_DOMAIN}/article/${article.slug}` },
    ],
  };

  const schemas = [articleSchema, breadcrumbSchema];

  if (article.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    } as any);
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

function renderContent(content: string) {
  // Content is already HTML from the generator
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();

  const article = useMemo(() => {
    if (!params.slug) return undefined;
    return getArticleBySlug(params.slug);
  }, [params.slug]);

  const related = useMemo(() => {
    if (!article) return [];
    return getRelatedArticles(article, 4);
  }, [article]);

  const sidebarArticles = useMemo(() => {
    if (!article) return [];
    return getPopularArticles([article.slug], 5);
  }, [article]);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} — ${SITE_NAME}`;
    }
  }, [article]);

  if (!article) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-3xl font-700 mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or hasn't been published yet.</p>
        <Link href="/articles" className="text-[var(--aurora-dim)] underline">Browse all articles</Link>
      </div>
    );
  }

  // Check if published
  const isPublished = new Date(article.dateISO) <= new Date();
  if (!isPublished) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-3xl font-700 mb-4">Coming Soon</h1>
        <p className="text-muted-foreground mb-6">This article will be published on {formatDate(article.dateISO)}.</p>
        <Link href="/articles" className="text-[var(--aurora-dim)] underline">Browse published articles</Link>
      </div>
    );
  }

  return (
    <>
      <ArticleJsonLd article={article} />

      {/* OG meta tags */}
      <MetaTags article={article} />

      {/* Hero image */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={article.heroImage}
          alt={article.imageDescription || article.title}
          width={1200}
          height={675}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      <div className="container -mt-20 relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/category/${article.category}`} className="hover:text-foreground transition-colors">
            {article.categoryName}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
        </nav>

        {/* TWO COLUMN 60/40 layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Article content (60%) */}
          <div className="lg:w-[60%]">
            <header className="mb-8">
              <span className={getCategoryPillClass(article.category)}>
                {article.categoryName}
              </span>
              <h1 className="font-heading text-3xl md:text-4xl font-800 mt-3 mb-4 leading-tight" style={{ color: "var(--twilight)" }}>
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <time dateTime={article.dateISO}>{formatDate(article.dateISO)}</time>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readingTime}
                </span>
                <span>{article.wordCount.toLocaleString()} words</span>
              </div>
              <ShareButtons article={article} />
            </header>

            {/* Table of Contents */}
            <TableOfContents sections={article.sections} />

            {/* Article body */}
            <div className="article-body">
              {/* Opener */}
              <div className="article-opener">
                <p className="text-lg leading-relaxed mb-6">{article.opener}</p>
              </div>

              {/* Lived experience */}
              <p className="italic text-muted-foreground border-l-2 border-[var(--aurora)] pl-4 mb-6">
                {article.livedExperience}
              </p>

              {/* Named reference */}
              <p className="mb-6">
                {typeof article.namedReference === 'string'
                  ? article.namedReference
                  : article.namedReference?.text}
              </p>

              {/* Sections */}
              {article.sections.map((section, i) => (
                <section key={i} id={`section-${i}`}>
                  <h2>{section.heading}</h2>
                  {renderContent(section.content)}
                </section>
              ))}

              {/* Outbound link */}
              {article.outboundLink && (
                <p className="mb-6">
                  <a
                    href={article.outboundLink.url}
                    {...(article.outboundLink.rel ? { rel: article.outboundLink.rel } : {})}
                    {...(article.outboundLink.url.startsWith("http") && !article.outboundLink.url.includes("kalesh.love") ? { target: "_blank" } : {})}
                  >
                    {article.outboundLink.anchor}
                  </a>
                </p>
              )}

              {/* Internal links */}
              {article.internalLinks.length > 0 && (
                <div className="my-8 p-4 rounded-lg bg-muted/50">
                  <h3 className="text-sm font-semibold mb-2">Continue Exploring</h3>
                  <ul className="space-y-1">
                    {article.internalLinks.map((link, i) => (
                      <li key={i}>
                        <Link href={`/article/${link.slug}`} className="text-sm text-[var(--aurora-dim)] hover:underline">
                          {link.anchor}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* FAQs */}
              {article.faqs.length > 0 && (
                <section className="my-10">
                  <h2>Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {article.faqs.map((faq, i) => (
                      <div key={i} className="border border-border rounded-lg p-4">
                        <h3 className="font-semibold text-base mb-2">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Conclusion */}
              <div className="article-conclusion my-8 p-6 rounded-xl bg-gradient-to-br from-[var(--twilight)]/5 to-[var(--aurora)]/5 border border-border">
                {renderContent(article.conclusion)}
              </div>

              {/* Selected phrases as pull quotes */}
              {article.selectedPhrases.length > 0 && (
                <div className="my-8">
                  {article.selectedPhrases.slice(0, 2).map((phrase, i) => (
                    <blockquote key={i} className="text-lg italic my-4">
                      "{phrase}"
                    </blockquote>
                  ))}
                </div>
              )}
            </div>

            {/* Bio card at VERY BOTTOM */}
            <div className="mt-12 p-6 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--twilight)] flex items-center justify-center text-white font-heading font-700 text-xl shrink-0">
                  K
                </div>
                <div>
                  <h4 className="font-heading font-700 text-base">{AUTHOR_NAME}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{AUTHOR_TITLE}</p>
                  <p className="text-sm leading-relaxed mb-2">{AUTHOR_BIO}</p>
                  <a
                    href={AUTHOR_LINK}
                    className="text-sm text-[var(--aurora-dim)] hover:underline"
                  >
                    Visit Kalesh's Website
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sidebar (40%) — tall image gallery + pull quotes + popular */}
          <aside className="lg:w-[40%]">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Pull quotes */}
              {article.selectedPhrases.length > 2 && (
                <div className="space-y-4">
                  {article.selectedPhrases.slice(2).map((phrase, i) => (
                    <div key={i} className="p-4 rounded-lg bg-gradient-to-br from-[var(--twilight)]/5 to-[var(--aurora)]/5 border-l-3 border-[var(--aurora)]">
                      <p className="text-sm italic leading-relaxed">"{phrase}"</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Popular articles */}
              <div>
                <h3 className="font-heading text-sm font-700 uppercase tracking-wider text-muted-foreground mb-4">
                  Popular Articles
                </h3>
                <div className="space-y-3">
                  {sidebarArticles.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/article/${a.slug}`}
                      className="flex gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <img
                        src={a.heroImage}
                        alt={a.title}
                        width={80}
                        height={60}
                        loading="lazy"
                        className="w-20 h-15 object-cover rounded-md shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-medium leading-snug group-hover:text-[var(--aurora-dim)] transition-colors line-clamp-2">
                          {a.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">{a.readingTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[var(--twilight)] to-[var(--twilight-light)] text-white">
                <h3 className="font-heading text-base font-700 mb-2">Stay Lucid</h3>
                <p className="text-xs opacity-80 mb-3">Join our community of conscious dreamers.</p>
                <NewsletterForm source="article-sidebar" variant="dark" />
              </div>
            </div>
          </aside>
        </div>

        {/* Cross-links: 4 cards in 2x2 grid */}
        <section className="mt-16 mb-12">
          <h2 className="font-heading text-2xl font-700 mb-6" style={{ color: "var(--twilight)" }}>
            Continue Your Exploration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

// Import NewsletterForm at the top level
import NewsletterForm from "@/components/NewsletterForm";

// Meta tags component (updates document head)
function MetaTags({ article }: { article: Article }) {
  useEffect(() => {
    // Update meta tags dynamically
    const setMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", article.metaDescription);
    setMeta("og:title", `${article.title} — ${SITE_NAME}`, true);
    setMeta("og:description", article.metaDescription, true);
    setMeta("og:image", article.ogImage, true);
    setMeta("og:url", `${SITE_DOMAIN}/article/${article.slug}`, true);
    setMeta("og:type", "article", true);
    setMeta("twitter:title", `${article.title} — ${SITE_NAME}`);
    setMeta("twitter:description", article.metaDescription);
    setMeta("twitter:image", article.ogImage);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${SITE_DOMAIN}/article/${article.slug}`);

    return () => {
      document.title = SITE_NAME;
    };
  }, [article]);

  return null;
}
