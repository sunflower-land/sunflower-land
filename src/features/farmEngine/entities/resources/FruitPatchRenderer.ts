import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import powerup from "assets/icons/level_up.png";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  PATCH_FRUIT_SEEDS,
  type PatchFruitName,
} from "features/game/types/fruits";
import { SEASONAL_SEEDS, type SeedName } from "features/game/types/seeds";
import { isFullMoonBerry } from "features/game/events/landExpansion/seedBought";
import {
  getFruitBoostWindows,
  getTurbofruitMixWindows,
  computeReadyAt,
} from "features/game/lib/boostWindows";
import { getFruitYield } from "features/game/events/landExpansion/fruitHarvested";
import {
  getRequiredAxeAmount as getRequiredFruitAxeAmount,
  getWoodReward,
} from "features/game/events/landExpansion/fruitTreeRemoved";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  getFruitTreeStatus,
  type FruitTreeStatus,
} from "features/island/fruit/FruitTree";
import { PATCH_FRUIT_LIFECYCLE } from "features/island/fruit/fruits";
import { SOIL_IMAGES } from "features/island/plots/lib/plant";
import { FRUIT_PATCH_VARIANTS } from "features/island/lib/alternateArt";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { queueImage } from "../../core/assets";
import { nativeScale } from "../../core/pixelArt";
import { playSound } from "../../core/sounds";
import { playYieldFloat } from "../../components/YieldFloat";
import { ProgressBarSprite } from "../../components/ProgressBarSprite";
import {
  ResourceNodeRenderer,
  type NodeObjects,
  type NodeSlice,
  type RenderContext,
} from "./ResourceNodeRenderer";
import type { ArtSpec } from "./lib";

/**
 * Fruit patches [island/fruit/FruitPatch.tsx + components]. Five stages via
 * the exported getFruitTreeStatus (Empty / Seedling / Replenishing /
 * Replenished / Dead), per-fruit art geometry, in-scene progress bar,
 * fertiliser overlays. Clicks dispatch the DOM's exact events.
 * Empty-patch clicks without a plantable seed raise the quick-select disc
 * row (bridge.quickSelect); harvests play the DOM's 0.82s shake.
 */

type FruitNode = GameState["fruitPatches"][string];

const FRUIT_FERTILISERS = ["Fruitful Blend", "Turbofruit Mix"];

const BUSHES: PatchFruitName[] = [
  "Tomato",
  "Blueberry",
  "Banana",
  "Celestine",
  "Lunara",
  "Duskberry",
];
const isBush = (name: PatchFruitName) => BUSHES.includes(name);

/** ReplenishingTree.tsx per-fruit geometry {bottom, left, width}. */
const REPLENISHING_GEOM: Partial<
  Record<PatchFruitName, { bottom: number; left: number; width: number }>
> = {
  Banana: { bottom: 8, left: 1.2, width: 31 },
  Lemon: { bottom: 10, left: 10, width: 12 },
  Tomato: { bottom: 10, left: 8, width: 14 },
  Celestine: { bottom: 8, left: 9, width: 15 },
  Lunara: { bottom: 8, left: 9, width: 15 },
  Duskberry: { bottom: 8, left: 9, width: 15 },
};

/** ReplenishedTree.tsx per-fruit geometry. */
const REPLENISHED_GEOM: Partial<
  Record<PatchFruitName, { bottom: number; left: number; width: number }>
> = {
  Banana: { bottom: 8, left: 1.2, width: 31 },
  Lemon: { bottom: 8, left: 7, width: 18 },
  Tomato: { bottom: 8, left: 7, width: 18 },
  Celestine: { bottom: 8, left: 9, width: 15 },
  Lunara: { bottom: 8, left: 9, width: 15 },
  Duskberry: { bottom: 8, left: 9, width: 15 },
};

const fruitGeom = (
  name: PatchFruitName,
  table: typeof REPLENISHING_GEOM,
): { bottom: number; left: number; width: number } =>
  table[name] ?? {
    bottom: 5,
    left: isBush(name) ? 4 : 3,
    width: isBush(name) ? 24 : 26,
  };

type PatchTiming = {
  startedAt: number;
  baseDurationMs?: number;
  legacyReadyAt: number;
  totalSeconds: number;
};

export class FruitPatchRenderer extends ResourceNodeRenderer<FruitNode> {
  protected readonly rendererKey = "fruitPatch";
  protected readonly tileDims = { width: 2, height: 2 };
  protected readonly hoverKind = "fruitPatch" as const;

  private bars = new Map<string, ProgressBarSprite>();
  private timings = new Map<string, PatchTiming>();
  private clocks = new Map<string, () => void>();
  private barTickMs = 0;

  protected selectNodes(game: GameState) {
    return game.fruitPatches;
  }

  protected collectAssets(slice: NodeSlice<FruitNode>) {
    const biome = this.biome(slice);
    queueImage(this.scene, FRUIT_PATCH_VARIANTS[biome]);
    queueImage(this.scene, SOIL_IMAGES[biome].regular);
    queueImage(this.scene, SUNNYSIDE.ui.emptyBar);
    [powerup, SUNNYSIDE.icons.stopwatch].forEach((url) =>
      queueImage(this.scene, url),
    );
    queueImage(this.scene, SUNNYSIDE.resource.wood); // dead-tree chop float
    for (const node of Object.values(slice.nodes)) {
      const name = node.fruit?.name;
      if (!name) continue;
      const lifecycle = PATCH_FRUIT_LIFECYCLE[biome][name];
      Object.values(lifecycle).forEach((url) =>
        queueImage(this.scene, url as string),
      );
      queueImage(this.scene, ITEM_DETAILS[name].image); // harvest float
    }
  }

  private biome(slice: NodeSlice<FruitNode>) {
    return getCurrentBiome(slice.island);
  }

  private windows(node: FruitNode, game: GameState) {
    return [
      ...getFruitBoostWindows(game),
      ...getTurbofruitMixWindows(node.fertiliser),
    ];
  }

  protected renderNode(
    id: string,
    node: FruitNode,
    objects: NodeObjects,
    ctx: RenderContext,
  ) {
    this.clocks.get(id)?.();
    this.clocks.delete(id);
    this.timings.delete(id);

    const game = this.game();
    const now = Date.now();
    const windows = this.windows(node, game);
    const status = getFruitTreeStatus(node.fruit, now, windows);

    // Persistent soil backdrop [FruitPatch.tsx].
    let backdrop = objects.extras.get("backdrop") as
      | Phaser.GameObjects.Image
      | undefined;
    if (!backdrop) {
      backdrop = this.scene.add
        .image(0, 0, FRUIT_PATCH_VARIANTS[ctx.biome])
        .setOrigin(0, 0);
      objects.extras.set("backdrop", backdrop);
    }
    backdrop.setTexture(FRUIT_PATCH_VARIANTS[ctx.biome]);
    nativeScale(backdrop, 30);
    backdrop.setPosition(ctx.box.x + 1, ctx.box.y + 2);
    backdrop.setDepth(ctx.depth);

    // Overlays reset each render.
    for (const key of ["fert1", "fert2"]) {
      objects.extras.get(key)?.destroy();
      objects.extras.delete(key);
    }

    const name = node.fruit?.name;
    const lifecycle = name ? PATCH_FRUIT_LIFECYCLE[ctx.biome][name] : undefined;

    const art = this.artFor(status, node, ctx, lifecycle);
    this.setArt(objects, { ...ctx, depth: ctx.depth + 1 }, art);

    const growing =
      status.stage === "Seedling" || status.stage === "Replenishing";

    if (growing && node.fruit) {
      const startedAt = node.fruit.harvestedAt || node.fruit.plantedAt;
      const timing: PatchTiming = {
        startedAt,
        baseDurationMs: node.fruit.baseDurationMs,
        legacyReadyAt: startedAt + (status.totalSeconds ?? 0) * 1000,
        totalSeconds: status.totalSeconds ?? 0,
      };
      this.timings.set(id, timing);

      // Stage flips (Seedling art thresholds + the Replenished flip).
      this.clocks.set(
        id,
        this.scene.clock.register(
          `fruitPatch-${id}`,
          {
            startedAt,
            baseDurationMs: node.fruit.baseDurationMs,
            windows,
            legacyReadyAt: timing.legacyReadyAt,
            stageFractions: status.stage === "Seedling" ? [0.25, 0.5, 1] : [1],
          },
          () =>
            void this.sync(this.bridge.select((state) => this.selector(state))),
        ),
      );

      // Fertiliser overlays [FruitPatch.tsx].
      const fert = node.fertiliser?.name;
      if (fert === "Fruitful Blend") {
        this.addOverlay(objects, "fert1", powerup, 5, ctx, {
          bottom: 16,
          right: 2,
        });
      } else if (fert === "Turbofruit Mix") {
        this.addOverlay(objects, "fert1", powerup, 5, ctx, {
          bottom: 16,
          left: 2,
        });
        this.addOverlay(objects, "fert2", SUNNYSIDE.icons.stopwatch, 6, ctx, {
          bottom: 16,
          right: 2,
        });
      }

      if (this.bridge.ui.get().showTimers) {
        const bar =
          this.bars.get(id) ??
          new ProgressBarSprite(this.scene, {
            x: ctx.box.x + 8,
            y: ctx.box.y + ctx.box.height - 7 - 7,
            formatLength: "short",
            depth: ctx.depth + 2,
          });
        bar.setPosition(ctx.box.x + 8, ctx.box.y + ctx.box.height - 7 - 7);
        this.bars.set(id, bar);
        this.updateBar(id);
      } else {
        this.bars.get(id)?.destroy();
        this.bars.delete(id);
      }
      return;
    }

    this.bars.get(id)?.destroy();
    this.bars.delete(id);
  }

  private artFor(
    status: FruitTreeStatus,
    node: FruitNode,
    ctx: RenderContext,
    lifecycle: Record<string, string> | undefined,
  ): ArtSpec {
    const name = node.fruit?.name;
    switch (status.stage) {
      case "Empty":
        return {
          texture: SOIL_IMAGES[ctx.biome].regular,
          width: 16,
          left: 8,
          bottom: 9,
        };
      case "Dead": {
        const bush = name ? isBush(name) : false;
        return {
          texture: lifecycle?.dead ?? SOIL_IMAGES[ctx.biome].regular,
          width: bush ? 16 : 24,
          left: bush ? 8 : 4,
          bottom: bush ? 9 : 5,
        };
      }
      case "Seedling": {
        const pct =
          100 - ((status.timeLeft ?? 0) / (status.totalSeconds || 1)) * 100;
        const stage = pct >= 50 ? "almost" : pct >= 25 ? "halfway" : "seedling";
        return {
          texture: lifecycle?.[stage] ?? SOIL_IMAGES[ctx.biome].regular,
          width: 16,
          height: 26,
          left: 8,
          bottom: 9,
        };
      }
      case "Replenishing": {
        const geom = fruitGeom(name as PatchFruitName, REPLENISHING_GEOM);
        return { texture: lifecycle?.harvested ?? "", ...geom };
      }
      case "Replenished": {
        const geom = fruitGeom(name as PatchFruitName, REPLENISHED_GEOM);
        return { texture: lifecycle?.ready ?? "", ...geom };
      }
    }
  }

  private addOverlay(
    objects: NodeObjects,
    key: string,
    texture: string,
    width: number,
    ctx: RenderContext,
    pos: { top?: number; left?: number; bottom?: number; right?: number },
  ) {
    const image = this.scene.add
      .image(0, 0, texture)
      .setOrigin(0, 0)
      .setDepth(ctx.depth + 3);
    nativeScale(image, width);
    const x =
      pos.left !== undefined
        ? ctx.box.x + pos.left
        : ctx.box.x + ctx.box.width - (pos.right ?? 0) - image.displayWidth;
    const y =
      pos.top !== undefined
        ? ctx.box.y + pos.top
        : ctx.box.y + ctx.box.height - (pos.bottom ?? 0) - image.displayHeight;
    image.setPosition(x, y);
    objects.extras.set(key, image);
  }

  private updateBar(id: string) {
    const bar = this.bars.get(id);
    const timing = this.timings.get(id);
    if (!bar || !timing) return;

    const game = this.game();
    const node = game.fruitPatches[id];
    if (!node?.fruit) return;
    const now = Date.now();
    const windows = this.windows(node, game);
    const status = getFruitTreeStatus(node.fruit, now, windows);
    if (status.stage !== "Seedling" && status.stage !== "Replenishing") {
      void this.sync(this.bridge.select((state) => this.selector(state)));
      return;
    }

    const timeLeft = status.timeLeft ?? 0;
    const total = status.totalSeconds || 1;
    const percentage = Math.min(
      Math.max(100 - (timeLeft / total) * 100, 0),
      100,
    );
    const readyAt =
      timing.baseDurationMs !== undefined
        ? computeReadyAt({
            startedAt: timing.startedAt,
            baseDurationMs: timing.baseDurationMs,
            windows,
          })
        : timing.legacyReadyAt;
    bar.set(percentage, Math.max((readyAt - now) / 1000, 0));
  }

  update(_time: number, delta: number) {
    if (this.bars.size === 0) return;
    this.barTickMs += delta;
    if (this.barTickMs < 1000) return;
    this.barTickMs = 0;
    for (const id of this.bars.keys()) this.updateBar(id);
  }

  /** Port of FruitPatch.tsx's click branches. */
  protected onNodeClick(id: string) {
    const machine = this.bridge.select((state) => state);
    const game = machine.context.state;
    const node = game.fruitPatches[id];
    if (!node) return;

    const now = Date.now();
    const windows = this.windows(node, game);
    const status = getFruitTreeStatus(node.fruit, now, windows);
    const selected = this.bridge.ui.get().selectedItem;

    if (status.stage === "Empty") {
      if (selected && FRUIT_FERTILISERS.includes(selected)) {
        this.bridge.dispatch("fruitPatch.fertilised", {
          patchID: id,
          fertiliser: selected,
        });
        return;
      }
      if (
        selected &&
        selected in PATCH_FRUIT_SEEDS &&
        !SEASONAL_SEEDS[game.season.season].includes(selected as SeedName) &&
        !isFullMoonBerry(selected as SeedName)
      ) {
        this.bridge.farmModal.open("seasonalSeed");
        return;
      }
      // [FruitPatch.tsx plantTree] no plantable seed in hand -> the
      // quick-select disc row (also when the selected seed's inventory is 0).
      if (
        this.bridge.ui.get().enableQuickSelect &&
        (!selected ||
          !(selected in PATCH_FRUIT_SEEDS) ||
          !game.inventory[selected]?.gte(1))
      ) {
        // Deferred past this pointerdown: QuickSelect's outside-click closer
        // is a document mousedown listener, and mounting mid-event would let
        // the SAME mousedown bubble up and instantly close it (the DOM opens
        // from click, which fires after mousedown).
        setTimeout(
          () =>
            this.bridge.quickSelect.set({
              anchorId: this.anchorId(id),
              patchId: id,
            }),
          0,
        );
        return;
      }
      if (!selected || !(selected in PATCH_FRUIT_SEEDS)) return;
      this.bridge.dispatch("fruit.planted", { index: id, seed: selected });
      playSound("plant");
      return;
    }

    if (status.stage === "Dead") {
      const { amount: axesNeeded } = getRequiredFruitAxeAmount(
        game.inventory,
        game,
      );
      const hasAxes = axesNeeded <= 0 || !!game.inventory.Axe?.gte(axesNeeded);
      if (!hasAxes) return;
      if (
        !isCollectibleBuilt({ name: "Foreman Beaver", game }) &&
        !game.bumpkin?.skills["No Axe No Worries"]
      ) {
        this.bridge.selectItem("Axe");
      }
      this.bridge.dispatch("fruitTree.removed", {
        index: id,
        selectedItem: "Axe",
      });
      playSound("tree_fall");
      if (this.bridge.ui.get().showAnimations) {
        const { woodReward } = getWoodReward({ state: game });
        const box = this.boxOf(id) ?? this.boxFor(node);
        if (woodReward) {
          playYieldFloat(this.scene, {
            x: box.x + 4,
            y: box.y - 2,
            amount: woodReward,
            icon: SUNNYSIDE.resource.wood,
            iconWidth: 11,
            depth: box.y + 100_000,
            durationMs: 3000,
          });
        }
      }
      return;
    }

    if (status.stage === "Replenished" && node.fruit) {
      const name = node.fruit.name;
      const counter = game.farmActivity[`${name} Harvested`] ?? 0;
      const amount =
        node.fruit.amount ??
        Number(
          getFruitYield({
            game,
            name,
            fertiliser: node.fertiliser?.name,
            prngArgs: { farmId: machine.context.farmId, counter },
            now: Date.now(),
          }).amount,
        );
      this.shakeNode(id);
      this.bridge.dispatch("fruit.harvested", { index: id });
      playSound("harvest");
      if (this.bridge.ui.get().showAnimations) {
        const box = this.boxOf(id) ?? this.boxFor(node);
        playYieldFloat(this.scene, {
          x: box.x + 4,
          y: box.y - 2,
          amount,
          icon: ITEM_DETAILS[name as InventoryItemName].image,
          iconWidth: 10,
          depth: box.y + 100_000,
          durationMs: 3000,
        });
      }
      return;
    }

    // Growing: a selected fertiliser applies [FruitPatch.tsx fertilise()].
    if (selected && FRUIT_FERTILISERS.includes(selected)) {
      this.bridge.dispatch("fruitPatch.fertilised", {
        patchID: id,
        fertiliser: selected,
      });
    }
  }

  protected onDestroy() {
    this.bars.forEach((bar) => bar.destroy());
    this.bars.clear();
    this.clocks.forEach((cancel) => cancel());
    this.clocks.clear();
    this.timings.clear();
    super.onDestroy();
  }
}
