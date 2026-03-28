import React from "react";
import Link from "next/link";
import { Rocket } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Campaigns", href: "/campaigns" },
      { label: "Categories", href: "/categories" },
      { label: "Trending", href: "/campaigns?sort=trending" },
      { label: "Featured", href: "/campaigns?sort=featured" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Guidelines", href: "/guidelines" },
      { label: "API Docs", href: "/api-docs" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-secondary-200/60 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Columns */}
        <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-secondary-900 mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary-500 hover:text-secondary-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-secondary-100 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-600 text-white">
              <Rocket className="h-3 w-3" />
            </div>
            <span className="text-sm text-secondary-600">
              FundBD &mdash; Empowering Bangladesh&apos;s entrepreneurs
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-secondary-400">
            <span>&copy; {new Date().getFullYear()} FundBD. All rights reserved.</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>Made with ❤️ in Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
