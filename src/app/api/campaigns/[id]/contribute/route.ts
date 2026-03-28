import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { contributeSchema } from "@/lib/validators/contribution";
import { getPaymentGateway } from "@/lib/payments";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;

    let user;
    try {
      user = await requireAuth();
    } catch {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "UNAUTHORIZED", message: "Authentication required" },
        },
        { status: 401 }
      );
    }

    // Find campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "NOT_FOUND", message: "Campaign not found" },
        },
        { status: 404 }
      );
    }

    if (campaign.status !== "ACTIVE") {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "BAD_REQUEST",
            message: "Campaign is not accepting contributions",
          },
        },
        { status: 400 }
      );
    }

    // Campaign owner cannot contribute to their own campaign
    if (campaign.founderId === user.id) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "FORBIDDEN",
            message: "You cannot contribute to your own campaign",
          },
        },
        { status: 403 }
      );
    }

    // Validate body
    const body = await request.json();
    const parsed = contributeSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0].message,
          },
        },
        { status: 400 }
      );
    }

    const { amount, paymentProvider } = parsed.data;

    // Create contribution in PENDING state
    const contribution = await prisma.contribution.create({
      data: {
        userId: user.id,
        campaignId,
        amount,
        status: "PENDING",
        paymentProvider: paymentProvider as
          | "BKASH"
          | "NAGAD"
          | "ROCKET"
          | "SSLCOMMERZ"
          | "CARD",
      },
    });

    // Determine callback URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${baseUrl}/api/payments/callback/${paymentProvider.toLowerCase()}`;

    // For providers with gateway stubs (BKASH, NAGAD, SSLCOMMERZ), initiate payment
    let paymentUrl: string | undefined;
    let providerTxId: string | undefined;

    try {
      const gateway = getPaymentGateway(paymentProvider);
      const paymentResult = await gateway.initiate(amount, {
        contributionId: contribution.id,
        campaignId,
        userId: user.id,
        callbackUrl,
      });

      if (!paymentResult.success) {
        // Mark contribution as failed
        await prisma.contribution.update({
          where: { id: contribution.id },
          data: { status: "FAILED" },
        });
        return Response.json(
          {
            success: false,
            data: null,
            error: {
              code: "PAYMENT_ERROR",
              message: paymentResult.error || "Payment initiation failed",
            },
          },
          { status: 502 }
        );
      }

      paymentUrl = paymentResult.paymentUrl;
      providerTxId = paymentResult.transactionId;
    } catch {
      // For unsupported providers (ROCKET, CARD), create a pending transaction
      providerTxId = `${paymentProvider.toLowerCase()}_${Date.now()}`;
    }

    // Create transaction record
    await prisma.transaction.create({
      data: {
        contributionId: contribution.id,
        provider: paymentProvider as
          | "BKASH"
          | "NAGAD"
          | "ROCKET"
          | "SSLCOMMERZ"
          | "CARD",
        providerTxId: providerTxId || null,
        amount,
        status: "PENDING",
      },
    });

    // Update contribution with provider tx id
    await prisma.contribution.update({
      where: { id: contribution.id },
      data: { providerTxId },
    });

    // Dev mode: auto-complete since stubs return success instantly
    if (process.env.NODE_ENV !== "production") {
      await prisma.contribution.update({
        where: { id: contribution.id },
        data: { status: "COMPLETED" },
      });

      await prisma.transaction.update({
        where: { contributionId: contribution.id },
        data: { status: "COMPLETED" },
      });

      // Update campaign raisedAmount and contributorCount
      // Check if this user has previously contributed to this campaign
      const previousContributions = await prisma.contribution.count({
        where: {
          campaignId,
          userId: user.id,
          status: "COMPLETED",
          id: { not: contribution.id },
        },
      });

      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          raisedAmount: { increment: amount },
          contributorCount:
            previousContributions === 0 ? { increment: 1 } : undefined,
        },
      });

      // Create notification for the founder
      await prisma.notification.create({
        data: {
          userId: campaign.founderId,
          title: "New Contribution",
          message: `Your campaign "${campaign.title}" received a contribution of ৳${amount}.`,
          link: `/campaigns/${campaign.slug}`,
        },
      });
    }

    // Fetch the final contribution state
    const finalContribution = await prisma.contribution.findUnique({
      where: { id: contribution.id },
      include: {
        transaction: true,
      },
    });

    return Response.json(
      {
        success: true,
        data: {
          contribution: finalContribution,
          paymentUrl,
        },
        error: null,
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contribution error:", error);
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
