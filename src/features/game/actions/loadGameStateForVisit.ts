import { CONFIG } from "lib/config";
import { GameState } from "../types/game";

const API_URL = CONFIG.API_URL;

type VisitGameState = Omit<
  GameState,
  | "tradedAt"
  | "tradeOffer"
  | "warCollectionOffer"
  | "airdrops"
  | "stock"
  | "stockExpiry"
  | "expansionRequirements"
>;

export async function loadGameStateForVisit(
  id: number,
  token?: string,
): Promise<{
  state: VisitGameState;
  isBanned: boolean;
}> {
  // Go and fetch the state for the farm you are trying to visit
  const url = `${API_URL}/visit/${id}`;
  const response = await window.fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data;
}
