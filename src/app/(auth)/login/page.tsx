"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod/v4";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPath } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FieldErrors = Partial<Record<"email" | "password", string>>;

export default function LoginPage() {
  return <Suspense fallback={null}><LoginContent /></Suspense>;
}

function LoginContent() {
  const { login, loading, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errs: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    try {
      const user = await login(email, password);
      const redirect = searchParams.get("redirect");
      router.push(redirect || getDashboardPath(user.role));
    } catch {
      // error is set in AuthContext
    }
  }

  return (
    <Card padding="lg" className="animate-fade-in">
      <h2 className="text-xl font-semibold text-secondary-900 text-center mb-1">Welcome back</h2>
      <p className="text-sm text-secondary-500 text-center mb-6">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />

        {error && (
          <div className="rounded-lg bg-danger-50 border border-danger-500/20 px-3 py-2 text-sm text-danger-600">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end">
          <Link
            href="/reset-password"
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          icon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}
        >
          Sign in
        </Button>
      </form>

      <p className="text-sm text-secondary-500 text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign up
        </Link>
      </p>
    </Card>
  );
}
