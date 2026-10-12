import React, { useContext } from "react";
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
import { MUD_PER_APPLICATION } from "features/game/lib/animals";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";
import { useNow } from "lib/utils/hooks/useNow";

const canApplyMud = (game: GameState, now: number) =>
  (game.inventory.Mud ?? new Decimal(0)).gte(MUD_PER_APPLICATION) &&
  getPigsNeedingMud(game, now).length > 0;

/**
 * Building-level Apply Mud: muds every Pig that needs it, as far as the Mud
 * goes. Greyed out (like FeedAllButton) when there is no Mud or no Pig to mud.
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

  const handleClick = () => {
    // Re-check the live snapshot: a double-tap can land before React
    // re-renders after the first click spent the Mud.
    if (!canApplyMud(gameService.getSnapshot().context.state, now)) return;

    gameService.send({ type: "pigs.bulkMudApplied" });
    playFeedAnimal();
  };

  return (
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
  );
};
