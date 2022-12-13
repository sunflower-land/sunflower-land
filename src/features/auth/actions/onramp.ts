import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  token: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

async function getReservation(request: Request) {
  const response = await window.fetch(`${API_URL}/onramp`, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Transaction-ID": request.transactionId,
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.ONRAMP_SERVER_ERROR);
  }

  const { reservation } = await response.json();

  return {
    reservation,
  };
}

export async function onramp(request: Request, onPaymentSuccess?: () => void) {
  const env = CONFIG.NETWORK === "mainnet" ? "prod" : "test";

  const { reservation } = await getReservation(request);

  const wyre = new (window as any).Wyre({
    env,
    reservation,
    operation: {
      type: "debitcard-hosted-dialog",
    },
  });

  wyre.on("paymentSuccess", (_event: any) => {
    onPaymentSuccess && onPaymentSuccess();
  });

  wyre.open();
}
