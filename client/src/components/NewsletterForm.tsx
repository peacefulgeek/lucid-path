import { useState } from "react";

interface NewsletterFormProps {
  source: string;
  variant?: "light" | "dark";
}

export default function NewsletterForm({ source, variant = "light" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className={`text-sm font-medium ${variant === "dark" ? "text-[var(--aurora)]" : "text-[var(--aurora-dim)]"}`}>
        Welcome aboard. Check your inbox for a confirmation.
      </p>
    );
  }

  const inputClass = variant === "dark"
    ? "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[var(--aurora)]/50"
    : "bg-background border-border text-foreground focus:border-[var(--aurora)]/50";

  const buttonClass = variant === "dark"
    ? "bg-[var(--aurora)] text-[#1a0a2e] font-semibold hover:shadow-lg hover:shadow-[var(--aurora)]/30"
    : "bg-[var(--twilight)] text-white font-semibold hover:shadow-lg hover:shadow-[var(--twilight)]/30";

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor={`email-${source}`} className="sr-only">Email address</label>
      <input
        id={`email-${source}`}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className={`flex-1 px-4 py-2.5 rounded-full border text-sm ${inputClass} focus:outline-none focus:ring-2 focus:ring-[var(--aurora)]/30 transition-all`}
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={`px-5 py-2.5 rounded-full text-sm transition-all duration-300 ${buttonClass} disabled:opacity-50`}
      >
        {status === "loading" ? "..." : "Join"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-1">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
