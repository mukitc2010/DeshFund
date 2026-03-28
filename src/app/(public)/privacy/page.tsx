export default function PrivacyPage() {
  return (
    <div className="bg-white py-16">
      <article className="mx-auto max-w-4xl px-4">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-secondary-500">Last updated: March 2026</p>
          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            This is a sample document for demonstration purposes.
          </div>
        </header>

        <div className="prose prose-secondary max-w-none space-y-8 text-secondary-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-secondary-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-secondary-600">
          <section>
            <h2>1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Account information: name, email address, phone number, and password when you register</li>
              <li>Profile information: photo, bio, location, and social media links</li>
              <li>Campaign information: project details, funding goals, images, and updates</li>
              <li>Payment information: processed securely by our payment partners (bKash, Nagad, bank details)</li>
              <li>Verification documents: national ID, trade license, or other identity documents submitted for trust verification</li>
              <li>Communications: messages you send through the Platform, support requests, and feedback</li>
            </ul>
            <p>We also automatically collect usage data including IP addresses, browser type, device information, pages visited, and interaction patterns through cookies and similar technologies.</p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve the Platform</li>
              <li>Process contributions and disbursements</li>
              <li>Calculate and display trust scores</li>
              <li>Send transaction confirmations, campaign updates, and service notifications</li>
              <li>Detect and prevent fraud, abuse, and security incidents</li>
              <li>Comply with legal obligations under Bangladesh law</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2>3. Data Sharing</h2>
            <p>We do not sell your personal information. We may share your data with:</p>
            <ul>
              <li>Payment processors to complete transactions</li>
              <li>Identity verification services for trust-score calculations</li>
              <li>Cloud service providers who host our infrastructure</li>
              <li>Law enforcement or regulatory bodies when required by Bangladesh law</li>
              <li>Other users, to the extent you make information public on the Platform (e.g., campaign details, public profiles)</li>
            </ul>
            <p>All third-party service providers are contractually required to protect your data and use it only for the purposes we specify.</p>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including encryption of data in transit (TLS 1.3) and at rest (AES-256), regular security audits, access controls, and secure development practices.
            </p>
            <p>
              While we take reasonable steps to protect your data, no method of transmission over the Internet is 100% secure. We encourage you to use strong passwords and enable two-factor authentication.
            </p>
          </section>

          <section>
            <h2>5. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to operate the Platform, remember your preferences, and analyze usage. For detailed information about our cookie practices, please see our <a href="/cookies" className="text-primary-600 hover:underline">Cookie Policy</a>.
            </p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>In accordance with applicable data protection principles, you have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal retention requirements)</li>
              <li>Withdraw consent for marketing communications at any time</li>
              <li>Export your data in a machine-readable format</li>
              <li>Lodge a complaint with the relevant data protection authority</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:privacy@fundbd.com" className="text-primary-600 hover:underline">privacy@fundbd.com</a>.</p>
          </section>

          <section>
            <h2>7. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information for up to 5 years as required by Bangladesh financial regulations and tax law. Anonymized analytics data may be retained indefinitely.
            </p>
          </section>

          <section>
            <h2>8. Children&apos;s Privacy</h2>
            <p>
              The Platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If we learn that we have collected data from a child under 18, we will take steps to delete that information promptly.
            </p>
          </section>

          <section>
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on the Platform and, for registered users, via email notification at least 14 days before the changes take effect.
            </p>
          </section>

          <section>
            <h2>10. Contact Us</h2>
            <p>
              For privacy-related inquiries, contact our Data Protection Officer at{" "}
              <a href="mailto:privacy@fundbd.com" className="text-primary-600 hover:underline">privacy@fundbd.com</a> or write to:
            </p>
            <p>
              Data Protection Officer
              <br />
              FundBD Limited
              <br />
              House 42, Road 11, Banani
              <br />
              Dhaka 1213, Bangladesh
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
