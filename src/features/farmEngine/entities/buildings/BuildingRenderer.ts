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
  type AscensionLevel,
} from "features/game/lib/level";
import { getHomeRoute } from "features/island/buildings/lib/getHomeRoute";
import { getHelpRequired, isHelpComplete } from "features/game/types/monuments";
import { isGreenhouseReady } from "features/game/events/landExpansion/greenhouseReadiness";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { queueImage, runLoader } from "../../core/assets";
import { makeClickable } from "../../core/clickable";
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
  extras: Map<string, Phaser.GameObjects.Image>;
  bar?: ProgressBarSprite;
  alertTween?: Phaser.Tweens.Tween;
};

const READY_ALERT = "readyAlert";

export class BuildingRenderer extends EntityRenderer<Slice> {
  private nodes = new Map<string, BuildingObjects>();
  private tickMs = 0;

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
      SUNNYSIDE.icons.stopwatch,
      SUNNYSIDE.ui.emptyBar,
      SUNNYSIDE.building.smoke,
      SUNNYSIDE.building.shadowCropMachine,
      SUNNYSIDE.building.harvestedCropsImage,
      SMOOTHIE_SHACK_DESK_VARIANTS[slice.season],
    ].forEach((url) => queueImage(this.scene, url));

    for (const { name, item } of placements) {
      const art = BUILDING_BASE_ART[name]?.(ctx);
      if (art) queueImage(this.scene, art.texture);
      if (isCookingBuilding(name)) {
        const layout = COOKING_LAYOUT[name];
        queueImage(this.scene, layout.npcIdle.texture);
        queueImage(this.scene, layout.npcDoing.texture);
      }
      if (name in COMPOSTER_IMAGES) {
        const images = COMPOSTER_IMAGES[name as keyof typeof COMPOSTER_IMAGES];
        [images.idle, images.composting, images.ready].forEach((url) =>
          queueImage(this.scene, url),
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

    const depth = DEPTHS.ENTITY_BASE + box.y + box.height;
    if (!objects.base) {
      objects.base = this.scene.add.image(0, 0, art.texture).setOrigin(0, 1);
    }
    objects.base.setTexture(art.texture);
    objects.base.setScale(art.width / objects.base.width);
    objects.base.setPosition(box.x + art.left, box.y + box.height - art.bottom);
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

    if (name === "Fish Market") {
      const processing = (item.processing ?? []).find((p) => p.readyAt > now);
      const ready = (item.processing ?? []).filter((p) => p.readyAt <= now);
      // NPC [FishMarket.tsx]: neville_doing while processing (idle NPC is a
      // composed bumpkin — deferred to the characters phase).
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
      // Shadow + ready crops overlay; stage sheets deferred (idle art always).
      this.addExtra(objects, "shadow", SUNNYSIDE.building.shadowCropMachine, {
        x: box.x + box.width / 2 - 4 / PIXEL_SCALE,
        y: box.y + box.height,
        width: 80,
        bottomAnchored: true,
        depth: depth - 1,
      });
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
  ): Phaser.GameObjects.Image | undefined {
    if (!this.scene.textures.exists(texture)) return undefined;
    const image = this.scene.add
      .image(options.x, options.y, texture)
      .setOrigin(0, options.bottomAnchored ? 1 : 0)
      .setDepth(options.depth);
    image.setScale(options.width / image.width);
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

  private destroyNode(objects: BuildingObjects) {
    objects.zone.destroy();
    objects.base?.destroy();
    objects.extras.forEach((image) => image.destroy());
    objects.extras.clear();
    objects.bar?.destroy();
    objects.alertTween?.remove();
  }

  protected onDestroy() {
    this.nodes.forEach((objects) => this.destroyNode(objects));
    this.nodes.clear();
  }
}
