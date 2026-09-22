import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { Navigate, useNavigate } from "react-router";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import {
  CAVE_MACHINE_SIZE,
  CAVE_PATCH_SIZE,
  CAVE_ROOM_BOUNDS,
  CAVE_SLOTS,
  caveSlotsForTier,
} from "features/game/expansion/placeable/lib/caveLayout";

const _cave = (state: MachineState) => state.context.state.cave;

/**
 * The Cave interior room, mounted at `/cave`. Placeholder art for now — the
 * art team supplies a room image per tier size later. Renders the unlocked
 * slots (Tier I = slot 1): each Myco-Composter machine idle above its own
 * empty 5x5 digging patch. The ladder (top-left) leaves the Cave.
 *
 * Digging, batches and the merchant arrive in later slices.
 */
export const Cave: React.FC = () => {
  const { gameService } = useContext(Context);
  const navigate = useNavigate();

  const cave = useSelector(gameService, _cave);

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

        {/* Ladder (exit) top-left. */}
        <div
          className="absolute cursor-pointer flex flex-col items-center"
          style={{ left: `${leftPx(0)}px`, top: `${topPx(bounds.height)}px` }}
          onClick={() => navigate("/")}
        >
          <img
            src={SUNNYSIDE.icons.arrow_up}
            style={{ width: `${PIXEL_SCALE * 11}px` }}
          />
          <span className="text-white text-xxs">{"Exit"}</span>
        </div>

        {slots.map((id) => {
          const slot = CAVE_SLOTS[id];
          return (
            <React.Fragment key={`slot-${id}`}>
              {/* Myco-Composter machine (placeholder). */}
              <div
                className="absolute bg-[#6d5a3f] border border-[#3a2f22] flex items-center justify-center"
                style={{
                  left: `${leftPx(slot.machine.x)}px`,
                  top: `${topPx(slot.machine.y)}px`,
                  width: `${CAVE_MACHINE_SIZE.width * GRID_WIDTH_PX}px`,
                  height: `${CAVE_MACHINE_SIZE.height * GRID_WIDTH_PX}px`,
                }}
              >
                <Label type="default">{`Machine ${id}`}</Label>
              </div>

              {/* Empty 5x5 digging patch. */}
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
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
