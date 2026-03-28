import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const posts = [
  {
    title: "How to Create a Winning Campaign",
    excerpt:
      "Learn the key ingredients that separate successful campaigns from the rest — from compelling storytelling to realistic funding goals.",
    date: "March 18, 2026",
    category: "Guides",
    readTime: "6 min read",
    categoryVariant: "info" as const,
  },
  {
    title: "Understanding Trust Scores",
    excerpt:
      "Our trust-score system is designed to build confidence. Here's exactly how it works and what founders can do to improve theirs.",
    date: "March 10, 2026",
    category: "Product",
    readTime: "4 min read",
    categoryVariant: "success" as const,
  },
  {
    title: "Bangladesh's Startup Ecosystem in 2026",
    excerpt:
      "A deep dive into the state of entrepreneurship in Bangladesh — funding trends, emerging sectors, and what's next for local founders.",
    date: "February 28, 2026",
    category: "Insights",
    readTime: "8 min read",
    categoryVariant: "warning" as const,
  },
  {
    title: "Founder Spotlight: Rahim Ahmed",
    excerpt:
      "How Rahim raised ৳1.2M on FundBD to launch his edtech platform — and the lessons he learned along the way.",
    date: "February 15, 2026",
    category: "Stories",
    readTime: "5 min read",
    categoryVariant: "danger" as const,
  },
  {
    title: "5 Tips for First-Time Supporters",
    excerpt:
      "New to crowdfunding? Here's how to evaluate campaigns, understand risks, and make contributions you feel good about.",
    date: "February 5, 2026",
    category: "Guides",
    readTime: "4 min read",
    categoryVariant: "info" as const,
  },
  {
    title: "Our 2026 Growth Report",
    excerpt:
      "FundBD crossed ৳50M in total funds raised. We're sharing the numbers, the milestones, and our roadmap for the year ahead.",
    date: "January 20, 2026",
    category: "Company",
    readTime: "7 min read",
    categoryVariant: "default" as const,
  },
];

export default function BlogPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
            FundBD Blog
          </h1>
          <p className="mt-4 text-lg text-secondary-600">
            Insights, stories, and updates from our community
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.title} href="#" className="group">
                <Card hover padding="none" className="flex h-full flex-col">
                  <div className="h-40 rounded-t-xl bg-gradient-to-br from-secondary-100 to-secondary-200" />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant={post.categoryVariant} size="sm">
                        {post.category}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-secondary-400">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm text-secondary-500 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-secondary-400">
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-primary-600 group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
