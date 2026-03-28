import { PaymentGateway } from "./types";
import { BkashGateway } from "./bkash";
import { NagadGateway } from "./nagad";
import { SSLCommerzGateway } from "./sslcommerz";

const gateways: Record<string, PaymentGateway> = {
  BKASH: new BkashGateway(),
  NAGAD: new NagadGateway(),
  SSLCOMMERZ: new SSLCommerzGateway(),
};

export function getPaymentGateway(provider: string): PaymentGateway {
  const gateway = gateways[provider];
  if (!gateway) throw new Error(`Unsupported payment provider: ${provider}`);
  return gateway;
}

export type { PaymentGateway } from "./types";
