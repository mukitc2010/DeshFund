"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  PlusCircle,
  Wallet,
  User,
  Heart,
  Bell,
  Settings,
  Users,
  CreditCard,
  Shield,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface SidebarProps {
  role: UserRole;
  open?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navByRole: Record<UserRole, NavItem[]> = {
  FOUNDER: [
    { label: "Overview", href: "/founder", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "My Campaigns", href: "/founder/campaigns", icon: <FolderOpen className="h-4 w-4" /> },
    { label: "Create Campaign", href: "/founder/campaigns/new", icon: <PlusCircle className="h-4 w-4" /> },
    { label: "Withdrawals", href: "/founder/withdrawals", icon: <Wallet className="h-4 w-4" /> },
    { label: "Profile", href: "/founder/profile", icon: <User className="h-4 w-4" /> },
  ],
  SUPPORTER: [
    { label: "Overview", href: "/supporter", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Contributions", href: "/supporter/contributions", icon: <Heart className="h-4 w-4" /> },
    { label: "Saved Campaigns", href: "/supporter/saved", icon: <Bookmark className="h-4 w-4" /> },
    { label: "Notifications", href: "/supporter/notifications", icon: <Bell className="h-4 w-4" /> },
    { label: "Profile", href: "/supporter/profile", icon: <User className="h-4 w-4" /> },
  ],
  ADMIN: [
    { label: "Overview", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Campaigns", href: "/admin/campaigns", icon: <FolderOpen className="h-4 w-4" /> },
    { label: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
    { label: "Transactions", href: "/admin/transactions", icon: <CreditCard className="h-4 w-4" /> },
    { label: "Withdrawals", href: "/admin/withdrawals", icon: <Wallet className="h-4 w-4" /> },
    { label: "Verifications", href: "/admin/verifications", icon: <Shield className="h-4 w-4" /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
  ],
};

export function Sidebar({ role, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const items = navByRole[role];

  const isActive = (href: string) => {
    if (href === `/${role.toLowerCase()}`) return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebar = (
    <aside className="flex h-full w-64 flex-col bg-white border-r border-secondary-200/60">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-secondary-100">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-white text-xs font-bold">
          F
        </div>
        <span className="text-base font-bold tracking-tight text-secondary-900">FundBD</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-50 text-primary-700 border-l-2 border-primary-600"
                  : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 border-l-2 border-transparent"
              )}
            >
              <span className={cn("shrink-0", active ? "text-primary-600" : "text-secondary-400")}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-secondary-100">
        <p className="text-xs text-secondary-400">
          {role.charAt(0) + role.slice(1).toLowerCase()} Dashboard
        </p>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block shrink-0">{sidebar}</div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <div className="relative h-full w-64 animate-slide-down">{sidebar}</div>
        </div>
      )}
    </>
  );
}
