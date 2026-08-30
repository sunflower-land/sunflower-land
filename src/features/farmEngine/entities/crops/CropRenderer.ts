import Phaser from "phaser";
import { v4 as uuidv4 } from "uuid";
import { SUNNYSIDE } from "assets/sunnyside";
import powerup from "assets/icons/level_up.png";
import tornadoIcon from "assets/icons/tornado.webp";
import tsunamiIcon from "assets/icons/tsunami.webp";
import greatFreezeIcon from "assets/icons/great-freeze.webp";
import locust from "assets/icons/locust.webp";
import sunshower from "assets/icons/sunshower.webp";
import bee from "assets/icons/bee.webp";
import { getActiveCalendarEvent } from "features/game/types/calendar";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState } from "features/game/types/game";
import { CROPS, type CropName } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "lib/object";
import {
  getAffectedWeather,
  isPlotFertile,
} from "features/game/events/landExpansion/plant";
import {
  getCropYieldAmount,
  getReward,
  isReadyToHarvest,
} from "features/game/events/landExpansion/harvest";
import {
  computeReadyAt,
  getCropFertiliserWindows,
  getCropPlotBoostWindows,
  getEffectiveSpeedAt,
  workAccruedAt,
  type BoostWindow,
} from "features/game/lib/boostWindows";
import { getDisplaySeconds } from "features/game/lib/timerDisplay";
import { isSeasonedPlayer } from "features/game/lib/seasonedPlayer";
import { CROP_COMPOST } from "features/game/types/composters";
import {
  isCropSeed,
  SEASONAL_SEEDS,
  type SeedName,
} from "features/game/types/seeds";
import { CHAPTER_CROP_WEEK_SEED } from "features/game/types/chapterCropWeek";
import {
  CROP_LIFECYCLE,
  HARVEST_PROC_ANIMATION,
  SOIL_IMAGES,
} from "features/island/plots/lib/plant";
import { getYieldColour } from "features/island/plots/Plot";
import {
  getGrowthStage,
  getHarvestMetrics,
} from "features/island/plots/components/FertilePlot";
import {
  getCurrentBiome,
  type LandBiomeName,
} from "features/island/biomes/biomes";
import { gameAnalytics } from "lib/gameAnalytics";
import { queueImage, queueSpritesheet, runLoader } from "../../core/assets";
import { nativeScale } from "../../core/pixelArt";
import { makeClickable } from "../../core/clickable";
import { readNodeTimer } from "../../core/clock";
import { gridToWorld, WORLD_TILE } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { playSound } from "../../core/sounds";
import { playYieldFloat } from "../../components/YieldFloat";
import { ProgressBarSprite } from "../../components/ProgressBarSprite";
import type { Unsubscribe } from "../../bridge/subscriptions";
import { EntityRenderer } from "../EntityRenderer";

/**
 * Crop plots [Plot.tsx / FertilePlot.tsx / Soil.tsx]. The template entity
 * renderer: one instance reconciles every plot by id. Everything on the game
 * layer is Phaser — soil/crop-stage art, the harvest firework, the progress
 * bar, corner status icons and the floating +N; growth-stage flips come from
 * the FarmClock (one pass a second, no per-plot timers). React keeps only the
 * hover TimerPopover (CropsUI) and the chest-reward flow (ResourcesUI), fed
 * through per-plot anchors and the bridge's hover/chestReward channels. Every
 * click dispatches the same machine events the DOM plot does.
 *
 * DEFERRED (tracked in the checklist): calendar-weather plot states
 * (tornado/tsunami/great-freeze art), the tutorial dig/click pulsate icons.
 */

type Slice = {
  crops: GameState["crops"];
  island: GameState["island"];
  waterWell: GameState["waterWell"];
  buildings: GameState["buildings"];
  // Boost windows and fertility read wider state; collectibles is the ref
  // that changes when boost sources are placed or removed.
  collectibles: GameState["collectibles"];
};

type PlotTiming = {
  startedAt: number;
  baseDurationMs?: number;
  windows: BoostWindow[];
  legacyReadyAt: number;
  harvestSeconds: number;
};

type PlotObjects = {
  art: Phaser.GameObjects.Image;
  zone: Phaser.GameObjects.Zone;
  unregisterClock?: () => void;
  bar?: ProgressBarSprite;
  timing?: PlotTiming;
  cornerIcons: Phaser.GameObjects.Image[];
  /** Tutorial dig/click helper [Plot.tsx harvestCount/plantCount gates]. */
  tutorialIcon?: Phaser.GameObjects.Image;
  tutorialTween?: Phaser.Tweens.Tween;
};

const ART_TOP_OFFSET = -12; // fertile soil/crop art rides above the tile
const DRY_TOP_OFFSET = 2; // non-fertile soil sits low in it

export const cropAnchorId = (id: string) => `plot-${id}`;

export class CropRenderer extends EntityRenderer<Slice> {
  private plots = new Map<string, PlotObjects>();
  // Per-plot, like the DOM's per-component clickedAt — a global buffer would
  // swallow rapid taps across DIFFERENT plots.
  private clickedAt = new Map<string, number>();
  private barTickMs = 0;
  private unsubscribeUi: Unsubscribe | undefined;

  mount() {
    super.mount();
    // showTimers / showActualTime changes re-shape the bars.
    this.unsubscribeUi = this.bridge.ui.subscribe(
      () => void this.sync(this.bridge.select((state) => this.selector(state))),
    );
  }

  selector(state: MachineState): Slice {
    const game = state.context.state;
    return {
      crops: game.crops,
      island: game.island,
      waterWell: game.waterWell,
      buildings: game.buildings,
      collectibles: game.collectibles,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.crops === b.crops &&
    a.island === b.island &&
    a.waterWell === b.waterWell &&
    a.buildings === b.buildings &&
    a.collectibles === b.collectibles;

  async sync(slice: Slice) {
    const token = this.beginSync();
    const biome = getCurrentBiome(slice.island);

    queueImage(this.scene, SOIL_IMAGES[biome].regular);
    queueImage(this.scene, SOIL_IMAGES[biome].dry);
    queueImage(this.scene, SUNNYSIDE.ui.emptyBar);
    [
      SUNNYSIDE.icons.lightning,
      SUNNYSIDE.icons.stopwatch,
      powerup,
      locust,
      sunshower,
      bee,
      tornadoIcon,
      tsunamiIcon,
      greatFreezeIcon,
      SUNNYSIDE.icons.dig_icon,
      SUNNYSIDE.icons.click_icon,
    ].forEach((url) => queueImage(this.scene, url));
    for (const plot of Object.values(slice.crops)) {
      const name = plot.crop?.name;
      if (!name) continue;
      const lifecycle = CROP_LIFECYCLE[biome][name];
      [
        lifecycle.seedling,
        lifecycle.halfway,
        lifecycle.almost,
        lifecycle.ready,
      ].forEach((url) => queueImage(this.scene, url));
    }
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    // Remove plots that no longer exist.
    for (const [id, objects] of this.plots) {
      if (slice.crops[id]) continue;
      objects.unregisterClock?.();
      objects.art.destroy();
      objects.zone.destroy();
      objects.bar?.destroy();
      objects.tutorialTween?.remove();
      objects.tutorialIcon?.destroy();
      this.clearCornerIcons(objects);
      this.bridge.anchors.removeAnchor(cropAnchorId(id));
      this.plots.delete(id);
      this.clickedAt.delete(id);
    }

    for (const id of Object.keys(slice.crops)) {
      this.syncPlot(id, slice, biome);
    }
  }

  private syncPlot(id: string, slice: Slice, biome: LandBiomeName) {
    const plot = slice.crops[id];
    const world = gridToWorld({ x: plot.x ?? 0, y: plot.y ?? 0 });

    let objects = this.plots.get(id);
    if (!objects) {
      const art = this.scene.add
        .image(world.x, world.y, SOIL_IMAGES[biome].regular)
        .setOrigin(0, 0);
      const zone = this.scene.add
        .zone(world.x, world.y, WORLD_TILE, WORLD_TILE)
        .setOrigin(0, 0);
      makeClickable(this.scene, zone, () => this.onPlotClick(id), {
        onHoverChange: (hovered) =>
          this.bridge.hover.set(hovered ? { type: "crop", id } : null),
      });
      objects = { art, zone, cornerIcons: [] };
      this.plots.set(id, objects);
    }

    objects.zone.setPosition(world.x, world.y);
    objects.zone.setDepth(DEPTHS.ENTITY_BASE + world.y);
    objects.art.setDepth(DEPTHS.ENTITY_BASE + world.y);

    this.bridge.anchors.setAnchor(cropAnchorId(id), {
      x: world.x,
      y: world.y,
      width: WORLD_TILE,
      height: WORLD_TILE,
    });

    this.syncTutorialIcon(id, objects, world);

    objects.unregisterClock?.();
    objects.unregisterClock = undefined;

    const game = this.gameState();
    const fertile = isPlotFertile({
      plotIndex: id,
      crops: slice.crops,
      wellLevel: slice.waterWell.level,
      buildings: slice.buildings,
      upgradeReadyAt: slice.waterWell.upgradeReadyAt ?? 0,
      createdAt: Date.now(),
      island: slice.island.type,
    });

    // Weather-destroyed plot [TornadoPlot/TsunamiPlot/GreatFreezePlot]: dry
    // soil + the event icon top-right; click opens the affected modal.
    const weather = getAffectedWeather({ id, game });
    if (
      weather === "tornado" ||
      weather === "tsunami" ||
      weather === "greatFreeze"
    ) {
      this.setArt(objects, world, SOIL_IMAGES[biome].dry, DRY_TOP_OFFSET);
      this.clearBar(objects);
      const iconSrc =
        weather === "tornado"
          ? tornadoIcon
          : weather === "tsunami"
            ? tsunamiIcon
            : greatFreezeIcon;
      if (this.scene.textures.exists(iconSrc)) {
        const icon = this.scene.add
          .image(world.x + WORLD_TILE - 12, world.y - 4, iconSrc)
          .setOrigin(0, 0)
          .setDepth(DEPTHS.ENTITY_BASE + world.y + 1);
        nativeScale(icon, 12);
        objects.cornerIcons.push(icon);
      }
      return;
    }

    if (!fertile) {
      this.setArt(objects, world, SOIL_IMAGES[biome].dry, DRY_TOP_OFFSET);
      this.clearBar(objects);
      return;
    }

    const crop = plot.crop;
    if (!crop) {
      this.setArt(objects, world, SOIL_IMAGES[biome].regular, ART_TOP_OFFSET);
      this.clearBar(objects);
      return;
    }

    const windows = [
      ...getCropPlotBoostWindows(game),
      ...getCropFertiliserWindows(plot.fertiliser),
    ];
    const metrics = getHarvestMetrics({
      cropName: crop.name,
      plot,
      plantedAt: crop.plantedAt,
      boostWindows: windows,
    });
    const spec = {
      startedAt: metrics.startAt,
      baseDurationMs: metrics.baseDurationMs,
      windows,
      legacyReadyAt: metrics.readyAt,
      stageFractions: [0.25, 0.5, 1],
    };

    const applyStage = () => {
      const progress = readNodeTimer(spec, Date.now()).progress * 100;
      const stage = getGrowthStage(crop.name, progress) ?? "seedling";
      this.setArt(
        objects,
        world,
        CROP_LIFECYCLE[biome][crop.name][stage],
        ART_TOP_OFFSET,
      );
    };

    applyStage();
    objects.unregisterClock = this.scene.clock.register(
      `crop-${id}`,
      spec,
      applyStage,
    );

    // In-scene progress bar under the growing crop [FertilePlot.tsx].
    objects.timing = {
      startedAt: metrics.startAt,
      baseDurationMs: metrics.baseDurationMs,
      windows,
      legacyReadyAt: metrics.readyAt,
      harvestSeconds: metrics.harvestSeconds,
    };
    if (
      this.bridge.ui.get().showTimers &&
      metrics.readyAt > Date.now() &&
      metrics.harvestSeconds > 0
    ) {
      objects.bar ??= new ProgressBarSprite(this.scene, {
        x: world.x,
        y: world.y + 9,
        formatLength: "short",
        depth: DEPTHS.ENTITY_BASE + world.y + 0.5,
      });
      objects.bar.setPosition(world.x, world.y + 9);
      this.updateBar(objects);
    } else {
      objects.bar?.destroy();
      objects.bar = undefined;
    }

    this.syncCornerIcons(
      objects,
      plot,
      world,
      metrics.readyAt > Date.now() && metrics.harvestSeconds > 0,
    );
  }

  /**
   * [Plot.tsx] the tutorial dig / click helper over the next plot in the
   * first-harvest and first-plant sequences.
   */
  private syncTutorialIcon(
    id: string,
    objects: PlotObjects,
    world: { x: number; y: number },
  ) {
    const game = this.gameState();
    const activity = game.farmActivity ?? {};
    const harvestCount = getKeys(CROPS).reduce(
      (total, crop) => total + (activity[`${crop} Harvested`] ?? 0),
      0,
    );
    const plantCount = getKeys(CROPS).reduce(
      (total, crop) => total + (activity[`${crop} Planted`] ?? 0),
      0,
    );
    const soldCount = activity["Sunflower Sold"] ?? 0;

    const showDig =
      harvestCount < 3 &&
      harvestCount + 1 === Number(id) &&
      !!game.inventory.Shovel;
    const showClick =
      plantCount < 3 && plantCount + 1 === Number(id) && soldCount > 0;

    const wanted = showDig
      ? { src: SUNNYSIDE.icons.dig_icon, top: -14 }
      : showClick
        ? { src: SUNNYSIDE.icons.click_icon, top: 6 }
        : undefined;

    if (objects.tutorialIcon?.texture.key !== wanted?.src) {
      objects.tutorialTween?.remove();
      objects.tutorialTween = undefined;
      objects.tutorialIcon?.destroy();
      objects.tutorialIcon = undefined;
    }
    if (
      wanted &&
      !objects.tutorialIcon &&
      this.scene.textures.exists(wanted.src)
    ) {
      // 18px, right -8 of the tile, pulsating.
      const icon = this.scene.add
        .image(world.x + WORLD_TILE + 8 - 18, world.y + wanted.top, wanted.src)
        .setOrigin(0, 0)
        .setDepth(DEPTHS.ENTITY_BASE + world.y + 2);
      nativeScale(icon, 18);
      if (this.bridge.ui.get().showAnimations) {
        objects.tutorialTween = this.scene.tweens.add({
          targets: icon,
          scale: icon.scale * 1.15,
          duration: 500,
          yoyo: true,
          repeat: -1,
        });
      }
      objects.tutorialIcon = icon;
    }
  }

  private clearBar(objects: PlotObjects) {
    objects.bar?.destroy();
    objects.bar = undefined;
    objects.timing = undefined;
    this.clearCornerIcons(objects);
  }

  private clearCornerIcons(objects: PlotObjects) {
    objects.cornerIcons.forEach((icon) => icon.destroy());
    objects.cornerIcons = [];
  }

  /**
   * [FertilePlot.tsx] plot status icons, packed into the four corners
   * clockwise from the top-left. Game-layer rendering, so Phaser.
   */
  private syncCornerIcons(
    objects: PlotObjects,
    plot: GameState["crops"][string],
    world: { x: number; y: number },
    growing: boolean,
  ) {
    this.clearCornerIcons(objects);
    if (!growing || !plot.crop) return;

    const game = this.gameState();
    const now = Date.now();
    const isBoosted =
      objects.timing !== undefined &&
      objects.timing.baseDurationMs !== undefined &&
      getEffectiveSpeedAt({ at: now, windows: objects.timing.windows }) > 1;

    const calendarEvent = getActiveCalendarEvent({ calendar: game.calendar });
    const weatherIcon =
      calendarEvent === "insectPlague" && !game.calendar.insectPlague?.protected
        ? locust
        : calendarEvent === "sunshower"
          ? sunshower
          : undefined;

    const fertiliser = plot.fertiliser?.name;
    const fertiliserIcons =
      fertiliser === "Sprout Mix"
        ? [powerup]
        : fertiliser === "Rapid Root"
          ? [SUNNYSIDE.icons.stopwatch]
          : fertiliser === "Sproutroot Surprise"
            ? [powerup, SUNNYSIDE.icons.stopwatch]
            : [];

    const icons: { src: string; size: number }[] = [
      ...(isBoosted ? [{ src: SUNNYSIDE.icons.lightning, size: 7 }] : []),
      ...(weatherIcon ? [{ src: weatherIcon, size: 10 }] : []),
      ...(plot.beeSwarm ? [{ src: bee, size: 8 }] : []),
      ...fertiliserIcons.map((src) => ({ src, size: 6 })),
    ];

    // Corner order: TL, TR, BR, BL (overflow shares the last corner).
    icons.forEach((icon, index) => {
      const corner = Math.min(index, 3);
      const image = this.scene.add
        .image(0, 0, icon.src)
        .setOrigin(0, 0)
        .setDepth(DEPTHS.ENTITY_BASE + world.y + 1);
      nativeScale(image, icon.size);
      const w = icon.size;
      const h = image.displayHeight;
      const positions = [
        { x: world.x, y: world.y - 2 },
        { x: world.x + WORLD_TILE + 2 - w, y: world.y - 2 },
        { x: world.x + WORLD_TILE - w, y: world.y + WORLD_TILE - 9 - h },
        { x: world.x, y: world.y + WORLD_TILE - 9 - h },
      ];
      image.setPosition(positions[corner].x, positions[corner].y);
      objects.cornerIcons.push(image);
    });
  }

  /** Recompute fill + time text from the plot's timing (useNodeTimer maths). */
  private updateBar(objects: PlotObjects) {
    const timing = objects.timing;
    if (!timing || !objects.bar) return;

    const now = Date.now();
    const windowed = timing.baseDurationMs !== undefined;
    const readyAt = windowed
      ? computeReadyAt({
          startedAt: timing.startedAt,
          baseDurationMs: timing.baseDurationMs as number,
          windows: timing.windows,
        })
      : timing.legacyReadyAt;

    if (now >= readyAt) {
      this.clearBar(objects);
      return;
    }

    const countdownSeconds = Math.max((readyAt - now) / 1000, 0);
    const workLeftSeconds = windowed
      ? Math.max(
          ((timing.baseDurationMs as number) -
            workAccruedAt({
              startedAt: timing.startedAt,
              at: now,
              windows: timing.windows,
            })) /
            1000,
          0,
        )
      : countdownSeconds;
    const speed = windowed
      ? getEffectiveSpeedAt({ at: now, windows: timing.windows })
      : 1;
    void speed; // surfaced only in the React popover

    const percentage = Math.min(
      Math.max(100 - (workLeftSeconds / timing.harvestSeconds) * 100, 0),
      100,
    );
    const displaySeconds = getDisplaySeconds({
      showActualTime: this.bridge.ui.get().showActualTime,
      workLeftSeconds,
      countdownSeconds,
    });

    objects.bar.set(percentage, displaySeconds);
  }

  /** Tick the visible progress bars once a second. */
  update(_time: number, delta: number) {
    this.barTickMs += delta;
    if (this.barTickMs < 1000) return;
    this.barTickMs = 0;
    for (const objects of this.plots.values()) {
      this.updateBar(objects);
    }
  }

  private setArt(
    objects: PlotObjects,
    world: { x: number; y: number },
    texture: string,
    topOffset: number,
  ) {
    objects.art.setTexture(texture);
    objects.art.setPosition(world.x, world.y + topOffset);
    objects.art.setScale(WORLD_TILE / objects.art.width);
  }

  /** Port of Plot.tsx's onClick, dispatching the same events. */
  private onPlotClick(id: string) {
    // EXPERIMENT [worker/BumpkinWorker.ts]: with a bumpkin selected, ready
    // plots queue a harvest and empty plots queue a plant (using the
    // selected seed, or the first crop seed in the inventory). The marker
    // shows the seed/crop the job will use.
    const workerGame = this.bridge.select((state) => state.context.state);
    const workerPlot = workerGame.crops[id];
    const worker = (
      this.scene as unknown as {
        worker?: { isActive(): boolean; intercept(job: unknown): boolean };
      }
    ).worker;
    if (worker?.isActive() && workerPlot) {
      const world = gridToWorld({ x: workerPlot.x ?? 0, y: workerPlot.y ?? 0 });
      const ready =
        !!workerPlot.crop &&
        isReadyToHarvest(
          Date.now(),
          workerPlot.crop,
          CROPS[workerPlot.crop.name],
          workerGame,
          workerPlot.fertiliser,
        );
      if (ready) {
        worker.intercept({
          label: "Harvest",
          world,
          anim: "doing",
          dotAt: { x: world.x + WORLD_TILE / 2, y: world.y - 2 },
          icon: ITEM_DETAILS[workerPlot.crop!.name].image,
          run: () => this.onPlotClickImmediate(id),
        });
        return;
      }
      if (!workerPlot.crop) {
        // "Plant whatever is in the inventory": the selected seed when it's
        // a stocked crop seed, else the first stocked crop seed.
        const selected = this.bridge.ui.get().selectedItem;
        const stocked = (name: string) =>
          !!workerGame.inventory[name as SeedName]?.gte(1);
        const seed =
          selected && isCropSeed(selected as SeedName) && stocked(selected)
            ? (selected as SeedName)
            : (Object.keys(workerGame.inventory).find(
                (name) => isCropSeed(name as SeedName) && stocked(name),
              ) as SeedName | undefined);
        if (!seed) return; // nothing to plant with — ignore the tap
        worker.intercept({
          label: "Plant",
          world,
          anim: "dig",
          dotAt: { x: world.x + WORLD_TILE / 2, y: world.y - 2 },
          icon: ITEM_DETAILS[seed].image,
          run: () => this.onPlotClickImmediate(id, seed),
        });
        return;
      }
      // A growing crop has no job to queue; fall through to the normal
      // click (which shows the timer popover behaviour).
    }

    this.onPlotClickImmediate(id);
  }

  /**
   * The unchanged DOM plot click [Plot.tsx]. `seedOverride` is the worker
   * arriving with its chosen seed — bridge.selectItem round-trips through
   * React, so the same-tick read would be stale.
   */
  private onPlotClickImmediate(id: string, seedOverride?: SeedName) {
    const machine = this.bridge.select((state) => state);
    const game = machine.context.state;
    const plot = game.crops[id];
    if (!plot) return;

    const now = Date.now();

    // [Plot.tsx] weather-destroyed plots open the affected modal.
    const weather = getAffectedWeather({ id, game });
    if (
      weather === "tornado" ||
      weather === "tsunami" ||
      weather === "greatFreeze"
    ) {
      this.bridge.farmModal.open("weatherPlot", { event: weather });
      return;
    }

    const fertile = isPlotFertile({
      plotIndex: id,
      crops: game.crops,
      wellLevel: game.waterWell.level,
      buildings: game.buildings,
      upgradeReadyAt: game.waterWell.upgradeReadyAt ?? 0,
      createdAt: now,
      island: game.island.type,
    });
    if (!fertile) {
      this.bridge.farmModal.open("nonFertilePlot");
      return;
    }

    const seed =
      seedOverride ??
      (this.bridge.ui.get().selectedItem as SeedName | undefined);
    // Keep the HUD in step when the worker chose the seed.
    if (seedOverride) this.bridge.selectItem(seedOverride);
    const crop = plot.crop;
    const fertiliser = plot.fertiliser;

    const readyToHarvest =
      !!crop && isReadyToHarvest(now, crop, CROPS[crop.name], game, fertiliser);
    const wantsToPlant = !crop && !!seed && isCropSeed(seed);

    // Double-click buffer (Plot.tsx): harvest -> plant flows skip it.
    const lastClick = this.clickedAt.get(id) ?? 0;
    if (lastClick > 0 && now - lastClick < 100 && !wantsToPlant) return;
    this.clickedAt.set(id, now);

    // Chest reward on a ready crop.
    if (crop && readyToHarvest) {
      const counter = game.farmActivity[`${crop.name} Harvested`] ?? 0;
      const expectedReward =
        crop.reward ??
        getReward({
          crop: crop.name,
          skills: game.bumpkin?.skills ?? {},
          prngArgs: { farmId: machine.context.farmId, counter },
        }).reward;

      if (expectedReward) {
        const seasoned = isSeasonedPlayer({
          game,
          verified: machine.context.verified,
          now,
        });
        if (!seasoned) {
          this.bridge.chestReward.set({
            anchorId: cropAnchorId(id),
            reward: expectedReward,
            collectedItem: crop.name,
            onResult: (success) => {
              this.bridge.chestReward.set(null);
              if (success) this.harvestCrop(id);
            },
          });
          return;
        }
        this.harvestCrop(id);
        return;
      }
    }

    // Apply fertiliser.
    if (!readyToHarvest && seed && seed in CROP_COMPOST) {
      this.bridge.dispatch("plot.fertilised", {
        plotID: id,
        fertiliser: seed,
      });
      return;
    }

    // Plant. Like the DOM plot, dispatch unconditionally — the plant handler
    // is the authority on what's plantable; guarding here silently ate clicks
    // for seed types the isCropSeed narrowing doesn't cover.
    if (!crop) {
      if (
        seed &&
        isCropSeed(seed) &&
        seed !== CHAPTER_CROP_WEEK_SEED &&
        !SEASONAL_SEEDS[game.season.season].includes(seed)
      ) {
        this.bridge.farmModal.open("seasonalSeed");
      }

      const newState = this.bridge.dispatch("seed.planted", {
        index: id,
        item: seed,
        cropId: uuidv4().slice(0, 8),
      });
      playSound("plant");

      const planted =
        newState.context.state.farmActivity?.["Sunflower Planted"] ?? 0;
      if (planted === 1) {
        gameAnalytics.trackMilestone({
          event: "Tutorial:SunflowerPlanted:Completed",
        });
      }
      if (
        planted >= 3 &&
        seed === "Sunflower Seed" &&
        !newState.context.state.inventory["Sunflower Seed"]?.gt(0) &&
        !newState.context.state.inventory["Basic Scarecrow"]
      ) {
        this.bridge.openModal("BLACKSMITH");
      }
      return;
    }

    if (readyToHarvest) {
      this.harvestCrop(id);
    }
  }

  /** Port of Plot.tsx's harvestCrop. */
  private harvestCrop(id: string) {
    const machine = this.bridge.select((state) => state);
    const game = machine.context.state;
    const plot = game.crops[id];
    const crop = plot?.crop;
    if (!crop) return;

    const counter = game.farmActivity[`${crop.name} Harvested`] ?? 0;
    const newState = this.bridge.dispatch("crop.harvested", { index: id });
    playSound("harvest");

    const amount =
      crop.amount ??
      getCropYieldAmount({
        crop: crop.name,
        game,
        plot,
        createdAt: Date.now(),
        prngArgs: { farmId: machine.context.farmId, counter },
      }).amount;

    const { showAnimations } = this.bridge.ui.get();

    if (showAnimations && amount >= 10) {
      void this.playProcAnimation(id, crop.name);
    }

    if (newState.context.state.farmActivity?.["Sunflower Harvested"] === 1) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:SunflowerHarvested:Completed",
      });
    }

    if (showAnimations) {
      const world = gridToWorld({ x: plot.x ?? 0, y: plot.y ?? 0 });
      playYieldFloat(this.scene, {
        x: world.x + 16 * 0.4,
        y: world.y - 2,
        amount,
        color: getYieldColour(amount),
        depth: world.y + 100_000,
        durationMs: 2000,
      });
    }
  }

  /** The harvest firework spritesheet, at the DOM's (-10, -23) offset. */
  private async playProcAnimation(id: string, cropName: CropName) {
    const plot = this.bridge.select((state) => state.context.state.crops[id]);
    if (!plot) return;

    const sheet = HARVEST_PROC_ANIMATION.sprites[cropName];
    queueSpritesheet(this.scene, sheet, {
      frameWidth: HARVEST_PROC_ANIMATION.size,
      frameHeight: HARVEST_PROC_ANIMATION.size,
    });
    await runLoader(this.scene);
    if (this.destroyed) return;

    const animKey = `${sheet}-proc`;
    if (!this.scene.anims.exists(animKey)) {
      this.scene.anims.create({
        key: animKey,
        frames: this.scene.anims.generateFrameNumbers(sheet, {
          start: 0,
          end: HARVEST_PROC_ANIMATION.steps - 1,
        }),
        frameRate: HARVEST_PROC_ANIMATION.fps,
      });
    }

    const world = gridToWorld({ x: plot.x ?? 0, y: plot.y ?? 0 });
    const sprite = this.scene.add
      .sprite(world.x - 10, world.y - 23, sheet)
      .setOrigin(0, 0)
      .setDepth(DEPTHS.ENTITY_BASE + world.y + 1);
    sprite.play(animKey);
    sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
      sprite.destroy(),
    );
  }

  private gameState(): GameState {
    return this.bridge.select((state) => state.context.state);
  }

  protected onDestroy() {
    this.unsubscribeUi?.();
    this.unsubscribeUi = undefined;
    for (const [id, objects] of this.plots) {
      objects.unregisterClock?.();
      objects.art.destroy();
      objects.zone.destroy();
      objects.bar?.destroy();
      objects.tutorialTween?.remove();
      objects.tutorialIcon?.destroy();
      this.clearCornerIcons(objects);
      this.bridge.anchors.removeAnchor(cropAnchorId(id));
    }
    this.plots.clear();
    this.clickedAt.clear();
  }
}
