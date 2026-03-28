"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("border-b border-secondary-200", className)}>
      <nav className="-mb-px flex gap-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={cn(
                "relative pb-3 text-sm font-medium transition-colors duration-150 whitespace-nowrap",
                "focus-visible:outline-none",
                isActive
                  ? "text-primary-600"
                  : "text-secondary-500 hover:text-secondary-700"
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export { Tabs };
export type { TabsProps, Tab };
