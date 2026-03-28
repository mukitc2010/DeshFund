export default function TermsPage() {
  return (
    <div className="bg-white py-16">
      <article className="mx-auto max-w-4xl px-4">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900">
            Terms of Service
          </h1>
          <p className="mt-3 text-secondary-500">Last updated: March 2026</p>
          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            This is a sample document for demonstration purposes. Please consult
            legal counsel before using this as a basis for your own terms.
          </div>
        </header>

        <div className="prose prose-secondary max-w-none space-y-8 text-secondary-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-secondary-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:mb-3">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the FundBD platform (&quot;Platform&quot;),
              you agree to be bound by these Terms of Service
              (&quot;Terms&quot;). If you do not agree to these Terms, you may
              not access or use the Platform. These Terms constitute a legally
              binding agreement between you and FundBD Limited, a company
              incorporated under the laws of the People&apos;s Republic of
              Bangladesh.
            </p>
            <p>
              We may update these Terms from time to time. Continued use of the
              Platform after changes constitutes acceptance of the revised Terms.
              We will notify registered users of material changes via email or
              in-app notification.
            </p>
          </section>

          <section>
            <h2>2. Platform Description</h2>
            <p>
              FundBD is a crowdfunding platform that enables individuals and
              organizations (&quot;Founders&quot;) to create campaigns seeking
              financial support from the public (&quot;Supporters&quot;). FundBD
              facilitates the connection between Founders and Supporters but does
              not guarantee the success of any campaign or the delivery of any
              promised rewards.
            </p>
            <p>
              The Platform provides tools for campaign creation, payment
              processing, trust verification, analytics, and communication
              between parties. FundBD acts as an intermediary and is not a party
              to any agreement between Founders and Supporters.
            </p>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>
              To use certain features of the Platform, you must create an
              account. You agree to provide accurate, current, and complete
              information during registration and to keep your account
              information updated. You are responsible for maintaining the
              confidentiality of your login credentials.
            </p>
            <p>
              You must be at least 18 years of age to create an account. By
              creating an account, you represent that you meet this requirement.
              FundBD reserves the right to suspend or terminate accounts that
              violate these Terms or engage in fraudulent activity.
            </p>
          </section>

          <section>
            <h2>4. Campaign Guidelines</h2>
            <p>
              All campaigns must comply with our Community Guidelines and
              applicable laws. Campaigns must accurately describe the project,
              its goals, and how funds will be used. Founders must provide
              truthful information and not mislead Supporters.
            </p>
            <p>
              FundBD reserves the right to review, modify, or remove campaigns
              that violate our guidelines, contain prohibited content, or pose a
              risk to the community. Campaigns related to illegal activities,
              hate speech, or harmful products are strictly prohibited.
            </p>
          </section>

          <section>
            <h2>5. Contributions & Payments</h2>
            <p>
              Contributions made through the Platform are voluntary. Supporters
              understand that crowdfunding carries inherent risk and that
              campaigns may not deliver promised outcomes. FundBD does not
              provide refunds for contributions except in cases of verified
              fraud.
            </p>
            <p>
              All payments are processed through our authorized payment partners
              in compliance with Bangladesh Bank regulations. Supported payment
              methods include bKash, Nagad, bank transfer, and major
              credit/debit cards.
            </p>
          </section>

          <section>
            <h2>6. Fees & Charges</h2>
            <p>
              FundBD charges a platform fee of 5% on successfully funded
              campaigns. Payment processing fees of 2-3% may apply depending on
              the payment method. Fees are deducted from the total amount raised
              before disbursement to the Founder.
            </p>
            <p>
              Creating an account and browsing campaigns is free. FundBD
              reserves the right to modify its fee structure with 30 days&apos;
              notice to active campaign Founders.
            </p>
          </section>

          <section>
            <h2>7. Intellectual Property</h2>
            <p>
              The FundBD name, logo, and all related trademarks are the property
              of FundBD Limited. Content uploaded by users remains the property
              of the respective users, but by uploading content you grant FundBD
              a non-exclusive, worldwide license to display and distribute that
              content in connection with the Platform.
            </p>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>
              FundBD provides the Platform on an &quot;as is&quot; basis. To the
              maximum extent permitted by law, FundBD shall not be liable for
              any indirect, incidental, special, or consequential damages
              arising from your use of the Platform. Our total liability shall
              not exceed the amount of fees paid by you to FundBD in the twelve
              months preceding the claim.
            </p>
          </section>

          <section>
            <h2>9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the People&apos;s Republic of Bangladesh. Any disputes
              arising from these Terms or your use of the Platform shall be
              subject to the exclusive jurisdiction of the courts in Dhaka,
              Bangladesh.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at{" "}
              <a
                href="mailto:legal@fundbd.com"
                className="text-primary-600 hover:underline"
              >
                legal@fundbd.com
              </a>{" "}
              or write to:
            </p>
            <p>
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
