"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/shared/LoadingState";
import { Save, CheckCircle } from "lucide-react";

interface ProfileForm {
  displayName: string;
  bio: string;
  phone: string;
  location: string;
  avatarUrl: string;
}

export default function SupporterProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState<ProfileForm>({
    displayName: "",
    bio: "",
    phone: "",
    location: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      try {
        const res = await fetch(`/api/users/${user!.id}/profile`, { credentials: "include" });
        const json = await res.json();
        if (json.success && json.data?.user?.profile) {
          const p = json.data.user.profile;
          setForm({
            displayName: p.displayName || "",
            bio: p.bio || "",
            phone: p.phone || "",
            location: p.location || "",
            avatarUrl: p.avatarUrl || "",
          });
        } else {
          // Use auth context data as fallback
          setForm((prev) => ({
            ...prev,
            displayName: user!.profile.displayName || "",
          }));
        }
      } catch {
        // Use auth context data as fallback
        setForm((prev) => ({
          ...prev,
          displayName: user!.profile.displayName || "",
        }));
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setToast(null);
    try {
      const res = await fetch(`/api/users/${user.id}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          displayName: form.displayName,
          bio: form.bio || null,
          phone: form.phone || null,
          location: form.location || null,
          avatarUrl: form.avatarUrl || null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setToast("Profile updated successfully!");
        setTimeout(() => setToast(null), 4000);
      } else {
        setToast(json.error?.message || "Failed to update profile.");
      }
    } catch {
      setToast("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState text="Loading profile..." />;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">My Profile</h1>
        <p className="text-secondary-500 mt-1">Update your personal information.</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {toast}
        </div>
      )}

      <Card padding="lg">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-secondary-700 mb-1.5">
              Display Name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              value={form.displayName}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3.5 py-2.5 text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Your name"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-secondary-700 mb-1.5">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={form.bio}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3.5 py-2.5 text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              placeholder="A brief description about yourself"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1.5">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3.5 py-2.5 text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="+880 1XXX-XXXXXX"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-secondary-700 mb-1.5">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3.5 py-2.5 text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Dhaka, Bangladesh"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-secondary-700 mb-1.5">
              Avatar URL
            </label>
            <input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              value={form.avatarUrl}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 px-3.5 py-2.5 text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              loading={saving}
              icon={<Save className="h-4 w-4" />}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
