import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { SITE_NAME } from "@/lib/articles";

export default function QuizPage() {
  const params = useParams<{ quizId: string }>();

  useEffect(() => {
    document.title = `Quiz — ${SITE_NAME}`;
  }, []);

  return (
    <section className="container py-10 max-w-2xl text-center">
      <h1 className="font-heading text-3xl font-800 mb-4" style={{ color: "var(--twilight)" }}>
        Quiz Coming Soon
      </h1>
      <p className="text-muted-foreground mb-6">
        Interactive quizzes are being developed. In the meantime, try our{" "}
        <Link href="/technique-finder" className="text-[var(--aurora-dim)] underline">
          Technique Finder
        </Link>{" "}
        to discover the best lucid dreaming methods for you.
      </p>
      <Link
        href="/articles"
        className="inline-flex items-center px-6 py-3 rounded-full bg-[var(--twilight)] text-[var(--starlight)] font-medium hover:opacity-90 transition-opacity"
      >
        Browse Articles
      </Link>
    </section>
  );
}
