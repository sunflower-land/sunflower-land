import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Navigate, useNavigate } from "react-router";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";
import { useNow } from "lib/utils/hooks/useNow";
import {
  CAVE_MACHINE_SIZE,
  CAVE_PATCH_SIZE,
  CAVE_ROOM_TOP_Y,
  CAVE_SLOTS,
  caveSlotsForTier,
  getCaveRoomBounds,
} from "features/game/expansion/placeable/lib/caveLayout";
import { isCavePatchCleared } from "features/game/types/caveRecipes";
import { getNextCaveTier } from "features/game/types/caveTiers";
import { ITEM_DETAILS } from "features/game/types/images";
import { secondsToString } from "lib/utils/time";
import { CaveMachineModal } from "./components/CaveMachineModal";
import { CaveExpansionModal } from "./components/CaveExpansionModal";
import { CavePatch } from "./components/CavePatch";
import { Hud } from "features/island/hud/Hud";

const _cave = (state: MachineState) => state.context.state.cave;
const _hasCaveAccess = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "CAVE");
const _shovels = (state: MachineState) =>
  state.context.state.inventory["Sand Shovel"]?.toNumber() ?? 0;
const _drills = (state: MachineState) =>
  state.context.state.inventory["Sand Drill"]?.toNumber() ?? 0;

/**
 * The Cave interior room, mounted at `/cave`. Placeholder art for now — the
 * art team supplies a room image per tier size later. Renders the unlocked
 * slots (Tier I = slot 1): each Myco-Composter machine above its own 5x5
 * digging patch. Clicking a machine opens the batch popover; a ready patch is
 * dug tile by tile with the Sand Shovel, or a 2x2 square at a time with the
 * Sand Drill when it is the selected item. The next tier's slot shows an
 * expansion sign: expand, wait out the construction (or finish it with Gems),
 * then click the finished site to open the new slot. The ladder (top-left)
 * leaves the Cave.
 */
export const Cave: React.FC = () => {
  const { gameService } = useContext(Context);
  const navigate = useNavigate();
  const { t } = useAppTranslation();

  const cave = useSelector(gameService, _cave);
  const hasCaveAccess = useSelector(gameService, _hasCaveAccess);
  const shovels = useSelector(gameService, _shovels);
  const drills = useSelector(gameService, _drills);
  const now = useNow({ live: true });
  const [selectedMachine, setSelectedMachine] = useState<string>();
  const [showExpansion, setShowExpansion] = useState(false);

  // Reached by URL without access or without a Cave built — send the player
  // back to the farm.
  if (!hasCaveAccess || !cave) {
    return <Navigate to="/" replace />;
  }

  const bounds = getCaveRoomBounds(cave.tier);
  const roomWidthPx = bounds.width * GRID_WIDTH_PX;
  const roomHeightPx = bounds.height * GRID_WIDTH_PX;

  // A tile (x, y) is the item's TOP-LEFT tile with y counting up to the room's
  // top wall at CAVE_ROOM_TOP_Y. Convert to CSS pixel offsets.
  const leftPx = (x: number) => x * GRID_WIDTH_PX;
  const topPx = (y: number) => (CAVE_ROOM_TOP_Y - y) * GRID_WIDTH_PX;

  const slots = caveSlotsForTier(cave.tier).filter((id) => CAVE_SLOTS[id]);

  // The slot the next tier opens, and its construction (if started).
  const nextTier = getNextCaveTier(cave.tier);
  const nextSlot = nextTier ? CAVE_SLOTS[nextTier] : undefined;
  const construction = cave.construction;
  const constructionReady = !!construction && construction.readyAt <= now;

  return (
    <div className="absolute inset-0 bg-[#181425] overflow-hidden">
      {/* Scrolls when the room outgrows the screen; `m-auto` centres it
          otherwise. */}
      <div className="absolute inset-0 flex overflow-auto">
        <div
          className="relative m-auto shrink-0"
          style={{
            width: `${roomWidthPx}px`,
            height: `${roomHeightPx}px`,
            imageRendering: "pixelated",
          }}
        >
          {/* Placeholder room floor until the art team supplies the room image. */}
          <div className="absolute inset-0 bg-[#3a2a3f] border-4 border-[#241521] rounded-sm" />

          {/* Ladder (exit) top-left. Native button so keyboard users can leave. */}
          <button
            type="button"
            className="absolute cursor-pointer flex flex-col items-center bg-transparent border-0 p-0"
            style={{
              left: `${leftPx(0)}px`,
              top: `${topPx(CAVE_ROOM_TOP_Y)}px`,
            }}
            onClick={() => navigate("/")}
          >
            <img
              src={SUNNYSIDE.icons.arrow_up}
              style={{ width: `${PIXEL_SCALE * 11}px` }}
            />
            <span className="text-white text-xxs">{t("exit")}</span>
          </button>

          {/* Sand Shovels left to dig with. */}
          <div className="absolute top-1 right-1">
            <Label
              type={shovels > 0 ? "default" : "danger"}
              icon={ITEM_DETAILS["Sand Shovel"].image}
            >
              {shovels}
            </Label>
          </div>

          {slots.map((id) => {
            const slot = CAVE_SLOTS[id];
            const batch = cave.machines[String(id)]?.batch;
            const growing = !!batch && batch.readyAt > now;
            const ready =
              !!batch && batch.readyAt <= now && !isCavePatchCleared(batch);

            return (
              <React.Fragment key={`slot-${id}`}>
                {/* Myco-Composter machine (placeholder) — opens the batch popover. */}
                <button
                  type="button"
                  className="absolute cursor-pointer bg-[#6d5a3f] border border-[#3a2f22] flex items-center justify-center p-0"
                  style={{
                    left: `${leftPx(slot.machine.x)}px`,
                    top: `${topPx(slot.machine.y)}px`,
                    width: `${CAVE_MACHINE_SIZE.width * GRID_WIDTH_PX}px`,
                    height: `${CAVE_MACHINE_SIZE.height * GRID_WIDTH_PX}px`,
                  }}
                  onClick={() => setSelectedMachine(String(id))}
                >
                  <Label
                    type={growing ? "warning" : ready ? "success" : "default"}
                  >
                    {t("cave.machine", { id })}
                  </Label>
                </button>

                {/* 5x5 digging patch. */}
                <div
                  className="absolute"
                  style={{
                    left: `${leftPx(slot.patch.x)}px`,
                    top: `${topPx(slot.patch.y)}px`,
                    width: `${CAVE_PATCH_SIZE * GRID_WIDTH_PX}px`,
                    height: `${CAVE_PATCH_SIZE * GRID_WIDTH_PX}px`,
                  }}
                >
                  <CavePatch
                    machineId={String(id)}
                    batch={batch}
                    now={now}
                    hasShovel={shovels > 0}
                    hasDrill={drills > 0}
                  />
                </div>
              </React.Fragment>
            );
          })}

          {/* The next tier's site: an expansion sign, then its construction. */}
          {nextSlot && (
            <>
              {construction && (
                <div
                  className="absolute border-2 border-dashed border-[#6d5a3f] bg-[#241521]/60 pointer-events-none"
                  style={{
                    left: `${leftPx(nextSlot.patch.x)}px`,
                    top: `${topPx(nextSlot.patch.y)}px`,
                    width: `${CAVE_PATCH_SIZE * GRID_WIDTH_PX}px`,
                    height: `${CAVE_PATCH_SIZE * GRID_WIDTH_PX}px`,
                  }}
                />
              )}
              <button
                type="button"
                className="absolute cursor-pointer bg-transparent border-0 p-0 flex flex-col items-center justify-center"
                style={{
                  left: `${leftPx(nextSlot.machine.x)}px`,
                  top: `${topPx(nextSlot.machine.y)}px`,
                  width: `${CAVE_MACHINE_SIZE.width * GRID_WIDTH_PX}px`,
                  height: `${CAVE_MACHINE_SIZE.height * GRID_WIDTH_PX}px`,
                }}
                onClick={() => {
                  if (constructionReady) {
                    gameService.send({ type: "cave.expansionCompleted" });
                  } else {
                    setShowExpansion(true);
                  }
                }}
              >
                {!construction && (
                  <Label type="default" icon={SUNNYSIDE.icons.expand}>
                    {t("cave.expand.expand")}
                  </Label>
                )}
                {construction && !constructionReady && (
                  <Label type="warning" icon={SUNNYSIDE.icons.hammer}>
                    {secondsToString(
                      Math.max(0, (construction.readyAt - now) / 1000),
                      { length: "short" },
                    )}
                  </Label>
                )}
                {constructionReady && (
                  <Label type="success" icon={SUNNYSIDE.icons.hammer}>
                    {t("cave.expand.ready")}
                  </Label>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {showExpansion && (
        <CaveExpansionModal onClose={() => setShowExpansion(false)} />
      )}

      {selectedMachine && (
        <CaveMachineModal
          machineId={selectedMachine}
          onClose={() => setSelectedMachine(undefined)}
        />
      )}

      {/* Same HUD as the other interiors (barn, greenhouse, …): the travel slot
          becomes a "back to farm" button for non-farm locations. */}
      <Hud isFarming={false} location="home" />
    </div>
  );
};
