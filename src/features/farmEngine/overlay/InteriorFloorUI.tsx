import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { HomeExpansionTier } from "features/game/types/game";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { UpgradeButton } from "features/interior/components/UpgradeButton";
import {
  getInteriorExitRoute,
  getInteriorRoute,
} from "features/interior/lib/interiorRoutes";
import { useVisiting } from "lib/utils/visitUtils";
import { WORLD_TILE } from "../core/coordinates";
import type { GameBridge } from "../bridge/GameBridge";
import { useWorldAnchor } from "../bridge/useWorldAnchor";

/**
 * Chrome for the /interior and /level_one floors that stays React
 * [interior/Interior.tsx + LevelOne.tsx]: the beta/no-upgrade empty states,
 * the in-world Upgrade button, and the stairs between floors. The room art
 * and every placement are Phaser.
 */

/** [LevelOne.tsx UPGRADE_POSITIONS] bottom-left tile coords per tier. */
const UPGRADE_POSITIONS: Partial<
  Record<HomeExpansionTier, { x: number; y: number }>
> = {
  "level-one-start": { x: 11, y: 18 },
  "level-one-2": { x: 4, y: 13 },
  "level-one-3": { x: 18, y: 13 },
  "level-one-4": { x: 11.5, y: 7 },
  "level-one-5": { x: 16, y: 6.5 },
  "level-one-6": { x: 7, y: 6.5 },
};

const _landscaping = (state: MachineState) => state.matches("landscaping");
const _island = (state: MachineState) => state.context.state.island;
const _hasAccess = (state: MachineState) =>
  !!state.context.state.settings.interiorsEnabled;
const _expansion = (state: MachineState) =>
  state.context.state.interior.expansion;
const _hasLevelOne = (state: MachineState) =>
  !!state.context.state.interior.level_one;

/** Anchor one world tile-box; children render at its screen position. */
const WorldPinned: React.FC<{
  bridge: GameBridge;
  anchor: string;
  /** Bottom-left-origin canvas-centre tile coords, MapPlacement style. */
  x: number;
  y: number;
  width?: number;
  height?: number;
  children: React.ReactNode;
}> = ({ bridge, anchor, x, y, width = 1, height = 1, children }) => {
  React.useEffect(() => {
    bridge.anchors.setAnchor(anchor, {
      x: x * WORLD_TILE,
      y: -y * WORLD_TILE,
      width: width * WORLD_TILE,
      height: height * WORLD_TILE,
    });
    return () => bridge.anchors.removeAnchor(anchor);
  }, [bridge, anchor, x, y, width, height]);

  const rect = useWorldAnchor(anchor);
  if (!rect?.visible) return null;
  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }}
    >
      {children}
    </div>
  );
};

export const InteriorFloorUI: React.FC<{
  bridge: GameBridge;
  floor: "interior" | "level_one";
}> = ({ bridge, floor }) => {
  const { gameService } = useContext(Context);
  const navigate = useNavigate();
  const { isVisiting, visitedFarmId } = useVisiting();

  const landscaping = useSelector(gameService, _landscaping);
  const island = useSelector(gameService, _island);
  const hasAccess = useSelector(gameService, _hasAccess);
  const expansion = useSelector(gameService, _expansion);
  const hasLevelOne = useSelector(gameService, _hasLevelOne);

  // [Interior.tsx] beta empty-state.
  if (!hasAccess) {
    return (
      <EmptyState
        line1={"Home interiors aren't available yet."}
        line2={"This feature is in beta. Check back soon."}
        button={"Back to farm"}
        onClick={() => navigate(getInteriorExitRoute({ visitedFarmId }))}
      />
    );
  }

  // [LevelOne.tsx] first-upgrade empty-state.
  if (floor === "level_one" && (!hasLevelOne || !expansion)) {
    return (
      <EmptyState
        line1={
          isVisiting
            ? "This farm hasn't unlocked level one yet."
            : "You haven't unlocked level one yet."
        }
        line2={
          isVisiting
            ? undefined
            : "Visit your interior on volcano island to buy the first upgrade."
        }
        button={"Go to interior"}
        onClick={() =>
          navigate(getInteriorRoute({ floor: "ground", visitedFarmId }))
        }
      />
    );
  }

  const upgradePosition =
    floor === "interior"
      ? { x: 2, y: 9.5 } // [Interior.tsx] bl(13, 21) -> cc, hard-coded there
      : expansion && UPGRADE_POSITIONS[expansion]
        ? {
            x: UPGRADE_POSITIONS[expansion]!.x - 12,
            y: UPGRADE_POSITIONS[expansion]!.y - 12,
          }
        : undefined;

  // [Interior.tsx] the ground floor only offers the upgrade before the first
  // purchase; afterwards the same spot becomes the stairs up.
  const showUpgrade =
    !landscaping &&
    !isVisiting &&
    upgradePosition &&
    (floor === "level_one" || !expansion);

  const showStairsUp =
    floor === "interior" &&
    !!expansion &&
    hasRequiredIslandExpansion(island.type, "volcano");

  return (
    <>
      {showUpgrade && (
        <WorldPinned
          bridge={bridge}
          anchor="interior-upgrade"
          x={upgradePosition.x}
          y={upgradePosition.y}
        >
          <UpgradeButton />
        </WorldPinned>
      )}

      {showStairsUp && (
        <WorldPinned
          bridge={bridge}
          anchor="interior-stairs"
          x={14 - 12}
          y={20 - 12}
          width={1}
          height={2}
        >
          <div
            className="h-full w-full cursor-pointer relative"
            onClick={() =>
              navigate(getInteriorRoute({ floor: "level_one", visitedFarmId }))
            }
          >
            <img
              src={SUNNYSIDE.icons.arrow_up}
              style={{
                width: `${PIXEL_SCALE * 9}px`,
                left: `${PIXEL_SCALE * 2}px`,
                top: `${PIXEL_SCALE * -2}px`,
              }}
              className="absolute pointer-events-none"
            />
          </div>
        </WorldPinned>
      )}

      {floor === "level_one" && !landscaping && (
        <WorldPinned
          bridge={bridge}
          anchor="interior-stairs"
          x={13 - 12}
          y={16 - 12}
          width={1}
          height={2}
        >
          <div
            className="h-full w-full cursor-pointer relative"
            onClick={() =>
              navigate(getInteriorRoute({ floor: "ground", visitedFarmId }))
            }
          >
            <img
              src={SUNNYSIDE.icons.arrow_down}
              style={{
                width: `${PIXEL_SCALE * 9}px`,
                left: `${PIXEL_SCALE * 4.5}px`,
                top: `${PIXEL_SCALE * 2}px`,
              }}
              className="absolute pointer-events-none"
            />
          </div>
        </WorldPinned>
      )}
    </>
  );
};

const EmptyState: React.FC<{
  line1: string;
  line2?: string;
  button: string;
  onClick: () => void;
}> = ({ line1, line2, button, onClick }) => (
  <div className="absolute inset-0 bg-[#181425] flex items-center justify-center pointer-events-auto">
    <div className="flex flex-col items-center gap-4 text-white text-center px-8">
      <p>{line1}</p>
      {line2 && <p className="text-sm opacity-70">{line2}</p>}
      <Button onClick={onClick}>{button}</Button>
    </div>
  </div>
);
