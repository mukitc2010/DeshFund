"use client";

import { useState } from "react";
import {
  Search,
  Rocket,
  Megaphone,
  HandCoins,
  ShieldCheck,
  Wallet,
  UserCog,
  ChevronDown,
  Mail,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const categories = [
  {
    icon: Rocket,
    title: "Getting Started",
    questions: [
      "How do I create a FundBD account?",
      "What types of campaigns can I create?",
      "Is FundBD free to use?",
      "How does the trust score system work?",
    ],
  },
  {
    icon: Megaphone,
    title: "Creating Campaigns",
    questions: [
      "How do I set a realistic funding goal?",
      "What makes a campaign successful?",
      "Can I edit my campaign after publishing?",
      "How long should my campaign run?",
    ],
  },
  {
    icon: HandCoins,
    title: "Making Contributions",
    questions: [
      "How do I contribute to a campaign?",
      "What payment methods are accepted?",
      "Can I get a refund on my contribution?",
      "Is there a minimum contribution amount?",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Trust & Verification",
    questions: [
      "How is the trust score calculated?",
      "What documents do I need for verification?",
      "How long does verification take?",
    ],
  },
  {
    icon: Wallet,
    title: "Payments & Withdrawals",
    questions: [
      "When do I receive my funds?",
      "What are FundBD's fees?",
      "Which withdrawal methods are available?",
      "How long do withdrawals take?",
    ],
  },
  {
    icon: UserCog,
    title: "Account & Security",
    questions: [
      "How do I reset my password?",
      "How do I enable two-factor authentication?",
      "Can I delete my account?",
    ],
  },
];

function AccordionItem({ question }: { question: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="flex w-full items-center justify-between py-3 text-left text-sm text-secondary-700 hover:text-secondary-900 transition-colors"
    >
      <span>{question}</span>
      <ChevronDown
        className={`h-4 w-4 shrink-0 text-secondary-400 transition-transform ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

export default function HelpPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
            Help Center
          </h1>
          <p className="mt-4 text-lg text-secondary-600">
            How can we help you?
          </p>
          <div className="mt-8">
            <Input
              placeholder="Search for answers..."
              icon={<Search className="h-4 w-4" />}
              className="text-base"
            />
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Card key={cat.title} padding="lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                    <cat.icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-semibold text-secondary-900">
                    {cat.title}
                  </h2>
                </div>
                <div className="divide-y divide-secondary-100">
                  {cat.questions.map((q) => (
                    <AccordionItem key={q} question={q} />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="border-t border-secondary-200 bg-secondary-50 py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <Mail className="mx-auto mb-4 h-8 w-8 text-primary-600" />
          <h2 className="text-2xl font-bold text-secondary-900">
            Still need help?
          </h2>
          <p className="mt-2 text-secondary-600">
            Our support team typically responds within 24 hours.
          </p>
          <div className="mt-6">
            <a href="mailto:support@fundbd.com">
              <Button size="lg">Contact Support</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
