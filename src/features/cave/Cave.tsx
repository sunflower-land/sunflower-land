import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Navigate, useNavigate } from "react-router";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { secondsToString } from "lib/utils/time";
import {
  CAVE_MACHINE_SIZE,
  CAVE_PATCH_SIZE,
  CAVE_ROOM_BOUNDS,
  CAVE_SLOTS,
  caveSlotsForTier,
} from "features/game/expansion/placeable/lib/caveLayout";
import { CaveMachineModal } from "./components/CaveMachineModal";
import { CaveHud } from "./components/CaveHud";

const _cave = (state: MachineState) => state.context.state.cave;

/**
 * The Cave interior room, mounted at `/cave`. Placeholder art for now — the
 * art team supplies a room image per tier size later. Renders the unlocked
 * slots (Tier I = slot 1): each Myco-Composter machine above its own 5x5
 * digging patch. Clicking a machine opens the batch popover. A growing patch is
 * covered; a ready one is highlighted (digging arrives in a later slice). The
 * ladder (top-left) leaves the Cave.
 */
export const Cave: React.FC = () => {
  const { gameService } = useContext(Context);
  const navigate = useNavigate();
  const { t } = useAppTranslation();

  const cave = useSelector(gameService, _cave);
  const now = useNow({ live: true });
  const [selectedMachine, setSelectedMachine] = useState<string>();

  // Reached by URL without a Cave built — send the player back to the farm.
  if (!cave) {
    return <Navigate to="/" replace />;
  }

  const bounds = CAVE_ROOM_BOUNDS[cave.tier] ?? CAVE_ROOM_BOUNDS[1]!;
  const roomWidthPx = bounds.width * GRID_WIDTH_PX;
  const roomHeightPx = bounds.height * GRID_WIDTH_PX;

  // A tile (x, y) is the item's TOP-LEFT tile with y measured from the bottom
  // (y = bounds.height is the top row). Convert to CSS pixel offsets.
  const leftPx = (x: number) => x * GRID_WIDTH_PX;
  const topPx = (y: number) => (bounds.height - y) * GRID_WIDTH_PX;

  const slots = caveSlotsForTier(cave.tier).filter((id) => CAVE_SLOTS[id]);

  return (
    <div className="absolute inset-0 bg-[#181425] flex items-center justify-center overflow-hidden">
      <div
        className="relative"
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
          style={{ left: `${leftPx(0)}px`, top: `${topPx(bounds.height)}px` }}
          onClick={() => navigate("/")}
        >
          <img
            src={SUNNYSIDE.icons.arrow_up}
            style={{ width: `${PIXEL_SCALE * 11}px` }}
          />
          <span className="text-white text-xxs">{t("exit")}</span>
        </button>

        {slots.map((id) => {
          const slot = CAVE_SLOTS[id];
          const batch = cave.machines[String(id)]?.batch;
          const growing = !!batch && batch.readyAt > now;
          const ready = !!batch && batch.readyAt <= now;

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

              {/* 5x5 digging patch. Covered while growing; nothing is revealed
                  when ready (the hidden layout never reaches the client). */}
              <div
                className="absolute grid"
                style={{
                  left: `${leftPx(slot.patch.x)}px`,
                  top: `${topPx(slot.patch.y)}px`,
                  width: `${CAVE_PATCH_SIZE * GRID_WIDTH_PX}px`,
                  height: `${CAVE_PATCH_SIZE * GRID_WIDTH_PX}px`,
                  gridTemplateColumns: `repeat(${CAVE_PATCH_SIZE}, 1fr)`,
                  gridTemplateRows: `repeat(${CAVE_PATCH_SIZE}, 1fr)`,
                }}
              >
                {Array.from({ length: CAVE_PATCH_SIZE * CAVE_PATCH_SIZE }).map(
                  (_, i) => (
                    <img
                      key={`tile-${id}-${i}`}
                      src={SUNNYSIDE.soil.sand_dug}
                      className="w-full h-full"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ),
                )}

                {growing && batch && (
                  <div className="absolute inset-0 bg-[#241521]/70 flex flex-col items-center justify-center">
                    <img
                      src={SUNNYSIDE.icons.stopwatch}
                      style={{ width: `${PIXEL_SCALE * 8}px` }}
                    />
                    <span className="text-white text-xxs mt-0.5">
                      {secondsToString(
                        Math.max(0, (batch.readyAt - now) / 1000),
                        { length: "short" },
                      )}
                    </span>
                  </div>
                )}

                {ready && (
                  <div className="absolute inset-0 flex items-start justify-center pt-0.5 pointer-events-none">
                    <Label type="success">{t("cave.batch.ready")}</Label>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {selectedMachine && (
        <CaveMachineModal
          machineId={selectedMachine}
          onClose={() => setSelectedMachine(undefined)}
        />
      )}

      <CaveHud />
    </div>
  );
};
