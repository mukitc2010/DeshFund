import {
  Target,
  Users,
  Shield,
  BarChart3,
  Heart,
  Globe,
  Lightbulb,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "Every campaign is verified. Every transaction is tracked. Our trust-score system ensures supporters can give with confidence.",
  },
  {
    icon: Heart,
    title: "Founder First",
    description:
      "We build tools that put founders in control — from campaign creation to fund disbursement, the experience is designed for you.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven",
    description:
      "Real-time analytics, engagement metrics, and actionable insights help campaigns succeed and supporters make informed decisions.",
  },
  {
    icon: Users,
    title: "Community-Powered",
    description:
      "Crowdfunding is a collective act. We foster a community where supporters and founders grow together.",
  },
];

const team = [
  {
    name: "Farhan Rahman",
    role: "Chief Executive Officer",
    bio: "Former fintech lead at bKash with 12 years of experience in digital payments and platform scaling across South Asia.",
  },
  {
    name: "Nusrat Jahan",
    role: "Chief Technology Officer",
    bio: "Ex-Google engineer who returned to Dhaka to build technology that empowers local entrepreneurs. MS in CS from Stanford.",
  },
  {
    name: "Arif Hossain",
    role: "Chief Operating Officer",
    bio: "Operations veteran from Pathao and Chaldal, specializing in marketplace trust systems and regulatory compliance in Bangladesh.",
  },
];

const stats = [
  { value: "৳50M+", label: "Raised" },
  { value: "500+", label: "Campaigns" },
  { value: "10,000+", label: "Supporters" },
  { value: "12", label: "Categories" },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
            About FundBD
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-secondary-600">
            Empowering Bangladesh&apos;s entrepreneurs by connecting them with
            supporters who believe in their vision.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-4 flex items-center gap-2 text-primary-600">
                <Globe className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Our Story
                </span>
              </div>
              <h2 className="text-3xl font-bold text-secondary-900">
                Built in Dhaka, for Bangladesh and beyond
              </h2>
              <p className="mt-4 text-secondary-600 leading-relaxed">
                Founded in 2025, FundBD was born from a simple observation:
                Bangladesh has no shortage of brilliant ideas — but accessing
                early-stage funding remains a massive barrier for most
                entrepreneurs.
              </p>
              <p className="mt-4 text-secondary-600 leading-relaxed">
                We set out to build the most trusted crowdfunding ecosystem in
                Bangladesh and emerging markets. Our platform combines rigorous
                verification, transparent trust scores, and community-driven
                support to help founders turn ideas into reality.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 p-8">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-1 h-6 w-6 shrink-0 text-primary-600" />
                <div>
                  <h3 className="font-semibold text-secondary-900">
                    Our Mission
                  </h3>
                  <p className="mt-2 text-sm text-secondary-600 leading-relaxed">
                    To democratize access to funding for entrepreneurs across
                    Bangladesh by building a platform rooted in trust,
                    transparency, and community support — enabling anyone with a
                    great idea to find the backing they need.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-secondary-200 bg-secondary-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary-600">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-secondary-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-2 text-primary-600">
              <Target className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Our Values
              </span>
            </div>
            <h2 className="text-3xl font-bold text-secondary-900">
              What drives us every day
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <Card key={v.title} padding="lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">
                      {v.title}
                    </h3>
                    <p className="mt-1 text-sm text-secondary-600 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-secondary-200 bg-secondary-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-secondary-900">
              Meet the team
            </h2>
            <p className="mt-3 text-secondary-600">
              A small, focused team building something big for Bangladesh.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {team.map((member) => (
              <Card key={member.name} padding="lg" className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-secondary-900">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-primary-600">
                  {member.role}
                </p>
                <p className="mt-3 text-sm text-secondary-500 leading-relaxed">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
