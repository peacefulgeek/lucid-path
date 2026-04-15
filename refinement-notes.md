# Refinement PDF Key Points

## Affiliate Automation
- Phase A: Create product-catalog.ts (150-300 products with ASINs, category tags, topic-matching)
- Phase A: Create inline-affiliate-links.ts (keyword-based natural embedding sentences)
- Phase A: Build topic-matching logic by article title/categories
- Phase A: CHECK EVERY SINGLE ASIN - no spot checks
- Phase B: On article render, select up to 4 matching products, inject up to 4 inline links at natural breakpoints (~3-4 paragraphs), add "Dream Journey" section at bottom with 3-4 products
- Phase B: All links use tag=spankyspinola-20 + (paid link)
- Phase B: Total Amazon links per article: strictly 2-4
- Phase C: Extract all ASINs, verify via Amazon, replace discontinued, confirm all tagged

## Humanization Rules (Apply to All Articles)
- Randomize em dashes -> mix of ..., -, ~
- Add exactly 2 conversational interjections per article ("Stay with me here.", "I know, I know.", "Wild, right?", "Think about that for a second.")
- Ban AI words: profound, transformative, holistic, nuanced, multifaceted
- Aggressively vary sentence lengths; reduce repetitive starters like "This is/means/creates"

## Content Refresh Crons (Code Only - No Manus)
- Every 30 days: revise 25 articles (expand 1 paragraph + humanization edits)
- Every 3 months: revise 20 articles (edit 1 paragraph + add 1-2 sentences)
- AUTO = TRUE for all articles
- Use cheaper AI via direct API calls in code only

## Article Generation & Publishing Cadence
- Triggered only via live site API endpoint (must return clean JSON)
- Start with 30 published articles per new site
- Scale to ~250 articles total
- 5/day Mon-Fri until target, then 5/week

## Amazon Product Recommendations (Mandatory - Google-Safe)
- Every article must have strictly 2 to 4 Amazon links total
- Soft, conversational language: "One option...", "A tool that often helps...", "Something worth considering...", "For those looking for a simple solution...", "You could also try...", "A popular choice..."
- Spread naturally at logical points. No clumping.
- Each recommendation ends with (paid link)
- Include bottom "Dream Journey" / "Recommended Products" section with 3-4 soft suggestions
- Add disclosure: "As an Amazon Associate, I earn from qualifying purchases."

## Critical Rules
- No Manus scheduled crons - all deleted and disabled
- All logic and scheduling handled in code only (node-cron on Render)
- Prioritize helpful, people-first content with strong humanization
- Sonnet 4.6 for main generation; cheaper AI for crons and revisions

## FINALLY
- Fix articles showing raw HTML <a> tags in body text to be clickable
