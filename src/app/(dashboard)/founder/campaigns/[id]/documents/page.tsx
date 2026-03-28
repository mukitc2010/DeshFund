"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import { DocumentUploader } from "@/components/data-room/DocumentUploader";
import { DocumentList } from "@/components/data-room/DocumentList";
import type { DocumentType } from "@/components/data-room/DocumentList";

export default function DataRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${id}/documents`);
      const data = await res.json();
      if (data.success) {
        setDocuments(data.data.documents);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">Data Room</h1>
        <p className="text-secondary-500 mt-1">
          Manage documents for your campaign. Investors and supporters can
          access public documents.
        </p>
      </div>

      <div className="space-y-8">
        <DocumentUploader campaignId={id} onUploaded={fetchDocuments} />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        ) : (
          <DocumentList
            documents={documents}
            isOwner={true}
            campaignId={id}
            onDeleted={fetchDocuments}
          />
        )}
      </div>
    </div>
  );
}
