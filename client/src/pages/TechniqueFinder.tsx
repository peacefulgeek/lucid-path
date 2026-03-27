import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { SITE_NAME, getPublishedArticles, type Article } from "@/lib/articles";

interface Technique {
  name: string;
  keywords: string[];
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const TECHNIQUES: Technique[] = [
  { name: "MILD (Mnemonic Induction)", keywords: ["mild", "mnemonic", "intention"], description: "Set an intention to recognize you're dreaming as you fall asleep. Best for beginners who remember dreams well.", difficulty: "Beginner" },
  { name: "WILD (Wake-Initiated)", keywords: ["wild", "wake-initiated", "wake initiated"], description: "Transition directly from waking to dreaming while maintaining consciousness. Requires patience and body awareness.", difficulty: "Advanced" },
  { name: "SSILD (Senses-Initiated)", keywords: ["ssild", "senses", "sensory"], description: "Cycle through sensory observations as you fall asleep. Gentle technique with high success rates.", difficulty: "Beginner" },
  { name: "WBTB (Wake Back to Bed)", keywords: ["wbtb", "wake back", "alarm"], description: "Wake after 5-6 hours, stay up briefly, then return to sleep with lucid intent. Pairs well with other techniques.", difficulty: "Beginner" },
  { name: "Reality Testing", keywords: ["reality", "check", "testing", "awareness"], description: "Build a habit of questioning reality during the day. The habit carries into dreams.", difficulty: "Beginner" },
  { name: "Dream Journaling", keywords: ["journal", "diary", "recall", "writing"], description: "Record dreams immediately upon waking. Improves recall and pattern recognition.", difficulty: "Beginner" },
  { name: "Dream Yoga (Tibetan)", keywords: ["yoga", "tibetan", "buddhist", "meditation"], description: "Ancient contemplative practice combining meditation, visualization, and sleep awareness.", difficulty: "Advanced" },
  { name: "FILD (Finger-Induced)", keywords: ["fild", "finger"], description: "Gently move fingers as you fall asleep to maintain a thread of awareness into the dream state.", difficulty: "Intermediate" },
  { name: "Supplement Protocols", keywords: ["supplement", "galantamine", "choline", "vitamin"], description: "Strategic use of supplements to enhance dream vividness and lucidity. Research-backed approaches.", difficulty: "Intermediate" },
  { name: "Meditation-Based", keywords: ["meditation", "mindfulness", "vipassana", "awareness"], description: "Develop the quality of awareness during waking hours that naturally extends into sleep.", difficulty: "Intermediate" },
];

type QuestionKey = "experience" | "schedule" | "style" | "goal";

const QUESTIONS: { key: QuestionKey; question: string; options: { label: string; value: string }[] }[] = [
  {
    key: "experience",
    question: "What's your experience with lucid dreaming?",
    options: [
      { label: "Complete beginner — never had a lucid dream", value: "beginner" },
      { label: "Some experience — occasional lucid dreams", value: "intermediate" },
      { label: "Experienced — regular lucid dreamer", value: "advanced" },
    ],
  },
  {
    key: "schedule",
    question: "How much time can you dedicate to practice?",
    options: [
      { label: "5-10 minutes before bed", value: "minimal" },
      { label: "20-30 minutes daily", value: "moderate" },
      { label: "I can restructure my sleep schedule", value: "flexible" },
    ],
  },
  {
    key: "style",
    question: "What resonates with your learning style?",
    options: [
      { label: "Practical and straightforward", value: "practical" },
      { label: "Meditative and contemplative", value: "contemplative" },
      { label: "Scientific and systematic", value: "scientific" },
    ],
  },
  {
    key: "goal",
    question: "What draws you to lucid dreaming?",
    options: [
      { label: "Curiosity — I want to experience it", value: "curiosity" },
      { label: "Creativity — I want to explore dream worlds", value: "creativity" },
      { label: "Growth — I want to use it for self-understanding", value: "growth" },
      { label: "Nightmares — I want to overcome them", value: "nightmares" },
    ],
  },
];

export default function TechniqueFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<QuestionKey, string>>({
    experience: "",
    schedule: "",
    style: "",
    goal: "",
  });

  useEffect(() => {
    document.title = `Technique Finder — ${SITE_NAME}`;
  }, []);

  const published = useMemo(() => getPublishedArticles(), []);

  const handleAnswer = (key: QuestionKey, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  };

  const recommendations = useMemo(() => {
    if (step < QUESTIONS.length) return [];

    const results: { technique: Technique; score: number }[] = [];
    for (const t of TECHNIQUES) {
      let score = 0;
      if (answers.experience === "beginner" && t.difficulty === "Beginner") score += 3;
      if (answers.experience === "intermediate" && t.difficulty === "Intermediate") score += 3;
      if (answers.experience === "advanced" && t.difficulty === "Advanced") score += 3;
      if (answers.schedule === "minimal" && t.difficulty === "Beginner") score += 2;
      if (answers.schedule === "flexible" && t.difficulty === "Advanced") score += 2;
      if (answers.style === "contemplative" && t.keywords.some((k) => ["yoga", "meditation", "mindfulness"].includes(k))) score += 2;
      if (answers.style === "scientific" && t.keywords.some((k) => ["supplement", "ssild", "wild"].includes(k))) score += 2;
      if (answers.style === "practical" && t.keywords.some((k) => ["reality", "journal", "mild", "wbtb"].includes(k))) score += 2;
      if (answers.goal === "nightmares" && t.keywords.some((k) => ["mild", "reality", "journal"].includes(k))) score += 2;
      results.push({ technique: t, score });
    }
    return results.sort((a, b) => b.score - a.score).slice(0, 4);
  }, [step, answers]);

  const findRelatedArticles = (technique: Technique): Article[] => {
    return published
      .filter((a) =>
        technique.keywords.some((k) =>
          a.title.toLowerCase().includes(k) || a.metaDescription.toLowerCase().includes(k)
        )
      )
      .slice(0, 2);
  };

  const reset = () => {
    setStep(0);
    setAnswers({ experience: "", schedule: "", style: "", goal: "" });
  };

  return (
    <section className="container py-10 max-w-2xl">
      <h1 className="font-heading text-3xl md:text-4xl font-800 mb-4" style={{ color: "var(--twilight)" }}>
        Technique Finder
      </h1>
      <p className="text-muted-foreground mb-8">
        Answer four questions and we will recommend the lucid dreaming techniques most suited to your experience, schedule, and goals.
      </p>

      {/* Questions */}
      {step < QUESTIONS.length && (
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[var(--aurora)]" : "bg-muted"}`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Question {step + 1} of {QUESTIONS.length}
          </p>
          <h2 className="font-heading text-xl font-700 mb-6">
            {QUESTIONS[step].question}
          </h2>
          <div className="space-y-3">
            {QUESTIONS[step].options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(QUESTIONS[step].key, opt.value)}
                className="w-full text-left p-4 rounded-lg border border-border hover:border-[var(--aurora)] hover:bg-[var(--aurora)]/5 transition-all duration-200"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {step >= QUESTIONS.length && (
        <div>
          <h2 className="font-heading text-2xl font-700 mb-6" style={{ color: "var(--twilight)" }}>
            Your Recommended Techniques
          </h2>
          <div className="space-y-6">
            {recommendations.map(({ technique }, i) => {
              const related = findRelatedArticles(technique);
              return (
                <div key={i} className="p-5 rounded-xl border border-border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading text-lg font-700">{technique.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      technique.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                      technique.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {technique.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{technique.description}</p>
                  {related.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Related articles:</p>
                      {related.map((a) => (
                        <Link
                          key={a.slug}
                          href={`/article/${a.slug}`}
                          className="block text-sm text-[var(--aurora-dim)] hover:underline"
                        >
                          → {a.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button
            onClick={reset}
            className="mt-8 px-6 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
          >
            Start Over
          </button>
        </div>
      )}
    </section>
  );
}
