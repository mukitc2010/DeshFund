"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getFileTypeLabel } from "@/lib/upload";
import {
  FileText,
  BarChart3,
  Scale,
  Receipt,
  Map,
  PieChart,
  Search,
  Cpu,
  File,
  Download,
  Trash2,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  fileSize: number | null;
  visibility: string;
  createdAt: string;
}

interface DocumentListProps {
  documents: Document[];
  isOwner: boolean;
  campaignId: string;
  onDeleted: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  pitch_deck: <FileText className="h-5 w-5" />,
  financials: <BarChart3 className="h-5 w-5" />,
  legal: <Scale className="h-5 w-5" />,
  tax: <Receipt className="h-5 w-5" />,
  roadmap: <Map className="h-5 w-5" />,
  cap_table: <PieChart className="h-5 w-5" />,
  market_research: <Search className="h-5 w-5" />,
  tech_arch: <Cpu className="h-5 w-5" />,
  other: <File className="h-5 w-5" />,
};

const visibilityVariant: Record<string, "success" | "warning" | "info"> = {
  PUBLIC: "success",
  PRIVATE: "warning",
  INVESTORS_ONLY: "info",
};

const visibilityLabel: Record<string, string> = {
  PUBLIC: "Public",
  PRIVATE: "Private",
  INVESTORS_ONLY: "Investors Only",
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentList({ documents, isOwner, campaignId, onDeleted }: DocumentListProps) {
  const [deleting, setDeleting] = React.useState<string | null>(null);

  // Group by type
  const grouped = documents.reduce<Record<string, Document[]>>((acc, doc) => {
    const key = doc.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {});

  async function handleDelete(docId: string) {
    if (!confirm("Are you sure you want to delete this document?")) return;
    setDeleting(docId);
    try {
      const res = await fetch(
        `/api/campaigns/${campaignId}/documents?docId=${docId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        onDeleted();
      }
    } catch {
      // silently fail
    } finally {
      setDeleting(null);
    }
  }

  if (documents.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
          <p className="text-secondary-500 font-medium">
            No documents uploaded yet
          </p>
          <p className="text-sm text-secondary-400 mt-1">
            Upload your first document to build your data room.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([type, docs]) => (
        <div key={type}>
          <h4 className="text-sm font-semibold text-secondary-600 uppercase tracking-wider mb-3">
            {getFileTypeLabel(type)}
          </h4>
          <div className="space-y-2">
            {docs.map((doc) => (
              <Card key={doc.id} padding="sm">
                <div className="flex items-center gap-3">
                  <div className="text-secondary-400 shrink-0">
                    {typeIcons[doc.type] || typeIcons.other}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant={visibilityVariant[doc.visibility] || "default"}
                        size="sm"
                      >
                        {visibilityLabel[doc.visibility] || doc.visibility}
                      </Badge>
                      {doc.fileSize && (
                        <span className="text-xs text-secondary-400">
                          {formatFileSize(doc.fileSize)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        loading={deleting === doc.id}
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 text-danger-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export { DocumentList };
export type { Document as DocumentType };
