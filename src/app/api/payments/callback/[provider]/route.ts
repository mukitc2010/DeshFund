import { prisma } from "@/lib/prisma";
import { getPaymentGateway } from "@/lib/payments";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params;
    const providerKey = provider.toUpperCase();

    let gateway;
    try {
      gateway = getPaymentGateway(providerKey);
    } catch {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "BAD_REQUEST",
            message: `Unsupported payment provider: ${provider}`,
          },
        },
        { status: 400 }
      );
    }

    const payload = await request.json();
    const result = await gateway.handleCallback(payload);

    if (!result.transactionId) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "BAD_REQUEST",
            message: "Missing transaction ID in callback",
          },
        },
        { status: 400 }
      );
    }

    // Find the transaction by providerTxId
    const transaction = await prisma.transaction.findFirst({
      where: { providerTxId: result.transactionId },
      include: {
        contribution: {
          include: { campaign: true },
        },
      },
    });

    if (!transaction) {
      console.error(
        `[Payment Callback] Transaction not found for providerTxId: ${result.transactionId}`
      );
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "NOT_FOUND",
            message: "Transaction not found",
          },
        },
        { status: 404 }
      );
    }

    const contribution = transaction.contribution;
    const campaign = contribution.campaign;

    // Determine new contribution status
    const statusMap: Record<string, "COMPLETED" | "FAILED" | "PENDING"> = {
      completed: "COMPLETED",
      failed: "FAILED",
      pending: "PENDING",
    };
    const newStatus = statusMap[result.status] || "PENDING";

    // Update transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: newStatus,
        rawPayload: result.rawPayload ? JSON.parse(JSON.stringify(result.rawPayload)) : undefined,
      },
    });

    // Update contribution
    await prisma.contribution.update({
      where: { id: contribution.id },
      data: { status: newStatus },
    });

    // If completed, update campaign stats and notify founder
    if (newStatus === "COMPLETED" && contribution.status !== "COMPLETED") {
      // Check if first contribution from this user
      const previousContributions = await prisma.contribution.count({
        where: {
          campaignId: campaign.id,
          userId: contribution.userId,
          status: "COMPLETED",
          id: { not: contribution.id },
        },
      });

      await prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          raisedAmount: {
            increment: Number(contribution.amount),
          },
          contributorCount:
            previousContributions === 0 ? { increment: 1 } : undefined,
        },
      });

      // Notify the founder
      await prisma.notification.create({
        data: {
          userId: campaign.founderId,
          title: "New Contribution",
          message: `Your campaign "${campaign.title}" received a contribution of ৳${contribution.amount}.`,
          link: `/campaigns/${campaign.slug}`,
        },
      });
    }

    return Response.json({
      success: true,
      data: { status: newStatus },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Payment callback error:", error);
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }
}
