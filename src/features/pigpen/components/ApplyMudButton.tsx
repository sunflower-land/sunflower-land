import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getPigsNeedingMud } from "features/game/events/landExpansion/bulkApplyMud";
import { getAnimalHarvests } from "features/game/events/landExpansion/applyAnimalFeedBuff";
import {
  MUD_PER_APPLICATION,
  MUD_XP_MULTIPLIER,
} from "features/game/lib/animals";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";
import { useNow } from "lib/utils/hooks/useNow";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { Checkbox } from "components/ui/Checkbox";
import { RequirementLabel } from "components/ui/RequirementsLabel";

const SKIP_CONFIRM_KEY = "pigs.applyMud.skipConfirm";

const hasSkippedConfirm = () => {
  try {
    return !!localStorage.getItem(SKIP_CONFIRM_KEY);
  } catch {
    return false;
  }
};

const skipConfirm = () => {
  try {
    localStorage.setItem(SKIP_CONFIRM_KEY, new Date().toISOString());
  } catch {
    // Without storage the confirmation simply keeps showing.
  }
};

const canApplyMud = (game: GameState, now: number) =>
  (game.inventory.Mud ?? new Decimal(0)).gte(MUD_PER_APPLICATION) &&
  getPigsNeedingMud(game, now).length > 0;

/**
 * Building-level Apply Mud: muds every Pig that needs it, as far as the Mud
 * goes. Greyed out (like FeedAllButton) when there is no Mud or no Pig to mud.
 * The first clicks open a confirmation that explains Mud and its cost, until
 * the player ticks "Don't ask again".
 */
export const ApplyMudButton: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  // A sleeping Pig's love window opens on its own, which can leave no Pig the
  // Mud may go on, so re-check every second.
  const now = useNow({ live: true, intervalMs: 1000 });
  // Boolean, so the button re-renders only when it flips between states.
  const enabled = useSelector(gameService, (state: MachineState) =>
    canApplyMud(state.context.state, now),
  );
  const { play: playFeedAnimal } = useSound("feed_animal");
  const [showConfirm, setShowConfirm] = useState(false);

  /** Sends the bulk Mud event; returns whether it went through. */
  const applyMud = (): boolean => {
    // Re-check the live snapshot: a double-tap can land before React
    // re-renders after the first click spent the Mud.
    if (!canApplyMud(gameService.getSnapshot().context.state, now)) {
      return false;
    }

    gameService.send({ type: "pigs.bulkMudApplied" });
    playFeedAnimal();
    return true;
  };

  const handleClick = () => {
    if (!enabled) return;

    if (hasSkippedConfirm()) {
      applyMud();
      return;
    }

    setShowConfirm(true);
  };

  return (
    <>
      <button
        type="button"
        aria-label={t("pigs.applyMud")}
        className={classNames("relative z-10 border-0 bg-transparent p-0", {
          "cursor-pointer hover:img-highlight": enabled,
          "opacity-60": !enabled,
        })}
        // The white round-button disc, icon centred with a lightning corner
        // badge - the same frame as the pet house's feed-all button.
        style={{ width: `${PIXEL_SCALE * 18}px` }}
        onClick={handleClick}
      >
        <img className="block w-full" src={SUNNYSIDE.icons.disc} alt="" />
        <img
          src={ITEM_DETAILS.Mud.image}
          alt=""
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: `${PIXEL_SCALE * 10}px` }}
        />
        <img
          src={SUNNYSIDE.icons.lightning}
          alt=""
          className={classNames(
            "absolute -top-0.5 -right-0.5 pointer-events-none",
            { "animate-pulsate img-highlight": enabled },
          )}
          style={{ width: `${PIXEL_SCALE * 6}px` }}
        />
      </button>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <ApplyMudConfirm
          now={now}
          onClose={() => setShowConfirm(false)}
          onConfirm={(dontAskAgain) => {
            setShowConfirm(false);
            // Only remember the choice once the Mud was actually applied.
            if (applyMud() && dontAskAgain) skipConfirm();
          }}
        />
      </Modal>
    </>
  );
};

const ApplyMudConfirm: React.FC<{
  now: number;
  onClose: () => void;
  onConfirm: (dontAskAgain: boolean) => void;
}> = ({ now, onClose, onConfirm }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const game = useSelector(gameService, (state) => state.context.state);
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const mud = game.inventory.Mud ?? new Decimal(0);
  const pigsNeedingMud = getPigsNeedingMud(game, now).length;
  // The bulk event muds as many Pigs as the Mud covers, oldest first.
  const pigsToMud = Math.min(
    pigsNeedingMud,
    mud.dividedToIntegerBy(MUD_PER_APPLICATION).toNumber(),
  );
  const { harvests } = getAnimalHarvests(game);

  return (
    <Panel>
      <div className="flex flex-col gap-2 p-1">
        <Label type="default" icon={ITEM_DETAILS.Mud.image}>
          {t("pigs.applyMud.title")}
        </Label>
        <p className="text-sm">
          {t("pigs.applyMud.description", {
            percent: Math.round((MUD_XP_MULTIPLIER - 1) * 100),
            harvests,
          })}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Label type="default" icon={ITEM_DETAILS.Pig.image}>
            {t("pigs.applyMud.pigs", { amount: pigsToMud })}
          </Label>
          <RequirementLabel
            type="item"
            item="Mud"
            balance={mud}
            requirement={new Decimal(pigsToMud * MUD_PER_APPLICATION)}
          />
        </div>
        {pigsToMud < pigsNeedingMud && (
          <p className="text-xs">
            {t("pigs.applyMud.notEnough", { total: pigsNeedingMud })}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs">
          <Checkbox
            checked={dontAskAgain}
            onChange={setDontAskAgain}
            aria-label={t("pigs.applyMud.dontAskAgain")}
          />
          <span
            className="cursor-pointer"
            onClick={() => setDontAskAgain((prev) => !prev)}
          >
            {t("pigs.applyMud.dontAskAgain")}
          </span>
        </div>
      </div>
      <div className="flex space-x-1">
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button
          disabled={pigsToMud < 1}
          onClick={() => onConfirm(dontAskAgain)}
        >
          {t("pigs.applyMud.confirm")}
        </Button>
      </div>
    </Panel>
  );
};
