"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Bell, ChevronDown, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, getDashboardPath } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";

const navLinks = [
  { label: "Campaigns", href: "/campaigns" },
  { label: "Categories", href: "/categories" },
];

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userMenuItems = user
    ? [
        {
          label: "Dashboard",
          onClick: () => router.push(getDashboardPath(user.role)),
          icon: <Rocket className="h-4 w-4" />,
        },
        {
          label: "Profile",
          onClick: () => router.push(`${getDashboardPath(user.role)}/profile`),
          icon: <ChevronDown className="h-4 w-4" />,
        },
        {
          label: "Log out",
          onClick: () => logout(),
          danger: true,
        },
      ]
    : [];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-secondary-200/60 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Rocket className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-secondary-900">
              FundBD
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-secondary-600 rounded-lg transition-colors hover:text-secondary-900 hover:bg-secondary-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Auth buttons or user menu */}
        <div className="flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <button className="relative p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50 transition-colors">
                    <Bell className="h-5 w-5" />
                  </button>
                  <Dropdown
                    align="right"
                    trigger={
                      <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-secondary-50 transition-colors">
                        <Avatar
                          src={user.profile.avatarUrl}
                          fallback={user.profile.displayName}
                          size="sm"
                        />
                        <ChevronDown className="h-3.5 w-3.5 text-secondary-400" />
                      </button>
                    }
                    items={userMenuItems}
                  />
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/login")}
                  >
                    Log in
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push("/signup")}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-50 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-secondary-100 bg-white animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-secondary-700 rounded-lg hover:bg-secondary-50"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t border-secondary-100">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
                    <Avatar
                      src={user.profile.avatarUrl}
                      fallback={user.profile.displayName}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium text-secondary-900">
                        {user.profile.displayName}
                      </p>
                      <p className="text-xs text-secondary-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href={getDashboardPath(user.role)}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-secondary-700 rounded-lg hover:bg-secondary-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="block w-full text-left px-3 py-2.5 text-sm font-medium text-danger-600 rounded-lg hover:bg-danger-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/login");
                    }}
                  >
                    Log in
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/signup");
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
