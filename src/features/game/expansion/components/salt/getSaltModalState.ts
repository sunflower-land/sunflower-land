import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";
import {
  getDisplaySaltCharges,
  getNextSaltChargeInSeconds,
  getSaltChargeGenerationTime,
  SaltNode,
  getStoredSaltCharges,
  syncSaltNode,
} from "features/game/types/salt";
import { getMaxStoredSaltCharges } from "features/game/types/saltSculpture";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { useNow } from "lib/utils/hooks/useNow";

export type SaltRegenerationState = "maxed" | "charging";

export type SaltModalState = {
  canHarvest: boolean;
  blockedReason?: TranslationKeys;
  regenerationState: SaltRegenerationState;
  nextChargeInSeconds?: number;
  storedCharges: number;
  displayCharges: number;
  availableSaltRakes: number;
  maxCharges: number;
};

type Props = {
  saltNode: SaltNode;
  gameState: GameState;
  saltRakes: Decimal | undefined;
};

export function getSaltModalState({
  saltNode,
  gameState,
  now,
  saltRakes,
}: Props & { now: number }): SaltModalState {
  const interval = getSaltChargeGenerationTime({ gameState });
  const maxCharges = getMaxStoredSaltCharges(
    gameState.sculptures?.["Salt Sculpture"]?.level ?? 0,
  );
  const syncOpts = { chargeIntervalMs: interval, maxCharges };
  const syncedNode = syncSaltNode(saltNode, now, syncOpts);
  const storedCharges = getStoredSaltCharges(saltNode, now, syncOpts);
  const displayCharges = getDisplaySaltCharges(saltNode, now, syncOpts);
  const availableSaltRakes = Math.max(
    0,
    Math.floor(saltRakes?.toNumber() ?? 0),
  );

  const canHarvest = storedCharges >= 1 && availableSaltRakes >= 1;

  let blockedReason: TranslationKeys | undefined;
  if (!canHarvest) {
    if (availableSaltRakes <= 0) {
      blockedReason = "saltHarvest.blockedReason.notEnoughSaltRakes";
    } else if (storedCharges <= 0) {
      blockedReason = "saltHarvest.blockedReason.noSaltChargesAvailable";
    }
  }

  const atMaxCharges = displayCharges >= maxCharges;
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
    availableSaltRakes,
    canHarvest,
    blockedReason,
    regenerationState,
    nextChargeInSeconds,
    maxCharges,
  };
}

export function useSaltModalState({
  saltNode,
  gameState,
  saltRakes,
}: Props): SaltModalState {
  const now = useNow({ live: true });
  return getSaltModalState({ saltNode, gameState, now, saltRakes });
}
