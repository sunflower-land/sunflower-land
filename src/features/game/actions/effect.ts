import { CONFIG } from "lib/config";
import { ErrorCode, ERRORS } from "lib/errors";
import { GameState } from "../types/game";
import { makeGame } from "../lib/transforms";

const API_URL = CONFIG.API_URL;

type EffectName =
  | "marketplace.listingPurchased"
  | "marketplace.listed"
  | "marketplace.offerMade"
  | "marketplace.offerAccepted"
  | "marketplace.offerCancelled"
  | "marketplace.listingCancelled"
  | "reward.airdropped";

export type StateName =
  | "marketplacePurchasing"
  | "marketplaceListing"
  | "marketplaceOffering"
  | "marketplaceAccepting"
  | "marketplaceCancelling"
  | "marketplaceListingCancelling"
  | "airdroppingReward";

export type StateNameWithStatus = `${StateName}Success` | `${StateName}Failed`;

// StateName is the feature.progressive_tense_verb. This will be used as the gameMachine state.
export const EFFECT_EVENTS: Record<EffectName, StateName> = {
  "marketplace.listingPurchased": "marketplacePurchasing",
  "marketplace.listed": "marketplaceListing",
  "marketplace.offerMade": "marketplaceOffering",
  "marketplace.offerAccepted": "marketplaceAccepting",
  "marketplace.offerCancelled": "marketplaceCancelling",
  "marketplace.listingCancelled": "marketplaceListingCancelling",
  "reward.airdropped": "airdroppingReward",
};

export interface Effect {
  type: EffectName;
}

type Request = {
  farmId: number;
  token: string;
  transactionId: string;
  effect: Effect;
};

export async function postEffect(
  request: Request,
): Promise<{ gameState: GameState; errorCode?: ErrorCode; data: any }> {
  const response = await window.fetch(`${API_URL}/event/${request.farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "X-Transaction-ID": request.transactionId,
      Authorization: `Bearer ${request.token}`,
      accept: "application/json",
      ...((window as any)["x-amz-ttl"]
        ? { "X-Amz-TTL": (window as any)["x-amz-ttl"] }
        : {}),
    },
    body: JSON.stringify({
      event: request.effect,
      createdAt: new Date().toISOString(),
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.EFFECT_SERVER_ERROR);
  }

  const { gameState, errorCode, ...data } = await response.json();

  return {
    gameState: makeGame(gameState),
    errorCode,
    data,
  };
}
