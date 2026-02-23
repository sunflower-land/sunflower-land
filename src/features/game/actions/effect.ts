import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { GameState } from "../types/game";
import { makeGame } from "../lib/transforms";
import { getRecordHash } from "lib/stateHash";

const API_URL = CONFIG.API_URL;

type EffectName =
  | "marketplace.listingPurchased"
  | "marketplace.listed"
  | "marketplace.offerMade"
  | "marketplace.offerAccepted"
  | "marketplace.offerCancelled"
  | "marketplace.listingCancelled"
  | "reward.airdropped"
  | "faceRecognition.started"
  | "faceRecognition.completed"
  | "flower.depositStarted"
  | "sfl.depositStarted"
  | "telegram.linked"
  | "telegram.joined"
  | "twitter.followed"
  | "twitter.posted"
  | "gems.bought"
  | "vip.bought"
  | "username.assigned"
  | "username.changed"
  | "streamReward.claimed"
  | "blockchainBox.claimed"
  | "withdraw.items"
  | "withdraw.wearables"
  | "withdraw.buds"
  | "wallet.linked"
  | "account.migrated"
  | "moderation.kicked"
  | "moderation.muted"
  | "moderation.unmuted"
  | "blessing.offered"
  | "blessing.seeked"
  | "nft.assigned"
  | "admin.NFTAssigned"
  | "marketplace.bulkListingsCancelled"
  | "marketplace.bulkOffersCancelled"
  | "farm.followed"
  | "farm.unfollowed"
  | "message.sent"
  | "farm.cheered"
  | "project.completed"
  | "farm.helped"
  | "pet.wakeUp"
  | "auction.claimed"
  | "auction.bidPlaced"
  | "auction.bidCancelled"
  | "auctionRaffle.entered"
  | "auctionRaffle.claimed"
  | "marketplace.buyBulkResources"
  | "leagues.updated"
  | "liquidity.registered"
  | "appInstall.generate"
  | "farmHand.unlocked";

type VisitEffectName = "farm.helped" | "farm.cheered" | "farm.followed";

// IMPORTANT: If your effect does not go via a state in the state machine then exclude it here!
// Create a type that excludes the events that are not individual state machine states
export type StateMachineEffectName = Exclude<
  EffectName,
  | "withdraw.items"
  | "withdraw.wearables"
  | "withdraw.buds"
  | "account.migrated"
  | "moderation.kicked"
  | "moderation.muted"
  | "moderation.unmuted"
  | "farm.unfollowed"
  | "message.sent"
  | "liquidity.registered"
>;

export type StateMachineVisitEffectName = VisitEffectName;

export type StateMachineStateName =
  | "marketplacePurchasing"
  | "marketplaceListing"
  | "marketplaceOffering"
  | "marketplaceAccepting"
  | "marketplaceCancelling"
  | "marketplaceListingCancelling"
  | "airdroppingReward"
  | "startingFaceRecognition"
  | "completingFaceRecognition"
  | "depositingFlower"
  | "depositingSFL"
  | "linkingTelegram"
  | "joiningTelegram"
  | "followingTwitter"
  | "postingTwitter"
  | "buyingGems"
  | "buyingVIP"
  | "assigningUsername"
  | "changingUsername"
  | "claimingStreamReward"
  | "claimingBlockchainBox"
  | "offeringBlessing"
  | "seekingBlessing"
  | "marketplaceBulkListingsCancelling"
  | "marketplaceBulkOffersCancelling"
  | "linkingWallet"
  | "assigningNFT"
  | "cheeringFarm"
  | "followingFarm"
  | "completingProject"
  | "unlockingFarmhand"
  | "helpingFarm"
  | "claimingAuction"
  | "wakingPet"
  | "auctionBidding"
  | "auctionCancelling"
  | "enteringAuctionRaffle"
  | "claimingAuctionRaffle"
  | "marketplaceBuyingBulkResources"
  | "updatingLeagues"
  | "generatingAppInstall"
  | "pickingUpWaterTrap";

export type StateMachineVisitStateName =
  | "helpingFarm"
  | "cheeringFarmVisiting"
  | "followingFarmVisiting";

export type StateNameWithStatus =
  | `${StateMachineStateName}Success`
  | `${StateMachineStateName}Failed`
  | `${StateMachineVisitStateName}Success`
  | `${StateMachineVisitStateName}Failed`;

// StateName is the feature.progressive_tense_verb. This will be used as the gameMachine state.
export const STATE_MACHINE_EFFECTS: Record<
  StateMachineEffectName,
  StateMachineStateName
> = {
  "marketplace.listingPurchased": "marketplacePurchasing",
  "marketplace.listed": "marketplaceListing",
  "marketplace.offerMade": "marketplaceOffering",
  "marketplace.offerAccepted": "marketplaceAccepting",
  "marketplace.offerCancelled": "marketplaceCancelling",
  "marketplace.listingCancelled": "marketplaceListingCancelling",
  "reward.airdropped": "airdroppingReward",
  "faceRecognition.started": "startingFaceRecognition",
  "faceRecognition.completed": "completingFaceRecognition",
  "flower.depositStarted": "depositingFlower",
  "sfl.depositStarted": "depositingSFL",
  "telegram.linked": "linkingTelegram",
  "telegram.joined": "joiningTelegram",
  "twitter.followed": "followingTwitter",
  "twitter.posted": "postingTwitter",
  "gems.bought": "buyingGems",
  "vip.bought": "buyingVIP",
  "username.assigned": "assigningUsername",
  "username.changed": "changingUsername",
  "streamReward.claimed": "claimingStreamReward",
  "blockchainBox.claimed": "claimingBlockchainBox",
  "blessing.offered": "offeringBlessing",
  "blessing.seeked": "seekingBlessing",
  "marketplace.bulkListingsCancelled": "marketplaceBulkListingsCancelling",
  "marketplace.bulkOffersCancelled": "marketplaceBulkOffersCancelling",
  "wallet.linked": "linkingWallet",
  "nft.assigned": "assigningNFT",
  "admin.NFTAssigned": "assigningNFT",
  "farm.cheered": "cheeringFarm",
  "farm.followed": "followingFarm",
  "project.completed": "completingProject",
  "farmHand.unlocked": "unlockingFarmhand",
  "farm.helped": "helpingFarm",
  "auction.claimed": "claimingAuction",
  "pet.wakeUp": "wakingPet",
  "auction.bidPlaced": "auctionBidding",
  "auction.bidCancelled": "auctionCancelling",
  "auctionRaffle.entered": "enteringAuctionRaffle",
  "auctionRaffle.claimed": "claimingAuctionRaffle",
  "marketplace.buyBulkResources": "marketplaceBuyingBulkResources",
  "leagues.updated": "updatingLeagues",
  "appInstall.generate": "generatingAppInstall",
};

export const STATE_MACHINE_VISIT_EFFECTS: Record<
  StateMachineVisitEffectName,
  StateMachineVisitStateName
> = {
  "farm.helped": "helpingFarm",
  "farm.cheered": "cheeringFarmVisiting",
  "farm.followed": "followingFarmVisiting",
};

export interface Effect {
  type: EffectName;
  [key: string]: any;
}

type Request = {
  farmId: number;
  token: string;
  transactionId: string;
  effect: Effect;
  state?: GameState;
};

export async function postEffect(
  request: Request,
): Promise<{ gameState: GameState; data: any }> {
  const stateHash = request.state
    ? await getRecordHash(request.state as unknown as Record<string, unknown>)
    : undefined;

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
      ...(stateHash ? { stateHash } : {}),
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.EFFECT_TOO_MANY_REQUESTS);
  }

  if (response.status === 400) {
    const { errorCode } = await response.json();

    throw new Error(errorCode ?? ERRORS.EFFECT_SERVER_ERROR);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.EFFECT_SERVER_ERROR);
  }

  const { gameState, data } = await response.json();

  const mergedGameState = request.state
    ? // Response may be pruned (diff); merge over the current client state
      ({
        ...request.state,
        ...gameState,
      } as GameState)
    : (gameState as GameState);

  return {
    gameState: makeGame(mergedGameState),
    data,
  };
}
