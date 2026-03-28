export default function GuidelinesPage() {
  return (
    <div className="bg-white py-16">
      <article className="mx-auto max-w-4xl px-4">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900">
            Community Guidelines
          </h1>
          <p className="mt-3 text-lg text-secondary-600">
            FundBD is built on trust. These guidelines ensure our platform
            remains a safe, fair, and productive space for founders and
            supporters alike.
          </p>
        </header>

        <div className="prose prose-secondary max-w-none space-y-10 text-secondary-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-secondary-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-secondary-600">
          <section>
            <h2>Campaign Standards</h2>
            <p>
              Every campaign on FundBD must meet our quality and honesty
              standards. We review campaigns to protect both founders and
              supporters.
            </p>
            <ul>
              <li>Campaigns must have a clear, specific purpose and funding goal</li>
              <li>All claims must be truthful and verifiable — do not exaggerate outcomes or misrepresent your project</li>
              <li>Campaign media (images, videos) must be original or properly licensed</li>
              <li>Founders must provide regular updates to supporters throughout the campaign lifecycle</li>
              <li>Funding goals should be realistic and include a breakdown of how funds will be used</li>
              <li>Campaigns must be in Bangla or English (or both)</li>
            </ul>
          </section>

          <section>
            <h2>Prohibited Content</h2>
            <p>
              The following types of campaigns and content are not allowed on FundBD:
            </p>
            <ul>
              <li>Illegal activities or products prohibited under Bangladesh law</li>
              <li>Weapons, drugs, tobacco, or alcohol-related projects</li>
              <li>Hate speech, discrimination, or content that targets individuals or groups</li>
              <li>Ponzi schemes, multi-level marketing, or any fraudulent financial schemes</li>
              <li>Sexually explicit or exploitative content</li>
              <li>Campaigns that primarily benefit political parties or candidates</li>
              <li>Projects that pose environmental or public health risks</li>
              <li>Resale of goods without added value or creative contribution</li>
            </ul>
          </section>

          <section>
            <h2>Founder Responsibilities</h2>
            <p>As a campaign founder on FundBD, you agree to:</p>
            <ul>
              <li>Complete identity verification before launching your first campaign</li>
              <li>Use raised funds exclusively for the stated campaign purpose</li>
              <li>Respond to supporter inquiries within a reasonable timeframe</li>
              <li>Post meaningful progress updates at least every two weeks during an active campaign</li>
              <li>Fulfill any reward commitments made to supporters</li>
              <li>Notify FundBD and supporters immediately if you cannot deliver on your campaign promises</li>
              <li>Maintain accurate financial records related to campaign funds</li>
            </ul>
          </section>

          <section>
            <h2>Supporter Expectations</h2>
            <p>As a supporter, we ask that you:</p>
            <ul>
              <li>Understand that crowdfunding involves risk — campaigns may not always deliver as planned</li>
              <li>Review campaign details, trust scores, and founder profiles before contributing</li>
              <li>Engage constructively — provide feedback respectfully and avoid harassment</li>
              <li>Report suspicious campaigns or behavior through our reporting tools</li>
              <li>Do not use the platform to promote your own campaigns through spam comments</li>
            </ul>
          </section>

          <section>
            <h2>Reporting Violations</h2>
            <p>
              If you encounter content or behavior that violates these
              guidelines, please report it immediately. You can:
            </p>
            <ul>
              <li>Use the &quot;Report&quot; button on any campaign or profile page</li>
              <li>Email our trust team at <a href="mailto:trust@fundbd.com" className="text-primary-600 hover:underline">trust@fundbd.com</a></li>
              <li>Contact support through the Help Center</li>
            </ul>
            <p>
              All reports are reviewed by our team within 48 hours. You can
              report anonymously — we will never share your identity with the
              reported party.
            </p>
          </section>

          <section>
            <h2>Enforcement</h2>
            <p>
              Violations of these guidelines may result in the following actions,
              depending on severity:
            </p>
            <ul>
              <li><strong>Warning:</strong> A formal notice for minor first-time violations</li>
              <li><strong>Campaign removal:</strong> Campaigns that violate our standards will be taken down and remaining funds returned to supporters</li>
              <li><strong>Account suspension:</strong> Temporary restriction of account access for repeated or serious violations</li>
              <li><strong>Permanent ban:</strong> Termination of your FundBD account for fraud, illegal activity, or persistent guideline violations</li>
              <li><strong>Legal action:</strong> In cases of fraud or illegal activity, we may report the matter to law enforcement authorities</li>
            </ul>
            <p>
              We strive to be fair and proportionate in our enforcement. Founders
              and supporters will always have the opportunity to appeal a
              decision by contacting{" "}
              <a
                href="mailto:appeals@fundbd.com"
                className="text-primary-600 hover:underline"
              >
                appeals@fundbd.com
              </a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
