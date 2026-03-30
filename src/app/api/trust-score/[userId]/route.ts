import { NextResponse } from "next/server";
import { calculateTrustScore } from "@/lib/trust-score";
import { isDbUnavailable, mockTrustScore } from "@/lib/api-helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const result = await calculateTrustScore(userId);
    return NextResponse.json(result);
  } catch (error) {
    if (isDbUnavailable(error)) {
      const { userId } = await params;
      const mock = mockTrustScore(userId);
      if (!mock) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(mock);
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message === "User not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
