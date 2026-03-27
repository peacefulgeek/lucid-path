import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="alert" aria-live="polite">
      <div className="container flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-sm flex-1">
          We use essential cookies to remember your preferences. No tracking cookies, no analytics cookies, no third-party cookies.
          Read our <a href="/privacy" className="underline hover:text-[var(--aurora)]">Privacy Policy</a>.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={accept}
            className="px-4 py-1.5 rounded-full bg-[var(--aurora)] text-[var(--twilight)] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="px-4 py-1.5 rounded-full border border-white/30 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
