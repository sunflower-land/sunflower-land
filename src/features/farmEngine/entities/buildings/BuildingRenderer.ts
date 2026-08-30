import type Phaser from "phaser";
import shadow from "assets/npcs/shadow.png";
import tornadoIcon from "assets/icons/tornado.webp";
import tsunamiIcon from "assets/icons/tsunami.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type {
  GameState,
  PlacedItem,
  TemperateSeasonName,
} from "features/game/types/game";
import type { BuildingName } from "features/game/types/buildings";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import { ITEM_DETAILS } from "features/game/types/images";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { isBuildingDestroyed } from "features/island/buildings/components/building/Building";
import { COMPOSTER_IMAGES } from "features/island/buildings/components/building/composters/ComposterModal";
import { SMOOTHIE_SHACK_DESK_VARIANTS } from "features/island/lib/alternateArt";
import { isBuildingEnabled } from "features/game/expansion/lib/buildingRequirements";
import {
  getAscensionLevel,
  meetsLevelRequirement,
  type AscensionLevel,
} from "features/game/lib/level";
import { getHomeRoute } from "features/island/buildings/lib/getHomeRoute";
import { getHelpRequired, isHelpComplete } from "features/game/types/monuments";
import { isGreenhouseReady } from "features/game/events/landExpansion/greenhouseReadiness";
import { PIXEL_SCALE } from "features/game/lib/constants";
import mailboxImg from "assets/decorations/mailbox.png";
import newsIcon from "assets/icons/chapter_icon_2.webp";
import {
  getDiscordNewsLatestAt,
  getDiscordNewsReadAt,
} from "features/farming/mail/actions/discordNews";
import {
  findGrowingCropPackIndex,
  isCropPackReady,
} from "features/island/buildings/components/building/cropMachine/lib/cropMachine";
import type { CropMachineQueueItem } from "features/game/types/game";
import { isAnimalReadyForLove } from "features/game/events/landExpansion/loveAnimal";
import { getOverCapacityAnimalIds } from "features/game/events/landExpansion/buyAnimal";
import { isAnimalCoveredByGoldenAsset } from "features/game/events/landExpansion/feedAllAnimals";
import { queueImage, queueSpritesheet, runLoader } from "../../core/assets";
import { NPCSprite } from "../npc/NPCSprite";
import { NPC_WEARABLES } from "lib/npcs";
import {
  queueArt,
  resolveArtObject,
  type ArtObject,
} from "../../core/animated";
import { makeClickable } from "../../core/clickable";
import { nativeScale } from "../../core/pixelArt";
import { gridRectToWorld, type WorldRect } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { playSound } from "../../core/sounds";
import { ProgressBarSprite } from "../../components/ProgressBarSprite";
import { EntityRenderer } from "../EntityRenderer";
import {
  BUILDING_BASE_ART,
  COOKING_LAYOUT,
  composterBase,
  isCookingBuilding,
  type BuildingArtContext,
  type CookingBuilding,
} from "./buildingArt";

/**
 * Placed buildings [island/buildings/components/building/*]. One renderer for
 * every building type: base art from the data table in buildingArt.ts, state
 * indicators (constructing bar, cooking NPC swap + item icon, ready alerts,
 * composter/crafting-box progress, destroyed badge) refreshed on a 1s tick,
 * and the DOM's exact click routing (collect / modal via bridge / navigate).
 *
 * DEFERRED: NPC/smoke gifs render their first frame (animated gif art needs
 * spritesheets); crop-machine stage sheets (idle art always); hen-house/barn
 * hungry/sick/love alert row; tent bumpkin; house DailyReward/HomeBumpkins/
 * LetterBox extras; visiting help discs; hover level tooltip.
 */

type Slice = {
  buildings: GameState["buildings"];
  island: GameState["island"];
  season: TemperateSeasonName;
  henHouseLevel: number;
  barnLevel: number;
  waterWell: GameState["waterWell"];
  petHouseLevel: number;
  agingShedLevel: number;
  calendar: GameState["calendar"];
  craftingBoxQueue: GameState["craftingBox"]["queue"];
  greenhousePots: GameState["greenhouse"]["pots"];
  bumpkinLevel: AscensionLevel;
};

type BuildingObjects = {
  name: BuildingName;
  id: string;
  index: number;
  box: WorldRect;
  zone: Phaser.GameObjects.Zone;
  base?: Phaser.GameObjects.Image;
  extras: Map<string, ArtObject>;
  bar?: ProgressBarSprite;
  alertTween?: Phaser.Tweens.Tween;
  /** Crop Machine growth-stage loop sheet. */
  stageSheet?: Phaser.GameObjects.Sprite;
};

const READY_ALERT = "readyAlert";

/**
 * Per-home-building wrapper offsets for the daily chest / bumpkin row /
 * mailbox [TownCenter.tsx / House.tsx / Manor.tsx / Mansion.tsx]. Values are
 * the wrapper div offsets in src px; letter is either from the top-left or
 * (right, bottomUp) anchored.
 */
export const HOME_EXTRA_OFFSETS: Record<
  "Town Center" | "House" | "Manor" | "Mansion",
  {
    daily: { x: number; y: number };
    row: { left: number; bottomUp: number };
    letter: { x: number; y: number } | { right: number; bottomUp: number };
  }
> = {
  "Town Center": {
    daily: { x: 16, y: 14 },
    row: { left: 4, bottomUp: 26.5 },
    letter: { x: 4, y: 0 },
  },
  House: {
    daily: { x: -5, y: -8 },
    row: { left: 0, bottomUp: 26.5 },
    letter: { right: 14, bottomUp: 20 },
  },
  Manor: {
    daily: { x: -5, y: -13 },
    row: { left: 0, bottomUp: 26.5 },
    letter: { right: 14, bottomUp: 20 },
  },
  Mansion: {
    daily: { x: 0, y: 0 },
    row: { left: 0, bottomUp: 28 },
    letter: { right: 13, bottomUp: 20 },
  },
};

export class BuildingRenderer extends EntityRenderer<Slice> {
  private nodes = new Map<string, BuildingObjects>();
  private tickMs = 0;
  /** Composed-bumpkin building NPCs (fish market's Neville). */
  private npcSprites = new Map<string, NPCSprite>();
  /** [House.tsx] transient heart after recipes.collected. */
  private heartShownUntil = 0;
  private unsubscribeEvents: (() => void) | undefined;

  mount() {
    super.mount();
    this.unsubscribeEvents = this.bridge.onGameEvent((event) => {
      if (event.type === "recipes.collected") {
        this.heartShownUntil = Date.now() + 3000;
      }
      // [WaterWell.tsx] starting an upgrade auto-opens the constructing panel.
      if (
        event.type === "building.upgraded" &&
        (event as { name?: string }).name === "Water Well"
      ) {
        this.bridge.farmModal.open("waterWell");
      }
    });
  }

  selector(state: MachineState): Slice {
    const game = state.context.state;
    return {
      buildings: game.buildings,
      island: game.island,
      season: game.season.season,
      henHouseLevel: game.henHouse.level,
      barnLevel: game.barn.level,
      waterWell: game.waterWell,
      petHouseLevel: game.petHouse.level ?? 1,
      agingShedLevel: game.agingShed.level,
      calendar: game.calendar,
      craftingBoxQueue: game.craftingBox.queue,
      greenhousePots: game.greenhouse.pots,
      bumpkinLevel: getAscensionLevel({
        experience: game.bumpkin?.experience ?? 0,
        ascensionLevel: game.island.ascensionLevel ?? 0,
      }),
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.buildings === b.buildings &&
    a.island === b.island &&
    a.season === b.season &&
    a.henHouseLevel === b.henHouseLevel &&
    a.barnLevel === b.barnLevel &&
    a.waterWell === b.waterWell &&
    a.petHouseLevel === b.petHouseLevel &&
    a.agingShedLevel === b.agingShedLevel &&
    a.calendar === b.calendar &&
    a.craftingBoxQueue === b.craftingBoxQueue &&
    a.greenhousePots === b.greenhousePots &&
    a.bumpkinLevel === b.bumpkinLevel;

  private artContext(slice: Slice, now: number): BuildingArtContext {
    const upgrading = (slice.waterWell.upgradeReadyAt ?? 0) > now;
    return {
      biome: getCurrentBiome(slice.island),
      season: slice.season,
      henHouseLevel: slice.henHouseLevel,
      barnLevel: slice.barnLevel,
      waterWellLevel: upgrading
        ? slice.waterWell.level - 1
        : slice.waterWell.level,
      petHouseLevel: slice.petHouseLevel,
      agingShedLevel: slice.agingShedLevel,
    };
  }

  private placements(slice: Slice) {
    const out: { name: BuildingName; item: PlacedItem; index: number }[] = [];
    for (const [name, items] of Object.entries(slice.buildings)) {
      (items ?? []).forEach((item, index) => {
        if (item.coordinates) {
          out.push({ name: name as BuildingName, item, index });
        }
      });
    }
    return out;
  }

  async sync(slice: Slice) {
    const token = this.beginSync();
    const now = Date.now();
    const ctx = this.artContext(slice, now);
    const placements = this.placements(slice);

    // Queue every texture the current state can need; product icons are
    // queued here so ready-transitions on the 1s tick already have them.
    [
      shadow,
      tornadoIcon,
      tsunamiIcon,
      SUNNYSIDE.icons.expression_alerted,
      SUNNYSIDE.icons.expression_stress,
      SUNNYSIDE.icons.expression_chat,
      SUNNYSIDE.icons.heart,
      SUNNYSIDE.icons.click_icon,
      SUNNYSIDE.icons.money_icon,
      SUNNYSIDE.decorations.treasure_chest,
      SUNNYSIDE.decorations.treasure_chest_opened,
      mailboxImg,
      newsIcon,
      SUNNYSIDE.icons.stopwatch,
      SUNNYSIDE.ui.emptyBar,
      SUNNYSIDE.building.smoke,
      SUNNYSIDE.building.shadowCropMachine,
      SUNNYSIDE.building.harvestedCropsImage,
      SMOOTHIE_SHACK_DESK_VARIANTS[slice.season],
    ].forEach((url) => queueArt(this.scene, url));
    // Crop Machine growth-stage sheets (80x70).
    [
      SUNNYSIDE.building.plantingCropMachine,
      SUNNYSIDE.building.sproutingCropMachine,
      SUNNYSIDE.building.maturingCropMachine,
      SUNNYSIDE.building.harvestingCropMachine,
    ].forEach((url) =>
      queueSpritesheet(this.scene, url, { frameWidth: 80, frameHeight: 70 }),
    );

    for (const { name, item } of placements) {
      const art = BUILDING_BASE_ART[name]?.(ctx);
      if (art) queueArt(this.scene, art.texture);
      if (isCookingBuilding(name)) {
        const layout = COOKING_LAYOUT[name];
        queueArt(this.scene, layout.npcIdle.texture);
        queueArt(this.scene, layout.npcDoing.texture);
      }
      if (name in COMPOSTER_IMAGES) {
        const images = COMPOSTER_IMAGES[name as keyof typeof COMPOSTER_IMAGES];
        [images.idle, images.composting, images.ready].forEach((url) =>
          queueArt(this.scene, url),
        );
      }
      [...(item.crafting ?? []), ...(item.processing ?? [])].forEach(
        (product) => queueImage(this.scene, ITEM_DETAILS[product.name].image),
      );
    }
    Object.values(slice.greenhousePots ?? {}).forEach((pot) => {
      if (pot.plant) queueImage(this.scene, ITEM_DETAILS[pot.plant.name].image);
    });

    await runLoader(this.scene);
    if (this.isStale(token)) return;

    // Reconcile.
    const liveKeys = new Set(
      placements.map(({ name, item }) => `${name}#${item.id}`),
    );
    for (const [key, objects] of this.nodes) {
      if (liveKeys.has(key)) continue;
      this.destroyNode(objects);
      this.nodes.delete(key);
    }

    for (const { name, item, index } of placements) {
      const key = `${name}#${item.id}`;
      const dimensions = BUILDINGS_DIMENSIONS[name];
      const box = gridRectToWorld(item.coordinates!, dimensions);

      let objects = this.nodes.get(key);
      if (!objects) {
        const zone = this.scene.add
          .zone(0, 0, box.width, box.height)
          .setOrigin(0, 0);
        makeClickable(
          this.scene,
          zone,
          () => this.onBuildingClick(name, item.id, index),
          {
            // [Land.tsx:596] only the home set stays clickable on a visit.
            visitClickable: [
              "Town Center",
              "Tent",
              "House",
              "Manor",
              "Mansion",
              "Pet House",
            ].includes(name),
            glow: () => this.nodes.get(key)?.base,
          },
        );
        objects = {
          name,
          id: item.id,
          index,
          box,
          zone,
          extras: new Map(),
        };
        this.nodes.set(key, objects);
      }
      objects.box = box;
      objects.index = index;
      objects.zone.setPosition(box.x, box.y);
      objects.zone.setSize(box.width, box.height);
      // Input hit-testing follows depth too — without this a tall building's
      // zone would swallow clicks meant for entities in rows below it.
      objects.zone.setDepth(DEPTHS.ENTITY_BASE + box.y);

      this.refreshBuilding(objects, slice, Date.now());
    }
  }

  /** Full visual state pass for one building — also the 1s tick body. */
  private refreshBuilding(objects: BuildingObjects, slice: Slice, now: number) {
    const { name, box } = objects;
    const ctx = this.artContext(slice, now);
    const item = this.itemOf(slice, name, objects.id);
    if (!item) return;

    const constructing = (item.readyAt ?? 0) > now;
    const destroyedBy = isBuildingDestroyed({
      name,
      calendar: slice.calendar,
    });

    // ----- base art
    let art = BUILDING_BASE_ART[name]?.(ctx);
    if (name in COMPOSTER_IMAGES) {
      art = composterBase(
        name as keyof typeof COMPOSTER_IMAGES,
        this.composterState(item, now),
      );
    }
    if (!art || !this.scene.textures.exists(art.texture)) return;

    // [Land.tsx:1193-1237] the DOM sorts by the PLACEMENT row (grid y of the
    // origin cell), not the box bottom — entities in rows below a tall
    // building paint (and click) over it.
    const depth = DEPTHS.ENTITY_BASE + box.y;
    if (!objects.base) {
      objects.base = this.scene.add.image(0, 0, art.texture).setOrigin(0, 1);
    }
    objects.base.setTexture(art.texture);
    // Native pixels; art.width only re-centres it [core/pixelArt.ts].
    const baseShift = nativeScale(objects.base, art.width);
    objects.base.setPosition(
      box.x + art.left + baseShift,
      box.y + box.height - art.bottom,
    );
    objects.base.setDepth(depth);

    // Constructing: normal art at 50% + centred progress bar [Building.tsx].
    objects.base.setAlpha(constructing ? 0.5 : 1);

    // Reset per-state extras each pass (a handful of images; cheap).
    for (const [key, image] of objects.extras) {
      image.destroy();
      objects.extras.delete(key);
    }
    objects.alertTween?.remove();
    objects.alertTween = undefined;

    const showTimers = this.bridge.ui.get().showTimers;
    let barConfig: {
      x: number;
      y: number;
      pct: number;
      seconds: number;
    } | null = null;

    if (constructing) {
      if (showTimers) {
        const total = ((item.readyAt ?? 0) - (item.createdAt ?? 0)) / 1000;
        const left = ((item.readyAt ?? 0) - now) / 1000;
        barConfig = {
          x: box.x + box.width / 2 - 8,
          y: box.y + box.height - 7,
          pct: total > 0 ? (1 - left / total) * 100 : 0,
          seconds: 0,
        };
      }
    } else if (destroyedBy) {
      // [Building.tsx DestroyedBuilding] badge top -4, right 0, width 12.
      const icon = destroyedBy === "tornado" ? tornadoIcon : tsunamiIcon;
      this.addExtra(objects, "destroyed", icon, {
        x: box.x + box.width - 12,
        y: box.y - 4,
        width: 12,
        depth: depth + 2,
      });
    } else {
      barConfig = this.refreshStateExtras(objects, slice, item, now, depth);
    }

    if (barConfig) {
      objects.bar ??= new ProgressBarSprite(this.scene, {
        x: barConfig.x,
        y: barConfig.y,
        formatLength: "short",
        depth: depth + 2,
      });
      objects.bar.setPosition(barConfig.x, barConfig.y);
      objects.bar.set(barConfig.pct, barConfig.seconds);
    } else if (objects.bar) {
      objects.bar.destroy();
      objects.bar = undefined;
    }
  }

  /**
   * Built, not destroyed: per-building indicators. Returns the progress-bar
   * placement if this building shows one.
   */
  private refreshStateExtras(
    objects: BuildingObjects,
    slice: Slice,
    item: PlacedItem,
    now: number,
    depth: number,
  ): { x: number; y: number; pct: number; seconds: number } | null {
    const { name, box } = objects;
    const showTimers = this.bridge.ui.get().showTimers;

    if (isCookingBuilding(name)) {
      this.refreshCooking(objects, slice, item, now, depth);
      return null;
    }

    if (name === "Hen House" || name === "Barn") {
      this.refreshAnimalAlerts(objects, name, now, depth);
      return null;
    }

    // [Market.tsx] first-sale tutorial: click + coin icons once 9 sunflowers
    // are harvested and none sold.
    if (name === "Market") {
      const activity = this.bridge.select(
        (state) => state.context.state.farmActivity,
      );
      if (
        activity["Sunflower Harvested"] === 9 &&
        !activity["Sunflower Sold"]
      ) {
        this.addExtra(
          objects,
          "market-helper-click",
          SUNNYSIDE.icons.click_icon,
          {
            x: box.x + box.width + 8 - 18,
            y: box.y + 20,
            width: 18,
            depth: depth + 2,
          },
        );
        this.addExtra(
          objects,
          "market-helper-money",
          SUNNYSIDE.icons.money_icon,
          {
            x: box.x + box.width - 8 - 18,
            y: box.y + 20,
            width: 18,
            depth: depth + 2,
          },
        );
      }
      return null;
    }

    if (name in HOME_EXTRA_OFFSETS) {
      this.refreshHomeExtras(
        objects,
        name as keyof typeof HOME_EXTRA_OFFSETS,
        now,
        depth,
      );
      return null;
    }

    if (name === "Fish Market") {
      const processing = (item.processing ?? []).find((p) => p.readyAt > now);
      const ready = (item.processing ?? []).filter((p) => p.readyAt <= now);
      // NPC [FishMarket.tsx]: the neville_doing sheet while processing,
      // otherwise the composed idle bumpkin at (left -4, top 11).
      if (!processing) {
        const key = `${objects.name}-neville`;
        const existing = this.npcSprites.get(key);
        if (!existing) {
          const sprite = new NPCSprite(this.scene, {
            parts: NPC_WEARABLES.neville,
            x: box.x - 4,
            y: box.y + 11,
            depth: depth + 1,
          });
          void sprite.create();
          this.npcSprites.set(key, sprite);
        } else {
          // The sprite is cached across refreshes, so it has to be told when
          // its building moves (landscaping) or it stays at the old spot.
          existing.setPosition(box.x - 4, box.y + 11);
        }
      } else {
        const key = `${objects.name}-neville`;
        this.npcSprites.get(key)?.destroy();
        this.npcSprites.delete(key);
      }
      if (processing) {
        this.addExtra(objects, "npc", SUNNYSIDE.npcs.fishMarket_npc_doing, {
          x: box.x - 4,
          y: box.y + 17,
          width: 20,
          depth: depth + 1,
          topAnchored: true,
        });
        const icon = ITEM_DETAILS[processing.name].image;
        if (this.scene.textures.exists(icon)) {
          this.addExtra(objects, "processingIcon", icon, {
            x: box.x + 36 / PIXEL_SCALE / 2,
            y: box.y + box.height - 8 / PIXEL_SCALE,
            width: 0.8 * this.scene.textures.get(icon).getSourceImage().width,
            depth: depth + 2,
          });
        }
      }
      this.addReadyRow(
        objects,
        ready.map((p) => p.name),
        40,
        depth,
      );
      if (ready.length > 0) this.addReadyAlert(objects, depth);
      return null;
    }

    if (name in COMPOSTER_IMAGES) {
      const producing = (
        item as { producing?: { startedAt: number; readyAt: number } }
      ).producing;
      const boost = (item as { boost?: unknown }).boost;
      const secondsLeft = producing ? (producing.readyAt - now) / 1000 : 0;
      const composting = secondsLeft > 0;
      const ready = !!producing?.readyAt && secondsLeft <= 0;
      const { width } = COMPOSTER_IMAGES[name as keyof typeof COMPOSTER_IMAGES];
      if (ready) this.addReadyAlert(objects, depth);
      if (boost && composting) {
        this.addExtra(objects, "boost", SUNNYSIDE.icons.stopwatch, {
          x: box.x + box.width + 4 - 10,
          y: box.y + box.height - 22 - 10,
          width: 10,
          depth: depth + 2,
        });
      }
      if (showTimers && composting && producing) {
        const total = Math.max(
          (producing.readyAt - producing.startedAt) / 1000,
          1,
        );
        return {
          x: box.x + (32 - width) / 2 + width / 2 - 7.5,
          y: box.y + box.height - 24 / PIXEL_SCALE - 7,
          pct: Math.min(((total - secondsLeft) / total) * 100, 100),
          seconds: secondsLeft,
        };
      }
      return null;
    }

    if (name === "Crafting Box") {
      const queue = slice.craftingBoxQueue ?? [];
      const inProgress = queue.filter((i) => i.readyAt > now);
      const ready = queue.filter((i) => i.readyAt <= now);
      if (ready.length > 0) {
        // [CraftingBox.tsx] alert at -top-8 (≈12 src px), always shaking.
        this.addReadyAlert(objects, depth, 12);
      }
      if (showTimers && inProgress.length > 0) {
        const job = inProgress[0];
        const total = Math.max(
          (job.readyAt - (job.startedAt ?? job.readyAt)) / 1000,
          1,
        );
        const secondsLeft = (job.readyAt - now) / 1000;
        return {
          x: box.x + 0.5 + 23 - 7.5,
          y: box.y + box.height - 7,
          pct: Math.min(((total - secondsLeft) / total) * 100, 100),
          seconds: secondsLeft,
        };
      }
      return null;
    }

    if (name === "Greenhouse") {
      const pots = Object.values(slice.greenhousePots ?? {});
      const hasActive = pots.some((pot) => pot.plant);
      if (hasActive) {
        this.addExtra(objects, "smoke", SUNNYSIDE.building.smoke, {
          x: box.x + 26 - 50 / PIXEL_SCALE,
          y: box.y + box.height - (46 + 30 / PIXEL_SCALE),
          width: 20,
          topAnchored: true,
          depth: depth + 1,
        });
      }
      const game = this.game();
      const readyPlants = pots.filter(
        (pot) => pot.plant && isGreenhouseReady(now, pot, game),
      );
      readyPlants.slice(0, 4).forEach((pot, index) => {
        const icon = ITEM_DETAILS[pot.plant!.name].image;
        if (!this.scene.textures.exists(icon)) return;
        this.addExtra(objects, `ready-${index}`, icon, {
          x:
            box.x +
            box.width / 2 +
            (index - (Math.min(readyPlants.length, 4) - 1) / 2) * 13,
          y: box.y + 14 + 6,
          width: 12,
          depth: depth + 2,
        });
      });
      return null;
    }

    if (name === "Crop Machine") {
      this.refreshCropMachine(objects, item, now, depth);
      return null;
    }

    if (name === "Aging Shed") {
      const racks = this.game().agingShed.racks;
      const jobs = [
        ...(racks.aging ?? []),
        ...(racks.fermentation ?? []),
        ...(racks.spice ?? []),
      ];
      if (jobs.some((job) => job.readyAt <= now)) {
        this.addReadyAlert(objects, depth);
      }
      return null;
    }

    return null;
  }

  /**
   * [CropMachine.tsx] shadow, growth-stage sheets over the idle machine,
   * the harvested-crops overlay and the ready-crop icon row.
   */
  private refreshCropMachine(
    objects: BuildingObjects,
    item: PlacedItem,
    now: number,
    depth: number,
  ) {
    const { box } = objects;
    this.addExtra(objects, "shadow", SUNNYSIDE.building.shadowCropMachine, {
      x: box.x + box.width / 2 - 4 / PIXEL_SCALE,
      y: box.y + box.height,
      width: 80,
      bottomAnchored: true,
      depth: depth - 1,
    });

    const queue = (item as { queue?: CropMachineQueueItem[] }).queue ?? [];

    // Growth-stage sheet over the machine [Planting/Sprouting/Maturing/
    // Harvesting] — thirds of totalGrowTime, harvesting the last 5s.
    const growingIndex = findGrowingCropPackIndex(queue, now);
    const growing =
      growingIndex !== undefined ? queue[growingIndex] : undefined;
    if (growing?.startTime) {
      const stageDuration = growing.totalGrowTime / 3;
      const stage1 = growing.startTime + stageDuration;
      const stage2 = stage1 + stageDuration;
      const harvestAt = growing.startTime + growing.totalGrowTime - 5000;
      const stage =
        now < stage1
          ? "planting"
          : now < stage2
            ? "sprouting"
            : now < harvestAt
              ? "maturing"
              : "harvesting";
      const sheets: Record<string, { url: string; steps: number }> = {
        planting: { url: SUNNYSIDE.building.plantingCropMachine, steps: 16 },
        sprouting: { url: SUNNYSIDE.building.sproutingCropMachine, steps: 16 },
        maturing: { url: SUNNYSIDE.building.maturingCropMachine, steps: 16 },
        harvesting: {
          url: SUNNYSIDE.building.harvestingCropMachine,
          steps: 13,
        },
      };
      const sheet = sheets[stage];
      if (this.scene.textures.exists(sheet.url)) {
        const animKey = `${sheet.url}-loop`;
        if (!this.scene.anims.exists(animKey)) {
          this.scene.anims.create({
            key: animKey,
            frames: this.scene.anims.generateFrameNumbers(sheet.url, {
              start: 0,
              end: sheet.steps - 1,
            }),
            frameRate: 10,
            repeat: -1,
          });
        }
        if (
          !objects.stageSheet ||
          objects.stageSheet.anims.currentAnim?.key !== animKey
        ) {
          objects.stageSheet?.destroy();
          objects.stageSheet = this.scene.add
            .sprite(box.x, box.y + box.height, sheet.url)
            .setOrigin(0, 1);
          objects.stageSheet.setScale(80 / 80);
          objects.stageSheet.play(animKey);
        }
        objects.stageSheet.setPosition(box.x, box.y + box.height);
        objects.stageSheet.setDepth(depth + 1);
      }
    } else {
      objects.stageSheet?.destroy();
      objects.stageSheet = undefined;
    }

    // Harvested crops overlay + ready-crop icon row.
    const readyCrops = queue.filter((pack) => isCropPackReady(pack, now));
    if (readyCrops.length > 0) {
      this.addExtra(
        objects,
        "harvested",
        SUNNYSIDE.building.harvestedCropsImage,
        {
          x: box.x,
          y: box.y + box.height - 3,
          width: 15,
          bottomAnchored: true,
          depth: depth + 2,
        },
      );
      // [CropMachine.tsx] centred icon row at top 16 (w-8 icons ≈ 12 src px).
      const iconWidth = 12;
      const totalWidth = readyCrops.length * (iconWidth + 1);
      let x = box.x + (80 - totalWidth) / 2;
      readyCrops.slice(0, 6).forEach((pack, index) => {
        const icon = ITEM_DETAILS[pack.crop]?.image;
        if (!icon || !this.scene.textures.exists(icon)) return;
        this.addExtra(objects, `ready-crop-${index}`, icon, {
          x,
          y: box.y + 16,
          width: iconWidth,
          depth: depth + 3,
        });
        x += iconWidth + 1;
      });
    }
  }

  /** The five Recipes-flow buildings [FirePit/Kitchen/Bakery/Deli/SmoothieShack]. */
  private refreshCooking(
    objects: BuildingObjects,
    slice: Slice,
    item: PlacedItem,
    now: number,
    depth: number,
  ) {
    const name = objects.name as CookingBuilding;
    const { box } = objects;
    const layout = COOKING_LAYOUT[name];
    const crafting = item.crafting ?? [];
    const cooking = crafting.find((product) => product.readyAt > now);
    const ready = crafting.filter((product) => product.readyAt <= now);

    objects.base?.setAlpha(cooking ? 0.8 : 1);

    if (layout.shadow) {
      this.addExtra(objects, "shadow", shadow, {
        ...this.anchored(box, layout.shadow, 15),
        width: layout.shadow.width,
        depth: depth + 1,
      });
    }

    const npc = cooking ? layout.npcDoing : layout.npcIdle;
    this.addExtra(objects, "npc", npc.texture, {
      ...this.anchored(box, npc, npc.width),
      width: npc.width,
      depth: depth + 2,
      flip: npc.flip,
    });

    // Desk drawn over the NPC [SmoothieShack.tsx].
    if (name === "Smoothie Shack") {
      const desk = SMOOTHIE_SHACK_DESK_VARIANTS[slice.season];
      if (this.scene.textures.exists(desk)) {
        this.addExtra(objects, "desk", desk, {
          x: box.x + box.width - 12 - 24,
          y: box.y + (slice.season === "summer" ? 2 : 0),
          width: 24,
          topAnchored: true,
          depth: depth + 3,
        });
      }
    }

    if (cooking && layout.smoke) {
      this.addExtra(objects, "smoke", SUNNYSIDE.building.smoke, {
        x: box.x + layout.smoke.left,
        y: box.y + box.height - layout.smoke.bottom,
        width: layout.smoke.width,
        bottomAnchored: true,
        depth: depth + 1,
      });
    }

    if (cooking) {
      const icon = ITEM_DETAILS[cooking.name].image;
      if (this.scene.textures.exists(icon)) {
        const w = this.scene.textures.get(icon).getSourceImage().width;
        let x: number;
        if (layout.icon.anchor === "left") {
          x = box.x + Math.floor(layout.icon.base - w / 2);
        } else if (layout.icon.formula === "half") {
          x = box.x + box.width - Math.floor(layout.icon.base - w / 2) - w;
        } else {
          x = box.x + box.width - Math.floor((layout.icon.base - w) / 2) - w;
        }
        this.addExtra(objects, "cookingIcon", icon, {
          x,
          y: box.y + box.height - layout.icon.bottom,
          width: w,
          bottomAnchored: true,
          depth: depth + 4,
        });
      }
    }

    this.addReadyRow(
      objects,
      ready.map((product) => product.name),
      layout.readyLeftOffsetCss,
      depth,
    );
    if (ready.length > 0) this.addReadyAlert(objects, depth);
  }

  /** [ReadyRecipes.tsx] floating item icons hanging below the box. */
  private addReadyRow(
    objects: BuildingObjects,
    names: string[],
    leftOffsetCss: number,
    depth: number,
  ) {
    const { box } = objects;
    names.forEach((itemName, index) => {
      const icon = ITEM_DETAILS[itemName as keyof typeof ITEM_DETAILS]?.image;
      if (!icon || !this.scene.textures.exists(icon)) return;
      const w = this.scene.textures.get(icon).getSourceImage().width;
      this.addExtra(objects, `readyRow-${index}`, icon, {
        x: box.x + (w / 2) * index + leftOffsetCss / PIXEL_SCALE,
        y: box.y + box.height + 3.8,
        width: w,
        bottomAnchored: true,
        depth: depth + 3 + index,
      });
    });
  }

  /**
   * [TownCenter.tsx / House.tsx / Manor.tsx / Mansion.tsx] home-building
   * extras: the daily-reward chest (click -> global DAILY_REWARD modal),
   * the mailbox (click -> letterBox farm modal, news alert from the discord
   * cache) and the transient collect heart. The HomeBumpkins row renders in
   * PlayerRenderer (it owns NPCSprite lifecycles).
   */
  private refreshHomeExtras(
    objects: BuildingObjects,
    name: keyof typeof HOME_EXTRA_OFFSETS,
    now: number,
    depth: number,
  ) {
    const { box } = objects;
    const offsets = HOME_EXTRA_OFFSETS[name];
    const machine = this.bridge.select((state) => state);
    const game = machine.context.state;
    const visiting = machine.context.visitorId !== undefined;
    // DOM source order puts the mailbox and chest ABOVE the HomeBumpkins row
    // (chest wrapper is z-20) — their zones must beat the row's NPC zones.
    const topDepth = DEPTHS.ENTITY_BASE + box.y + box.height;

    // Daily-reward chest [DailyReward.tsx]: level 6+, own farm only.
    const hasChestLevel = meetsLevelRequirement(
      getAscensionLevel({
        experience: game.bumpkin?.experience ?? 0,
        ascensionLevel: game.island.ascensionLevel ?? 0,
      }),
      { ascension: 0, level: 6 },
    );
    if (!visiting && hasChestLevel) {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const collected =
        (game.dailyRewards?.chest?.collectedAt ?? 0) > today.getTime();
      // Inner div: left 1.5 tiles, top 1 tile; chest fills its 16px div.
      const chestX = box.x + offsets.daily.x + 24;
      const chestY = box.y + offsets.daily.y + 16;
      const chest = this.addExtra(
        objects,
        "daily-chest",
        collected
          ? SUNNYSIDE.decorations.treasure_chest_opened
          : SUNNYSIDE.decorations.treasure_chest,
        {
          x: chestX,
          y: chestY + 16,
          width: 16,
          depth: topDepth + 2,
          bottomAnchored: true,
        },
      );
      if (chest) {
        makeClickable(this.scene, chest, () =>
          this.bridge.openModal("DAILY_REWARD"),
        );
      }
      if (!collected) {
        this.addExtra(
          objects,
          "daily-alert",
          SUNNYSIDE.icons.expression_alerted,
          {
            x: chestX + 6,
            y: chestY - 14,
            width: 4,
            depth: topDepth + 3,
          },
        );
      }
    }

    // Mailbox [LetterBox.tsx]: 16px hit div, art 8px at (+4, 0).
    const mailX =
      "right" in offsets.letter
        ? box.x + box.width - offsets.letter.right - 16
        : box.x + offsets.letter.x;
    const mailY =
      "bottomUp" in offsets.letter
        ? box.y + box.height - offsets.letter.bottomUp - 16
        : box.y + offsets.letter.y;
    const mailbox = this.addExtra(objects, "mailbox", mailboxImg, {
      x: mailX + 4,
      y: mailY,
      width: 8,
      depth: topDepth + 1,
    });
    if (mailbox) {
      makeClickable(this.scene, mailbox, () =>
        this.bridge.farmModal.open("letterBox"),
      );
    }
    try {
      const latest = getDiscordNewsLatestAt();
      const read = getDiscordNewsReadAt();
      if (!visiting && latest && (!read || latest > read)) {
        this.addExtra(objects, "mail-alert", newsIcon, {
          x: mailX + 1.8,
          y: mailY - 13,
          width: 13,
          depth: topDepth + 1.5,
        });
      }
    } catch {
      // storage unavailable — no alert
    }

    // Collect heart [recipes.collected], shown for 3s.
    if (this.heartShownUntil > now) {
      this.addExtra(objects, "collect-heart", SUNNYSIDE.icons.heart, {
        x: box.x + 8,
        y: box.y + 10,
        width: 10,
        depth: topDepth + 3,
      });
    }
  }

  /**
   * [HenHouse.tsx / Barn.tsx] hungry / sick / needs-love icon row, centred
   * above the building (-top-2, gap-2). Reads live state each 1s tick so
   * time-gated flags (awakeAt, love window) flip on schedule. Icons stay
   * static — animated alerts read as jitter.
   */
  private refreshAnimalAlerts(
    objects: BuildingObjects,
    name: "Hen House" | "Barn",
    now: number,
    depth: number,
  ) {
    const { box } = objects;
    const game = this.bridge.select((state) => state.context.state);
    const buildingKey = name === "Hen House" ? "henHouse" : "barn";
    const animals = Object.values(game[buildingKey].animals);
    const lockedIds = getOverCapacityAnimalIds(buildingKey, game);

    const icons: { key: string; src: string; width: number }[] = [];
    if (
      animals.some(
        (animal) => animal.awakeAt < now && !lockedIds.has(animal.id),
      )
    ) {
      icons.push({
        key: "hungry",
        src: SUNNYSIDE.icons.expression_alerted,
        width: 4,
      });
    }
    if (animals.some((animal) => animal.state === "sick")) {
      icons.push({
        key: "sick",
        src: SUNNYSIDE.icons.expression_stress,
        width: 7,
      });
    }
    if (
      animals.some(
        (animal) =>
          !isAnimalCoveredByGoldenAsset({
            state: game,
            animalType: animal.type,
          }) && isAnimalReadyForLove(animal, now),
      )
    ) {
      icons.push({
        key: "love",
        src: SUNNYSIDE.icons.expression_chat,
        width: 8,
      });
    }

    // Row centred at box top: gap-2 = 8 CSS px ≈ 3 src px, -top-2 ≈ 3 above.
    const GAP = 3;
    const totalWidth =
      icons.reduce((sum, icon) => sum + icon.width, 0) +
      GAP * Math.max(0, icons.length - 1);
    let x = box.x + (box.width - totalWidth) / 2;
    for (const icon of icons) {
      this.addExtra(objects, `animal-alert-${icon.key}`, icon.src, {
        x,
        y: box.y - 3,
        width: icon.width,
        depth: depth + 2,
        bottomAnchored: true,
      });
      x += icon.width + GAP;
    }
  }

  /** [BuildingImageWrapper] alert at top -12 (or -12.19 for CraftingBox). */
  private addReadyAlert(
    objects: BuildingObjects,
    depth: number,
    topOffset = 12,
  ) {
    const { box } = objects;
    const alert = this.addExtra(
      objects,
      READY_ALERT,
      SUNNYSIDE.icons.expression_alerted,
      {
        x: box.x + box.width / 2 - 2,
        y: box.y - topOffset,
        width: 4,
        topAnchored: true,
        depth: depth + 5,
      },
    );
    // Deliberately NOT animated: the DOM's .ready shake reads as jitter at
    // this scale (Adam 2026-08-27) — static until a nicer treatment exists.
    void alert;
  }

  private addExtra(
    objects: BuildingObjects,
    key: string,
    texture: string,
    options: {
      x: number;
      y: number;
      width: number;
      depth: number;
      topAnchored?: boolean;
      bottomAnchored?: boolean;
      flip?: boolean;
    },
  ): ArtObject | undefined {
    // Animated art (cooking NPCs, smoke) plays its converted strip.
    const image = resolveArtObject(this.scene, undefined, texture);
    if (!image) return undefined;
    image.setOrigin(0, options.bottomAnchored ? 1 : 0).setDepth(options.depth);
    // Native pixels, re-centred on the spot the DOM's width put it.
    const shift = nativeScale(image, options.width);
    image.setPosition(options.x + shift, options.y);
    if (options.flip) image.setFlipX(true);
    objects.extras.set(key, image);
    return image;
  }

  /** DOM offsets: left/right/top/bottom measured inside the box. */
  private anchored(
    box: WorldRect,
    anchor: { left?: number; right?: number; top?: number; bottom?: number },
    width: number,
  ): { x: number; y: number; topAnchored?: boolean; bottomAnchored?: boolean } {
    const x =
      anchor.right !== undefined
        ? box.x + box.width - anchor.right - width
        : box.x + (anchor.left ?? 0);
    if (anchor.bottom !== undefined) {
      return { x, y: box.y + box.height - anchor.bottom, bottomAnchored: true };
    }
    return { x, y: box.y + (anchor.top ?? 0), topAnchored: true };
  }

  private composterState(
    item: PlacedItem,
    now: number,
  ): "idle" | "composting" | "ready" {
    const producing = (
      item as { producing?: { startedAt: number; readyAt: number } }
    ).producing;
    if (!producing?.readyAt) return "idle";
    const secondsLeft = (producing.readyAt - now) / 1000;
    if (secondsLeft > 0) return "composting";
    return "ready";
  }

  private itemOf(slice: Slice, name: BuildingName, id: string) {
    return slice.buildings[name]?.find((building) => building.id === id);
  }

  private game() {
    return this.bridge.select((state) => state.context.state);
  }

  update(_time: number, delta: number) {
    this.tickMs += delta;
    if (this.tickMs < 1000) return;
    this.tickMs = 0;
    const slice = this.bridge.select((state) => this.selector(state));
    const now = Date.now();
    for (const objects of this.nodes.values()) {
      this.refreshBuilding(objects, slice, now);
    }
    this.applyMovingVisibility();
  }

  /** [Building.tsx + each component's handleClick] */
  private onBuildingClick(name: BuildingName, id: string, index: number) {
    const machine = this.bridge.select((state) => state);
    const game = machine.context.state;
    const item = game.buildings[name]?.find((building) => building.id === id);
    if (!item) return;
    const now = Date.now();

    // Visiting [PetHouse.tsx:67-82 / Manor.tsx etc]: home set navigates into
    // the visited interior; Pet House helps all pets first when needed.
    if (machine.context.visitorId !== undefined) {
      const farmId = machine.context.farmId;
      if (name === "Pet House") {
        if (getHelpRequired({ game }).tasks.petHouse.count > 0) {
          this.bridge.dispatch({
            type: "pet.helpAllPetsInHouse",
            totalHelpedToday: machine.context.totalHelpedToday ?? 0,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
          if (isHelpComplete({ game: this.game() })) {
            this.bridge.farmModal.open("farmHelped");
          }
          return;
        }
        this.bridge.navigateTo(`/visit/${farmId}/pet-house`);
        return;
      }
      this.bridge.navigateTo(getHomeRoute({ game, isVisiting: true, farmId }));
      return;
    }

    // Level gate [BuildingImageWrapper]. Toolshed/Warehouse/Tent are
    // non-interactive in the DOM; skip their click entirely.
    if (name === "Toolshed" || name === "Warehouse" || name === "Tent") return;

    if ((item.readyAt ?? 0) > now) {
      this.bridge.farmModal.open("buildingConstructing", { name, id });
      return;
    }

    const destroyedBy = isBuildingDestroyed({ name, calendar: game.calendar });
    if (destroyedBy) {
      this.bridge.farmModal.open("buildingDestroyed", {
        name,
        event: destroyedBy,
      });
      return;
    }

    const level = getAscensionLevel({
      experience: game.bumpkin?.experience ?? 0,
      ascensionLevel: game.island.ascensionLevel ?? 0,
    });
    if (name !== "Water Well" && !isBuildingEnabled(level, name)) {
      this.bridge.farmModal.open("buildingLevelLocked", { name });
      return;
    }

    if (isCookingBuilding(name)) {
      const crafting = item.crafting ?? [];
      const cooking = crafting.find((product) => product.readyAt > now);
      const ready = crafting.filter((product) => product.readyAt <= now);
      if (!cooking && ready.length > 0) {
        this.bridge.dispatch({
          type: "recipes.collected",
          building: name,
          buildingId: id,
        });
        return;
      }
      playSound("bakery");
      this.bridge.farmModal.open("cooking", { building: name, buildingId: id });
      return;
    }

    switch (name) {
      case "Market":
        playSound("shop");
        this.bridge.farmModal.open("market");
        return;
      case "Workbench":
        this.bridge.farmModal.open("workbench");
        return;
      case "Water Well":
        this.bridge.farmModal.open("waterWell");
        return;
      case "Compost Bin":
      case "Turbo Composter":
      case "Premium Composter":
        this.bridge.farmModal.open("composter", { name });
        return;
      case "Crafting Box":
        this.bridge.dispatch("SAVE");
        this.bridge.farmModal.open("craftingBox");
        return;
      case "Fish Market": {
        const processing = (item.processing ?? []).find(
          (product) => product.readyAt > now,
        );
        const ready = (item.processing ?? []).filter(
          (product) => product.readyAt <= now,
        );
        if (!processing && ready.length > 0) {
          this.bridge.dispatch({
            type: "processedResource.collected",
            buildingId: id,
            buildingName: "Fish Market",
          });
          return;
        }
        this.bridge.farmModal.open("fishMarket", { buildingId: id });
        return;
      }
      case "Aging Shed":
        this.bridge.farmModal.open("agingShed");
        return;
      case "Crop Machine":
        this.bridge.farmModal.open("cropMachine", { buildingId: id });
        return;
      case "Hen House":
        playSound("barn");
        this.bridge.navigateTo("/hen-house");
        return;
      case "Barn":
        playSound("barn");
        this.bridge.navigateTo("/barn");
        return;
      case "Greenhouse":
        this.bridge.navigateTo("/greenhouse");
        return;
      case "Pet House":
        this.bridge.navigateTo("/pet-house");
        return;
      case "Town Center":
      case "House":
      case "Manor":
      case "Mansion":
        this.bridge.navigateTo(
          getHomeRoute({
            game,
            isVisiting: false,
            farmId: machine.context.farmId,
          }),
        );
        return;
      default:
        return;
    }
  }

  /**
   * While landscaping drags a building, the controller draws a preview at the
   * cursor — hide the original (and its NPC) so only one is on screen.
   */
  private applyMovingVisibility() {
    const moving = this.bridge.landscapingMoving.get();
    for (const objects of this.nodes.values()) {
      const hidden = !!moving && moving.id === objects.id;
      objects.base?.setVisible(!hidden);
      objects.stageSheet?.setVisible(!hidden);
      objects.extras.forEach((extra) => extra.setVisible(!hidden));
      objects.bar?.setVisible(!hidden);
      const npc = this.npcSprites.get(`${objects.name}-neville`);
      if (npc && objects.name === moving?.name) npc.setVisible(!hidden);
      else npc?.setVisible(true);
    }
  }

  private destroyNode(objects: BuildingObjects) {
    objects.stageSheet?.destroy();
    objects.zone.destroy();
    objects.base?.destroy();
    objects.extras.forEach((image) => image.destroy());
    objects.extras.clear();
    objects.bar?.destroy();
    objects.alertTween?.remove();
  }

  protected onDestroy() {
    this.npcSprites.forEach((sprite) => sprite.destroy());
    this.npcSprites.clear();
    this.unsubscribeEvents?.();
    this.unsubscribeEvents = undefined;
    this.nodes.forEach((objects) => this.destroyNode(objects));
    this.nodes.clear();
  }
}
