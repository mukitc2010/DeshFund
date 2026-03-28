"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ApiResponse } from "@/types";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  return <Suspense fallback={null}><VerifyEmailContent /></Suspense>;
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    let cancelled = false;
    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const json: ApiResponse = await res.json();
        if (cancelled) return;
        if (json.success) {
          setStatus("success");
          setMessage("Your email has been verified successfully.");
        } else {
          setStatus("error");
          setMessage(json.error?.message || "Verification failed. The link may have expired.");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Something went wrong. Please try again.");
        }
      }
    }
    verify();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <Card padding="lg" className="animate-fade-in text-center">
      {status === "loading" && (
        <>
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Verifying your email</h2>
          <p className="text-sm text-secondary-500">Please wait...</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent-50 text-accent-600 mx-auto mb-4">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Email verified</h2>
          <p className="text-sm text-secondary-500 mb-6">{message}</p>
          <Link href="/login">
            <Button fullWidth>Sign in to your account</Button>
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-danger-50 text-danger-600 mx-auto mb-4">
            <XCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Verification failed</h2>
          <p className="text-sm text-secondary-500 mb-6">{message}</p>
          <Link href="/login">
            <Button variant="outline" fullWidth>Back to login</Button>
          </Link>
        </>
      )}
    </Card>
  );
}
