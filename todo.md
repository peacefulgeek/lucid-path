# Post-Build 10 Checks — The Lucid Path

## Checks
- [ ] 1. EMAIL STORAGE — Bunny CDN JSONL, zero MailerLite/SMTP2GO/TiDB
- [ ] 2. AUTH CLEANUP — Zero OAuth/login/drizzle/session
- [ ] 3. CRON + MANUS CLEANUP — grep manus = 0, no forge.manus.im
- [ ] 4. IMAGE AUDIT — 300 hero + 300 OG unique, on Bunny CDN, zero unsplash, zero manus CDN, zero 404s
- [ ] 5. 404 PAGE — HTTP 404 status, teaching + 6 article links, branded
- [ ] 6. SITEMAP + PRIVACY — Sitemap shows published only, privacy refs Bunny CDN, cookie banner
- [ ] 7. FONTS — Self-hosted Bunny CDN, zero googleapis, zero CloudFront, zero analytics
- [ ] 8. KALESH BIO — "Kalesh — Consciousness Teacher & Writer", link to kalesh.love, zero clairvoyant/psychic
- [ ] 9. DYNAMIC ARTICLE COUNT — Uses published/visible count, not total
- [ ] 10. BUILD + DEPLOY — pnpm build succeeds, push to GitHub, deploy succeeds

## Additional
- [ ] Verify every image URL is unique (no duplicates across 300 hero + 300 OG)
- [ ] Fix cron: 5/day initially, then 5/week ongoing
- [ ] Confirm all 300 hero images return HTTP 200 from Bunny CDN
- [ ] Confirm all 300 OG images return HTTP 200 from Bunny CDN
