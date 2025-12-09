import { CONFIG } from "lib/config";

export type LiquidityTableEntry = {
  usd: number;
  flower: number;
  [key: string]: unknown;
};

export type PlayerLiquidity = {
  amount: number;
  lastUpdatedAt?: number;
  [key: string]: unknown;
};

export const getPlayerLiquidity = async ({
  farmId,
  token,
}: {
  farmId: number;
  token?: string;
}): Promise<PlayerLiquidity> => {
  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "liquidity");
  url.searchParams.set("farmId", farmId.toString());

  const headers: Record<string, string> = {
    "content-type": "application/json;charset=UTF-8",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await window.fetch(url.toString(), {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to fetch liquidity data");
  }

  const body = await response.json();

  return {
    amount: body.data?.liquidity,
    lastUpdatedAt: body.data?.lastUpdatedAt,
  };
};
