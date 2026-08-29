import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import flipIcon from "assets/icons/flip.webp";
import flippedIcon from "assets/icons/flipped.webp";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { CollectibleName } from "features/game/types/craftables";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { getRemoveAction } from "features/island/collectibles/MovableComponent";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useNow } from "lib/utils/hooks/useNow";
import type { GameBridge } from "../bridge/GameBridge";
import { useWorldAnchor } from "../bridge/useWorldAnchor";

/**
 * The selected-item disc row in landscaping mode [MovableComponent's flip /
 * remove discs], anchored to the Phaser selection tint. Flip for
 * collectibles/FarmHand/Bumpkin; two-step remove for anything removable.
 *
 * DEFERRED: pixel-perfect mode (disc + nudge arrows + oX/oY commits), the
 * overlap disambiguation menu, Kuebiko/Hungry-Caterpillar warning modals.
 */

const _state = (state: MachineState) => state.context.state;
const _landscaping = (state: MachineState) => state.matches("landscaping");

const SELECTION_ANCHOR = "landscaping-selected";

export const LandscapingUI: React.FC<{ bridge: GameBridge }> = ({ bridge }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const landscaping = useSelector(gameService, _landscaping);
  const rect = useWorldAnchor(SELECTION_ANCHOR);

  const [moving, setMoving] = useState<{ id: string; name: string }>();
  const [confirmRemove, setConfirmRemove] = useState(false);
  const now = useNow();

  // The child machine's context mutates without parent snapshots changing;
  // poll it like the DOM's useSyncExternalStore hooks do. Both writes happen
  // on the interval tick (never synchronously in the effect body).
  useEffect(() => {
    const tick = () => {
      const child = gameService.getSnapshot().children.landscaping as
        | {
            getSnapshot?: () => {
              context?: { moving?: { id: string; name: string } };
            };
          }
        | undefined;
      const next = landscaping
        ? child?.getSnapshot?.()?.context?.moving
        : undefined;
      setMoving((previous) => {
        if (previous?.id === next?.id && previous?.name === next?.name) {
          return previous;
        }
        setConfirmRemove(false);
        return next;
      });
    };
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [landscaping, gameService]);

  if (!landscaping || !moving || !rect?.visible) return null;

  const isCollectible = moving.name in COLLECTIBLES_DIMENSIONS;
  const hasFlip =
    isCollectible || moving.name === "FarmHand" || moving.name === "Bumpkin";
  const collectible = state.collectibles[moving.name as CollectibleName]?.find(
    (item) => item.id === moving.id,
  );
  const removeAction = getRemoveAction(
    moving.name as CollectibleName,
    now,
    collectible,
    "farm",
  );

  const isFlipped = (() => {
    if (moving.name === "Bumpkin") return !!state.bumpkin?.flipped;
    if (moving.name === "FarmHand") {
      return !!state.farmHands.bumpkins?.[moving.id]?.flipped;
    }
    return !!collectible?.flipped;
  })();

  const disc = (
    icon: string,
    onClick: () => void,
    iconWidth: number,
  ): React.ReactElement => (
    <div
      className="relative cursor-pointer hover:img-highlight mr-2"
      style={{
        width: `${PIXEL_SCALE * 18}px`,
        height: `${PIXEL_SCALE * 18}px`,
      }}
      onClick={onClick}
    >
      <img src={SUNNYSIDE.icons.disc} className="absolute inset-0 w-full" />
      <img
        src={icon}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * iconWidth}px`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );

  return (
    <div
      className="absolute flex z-40 pointer-events-auto"
      style={{
        left: `${rect.left + rect.width}px`,
        top: `${rect.top - PIXEL_SCALE * 20}px`,
      }}
    >
      {hasFlip &&
        disc(
          isFlipped ? flippedIcon : flipIcon,
          () =>
            bridge.landscaping.send({
              type: "FLIP",
              id: moving.id,
              name: moving.name as CollectibleName,
              location: "farm",
            }),
          12,
        )}
      {removeAction &&
        disc(
          confirmRemove
            ? SUNNYSIDE.icons.confirm
            : ITEM_DETAILS["Rusty Shovel"].image,
          () => {
            if (!confirmRemove) {
              setConfirmRemove(true);
              return;
            }
            bridge.landscaping.send({
              type: "REMOVE",
              event: removeAction,
              id: moving.id,
              name: moving.name as CollectibleName,
              location: "farm",
            });
            setConfirmRemove(false);
          },
          12,
        )}
    </div>
  );
};
