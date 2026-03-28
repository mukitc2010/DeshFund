export default function CookiePolicyPage() {
  return (
    <div className="bg-white py-16">
      <article className="mx-auto max-w-4xl px-4">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900">
            Cookie Policy
          </h1>
          <p className="mt-3 text-secondary-500">Last updated: March 2026</p>
        </header>

        <div className="prose prose-secondary max-w-none space-y-8 text-secondary-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-secondary-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:mb-3">
          <section>
            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit a website. They help the site remember your preferences and understand how you interact with it. Cookies are widely used across the internet and are essential for many website features to work properly.
            </p>
          </section>

          <section>
            <h2>Types of Cookies We Use</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-secondary-200 bg-secondary-50">
                    <th className="px-4 py-3 text-left font-semibold text-secondary-900">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary-900">Purpose</th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary-900">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  <tr>
                    <td className="px-4 py-3 font-medium text-secondary-900">Essential</td>
                    <td className="px-4 py-3 text-secondary-600">Required for the Platform to function. These handle authentication, security, and core features like session management.</td>
                    <td className="px-4 py-3 text-secondary-600">Session / 1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-secondary-900">Analytics</td>
                    <td className="px-4 py-3 text-secondary-600">Help us understand how visitors interact with the Platform, which pages are most popular, and where users encounter issues.</td>
                    <td className="px-4 py-3 text-secondary-600">Up to 2 years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-secondary-900">Functional</td>
                    <td className="px-4 py-3 text-secondary-600">Remember your preferences such as language, region, and display settings to provide a personalized experience.</td>
                    <td className="px-4 py-3 text-secondary-600">Up to 1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-secondary-900">Marketing</td>
                    <td className="px-4 py-3 text-secondary-600">Used to deliver relevant advertisements and track the effectiveness of marketing campaigns across platforms.</td>
                    <td className="px-4 py-3 text-secondary-600">Up to 1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>How to Manage Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can typically find cookie management options in your browser&apos;s &quot;Settings&quot; or &quot;Preferences&quot; menu. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-secondary-600">
              <li>View and delete existing cookies</li>
              <li>Block all cookies or only third-party cookies</li>
              <li>Set your browser to notify you when a cookie is being set</li>
              <li>Configure different settings for different websites</li>
            </ul>
            <p>
              Please note that disabling essential cookies may prevent certain features of the Platform from working properly. If you block analytics and marketing cookies, we will still be able to provide core functionality, but your experience may be less personalized.
            </p>
          </section>

          <section>
            <h2>Third-Party Cookies</h2>
            <p>
              Some cookies on our Platform are set by third-party services we use, including analytics providers and payment processors. These cookies are governed by the respective third party&apos;s privacy policy. We work only with reputable partners who adhere to strong data protection standards.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              If you have questions about our use of cookies, contact us at{" "}
              <a href="mailto:privacy@fundbd.com" className="text-primary-600 hover:underline">
                privacy@fundbd.com
              </a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
