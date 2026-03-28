import {
  ShieldCheck,
  BadgeCheck,
  Building2,
  UserCheck,
  Rocket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeConfig {
  label: string;
  icon: LucideIcon;
  bg: string;
  text: string;
  iconColor: string;
}

const BADGE_MAP: Record<string, BadgeConfig> = {
  IDENTITY_VERIFIED: {
    label: "Identity Verified",
    icon: ShieldCheck,
    bg: "bg-blue-50",
    text: "text-blue-700",
    iconColor: "text-blue-500",
  },
  REVENUE_VERIFIED: {
    label: "Revenue Verified",
    icon: BadgeCheck,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    iconColor: "text-emerald-500",
  },
  BUSINESS_REGISTERED: {
    label: "Business Registered",
    icon: Building2,
    bg: "bg-purple-50",
    text: "text-purple-700",
    iconColor: "text-purple-500",
  },
  VERIFIED_FOUNDER: {
    label: "Verified Founder",
    icon: UserCheck,
    bg: "bg-amber-50",
    text: "text-amber-700",
    iconColor: "text-amber-500",
  },
  INVESTOR_READY: {
    label: "Investor Ready",
    icon: Rocket,
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    iconColor: "text-indigo-500",
  },
};

interface TrustBadgeProps {
  badge: string;
  className?: string;
}

function TrustBadge({ badge, className }: TrustBadgeProps) {
  const config = BADGE_MAP[badge];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", config.iconColor)} />
      {config.label}
    </span>
  );
}

export { TrustBadge };
