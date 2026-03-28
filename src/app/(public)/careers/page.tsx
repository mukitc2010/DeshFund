import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Wifi,
  DollarSign,
  BookOpen,
  HeartPulse,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const perks = [
  {
    icon: Wifi,
    title: "Remote-First",
    description: "Work from anywhere in Bangladesh — or our Dhaka office.",
  },
  {
    icon: DollarSign,
    title: "Competitive Salary",
    description: "Top-of-market pay benchmarked against leading BD startups.",
  },
  {
    icon: BookOpen,
    title: "Learning Budget",
    description: "৳50,000/year for courses, conferences, and books.",
  },
  {
    icon: HeartPulse,
    title: "Health Insurance",
    description: "Comprehensive coverage for you and your family.",
  },
];

const positions = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Dhaka / Remote",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Dhaka / Remote",
    type: "Full-time",
  },
  {
    title: "Growth Marketing Lead",
    department: "Marketing",
    location: "Dhaka",
    type: "Full-time",
  },
  {
    title: "Community Manager",
    department: "Operations",
    location: "Dhaka",
    type: "Full-time",
  },
  {
    title: "Data Analyst",
    department: "Product",
    location: "Remote",
    type: "Full-time",
  },
];

export default function CareersPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
            Join Our Team
          </h1>
          <p className="mt-4 text-lg text-secondary-600">
            Help us build the future of crowdfunding in Bangladesh
          </p>
        </div>
      </section>

      {/* Culture */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold text-secondary-900">
            Why work at FundBD?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-secondary-600">
            We&apos;re a small team solving a big problem. Every person here has
            a direct impact on the founders and communities we serve.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {perks.map((perk) => (
              <Card key={perk.title} padding="lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                    <perk.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">
                      {perk.title}
                    </h3>
                    <p className="mt-1 text-sm text-secondary-500">
                      {perk.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="border-t border-secondary-200 bg-secondary-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-secondary-900">
            Open Positions
          </h2>
          <p className="mt-2 text-secondary-600">
            Don&apos;t see a fit? Send us your resume anyway —{" "}
            <a
              href="mailto:careers@fundbd.com"
              className="text-primary-600 hover:underline"
            >
              careers@fundbd.com
            </a>
          </p>

          <div className="mt-8 space-y-4">
            {positions.map((pos) => (
              <Card key={pos.title} padding="md">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-secondary-900">
                      {pos.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-secondary-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        {pos.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {pos.location}
                      </span>
                      <Badge variant="outline" size="sm">
                        {pos.type}
                      </Badge>
                    </div>
                  </div>
                  <Link href="mailto:careers@fundbd.com">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<ArrowRight className="h-3.5 w-3.5" />}
                    >
                      Apply
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
