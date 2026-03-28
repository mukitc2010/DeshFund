export interface PaymentInitResult {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

export interface PaymentVerifyResult {
  success: boolean;
  transactionId: string;
  amount: number;
  providerTxId: string;
  status: "completed" | "failed" | "pending";
  rawPayload?: Record<string, unknown>;
}

export interface PaymentGateway {
  provider: string;
  initiate(
    amount: number,
    metadata: {
      contributionId: string;
      campaignId: string;
      userId: string;
      callbackUrl: string;
    }
  ): Promise<PaymentInitResult>;
  verify(transactionId: string): Promise<PaymentVerifyResult>;
  handleCallback(
    payload: Record<string, unknown>
  ): Promise<PaymentVerifyResult>;
}
