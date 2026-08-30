import { InnerPanel } from "components/ui/Panel";
import { getBudImage } from "lib/buds/types";
import type { OverlapMenuRequest } from "../bridge/GameBridge";
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useSyncExternalStore,
} from "react";
import { useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import flipIcon from "assets/icons/flip.webp";
import pixelPerfectIcon from "assets/icons/pixel_perfect.webp";
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

/** [MovableComponent] same-tile disambiguation picker. */
const OverlapMenu: React.FC<{ bridge: GameBridge }> = ({ bridge }) => {
  const [request, setRequest] = useState<OverlapMenuRequest>(
    bridge.overlapMenu.get(),
  );
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => bridge.overlapMenu.subscribe(setRequest), [bridge]);
  useEffect(() => {
    if (!request) return;
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        bridge.overlapMenu.set(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [request, bridge]);
  const rect = useWorldAnchor(request?.anchorId ?? "landscaping-overlap");
  if (!request || !rect?.visible) return null;

  return (
    <div
      ref={ref}
      className="absolute pointer-events-auto z-20"
      style={{
        left: `${rect.left + rect.width}px`,
        top: `${rect.top - 12 * 2.625}px`,
        minWidth: `${60 * 2.625}px`,
      }}
    >
      <InnerPanel>
        {request.choices.map((choice) => {
          const image =
            choice.name === "Bud"
              ? getBudImage(Number(choice.id))
              : ((ITEM_DETAILS as Partial<Record<string, { image: string }>>)[
                  choice.name
                ]?.image ?? SUNNYSIDE.icons.expression_confused);
          return (
            <div
              key={`${choice.name}-${choice.id}`}
              className="flex items-center gap-2 p-1 cursor-pointer hover:bg-brown-200"
              onClick={() => {
                bridge.landscaping.send({
                  type: "MOVE",
                  name: choice.name as never,
                  id: choice.id,
                });
                bridge.overlapMenu.set(null);
              }}
            >
              <img src={image} style={{ maxWidth: 20, maxHeight: 20 }} />
              <span className="text-xs">{choice.name}</span>
            </div>
          );
        })}
      </InnerPanel>
    </div>
  );
};

export const LandscapingUI: React.FC<{ bridge: GameBridge }> = ({ bridge }) => {
  return (
    <>
      <OverlapMenu bridge={bridge} />
      <SelectionDiscs bridge={bridge} />
    </>
  );
};

const SelectionDiscs: React.FC<{ bridge: GameBridge }> = ({ bridge }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const landscaping = useSelector(gameService, _landscaping);
  const rect = useWorldAnchor(SELECTION_ANCHOR);

  const controls = useSyncExternalStore(
    (onChange) => bridge.landscapingControls.subscribe(onChange),
    () => bridge.landscapingControls.get(),
  );
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
    active = false,
  ): React.ReactElement => (
    <div
      className={`relative cursor-pointer hover:img-highlight mr-2 ${
        active ? "img-highlight" : ""
      }`}
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

  const arrow = (
    icon: string,
    dx: number,
    dy: number,
    style: React.CSSProperties,
  ) => (
    <img
      src={icon}
      className="absolute cursor-pointer hover:img-highlight z-50 pointer-events-auto"
      style={{ width: `${PIXEL_SCALE * 9}px`, ...style }}
      onPointerDown={(event) => {
        event.stopPropagation();
        event.preventDefault();
        controls?.nudge(dx, dy);
      }}
    />
  );

  return (
    <>
      {/* [MovableComponent] the four nudge arrows, hidden once maxed out */}
      {controls?.pixelPerfect && (
        <div
          className="absolute z-50"
          style={{
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
          }}
        >
          {controls.canNudge.up &&
            arrow(SUNNYSIDE.icons.arrow_up, 0, 1, {
              left: "50%",
              top: `${-PIXEL_SCALE * 10}px`,
              transform: "translateX(-50%)",
            })}
          {controls.canNudge.down &&
            arrow(SUNNYSIDE.icons.arrow_down, 0, -1, {
              left: "50%",
              bottom: `${-PIXEL_SCALE * 10}px`,
              transform: "translateX(-50%)",
            })}
          {controls.canNudge.left &&
            arrow(SUNNYSIDE.icons.arrow_left, -1, 0, {
              top: "50%",
              left: `${-PIXEL_SCALE * 10}px`,
              transform: "translateY(-50%)",
            })}
          {controls.canNudge.right &&
            arrow(SUNNYSIDE.icons.arrow_right, 1, 0, {
              top: "50%",
              right: `${-PIXEL_SCALE * 10}px`,
              transform: "translateY(-50%)",
            })}
        </div>
      )}
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
        {/* [MovableComponent] pixel-perfect toggle */}
        {controls &&
          disc(
            pixelPerfectIcon,
            () => controls.togglePixelPerfect(),
            12,
            controls.pixelPerfect,
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
              // [MovableComponent] side-effect warnings for these two items.
              if (
                moving.name === "Kuebiko" ||
                moving.name === "Hungry Caterpillar"
              ) {
                bridge.farmModal.open("removeWarning", {
                  name: moving.name,
                  id: moving.id,
                  action: removeAction,
                });
                setConfirmRemove(false);
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
    </>
  );
};
