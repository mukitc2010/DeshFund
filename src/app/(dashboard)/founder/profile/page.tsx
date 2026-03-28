"use client";

import { useEffect, useState, useCallback } from "react";
import {
  User,
  Shield,
  CheckCircle2,
  XCircle,
  Save,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/shared/LoadingState";
import type { ApiResponse } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FullProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  phone: string | null;
  nidNumber: string | null;
  location: string | null;
  website: string | null;
  linkedin: string | null;
  companyName: string | null;
  companyRole: string | null;
}

interface TrustScore {
  id: string;
  score: number;
  kycComplete: boolean;
  revenueVerified: boolean;
  businessReg: boolean;
  teamListed: boolean;
  financialData: boolean;
  updatesPosted: boolean;
  docsUploaded: boolean;
  badges: string[];
}

interface Verification {
  type: string;
  status: string;
}

interface MeUser {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
  profile: FullProfile | null;
  trustScore: TrustScore | null;
  verifications: Verification[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  readOnly = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  hint?: string;
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-secondary-700 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`block w-full rounded-lg border border-secondary-300 bg-white px-3.5 py-2 text-sm text-secondary-900 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-primary-500 focus:ring-primary-500/25 ${
          readOnly
            ? "bg-secondary-50 text-secondary-500 cursor-not-allowed"
            : ""
        }`}
      />
      {hint && <p className="mt-1 text-xs text-secondary-500">{hint}</p>}
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-secondary-700 mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="block w-full rounded-lg border border-secondary-300 bg-white px-3.5 py-2 text-sm text-secondary-900 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-primary-500 focus:ring-primary-500/25 resize-none"
      />
    </div>
  );
}

function TrustCheckItem({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {checked ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 text-secondary-300 shrink-0" />
      )}
      <span className={checked ? "text-secondary-800" : "text-secondary-500"}>
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FounderProfilePage() {
  const { user: authUser } = useAuth();
  const [meUser, setMeUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form fields
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyRole, setCompanyRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nidNumber, setNidNumber] = useState("");

  // ---------------------------------------------------------------------------
  // Fetch
  // ---------------------------------------------------------------------------

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const json: ApiResponse<{ user: MeUser }> = await res.json();
      if (json.success && json.data?.user) {
        const u = json.data.user;
        setMeUser(u);
        const p = u.profile;
        if (p) {
          setDisplayName(p.displayName || "");
          setBio(p.bio || "");
          setPhone(p.phone || "");
          setLocation(p.location || "");
          setWebsite(p.website || "");
          setLinkedin(p.linkedin || "");
          setCompanyName(p.companyName || "");
          setCompanyRole(p.companyRole || "");
          setAvatarUrl(p.avatarUrl || "");
          setNidNumber(p.nidNumber || "");
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ---------------------------------------------------------------------------
  // Save
  // ---------------------------------------------------------------------------

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!meUser) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/users/${meUser.id}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          displayName,
          bio: bio || null,
          phone: phone || null,
          location: location || null,
          website: website || null,
          linkedin: linkedin || null,
          companyName: companyName || null,
          companyRole: companyRole || null,
          avatarUrl: avatarUrl || null,
          nidNumber: nidNumber || null,
        }),
      });

      const json: ApiResponse<unknown> = await res.json();
      if (json.success) {
        setSuccessMsg("Profile updated successfully!");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(json.error?.message || "Failed to save changes.");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (loading) {
    return <LoadingState text="Loading your profile..." />;
  }

  const nidVerified =
    meUser?.verifications?.some(
      (v) => v.type === "NID" && v.status === "VERIFIED"
    ) ?? false;

  const trustScore = meUser?.trustScore;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-secondary-500">
          Manage your founder profile and verification status.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Avatar & Name */}
            <Card>
              <h2 className="text-base font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary-600" />
                Basic Information
              </h2>
              <div className="space-y-4">
                {/* Avatar preview */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-secondary-200 flex items-center justify-center overflow-hidden shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-secondary-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <InputField
                      label="Avatar URL"
                      value={avatarUrl}
                      onChange={setAvatarUrl}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Display Name"
                    value={displayName}
                    onChange={setDisplayName}
                    placeholder="Your name"
                  />
                  <InputField
                    label="Phone"
                    value={phone}
                    onChange={setPhone}
                    type="tel"
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <TextareaField
                  label="Bio"
                  value={bio}
                  onChange={setBio}
                  placeholder="Tell supporters about yourself..."
                  rows={3}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Location"
                    value={location}
                    onChange={setLocation}
                    placeholder="Dhaka, Bangladesh"
                  />
                  <InputField
                    label="Website"
                    value={website}
                    onChange={setWebsite}
                    type="url"
                    placeholder="https://yoursite.com"
                  />
                </div>

                <InputField
                  label="LinkedIn"
                  value={linkedin}
                  onChange={setLinkedin}
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </Card>

            {/* Company Info */}
            <Card>
              <h2 className="text-base font-semibold text-secondary-900 mb-4">
                Company Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Company Name"
                  value={companyName}
                  onChange={setCompanyName}
                  placeholder="Your company name"
                />
                <InputField
                  label="Your Role"
                  value={companyRole}
                  onChange={setCompanyRole}
                  placeholder="CEO, Founder, etc."
                />
              </div>
            </Card>

            {/* NID */}
            <Card>
              <h2 className="text-base font-semibold text-secondary-900 mb-4">
                Identity Verification
              </h2>
              <InputField
                label="NID Number"
                value={nidNumber}
                onChange={setNidNumber}
                readOnly={nidVerified}
                placeholder="Enter your National ID number"
                hint={
                  nidVerified
                    ? "Your NID has been verified and cannot be changed."
                    : "Your NID will be verified by our team."
                }
              />
              {nidVerified && (
                <div className="mt-2">
                  <Badge variant="success" dot>
                    NID Verified
                  </Badge>
                </div>
              )}
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                loading={saving}
                icon={<Save className="h-4 w-4" />}
              >
                Save Changes
              </Button>
              {successMsg && (
                <p className="text-sm text-emerald-600">{successMsg}</p>
              )}
              {errorMsg && (
                <p className="text-sm text-danger-600">{errorMsg}</p>
              )}
            </div>
          </div>

          {/* Sidebar - Trust Score */}
          <div>
            <Card>
              <h2 className="text-base font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary-600" />
                Trust Score
              </h2>

              {trustScore ? (
                <>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative h-24 w-24">
                      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeDasharray={`${trustScore.score}, 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-secondary-900">
                          {trustScore.score}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <TrustCheckItem
                      label="KYC Complete"
                      checked={trustScore.kycComplete}
                    />
                    <TrustCheckItem
                      label="Revenue Verified"
                      checked={trustScore.revenueVerified}
                    />
                    <TrustCheckItem
                      label="Business Registered"
                      checked={trustScore.businessReg}
                    />
                    <TrustCheckItem
                      label="Team Listed"
                      checked={trustScore.teamListed}
                    />
                    <TrustCheckItem
                      label="Financial Data"
                      checked={trustScore.financialData}
                    />
                    <TrustCheckItem
                      label="Updates Posted"
                      checked={trustScore.updatesPosted}
                    />
                    <TrustCheckItem
                      label="Documents Uploaded"
                      checked={trustScore.docsUploaded}
                    />
                  </div>

                  {trustScore.badges.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-secondary-100">
                      <p className="text-xs font-medium text-secondary-500 mb-2">
                        Badges
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {trustScore.badges.map((badge) => (
                          <Badge key={badge} variant="info" size="sm">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <Shield className="h-10 w-10 text-secondary-300 mx-auto mb-2" />
                  <p className="text-sm text-secondary-500">
                    Complete your profile and verification to build your trust
                    score.
                  </p>
                </div>
              )}
            </Card>

            {/* Account Info */}
            <Card className="mt-6">
              <h2 className="text-sm font-semibold text-secondary-900 mb-3">
                Account
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-500">Email</span>
                  <span className="text-secondary-700">
                    {meUser?.email ?? authUser?.email ?? "--"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-500">Email Verified</span>
                  {meUser?.emailVerified || authUser?.emailVerified ? (
                    <Badge variant="success" size="sm">
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      No
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-500">Role</span>
                  <span className="text-secondary-700">Founder</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
