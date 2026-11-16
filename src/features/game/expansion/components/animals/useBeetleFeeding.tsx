import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { Animal } from "features/game/types/game";
import type { BeetleName } from "features/game/types/beetles";
import { getFeedBatchSize } from "features/game/events/landExpansion/feedAnimal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { getBeetleLevelGain } from "./beetleFeeding";

const _game = (state: MachineState) => state.context.state;
const _inventory = (state: MachineState) => state.context.state.inventory;

export type PendingBeetleBatch = {
  feeds: number;
  /** Levels and produce cycles the player is asked to approve. */
  levels: number;
  cycles: number;
  /** The Beetle the batch was calculated for, so switching Beetles while the
   * dialog is open can't feed a different one with the old count. */
  beetle: BeetleName;
};

/**
 * Beetle feeding mode, shared by the Chicken, Cow, Sheep and Pig: the batch a
 * tap would feed, the confirmation for batches that overshoot, and reopening
 * the building's picker when the last owned Beetle is fed.
 */
export function useBeetleFeeding({
  animal,
  animalName,
  beetle,
  hasGoldenAsset,
  feed,
  onBeetlesEmpty,
  showNoFoodPrompt,
}: {
  animal: Animal;
  /** The translated animal name for the confirmation copy. */
  animalName: string;
  /** The Beetle the building's mode is set to, if any. */
  beetle?: BeetleName;
  /** A golden asset feeds this animal for free, so Beetle mode stays off. */
  hasGoldenAsset: boolean;
  /** The component's own feed sender; returns the updated machine state. */
  feed: (item: BeetleName, feeds: number) => MachineState;
  /** Opens the building's picker when the selected Beetle runs out. */
  onBeetlesEmpty?: () => void;
  /** Shown when no Beetle is selected and the building has no picker hook. */
  showNoFoodPrompt: () => Promise<void>;
}) {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const game = useSelector(gameService, _game);
  const inventory = useSelector(gameService, _inventory);
  // A batch that overshoots several levels (or produce cycles, at max level)
  // waits here for the player's confirmation before any Beetle is spent.
  const [pendingBatch, setPendingBatch] = useState<PendingBeetleBatch>();

  const beetleMode = beetle && !hasGoldenAsset ? beetle : undefined;
  const beetleFeeds = beetleMode
    ? getFeedBatchSize({ state: game, animal, food: beetleMode })
    : 0;

  const feedAndReopen = (beetle: BeetleName, feeds: number) => {
    const updatedState = feed(beetle, feeds);
    // Feeding the last owned Beetle reopens the picker so another kind can
    // take over without a wasted tap.
    if (
      (updatedState.context.state.inventory[beetle] ?? new Decimal(0)).lt(1)
    ) {
      onBeetlesEmpty?.();
    }
  };

  /**
   * Handles a tap in Beetle mode. Returns true when the tap was consumed
   * (feeding, confirming or opening the picker) and false when Beetle mode
   * is off and the component's regular feeding flow should run.
   */
  const handleBeetleClick = async (): Promise<boolean> => {
    if (!beetleMode) return false;

    const owned = inventory[beetleMode] ?? new Decimal(0);
    if (owned.lt(1)) {
      // Running dry opens the building's picker so another Beetle kind can
      // take over; without that hook, fall back to the no-food popover.
      if (onBeetlesEmpty) {
        onBeetlesEmpty();
      } else {
        await showNoFoodPrompt();
      }
      return true;
    }

    // As many as get it ready, or all the player has if that is fewer.
    const feeds = Math.min(beetleFeeds, owned.toNumber());

    // Overshooting several levels at once is a big spend: confirm first.
    const { levels, cycles } = getBeetleLevelGain({
      state: game,
      animal,
      beetle: beetleMode,
      feeds,
    });
    if (levels + cycles > 1) {
      setPendingBatch({ feeds, levels, cycles, beetle: beetleMode });
      return true;
    }

    feedAndReopen(beetleMode, feeds);
    return true;
  };

  // The wording the batch deserves: levels only, cycles only (at max level),
  // or both when a batch reaches max and keeps blasting through cycles.
  const batch = pendingBatch;
  const messageKey =
    batch?.levels === 0
      ? "animals.beetleMode.maxLevel"
      : batch && batch.cycles > 0
        ? "animals.beetleMode.mixedLevel"
        : "animals.beetleMode.multiLevel";

  const confirmModal = (
    <ConfirmationModal
      show={batch !== undefined}
      onHide={() => setPendingBatch(undefined)}
      onCancel={() => setPendingBatch(undefined)}
      confirmButtonLabel={t("confirm")}
      messages={[
        t(messageKey, {
          animal: animalName,
          levels: batch?.levels ?? 0,
          cycles: batch?.cycles ?? 0,
        }),
      ]}
      onConfirm={() => {
        const confirmed = batch;
        setPendingBatch(undefined);
        if (!confirmed) return;
        // The stored Beetle is fed even if the mode changed while the
        // dialog was up; skip when the batch is no longer affordable.
        const owned = inventory[confirmed.beetle] ?? new Decimal(0);
        if (owned.gte(confirmed.feeds)) {
          feedAndReopen(confirmed.beetle, confirmed.feeds);
        }
      }}
    />
  );

  return { beetleMode, beetleFeeds, handleBeetleClick, confirmModal };
}
