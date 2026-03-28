export interface UploadResult {
  url: string;
  fileSize?: number;
}

export async function uploadFile(file: File): Promise<UploadResult> {
  // Stub: In production, upload to S3/Cloudinary
  // For dev, just return a placeholder URL
  return {
    url: `/uploads/${file.name}`,
    fileSize: file.size,
  };
}

export function getFileTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    pitch_deck: "Pitch Deck",
    financials: "Financial Projections",
    legal: "Legal Documents",
    tax: "Tax Documents",
    roadmap: "Product Roadmap",
    cap_table: "Cap Table",
    market_research: "Market Research",
    tech_arch: "Technical Architecture",
    other: "Other",
  };
  return labels[type] || type;
}

export const DOCUMENT_TYPES = [
  "pitch_deck",
  "financials",
  "legal",
  "tax",
  "roadmap",
  "cap_table",
  "market_research",
  "tech_arch",
  "other",
] as const;
