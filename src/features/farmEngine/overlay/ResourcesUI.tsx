import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { InnerPanel } from "components/ui/Panel";
import { TimerPopover } from "features/island/common/TimerPopover";
import { ChestReward } from "features/island/common/chest-reward/ChestReward";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { PIXEL_SCALE, TREE_RECOVERY_TIME } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getMineBoostWindows,
  getOilBoostWindows,
  getTreeBoostWindows,
  type BoostWindow,
} from "features/game/lib/boostWindows";
import { RESOURCE_RECOVERY_TIME } from "features/game/lib/resourceNodes";
import { OIL_RESERVE_RECOVERY_TIME } from "features/game/events/landExpansion/drillOilReserve";
import { useNodeTimer } from "features/game/lib/useNodeTimer";
import type {
  GameBridge,
  HoveredEntity,
  PendingChestReward,
  ResourceHoverKind,
} from "../bridge/GameBridge";
import { useWorldAnchor } from "../bridge/useWorldAnchor";

/**
 * The React half of resource nodes: HOVER-ONLY UI (recovery TimerPopover on
 * depleted nodes, the no-tool craft warning) plus the chest-reward host.
 * Everything rendered persistently on the game layer lives in the renderers.
 */

type NodeReading = {
  /** Undefined when the id doesn't resolve for this kind. */
  node?: { minedAt: number; baseDurationMs?: number };
  windows: BoostWindow[];
  recoverySeconds: number;
  image: string;
  description: string;
  popoverTop: number;
  tilesWide: number;
  hasTool: boolean;
  noToolText: string;
};

const readNode = (
  kind: ResourceHoverKind,
  id: string,
  game: GameState,
): NodeReading | undefined => {
  switch (kind) {
    case "tree": {
      const node = game.trees[id];
      if (!node) return undefined;
      return {
        node: {
          minedAt: node.wood.choppedAt,
          baseDurationMs: node.wood.baseDurationMs,
        },
        windows: getTreeBoostWindows(game),
        recoverySeconds: TREE_RECOVERY_TIME,
        image: ITEM_DETAILS.Wood.image,
        description: node.name ?? "Tree",
        popoverTop: -10,
        tilesWide: 2,
        hasTool: !!game.inventory.Axe?.gte(1),
        noToolText: "Craft an axe at the Workbench",
      };
    }
    case "stone":
    case "iron":
    case "gold": {
      const record =
        kind === "stone"
          ? game.stones
          : kind === "iron"
            ? game.iron
            : game.gold;
      const node = record[id];
      if (!node) return undefined;
      const fallback =
        kind === "stone"
          ? "Stone Rock"
          : kind === "iron"
            ? "Iron Rock"
            : "Gold Rock";
      const name = (node as { name?: string }).name ?? fallback;
      const item =
        kind === "stone" ? "Stone" : kind === "iron" ? "Iron" : "Gold";
      const tool =
        kind === "stone"
          ? "Pickaxe"
          : kind === "iron"
            ? "Stone Pickaxe"
            : "Iron Pickaxe";
      return {
        node: node.stone,
        windows: getMineBoostWindows(game, name as never),
        recoverySeconds:
          RESOURCE_RECOVERY_TIME[name as keyof typeof RESOURCE_RECOVERY_TIME],
        image: ITEM_DETAILS[item].image,
        description: name,
        popoverTop: -20,
        tilesWide: 1,
        hasTool: !!game.inventory[tool]?.gte(1),
        noToolText: `Craft a ${tool.toLowerCase()}`,
      };
    }
    case "crimstone": {
      const node = game.crimstones[id];
      if (!node) return undefined;
      return {
        node: node.stone,
        windows: getMineBoostWindows(game, "Crimstone Rock"),
        recoverySeconds: RESOURCE_RECOVERY_TIME["Crimstone Rock"],
        image: ITEM_DETAILS.Crimstone.image,
        description: "Crimstone Rock",
        popoverTop: -20,
        tilesWide: 2,
        hasTool: !!game.inventory["Gold Pickaxe"]?.gte(1),
        noToolText: "Craft a gold pickaxe",
      };
    }
    case "sunstone": {
      const node = game.sunstones[id];
      if (!node) return undefined;
      return {
        node: node.stone,
        windows: [],
        recoverySeconds: RESOURCE_RECOVERY_TIME["Sunstone Rock"],
        image: ITEM_DETAILS.Sunstone.image,
        description: "Sunstone Rock",
        popoverTop: -20,
        tilesWide: 2,
        hasTool: !!game.inventory["Gold Pickaxe"]?.gte(1),
        noToolText: "Craft a gold pickaxe",
      };
    }
    case "ascensionCrystal": {
      const node = game.ascensionCrystals[id];
      if (!node) return undefined;
      return {
        node: undefined, // never depleted
        windows: [],
        recoverySeconds: 0,
        image: ITEM_DETAILS["Ascension Shard"].image,
        description: "Ascension Crystal",
        popoverTop: -14,
        tilesWide: 2,
        hasTool: !!game.inventory["Gold Pickaxe"]?.gte(1),
        noToolText: "Craft a gold pickaxe",
      };
    }
    case "oil": {
      const node = game.oilReserves[id];
      if (!node) return undefined;
      return {
        node: {
          minedAt: node.oil.drilledAt,
          baseDurationMs: node.oil.baseDurationMs,
        },
        windows: getOilBoostWindows(game),
        recoverySeconds: OIL_RESERVE_RECOVERY_TIME,
        image: ITEM_DETAILS.Oil.image,
        description: "Oil Reserve",
        popoverTop: -16,
        tilesWide: 2,
        hasTool: !!game.inventory["Oil Drill"]?.gte(1),
        noToolText: "Craft an oil drill",
      };
    }
  }
};

const _state = (state: MachineState) => state.context.state;

/** Position + zoom-scale children over an anchored node box. */
const AnchoredScaled: React.FC<
  React.PropsWithChildren<{
    anchorId: string;
    tilesWide: number;
    pointerEvents?: boolean;
  }>
> = ({ anchorId, tilesWide, pointerEvents = false, children }) => {
  const rect = useWorldAnchor(anchorId);
  if (!rect || !rect.visible) return null;
  const boxCss = tilesWide * 16 * PIXEL_SCALE;

  return (
    <div
      className={`absolute ${pointerEvents ? "pointer-events-auto" : "pointer-events-none"}`}
      style={{
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: 0,
        height: 0,
        transform: `scale(${rect.width / boxCss})`,
        transformOrigin: "0 0",
      }}
    >
      <div className="absolute" style={{ width: `${boxCss}px` }}>
        {children}
      </div>
    </div>
  );
};

const ResourcePopover: React.FC<{
  kind: ResourceHoverKind;
  id: string;
}> = ({ kind, id }) => {
  const { gameService } = useContext(Context);
  const game = useSelector(gameService, _state);
  const reading = readNode(kind, id, game);

  const timing = reading?.node;
  const { now, readyAt, speed, displaySeconds } = useNodeTimer({
    startedAt: timing?.minedAt ?? 0,
    baseDurationMs: timing?.baseDurationMs,
    windows: reading?.windows ?? [],
    legacyReadyAt:
      (timing?.minedAt ?? 0) + (reading?.recoverySeconds ?? 0) * 1000,
    live: !!timing,
  });

  if (!reading) return null;

  const depleted = !!timing && now <= readyAt;
  const anchorId = `${kind === "oil" ? "oil" : kind}-${id}`;

  if (depleted) {
    return (
      <AnchoredScaled anchorId={anchorId} tilesWide={reading.tilesWide}>
        <div
          className="flex justify-center absolute w-full"
          style={{ top: `${PIXEL_SCALE * reading.popoverTop}px` }}
        >
          <TimerPopover
            image={reading.image}
            description={reading.description}
            showPopover={true}
            timeLeft={displaySeconds}
            speed={speed}
          />
        </div>
      </AnchoredScaled>
    );
  }

  if (!reading.hasTool) {
    return (
      <AnchoredScaled anchorId={anchorId} tilesWide={reading.tilesWide}>
        <div
          className="flex justify-center absolute w-full"
          style={{ top: `${PIXEL_SCALE * reading.popoverTop}px` }}
        >
          <InnerPanel className="absolute whitespace-nowrap w-fit z-50">
            <div className="text-xxs mx-1 p-1">{reading.noToolText}</div>
          </InnerPanel>
        </div>
      </AnchoredScaled>
    );
  }

  return null;
};

export const ResourcesUI: React.FC<{ bridge: GameBridge }> = ({ bridge }) => {
  const [hovered, setHovered] = useState<HoveredEntity>(bridge.hover.get());
  const [reward, setReward] = useState<PendingChestReward>(
    bridge.chestReward.get(),
  );

  useEffect(() => bridge.hover.subscribe(setHovered), [bridge]);
  useEffect(() => bridge.chestReward.subscribe(setReward), [bridge]);

  return (
    <>
      {hovered?.type === "resource" && (
        <ResourcePopover kind={hovered.kind} id={hovered.id} />
      )}

      {reward && (
        <AnchoredScaled anchorId={reward.anchorId} tilesWide={1} pointerEvents>
          <ChestReward
            collectedItem={reward.collectedItem}
            reward={reward.reward}
            onCollected={(success) => reward.onResult(success)}
            onOpen={() => {
              // reward applies inside the collect event; chest animation only
            }}
          />
        </AnchoredScaled>
      )}
    </>
  );
};
