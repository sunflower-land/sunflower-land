import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";
import ironOre from "assets/resources/iron_ore.png";
import goldOre from "assets/resources/gold_ore.png";
import crimstone1 from "assets/resources/crimstone/crimstone_rock_1.webp";
import crimstone2 from "assets/resources/crimstone/crimstone_rock_2.webp";
import crimstone3 from "assets/resources/crimstone/crimstone_rock_3.webp";
import crimstone4 from "assets/resources/crimstone/crimstone_rock_4.webp";
import crimstone5 from "assets/resources/crimstone/crimstone_rock_5.webp";
import crimstone6 from "assets/resources/crimstone/crimstone_rock_6.webp";
import crimstoneSpark from "assets/resources/crimstone/crimstone_rock_spark.png";
import crimstoneOneDrop from "assets/resources/crimstone/crimstone_rock_one_drop.png";
import crimstoneThreeDrop from "assets/resources/crimstone/crimstone_rock_three_drop.png";
import sunstone1 from "assets/resources/sunstone/sunstone_rock_1.webp";
import sunstone2 from "assets/resources/sunstone/sunstone_rock_2.webp";
import sunstone3 from "assets/resources/sunstone/sunstone_rock_3.webp";
import sunstone4 from "assets/resources/sunstone/sunstone_rock_4.webp";
import sunstone5 from "assets/resources/sunstone/sunstone_rock_5.webp";
import sunstone6 from "assets/resources/sunstone/sunstone_rock_6.webp";
import sunstone7 from "assets/resources/sunstone/sunstone_rock_7.webp";
import sunstone8 from "assets/resources/sunstone/sunstone_rock_8.webp";
import sunstone9 from "assets/resources/sunstone/sunstone_rock_9.webp";
import sunstone10 from "assets/resources/sunstone/sunstone_rock_10.webp";
import sunstoneSpark from "assets/resources/sunstone/sunstone_rock_spark.png";
import sunstoneDrop from "assets/resources/sunstone/sunstone_drop.png";

import type {
  GameState,
  InventoryItemName,
  Rock,
} from "features/game/types/game";
import { KNOWN_IDS } from "features/game/types";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getMineBoostWindows,
  computeReadyAt,
  type BoostWindow,
} from "features/game/lib/boostWindows";
import { canMine, getMineReadyAt } from "features/game/lib/resourceNodes";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import { getStoneDropAmount } from "features/game/events/landExpansion/stoneMine";
import { getIronDropAmount } from "features/game/events/landExpansion/ironMine";
import { getGoldDropAmount } from "features/game/events/landExpansion/mineGold";
import { getCrimstoneDropAmount } from "features/game/events/landExpansion/mineCrimstone";
import { getCrimstoneStage } from "features/game/expansion/components/resources/crimstone/getCrimstoneStage";
import { getSunstoneStage } from "features/game/expansion/components/resources/sunstone/getSunstoneStage";
import type { GameBridge } from "../../bridge/GameBridge";
import type { ResourceHoverKind } from "../../bridge/GameBridge";
import { queueImage } from "../../core/assets";
import { playSound } from "../../core/sounds";
import { playYieldFloat } from "../../components/YieldFloat";
import type { FarmScene } from "../../scenes/FarmScene";
import {
  ResourceNodeRenderer,
  type NodeObjects,
  type NodeSlice,
  type RenderContext,
} from "./ResourceNodeRenderer";
import {
  playDropSheet,
  playSheet,
  queueSheet,
  type ArtSpec,
  type SheetSpec,
} from "./lib";

/**
 * Config-driven renderer for every mineable rock family [Stone.tsx, Iron.tsx,
 * Gold.tsx, Crimstone.tsx, Sunstone.tsx and their components]. The DOM
 * components are structurally identical; the differences live in the config
 * tables below (art, sheets, tools, events, stages).
 *
 * DEFERRED: the recover lightning flash (Gold/Crimstone Transition polish).
 */

type MineralNode = Rock & { name?: string; minesLeft?: number };

export type MineralConfig = {
  key: string;
  hoverKind: ResourceHoverKind;
  dims: { width: number; height: number };
  selectNodes: (game: GameState) => Record<string, MineralNode>;
  staticArt: (node: MineralNode, game: GameState, now: number) => ArtSpec;
  strikeSheet: (node: MineralNode) => SheetSpec;
  dropSheet: (node: MineralNode, game: GameState, now: number) => SheetSpec;
  yieldFx: (node: MineralNode) => { icon: string; iconWidth: number };
  allAssets: (slice: NodeSlice<MineralNode>) => string[];
  allSheets: (slice: NodeSlice<MineralNode>) => SheetSpec[];
  recoverySeconds: number;
  windows: (game: GameState, node: MineralNode) => BoostWindow[];
  isDepleted: (node: MineralNode, game: GameState, now: number) => boolean;
  hasTool: (game: GameState, node: MineralNode) => boolean;
  /** Item to auto-select on strike (undefined = skip, per Quarry rule). */
  toolToSelect: (game: GameState) => InventoryItemName | undefined;
  instaMine: (game: GameState) => boolean;
  collect: (
    bridge: GameBridge,
    id: string,
    node: MineralNode,
    game: GameState,
    farmId: number,
  ) => number; // dispatches the event, returns the drop amount for the float
};

export class MineralRenderer extends ResourceNodeRenderer<MineralNode> {
  protected readonly rendererKey: string;
  protected readonly tileDims: { width: number; height: number };
  protected readonly hoverKind: ResourceHoverKind;

  constructor(
    scene: FarmScene,
    bridge: GameBridge,
    private readonly config: MineralConfig,
  ) {
    super(scene, bridge);
    this.rendererKey = config.key;
    this.tileDims = config.dims;
    this.hoverKind = config.hoverKind;
  }

  private recoveryTimers = new Map<string, () => void>();

  protected selectNodes(game: GameState) {
    return this.config.selectNodes(game);
  }

  protected collectAssets(slice: NodeSlice<MineralNode>) {
    this.config.allAssets(slice).forEach((url) => queueImage(this.scene, url));
    this.config
      .allSheets(slice)
      .forEach((spec) => queueSheet(this.scene, spec));
    queueImage(this.scene, SUNNYSIDE.ui.emptyBar);
    Object.values(slice.nodes).forEach((node) =>
      queueImage(this.scene, this.config.yieldFx(node).icon),
    );
  }

  protected renderNode(
    id: string,
    node: MineralNode,
    objects: NodeObjects,
    ctx: RenderContext,
  ) {
    // Boost feedback [Gold.tsx / Crimstone.tsx]: external minedAt change ->
    // lightning flash once recovered.
    const prevNode = this.prevNodes[id];
    if (prevNode && prevNode.stone.minedAt !== node.stone.minedAt) {
      this.scheduleBoostFlash(id, () => {
        const fresh = this.config.selectNodes(this.game())[id];
        return (
          !!fresh && !this.config.isDepleted(fresh, this.game(), Date.now())
        );
      });
    }
    this.recoveryTimers.get(id)?.();
    this.recoveryTimers.delete(id);

    const game = this.game();
    const now = Date.now();
    const depleted = this.config.isDepleted(node, game, now);
    const art = this.config.staticArt(node, game, now);

    if (depleted) {
      objects.strike?.destroy();
      objects.strike = undefined;
      objects.bar?.destroy();
      objects.bar = undefined;
      this.setArt(objects, ctx, { ...art, alpha: 0.5 });

      const readyAt =
        node.stone.baseDurationMs !== undefined
          ? computeReadyAt({
              startedAt: node.stone.minedAt,
              baseDurationMs: node.stone.baseDurationMs,
              windows: this.config.windows(game, node),
            })
          : node.stone.minedAt + this.config.recoverySeconds * 1000;
      const timer = this.scene.time.delayedCall(
        Math.max(readyAt - now, 0) + 100,
        () =>
          void this.sync(this.bridge.select((state) => this.selector(state))),
      );
      this.recoveryTimers.set(id, () => timer.remove());
      return;
    }

    // Recovered: static art always visible; sparks layer on top while struck.
    this.setArt(objects, ctx, art);
    if (objects.touch > 0) {
      objects.strike = playSheet(
        this.scene,
        objects.strike,
        ctx.box,
        this.config.strikeSheet(node),
        ctx.depth + 1,
      );
      this.showHealthBar(objects, ctx.box);
    } else {
      objects.strike?.destroy();
      objects.strike = undefined;
    }
  }

  protected onNodeClick(id: string) {
    const machine = this.bridge.select((state) => state);
    const game = machine.context.state;
    const node = this.config.selectNodes(game)[id];
    if (!node) return;

    const now = Date.now();
    if (this.config.isDepleted(node, game, now)) return;
    if (!this.config.hasTool(game, node)) return;

    // EXPERIMENT [worker/BumpkinWorker.ts]: with a bumpkin selected the click
    // queues the mine; a full swing on arrival skips the multi-tap counter.
    const box = this.boxOf(id) ?? this.boxFor(node);
    const dotTool = this.config.toolToSelect(game);
    const queued = (
      this.scene as unknown as {
        worker?: { intercept(job: unknown): boolean };
      }
    ).worker?.intercept({
      label: "Mine",
      world: { x: box.x, y: box.y },
      size: { width: box.width, height: box.height },
      anim: "mining",
      dotAt: { x: box.x + box.width / 2, y: box.y - 2 },
      icon: dotTool ? ITEM_DETAILS[dotTool].image : undefined,
      run: () => this.mineNow(id),
    });
    if (queued) return;

    const tool = this.config.toolToSelect(game);
    if (tool) this.bridge.selectItem(tool);

    playSound("mining");

    if (this.config.instaMine(game)) {
      this.mine(id);
      return;
    }

    const fire = this.bumpTouch(id);
    void this.sync(this.bridge.select((state) => this.selector(state)));
    if (!fire) return;
    this.mine(id);
  }

  /** Worker arrival: the unchanged mine path, minus the tap counter. */
  private mineNow(id: string) {
    const game = this.bridge.select((state) => state.context.state);
    const node = this.config.selectNodes(game)[id];
    if (!node) return;
    if (this.config.isDepleted(node, game, Date.now())) return;
    const tool = this.config.toolToSelect(game);
    if (tool) this.bridge.selectItem(tool);
    playSound("mining");
    this.mine(id);
  }

  private mine(id: string) {
    const machine = this.bridge.select((state) => state);
    const game = machine.context.state;
    const node = this.config.selectNodes(game)[id];
    if (!node) return;

    const now = Date.now();
    const amount = this.config.collect(
      this.bridge,
      id,
      node,
      game,
      machine.context.farmId,
    );
    playSound("mining_fall");

    if (this.bridge.ui.get().showAnimations) {
      const box = this.boxOf(id) ?? this.boxFor(node);
      playDropSheet(
        this.scene,
        box,
        this.config.dropSheet(node, game, now),
        box.y + 100_000, // well above the entity band, like the DOM z-40
      );
      const fx = this.config.yieldFx(node);
      playYieldFloat(this.scene, {
        x: box.x - 16,
        y: box.y - 12,
        amount,
        icon: fx.icon,
        iconWidth: fx.iconWidth,
        depth: box.y + 100_000,
        durationMs: 3000,
      });
    }

    this.resetTouch(id);
  }

  protected onDestroy() {
    this.recoveryTimers.forEach((cancel) => cancel());
    this.recoveryTimers.clear();
    super.onDestroy();
  }
}

/* ------------------------------------------------------------------ */
/* Family configs                                                      */
/* ------------------------------------------------------------------ */

const BASE_ROCK_ART: Record<string, Omit<ArtSpec, "texture">> = {
  "Stone Rock": { width: 14, top: 3, left: 1 },
  "Fused Stone Rock": { width: 15, top: 1, left: 0.238 },
  "Reinforced Stone Rock": { width: 15, top: -0.523, left: 0.62 },
  "Iron Rock": { width: 14, top: 3, left: 1 },
  "Refined Iron Rock": { width: 15, top: 3, left: 1 },
  "Tempered Iron Rock": { width: 15, top: 1, left: 1 },
  "Gold Rock": { width: 14, top: 3, left: 1 },
  "Pure Gold Rock": { width: 15, top: 3, left: 1 },
  "Prime Gold Rock": { width: 15, top: 1, left: 1 },
};

const rockItemArt = (name: string): ArtSpec => ({
  texture: ITEM_DETAILS[name as InventoryItemName].image,
  ...BASE_ROCK_ART[name],
});

const BIG_DROP = {
  frameWidth: 112,
  frameHeight: 48,
  fps: 20,
  steps: 10,
  bottom: -13,
  right: -63,
};
const BIG_STRIKE = {
  frameWidth: 112,
  frameHeight: 48,
  fps: 24,
  steps: 6,
  bottom: -13,
  right: -63,
};
const TIER_STRIKE = {
  frameWidth: 48,
  frameHeight: 27,
  fps: 24,
  steps: 6,
  bottom: 0.333,
  right: -16.14,
};

const nodeName = (node: MineralNode, fallback: string) => node.name ?? fallback;

export const STONE_CONFIG: MineralConfig = {
  key: "stone",
  hoverKind: "stone",
  dims: { width: 1, height: 1 },
  selectNodes: (game) => game.stones as Record<string, MineralNode>,
  staticArt: (node) => rockItemArt(nodeName(node, "Stone Rock")),
  strikeSheet: (node) => {
    const name = nodeName(node, "Stone Rock");
    const sheet = (
      SUNNYSIDE.resource.rocks.strikeSheet as Record<string, string>
    )[name];
    return name === "Stone Rock"
      ? { url: sheet, ...BIG_STRIKE }
      : { url: sheet, ...TIER_STRIKE };
  },
  dropSheet: () => ({ url: SUNNYSIDE.resource.stoneDropSheet, ...BIG_DROP }),
  yieldFx: () => ({ icon: SUNNYSIDE.resource.stone, iconWidth: 10 }),
  allAssets: (slice) =>
    Object.values(slice.nodes).map(
      (node) => rockItemArt(nodeName(node, "Stone Rock")).texture,
    ),
  allSheets: (slice) => [
    ...Object.values(slice.nodes).map((node) => STONE_CONFIG.strikeSheet(node)),
    { url: SUNNYSIDE.resource.stoneDropSheet, ...BIG_DROP },
  ],
  recoverySeconds: 4 * 60 * 60,
  windows: (game, node) =>
    getMineBoostWindows(game, nodeName(node, "Stone Rock") as never),
  isDepleted: (node, game, now) =>
    !canMine(node, nodeName(node, "Stone Rock") as never, game, now),
  hasTool: (game, node) => {
    const required = isCollectibleBuilt({ name: "Quarry", game })
      ? new Decimal(0)
      : new Decimal(1).mul(node.multiplier ?? 1);
    return (
      required.lte(0) ||
      (game.inventory.Pickaxe ?? new Decimal(0)).gte(required)
    );
  },
  toolToSelect: (game) =>
    isCollectibleBuilt({ name: "Quarry", game }) ? undefined : "Pickaxe",
  instaMine: (game) => !!game.bumpkin?.skills["Tap Prospector"],
  collect: (bridge, id, node, game, farmId) => {
    const amount =
      node.stone.amount ??
      getStoneDropAmount({
        game,
        rock: node,
        createdAt: Date.now(),
        id,
        farmId,
        counter: game.farmActivity["Stone Mined"] ?? 0,
        itemId: KNOWN_IDS[nodeName(node, "Stone Rock") as InventoryItemName],
      }).amount.toNumber();
    bridge.dispatch("stoneRock.mined", { index: id });
    return Number(amount);
  },
};

export const IRON_CONFIG: MineralConfig = {
  ...STONE_CONFIG,
  key: "iron",
  hoverKind: "iron",
  selectNodes: (game) => game.iron as Record<string, MineralNode>,
  staticArt: (node) => rockItemArt(nodeName(node, "Iron Rock")),
  strikeSheet: () => ({
    url: SUNNYSIDE.resource.ironStrikeSheet,
    ...BIG_STRIKE,
  }),
  dropSheet: () => ({ url: SUNNYSIDE.resource.ironDropSheet, ...BIG_DROP }),
  yieldFx: () => ({ icon: ironOre, iconWidth: 10 }),
  allAssets: (slice) =>
    Object.values(slice.nodes).map(
      (node) => rockItemArt(nodeName(node, "Iron Rock")).texture,
    ),
  allSheets: () => [
    { url: SUNNYSIDE.resource.ironStrikeSheet, ...BIG_STRIKE },
    { url: SUNNYSIDE.resource.ironDropSheet, ...BIG_DROP },
  ],
  recoverySeconds: 8 * 60 * 60,
  windows: (game, node) =>
    getMineBoostWindows(game, nodeName(node, "Iron Rock") as never),
  isDepleted: (node, game, now) =>
    !canMine(node, nodeName(node, "Iron Rock") as never, game, now),
  hasTool: (game, node) =>
    (node.multiplier ?? 1) <= 0 ||
    (game.inventory["Stone Pickaxe"] ?? new Decimal(0)).gte(
      node.multiplier ?? 1,
    ),
  toolToSelect: () => "Stone Pickaxe",
  collect: (bridge, id, node, game, farmId) => {
    const amount =
      node.stone.amount ??
      getIronDropAmount({
        game,
        rock: node,
        createdAt: Date.now(),
        farmId,
        counter: game.farmActivity["Iron Mined"] ?? 0,
        itemId: KNOWN_IDS[nodeName(node, "Iron Rock") as InventoryItemName],
      }).amount.toNumber();
    bridge.dispatch("ironRock.mined", { index: id });
    return Number(amount);
  },
};

export const GOLD_CONFIG: MineralConfig = {
  ...IRON_CONFIG,
  key: "gold",
  hoverKind: "gold",
  selectNodes: (game) => game.gold as Record<string, MineralNode>,
  staticArt: (node) => rockItemArt(nodeName(node, "Gold Rock")),
  strikeSheet: () => ({
    url: SUNNYSIDE.resource.goldStrikeSheet,
    ...BIG_STRIKE,
  }),
  dropSheet: () => ({ url: SUNNYSIDE.resource.goldDropSheet, ...BIG_DROP }),
  yieldFx: () => ({ icon: goldOre, iconWidth: 10 }),
  allAssets: (slice) =>
    Object.values(slice.nodes).map(
      (node) => rockItemArt(nodeName(node, "Gold Rock")).texture,
    ),
  allSheets: () => [
    { url: SUNNYSIDE.resource.goldStrikeSheet, ...BIG_STRIKE },
    { url: SUNNYSIDE.resource.goldDropSheet, ...BIG_DROP },
  ],
  recoverySeconds: 24 * 60 * 60,
  windows: (game, node) =>
    getMineBoostWindows(game, nodeName(node, "Gold Rock") as never),
  isDepleted: (node, game, now) =>
    !canMine(node, nodeName(node, "Gold Rock") as never, game, now),
  hasTool: (game, node) =>
    (node.multiplier ?? 1) <= 0 ||
    (game.inventory["Iron Pickaxe"] ?? new Decimal(0)).gte(
      node.multiplier ?? 1,
    ),
  toolToSelect: () => "Iron Pickaxe",
  collect: (bridge, id, node, game, farmId) => {
    const amount =
      node.stone.amount ??
      getGoldDropAmount({
        game,
        rock: node,
        createdAt: Date.now(),
        farmId,
        counter: game.farmActivity["Gold Mined"] ?? 0,
        itemId: KNOWN_IDS[nodeName(node, "Gold Rock") as InventoryItemName],
      }).amount.toNumber();
    bridge.dispatch("goldRock.mined", { index: id });
    return Number(amount);
  },
};

const CRIMSTONE_STAGES = [
  crimstone1,
  crimstone2,
  crimstone3,
  crimstone4,
  crimstone5,
  crimstone6,
];
const SUNSTONE_STAGES = [
  sunstone1,
  sunstone2,
  sunstone3,
  sunstone4,
  sunstone5,
  sunstone6,
  sunstone7,
  sunstone8,
  sunstone9,
  sunstone10,
];

const crimstoneReadyAt = (node: MineralNode, game: GameState) =>
  getMineReadyAt(node as never, "Crimstone Rock", game);

export const CRIMSTONE_CONFIG: MineralConfig = {
  key: "crimstone",
  hoverKind: "crimstone",
  dims: { width: 2, height: 2 },
  selectNodes: (game) => game.crimstones as Record<string, MineralNode>,
  staticArt: (node, game, now) => {
    const stage = getCrimstoneStage(
      node.minesLeft ?? 5,
      now,
      crimstoneReadyAt(node, game),
    );
    return {
      texture: CRIMSTONE_STAGES[stage - 1],
      width: 24,
      bottom: 1,
      right: 4,
    };
  },
  strikeSheet: () => ({
    url: crimstoneSpark,
    frameWidth: 48,
    frameHeight: 48,
    fps: 24,
    steps: 6,
    bottom: 0,
    left: -4,
  }),
  dropSheet: (node, game, now) => ({
    url:
      getCrimstoneStage(
        node.minesLeft ?? 5,
        now,
        crimstoneReadyAt(node, game),
      ) === 6
        ? crimstoneThreeDrop
        : crimstoneOneDrop,
    frameWidth: 96,
    frameHeight: 48,
    fps: 20,
    steps: 10,
    bottom: -13,
    right: -63,
  }),
  yieldFx: () => ({ icon: ITEM_DETAILS.Crimstone.image, iconWidth: 9 }),
  allAssets: () => CRIMSTONE_STAGES,
  allSheets: () => [
    CRIMSTONE_CONFIG.strikeSheet({} as MineralNode),
    {
      url: crimstoneOneDrop,
      frameWidth: 96,
      frameHeight: 48,
      fps: 20,
      steps: 10,
    },
    {
      url: crimstoneThreeDrop,
      frameWidth: 96,
      frameHeight: 48,
      fps: 20,
      steps: 10,
    },
  ],
  recoverySeconds: 24 * 60 * 60,
  windows: (game) => getMineBoostWindows(game, "Crimstone Rock"),
  isDepleted: (node, game, now) => !canMine(node, "Crimstone Rock", game, now),
  hasTool: (game) =>
    isWearableActive({ name: "Crimstone Spikes Hair", game }) ||
    (game.inventory["Gold Pickaxe"] ?? new Decimal(0)).gte(1),
  toolToSelect: (game) =>
    isWearableActive({ name: "Crimstone Spikes Hair", game })
      ? undefined
      : "Gold Pickaxe",
  instaMine: () => false,
  collect: (bridge, id, node, game) => {
    const now = Date.now();
    const stage = getCrimstoneStage(
      node.minesLeft ?? 5,
      now,
      crimstoneReadyAt(node, game),
    );
    const amount = getCrimstoneDropAmount({
      game,
      rock: {
        ...node,
        minesLeft: stage === 1 ? 5 : (node.minesLeft ?? 5),
      } as never,
    }).amount.toNumber();
    bridge.dispatch("crimstoneRock.mined", { index: id });
    return Number(amount);
  },
};

export const SUNSTONE_CONFIG: MineralConfig = {
  key: "sunstone",
  hoverKind: "sunstone",
  dims: { width: 2, height: 2 },
  selectNodes: (game) => game.sunstones as Record<string, MineralNode>,
  staticArt: (node) => ({
    texture: SUNSTONE_STAGES[getSunstoneStage(node.minesLeft ?? 10) - 1],
    width: 24,
    bottom: 1,
    right: 4,
  }),
  strikeSheet: () => ({
    url: sunstoneSpark,
    frameWidth: 48,
    frameHeight: 48,
    fps: 24,
    steps: 6,
    bottom: 0,
    right: -4,
  }),
  dropSheet: () => ({
    url: sunstoneDrop,
    frameWidth: 96,
    frameHeight: 48,
    fps: 20,
    steps: 10,
    bottom: -13,
    right: -63,
  }),
  yieldFx: () => ({ icon: ITEM_DETAILS.Sunstone.image, iconWidth: 13 }),
  allAssets: () => SUNSTONE_STAGES,
  allSheets: () => [
    SUNSTONE_CONFIG.strikeSheet({} as MineralNode),
    SUNSTONE_CONFIG.dropSheet({} as MineralNode, {} as GameState, 0),
  ],
  recoverySeconds: 3 * 24 * 60 * 60,
  windows: (game) => getMineBoostWindows(game, "Sunstone Rock"),
  // Sunstone deliberately uses now <= readyAt, not canMine (Sunstone.tsx).
  isDepleted: (node, game, now) =>
    now <= getMineReadyAt(node as never, "Sunstone Rock", game),
  hasTool: (game) => (game.inventory["Gold Pickaxe"] ?? new Decimal(0)).gte(1),
  toolToSelect: () => "Gold Pickaxe",
  instaMine: () => false,
  collect: (bridge, id) => {
    bridge.dispatch("sunstoneRock.mined", { index: id });
    return 1; // Sunstone.tsx hard-codes the float amount
  },
};
