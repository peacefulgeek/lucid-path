import { Link, useLocation } from "wouter";
import { useState, useEffect, type ReactNode } from "react";
import { CATEGORIES, SITE_NAME, getPublishedCount } from "@/lib/articles";
import { Search, Home, BookOpen, Compass, User, Menu, X } from "lucide-react";
import NewsletterForm from "./NewsletterForm";
import CookieConsent from "./CookieConsent";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/articles?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isHome = location === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {/* ===== HEADER ===== */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border/50"
            : isHome
              ? "bg-transparent"
              : "bg-background border-b border-border/50"
        }`}
      >
        <div className="container">
          {/* Top row */}
          <div className="flex items-center justify-between py-3">
            <div className="w-28" />
            <Link href="/" className="text-center group">
              <h1
                className={`font-heading text-xl font-800 tracking-tight transition-colors duration-300 ${
                  !scrolled && isHome ? "text-white" : "text-[var(--twilight)]"
                }`}
              >
                {SITE_NAME}
              </h1>
              <p
                className={`text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                  !scrolled && isHome ? "text-white/70" : "text-muted-foreground"
                }`}
              >
                Waking Up Inside Your Dreams
              </p>
            </Link>
            <div className="w-28 flex justify-end gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-full transition-colors ${
                  !scrolled && isHome ? "text-white/80 hover:bg-white/10" : "hover:bg-muted"
                }`}
                aria-label="Search articles"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-full transition-colors lg:hidden ${
                  !scrolled && isHome ? "text-white/80 hover:bg-white/10" : "hover:bg-muted"
                }`}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Category tabs - desktop */}
          <nav className="hidden lg:flex items-center justify-center gap-1 pb-2" aria-label="Category navigation">
            {[
              { href: "/articles", label: "All" },
              ...CATEGORIES.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
              { href: "/tools", label: "Tools" },
              { href: "/start-here", label: "Start Here" },
              { href: "/about", label: "About" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  location === item.href
                    ? "bg-[var(--twilight)] text-white shadow-sm"
                    : !scrolled && isHome
                      ? "text-white/80 hover:bg-white/10"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3 animate-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="flex-1 px-4 py-2.5 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[var(--aurora)] shadow-sm"
                  autoFocus
                  aria-label="Search articles"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[var(--twilight)] text-white text-sm font-medium hover:shadow-md transition-all"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
            <nav className="container py-4 flex flex-col gap-1" aria-label="Mobile navigation">
              {[
                { href: "/articles", label: "All Articles" },
                ...CATEGORIES.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
                { href: "/tools", label: "Tools We Recommend" },
                { href: "/quizzes", label: "Quizzes" },
                { href: "/assessments", label: "Assessments" },
                { href: "/start-here", label: "Start Here" },
                { href: "/technique-finder", label: "Technique Finder" },
                { href: "/about", label: "About" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    location === item.href
                      ? "bg-[var(--twilight)]/10 text-[var(--twilight)]"
                      : "hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* ===== FOOTER ===== */}
      <footer className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--twilight)] via-[#1a0a2e] to-[#0d0518]" />
        {/* Subtle star dots */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(1px 1px at 20px 30px, white, transparent), radial-gradient(1px 1px at 40px 70px, white, transparent), radial-gradient(1px 1px at 50px 160px, white, transparent), radial-gradient(1px 1px at 90px 40px, white, transparent), radial-gradient(1px 1px at 130px 80px, white, transparent), radial-gradient(1px 1px at 160px 120px, white, transparent)",
          backgroundSize: "200px 200px"
        }} />

        <div className="container relative py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="font-heading text-2xl font-800 text-white mb-3">{SITE_NAME}</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-md mb-6">
                Exploring lucid dreaming techniques, dream science, and consciousness practices.
                {" "}{getPublishedCount()} articles and growing.
              </p>
              <NewsletterForm source="footer" variant="dark" />
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-heading text-xs font-600 uppercase tracking-[0.2em] text-[var(--aurora)]/80 mb-4">Explore</h4>
              <ul className="space-y-2.5">
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/category/${cat.slug}`} className="text-sm text-white/55 hover:text-[var(--aurora)] transition-colors duration-300">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-heading text-xs font-600 uppercase tracking-[0.2em] text-[var(--aurora)]/80 mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><Link href="/tools" className="text-sm text-white/55 hover:text-[var(--aurora)] transition-colors duration-300">Tools We Recommend</Link></li>
                <li><Link href="/quizzes" className="text-sm text-white/55 hover:text-[var(--aurora)] transition-colors duration-300">Quizzes</Link></li>
                <li><Link href="/assessments" className="text-sm text-white/55 hover:text-[var(--aurora)] transition-colors duration-300">Assessments</Link></li>
                <li><Link href="/start-here" className="text-sm text-white/55 hover:text-[var(--aurora)] transition-colors duration-300">Start Here</Link></li>
                <li><Link href="/technique-finder" className="text-sm text-white/55 hover:text-[var(--aurora)] transition-colors duration-300">Technique Finder</Link></li>
                <li><Link href="/about" className="text-sm text-white/55 hover:text-[var(--aurora)] transition-colors duration-300">About</Link></li>
                <li><Link href="/privacy" className="text-sm text-white/55 hover:text-[var(--aurora)] transition-colors duration-300">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-white/55 hover:text-[var(--aurora)] transition-colors duration-300">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Amazon Associate + Disclaimer + copyright */}
          <div className="mt-12 pt-8 border-t border-white/10 text-xs text-white/40 space-y-2">
            <p>As an Amazon Associate I earn from qualifying purchases.</p>
            <p>
              <strong className="text-white/50">Disclaimer:</strong> The content on {SITE_NAME} is for educational and informational purposes only.
              It is not intended as a substitute for professional medical advice, diagnosis, or treatment.
              Always consult a qualified healthcare provider before making changes to your sleep habits or health practices.
            </p>
            <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50 safe-bottom" aria-label="Mobile tab bar">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${location === "/" ? "text-[var(--aurora)]" : "text-muted-foreground"}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </Link>
          <Link href="/articles" className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${location === "/articles" ? "text-[var(--aurora)]" : "text-muted-foreground"}`}>
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px]">Browse</span>
          </Link>
          <button
            onClick={() => { setSearchOpen(true); window.scrollTo(0, 0); }}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted-foreground"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px]">Search</span>
          </button>
          <Link href="/about" className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${location === "/about" ? "text-[var(--aurora)]" : "text-muted-foreground"}`}>
            <User className="w-5 h-5" />
            <span className="text-[10px]">About</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted-foreground"
            aria-label="Menu"
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </nav>

      {/* Cookie consent */}
      <CookieConsent />

      {/* Bottom padding for mobile tab bar */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}
