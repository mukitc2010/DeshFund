import {
  PaymentGateway,
  PaymentInitResult,
  PaymentVerifyResult,
} from "./types";

export class SSLCommerzGateway implements PaymentGateway {
  provider = "SSLCOMMERZ";

  async initiate(
    amount: number,
    metadata: {
      contributionId: string;
      campaignId: string;
      userId: string;
      callbackUrl: string;
    }
  ): Promise<PaymentInitResult> {
    const txId = `ssl_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    console.log(
      `[SSLCommerz Stub] Initiating payment of ৳${amount} for contribution ${metadata.contributionId}`
    );
    return {
      success: true,
      transactionId: txId,
      paymentUrl: `${metadata.callbackUrl}?txId=${txId}&status=success`,
    };
  }

  async verify(transactionId: string): Promise<PaymentVerifyResult> {
    return {
      success: true,
      transactionId,
      amount: 0,
      providerTxId: transactionId,
      status: "completed",
    };
  }

  async handleCallback(
    payload: Record<string, unknown>
  ): Promise<PaymentVerifyResult> {
    const txId =
      (payload.txId as string) || `ssl_callback_${Date.now()}`;
    return {
      success: true,
      transactionId: txId,
      amount: Number(payload.amount || 0),
      providerTxId: txId,
      status: "completed",
      rawPayload: payload,
    };
  }
}
