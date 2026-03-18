import Decimal from "decimal.js-light";
import {
  getNextSaltChargeInSeconds,
  getSaltGenerationStartAt,
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SaltNode,
  getStoredSaltCharges,
  syncSaltNode,
} from "features/game/types/salt";
import { useNow } from "lib/utils/hooks/useNow";

export type SaltModalPrimaryAction = "claim" | "start" | "blocked";
export type SaltRegenerationState = "maxed" | "paused" | "charging";

export type SaltModalState = {
  syncedNode: SaltNode;
  storedCharges: number;
  maxStoredCharges: number;
  activeSlots: { startedAt: number; readyAt: number }[];
  readySlots: { startedAt: number; readyAt: number }[];
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
  saltRakes: Decimal | undefined;
  isVip: boolean;
};

export function getSaltModalState({
  saltNode,
  now,
  saltRakes,
  isVip,
}: Props & { now: number }): SaltModalState {
  const syncedNode = syncSaltNode(saltNode, now);
  const storedCharges = getStoredSaltCharges(syncedNode, now);
  const activeSlots = syncedNode.salt.harvesting?.slots ?? [];
  const readySlots = activeSlots.filter((slot) => slot.readyAt <= now);
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
    } else if (storedCharges <= 0) {
      blockedReason = "No salt charges available";
    } else if (availableSaltRakes <= 0) {
      blockedReason = "Not enough Salt Rakes";
    }
  }

  const pauseUntil = syncedNode.salt.harvesting?.regenerationPausedUntil;
  const generationStartAt = getSaltGenerationStartAt({
    lastUpdatedAt: syncedNode.salt.lastUpdatedAt,
    regenerationPausedUntil: pauseUntil,
  });
  const atMaxCharges = storedCharges >= MAX_STORED_SALT_CHARGES_PER_NODE;

  let regenerationState: SaltRegenerationState = "charging";
  let pauseRemainingSeconds: number | undefined;
  let nextChargeInSeconds: number | undefined;

  if (atMaxCharges) {
    regenerationState = "maxed";
  } else if (pauseUntil && now < pauseUntil) {
    regenerationState = "paused";
    pauseRemainingSeconds = Math.ceil((pauseUntil - now) / 1000);
  } else {
    nextChargeInSeconds = getNextSaltChargeInSeconds({
      generationStartAt,
      now,
    });
  }

  return {
    syncedNode,
    storedCharges,
    maxStoredCharges: MAX_STORED_SALT_CHARGES_PER_NODE,
    activeSlots,
    readySlots,
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

export function useSaltModalState({
  saltNode,
  saltRakes,
  isVip,
}: Props): SaltModalState {
  const now = useNow({ live: true });
  return getSaltModalState({ saltNode, now, saltRakes, isVip });
}
