"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CATEGORIES } from "@/lib/validators/campaign";
import { cn, formatBDT, formatDate } from "@/lib/utils";
import type { ApiResponse } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Milestone {
  id: string;
  title: string;
  description: string;
  budgetAllocation: number;
  targetDate: string;
}

interface CampaignFormData {
  title: string;
  tagline: string;
  category: string;
  coverImageUrl: string;
  description: string;
  videoUrl: string;
  goalAmount: number | "";
  startDate: string;
  endDate: string;
  milestones: Milestone[];
}

interface StepErrors {
  [key: string]: string;
}

interface CampaignWizardProps {
  campaignId?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEPS = [
  { number: 1, title: "Basics" },
  { number: 2, title: "Story" },
  { number: 3, title: "Funding" },
  { number: 4, title: "Milestones" },
  { number: 5, title: "Review" },
] as const;

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ label: c, value: c }));

const EMPTY_FORM: CampaignFormData = {
  title: "",
  tagline: "",
  category: "",
  coverImageUrl: "",
  description: "",
  videoUrl: "",
  goalAmount: "",
  startDate: "",
  endDate: "",
  milestones: [],
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------

function StepIndicator({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <nav aria-label="Campaign creation steps" className="mb-10">
      <ol className="flex items-center w-full">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isLast = idx === STEPS.length - 1;

          return (
            <li
              key={step.number}
              className={cn("flex items-center", !isLast && "flex-1")}
            >
              <button
                type="button"
                onClick={() => onStepClick(step.number)}
                className="flex flex-col items-center gap-1.5 group focus:outline-none"
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full border-2 text-sm font-semibold transition-all duration-200",
                    isCompleted &&
                      "bg-primary-600 border-primary-600 text-white",
                    isActive &&
                      "border-primary-600 text-primary-600 bg-primary-50 ring-4 ring-primary-100",
                    !isCompleted &&
                      !isActive &&
                      "border-secondary-300 text-secondary-400 bg-white group-hover:border-secondary-400"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block transition-colors",
                    isActive && "text-primary-700",
                    isCompleted && "text-primary-600",
                    !isActive && !isCompleted && "text-secondary-400"
                  )}
                >
                  {step.title}
                </span>
              </button>

              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 sm:mx-4 rounded-full transition-colors duration-300",
                    isCompleted ? "bg-primary-500" : "bg-secondary-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CampaignWizard({ campaignId }: CampaignWizardProps) {
  const router = useRouter();
  const isEditMode = Boolean(campaignId);

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<CampaignFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<StepErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingCampaign, setLoadingCampaign] = useState(isEditMode);

  // Fetch existing campaign for edit mode
  useEffect(() => {
    if (!campaignId) return;
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}`, {
          credentials: "include",
        });
        const json: ApiResponse<{ campaign: Record<string, unknown> }> =
          await res.json();
        if (!cancelled && json.success && json.data) {
          const c = json.data.campaign;
          setForm({
            title: (c.title as string) || "",
            tagline: (c.tagline as string) || "",
            category: (c.category as string) || "",
            coverImageUrl: (c.coverImageUrl as string) || "",
            description: (c.description as string) || "",
            videoUrl: (c.videoUrl as string) || "",
            goalAmount: (c.goalAmount as number) || "",
            startDate: c.startDate
              ? (c.startDate as string).slice(0, 10)
              : "",
            endDate: c.endDate ? (c.endDate as string).slice(0, 10) : "",
            milestones: Array.isArray(c.milestones)
              ? (c.milestones as Milestone[])
              : [],
          });
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoadingCampaign(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  // ---------------------------------------------------------------------------
  // Form helpers
  // ---------------------------------------------------------------------------

  const updateField = useCallback(
    <K extends keyof CampaignFormData>(key: K, value: CampaignFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Validation per step
  // ---------------------------------------------------------------------------

  function validateStep(step: number): boolean {
    const errs: StepErrors = {};

    if (step === 1) {
      if (!form.title.trim() || form.title.trim().length < 3)
        errs.title = "Title must be at least 3 characters";
      if (!form.tagline.trim() || form.tagline.trim().length < 10)
        errs.tagline = "Tagline must be at least 10 characters";
      if (!form.category) errs.category = "Please select a category";
    }

    if (step === 2) {
      if (!form.description.trim() || form.description.trim().length < 50)
        errs.description = "Description must be at least 50 characters";
      if (
        form.videoUrl &&
        !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+/.test(
          form.videoUrl
        )
      )
        errs.videoUrl = "Must be a valid YouTube or Vimeo URL";
    }

    if (step === 3) {
      const goal =
        typeof form.goalAmount === "number" ? form.goalAmount : 0;
      if (!goal || goal < 10000)
        errs.goalAmount = "Goal must be at least ৳10,000";
      if (!form.startDate) errs.startDate = "Start date is required";
      if (!form.endDate) errs.endDate = "End date is required";
      if (form.startDate && form.endDate && form.endDate <= form.startDate)
        errs.endDate = "End date must be after start date";
    }

    // Step 4 (milestones) and Step 5 (review) have no blocking validation
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  function goNext() {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, 5));
    }
  }

  function goPrev() {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  function goToStep(step: number) {
    // Allow going back freely; going forward requires validation
    if (step < currentStep) {
      setCurrentStep(step);
    } else {
      // Validate all steps up to the target
      for (let s = currentStep; s < step; s++) {
        if (!validateStep(s)) return;
      }
      setCurrentStep(step);
    }
  }

  // ---------------------------------------------------------------------------
  // Milestones
  // ---------------------------------------------------------------------------

  function addMilestone() {
    const m: Milestone = {
      id: uid(),
      title: "",
      description: "",
      budgetAllocation: 0,
      targetDate: "",
    };
    updateField("milestones", [...form.milestones, m]);
  }

  function updateMilestone(id: string, field: keyof Milestone, value: string | number) {
    updateField(
      "milestones",
      form.milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  }

  function removeMilestone(id: string) {
    updateField(
      "milestones",
      form.milestones.filter((m) => m.id !== id)
    );
  }

  const totalMilestoneBudget = form.milestones.reduce(
    (sum, m) => sum + (Number(m.budgetAllocation) || 0),
    0
  );

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  function buildPayload() {
    return {
      title: form.title.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      category: form.category,
      goalAmount: Number(form.goalAmount),
      startDate: form.startDate
        ? new Date(form.startDate).toISOString()
        : undefined,
      endDate: form.endDate
        ? new Date(form.endDate).toISOString()
        : undefined,
      coverImageUrl: form.coverImageUrl || undefined,
      videoUrl: form.videoUrl || undefined,
      milestones: form.milestones.length > 0 ? form.milestones : undefined,
    };
  }

  async function handleSaveDraft() {
    setSubmitting(true);
    try {
      const payload = buildPayload();
      const url = isEditMode
        ? `/api/campaigns/${campaignId}`
        : "/api/campaigns";
      const method = isEditMode ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...payload, status: "DRAFT" }),
      });
      const json: ApiResponse<unknown> = await res.json();
      if (json.success) {
        router.push("/founder/campaigns");
      } else {
        setErrors({ submit: json.error?.message || "Failed to save draft" });
      }
    } catch {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmitForReview() {
    // Validate all steps
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = buildPayload();
      let id = campaignId;

      if (isEditMode) {
        const res = await fetch(`/api/campaigns/${campaignId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const json: ApiResponse<unknown> = await res.json();
        if (!json.success) {
          setErrors({
            submit: json.error?.message || "Failed to update campaign",
          });
          return;
        }
      } else {
        const res = await fetch("/api/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const json: ApiResponse<{ campaign: { id: string } }> =
          await res.json();
        if (!json.success || !json.data) {
          setErrors({
            submit: json.error?.message || "Failed to create campaign",
          });
          return;
        }
        id = json.data.campaign.id;
      }

      // Set status to PENDING_REVIEW
      const patchRes = await fetch(`/api/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "PENDING_REVIEW" }),
      });
      const patchJson: ApiResponse<unknown> = await patchRes.json();
      if (patchJson.success) {
        router.push("/founder/campaigns");
      } else {
        setErrors({
          submit: patchJson.error?.message || "Failed to submit for review",
        });
      }
    } catch {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Loading state for edit mode
  // ---------------------------------------------------------------------------

  if (loadingCampaign) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render steps
  // ---------------------------------------------------------------------------

  function renderStep1() {
    return (
      <div className="space-y-6">
        <Input
          label="Campaign Title"
          placeholder="Give your campaign a compelling title"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          error={errors.title}
          helperText="A clear, concise title that describes your project"
        />
        <Input
          label="Tagline"
          placeholder="A short description that captures your campaign essence"
          value={form.tagline}
          onChange={(e) => updateField("tagline", e.target.value)}
          error={errors.tagline}
          helperText="10-300 characters. This appears below the title on campaign cards."
        />
        <Select
          label="Category"
          options={CATEGORY_OPTIONS}
          placeholder="Select a category"
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
          error={errors.category}
        />
        <Input
          label="Cover Image URL"
          placeholder="https://example.com/image.jpg"
          value={form.coverImageUrl}
          onChange={(e) => updateField("coverImageUrl", e.target.value)}
          error={errors.coverImageUrl}
          helperText="Paste a link to your cover image. Upload support coming soon."
        />
      </div>
    );
  }

  function renderStep2() {
    const charCount = form.description.length;
    return (
      <div className="space-y-6">
        <div>
          <Textarea
            label="Campaign Description"
            placeholder="Tell the world about your project..."
            rows={8}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            error={errors.description}
            helperText="Tell potential supporters why they should back your project"
          />
          <p
            className={cn(
              "mt-1 text-xs text-right",
              charCount < 50 ? "text-secondary-400" : "text-secondary-500"
            )}
          >
            {charCount} / 50 min characters
          </p>
        </div>
        <Input
          label="Video URL (optional)"
          placeholder="https://youtube.com/watch?v=..."
          value={form.videoUrl}
          onChange={(e) => updateField("videoUrl", e.target.value)}
          error={errors.videoUrl}
          helperText="Add a YouTube or Vimeo video to make your campaign stand out"
        />
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="space-y-6">
        <div>
          <Input
            label="Funding Goal (BDT)"
            type="number"
            placeholder="100000"
            min={10000}
            value={form.goalAmount === "" ? "" : form.goalAmount}
            onChange={(e) =>
              updateField(
                "goalAmount",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            error={errors.goalAmount}
            helperText="Minimum ৳10,000"
          />
          {form.goalAmount !== "" && form.goalAmount >= 10000 && (
            <p className="mt-1 text-sm font-medium text-primary-600">
              {formatBDT(form.goalAmount)}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
            error={errors.startDate}
          />
          <Input
            label="End Date"
            type="date"
            value={form.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
            error={errors.endDate}
          />
        </div>
      </div>
    );
  }

  function renderStep4() {
    const goal = typeof form.goalAmount === "number" ? form.goalAmount : 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-secondary-800">
              Milestones
            </h3>
            <p className="text-xs text-secondary-500 mt-0.5">
              Optional but encouraged. Break your campaign into trackable goals.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={addMilestone}
          >
            Add Milestone
          </Button>
        </div>

        {form.milestones.length === 0 && (
          <Card padding="lg" className="text-center">
            <p className="text-secondary-400 text-sm">
              No milestones yet. Adding milestones increases supporter
              confidence.
            </p>
          </Card>
        )}

        <div className="space-y-4">
          {form.milestones.map((m, idx) => (
            <Card key={m.id} padding="md" className="relative">
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-semibold text-secondary-500 uppercase tracking-wide">
                  Milestone {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeMilestone(m.id)}
                  className="text-secondary-400 hover:text-danger-500 transition-colors p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <Input
                  label="Title"
                  placeholder="Milestone title"
                  value={m.title}
                  onChange={(e) =>
                    updateMilestone(m.id, "title", e.target.value)
                  }
                />
                <Input
                  label="Description"
                  placeholder="What will be achieved"
                  value={m.description}
                  onChange={(e) =>
                    updateMilestone(m.id, "description", e.target.value)
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Budget Allocation (BDT)"
                    type="number"
                    placeholder="25000"
                    value={m.budgetAllocation || ""}
                    onChange={(e) =>
                      updateMilestone(
                        m.id,
                        "budgetAllocation",
                        Number(e.target.value) || 0
                      )
                    }
                  />
                  <Input
                    label="Target Date"
                    type="date"
                    value={m.targetDate}
                    onChange={(e) =>
                      updateMilestone(m.id, "targetDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {form.milestones.length > 0 && goal > 0 && (
          <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-secondary-50 border border-secondary-200">
            <span className="text-sm text-secondary-600">
              Total allocated:{" "}
              <span className="font-semibold text-secondary-800">
                {formatBDT(totalMilestoneBudget)}
              </span>
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                totalMilestoneBudget > goal
                  ? "text-danger-600"
                  : totalMilestoneBudget === goal
                  ? "text-emerald-600"
                  : "text-secondary-500"
              )}
            >
              {totalMilestoneBudget > goal
                ? `Over by ${formatBDT(totalMilestoneBudget - goal)}`
                : totalMilestoneBudget === goal
                ? "Fully allocated"
                : `${formatBDT(goal - totalMilestoneBudget)} remaining`}{" "}
              of {formatBDT(goal)} goal
            </span>
          </div>
        )}
      </div>
    );
  }

  function renderStep5() {
    const goal = typeof form.goalAmount === "number" ? form.goalAmount : 0;

    return (
      <div className="space-y-8">
        {/* Basics */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-secondary-800 uppercase tracking-wide">
              Basics
            </h3>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Edit
            </button>
          </div>
          <Card padding="md">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-secondary-500">Title</dt>
                <dd className="font-medium text-secondary-800 text-right max-w-[60%]">
                  {form.title || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-500">Tagline</dt>
                <dd className="font-medium text-secondary-800 text-right max-w-[60%]">
                  {form.tagline || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-500">Category</dt>
                <dd>
                  {form.category ? (
                    <Badge variant="info">{form.category}</Badge>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              {form.coverImageUrl && (
                <div className="flex justify-between">
                  <dt className="text-secondary-500">Cover Image</dt>
                  <dd className="text-primary-600 text-right truncate max-w-[60%]">
                    {form.coverImageUrl}
                  </dd>
                </div>
              )}
            </dl>
          </Card>
        </section>

        {/* Story */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-secondary-800 uppercase tracking-wide">
              Story
            </h3>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Edit
            </button>
          </div>
          <Card padding="md">
            <p className="text-sm text-secondary-700 whitespace-pre-wrap">
              {form.description || "—"}
            </p>
            {form.videoUrl && (
              <p className="mt-3 text-xs text-secondary-500">
                Video: {form.videoUrl}
              </p>
            )}
          </Card>
        </section>

        {/* Funding */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-secondary-800 uppercase tracking-wide">
              Funding
            </h3>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Edit
            </button>
          </div>
          <Card padding="md">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-secondary-500">Goal Amount</dt>
                <dd className="font-semibold text-secondary-800">
                  {goal ? formatBDT(goal) : "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-500">Start Date</dt>
                <dd className="text-secondary-800">
                  {form.startDate ? formatDate(form.startDate) : "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-500">End Date</dt>
                <dd className="text-secondary-800">
                  {form.endDate ? formatDate(form.endDate) : "—"}
                </dd>
              </div>
            </dl>
          </Card>
        </section>

        {/* Milestones */}
        {form.milestones.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-secondary-800 uppercase tracking-wide">
                Milestones ({form.milestones.length})
              </h3>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Edit
              </button>
            </div>
            <div className="space-y-3">
              {form.milestones.map((m, idx) => (
                <Card key={m.id} padding="sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary-800">
                        {idx + 1}. {m.title || "Untitled milestone"}
                      </p>
                      {m.description && (
                        <p className="text-xs text-secondary-500 mt-0.5">
                          {m.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {m.budgetAllocation > 0 && (
                        <p className="text-sm font-medium text-secondary-800">
                          {formatBDT(m.budgetAllocation)}
                        </p>
                      )}
                      {m.targetDate && (
                        <p className="text-xs text-secondary-500">
                          {formatDate(m.targetDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {errors.submit && (
          <div className="p-3 rounded-lg bg-danger-50 border border-danger-200">
            <p className="text-sm text-danger-700">{errors.submit}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            loading={submitting}
            onClick={handleSaveDraft}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            loading={submitting}
            onClick={handleSubmitForReview}
          >
            Submit for Review
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  const stepContent = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator currentStep={currentStep} onStepClick={goToStep} />

      <Card padding="lg">
        <h2 className="text-lg font-semibold text-secondary-900 mb-1">
          {STEPS[currentStep - 1].title}
        </h2>
        <p className="text-sm text-secondary-500 mb-6">
          {currentStep === 1 && "Start with the essentials about your campaign."}
          {currentStep === 2 && "Share your story and vision with supporters."}
          {currentStep === 3 && "Set your funding goal and timeline."}
          {currentStep === 4 && "Break your project into achievable milestones."}
          {currentStep === 5 && "Review everything before submitting."}
        </p>

        {stepContent[currentStep - 1]()}

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-secondary-200">
            <Button
              type="button"
              variant="ghost"
              onClick={goPrev}
              disabled={currentStep === 1}
              icon={<ChevronLeft className="h-4 w-4" />}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={goNext}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {currentStep === 5 && (
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <Button
              type="button"
              variant="ghost"
              onClick={goPrev}
              icon={<ChevronLeft className="h-4 w-4" />}
            >
              Previous
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
