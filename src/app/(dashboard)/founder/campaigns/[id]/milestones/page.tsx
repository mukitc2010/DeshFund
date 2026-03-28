"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Modal } from "@/components/ui/Modal";
import { formatBDT } from "@/lib/utils";
import {
  Plus,
  Calendar,
  Trash2,
  Pencil,
  Target,
  CheckCircle2,
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  budgetAllocation: string | null;
  targetDate: string | null;
  completionPct: number;
  status: string;
  sortOrder: number;
  createdAt: string;
}

const statusOptions = [
  { label: "Planned", value: "PLANNED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Overdue", value: "OVERDUE" },
];

const statusVariant: Record<string, "default" | "info" | "success" | "danger"> = {
  PLANNED: "default",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  OVERDUE: "danger",
};

export default function MilestonesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [goalAmount, setGoalAmount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editStatus, setEditStatus] = useState("");
  const [editCompletion, setEditCompletion] = useState("");

  const fetchMilestones = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${id}/milestones`);
      const data = await res.json();
      if (data.success) {
        setMilestones(data.data.milestones);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchCampaign = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${id}`);
      const data = await res.json();
      if (data.success) {
        setGoalAmount(Number(data.data.campaign.goalAmount));
      }
    } catch {
      // silently fail
    }
  }, [id]);

  useEffect(() => {
    fetchMilestones();
    fetchCampaign();
  }, [fetchMilestones, fetchCampaign]);

  const totalAllocated = milestones.reduce(
    (sum, m) => sum + Number(m.budgetAllocation || 0),
    0
  );

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/campaigns/${id}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          budgetAllocation: budget ? budget : undefined,
          targetDate: targetDate || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setFormError(data.error?.message || "Failed to create milestone");
        return;
      }

      setTitle("");
      setDescription("");
      setBudget("");
      setTargetDate("");
      setShowAddModal(false);
      fetchMilestones();
    } catch {
      setFormError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(milestoneId: string) {
    try {
      const res = await fetch(`/api/campaigns/${id}/milestones`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestoneId,
          status: editStatus || undefined,
          completionPct: editCompletion || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        fetchMilestones();
      }
    } catch {
      // silently fail
    }
  }

  async function handleDelete(milestoneId: string) {
    if (!confirm("Delete this milestone?")) return;
    try {
      const res = await fetch(
        `/api/campaigns/${id}/milestones?milestoneId=${milestoneId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        fetchMilestones();
      }
    } catch {
      // silently fail
    }
  }

  function startEdit(m: Milestone) {
    setEditingId(m.id);
    setEditStatus(m.status);
    setEditCompletion(String(m.completionPct));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Milestones</h1>
          <p className="text-secondary-500 mt-1">
            Track project milestones and budget allocation.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Milestone
        </Button>
      </div>

      {/* Budget Summary */}
      {goalAmount > 0 && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">
              Budget Allocated
            </span>
            <span className="text-sm font-semibold text-secondary-900">
              {formatBDT(totalAllocated)} / {formatBDT(goalAmount)}
            </span>
          </div>
          <ProgressBar
            value={goalAmount > 0 ? (totalAllocated / goalAmount) * 100 : 0}
            gradient
          />
          <p className="text-xs text-secondary-400 mt-2">
            {formatBDT(goalAmount - totalAllocated)} remaining to allocate
          </p>
        </Card>
      )}

      {/* Milestones List */}
      {milestones.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500 font-medium">
              No milestones created yet
            </p>
            <p className="text-sm text-secondary-400 mt-1">
              Add milestones to show your project roadmap.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {milestones.map((m) => (
            <Card key={m.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {m.status === "COMPLETED" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Target className="h-5 w-5 text-secondary-400 shrink-0" />
                    )}
                    <h3 className="text-base font-semibold text-secondary-900 truncate">
                      {m.title}
                    </h3>
                    <Badge variant={statusVariant[m.status] || "default"} size="sm">
                      {m.status.replace("_", " ")}
                    </Badge>
                  </div>

                  {m.description && (
                    <p className="text-sm text-secondary-500 ml-7 mb-3">
                      {m.description}
                    </p>
                  )}

                  <div className="ml-7 space-y-2">
                    <ProgressBar
                      value={m.completionPct}
                      size="sm"
                      showLabel
                      gradient
                    />
                    <div className="flex items-center gap-4 text-xs text-secondary-400">
                      {m.budgetAllocation && (
                        <span>Budget: {formatBDT(Number(m.budgetAllocation))}</span>
                      )}
                      {m.targetDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(m.targetDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(m)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(m.id)}
                  >
                    <Trash2 className="h-4 w-4 text-danger-500" />
                  </Button>
                </div>
              </div>

              {/* Inline Edit */}
              {editingId === m.id && (
                <div className="mt-4 pt-4 border-t border-secondary-200 ml-7">
                  <div className="flex items-end gap-3">
                    <Select
                      label="Status"
                      options={statusOptions}
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    />
                    <Input
                      label="Completion %"
                      type="number"
                      min="0"
                      max="100"
                      value={editCompletion}
                      onChange={(e) => setEditCompletion(e.target.value)}
                    />
                    <Button size="sm" onClick={() => handleUpdate(m.id)}>
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add Milestone Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Milestone"
        size="lg"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g. MVP Launch"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="Describe what this milestone entails..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Budget (BDT)"
              type="number"
              placeholder="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <Input
              label="Target Date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
          {formError && (
            <p className="text-sm text-danger-600">{formError}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Create Milestone
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
