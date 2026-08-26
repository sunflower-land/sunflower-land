import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "@xstate/react";

import { TimerPopover } from "features/island/common/TimerPopover";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { CropPlot, GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { CROP_COMPOST } from "features/game/types/composters";
import {
  getCropFertiliserWindows,
  getCropPlotBoostWindows,
} from "features/game/lib/boostWindows";
import { useNodeTimer } from "features/game/lib/useNodeTimer";
import { getHarvestMetrics } from "features/island/plots/components/FertilePlot";
import type { GameBridge, HoveredEntity } from "../bridge/GameBridge";
import { cropAnchorId } from "../entities/crops/CropRenderer";
import { useWorldAnchor } from "../bridge/useWorldAnchor";

/**
 * The hover TimerPopover for growing crops — the only crop UI left in React
 * (game-layer content lives in CropRenderer). Positioned over the Phaser
 * plots via their per-plot anchors; the inner div is scaled by the user zoom
 * so the DOM component keeps its native PIXEL_SCALE sizing.
 */

const TILE_CSS = 16 * PIXEL_SCALE;

const _state = (state: MachineState) => state.context.state;

/** Anchor-scaled wrapper: children lay out in DOM CSS px over one tile. */
const PlotAnchored: React.FC<
  React.PropsWithChildren<{ id: string; pointerEvents?: boolean }>
> = ({ id, pointerEvents = false, children }) => {
  const rect = useWorldAnchor(cropAnchorId(id));
  if (!rect || !rect.visible) return null;

  return (
    <div
      className={`absolute ${pointerEvents ? "pointer-events-auto" : "pointer-events-none"}`}
      style={{
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: 0,
        height: 0,
        transform: `scale(${rect.width / TILE_CSS})`,
        transformOrigin: "0 0",
      }}
    >
      <div
        className="absolute"
        style={{ width: `${TILE_CSS}px`, height: `${TILE_CSS}px` }}
      >
        {children}
      </div>
    </div>
  );
};

const PlotStatus: React.FC<{
  id: string;
  plot: CropPlot;
  game: GameState;
  hovered: boolean;
}> = ({ id, plot, game, hovered }) => {
  const { selectedItem } = useContext(Context);
  const crop = plot.crop;
  const fertiliser = plot.fertiliser;

  const windows = useMemo(
    () => [
      ...getCropPlotBoostWindows(game),
      ...getCropFertiliserWindows(fertiliser),
    ],
    [game, fertiliser],
  );

  const metrics = useMemo(
    () =>
      getHarvestMetrics({
        cropName: crop?.name,
        plot,
        plantedAt: crop?.plantedAt,
        boostWindows: windows,
      }),
    [crop, plot, windows],
  );

  const { now, speed, displaySeconds } = useNodeTimer({
    startedAt: metrics.startAt,
    baseDurationMs: metrics.baseDurationMs,
    windows,
    legacyReadyAt: metrics.readyAt,
    live: metrics.readyAt > 0,
  });

  if (!crop) return null;

  const isGrowing = metrics.harvestSeconds > 0 && metrics.readyAt > now;
  if (!isGrowing) return null;

  const isApplyingFertiliser =
    !!selectedItem && selectedItem in CROP_COMPOST && !fertiliser;

  return (
    <PlotAnchored id={id}>
      {hovered && !isApplyingFertiliser && (
        <div
          className="flex justify-center absolute w-full"
          style={{ top: `${PIXEL_SCALE * -18}px` }}
        >
          <TimerPopover
            image={ITEM_DETAILS[crop.name].image}
            description={crop.name}
            showPopover={true}
            timeLeft={displaySeconds}
            speed={speed}
          />
        </div>
      )}
    </PlotAnchored>
  );
};

export const CropsUI: React.FC<{ bridge: GameBridge }> = ({ bridge }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const [hovered, setHovered] = useState<HoveredEntity>(bridge.hover.get());
  useEffect(() => bridge.hover.subscribe(setHovered), [bridge]);

  return (
    <>
      {Object.entries(state.crops).map(([id, plot]) =>
        plot.crop ? (
          <PlotStatus
            key={id}
            id={id}
            plot={plot}
            game={state}
            hovered={hovered?.type === "crop" && hovered.id === id}
          />
        ) : null,
      )}
    </>
  );
};
