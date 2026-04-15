import { useEffect } from "react";
import { Link } from "wouter";
import {
  SITE_NAME,
  AUTHOR_NAME,
  AUTHOR_TITLE,
  AUTHOR_LINK,
  AUTHOR_BIO,
  AUTHOR_IMAGE,
  EDITORIAL_NAME,
  getPublishedCount,
} from "@/lib/articles";

const ABOUT_HERO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/JcafQeocBTr8RyvmVji4gn/hero-about-7D4fknPeUUxtjfRK3SxmG8.webp";

export default function About() {
  useEffect(() => {
    document.title = `About — ${SITE_NAME}`;
  }, []);

  return (
    <>
      {/* JSON-LD ProfilePage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: AUTHOR_NAME,
              description: AUTHOR_BIO,
              url: AUTHOR_LINK,
              image: AUTHOR_IMAGE,
              jobTitle: AUTHOR_TITLE,
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={ABOUT_HERO} alt="Meditation space with warm golden light" className="w-full h-full object-cover" loading="eager" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a2e]/90 via-[#1a0a2e]/40 to-transparent" />
        <div className="container relative z-10 pb-12 pt-32">
          <span className="text-[var(--aurora)] text-sm font-medium tracking-widest uppercase">About</span>
          <h1 className="font-heading text-4xl md:text-5xl font-800 text-white mt-2 mb-3">
            The Story Behind {SITE_NAME}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            A space for seekers, dreamers, and anyone curious about the vast landscape of consciousness.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl">
          {/* Editorial team */}
          <div className="mb-16">
            <h2 className="font-heading text-2xl font-700 text-foreground mb-6">{EDITORIAL_NAME}</h2>
            <div className="space-y-5 text-foreground/80 leading-relaxed text-lg">
              <p>
                {SITE_NAME} is an independent publication dedicated to lucid dreaming education, dream science, and consciousness exploration. We publish rigorously researched articles that bridge ancient contemplative practices with modern neuroscience, because the gap between knowing something intellectually and knowing it in your body is where all the real work happens.
              </p>
              <p>
                Our editorial approach is grounded in direct experience. Every technique we describe has been practiced. Every scientific reference has been verified. Every article is written with the understanding that lucid dreaming is not merely a sleep hack. It is a doorway into the nature of consciousness itself.
              </p>
              <p>
                With {getPublishedCount()} published articles across five categories, we cover everything from your first reality check to advanced dream yoga and shared dreaming practices. Whether you are a complete beginner or an experienced oneironaut, our content meets you where you are.
              </p>
              <p>
                We do not sell courses. We do not gate content behind paywalls. The information is here because it should be.
              </p>
            </div>
          </div>

          {/* Kalesh Card */}
          <div className="relative rounded-2xl overflow-hidden mb-16 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--twilight)] to-[var(--twilight-light)]" />
            <div className="relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-10">
              <img
                src={AUTHOR_IMAGE}
                alt={AUTHOR_NAME}
                className="w-36 h-36 rounded-full object-cover border-4 border-[var(--aurora)]/30 shadow-lg shadow-[var(--aurora)]/20 flex-shrink-0"
              />
              <div className="text-center md:text-left">
                <span className="text-[var(--aurora)] text-xs font-medium tracking-widest uppercase">Consciousness Advisor</span>
                <h3 className="font-heading text-2xl font-700 text-white mt-1 mb-1">{AUTHOR_NAME}</h3>
                <p className="text-white/50 text-sm mb-4">{AUTHOR_TITLE}</p>
                <p className="text-white/75 leading-relaxed mb-6">{AUTHOR_BIO}</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <a
                    href={AUTHOR_LINK}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--aurora)] text-[#1a0a2e] text-sm font-semibold hover:shadow-lg hover:shadow-[var(--aurora)]/30 transition-all"
                  >
                    Book a Session
                  </a>
                  <a
                    href={AUTHOR_LINK}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-all"
                  >
                    Visit {AUTHOR_NAME}'s Website
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Approach */}
          <div className="mb-16">
            <h2 className="font-heading text-2xl font-700 text-foreground mb-6">Our Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Research-Grounded", desc: "Every article references peer-reviewed studies, established researchers, or verified contemplative traditions. We cite our sources and distinguish between established science and emerging theory." },
                { title: "Practice-Oriented", desc: "Theory matters, but experience matters more. Our guides include step-by-step instructions you can try tonight, written by people who actually practice these techniques." },
                { title: "Honest & Accessible", desc: "We do not oversell or mystify. If something is speculative, we say so. If a technique works for some people but not others, we say that too. Clarity over hype, always." },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-heading text-lg font-700 text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Our Philosophy */}
          <div className="mb-16">
            <h2 className="font-heading text-2xl font-700 text-foreground mb-6">Our Philosophy</h2>
            <div className="space-y-5 text-foreground/80 leading-relaxed text-lg">
              <p>
                The mind is not the enemy. The identification with it is. This principle guides everything we publish. Lucid dreaming, at its core, is the practice of recognizing that you are dreaming while you are dreaming, and that recognition changes your relationship to consciousness in ways that extend far beyond the sleep state.
              </p>
              <p>
                We draw from researchers like Stephen LaBerge, whose pioneering work at Stanford established the scientific foundation of lucid dreaming; from contemplative traditions including Tibetan dream yoga and Taoist sleep practices; and from modern neuroscience that continues to reveal how consciousness operates across states of waking, sleeping, and everything in between.
              </p>
              <p>
                Awareness does not need to be cultivated. It needs to be uncovered. That is what this site is for.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-10 rounded-2xl bg-gradient-to-br from-[var(--twilight)]/5 to-[var(--aurora)]/5 border border-border/30">
            <h2 className="font-heading text-2xl font-700 text-foreground mb-3">Ready to Begin?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start with our curated introduction to lucid dreaming, or dive straight into the full article library.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/start-here"
                className="px-6 py-3 rounded-full bg-[var(--twilight)] text-white font-medium hover:shadow-lg hover:shadow-[var(--twilight)]/30 transition-all"
              >
                Start Here
              </Link>
              <Link
                href="/articles"
                className="px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-all"
              >
                Browse All Articles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
