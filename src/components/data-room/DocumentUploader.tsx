"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DOCUMENT_TYPES, getFileTypeLabel } from "@/lib/upload";
import { Upload } from "lucide-react";

interface DocumentUploaderProps {
  campaignId: string;
  onUploaded: () => void;
}

const typeOptions = DOCUMENT_TYPES.map((t) => ({
  label: getFileTypeLabel(t),
  value: t,
}));

const visibilityOptions = [
  { label: "Public", value: "PUBLIC" },
  { label: "Private", value: "PRIVATE" },
  { label: "Investors Only", value: "INVESTORS_ONLY" },
];

function DocumentUploader({ campaignId, onUploaded }: DocumentUploaderProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<typeof DOCUMENT_TYPES[number]>(DOCUMENT_TYPES[0]);
  const [fileUrl, setFileUrl] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !fileUrl.trim()) {
      setError("Name and file URL are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type,
          fileUrl: fileUrl.trim(),
          fileSize: fileSize ? fileSize : undefined,
          visibility,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error?.message || "Failed to add document");
        return;
      }

      setName("");
      setFileUrl("");
      setFileSize("");
      setType(DOCUMENT_TYPES[0]);
      setVisibility("PUBLIC");
      onUploaded();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">
        Add Document
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Document Name"
            placeholder="e.g. Q4 2025 Financials"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Select
            label="Document Type"
            options={typeOptions}
            value={type}
            onChange={(e) => setType(e.target.value as typeof DOCUMENT_TYPES[number])}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="File URL"
            placeholder="https://example.com/file.pdf"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            required
          />
          <Input
            label="File Size (bytes)"
            placeholder="Optional"
            type="number"
            value={fileSize}
            onChange={(e) => setFileSize(e.target.value)}
          />
        </div>
        <Select
          label="Visibility"
          options={visibilityOptions}
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        />
        {error && (
          <p className="text-sm text-danger-600">{error}</p>
        )}
        <Button
          type="submit"
          loading={loading}
          icon={<Upload className="h-4 w-4" />}
        >
          Add Document
        </Button>
      </form>
    </Card>
  );
}

export { DocumentUploader };
