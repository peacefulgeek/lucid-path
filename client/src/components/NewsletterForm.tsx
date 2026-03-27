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
        Thanks for subscribing!
      </p>
    );
  }

  const inputClass = variant === "dark"
    ? "bg-white/10 border-white/20 text-white placeholder:text-white/50"
    : "bg-background border-border text-foreground";

  const buttonClass = variant === "dark"
    ? "bg-[var(--aurora)] text-[var(--twilight)] hover:bg-[var(--aurora-dim)]"
    : "bg-[var(--twilight)] text-[var(--starlight)] hover:opacity-90";

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
        className={`flex-1 px-3 py-2 rounded-lg border text-sm ${inputClass} focus:outline-none focus:ring-2 focus:ring-[var(--aurora)]`}
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${buttonClass} disabled:opacity-50`}
      >
        {status === "loading" ? "..." : "Join"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-500 mt-1">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
