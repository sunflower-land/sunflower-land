import { CONFIG } from "lib/config";
import { VisitGameState } from "./loadGameStateForVisit";

const API_URL = CONFIG.API_URL;

export async function loadGameStateForAdmin({
  adminId,
  token,
  farmId,
  username,
  discordId,
  nftId,
  wallet,
}: {
  adminId: number;
  token: string;
  farmId: number;
  username?: string;
  discordId?: string;
  nftId?: number;
  wallet?: string;
}): Promise<{
  visitedFarmState: VisitGameState;
  id: number;
}> {
  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "adminSearch");
  url.searchParams.set("adminId", adminId.toString());

  if (farmId) {
    url.searchParams.set("farmId", farmId.toString());
  }

  if (username) {
    url.searchParams.set("username", username);
  }
  if (discordId) {
    url.searchParams.set("discordId", discordId);
  }

  if (nftId) {
    url.searchParams.set("nftId", nftId.toString());
  }

  if (wallet) {
    url.searchParams.set("wallet", wallet);
  }

  const response = await window.fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return {
    visitedFarmState: data?.data?.state,
    id: data?.data?.id,
  };
}
