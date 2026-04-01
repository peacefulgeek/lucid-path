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
  const [, navigate] = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/articles?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container">
          {/* Top row: site name centered */}
          <div className="flex items-center justify-between py-3">
            <div className="w-24" />
            <Link href="/" className="text-center">
              <h1 className="font-heading text-xl font-800 tracking-tight" style={{ color: "var(--twilight)" }}>
                {SITE_NAME}
              </h1>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">
                Waking Up Inside Your Dreams
              </p>
            </Link>
            <div className="w-24 flex justify-end gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Search articles"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full hover:bg-muted transition-colors lg:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Category tabs */}
          <nav className="hidden lg:flex items-center justify-center gap-1 pb-2" aria-label="Category navigation">
            <Link
              href="/articles"
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                location === "/articles" ? "bg-[var(--twilight)] text-[var(--starlight)]" : "hover:bg-muted"
              }`}
            >
              All
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  location === `/category/${cat.slug}` ? "bg-[var(--twilight)] text-[var(--starlight)]" : "hover:bg-muted"
                }`}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/tools"
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                location === "/tools" ? "bg-[var(--twilight)] text-[var(--starlight)]" : "hover:bg-muted"
              }`}
            >
              Tools
            </Link>
            <Link
              href="/start-here"
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                location === "/start-here" ? "bg-[var(--twilight)] text-[var(--starlight)]" : "hover:bg-muted"
              }`}
            >
              Start Here
            </Link>
            <Link
              href="/about"
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                location === "/about" ? "bg-[var(--twilight)] text-[var(--starlight)]" : "hover:bg-muted"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="flex-1 px-4 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[var(--aurora)]"
                  autoFocus
                  aria-label="Search articles"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[var(--twilight)] text-[var(--starlight)] text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="container py-4 flex flex-col gap-2" aria-label="Mobile navigation">
              <Link href="/articles" className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium">
                All Articles
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium"
                >
                  {cat.name}
                </Link>
              ))}
              <Link href="/tools" className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium">
                Tools We Recommend
              </Link>
              <Link href="/quizzes" className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium">
                Quizzes
              </Link>
              <Link href="/assessments" className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium">
                Assessments
              </Link>
              <Link href="/start-here" className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium">
                Start Here
              </Link>
              <Link href="/technique-finder" className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium">
                Technique Finder
              </Link>
              <Link href="/about" className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium">
                About
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[var(--twilight)] text-[var(--starlight)]">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 className="font-heading text-lg font-700 mb-3">{SITE_NAME}</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Exploring lucid dreaming techniques, dream science, and consciousness practices.
                {" "}{getPublishedCount()} articles and growing.
              </p>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-heading text-sm font-600 uppercase tracking-wider mb-3 opacity-70">Explore</h4>
              <ul className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/category/${cat.slug}`} className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-heading text-sm font-600 uppercase tracking-wider mb-3 opacity-70">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/tools" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Tools We Recommend</Link></li>
                <li><Link href="/quizzes" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Quizzes</Link></li>
                <li><Link href="/assessments" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Assessments</Link></li>
                <li><Link href="/start-here" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Start Here</Link></li>
                <li><Link href="/technique-finder" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Technique Finder</Link></li>
                <li><Link href="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">About</Link></li>
                <li><Link href="/privacy" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter in footer */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="max-w-md">
              <h4 className="font-heading text-sm font-600 mb-2">Stay Connected</h4>
              <p className="text-xs opacity-70 mb-3">Join our community of lucid dreamers.</p>
              <NewsletterForm source="footer" variant="dark" />
            </div>
          </div>

          {/* Amazon Associate + Disclaimer + copyright */}
          <div className="mt-8 pt-6 border-t border-white/10 text-xs opacity-60">
            <p className="mb-2">
              As an Amazon Associate I earn from qualifying purchases.
            </p>
            <p className="mb-2">
              <strong>Disclaimer:</strong> The content on {SITE_NAME} is for educational and informational purposes only.
              It is not intended as a substitute for professional medical advice, diagnosis, or treatment.
              Always consult a qualified healthcare provider before making changes to your sleep habits or health practices.
            </p>
            <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-bottom" aria-label="Mobile tab bar">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className={`flex flex-col items-center gap-0.5 px-3 py-1 ${location === "/" ? "text-[var(--aurora-dim)]" : "text-muted-foreground"}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </Link>
          <Link href="/articles" className={`flex flex-col items-center gap-0.5 px-3 py-1 ${location === "/articles" ? "text-[var(--aurora-dim)]" : "text-muted-foreground"}`}>
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
          <Link href="/about" className={`flex flex-col items-center gap-0.5 px-3 py-1 ${location === "/about" ? "text-[var(--aurora-dim)]" : "text-muted-foreground"}`}>
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
