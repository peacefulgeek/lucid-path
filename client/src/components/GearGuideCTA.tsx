/**
 * GearGuideCTA.tsx
 * Cross-linking banner that appears at the bottom of articles,
 * directing readers to the full gear guide page.
 */
import { Link } from "wouter";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function GearGuideCTA() {
  return (
    <div className="mt-6 p-5 rounded-xl border border-[var(--aurora)]/20 bg-gradient-to-r from-[var(--twilight)]/5 via-[var(--aurora)]/5 to-transparent">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-[var(--twilight)]/10 flex items-center justify-center text-[var(--twilight)] shrink-0">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-heading font-700 text-sm mb-1" style={{ color: "var(--twilight)" }}>
            The Lucid Dreamer's Gear Guide
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            67 verified products we trust for building a serious lucid dreaming practice — books, supplements, sleep masks, journals, and more.
          </p>
          <Link
            href="/recommended-products"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--aurora-dim)] hover:text-[var(--twilight)] transition-colors"
          >
            Browse the full gear guide
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
