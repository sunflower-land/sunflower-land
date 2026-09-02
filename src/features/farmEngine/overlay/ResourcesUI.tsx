import React, { useContext, useEffect, useState } from "react";
import { QuickSelect } from "features/greenhouse/QuickSelect";
import {
  PATCH_FRUIT_SEEDS,
  type PatchFruitSeedName,
} from "features/game/types/fruits";
import { SEASONAL_SEEDS } from "features/game/types/seeds";
import { isFullMoonBerry } from "features/game/events/landExpansion/seedBought";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { playSound } from "../core/sounds";
import type { QuickSelectRequest } from "../bridge/GameBridge";
import { useSelector } from "@xstate/react";

import { InnerPanel } from "components/ui/Panel";
import { TimerPopover } from "features/island/common/TimerPopover";
import { ChestReward } from "features/island/common/chest-reward/ChestReward";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { PIXEL_SCALE, TREE_RECOVERY_TIME } from "features/game/lib/constants";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  computeReadyAt,
  getFlowerBoostWindows,
  getFruitBoostWindows,
  getMineBoostWindows,
  getOilBoostWindows,
  getTreeBoostWindows,
  getTurbofruitMixWindows,
  type BoostWindow,
} from "features/game/lib/boostWindows";
import { SUNNYSIDE } from "assets/sunnyside";
import { getFruitTreeStatus } from "features/island/fruit/FruitTree";
import { FLOWER_SEEDS, FLOWERS } from "features/game/types/flowers";
import { DEFAULT_HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";
import { getCurrentHoneyProduced } from "features/game/lib/beehiveProduction";
import {
  getMaxStoredSaltCharges,
  getNextSaltChargeInSeconds,
  getSaltChargeGenerationTime,
  getStoredSaltCharges,
  materializeSaltRegen,
} from "features/game/types/salt";
import { caughtCrustacean } from "features/game/types/crustaceans";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { getKeys } from "lib/object";
import { formatNumber } from "lib/utils/formatNumber";
import { secondsToString } from "lib/utils/time";
import { useNow } from "lib/utils/hooks/useNow";
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
  t: (key: "craft") => string,
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
        noToolText: `${t("craft")} axe`,
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
        noToolText: `${t("craft")} ${tool.toLowerCase()}`,
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
        noToolText: `${t("craft")} gold pickaxe`,
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
        noToolText: `${t("craft")} gold pickaxe`,
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
        noToolText: `${t("craft")} gold pickaxe`,
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
        noToolText: `${t("craft")} oil drill`,
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

/** Phase-4 compound nodes: bespoke hover content per kind. */
const CompoundPopover: React.FC<{
  kind: ResourceHoverKind;
  id: string;
}> = ({ kind, id }) => {
  const { gameService } = useContext(Context);
  const game = useSelector(gameService, _state);
  const now = useNow({ live: true });

  const anchorId = `${kind}-${id}`;

  if (kind === "fruitPatch") {
    const node = game.fruitPatches[id];
    if (!node) return null;
    const windows = [
      ...getFruitBoostWindows(game),
      ...getTurbofruitMixWindows(node.fertiliser),
    ];
    const status = getFruitTreeStatus(node.fruit, now, windows);
    if (status.stage !== "Seedling" && status.stage !== "Replenishing") {
      return null;
    }
    const name = node.fruit?.name ?? "";
    const description =
      status.stage === "Replenishing"
        ? `${name} Replenishing`
        : `${name} Growing`;
    // Wall-clock countdown [FruitTree.tsx useNodeTimer]: windowed fruit
    // derives its ready time live from the boost windows; legacy timeLeft is
    // already wall-clock.
    const fruitReadyAt =
      node.fruit?.baseDurationMs !== undefined
        ? computeReadyAt({
            startedAt: node.fruit.harvestedAt || node.fruit.plantedAt,
            baseDurationMs: node.fruit.baseDurationMs,
            windows,
          })
        : undefined;
    const fruitCountdown =
      fruitReadyAt !== undefined
        ? Math.max((fruitReadyAt - now) / 1000, 0)
        : (status.timeLeft ?? 0);
    return (
      <AnchoredScaled anchorId={anchorId} tilesWide={2}>
        <div
          className="flex justify-center absolute w-full"
          style={{ top: `${PIXEL_SCALE * -16}px` }}
        >
          <TimerPopover
            image={ITEM_DETAILS[name as InventoryItemName]?.image}
            description={description}
            showPopover={true}
            timeLeft={fruitCountdown}
          />
        </div>
      </AnchoredScaled>
    );
  }

  if (kind === "flowerBed") {
    const node = game.flowers.flowerBeds[id];
    const flower = node?.flower;
    if (!flower || flower.dirty) return null;
    const growSeconds = FLOWER_SEEDS[FLOWERS[flower.name].seed].plantSeconds;
    const windows = getFlowerBoostWindows(game);
    // Wall-clock countdown [FlowerBed.tsx useNodeTimer countdownSeconds].
    const flowerReadyAt =
      flower.baseDurationMs !== undefined
        ? computeReadyAt({
            startedAt: flower.plantedAt,
            baseDurationMs: flower.baseDurationMs,
            windows,
          })
        : flower.plantedAt + growSeconds * 1000;
    const secondsLeft = Math.max((flowerReadyAt - now) / 1000, 0);
    if (secondsLeft <= 0) return null;
    const known = (game.farmActivity[`${flower.name} Harvested`] ?? 0) > 0;
    return (
      <AnchoredScaled anchorId={anchorId} tilesWide={3}>
        <div
          className="flex justify-center absolute w-full"
          style={{ top: `${PIXEL_SCALE * -18}px` }}
        >
          <TimerPopover
            image={
              known ? ITEM_DETAILS[flower.name].image : SUNNYSIDE.icons.search
            }
            description={known ? flower.name : "Unknown"}
            showPopover={true}
            timeLeft={secondsLeft}
          />
        </div>
      </AnchoredScaled>
    );
  }

  if (kind === "beehive") {
    const hive = game.beehives[id];
    if (!hive) return null;
    const produced = getCurrentHoneyProduced(hive, now);
    const ready = produced >= DEFAULT_HONEY_PRODUCTION_TIME;
    if (ready) return null;
    const text =
      hive.flowers.length === 0 && !produced
        ? "No flowers growing nearby"
        : `Honey: ${formatNumber((produced / DEFAULT_HONEY_PRODUCTION_TIME) * 100, { decimalPlaces: 2 })}% full`;
    return (
      <AnchoredScaled anchorId={anchorId} tilesWide={1}>
        <div
          className="flex justify-center absolute w-full"
          style={{ top: `${PIXEL_SCALE * -19}px` }}
        >
          <InnerPanel className="absolute whitespace-nowrap w-fit z-50">
            <div className="text-xxs mx-1 p-1">{text}</div>
          </InnerPanel>
        </div>
      </AnchoredScaled>
    );
  }

  if (kind === "salt") {
    const node = game.saltFarm.nodes[id];
    if (!node) return null;
    const { chargeGenerationTimeMs } = getSaltChargeGenerationTime({
      gameState: game,
    });
    const maxCharges = getMaxStoredSaltCharges(
      (game as { sculptures?: Record<string, { level?: number }> })
        .sculptures?.["Salt Sculpture"]?.level ?? 0,
    );
    const charges = getStoredSaltCharges(node, now, {
      chargeIntervalMs: chargeGenerationTimeMs,
      maxCharges,
    });
    const rakeFree = isCollectibleBuilt({ name: "Ascended Idol", game });
    const rakes = Math.floor(game.inventory["Salt Rake"]?.toNumber() ?? 0);

    let text: string | null = null;
    if (charges === 0) {
      const { nextChargeAt } = materializeSaltRegen(node.salt, now, {
        chargeIntervalMs: chargeGenerationTimeMs,
        maxCharges,
      });
      const seconds = getNextSaltChargeInSeconds({ nextChargeAt, now });
      text = `Next charge in ${secondsToString(seconds, { length: "medium" })}`;
    } else if (!rakeFree && rakes === 0) {
      text = "You need a Salt Rake";
    }
    if (!text) return null;
    return (
      <AnchoredScaled anchorId={anchorId} tilesWide={1}>
        <div
          className="flex justify-center absolute w-full"
          style={{ top: `${PIXEL_SCALE * -14}px` }}
        >
          <InnerPanel className="absolute whitespace-nowrap w-fit z-50">
            <div className="text-xxs mx-1 p-1">{text}</div>
          </InnerPanel>
        </div>
      </AnchoredScaled>
    );
  }

  if (kind === "waterTrap") {
    const spot = game.crabTraps.trapSpots?.[id];
    const waterTrap = spot?.waterTrap;
    if (!waterTrap || waterTrap.readyAt <= now) return null;
    const caught = getKeys(
      waterTrap.caught ?? caughtCrustacean(waterTrap.type, waterTrap.chum),
    )[0];
    const known = caught && (game.farmActivity[`${caught} Caught`] ?? 0) > 0;
    return (
      <AnchoredScaled anchorId={anchorId} tilesWide={1}>
        <div
          className="flex justify-center absolute w-full"
          style={{ top: `${PIXEL_SCALE * -18}px` }}
        >
          <TimerPopover
            image={
              known && caught
                ? ITEM_DETAILS[caught as InventoryItemName]?.image
                : SUNNYSIDE.icons.expression_confused
            }
            description={known && caught ? caught : ""}
            showPopover={true}
            timeLeft={Math.max((waterTrap.readyAt - now) / 1000, 0)}
          />
        </div>
      </AnchoredScaled>
    );
  }

  return null;
};

const COMPOUND_KINDS: ResourceHoverKind[] = [
  "fruitPatch",
  "flowerBed",
  "beehive",
  "salt",
  "waterTrap",
];

const ResourcePopover: React.FC<{
  kind: ResourceHoverKind;
  id: string;
}> = ({ kind, id }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const game = useSelector(gameService, _state);
  const reading = readNode(kind, id, game, t);

  const timing = reading?.node;
  const { now, readyAt, countdownSeconds } = useNodeTimer({
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
            timeLeft={countdownSeconds}
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

/** [FruitPatch.tsx] the quick-select disc row over an empty patch. */
const FruitQuickSelect: React.FC<{
  bridge: GameBridge;
  anchorId: string;
  patchId: string;
}> = ({ bridge, anchorId, patchId }) => {
  const { gameService } = useContext(Context);
  const season = useSelector(
    gameService,
    (state: MachineState) => state.context.state.season.season,
  );
  const { t } = useAppTranslation();

  return (
    <AnchoredScaled anchorId={anchorId} tilesWide={2} pointerEvents>
      {/* [FruitPatch.tsx] bottom-20 left-10 against the 84px patch div —
          the wrapper here is zero-height at the anchor TOP, so the same
          geometry is bottom: -(84 - 80) = -4px. */}
      <div
        className="flex absolute z-40"
        style={{ bottom: "-4px", left: "40px" }}
      >
        <QuickSelect
          options={getKeys(PATCH_FRUIT_SEEDS)
            .filter(
              (seed) =>
                SEASONAL_SEEDS[season].includes(seed) || isFullMoonBerry(seed),
            )
            .map((seed) => ({
              name: seed as InventoryItemName,
              icon: PATCH_FRUIT_SEEDS[seed].yield as InventoryItemName,
              showSecondaryImage: true,
            }))}
          onClose={() => bridge.quickSelect.set(null)}
          onSelected={(seed) => {
            bridge.dispatch("fruit.planted", {
              index: patchId,
              seed: seed as PatchFruitSeedName,
            });
            playSound("plant");
            bridge.quickSelect.set(null);
          }}
          type={t("quickSelect.cropSeeds")}
          showExpanded
        />
      </div>
    </AnchoredScaled>
  );
};

export const ResourcesUI: React.FC<{ bridge: GameBridge }> = ({ bridge }) => {
  const [hovered, setHovered] = useState<HoveredEntity>(bridge.hover.get());
  const [reward, setReward] = useState<PendingChestReward>(
    bridge.chestReward.get(),
  );
  const [quickSelect, setQuickSelect] = useState<QuickSelectRequest>(
    bridge.quickSelect.get(),
  );

  useEffect(() => bridge.hover.subscribe(setHovered), [bridge]);
  useEffect(() => bridge.chestReward.subscribe(setReward), [bridge]);
  useEffect(() => bridge.quickSelect.subscribe(setQuickSelect), [bridge]);

  return (
    <>
      {quickSelect && (
        <FruitQuickSelect
          bridge={bridge}
          anchorId={quickSelect.anchorId}
          patchId={quickSelect.patchId}
        />
      )}
      {hovered?.type === "resource" &&
        (COMPOUND_KINDS.includes(hovered.kind) ? (
          <CompoundPopover kind={hovered.kind} id={hovered.id} />
        ) : (
          <ResourcePopover kind={hovered.kind} id={hovered.id} />
        ))}

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
