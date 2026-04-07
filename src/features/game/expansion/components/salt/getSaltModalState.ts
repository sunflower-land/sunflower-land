import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";
import {
  getNextSaltChargeInSeconds,
  getSaltChargeGenerationTime,
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SaltNode,
  getStoredSaltCharges,
  syncSaltNode,
} from "features/game/types/salt";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { useNow } from "lib/utils/hooks/useNow";

export type SaltModalPrimaryAction = "start" | "blocked";
export type SaltRegenerationState = "maxed" | "charging";

export type SaltHarvestSlotUi = {
  startedAt: number;
  readyAt: number;
};

export type SaltModalState = {
  canStart: boolean;
  canClaim: false;
  blockedReason?: TranslationKeys;
  primaryAction: SaltModalPrimaryAction;
  regenerationState: SaltRegenerationState;
  nextChargeInSeconds?: number;
  readySlots: { startedAt: number; readyAt: number }[];
  storedCharges: number;
  inProgressDisplaySlot: SaltHarvestSlotUi | undefined;
  queueGridSlots: SaltHarvestSlotUi[];
  queueGridCapacity: number;
  displayCharges: number;
  availableSaltRakes: number;
};

type Props = {
  saltNode: SaltNode;
  gameState: GameState;
  saltRakes: Decimal | undefined;
};

/**
 * Derives all UI state for the salt node modal at a given `now`.
 *
 * 1. Computes the charge interval via {@link getSaltChargeGenerationTime} and
 *    syncs the node via {@link syncSaltNode}.
 * 2. Derives `storedCharges` and `displayCharges` from the materialized state.
 * 3. Computes instant-harvest `canStart` / `blockedReason`.
 * 4. Determines `regenerationState` as either `maxed` or `charging`.
 */
export function getSaltModalState({
  saltNode,
  gameState,
  now,
  saltRakes,
}: Props & { now: number }): SaltModalState {
  const interval = getSaltChargeGenerationTime({ gameState });
  const syncOpts = { chargeIntervalMs: interval };
  const syncedNode = syncSaltNode(saltNode, now, syncOpts);
  const storedCharges = getStoredSaltCharges(saltNode, now, syncOpts);
  const displayCharges = storedCharges;
  const readySlots: SaltHarvestSlotUi[] = [];
  const inProgressDisplaySlot = undefined;
  const queueGridSlots: SaltHarvestSlotUi[] = [];
  const queueGridCapacity = 0;
  const availableSaltRakes = Math.max(
    0,
    Math.floor(saltRakes?.toNumber() ?? 0),
  );
  const canStart = storedCharges >= 1 && availableSaltRakes >= 1;

  let blockedReason: TranslationKeys | undefined;
  if (!canStart) {
    if (availableSaltRakes <= 0) {
      blockedReason = "saltHarvest.blockedReason.notEnoughSaltRakes";
    } else if (storedCharges <= 0 && displayCharges <= 0) {
      blockedReason = "saltHarvest.blockedReason.noSaltChargesAvailable";
    }
  }

  const atMaxCharges =
    displayCharges >= MAX_STORED_SALT_CHARGES_PER_NODE ||
    syncedNode.salt.storedCharges >= MAX_STORED_SALT_CHARGES_PER_NODE;
  let regenerationState: SaltRegenerationState = "charging";
  let nextChargeInSeconds: number | undefined;

  if (atMaxCharges) {
    regenerationState = "maxed";
  } else {
    nextChargeInSeconds = getNextSaltChargeInSeconds({
      nextChargeAt: syncedNode.salt.nextChargeAt,
      now,
    });
  }

  return {
    storedCharges,
    displayCharges,
    readySlots,
    inProgressDisplaySlot,
    queueGridSlots,
    queueGridCapacity,
    availableSaltRakes,
    canStart,
    canClaim: false,
    blockedReason,
    primaryAction: canStart ? "start" : "blocked",
    regenerationState,
    nextChargeInSeconds,
  };
}

/** React hook wrapper: calls {@link getSaltModalState} with a live `now` from {@link useNow}. */
export function useSaltModalState({
  saltNode,
  gameState,
  saltRakes,
}: Props): SaltModalState {
  const now = useNow({ live: true });
  return getSaltModalState({ saltNode, gameState, now, saltRakes });
}
