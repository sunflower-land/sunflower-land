import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import type { GameState } from "../types/game";
import { makeGame } from "../lib/transforms";
import { getRecordHash } from "lib/stateHash";
import { secureFetch } from "lib/requestToken";

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
  | "captcha.succeeded"
  | "captcha.failed"
  | "admin.captchaTriggered"
  | "flower.depositStarted"
  | "sfl.depositStarted"
  | "telegram.linked"
  | "telegram.joined"
  | "telegram.unlinked"
  | "discord.unlinked"
  | "twitter.unlinked"
  | "twitter.followed"
  | "twitter.posted"
  | "twitter.showcased"
  | "showcase.removed"
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
  | "social.linked"
  | "social.loginToggled"
  | "account.migrated"
  | "moderation.kicked"
  | "moderation.muted"
  | "moderation.unmuted"
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
  | "reset.petRequests"
  | "auctionRaffle.entered"
  | "auctionRaffle.claimed"
  | "marketplace.buyBulkResources"
  | "liquidity.registered"
  | "appInstall.generate"
  | "farmHand.unlocked"
  | "economies.exchanged"
  | "giveaway.created"
  | "giveaway.joined"
  | "giveaway.progressed"
  | "giveaway.submitted"
  | "giveaway.ended"
  | "giveaway.claimed"
  | "layout.created"
  | "layout.edited"
  | "layout.deleted"
  | "layout.applied";

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
  // Fired inline from the captcha modal - no machine state
  | "captcha.failed"
  // Posted directly so they work from the `landscaping` state (which has no
  // effect states) - see actions/layoutEffects.ts
  | "layout.created"
  | "layout.edited"
  | "layout.deleted"
  | "layout.applied"
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
  | "solvingCaptcha"
  | "triggeringCaptcha"
  | "depositingFlower"
  | "depositingSFL"
  | "linkingTelegram"
  | "joiningTelegram"
  | "unlinkingSocial"
  | "followingTwitter"
  | "postingTwitter"
  | "showcasingTwitter"
  | "removingShowcase"
  | "buyingGems"
  | "buyingVIP"
  | "assigningUsername"
  | "changingUsername"
  | "claimingStreamReward"
  | "claimingBlockchainBox"
  | "marketplaceBulkListingsCancelling"
  | "marketplaceBulkOffersCancelling"
  | "linkingWallet"
  | "linkingSocial"
  | "togglingSocialLogin"
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
  | "generatingAppInstall"
  | "pickingUpWaterTrap"
  | "resettingPetRequests"
  | "exchangingEconomy"
  | "creatingGiveaway"
  | "joiningGiveaway"
  | "progressingGiveaway"
  | "submittingGiveaway"
  | "endingGiveaway"
  | "claimingGiveaway";

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
  "captcha.succeeded": "solvingCaptcha",
  "admin.captchaTriggered": "triggeringCaptcha",
  "flower.depositStarted": "depositingFlower",
  "sfl.depositStarted": "depositingSFL",
  "telegram.linked": "linkingTelegram",
  "telegram.joined": "joiningTelegram",
  // One state for all three providers - the UI reads the provider back
  // from the response (`data.provider`).
  "telegram.unlinked": "unlinkingSocial",
  "discord.unlinked": "unlinkingSocial",
  "twitter.unlinked": "unlinkingSocial",
  "twitter.followed": "followingTwitter",
  "twitter.posted": "postingTwitter",
  "twitter.showcased": "showcasingTwitter",
  "showcase.removed": "removingShowcase",
  "gems.bought": "buyingGems",
  "vip.bought": "buyingVIP",
  "username.assigned": "assigningUsername",
  "username.changed": "changingUsername",
  "streamReward.claimed": "claimingStreamReward",
  "blockchainBox.claimed": "claimingBlockchainBox",
  "marketplace.bulkListingsCancelled": "marketplaceBulkListingsCancelling",
  "marketplace.bulkOffersCancelled": "marketplaceBulkOffersCancelling",
  "wallet.linked": "linkingWallet",
  "social.linked": "linkingSocial",
  "social.loginToggled": "togglingSocialLogin",
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
  "reset.petRequests": "resettingPetRequests",
  "auctionRaffle.entered": "enteringAuctionRaffle",
  "auctionRaffle.claimed": "claimingAuctionRaffle",
  "marketplace.buyBulkResources": "marketplaceBuyingBulkResources",
  "appInstall.generate": "generatingAppInstall",
  "economies.exchanged": "exchangingEconomy",
  "giveaway.created": "creatingGiveaway",
  "giveaway.joined": "joiningGiveaway",
  "giveaway.progressed": "progressingGiveaway",
  "giveaway.submitted": "submittingGiveaway",
  "giveaway.ended": "endingGiveaway",
  "giveaway.claimed": "claimingGiveaway",
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

/**
 * A 400 from the event endpoint. `message` is the backend's errorCode;
 * `data` is whatever detail it attached (most codes send none, e.g.
 * `availableAt` for social account cooldowns).
 */
export type EffectError = Error & { data?: unknown };

export const createEffectError = (code: string, data?: unknown): EffectError =>
  Object.assign(new Error(code), data === undefined ? {} : { data });

/**
 * Keys an effect deletes from the game state. The response is pruned to
 * the keys that changed and merged over the client state, so a key the
 * server *removed* would otherwise survive the merge.
 */
const REMOVED_STATE_KEYS: Partial<Record<EffectName, (keyof GameState)[]>> = {
  "telegram.unlinked": ["telegram"],
  "discord.unlinked": ["discord"],
  "twitter.unlinked": ["twitter"],
};

export function stripRemovedStateKeys(
  effect: Effect,
  gameState: GameState,
): GameState {
  const keys = REMOVED_STATE_KEYS[effect.type];
  if (!keys?.length) return gameState;

  const stripped = { ...gameState };
  for (const key of keys) {
    delete stripped[key];
  }
  return stripped;
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

  const response = await secureFetch(`${API_URL}/event/${request.farmId}`, {
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
    const body = await response.json().catch(() => null);

    // Some rejections (e.g. WITHDRAW_MARKETPLACE_COOLDOWN, the SOCIAL_*
    // cooldowns) come with detail the UI needs. The message stays the bare
    // code - call sites compare on it - and the payload rides alongside on
    // the error object.
    throw createEffectError(
      body?.errorCode ?? ERRORS.EFFECT_SERVER_ERROR,
      body?.data,
    );
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
    gameState: makeGame(stripRemovedStateKeys(request.effect, mergedGameState)),
    data,
  };
}

/** Client-only effect fields to strip before sending to backend (not in API schema) */
const CLIENT_ONLY_EFFECT_FIELDS: Partial<Record<EffectName, string[]>> = {
  "auctionRaffle.claimed": ["prize"],
};

export function sanitizeEffectForBackend(effect: Effect): Effect {
  const fieldsToStrip = CLIENT_ONLY_EFFECT_FIELDS[effect.type];
  if (!fieldsToStrip?.length) return effect;
  const sanitized = { ...effect };
  for (const field of fieldsToStrip) {
    delete sanitized[field];
  }
  return sanitized;
}
