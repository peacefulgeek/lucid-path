import { useEffect } from "react";
import { SITE_NAME, SITE_DOMAIN } from "@/lib/articles";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = `Privacy Policy — ${SITE_NAME}`;
  }, []);

  return (
    <section className="container py-10 max-w-3xl">
      <h1 className="font-heading text-3xl font-800 mb-6" style={{ color: "var(--twilight)" }}>
        Privacy Policy
      </h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 27, 2026</p>

      <div className="article-body">
        <h2>Introduction</h2>
        <p>
          {SITE_NAME} ("we," "us," or "our") operates the website at {SITE_DOMAIN}. This Privacy Policy explains how we collect, use, and protect your information when you visit our site.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We collect minimal information to provide you with the best experience:
        </p>
        <ul>
          <li><strong>Email addresses:</strong> If you voluntarily subscribe to our newsletter, we collect your email address. This is stored securely on Bunny CDN storage infrastructure. We do not use any third-party email marketing services.</li>
          <li><strong>Cookie preferences:</strong> We store your cookie consent preference in your browser's local storage.</li>
        </ul>

        <h2>What We Do NOT Collect</h2>
        <p>We are committed to your privacy. We do not:</p>
        <ul>
          <li>Use any analytics tracking service or visitor monitoring tools</li>
          <li>Use third-party advertising or tracking cookies</li>
          <li>Collect personal information beyond what you voluntarily provide</li>
          <li>Sell, rent, or share your information with third parties</li>
          <li>Use any database service to store personal data</li>
          <li>Require account creation or user registration of any kind</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          We use only essential cookies to remember your preferences (such as cookie consent). We do not use tracking cookies, analytics cookies, or third-party cookies of any kind.
        </p>

        <h2>Email Storage</h2>
        <p>
          Newsletter subscriptions are stored as a simple log file on Bunny CDN storage infrastructure. We do not send automated emails. We do not use third-party email marketing platforms of any kind. Your email is stored solely for potential future communication about {SITE_NAME} content.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          We use Bunny CDN for content delivery and asset storage. Bunny CDN may collect standard server logs (IP addresses, request timestamps) as part of their service. Please refer to <a href="https://bunny.net/privacy" rel="nofollow" target="_blank">Bunny CDN's Privacy Policy</a> for details.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement reasonable security measures to protect your information. Our site is served over HTTPS, and all data transmission is encrypted.
        </p>

        <h2>Your Rights</h2>
        <p>
          You have the right to request deletion of any personal information we hold about you. Since we collect minimal data, this primarily applies to newsletter subscriptions.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          Our site is not directed at children under 13. We do not knowingly collect personal information from children.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy-related inquiries, please visit our website at {SITE_DOMAIN}.
        </p>
      </div>
    </section>
  );
}
