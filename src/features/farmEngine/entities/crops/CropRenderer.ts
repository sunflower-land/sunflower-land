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
  workAccruedAt,
  type BoostWindow,
} from "features/game/lib/boostWindows";
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
  getTotalCropsPlanted,
  getTutorialHarvestPlot,
  getTutorialPlantPlot,
  isHarvestingFirstRhubarb,
  TUTORIAL_PLOT_COUNT,
  TUTORIAL_RHUBARB_COUNT,
} from "features/island/plots/lib/tutorialPlots";
import { getTutorialNudge } from "features/island/lib/tutorialNudge";
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
import { burst, hop, type ChipMaterial } from "../../core/juice";
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
 * (tornado/tsunami/great-freeze art).
 */

type Slice = {
  crops: GameState["crops"];
  island: GameState["island"];
  waterWell: GameState["waterWell"];
  buildings: GameState["buildings"];
  // Boost windows and fertility read wider state; collectibles is the ref
  // that changes when boost sources are placed or removed.
  collectibles: GameState["collectibles"];
  // Inputs of the tutorial arrow [Plot.tsx getTutorialNudge + the target-plot
  // helpers]. Only a basic island can carry a plot nudge, so these stay
  // undefined everywhere else and established farms never re-sync on them.
  farmActivity?: GameState["farmActivity"];
  inventory?: GameState["inventory"];
  experience?: number;
  deliveriesFulfilled?: number;
  expansionConstruction?: GameState["expansionConstruction"];
};

type PlotTiming = {
  startedAt: number;
  baseDurationMs: number;
  /** Work banked before a landscaping lift [FertilePlot.tsx bankedMs]. */
  bankedMs: number;
  windows: BoostWindow[];
};

type PlotObjects = {
  art: Phaser.GameObjects.Image;
  zone: Phaser.GameObjects.Zone;
  unregisterClock?: () => void;
  bar?: ProgressBarSprite;
  timing?: PlotTiming;
  cornerIcons: Phaser.GameObjects.Image[];
  /**
   * Whether the plot renders as a FertilePlot — Plot.tsx returns the
   * non-fertile / weather plots before it ever draws the tutorial arrow.
   */
  arrowEligible: boolean;
  /** Tutorial click arrow [Plot.tsx showHarvestArrow / showPlantArrow]. */
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
  private unsubscribeUi: Unsubscribe | undefined;
  /** A crop just became ready — the tutorial arrow may have a new target. */
  private tutorialDirty = false;

  mount() {
    super.mount();
    // showTimers changes re-shape the bars.
    this.unsubscribeUi = this.bridge.ui.subscribe(
      () => void this.sync(this.bridge.select((state) => this.selector(state))),
    );
  }

  selector(state: MachineState): Slice {
    const game = state.context.state;
    const tutorialIsland = game.island.type === "basic";
    return {
      crops: game.crops,
      island: game.island,
      waterWell: game.waterWell,
      buildings: game.buildings,
      collectibles: game.collectibles,
      farmActivity: tutorialIsland ? game.farmActivity : undefined,
      inventory: tutorialIsland ? game.inventory : undefined,
      experience: tutorialIsland ? game.bumpkin.experience : undefined,
      deliveriesFulfilled: tutorialIsland
        ? game.delivery.fulfilledCount
        : undefined,
      expansionConstruction: tutorialIsland
        ? game.expansionConstruction
        : undefined,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.crops === b.crops &&
    a.island === b.island &&
    a.waterWell === b.waterWell &&
    a.buildings === b.buildings &&
    a.collectibles === b.collectibles &&
    a.farmActivity === b.farmActivity &&
    a.inventory === b.inventory &&
    a.experience === b.experience &&
    a.deliveriesFulfilled === b.deliveriesFulfilled &&
    a.expansionConstruction === b.expansionConstruction;

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

    // Farm-wide, so resolved once per sync (on first use) rather than once
    // per plot: every harvest re-syncs all the plots.
    let plotWindows: ReturnType<typeof getCropPlotBoostWindows> | undefined;
    const getPlotWindows = () =>
      (plotWindows ??= getCropPlotBoostWindows(this.gameState()));
    for (const id of Object.keys(slice.crops)) {
      this.syncPlot(id, slice, biome, getPlotWindows);
    }

    this.tutorialDirty = false;
    this.syncTutorialIcons();
  }

  private syncPlot(
    id: string,
    slice: Slice,
    biome: LandBiomeName,
    getPlotWindows: () => ReturnType<typeof getCropPlotBoostWindows>,
  ) {
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
        glow: () => this.plots.get(id)?.art,
      });
      objects = { art, zone, cornerIcons: [], arrowEligible: false };
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
    const weatherAffected =
      weather === "tornado" ||
      weather === "tsunami" ||
      weather === "greatFreeze";
    objects.arrowEligible = fertile && !weatherAffected;
    if (weatherAffected) {
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
      ...getPlotWindows(),
      ...getCropFertiliserWindows(plot.fertiliser),
    ];
    const metrics = getHarvestMetrics({
      cropName: crop.name,
      plot,
      plantedAt: crop.plantedAt,
    });
    // Work banked before a landscaping lift counts toward the displayed
    // growth, not toward the remaining time [FertilePlot.tsx].
    const bankedMs = crop.boostedTime ?? 0;
    const spec = {
      startedAt: metrics.startAt,
      baseDurationMs: metrics.baseDurationMs,
      bankedMs,
      windows,
      stageFractions: [0.25, 0.5, 1],
    };
    // Windowed ready time derived live from the boost windows [useNodeTimer].
    const readyAt = readNodeTimer(spec, Date.now()).readyAt;

    const applyStage = () => {
      const progress = readNodeTimer(spec, Date.now()).progress * 100;
      const stage = getGrowthStage(crop.name, progress) ?? "seedling";
      this.setArt(
        objects,
        world,
        CROP_LIFECYCLE[biome][crop.name][stage],
        ART_TOP_OFFSET,
      );
      return progress;
    };

    applyStage();
    objects.unregisterClock = this.scene.clock.register(
      `crop-${id}`,
      spec,
      () => {
        // A crop turning ready can move the tutorial harvest arrow; the pass
        // runs once on the next update however many plots ripen together.
        const before = objects.art.texture.key;
        if (applyStage() >= 100) this.tutorialDirty = true;
        // A little hop as the crop steps up a growth stage: the field
        // visibly comes on while the player is looking at it.
        if (
          objects.art.texture.key !== before &&
          this.bridge.ui.get().showAnimations
        ) {
          hop(this.scene, objects.art);
        }
      },
    );

    // In-scene progress bar under the growing crop [FertilePlot.tsx].
    objects.timing = {
      startedAt: metrics.startAt,
      baseDurationMs: metrics.baseDurationMs,
      bankedMs,
      windows,
    };
    if (
      this.bridge.ui.get().showTimers &&
      readyAt > Date.now() &&
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
      readyAt > Date.now() && metrics.harvestSeconds > 0,
    );
  }

  /**
   * [Plot.tsx] the tutorial arrow: a single click icon walks the first crops
   * one plot at a time, gated on the farm-wide nudge. The target is resolved
   * once per pass, not per plot.
   */
  private syncTutorialIcons() {
    const game = this.gameState();
    const nudge = getTutorialNudge(game);
    const now = Date.now();
    const target =
      nudge === "harvest-plot"
        ? getTutorialHarvestPlot({ game, now })
        : nudge === "plant-plot"
          ? getTutorialPlantPlot({ game, now })
          : undefined;

    for (const [id, objects] of this.plots) {
      this.syncTutorialIcon(
        objects,
        game.crops[id],
        id === target && objects.arrowEligible,
      );
    }
  }

  private syncTutorialIcon(
    objects: PlotObjects,
    plot: GameState["crops"][string] | undefined,
    wanted: boolean,
  ) {
    if (!wanted || !plot) {
      objects.tutorialTween?.remove();
      objects.tutorialTween = undefined;
      objects.tutorialIcon?.destroy();
      objects.tutorialIcon = undefined;
      return;
    }

    const src = SUNNYSIDE.icons.click_icon;
    const world = gridToWorld({ x: plot.x ?? 0, y: plot.y ?? 0 });
    // 18px, right -8 / top 6 of the tile, pulsating.
    const x = world.x + WORLD_TILE + 8 - 18;
    const y = world.y + 6;
    const depth = DEPTHS.ENTITY_BASE + world.y + 2;

    if (objects.tutorialIcon) {
      objects.tutorialIcon.setPosition(x, y).setDepth(depth);
      return;
    }
    if (!this.scene.textures.exists(src)) return;

    const icon = this.scene.add
      .image(x, y, src)
      .setOrigin(0, 0)
      .setDepth(depth);
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
    const readyAt = computeReadyAt({
      startedAt: timing.startedAt,
      baseDurationMs: timing.baseDurationMs,
      windows: timing.windows,
    });

    if (now >= readyAt) {
      this.clearBar(objects);
      return;
    }

    const countdownSeconds = Math.max((readyAt - now) / 1000, 0);
    // Fill is measured in WORK, with any banked work folded into both sides
    // [FertilePlot.tsx growPercentage].
    const workDoneMs = workAccruedAt({
      startedAt: timing.startedAt,
      at: now,
      windows: timing.windows,
    });
    const percentage = Math.min(
      Math.max(
        ((timing.bankedMs + workDoneMs) /
          (timing.baseDurationMs + timing.bankedMs)) *
          100,
        0,
      ),
      100,
    );
    objects.bar.set(percentage, countdownSeconds);
  }

  /** Tick the visible progress bars once a second. */
  update(_time: number, delta: number) {
    if (this.tutorialDirty) {
      this.tutorialDirty = false;
      this.syncTutorialIcons();
    }
    if (!this.secondElapsed(delta)) return;
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

    const seed = this.bridge.ui.get().selectedItem as SeedName | undefined;
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
      this.puff(id, "soil");

      const planted =
        newState.context.state.farmActivity?.["Sunflower Planted"] ?? 0;
      if (planted === 1) {
        gameAnalytics.trackMilestone({
          event: "Tutorial:SunflowerPlanted:Completed",
        });
      }
      // [Plot.tsx] with the first field replanted, the blacksmith offers a
      // scarecrow. Keyed on the exact planting so it only ever fires once.
      if (
        newState.context.state.island.type === "basic" &&
        getTotalCropsPlanted(newState.context.state) === TUTORIAL_PLOT_COUNT &&
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

  /** A few chips off the plot: soil when planting, leaves when harvesting. */
  private puff(id: string, material: ChipMaterial) {
    if (!this.bridge.ui.get().showAnimations) return;
    const plot = this.gameState().crops[id];
    if (!plot) return;
    const world = gridToWorld({ x: plot.x ?? 0, y: plot.y ?? 0 });
    burst(this.scene, {
      x: world.x + WORLD_TILE / 2,
      y: world.y + WORLD_TILE / 2 - 2,
      material,
      depth: DEPTHS.ENTITY_BASE + world.y + WORLD_TILE + 4,
      count: 5,
      spread: 7,
      lift: 7,
      durationMs: 320,
    });
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
    this.puff(id, "leaf");

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

    // [Plot.tsx] once the last of the first Sunflowers is in, Betty sends the
    // player off to deliver them.
    if (
      crop.name === "Sunflower" &&
      newState.context.state.island.type === "basic" &&
      (newState.context.state.farmActivity?.["Sunflower Harvested"] ?? 0) ===
        TUTORIAL_PLOT_COUNT
    ) {
      this.bridge.openModal("FIRST_DELIVERY");
    }

    // [Plot.tsx] the last of the first Rhubarb is Bruce's cue. `game` is the
    // state before the harvest, so it fires exactly once.
    if (
      crop.name === "Rhubarb" &&
      isHarvestingFirstRhubarb(game) &&
      (newState.context.state.farmActivity?.["Rhubarb Harvested"] ?? 0) >=
        TUTORIAL_RHUBARB_COUNT
    ) {
      this.bridge.openModal("FIREPIT");
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
