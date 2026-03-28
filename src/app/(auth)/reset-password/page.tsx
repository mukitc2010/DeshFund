"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod/v4";
import { Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { ApiResponse } from "@/types";

const emailSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  return <Suspense fallback={null}><ResetPasswordContent /></Suspense>;
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return token ? <ResetForm token={token} /> : <RequestForm />;
}

function RequestForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldError, setFieldError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldError("");

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setFieldError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json: ApiResponse = await res.json();
      if (json.success) {
        setSuccess(true);
      } else {
        setError(json.error?.message || "Something went wrong.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card padding="lg" className="animate-fade-in text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent-50 text-accent-600 mx-auto mb-4">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-secondary-900 mb-2">Check your email</h2>
        <p className="text-sm text-secondary-500 mb-6">
          If an account exists for <strong className="text-secondary-700">{email}</strong>,
          we&apos;ve sent password reset instructions.
        </p>
        <Link href="/login">
          <Button variant="outline" fullWidth>Back to login</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="animate-fade-in">
      <h2 className="text-xl font-semibold text-secondary-900 text-center mb-1">Reset password</h2>
      <p className="text-sm text-secondary-500 text-center mb-6">
        Enter your email and we&apos;ll send you a reset link
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldError}
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
          Send reset link
        </Button>
      </form>

      <p className="text-sm text-secondary-500 text-center mt-6">
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Back to login
        </Link>
      </p>
    </Card>
  );
}

function ResetForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"password" | "confirmPassword", string>>>({});
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const result = resetSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const errs: typeof fieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof typeof errs;
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json: ApiResponse = await res.json();
      if (json.success) {
        setSuccess(true);
      } else {
        setError(json.error?.message || "Reset failed. The link may have expired.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card padding="lg" className="animate-fade-in text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent-50 text-accent-600 mx-auto mb-4">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-secondary-900 mb-2">Password reset</h2>
        <p className="text-sm text-secondary-500 mb-6">Your password has been updated successfully.</p>
        <Link href="/login">
          <Button fullWidth>Sign in with new password</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="animate-fade-in">
      <h2 className="text-xl font-semibold text-secondary-900 text-center mb-1">Set new password</h2>
      <p className="text-sm text-secondary-500 text-center mb-6">Enter your new password below</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New password"
          type="password"
          placeholder="At least 8 characters"
          icon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          icon={<Lock className="h-4 w-4" />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
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
          Reset password
        </Button>
      </form>

      <p className="text-sm text-secondary-500 text-center mt-6">
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Back to login
        </Link>
      </p>
    </Card>
  );
}
