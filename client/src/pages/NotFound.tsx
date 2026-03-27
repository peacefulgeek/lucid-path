import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import { getPublishedArticles, SITE_NAME } from "@/lib/articles";

export default function NotFound() {
  useEffect(() => {
    document.title = `Page Not Found — ${SITE_NAME}`;
  }, []);

  const articles = useMemo(() => getPublishedArticles().slice(0, 6), []);

  return (
    <section className="min-h-[70vh] relative">
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--twilight)] via-[var(--twilight)]/90 to-background" />

      <div className="relative z-10 container py-16 text-center">
        <h1 className="font-heading text-6xl md:text-8xl font-800 text-white/20 mb-2">404</h1>
        <h2 className="font-heading text-2xl md:text-3xl font-700 text-white mb-4">
          You Wandered Into the Void
        </h2>
        <p className="text-white/70 max-w-lg mx-auto mb-4 leading-relaxed">
          In lucid dreaming, getting lost is sometimes the beginning of the most interesting discoveries. This page does not exist — but these articles do, and they might be exactly what you were looking for.
        </p>
        <p className="text-white/50 text-sm mb-10">
          The mind is not the enemy. The identification with it is. Perhaps the page you sought was never the destination.
        </p>

        {/* 6 article cards in 2x3 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className="group block rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
            >
              <img
                src={article.heroImage}
                alt={article.title}
                width={400}
                height={225}
                loading="lazy"
                className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-3 text-left">
                <span className="text-[10px] text-[var(--aurora)] uppercase tracking-wider font-medium">
                  {article.categoryName}
                </span>
                <h3 className="text-sm font-medium text-white mt-1 line-clamp-2 group-hover:text-[var(--aurora)] transition-colors">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-full bg-[var(--aurora)] text-[var(--twilight)] font-semibold hover:opacity-90 transition-opacity"
          >
            Return Home
          </Link>
        </div>
      </div>
    </section>
  );
}
