"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, User } from "lucide-react";
import { useAuth, getDashboardPath } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import { Sidebar } from "@/components/layout/Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          <p className="text-sm text-secondary-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <p className="text-secondary-600 mb-4">You need to be logged in.</p>
          <button
            onClick={() => router.push("/login")}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  const userMenuItems = [
    {
      label: "Profile",
      onClick: () => router.push(`${getDashboardPath(user.role)}/profile`),
      icon: <User className="h-4 w-4" />,
    },
    {
      label: "Log out",
      onClick: () => logout(),
      icon: <LogOut className="h-4 w-4" />,
      danger: true,
    },
  ];

  return (
    <div className="flex h-screen bg-secondary-50">
      <Sidebar
        role={user.role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-secondary-200/60 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-secondary-500 hover:bg-secondary-50 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-sm text-secondary-400">
              {user.role.charAt(0) + user.role.slice(1).toLowerCase()} Dashboard
            </div>
          </div>

          <Dropdown
            align="right"
            trigger={
              <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-secondary-50 transition-colors">
                <Avatar
                  src={user.profile.avatarUrl}
                  fallback={user.profile.displayName}
                  size="sm"
                />
                <span className="hidden sm:block text-sm font-medium text-secondary-700">
                  {user.profile.displayName}
                </span>
              </button>
            }
            items={userMenuItems}
          />
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
