"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { UserRole, ApiResponse } from "@/types";

interface UserProfile {
  displayName: string;
  avatarUrl: string | null;
}

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  profile: UserProfile;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "FOUNDER":
      return "/founder";
    case "SUPPORTER":
      return "/supporter";
    case "ADMIN":
      return "/admin";
    default:
      return "/";
  }
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = useCallback(() => setError(null), []);

  // Check session on mount
  useEffect(() => {
    let cancelled = false;
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const json: ApiResponse<{ user: AuthUser }> = await res.json();
        if (!cancelled && json.success && json.data) {
          setUser(json.data.user);
        }
      } catch {
        // Not authenticated — that's fine
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthUser> => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        const json: ApiResponse<{ user: AuthUser }> = await res.json();
        if (!json.success || !json.data) {
          throw new Error(json.error?.message || "Login failed");
        }
        setUser(json.data.user);
        return json.data.user;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signup = useCallback(
    async (email: string, password: string, name: string, role: UserRole): Promise<void> => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password, name, role }),
        });
        const json: ApiResponse<{ user: AuthUser }> = await res.json();
        if (!json.success || !json.data) {
          throw new Error(json.error?.message || "Signup failed");
        }
        setUser(json.data.user);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Signup failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // ignore
    }
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export { AuthProvider, useAuth, getDashboardPath };
export type { AuthUser, AuthContextValue };
