import { SUNNYSIDE } from "assets/sunnyside";
import type { GameState } from "features/game/types/game";
import { FLOWER_SEEDS, FLOWERS } from "features/game/types/flowers";
import {
  computeReadyAt,
  getEffectiveSpeedAt,
  getFlowerBoostWindows,
  workAccruedAt,
} from "features/game/lib/boostWindows";
import { getDisplaySeconds } from "features/game/lib/timerDisplay";
import { FLOWER_VARIANTS } from "features/island/lib/alternateArt";

const flowerArt = (...args: Parameters<typeof FLOWER_VARIANTS>): string =>
  FLOWER_VARIANTS(...args) ?? "";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { queueImage } from "../../core/assets";
import { ProgressBarSprite } from "../../components/ProgressBarSprite";
import {
  ResourceNodeRenderer,
  type NodeObjects,
  type NodeSlice,
  type RenderContext,
} from "./ResourceNodeRenderer";

/**
 * Flower beds [island/flowers/FlowerBed.tsx]. One 48px-wide image per state
 * from the FLOWER_VARIANTS CDN map (empty bed = the "flower_bed" stage),
 * growth stages at 44/66/100%, in-scene progress bar, boost lightning.
 * Clicks: empty -> plant modal; growing -> insta-grow modal; ready -> the
 * congratulations flow for new flowers/rewards, else a straight harvest.
 */

type FlowerBedNode = GameState["flowers"]["flowerBeds"][string];

type BedTiming = {
  startedAt: number;
  baseDurationMs?: number;
  legacyReadyAt: number;
  totalSeconds: number;
};

const growthStage = (pct: number, dirty: boolean | undefined) => {
  if (dirty) return "sprout";
  if (pct >= 100) return "ready";
  if (pct >= 66) return "almost";
  if (pct >= 44) return "halfway";
  return "sprout";
};

export class FlowerBedRenderer extends ResourceNodeRenderer<FlowerBedNode> {
  protected readonly rendererKey = "flowerBed";
  protected readonly tileDims = { width: 3, height: 1 };
  protected readonly hoverKind = "flowerBed" as const;

  private bars = new Map<string, ProgressBarSprite>();
  private timings = new Map<string, BedTiming>();
  private clocks = new Map<string, () => void>();
  private barTickMs = 0;

  protected selectNodes(game: GameState) {
    return game.flowers.flowerBeds;
  }

  protected collectAssets(slice: NodeSlice<FlowerBedNode>) {
    queueImage(this.scene, SUNNYSIDE.ui.emptyBar);
    queueImage(this.scene, SUNNYSIDE.icons.lightning);
    const biome = this.currentBiome(slice);
    queueImage(
      this.scene,
      flowerArt(biome, slice.season, "Red Pansy", "flower_bed"),
    );
    for (const node of Object.values(slice.nodes)) {
      const flower = node.flower;
      if (!flower) continue;
      for (const stage of ["sprout", "halfway", "almost", "ready"] as const) {
        queueImage(
          this.scene,
          flowerArt(biome, slice.season, flower.name, stage),
        );
      }
    }
  }

  private currentBiome(slice: NodeSlice<FlowerBedNode>) {
    return getCurrentBiome(slice.island);
  }

  private timingFor(node: FlowerBedNode): BedTiming | null {
    const flower = node.flower;
    if (!flower) return null;
    const growSeconds = FLOWER_SEEDS[FLOWERS[flower.name].seed].plantSeconds;
    const baseDurationMs = flower.baseDurationMs;
    const totalSeconds =
      baseDurationMs !== undefined
        ? (baseDurationMs + (flower.boostedTime ?? 0)) / 1000
        : growSeconds;
    return {
      startedAt: flower.plantedAt,
      baseDurationMs,
      legacyReadyAt: flower.plantedAt + growSeconds * 1000,
      totalSeconds,
    };
  }

  private secondsLeft(timing: BedTiming, game: GameState, now: number) {
    if (timing.baseDurationMs !== undefined) {
      const done = workAccruedAt({
        startedAt: timing.startedAt,
        at: now,
        windows: getFlowerBoostWindows(game),
      });
      return Math.max((timing.baseDurationMs - done) / 1000, 0);
    }
    return Math.max((timing.legacyReadyAt - now) / 1000, 0);
  }

  protected renderNode(
    id: string,
    node: FlowerBedNode,
    objects: NodeObjects,
    ctx: RenderContext,
  ) {
    this.clocks.get(id)?.();
    this.clocks.delete(id);
    this.timings.delete(id);

    objects.extras.get("boost")?.destroy();
    objects.extras.delete("boost");

    const game = this.game();
    const now = Date.now();
    const flower = node.flower;

    if (!flower) {
      this.bars.get(id)?.destroy();
      this.bars.delete(id);
      this.setArt(objects, ctx, {
        texture: flowerArt(ctx.biome, ctx.season, "Red Pansy", "flower_bed"),
        width: 48,
        bottom: 0,
        left: 0,
      });
      return;
    }

    const timing = this.timingFor(node);
    if (!timing) return;
    this.timings.set(id, timing);

    const secondsLeft = this.secondsLeft(timing, game, now);
    const pct =
      timing.totalSeconds <= 0
        ? 100
        : 100 - (secondsLeft / timing.totalSeconds) * 100;
    const stage = growthStage(pct, flower.dirty);

    this.setArt(objects, ctx, {
      texture: flowerArt(ctx.biome, ctx.season, flower.name, stage),
      width: 48,
      bottom: 0,
      left: 0,
    });

    const isGrowing = secondsLeft > 0;
    if (!isGrowing) {
      this.bars.get(id)?.destroy();
      this.bars.delete(id);
      return;
    }

    // Boost lightning [FlowerBed.tsx].
    const windows = getFlowerBoostWindows(game);
    if (getEffectiveSpeedAt({ at: now, windows }) > 1) {
      const icon = this.scene.add
        .image(
          ctx.box.x + ctx.box.width - 2 - 7,
          ctx.box.y + 2,
          SUNNYSIDE.icons.lightning,
        )
        .setOrigin(0, 0)
        .setDepth(ctx.depth + 2);
      icon.setScale(7 / icon.width);
      objects.extras.set("boost", icon);
    }

    // Stage flips at 44/66/100% of work.
    this.clocks.set(
      id,
      this.scene.clock.register(
        `flowerBed-${id}`,
        {
          startedAt: timing.startedAt,
          baseDurationMs: timing.baseDurationMs,
          windows,
          legacyReadyAt: timing.legacyReadyAt,
          stageFractions: [0.44, 0.66, 1],
        },
        () =>
          void this.sync(this.bridge.select((state) => this.selector(state))),
      ),
    );

    // [FlowerBed.tsx] bar at bottom 3 / left 16 / width 16.
    if (this.bridge.ui.get().showTimers) {
      const barX = ctx.box.x + 16;
      const barY = ctx.box.y + ctx.box.height - 7 - 3;
      const bar =
        this.bars.get(id) ??
        new ProgressBarSprite(this.scene, {
          x: barX,
          y: barY,
          formatLength: "short",
          depth: ctx.depth + 2,
        });
      bar.setPosition(barX, barY);
      this.bars.set(id, bar);
      this.updateBar(id);
    } else {
      this.bars.get(id)?.destroy();
      this.bars.delete(id);
    }
  }

  private updateBar(id: string) {
    const bar = this.bars.get(id);
    const timing = this.timings.get(id);
    if (!bar || !timing) return;

    const game = this.game();
    const node = game.flowers.flowerBeds[id];
    if (!node?.flower) return;
    const now = Date.now();
    const secondsLeft = this.secondsLeft(timing, game, now);
    if (secondsLeft <= 0) {
      void this.sync(this.bridge.select((state) => this.selector(state)));
      return;
    }
    const pct =
      timing.totalSeconds <= 0
        ? 100
        : Math.min(100 - (secondsLeft / timing.totalSeconds) * 100, 100);
    const readyAt =
      timing.baseDurationMs !== undefined
        ? computeReadyAt({
            startedAt: timing.startedAt,
            baseDurationMs: timing.baseDurationMs,
            windows: getFlowerBoostWindows(game),
          })
        : timing.legacyReadyAt;
    const displaySeconds = node.flower.dirty
      ? 0
      : getDisplaySeconds({
          showActualTime: this.bridge.ui.get().showActualTime,
          workLeftSeconds: secondsLeft,
          countdownSeconds: Math.max((readyAt - now) / 1000, 0),
        });
    bar.set(pct, displaySeconds);
  }

  update(_time: number, delta: number) {
    if (this.bars.size === 0) return;
    this.barTickMs += delta;
    if (this.barTickMs < 1000) return;
    this.barTickMs = 0;
    for (const id of this.bars.keys()) this.updateBar(id);
  }

  /** [FlowerBed.tsx handlePlotClick] */
  protected onNodeClick(id: string) {
    const game = this.game();
    const node = game.flowers.flowerBeds[id];
    if (!node) return;

    const flower = node.flower;
    if (!flower) {
      this.bridge.farmModal.open("flowerBed", id);
      return;
    }

    const timing = this.timingFor(node);
    const secondsLeft = timing ? this.secondsLeft(timing, game, Date.now()) : 0;

    if (secondsLeft > 0) {
      this.bridge.farmModal.open("flowerInstaGrow", id);
      return;
    }

    const hasHarvestedBefore =
      (game.farmActivity[`${flower.name} Harvested`] ?? 0) > 0;
    if (!hasHarvestedBefore || flower.reward) {
      this.bridge.farmModal.open("flowerCongratulations", id);
      return;
    }

    this.bridge.dispatch({ type: "flower.harvested", id });
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
