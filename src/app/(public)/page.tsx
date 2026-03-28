import Link from "next/link";
import {
  Rocket,
  TrendingUp,
  BarChart3,
  Shield,
  Lock,
  ArrowRight,
  Laptop,
  Heart,
  Sprout,
  GraduationCap,
  Stethoscope,
  ShoppingCart,
  UtensilsCrossed,
  Palette,
  Factory,
  Leaf,
  Landmark,
  Shirt,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { ActivityTicker } from "@/components/landing/ActivityTicker";

/* ─── Static Data ─────────────────────────────────────────── */

const stats = [
  { label: "Raised", value: "৳50M+" },
  { label: "Campaigns", value: "500+" },
  { label: "Supporters", value: "10,000+" },
];

const steps = [
  {
    icon: Rocket,
    title: "Create Your Campaign",
    description:
      "Tell your story, set your funding goal, and launch in minutes.",
  },
  {
    icon: TrendingUp,
    title: "Get Funded",
    description:
      "Share with your network, build trust with metrics, and watch your campaign grow.",
  },
  {
    icon: BarChart3,
    title: "Build & Grow",
    description:
      "Use funds to execute your vision, track milestones, and keep supporters updated.",
  },
];

const featuredCampaigns = [
  {
    title: "TechStartup BD: AI-Powered Logistics",
    tagline:
      "Revolutionizing last-mile delivery in Dhaka with smart route optimization",
    category: "Technology",
    raisedAmount: 3250000,
    goalAmount: 5000000,
    contributorCount: 142,
    founderName: "Rahim Ahmed",
    slug: "techstartup-bd",
    trustScore: 92,
  },
  {
    title: "EcoFarm Chittagong",
    tagline:
      "Sustainable organic farming bringing fresh produce to urban families",
    category: "Agriculture",
    raisedAmount: 1800000,
    goalAmount: 2500000,
    contributorCount: 89,
    founderName: "Nusrat Jahan",
    slug: "ecofarm-chittagong",
    trustScore: 88,
  },
  {
    title: "Dhaka EdTech Academy",
    tagline:
      "Making quality STEM education accessible to every student in Bangladesh",
    category: "Education",
    raisedAmount: 4100000,
    goalAmount: 5000000,
    contributorCount: 234,
    founderName: "Kamal Hossain",
    slug: "dhaka-edtech",
    trustScore: 95,
  },
  {
    title: "GreenPower Sylhet",
    tagline:
      "Affordable solar micro-grids for rural communities in the northeast",
    category: "Green Energy",
    raisedAmount: 920000,
    goalAmount: 3000000,
    contributorCount: 56,
    founderName: "Tasnim Akter",
    slug: "greenpower-sylhet",
    trustScore: 85,
  },
];

const categories = [
  { name: "Technology", icon: Laptop, count: 84 },
  { name: "Social Impact", icon: Heart, count: 62 },
  { name: "Agriculture", icon: Sprout, count: 45 },
  { name: "Education", icon: GraduationCap, count: 53 },
  { name: "Healthcare", icon: Stethoscope, count: 38 },
  { name: "E-commerce", icon: ShoppingCart, count: 41 },
  { name: "Food & Beverage", icon: UtensilsCrossed, count: 29 },
  { name: "Creative", icon: Palette, count: 35 },
  { name: "Manufacturing", icon: Factory, count: 22 },
  { name: "Green Energy", icon: Leaf, count: 27 },
  { name: "Fintech", icon: Landmark, count: 31 },
  { name: "Fashion & Lifestyle", icon: Shirt, count: 19 },
];

const trustPillars = [
  {
    icon: Shield,
    title: "Verified Founders",
    description:
      "Every founder goes through identity and business verification before launching a campaign.",
  },
  {
    icon: BarChart3,
    title: "Real Metrics",
    description:
      "Track actual revenue, growth, and milestones with verified data you can trust.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description:
      "Bank-grade security with bKash, Nagad, and card payments for safe transactions.",
  },
];

/* ─── Page ────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative py-24 sm:py-32 lg:py-40">
        {/* Background gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 via-white to-purple-50"
        />
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-200/30 to-pink-200/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-indigo-200/20 to-violet-200/20 blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Activity ticker */}
          <div className="mb-8">
            <ActivityTicker />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-secondary-900 leading-[1.1] mb-6">
            Fund the Future of{" "}
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Bangladesh
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-secondary-500 leading-relaxed mb-10">
            The trusted platform where innovators raise capital and supporters
            fund the next generation of Bangladeshi businesses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary-600 px-8 text-base font-semibold text-white shadow-md hover:bg-primary-700 hover:shadow-lg transition-all duration-200"
            >
              Start a Campaign
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/campaigns"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-secondary-300 px-8 text-base font-semibold text-secondary-700 hover:bg-secondary-50 transition-all duration-200"
            >
              Explore Campaigns
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 inline-flex flex-wrap items-center justify-center gap-6 sm:gap-0 sm:divide-x sm:divide-secondary-200 bg-white/70 backdrop-blur-sm border border-secondary-200/60 rounded-2xl px-4 sm:px-0 py-5 shadow-sm">
            {stats.map((stat) => (
              <div key={stat.label} className="px-6 sm:px-10 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-secondary-900">
                  {stat.value}
                </div>
                <div className="text-sm text-secondary-500 mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="info" className="mb-4">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 tracking-tight">
              Three simple steps to launch
            </h2>
            <p className="mt-4 text-lg text-secondary-500 max-w-xl mx-auto">
              From idea to funded in minutes. Our streamlined process makes
              fundraising effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Card key={step.title} padding="lg" className="relative text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white text-sm font-bold shadow-md">
                      {i + 1}
                    </span>
                  </div>
                  <div className="mt-4 mb-5 inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary-50 text-primary-600">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-secondary-500 leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Campaigns ────────────────────────────── */}
      <section className="py-24 bg-secondary-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
            <div>
              <Badge variant="success" dot className="mb-4">
                Trending
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 tracking-tight">
                Trending Campaigns
              </h2>
              <p className="mt-3 text-lg text-secondary-500 max-w-lg">
                Discover innovative projects from Bangladesh's brightest
                founders.
              </p>
            </div>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-700 transition-colors shrink-0"
            >
              View All Campaigns
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.slug} {...campaign} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4">
              Browse
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 tracking-tight">
              Explore Categories
            </h2>
            <p className="mt-4 text-lg text-secondary-500 max-w-xl mx-auto">
              Find campaigns in the industries that matter to you.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const slug = cat.name.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-");
              return (
                <Link
                  key={cat.name}
                  href={`/categories/${slug}`}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-secondary-200/60 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 hover:border-primary-200"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-secondary-800">
                      {cat.name}
                    </div>
                    <div className="text-xs text-secondary-400 mt-0.5">
                      {cat.count} campaigns
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Trust & Transparency ──────────────────────────── */}
      <section className="py-24 bg-secondary-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="success" className="mb-4">
              Our Promise
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 tracking-tight">
              Built on Trust & Transparency
            </h2>
            <p className="mt-4 text-lg text-secondary-500 max-w-xl mx-auto">
              Your confidence is our priority. Every layer of FundBD is designed
              for accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Card key={pillar.title} padding="lg" className="text-center">
                  <div className="mb-5 inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-secondary-500 leading-relaxed">
                    {pillar.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="relative py-24 sm:py-32">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
            Ready to bring your idea to life?
          </h2>
          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl mx-auto">
            Join thousands of founders who are building the future of
            Bangladesh.
          </p>
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-semibold text-primary-700 shadow-lg hover:bg-white/90 transition-all duration-200"
          >
            Start Your Campaign
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
