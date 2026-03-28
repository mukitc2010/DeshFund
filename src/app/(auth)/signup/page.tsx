"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod/v4";
import { Mail, Lock, User, Rocket, Heart, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPath } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["FOUNDER", "SUPPORTER"] as const, {
    error: "Please select a role",
  }),
});

type FieldErrors = Partial<Record<"name" | "email" | "password" | "role", string>>;

const roles: { value: "FOUNDER" | "SUPPORTER"; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "FOUNDER",
    label: "Founder",
    description: "I want to raise funds",
    icon: <Rocket className="h-5 w-5" />,
  },
  {
    value: "SUPPORTER",
    label: "Supporter",
    description: "I want to support projects",
    icon: <Heart className="h-5 w-5" />,
  },
];

export default function SignupPage() {
  const { signup, loading, error, clearError } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    const result = signupSchema.safeParse({ name, email, password, role: role || undefined });
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
      await signup(email, password, name, role as UserRole);
      setSuccess(true);
    } catch {
      // error is set in AuthContext
    }
  }

  if (success) {
    return (
      <Card padding="lg" className="animate-fade-in text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent-50 text-accent-600 mb-4">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-secondary-900 mb-2">Check your email</h2>
        <p className="text-sm text-secondary-500 mb-6">
          We&apos;ve sent a verification link to <strong className="text-secondary-700">{email}</strong>.
          Please verify your email to get started.
        </p>
        <Button variant="outline" fullWidth onClick={() => router.push(getDashboardPath(role as UserRole))}>
          Continue to dashboard
        </Button>
        <p className="text-xs text-secondary-400 mt-4">
          Didn&apos;t receive the email? Check your spam folder.
        </p>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="animate-fade-in">
      <h2 className="text-xl font-semibold text-secondary-900 text-center mb-1">Create your account</h2>
      <p className="text-sm text-secondary-500 text-center mb-6">Get started with FundBD</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role selector */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1.5">I am a...</label>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => { setRole(r.value); setFieldErrors((p) => ({ ...p, role: undefined })); }}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 transition-all duration-150 text-center cursor-pointer",
                  role === r.value
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-secondary-200 bg-white text-secondary-600 hover:border-secondary-300 hover:bg-secondary-50"
                )}
              >
                {r.icon}
                <span className="text-sm font-medium">{r.label}</span>
                <span className="text-xs opacity-75">{r.description}</span>
              </button>
            ))}
          </div>
          {fieldErrors.role && <p className="mt-1.5 text-xs text-danger-600">{fieldErrors.role}</p>}
        </div>

        <Input
          label="Full name"
          placeholder="Your name"
          icon={<User className="h-4 w-4" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
        />
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
          placeholder="At least 8 characters"
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

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          icon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}
        >
          Create account
        </Button>
      </form>

      <p className="text-sm text-secondary-500 text-center mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
