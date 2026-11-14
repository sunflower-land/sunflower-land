import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { Animal } from "features/game/types/game";
import type { BeetleName } from "features/game/types/beetles";
import { getFeedBatchSize } from "features/game/events/landExpansion/feedAnimal";
import { getAnimalLevel, isMaxLevel } from "features/game/lib/animals";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getBeetleLevelGain } from "./beetleFeeding";

const _game = (state: MachineState) => state.context.state;
const _inventory = (state: MachineState) => state.context.state.inventory;

export type PendingBeetleBatch = {
  feeds: number;
  /** The overshoot count the player is asked to approve (levels, or produce
   * cycles at max level). */
  levels: number;
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
    const levels = getBeetleLevelGain({
      state: game,
      animal,
      beetle: beetleMode,
      feeds,
    });
    if (levels > 1) {
      setPendingBatch({ feeds, levels, beetle: beetleMode });
      return true;
    }

    feedAndReopen(beetleMode, feeds);
    return true;
  };

  const atMaxLevel = isMaxLevel(
    animal.type,
    getAnimalLevel(animal.experience, animal.type),
  );

  const confirmModal = (
    <Modal
      show={pendingBatch !== undefined}
      onHide={() => setPendingBatch(undefined)}
    >
      <CloseButtonPanel
        onClose={() => setPendingBatch(undefined)}
        title={t("animals.beetleMode")}
      >
        <div className="flex flex-col gap-2 p-2">
          <p className="text-xs">
            {t(
              atMaxLevel
                ? "animals.beetleMode.maxLevel"
                : "animals.beetleMode.multiLevel",
              {
                animal: animalName,
                levels: pendingBatch?.levels ?? 0,
              },
            )}
          </p>
          <div className="flex gap-1">
            <Button
              onClick={() => {
                const batch = pendingBatch;
                setPendingBatch(undefined);
                if (!batch) return;
                // The stored Beetle is fed even if the mode changed while the
                // dialog was up; skip when the batch is no longer affordable.
                const owned = inventory[batch.beetle] ?? new Decimal(0);
                if (owned.gte(batch.feeds)) {
                  feedAndReopen(batch.beetle, batch.feeds);
                }
              }}
            >
              {t("confirm")}
            </Button>
            <Button onClick={() => setPendingBatch(undefined)}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      </CloseButtonPanel>
    </Modal>
  );

  return { beetleMode, beetleFeeds, handleBeetleClick, confirmModal };
}
