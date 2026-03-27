import { useEffect } from "react";
import {
  SITE_NAME,
  SITE_DOMAIN,
  AUTHOR_NAME,
  AUTHOR_TITLE,
  AUTHOR_LINK,
  AUTHOR_BIO,
  EDITORIAL_NAME,
  getPublishedCount,
} from "@/lib/articles";

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
              jobTitle: AUTHOR_TITLE,
            },
          }),
        }}
      />

      <section className="container py-10 max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl font-800 mb-6" style={{ color: "var(--twilight)" }}>
          About {SITE_NAME}
        </h1>

        {/* Editorial team description FIRST */}
        <div className="mb-12">
          <h2 className="font-heading text-xl font-700 mb-4" style={{ color: "var(--twilight)" }}>
            {EDITORIAL_NAME}
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            {SITE_NAME} is an independent publication dedicated to lucid dreaming education, dream science, and consciousness exploration. We publish rigorously researched articles that bridge ancient contemplative practices with modern neuroscience — because the gap between knowing something intellectually and knowing it in your body is where all the real work happens.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Our editorial approach is grounded in direct experience. Every technique we describe has been practiced. Every scientific reference has been verified. Every article is written with the understanding that lucid dreaming is not merely a sleep hack — it is a doorway into the nature of consciousness itself.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            With {getPublishedCount()} published articles across five categories — The Basics, The Techniques, The Science, The Practice, and The Advanced — we cover everything from your first reality check to advanced dream yoga and shared dreaming practices. Whether you are a complete beginner or an experienced oneironaut, our content meets you where you are.
          </p>
          <p className="text-lg leading-relaxed">
            We do not sell courses. We do not gate content behind paywalls. We do not track you with analytics cookies. The information is here because it should be.
          </p>
        </div>

        {/* Kalesh as Consciousness Teacher card */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-[var(--twilight)] flex items-center justify-center text-white font-heading font-800 text-2xl shrink-0">
              K
            </div>
            <div>
              <h3 className="font-heading text-lg font-700">{AUTHOR_NAME}</h3>
              <p className="text-sm text-[var(--aurora-dim)] font-medium mb-2">{AUTHOR_TITLE}</p>
              <p className="text-sm leading-relaxed mb-3">
                {AUTHOR_BIO}
              </p>
              <a
                href={AUTHOR_LINK}
                className="inline-flex items-center text-sm text-[var(--aurora-dim)] hover:underline font-medium"
              >
                Visit Kalesh's Website →
              </a>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="mt-12">
          <h2 className="font-heading text-xl font-700 mb-4" style={{ color: "var(--twilight)" }}>
            Our Approach
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            The mind is not the enemy. The identification with it is. This principle guides everything we publish. Lucid dreaming, at its core, is the practice of recognizing that you are dreaming while you are dreaming — and that recognition changes your relationship to consciousness in ways that extend far beyond the sleep state.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            We draw from researchers like Stephen LaBerge, whose pioneering work at Stanford established the scientific foundation of lucid dreaming; from contemplative traditions including Tibetan dream yoga and Taoist sleep practices; and from modern neuroscience that continues to reveal how consciousness operates across states of waking, sleeping, and everything in between.
          </p>
          <p className="text-lg leading-relaxed">
            Awareness does not need to be cultivated. It needs to be uncovered. That is what this site is for.
          </p>
        </div>
      </section>
    </>
  );
}
