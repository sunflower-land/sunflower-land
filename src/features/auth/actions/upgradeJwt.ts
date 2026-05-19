import { CONFIG } from "lib/config";

export enum UpgradeJwtError {
  NOT_GOOGLE_USER = "NOT_GOOGLE_USER",
  NO_LINKED_WALLET = "NO_LINKED_WALLET",
  WALLET_MISMATCH = "WALLET_MISMATCH",
  INVALID_SIGNATURE = "INVALID_SIGNATURE",
  FARM_NOT_FOUND = "FARM_NOT_FOUND",
}

export class UpgradeJwtFailure extends Error {
  public readonly code: UpgradeJwtError | "UNKNOWN";

  constructor(code: UpgradeJwtError | "UNKNOWN") {
    super(code);
    this.name = "UpgradeJwtFailure";
    this.code = code;
  }
}

const ERROR_CODES = Object.values(UpgradeJwtError) as string[];

export async function upgradeJwt({
  authToken,
  address,
  signature,
  transactionId,
}: {
  authToken: string;
  address: string;
  signature: string;
  transactionId: string;
}): Promise<{ token: string }> {
  const response = await window.fetch(`${CONFIG.API_URL}/auth/upgrade-jwt`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${authToken}`,
      "X-Transaction-ID": transactionId,
    },
    body: JSON.stringify({ address, signature }),
  });

  if (response.status === 200) {
    return (await response.json()) as { token: string };
  }

  let code: UpgradeJwtError | "UNKNOWN" = "UNKNOWN";
  try {
    const body = await response.json();
    if (typeof body?.error === "string" && ERROR_CODES.includes(body.error)) {
      code = body.error as UpgradeJwtError;
    }
  } catch {
    // body wasn't JSON — fall through with UNKNOWN
  }

  throw new UpgradeJwtFailure(code);
}
