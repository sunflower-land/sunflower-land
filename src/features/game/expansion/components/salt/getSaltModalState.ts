import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";
import {
  getDisplaySaltCharges,
  getNextSaltChargeInSeconds,
  getSaltChargeGenerationTime,
  getSaltRegenerationHarvestPauseUntil,
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SaltNode,
  getStoredSaltCharges,
  saltRegenStoredCapAt,
  syncSaltNode,
} from "features/game/types/salt";
import { useNow } from "lib/utils/hooks/useNow";

export type SaltModalPrimaryAction = "claim" | "start" | "blocked";
export type SaltRegenerationState = "maxed" | "paused" | "charging";

export type SaltHarvestSlotUi = {
  startedAt: number;
  readyAt: number;
};

/**
 * Partitions harvest slots into display groups for the salt modal UI.
 *
 * Sorts slots by `readyAt` ascending, then finds the first in-progress slot
 * (`now < readyAt`).
 *
 * **Non-VIP**: returns the in-progress slot (or the sole ready slot) as
 * `inProgressDisplaySlot`; `queueGridSlots` is always empty.
 *
 * **VIP with in-progress head**: head goes to `inProgressDisplaySlot`,
 * remaining slots (up to 2) go to `queueGridSlots`.
 *
 * **VIP with all ready**: no `inProgressDisplaySlot`; up to 3 slots in
 * `queueGridSlots`.
 */
export function partitionSaltHarvestSlotsForQueueUi(
  slots: SaltHarvestSlotUi[],
  now: number,
  isVip: boolean,
): {
  sortedSlots: SaltHarvestSlotUi[];
  /** First slot where `now < readyAt`; `undefined` when all slots are ready. */
  inProgressSlot: SaltHarvestSlotUi | undefined;
  /**
   * The slot displayed in the "In Progress" row: the active head (VIP/non-VIP),
   * or (non-VIP only) the single slot when it is ready.
   */
  inProgressDisplaySlot: SaltHarvestSlotUi | undefined;
  /** VIP queue grid: up to 2 slots when a head exists, up to 3 when all ready. */
  queueGridSlots: SaltHarvestSlotUi[];
  queueGridCapacity: number;
} {
  const sortedSlots = [...slots].sort((a, b) => a.readyAt - b.readyAt);
  const inProgressIndex = sortedSlots.findIndex((s) => now < s.readyAt);
  const inProgressSlot =
    inProgressIndex >= 0 ? sortedSlots[inProgressIndex] : undefined;

  const inProgressDisplaySlot =
    inProgressSlot ??
    (!isVip && sortedSlots.length === 1 ? sortedSlots[0] : undefined);

  if (!isVip) {
    return {
      sortedSlots,
      inProgressSlot,
      inProgressDisplaySlot,
      queueGridSlots: [],
      queueGridCapacity: 0,
    };
  }

  if (inProgressSlot) {
    const tail = sortedSlots.filter((s) => s !== inProgressSlot);
    return {
      sortedSlots,
      inProgressSlot,
      inProgressDisplaySlot: inProgressSlot,
      queueGridSlots: tail.slice(0, 2),
      queueGridCapacity: 2,
    };
  }

  return {
    sortedSlots,
    inProgressSlot: undefined,
    inProgressDisplaySlot: undefined,
    queueGridSlots: sortedSlots.slice(0, 3),
    queueGridCapacity: 3,
  };
}

export type SaltModalState = {
  syncedNode: SaltNode;
  storedCharges: number;
  displayCharges: number;
  maxStoredCharges: number;
  activeSlots: { startedAt: number; readyAt: number }[];
  readySlots: { startedAt: number; readyAt: number }[];
  sortedSlots: SaltHarvestSlotUi[];
  inProgressSlot: SaltHarvestSlotUi | undefined;
  inProgressDisplaySlot: SaltHarvestSlotUi | undefined;
  queueGridSlots: SaltHarvestSlotUi[];
  queueGridCapacity: number;
  availableSaltRakes: number;
  isVip: boolean;
  minRakes: number;
  maxRakes: number;
  canStart: boolean;
  canClaim: boolean;
  blockedReason?: string;
  primaryAction: SaltModalPrimaryAction;
  regenerationState: SaltRegenerationState;
  nextChargeInSeconds?: number;
  pauseRemainingSeconds?: number;
};

type Props = {
  saltNode: SaltNode;
  gameState: GameState;
  saltRakes: Decimal | undefined;
  isVip: boolean;
};

/**
 * Derives all UI state for the salt node modal at a given `now`.
 *
 * 1. Computes the charge interval via {@link getSaltChargeGenerationTime} and
 *    syncs the node via {@link syncSaltNode}.
 * 2. Derives `storedCharges` and `displayCharges` from the materialized state.
 * 3. Partitions harvest slots for the queue UI via {@link partitionSaltHarvestSlotsForQueueUi}.
 * 4. Computes `canStart` / `canClaim` / `blockedReason`:
 *    - VIP: `min(remainingVipSlots, storedCharges, availableRakes)` rakes.
 *    - Non-VIP: 0 if any active slot exists, else `min(1, storedCharges, availableRakes)`.
 * 5. Determines `regenerationState`:
 *    - `"maxed"`: display full AND pile at cap with no harvest gate.
 *    - `"paused"`: harvest gate exists, is in the future, and pile is full or cap is 0.
 *    - `"charging"`: shows `nextChargeInSeconds` countdown unless display is at max
 *      with ready slots (hides countdown to match the 3/3 meter).
 */
export function getSaltModalState({
  saltNode,
  gameState,
  now,
  saltRakes,
  isVip,
}: Props & { now: number }): SaltModalState {
  const interval = getSaltChargeGenerationTime({ gameState });
  const syncOpts = { chargeIntervalMs: interval };
  const syncedNode = syncSaltNode(saltNode, now, syncOpts);
  const storedCharges = getStoredSaltCharges(saltNode, now, syncOpts);
  const displayCharges = getDisplaySaltCharges(saltNode, now, syncOpts);
  const activeSlots = syncedNode.salt.harvesting?.slots ?? [];
  const readySlots = activeSlots.filter((slot) => slot.readyAt <= now);
  const {
    sortedSlots,
    inProgressSlot,
    inProgressDisplaySlot,
    queueGridSlots,
    queueGridCapacity,
  } = partitionSaltHarvestSlotsForQueueUi(activeSlots, now, isVip);
  const availableSaltRakes = Math.max(
    0,
    Math.floor(saltRakes?.toNumber() ?? 0),
  );
  const remainingVipSlots = Math.max(0, 4 - activeSlots.length);
  const maxByRules = isVip
    ? Math.min(remainingVipSlots, storedCharges, availableSaltRakes)
    : activeSlots.length > 0
      ? 0
      : Math.min(1, storedCharges, availableSaltRakes);
  const canStart = maxByRules >= 1;
  const canClaim = readySlots.length > 0;

  let blockedReason: string | undefined;
  if (!canStart) {
    if (!isVip && activeSlots.length > 0) {
      blockedReason = "Non-VIP can only have one active salt rake";
    } else if (isVip && remainingVipSlots <= 0) {
      blockedReason = "VIP can have up to 4 active salt rakes";
    } else if (availableSaltRakes <= 0) {
      blockedReason = "Not enough Salt Rakes";
    } else if (storedCharges <= 0) {
      blockedReason =
        displayCharges > 0
          ? "Charges are in use by active harvests"
          : "No salt charges available";
    }
  }

  const atMaxCharges = displayCharges >= MAX_STORED_SALT_CHARGES_PER_NODE;
  const harvestPauseUntil = getSaltRegenerationHarvestPauseUntil(
    saltNode.salt,
    now,
    syncOpts,
  );
  const pileCap = saltRegenStoredCapAt(syncedNode.salt.harvesting, now);
  const persistedStored = syncedNode.salt.storedCharges;
  const mustWaitForHarvestToAcceptStored =
    pileCap === 0 || persistedStored >= pileCap;

  const pileFullToCap =
    atMaxCharges &&
    harvestPauseUntil === undefined &&
    persistedStored >= pileCap;

  const shouldPauseRegeneration =
    harvestPauseUntil !== undefined &&
    now < harvestPauseUntil &&
    (pileCap === 0 || (atMaxCharges && mustWaitForHarvestToAcceptStored));

  let regenerationState: SaltRegenerationState = "charging";
  let pauseRemainingSeconds: number | undefined;
  let nextChargeInSeconds: number | undefined;

  const showChargeCountdown =
    !shouldPauseRegeneration &&
    (!atMaxCharges || persistedStored < pileCap) &&
    !(atMaxCharges && readySlots.length > 0);

  if (pileFullToCap) {
    regenerationState = "maxed";
  } else if (shouldPauseRegeneration) {
    regenerationState = "paused";
    pauseRemainingSeconds = Math.ceil(
      Math.max(0, harvestPauseUntil! - now) / 1000,
    );
  } else if (showChargeCountdown) {
    nextChargeInSeconds = getNextSaltChargeInSeconds({
      nextChargeAt: syncedNode.salt.nextChargeAt,
      now,
    });
  } else if (atMaxCharges) {
    regenerationState = "maxed";
  }

  return {
    syncedNode,
    storedCharges,
    displayCharges,
    maxStoredCharges: MAX_STORED_SALT_CHARGES_PER_NODE,
    activeSlots,
    readySlots,
    sortedSlots,
    inProgressSlot,
    inProgressDisplaySlot,
    queueGridSlots,
    queueGridCapacity,
    availableSaltRakes,
    isVip,
    minRakes: 1,
    maxRakes: maxByRules,
    canStart,
    canClaim,
    blockedReason,
    primaryAction: canClaim ? "claim" : canStart ? "start" : "blocked",
    regenerationState,
    nextChargeInSeconds,
    pauseRemainingSeconds,
  };
}

/** React hook wrapper: calls {@link getSaltModalState} with a live `now` from {@link useNow}. */
export function useSaltModalState({
  saltNode,
  gameState,
  saltRakes,
  isVip,
}: Props): SaltModalState {
  const now = useNow({ live: true });
  return getSaltModalState({ saltNode, gameState, now, saltRakes, isVip });
}
