"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/shared/LoadingState";
import type { UserRole } from "@/types";
import { Search } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  profile?: { displayName: string };
  trustScore?: { score: number };
  _count: { campaigns: number; contributions: number };
}

const roleBadge: Record<UserRole, BadgeVariant> = {
  FOUNDER: "info",
  SUPPORTER: "success",
  ADMIN: "warning",
};

const roleTabs: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Founders", value: "FOUNDER" },
  { label: "Supporters", value: "SUPPORTER" },
  { label: "Admins", value: "ADMIN" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  async function fetchUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (roleFilter) params.set("role", roleFilter);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/users?${params}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setUsers(json.data.users);
        setTotal(json.meta?.total || 0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, [roleFilter, search, page]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">User Management</h1>
        <p className="text-secondary-500 mt-1">View and manage all platform users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {roleTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setRoleFilter(tab.value); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === tab.value
                  ? "bg-primary-600 text-white"
                  : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by email or name..."
              className="pl-9 pr-4 py-2 rounded-lg border border-secondary-300 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none w-64"
            />
          </div>
          <Button type="submit" size="md" variant="outline">Search</Button>
        </form>
      </div>

      {loading ? (
        <LoadingState text="Loading users..." />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Trust Score</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Campaigns</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Contributions</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {users.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-secondary-400">No users found</td></tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-secondary-900">{u.profile?.displayName || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600">{u.email}</td>
                    <td className="px-6 py-4"><Badge variant={roleBadge[u.role]} dot size="sm">{u.role}</Badge></td>
                    <td className="px-6 py-4 text-sm text-secondary-600">{u.trustScore?.score ?? "-"}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600">{u._count.campaigns}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600">{u._count.contributions}</td>
                    <td className="px-6 py-4 text-sm text-secondary-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {total > pageSize && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200">
              <p className="text-sm text-secondary-500">
                Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button size="sm" variant="outline" disabled={page * pageSize >= total} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
