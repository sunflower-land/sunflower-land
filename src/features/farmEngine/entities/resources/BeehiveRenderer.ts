import type Phaser from "phaser";
import beehiveArt from "assets/sfts/beehive.webp";
import honeyDrop from "assets/sfts/honey_drop.webp";
import beeIcon from "assets/icons/bee.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import type { GameState } from "features/game/types/game";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { DEFAULT_HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";
import {
  getActiveFlower,
  getCurrentHoneyProduced,
} from "features/game/lib/beehiveProduction";
import { queueImage } from "../../core/assets";
import { ProgressBarSprite } from "../../components/ProgressBarSprite";
import {
  ResourceNodeRenderer,
  type NodeObjects,
  type NodeSlice,
  type RenderContext,
} from "./ResourceNodeRenderer";

/**
 * Beehives [resources/beehive/Beehive.tsx + beehiveMachine.ts]. The DOM's
 * per-hive xstate machine reduces to a per-second tick here: recompute
 * honeyProduced, flip the honey-drop indicator when full, and fly a bee to a
 * newly-attached flower and back (the react-spring flight as a tween chain
 * with the DOM's exact geometry and durations).
 *
 * Clicks: nothing while empty; the honey-level modal while filling; harvest
 * when full (with the swarm modal when a swarm pops).
 */

type HiveNode = GameState["beehives"][string];

const BEE_SPEED_PX_PER_S = 200 / 3.5; // Bee.tsx getFlightDuration
const FLOWER_BED_TILES = RESOURCE_DIMENSIONS["Flower Bed"].width;

export class BeehiveRenderer extends ResourceNodeRenderer<HiveNode> {
  protected readonly rendererKey = "beehive";
  protected readonly tileDims = { width: 1, height: 1 };
  protected readonly hoverKind = "beehive" as const;

  private bars = new Map<string, ProgressBarSprite>();
  private activeFlowerIds = new Map<string, string | undefined>();
  private flyingBees = new Map<string, Phaser.GameObjects.Image>();
  private tickMs = 0;

  protected selectNodes(game: GameState) {
    // The DOM early-returns hives without coordinates.
    return Object.fromEntries(
      Object.entries(game.beehives).filter(
        ([, hive]) => hive.x !== undefined && hive.y !== undefined,
      ),
    );
  }

  protected collectAssets(_slice: NodeSlice<HiveNode>) {
    [beehiveArt, honeyDrop, beeIcon, SUNNYSIDE.ui.emptyBar].forEach((url) =>
      queueImage(this.scene, url),
    );
  }

  protected renderNode(
    id: string,
    node: HiveNode,
    objects: NodeObjects,
    ctx: RenderContext,
  ) {
    this.setArt(objects, ctx, {
      texture: beehiveArt,
      width: 16,
      bottom: 0,
      left: 0,
    });

    // Honey-drop ready indicator (top 0, right 2), scale-toggled.
    let drop = objects.extras.get("drop") as
      | Phaser.GameObjects.Image
      | undefined;
    if (!drop) {
      drop = this.scene.add.image(0, 0, honeyDrop).setOrigin(0, 0);
      objects.extras.set("drop", drop);
    }
    drop.setDepth(ctx.depth + 1);
    drop.setScale(7 / drop.width);
    drop.setPosition(ctx.box.x + ctx.box.width - 2 - 7, ctx.box.y);

    this.refreshHive(id, node, ctx, true);
  }

  /** Per-second state: honey fill, ready indicator, new-flower bee flight. */
  private refreshHive(
    id: string,
    node: HiveNode,
    ctx: RenderContext,
    initial = false,
  ) {
    const objects = this.nodes.get(id);
    if (!objects) return;
    const now = Date.now();
    const honeyProduced = getCurrentHoneyProduced(node, now);
    const honeyReady = honeyProduced >= DEFAULT_HONEY_PRODUCTION_TIME;

    const drop = objects.extras.get("drop") as
      | Phaser.GameObjects.Image
      | undefined;
    drop?.setVisible(honeyReady);

    // Quantity bar [Beehive.tsx: wrapper top 13.2, width 15].
    const showBar =
      this.bridge.ui.get().showTimers && honeyProduced > 0 && !honeyReady;
    const bar = this.bars.get(id);
    if (showBar) {
      const barX = ctx.box.x + 0.5;
      const barY = ctx.box.y + 13.2;
      const sprite =
        bar ??
        new ProgressBarSprite(this.scene, {
          x: barX,
          y: barY,
          type: "quantity",
          formatLength: "short",
          depth: ctx.depth + 1,
        });
      sprite.setPosition(barX, barY);
      sprite.set((honeyProduced / DEFAULT_HONEY_PRODUCTION_TIME) * 100, 0);
      this.bars.set(id, sprite);
    } else if (bar) {
      bar.destroy();
      this.bars.delete(id);
    }

    // Newly attached flower -> bee flight [Bee.tsx].
    const active = getActiveFlower(node, now);
    const prev = this.activeFlowerIds.get(id);
    if (!initial && active?.id && active.id !== prev) {
      this.flyBee(id, node, ctx, active.id);
    }
    this.activeFlowerIds.set(id, active?.id);
  }

  /** The react-spring bee flight as a tween chain (geometry from Bee.tsx). */
  private flyBee(
    id: string,
    node: HiveNode,
    ctx: RenderContext,
    flowerId: string,
  ) {
    this.flyingBees.get(id)?.destroy();

    const game = this.game();
    const flower = game.flowers.flowerBeds[flowerId];
    if (!flower || flower.x === undefined || flower.y === undefined) return;
    if (node.x === undefined || node.y === undefined) return;

    // CSS-px maths from Bee.tsx, converted to world px (/ PIXEL_SCALE).
    const beeWidthCss = PIXEL_SCALE * 7;
    const xOffsetCss = (GRID_WIDTH_PX * FLOWER_BED_TILES) / 2 - beeWidthCss / 2;
    const dxCss = (flower.x - node.x) * GRID_WIDTH_PX + xOffsetCss;
    const dyCss = (node.y - flower.y) * GRID_WIDTH_PX - 20;
    const dx = dxCss / PIXEL_SCALE;
    const dy = dyCss / PIXEL_SCALE;
    const distanceCss = Math.sqrt(dxCss * dxCss + dyCss * dyCss);
    const flightMs = (distanceCss / BEE_SPEED_PX_PER_S) * 1000;
    const direction = flower.x < node.x ? 1 : -1;

    const homeX = ctx.box.x + 13 / PIXEL_SCALE + 3.5;
    const homeY = ctx.box.y - 13 / PIXEL_SCALE + 3.5;

    const bee = this.scene.add
      .image(homeX, homeY, beeIcon)
      .setOrigin(0.5, 0.5)
      .setDepth(ctx.box.y + 100_000)
      .setFlipX(direction === -1)
      .setScale(0);
    this.flyingBees.set(id, bee);
    const beeScale = 7 / bee.width;

    this.scene.tweens.chain({
      targets: bee,
      tweens: [
        { scale: beeScale, duration: 500 },
        {
          x: ctx.box.x + dx + 3.5,
          y: ctx.box.y + dy + 3.5,
          duration: flightMs,
          ease: "Sine.easeInOut",
        },
        { scale: beeScale, duration: 1000 }, // hover at the flower
        {
          x: homeX,
          y: homeY,
          duration: flightMs,
          ease: "Sine.easeInOut",
          onStart: () => bee.setFlipX(direction === 1),
        },
        {
          scale: 0,
          duration: 500,
          onComplete: () => {
            bee.destroy();
            this.flyingBees.delete(id);
          },
        },
      ],
    });
  }

  update(_time: number, delta: number) {
    this.tickMs += delta;
    if (this.tickMs < 1000) return;
    this.tickMs = 0;

    const slice = this.bridge.select((state) => this.selector(state));
    for (const [id, node] of Object.entries(slice.nodes)) {
      const box = this.boxFor(node);
      this.refreshHive(id, node, {
        box,
        depth: box.y,
        biome: "Basic Biome",
        season: slice.season,
      });
    }
  }

  /** [Beehive.tsx handleHiveClick + handleHarvestHoney] */
  protected onNodeClick(id: string) {
    const game = this.game();
    const node = game.beehives[id];
    if (!node) return;

    const honeyProduced = getCurrentHoneyProduced(node, Date.now());
    if (!honeyProduced) return;

    if (honeyProduced >= DEFAULT_HONEY_PRODUCTION_TIME) {
      const hadSwarm = node.swarm;
      const newState = this.bridge.dispatch("beehive.harvested", { id });
      const updated = newState.context.state.beehives[id];
      if (hadSwarm && updated?.swarm === false) {
        this.bridge.farmModal.open("beehiveSwarm");
      }
      return;
    }

    this.bridge.farmModal.open("beehiveLevel", id);
  }

  protected onDestroy() {
    this.bars.forEach((bar) => bar.destroy());
    this.bars.clear();
    this.flyingBees.forEach((bee) => bee.destroy());
    this.flyingBees.clear();
    this.activeFlowerIds.clear();
    super.onDestroy();
  }
}
