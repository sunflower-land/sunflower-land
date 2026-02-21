import { CONFIG } from "lib/config";
import { GameState } from "../types/game";
import { makeGame } from "../lib/transforms";

const API_URL = CONFIG.API_URL;

export type VisitGameState = Omit<
  GameState,
  | "tradedAt"
  | "tradeOffer"
  | "warCollectionOffer"
  | "airdrops"
  | "stock"
  | "stockExpiry"
  | "expansionRequirements"
> & {
  moderator: {
    wallet?: string;
    discordId?: string;
    isFaceRecognised?: boolean;
    account: "wallet" | "google" | "fsl" | "wechat";
    nftId?: number;
  };
};

export async function loadGameStateForVisit(
  id: number,
  token?: string,
): Promise<{
  visitorFarmState: GameState;
  isBanned: boolean;
  visitorId: number;
  visitedFarmState: GameState;
  visitedFarmNftId?: number;
  hasHelpedPlayerToday: boolean;
  totalHelpedToday: number;
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

  const { visitorFarmState, visitedFarmState, visitedFarmNftId } = data;

  return {
    ...data,
    visitorFarmState: makeGame(visitorFarmState),
    visitedFarmState: makeGame(visitedFarmState),
    visitedFarmNftId,
  };
}
