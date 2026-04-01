import { useEffect } from "react";
import { SITE_NAME, SITE_DOMAIN } from "@/lib/articles";

export default function TermsOfService() {
  useEffect(() => {
    document.title = `Terms of Service — ${SITE_NAME}`;
  }, []);

  return (
    <section className="container py-10 max-w-3xl">
      <h1 className="font-heading text-3xl font-800 mb-6" style={{ color: "var(--twilight)" }}>
        Terms of Service
      </h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: April 1, 2026</p>

      <div className="article-body">
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using {SITE_NAME} ({SITE_DOMAIN}), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our site.
        </p>

        <h2>Educational Content Disclaimer</h2>
        <p>
          All content on {SITE_NAME} is provided for <strong>educational and informational purposes only</strong>. Our articles about lucid dreaming, dream science, sleep practices, and consciousness exploration are not intended as:
        </p>
        <ul>
          <li>Professional medical advice, diagnosis, or treatment</li>
          <li>A substitute for consultation with qualified healthcare providers</li>
          <li>Professional psychological or psychiatric guidance</li>
          <li>Guaranteed methods for achieving specific results</li>
        </ul>
        <p>
          Always consult a qualified healthcare provider before making changes to your sleep habits, starting new practices, or if you have concerns about your physical or mental health. Lucid dreaming practices may not be suitable for everyone, particularly individuals with certain sleep disorders or mental health conditions.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on {SITE_NAME}, including articles, images, graphics, and design elements, is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
        </p>

        <h2>User Conduct</h2>
        <p>
          When using our site, you agree not to:
        </p>
        <ul>
          <li>Scrape, crawl, or harvest content in bulk without permission</li>
          <li>Attempt to interfere with the site's functionality or security</li>
          <li>Use the site for any unlawful purpose</li>
          <li>Misrepresent your identity or affiliation</li>
        </ul>

        <h2>Newsletter Subscription</h2>
        <p>
          By subscribing to our newsletter, you consent to receiving occasional communications from {SITE_NAME}. You may unsubscribe at any time. We do not share your email address with third parties.
        </p>

        <h2>External Links &amp; Affiliate Disclosure</h2>
        <p>
          Our site may contain links to external websites, including affiliate links. As an Amazon Associate we earn from qualifying purchases. Some links on this site are affiliate links, meaning we may earn a small commission at no additional cost to you. We are not responsible for the content, privacy practices, or availability of external sites. Following external links is at your own risk.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          {SITE_NAME} and its contributors shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the site or reliance on its content. This includes, but is not limited to, any adverse effects from attempting lucid dreaming techniques described on the site.
        </p>

        <h2>Modifications</h2>
        <p>
          We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this page. Your continued use of the site after changes constitutes acceptance of the modified terms.
        </p>

        <h2>Governing Law</h2>
        <p>
          These Terms of Service are governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
        </p>
      </div>
    </section>
  );
}
