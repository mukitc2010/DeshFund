import { NextResponse } from "next/server";
import { calculateTrustScore } from "@/lib/trust-score";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const result = await calculateTrustScore(userId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message === "User not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
