import Phaser from "phaser";
import shadowArt from "assets/npcs/shadow.png";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState, PlacedItem } from "features/game/types/game";
import type { CollectibleName } from "features/game/types/craftables";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { DECORATION_TEMPLATES } from "features/game/types/decorations";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getGameGrid,
  type GameGrid,
} from "features/game/expansion/placeable/lib/makeGrid";
import { getSortedCollectiblePositions } from "features/game/expansion/lib/utils";
import { NON_COLLIDING_OBJECTS } from "features/game/expansion/placeable/lib/collisionDetection";
import { getFenceImage } from "features/island/collectibles/components/Fence";
import { getGoldenFenceImage } from "features/island/collectibles/components/GoldenFence";
import { getStoneFenceImage } from "features/island/collectibles/components/StoneFence";
import { getGoldenStoneFenceImage } from "features/island/collectibles/components/GoldenStoneFence";
import {
  getTileImage,
  TILE_NAMES,
} from "features/island/collectibles/components/Tiles";
import type { TileName } from "features/game/types/decorations";
import { isHelpComplete, REQUIRED_CHEERS } from "features/game/types/monuments";
import { PROJECT_IMAGES } from "features/island/collectibles/components/Project";
import type { MonumentName } from "features/game/types/monuments";
import { queueImage, runLoader } from "../../core/assets";
import {
  artTexture,
  queueArt,
  resolveArtObject,
  type ArtObject,
} from "../../core/animated";
import { makeClickable } from "../../core/clickable";
import {
  gridRectToWorld,
  WORLD_TILE,
  type WorldRect,
} from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { ProgressBarSprite } from "../../components/ProgressBarSprite";
import {
  EXPIRING_COLLECTIBLES,
  isExpiringCollectible,
} from "./expiringCollectibles";
import {
  BUSH_VARIANTS,
  SALT_SCULPTURE_VARIANTS,
} from "features/island/lib/alternateArt";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { canShake } from "features/island/collectibles/components/ManekiNeko";
import wickerManFire from "assets/sfts/wicker_man_fire.png";
import bombardClick from "assets/sfts/tomato_bombard_click.png";
import bombardIdle from "assets/sfts/tomato_bombard_idle.png";
import golemSheet from "assets/sfts/rock_golem.png";
import { canMine } from "features/game/lib/resourceNodes";
import {
  BED_FARMHAND_COUNT,
  getPlacedBedNames,
} from "features/game/types/beds";
import type { BedName } from "features/game/types/game";
import {
  BED_WIDTH,
  BED_HEIGHT,
} from "features/island/collectibles/components/Bed";
import { getExpiryCooldown } from "features/game/lib/collectibleBuilt";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { EntityRenderer } from "../EntityRenderer";
import squirrelMonkeySheet from "assets/sfts/squirrel_monkey_sheet.png";
import { ensureSheetAnim, type SheetSpec } from "../resources/lib";
import { queueSpritesheet } from "../../core/assets";
import {
  STATIC_COLLECTIBLES,
  TEMPLATE_COLLECTIBLES,
  type StaticCollectibleSpec,
} from "./staticCollectibles";
import { isCommonPetName } from "../characters/PetRenderer";

/**
 * Placed collectibles [island/collectibles/Collectible.tsx + the 369
 * components + CollectibleCollection.tsx inline entries]. The ~535 static
 * pieces come from the generated STATIC_COLLECTIBLES table; template pieces
 * (TemplateCollectible + DECORATION_TEMPLATES) draw ITEM_DETAILS art at
 * natural width, bottom-centred; fences/tiles autotile via the DOM's exported
 * helpers over the same GameGrid; flowers use PlaceableFlower's width rule.
 *
 * In-progress (readyAt > now) = 50% alpha + centred bar + speed-up modal —
 * the same contract as buildings.
 *
 * DEFERRED: the ~25 stateful collectibles' behaviours (totem/hourglass expiry
 * art + renew, Genie Lamp/Maneki Neko/Festive Tree reveals, monuments/projects,
 * beds, salt sculpture levels, Bush/banner season variants) — they render
 * their table/template art; SFT detail click popovers; landscaping mode;
 * animated gifs (first frame); the 4 spritesheet components (static frame).
 */

type Slice = {
  collectibles: GameState["collectibles"];
  crops: GameState["crops"];
  island: GameState["island"];
  season: GameState["season"]["season"];
  sculptures: GameState["sculptures"];
  villageProjects: GameState["socialFarming"]["villageProjects"];
};

const FENCES: Partial<
  Record<CollectibleName, (grid: GameGrid, x: number, y: number) => string>
> = {
  Fence: getFenceImage,
  "Golden Fence": getGoldenFenceImage,
  "Stone Fence": getStoneFenceImage,
  "Golden Stone Fence": getGoldenStoneFenceImage,
};

/** [PlaceableFlower.tsx getFlowerPixelWidth] */
const flowerPixelWidth = (name: string): number => {
  if (name.includes("Carnation")) return 7;
  if (name.includes("Pansy")) return 9;
  if (name.includes("Cosmos")) return 10;
  if (name.includes("Lavender") || name.includes("Clover")) return 11;
  if (name.includes("Balloon Flower") || name.includes("Daffodil")) return 13;
  if (name.includes("Lotus") || name.includes("Edelweiss")) return 18;
  if (name.includes("Gladiolus")) return 19;
  return 10;
};

const isPlaceableFlower = (name: string) =>
  /Carnation|Pansy|Cosmos|Lavender|Clover|Balloon Flower|Daffodil|Lotus|Edelweiss|Gladiolus/.test(
    name,
  ) && !STATIC_COLLECTIBLES[name as CollectibleName];

const TEMPLATE_SET = new Set<string>([
  ...TEMPLATE_COLLECTIBLES,
  ...Object.keys(DECORATION_TEMPLATES),
]);

/**
 * Always-looping spritesheet collectibles [SquirrelMonkey.tsx]. The other
 * three sheet components (Wicker Man, Tomato Bombard, Rock Golem) are
 * click/state-triggered — deferred.
 */
const SHEET_COLLECTIBLES: Partial<
  Record<
    CollectibleName,
    {
      sheet: SheetSpec;
      width: number;
      bottom: number;
      left: number;
      shadow?: { width: number; bottom: number; left: number };
    }
  >
> = {
  "Squirrel Monkey": {
    sheet: {
      url: squirrelMonkeySheet,
      frameWidth: 26,
      frameHeight: 32,
      fps: 12,
      steps: 9,
    },
    width: 26,
    bottom: 0,
    left: 4,
    shadow: { width: 15, bottom: 5, left: 7 },
  },
};

type NodeObjects = {
  name: CollectibleName;
  box: WorldRect;
  zone: Phaser.GameObjects.Zone;
  art?: ArtObject;
  sheet?: Phaser.GameObjects.Sprite;
  shadow?: Phaser.GameObjects.Image;
  bar?: ProgressBarSprite;
  /** Expiring boosts: status icon + its tween, and the grayscale flag. */
  expiryIcon?: Phaser.GameObjects.Image;
  expiryIconTween?: Phaser.Tweens.Tween;
  grayscaled?: boolean;
};

/**
 * Click-triggered one-shot sheets [WickerMan.tsx / TomatoBombard.tsx]: an
 * idle frame (or idle loop) that plays a burst animation when clicked.
 */
const CLICK_SHEETS: Partial<
  Record<
    CollectibleName,
    {
      url: string;
      frameWidth: number;
      frameHeight: number;
      frames: { start: number; end: number };
      fps: number;
      width: number;
      left: number;
      bottom: number;
      idle?: {
        url: string;
        frameWidth: number;
        frameHeight: number;
        frames: { start: number; end: number };
        fps: number;
        width: number;
        left: number;
      };
    }
  >
> = {
  "Wicker Man": {
    url: wickerManFire,
    frameWidth: 48,
    frameHeight: 58,
    frames: { start: 0, end: 31 },
    fps: 12,
    width: 48,
    left: -14,
    bottom: 0,
  },
  "Tomato Bombard": {
    url: bombardClick,
    frameWidth: 84,
    frameHeight: 87,
    frames: { start: 0, end: 31 },
    fps: 12,
    width: 84,
    left: -26,
    bottom: 0,
    idle: {
      url: bombardIdle,
      frameWidth: 32,
      frameHeight: 32,
      frames: { start: 0, end: 25 },
      fps: 7,
      width: 32,
      left: 0,
    },
  },
};

export class CollectibleRenderer extends EntityRenderer<Slice> {
  private nodes = new Map<string, NodeObjects>();
  private tickMs = 0;

  selector(state: MachineState): Slice {
    const game = state.context.state;
    return {
      collectibles: game.collectibles,
      crops: game.crops,
      island: game.island,
      season: game.season.season,
      sculptures: game.sculptures,
      villageProjects: game.socialFarming.villageProjects,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.collectibles === b.collectibles &&
    a.crops === b.crops &&
    a.island === b.island &&
    a.season === b.season &&
    a.sculptures === b.sculptures &&
    a.villageProjects === b.villageProjects;

  private placements(slice: Slice) {
    const out: { name: CollectibleName; item: PlacedItem }[] = [];
    for (const [name, items] of Object.entries(slice.collectibles)) {
      if (name === "Dirt Path") continue; // painted by DirtLayer
      if (isCommonPetName(name)) continue; // PetRenderer owns placed pets
      (items ?? []).forEach((item) => {
        if (item.coordinates) {
          out.push({ name: name as CollectibleName, item });
        }
      });
    }
    return out;
  }

  private buildGrid(slice: Slice): GameGrid {
    return getGameGrid({
      cropPositions: Object.values(slice.crops).filter(
        (plot) => plot.x !== undefined && plot.y !== undefined,
      ) as { x: number; y: number }[],
      collectiblePositions: getSortedCollectiblePositions(slice.collectibles),
    });
  }

  /** The DOM's art for one collectible right now (autotiles need the grid). */
  private artFor(
    name: CollectibleName,
    item: PlacedItem,
    grid: GameGrid,
    slice: Slice,
  ): { texture: string; spec?: StaticCollectibleSpec; tile?: boolean } | null {
    // Season/level-dependent art [Bush.tsx / SaltSculpture.tsx].
    if (name === "Bush") {
      const biome = getCurrentBiome(slice.island);
      const desert = slice.island.type === "desert";
      return {
        texture: BUSH_VARIANTS[biome][slice.season],
        spec: {
          width: desert ? 20 : 28,
          left: desert ? 6 : 2,
          bottom: 0,
        },
      };
    }
    if (name in REQUIRED_CHEERS) {
      const project = name as MonumentName;
      const cheers = slice.villageProjects[project]?.cheers ?? 0;
      const required = REQUIRED_CHEERS[project];
      const pct = Math.round((cheers / required) * 100);
      const images = PROJECT_IMAGES[project];
      const texture =
        cheers >= required
          ? images.ready
          : pct >= 20
            ? images.halfway
            : images.empty;
      const spec = STATIC_COLLECTIBLES[name];
      return { texture, spec };
    }
    if (name in BED_FARMHAND_COUNT) {
      const bed = name as BedName;
      const width = BED_WIDTH[bed];
      const isTwoWide = bed === "Double Bed" || bed === "Pearl Bed";
      // [Bed.tsx] art top -height/2 from the box top -> bottom offset.
      return {
        texture: ITEM_DETAILS[name].image,
        spec: {
          width,
          left: isTwoWide ? 4 : -((width - 16) / 2),
          bottom: 16 - BED_HEIGHT[bed] / 2,
        },
      };
    }
    if ((name as string) === "Festive Tree") {
      return {
        texture: ITEM_DETAILS[name as CollectibleName]?.image,
        spec: { width: 30, left: 1, bottom: 2 },
      };
    }
    if (name === "Salt Sculpture") {
      const level = slice.sculptures?.["Salt Sculpture"]?.level ?? 1;
      return {
        texture: SALT_SCULPTURE_VARIANTS[level],
        spec: { width: 47, left: 0.5, bottom: 0 },
      };
    }
    const fence = FENCES[name];
    if (fence) {
      return {
        texture: fence(grid, item.coordinates!.x, item.coordinates!.y),
        tile: true,
      };
    }
    if (TILE_NAMES.has(name)) {
      return {
        texture: getTileImage(
          name as TileName,
          grid,
          item.coordinates!.x,
          item.coordinates!.y,
        ),
        tile: true,
      };
    }
    const spec = STATIC_COLLECTIBLES[name];
    if (spec) {
      return { texture: spec.art ?? ITEM_DETAILS[name].image, spec };
    }
    // Templates, flowers, and (for now) the stateful specials fall back to
    // ITEM_DETAILS art.
    return {
      texture: ITEM_DETAILS[name]?.image ?? SUNNYSIDE.icons.expression_confused,
    };
  }

  async sync(slice: Slice) {
    const token = this.beginSync();
    const grid = this.buildGrid(slice);
    const placements = this.placements(slice);

    queueImage(this.scene, shadowArt);
    queueImage(this.scene, SUNNYSIDE.ui.emptyBar);
    for (const { name, item } of placements) {
      const sheet = SHEET_COLLECTIBLES[name];
      if (sheet) {
        queueSpritesheet(this.scene, sheet.sheet.url, {
          frameWidth: sheet.sheet.frameWidth,
          frameHeight: sheet.sheet.frameHeight,
        });
        continue;
      }
      const clickSheet = CLICK_SHEETS[name];
      if (clickSheet) {
        queueSpritesheet(this.scene, clickSheet.url, {
          frameWidth: clickSheet.frameWidth,
          frameHeight: clickSheet.frameHeight,
        });
        if (clickSheet.idle) {
          queueSpritesheet(this.scene, clickSheet.idle.url, {
            frameWidth: clickSheet.idle.frameWidth,
            frameHeight: clickSheet.idle.frameHeight,
          });
        }
        continue;
      }
      if (name === "Rock Golem") {
        queueSpritesheet(this.scene, golemSheet, {
          frameWidth: 34,
          frameHeight: 42,
        });
        continue;
      }
      const expiring = EXPIRING_COLLECTIBLES[name];
      if (expiring) {
        [
          expiring.images.full,
          expiring.images.half,
          expiring.images.done,
          expiring.activeIcon?.src,
          SUNNYSIDE.icons.dig_icon,
          SUNNYSIDE.icons.expression_alerted,
          SUNNYSIDE.icons.click_icon,
        ]
          .filter((url): url is string => !!url)
          .forEach((url) => queueImage(this.scene, url));
        continue;
      }
      const art = this.artFor(name, item, grid, slice);
      if (art) queueArt(this.scene, art.texture);
    }
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    const liveKeys = new Set(
      placements.map(({ name, item }) => `${name}#${item.id}`),
    );
    for (const [key, objects] of this.nodes) {
      if (liveKeys.has(key)) continue;
      this.destroyNode(objects);
      this.nodes.delete(key);
    }

    const now = Date.now();
    for (const { name, item } of placements) {
      const key = `${name}#${item.id}`;
      const dimensions = COLLECTIBLES_DIMENSIONS[name];
      const box = gridRectToWorld(item.coordinates!, dimensions);

      let objects = this.nodes.get(key);
      if (!objects) {
        const zone = this.scene.add
          .zone(0, 0, box.width, box.height)
          .setOrigin(0, 0);
        makeClickable(
          this.scene,
          zone,
          () => this.onCollectibleClick(name, item.id),
          // [Land.tsx:547] collectibles keep clicks while visiting.
          { visitClickable: true },
        );
        objects = { name, box, zone };
        this.nodes.set(key, objects);
      }
      objects.box = box;
      objects.zone.setPosition(box.x, box.y);
      objects.zone.setSize(box.width, box.height);
      objects.zone.setDepth(DEPTHS.ENTITY_BASE + box.y);

      this.renderNode(objects, name, item, grid, slice, now);
    }
  }

  private renderNode(
    objects: NodeObjects,
    name: CollectibleName,
    item: PlacedItem,
    grid: GameGrid,
    slice: Slice,
    now: number,
  ) {
    const { box } = objects;

    const sheetCfg = SHEET_COLLECTIBLES[name];
    if (sheetCfg) {
      this.renderSheetNode(objects, item, sheetCfg, now);
      return;
    }

    const expiring = EXPIRING_COLLECTIBLES[name];
    if (expiring) {
      this.renderExpiringNode(objects, name, item, expiring, now);
      return;
    }

    const clickSheet = CLICK_SHEETS[name];
    if (clickSheet) {
      this.renderClickSheetNode(objects, name, item, clickSheet);
      return;
    }

    // [RockGolem.tsx] state-driven: standing idle loop until any stone is
    // mined, then the closing animation.
    if (name === "Rock Golem") {
      this.renderRockGolem(objects, item);
      return;
    }

    const art = this.artFor(name, item, grid, slice);
    // Animated art loads under its strip's key, not the original GIF URL.
    if (!art || !this.scene.textures.exists(artTexture(art.texture))) return;

    // Depth [Land.tsx sort]: tiles lowest, then rugs/furniture, then painter's.
    const isTileBand = art.tile || name.includes("Tile");
    const nonColliding = NON_COLLIDING_OBJECTS.includes(name);
    const depth = isTileBand
      ? DEPTHS.DIRT + 100
      : nonColliding
        ? DEPTHS.DIRT + 200
        : DEPTHS.ENTITY_BASE + box.y; // DOM sorts by placement row

    // Animated GIF art (fountain, beavers, moles, Kuebiko...) plays its
    // converted strip; everything else stays a plain Image.
    const resolved = resolveArtObject(this.scene, objects.art, art.texture);
    if (!resolved) return;
    objects.art = resolved;
    const image = resolved;
    image.setDepth(depth);

    const spec = art.spec;
    objects.shadow?.destroy();
    objects.shadow = undefined;

    if (art.tile) {
      // Full 16×16 tile [Fence.tsx / Tiles.tsx].
      image.setOrigin(0, 0);
      image.setScale(WORLD_TILE / image.width);
      image.setPosition(box.x, box.y);
    } else if (spec) {
      const width = spec.width;
      image.setOrigin(0, 1);
      image.setScale(width / image.width);
      let x: number;
      if (spec.centeredIn !== undefined) {
        x = box.x + (spec.left ?? 0) + (spec.centeredIn - width) / 2;
      } else if (spec.right !== undefined) {
        x = box.x + box.width - spec.right - width;
      } else {
        x = box.x + (spec.left ?? 0);
      }
      image.setPosition(x, box.y + box.height - (spec.bottom ?? 0));

      if (spec.shadow) {
        const shadow = this.scene.add
          .image(0, 0, shadowArt)
          .setOrigin(0, 1)
          .setDepth(depth - 0.5);
        shadow.setScale(spec.shadow.width / shadow.width);
        const sx =
          spec.shadow.right !== undefined
            ? box.x + box.width - spec.shadow.right - spec.shadow.width
            : box.x + (spec.shadow.left ?? 0);
        shadow.setPosition(sx, box.y + box.height - (spec.shadow.bottom ?? 0));
        objects.shadow = shadow;
      }
    } else if (isPlaceableFlower(name)) {
      // [PlaceableFlower.tsx] centred in the tile, bottom 2.
      const width = flowerPixelWidth(name);
      image.setOrigin(0, 1);
      image.setScale(width / image.width);
      image.setPosition(box.x + (16 - width) / 2, box.y + box.height - 2);
    } else {
      // Template fallback [TemplateCollectible.tsx]: natural width, centred.
      const natural = this.scene.textures
        .get(art.texture)
        .getSourceImage().width;
      image.setOrigin(0, 1);
      image.setScale(1);
      image.setPosition(
        box.x + box.width / 2 - natural / 2,
        box.y + box.height,
      );
      // Keep template art in the DOM's band even for TEMPLATE_SET misses.
      void TEMPLATE_SET;
    }

    image.setFlipX(!!item.flipped);

    // [GenieLamp.tsx] saturate-50 once rubbed.
    if (name === "Genie Lamp") {
      const rubbed = ((item as { rubbedCount?: number }).rubbedCount ?? 0) > 0;
      if (rubbed && !objects.grayscaled) {
        image.preFX?.addColorMatrix().saturate(-0.5);
        objects.grayscaled = true;
      } else if (!rubbed && objects.grayscaled) {
        image.preFX?.clear();
        objects.grayscaled = false;
      }
    }

    // [Bed.tsx] pulsating unlock icon when this bed can host a new farmhand.
    if (name in BED_FARMHAND_COUNT) {
      const game = this.bridge.select((state) => state.context.state);
      const wanted = this.canSleepHere(name as BedName, game)
        ? SUNNYSIDE.icons.click_icon
        : undefined;
      if (objects.expiryIcon?.texture.key !== wanted) {
        objects.expiryIconTween?.remove();
        objects.expiryIconTween = undefined;
        objects.expiryIcon?.destroy();
        objects.expiryIcon = undefined;
      }
      if (wanted && !objects.expiryIcon && this.scene.textures.exists(wanted)) {
        const isTwoWide = name === "Double Bed" || name === "Pearl Bed";
        const icon = this.scene.add
          .image(box.x + (isTwoWide ? 16 : 8), box.y + box.height - 14, wanted)
          .setOrigin(0, 0)
          .setDepth(depth + 2);
        icon.setScale(14 / icon.width);
        makeClickable(this.scene, icon, () =>
          this.bridge.farmModal.open("bedFarmhand", { name }),
        );
        if (this.bridge.ui.get().showAnimations) {
          objects.expiryIconTween = this.scene.tweens.add({
            targets: icon,
            scale: icon.scale * 1.15,
            duration: 500,
            yoyo: true,
            repeat: -1,
          });
        }
        objects.expiryIcon = icon;
      }
    }

    // [ManekiNeko.tsx] "!" while the daily shake is available.
    if (name === "Maneki Neko") {
      const shakeable = canShake((item as { shakenAt?: number }).shakenAt || 0);
      const wanted = shakeable ? SUNNYSIDE.icons.expression_alerted : undefined;
      if (objects.expiryIcon?.texture.key !== wanted) {
        objects.expiryIcon?.destroy();
        objects.expiryIcon = undefined;
      }
      if (wanted && !objects.expiryIcon && this.scene.textures.exists(wanted)) {
        objects.expiryIcon = this.scene.add
          .image(box.x + (box.width - 4) / 2, box.y - 10, wanted)
          .setOrigin(0, 0)
          .setDepth(depth + 1);
        objects.expiryIcon.setScale(4 / objects.expiryIcon.width);
      }
    }

    // [Monument.tsx] cheer progress bar while the project is incomplete.
    if (name in REQUIRED_CHEERS) {
      const project = name as MonumentName;
      const cheers = slice.villageProjects[project]?.cheers ?? 0;
      const required = REQUIRED_CHEERS[project];
      if (cheers < required) {
        const barX = box.x + box.width / 2 - 7.5;
        const barY = box.y + box.height - 2 - 7;
        objects.bar ??= new ProgressBarSprite(this.scene, {
          x: barX,
          y: barY,
          formatLength: "full",
          type: "quantity",
          depth: depth + 2,
        });
        objects.bar.setPosition(barX, barY);
        objects.bar.set(Math.round((cheers / required) * 100), 0);
      } else if (objects.bar) {
        objects.bar.destroy();
        objects.bar = undefined;
      }
    }

    // In-progress [Collectible.tsx InProgressCollectible].
    const constructing = (item.readyAt ?? 0) > now;
    image.setAlpha(constructing ? 0.5 : 1);
    if (constructing && this.bridge.ui.get().showTimers) {
      const total = ((item.readyAt ?? 0) - (item.createdAt ?? 0)) / 1000;
      const left = ((item.readyAt ?? 0) - now) / 1000;
      const barX = box.x + box.width / 2 - 8;
      const barY = box.y + box.height - 7;
      objects.bar ??= new ProgressBarSprite(this.scene, {
        x: barX,
        y: barY,
        formatLength: "short",
        depth: depth + 2,
      });
      objects.bar.setPosition(barX, barY);
      objects.bar.set(total > 0 ? (1 - left / total) * 100 : 0, 0);
    } else if (objects.bar) {
      objects.bar.destroy();
      objects.bar = undefined;
    }
  }

  /**
   * Expiring boost [TimeWarpTotem.tsx / SuperTotem.tsx / Hourglass.tsx]:
   * staged art, expiry countdown bar (buff -> error), pulsing fast-forward
   * while active, dig icon (burn) or "!" (renew waiting in chest) once
   * expired, grayscale on the expired art.
   */
  private renderExpiringNode(
    objects: NodeObjects,
    name: CollectibleName,
    item: PlacedItem,
    cfg: NonNullable<(typeof EXPIRING_COLLECTIBLES)[CollectibleName]>,
    now: number,
  ) {
    if (!isExpiringCollectible(name)) return;
    const { box } = objects;
    const depth = DEPTHS.ENTITY_BASE + box.y;
    const game = this.bridge.select((state) => state.context.state);

    const duration = getExpiryCooldown(name, game);
    const expiresAt = (item.createdAt ?? 0) + duration;
    const secondsToExpire = (expiresAt - now) / 1000;
    const hasExpired = secondsToExpire <= 0;
    const hasReplacement = !!getChestItems(game)[name]?.gt(0);

    const texture = hasExpired
      ? (cfg.images.done ?? cfg.images.full)
      : secondsToExpire < duration / 2000 && cfg.images.half
        ? cfg.images.half
        : cfg.images.full;
    if (!this.scene.textures.exists(texture)) return;

    if (!objects.art) {
      objects.art = this.scene.add.image(0, 0, texture);
    }
    const image = objects.art;
    image.setTexture(texture);
    image.setDepth(depth);
    image.setOrigin(0, 1);
    image.setScale(cfg.width / image.width);
    const x =
      cfg.left !== undefined
        ? box.x + cfg.left
        : box.x + (box.width - cfg.width) / 2;
    image.setPosition(x, box.y + box.height - cfg.bottom);
    image.setAlpha(1);

    // DOM: filter grayscale(100%) on the expired art.
    if (hasExpired && !objects.grayscaled) {
      image.preFX?.addColorMatrix().grayscale(1);
      objects.grayscaled = true;
      // the countdown bar flips buff -> error at the same moment
      objects.bar?.destroy();
      objects.bar = undefined;
    } else if (!hasExpired && objects.grayscaled) {
      image.preFX?.clear();
      objects.grayscaled = false;
      objects.bar?.destroy();
      objects.bar = undefined;
    }

    if (cfg.shadow) {
      if (!objects.shadow) {
        objects.shadow = this.scene.add.image(0, 0, shadowArt).setOrigin(0, 1);
      }
      objects.shadow.setDepth(depth - 0.5);
      objects.shadow.setScale(12 / objects.shadow.width);
      // [Hourglass.tsx] 12px centred, bottom -1.6.
      objects.shadow.setPosition(
        box.x + (box.width - 12) / 2,
        box.y + box.height + 1.6,
      );
    }

    // Status icon: fast-forward (active totems), dig (expired, burnable) or
    // "!" (expired, renewable). Rebuilt when the wanted icon changes.
    const wanted = hasExpired
      ? cfg.renewFlow === "petShrine" || hasReplacement
        ? SUNNYSIDE.icons.expression_alerted
        : SUNNYSIDE.icons.dig_icon
      : cfg.activeIcon?.src;
    if (objects.expiryIcon?.texture.key !== wanted) {
      objects.expiryIconTween?.remove();
      objects.expiryIconTween = undefined;
      objects.expiryIcon?.destroy();
      objects.expiryIcon = undefined;
    }
    if (wanted && !objects.expiryIcon && this.scene.textures.exists(wanted)) {
      const icon = this.scene.add
        .image(0, 0, wanted)
        .setOrigin(0, 0)
        .setDepth(depth + 1);
      if (!hasExpired && cfg.activeIcon) {
        icon.setScale(cfg.activeIcon.width / icon.width);
        icon.setPosition(
          box.x + cfg.activeIcon.left,
          box.y + cfg.activeIcon.top,
        );
        // animate-pulse
        if (this.bridge.ui.get().showAnimations) {
          objects.expiryIconTween = this.scene.tweens.add({
            targets: icon,
            alpha: 0.4,
            duration: 1000,
            yoyo: true,
            repeat: -1,
          });
        }
      } else if (hasExpired && !hasReplacement) {
        // dig icon: 18px, right -8, top -8 of the box
        icon.setScale(18 / icon.width);
        icon.setPosition(box.x + box.width + 8 - 18, box.y - 8);
        if (this.bridge.ui.get().showAnimations) {
          objects.expiryIconTween = this.scene.tweens.add({
            targets: icon,
            scale: icon.scale * 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1,
          });
        }
      } else {
        // "!" centred above (static — animated alerts read as jitter)
        icon.setScale(4 / icon.width);
        icon.setPosition(
          box.x + (box.width - 4) / 2,
          box.y + (cfg.alertTop ?? -12),
        );
      }
      objects.expiryIcon = icon;
    }

    // Expiry countdown bar: bottom-left for totems/hourglasses, centred
    // (bottom -3) for shrines, which also show it while active.
    const showBar =
      this.bridge.ui.get().showTimers &&
      (cfg.activeBar || hasExpired || !cfg.renewFlow);
    if (showBar) {
      const percentage = Math.min(
        100,
        Math.max(0, 100 - (secondsToExpire / (duration / 1000)) * 100),
      );
      const barX = cfg.activeBar ? box.x + box.width / 2 - 7.5 : box.x;
      const barY = box.y + box.height + (cfg.activeBar ? 3 : 0) - 7;
      const type = hasExpired
        ? "error"
        : cfg.renewFlow === "petShrine"
          ? "progress"
          : "buff";
      objects.bar ??= new ProgressBarSprite(this.scene, {
        x: barX,
        y: barY,
        formatLength: "medium",
        type,
        depth: depth + 2,
      });
      objects.bar.setPosition(barX, barY);
      objects.bar.set(percentage, Math.max(0, secondsToExpire));
    } else if (objects.bar) {
      objects.bar.destroy();
      objects.bar = undefined;
    }
  }

  /** [WickerMan.tsx / TomatoBombard.tsx] idle until clicked, then a burst. */
  private renderClickSheetNode(
    objects: NodeObjects,
    name: CollectibleName,
    item: PlacedItem,
    cfg: NonNullable<(typeof CLICK_SHEETS)[CollectibleName]>,
  ) {
    const { box } = objects;
    if (!this.scene.textures.exists(cfg.url)) return;
    const depth = DEPTHS.ENTITY_BASE + box.y;

    if (!objects.sheet) {
      const burstKey = `${cfg.url}-burst`;
      if (!this.scene.anims.exists(burstKey)) {
        this.scene.anims.create({
          key: burstKey,
          frames: this.scene.anims.generateFrameNumbers(cfg.url, cfg.frames),
          frameRate: cfg.fps,
        });
      }
      const idle = cfg.idle;
      if (idle && !this.scene.anims.exists(`${idle.url}-idle`)) {
        this.scene.anims.create({
          key: `${idle.url}-idle`,
          frames: this.scene.anims.generateFrameNumbers(idle.url, idle.frames),
          frameRate: idle.fps,
          repeat: -1,
        });
      }
      const sprite = this.scene.add
        .sprite(0, 0, idle?.url ?? cfg.url, 0)
        .setOrigin(0, 1);
      objects.sheet = sprite;
    }
    const sprite = objects.sheet;
    const playingBurst =
      sprite.anims.isPlaying && sprite.texture.key === cfg.url;
    if (!playingBurst) {
      const idle = cfg.idle;
      if (idle) {
        if (sprite.texture.key !== idle.url) sprite.setTexture(idle.url, 0);
        sprite.setScale(idle.width / idle.frameWidth);
        sprite.setPosition(box.x + idle.left, box.y + box.height - cfg.bottom);
      } else {
        if (sprite.texture.key !== cfg.url) sprite.setTexture(cfg.url, 0);
        sprite.setScale(cfg.width / cfg.frameWidth);
        sprite.setPosition(box.x + cfg.left, box.y + box.height - cfg.bottom);
      }
    }
    sprite.setDepth(depth);
    sprite.setFlipX(!!item.flipped);
  }

  /** Play the click burst for a CLICK_SHEETS collectible. */
  private playClickSheet(name: CollectibleName, id: string) {
    const cfg = CLICK_SHEETS[name];
    const objects = this.nodes.get(`${name}#${id}`);
    const sprite = objects?.sheet;
    if (!cfg || !sprite || !this.scene.textures.exists(cfg.url)) return;
    if (sprite.anims.isPlaying && sprite.texture.key === cfg.url) return;
    const { box } = objects!;
    sprite.setTexture(cfg.url, 0);
    sprite.setScale(cfg.width / cfg.frameWidth);
    sprite.setPosition(box.x + cfg.left, box.y + box.height - cfg.bottom);
    sprite.play(`${cfg.url}-burst`);
    sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (!sprite.active) return;
      const slice = this.bridge.select((state) => this.selector(state));
      const item = (slice.collectibles[name] ?? []).find(
        (placed) => placed.id === id,
      );
      if (item && objects) this.renderClickSheetNode(objects, name, item, cfg);
      if (cfg.idle && sprite.active) sprite.play(`${cfg.idle.url}-idle`);
    });
  }

  /** [RockGolem.tsx] standing loop (0-8 @6) or closing one-shot (8-23 @10). */
  private renderRockGolem(objects: NodeObjects, item: PlacedItem) {
    const { box } = objects;
    if (!this.scene.textures.exists(golemSheet)) return;
    const depth = DEPTHS.ENTITY_BASE + box.y;
    const game = this.bridge.select((state) => state.context.state);
    const someStonesMined = Object.values(game.stones).some(
      (stone) => !canMine(stone, stone.name ?? "Stone Rock", game),
    );

    for (const [key, frames, fps, repeat] of [
      ["golem-standing", { start: 0, end: 8 }, 6, -1],
      ["golem-closing", { start: 8, end: 23 }, 10, 0],
    ] as const) {
      if (!this.scene.anims.exists(key)) {
        this.scene.anims.create({
          key,
          frames: this.scene.anims.generateFrameNumbers(golemSheet, frames),
          frameRate: fps,
          repeat,
        });
      }
    }

    if (!objects.sheet) {
      objects.sheet = this.scene.add
        .sprite(0, 0, golemSheet, 0)
        .setOrigin(0, 1);
    }
    const sprite = objects.sheet;
    sprite.setScale(34 / 34);
    // right 0 of the box
    sprite.setPosition(box.x + box.width - 34, box.y + box.height);
    sprite.setDepth(depth);
    sprite.setFlipX(!!item.flipped);
    const wanted = someStonesMined ? "golem-closing" : "golem-standing";
    if (sprite.anims.currentAnim?.key !== wanted) {
      sprite.play(wanted);
    }
  }

  /** Looping sheet collectible [SquirrelMonkey.tsx]. */
  private renderSheetNode(
    objects: NodeObjects,
    item: PlacedItem,
    cfg: NonNullable<(typeof SHEET_COLLECTIBLES)[CollectibleName]>,
    now: number,
  ) {
    const { box } = objects;
    if (!this.scene.textures.exists(cfg.sheet.url)) return;
    const depth = DEPTHS.ENTITY_BASE + box.y; // DOM sorts by placement row

    if (!objects.shadow) {
      const shadow = cfg.shadow;
      if (shadow) {
        const image = this.scene.add
          .image(0, 0, shadowArt)
          .setOrigin(0, 1)
          .setDepth(depth - 0.5);
        image.setScale(shadow.width / image.width);
        image.setPosition(
          box.x + shadow.left,
          box.y + box.height - shadow.bottom,
        );
        objects.shadow = image;
      }
    }

    if (!objects.sheet) {
      const animKey = ensureSheetAnim(this.scene, cfg.sheet);
      objects.sheet = this.scene.add
        .sprite(0, 0, cfg.sheet.url)
        .setOrigin(0, 1);
      objects.sheet.play({ key: animKey, repeat: -1 });
    }
    const sprite = objects.sheet;
    sprite.setScale(cfg.width / cfg.sheet.frameWidth);
    sprite.setPosition(box.x + cfg.left, box.y + box.height - cfg.bottom);
    sprite.setDepth(depth);
    sprite.setFlipX(!!item.flipped);
    sprite.setAlpha((item.readyAt ?? 0) > now ? 0.5 : 1);
  }

  update(_time: number, delta: number) {
    this.tickMs += delta;
    if (this.tickMs < 1000) return;
    this.tickMs = 0;
    // Only in-progress items are time-sensitive; cheap full pass.
    const slice = this.bridge.select((state) => this.selector(state));
    const anyInProgress = Object.values(slice.collectibles).some((items) =>
      (items ?? []).some((item) => (item.readyAt ?? 0) > Date.now()),
    );
    const anyExpiring = Object.keys(slice.collectibles).some(
      (name) =>
        EXPIRING_COLLECTIBLES[name as CollectibleName] ||
        name === "Maneki Neko",
    );
    if (!anyInProgress && !anyExpiring) return;
    const grid = this.buildGrid(slice);
    const now = Date.now();
    for (const { name, item } of this.placements(slice)) {
      const objects = this.nodes.get(`${name}#${item.id}`);
      if (objects) this.renderNode(objects, name, item, grid, slice, now);
    }
  }

  /** In-progress click opens the speed-up modal; behaviours deferred. */
  private onCollectibleClick(name: CollectibleName, id: string) {
    const machine = this.bridge.select((state) => state);
    const game = machine.context.state;
    const item = game.collectibles[name]?.find((placed) => placed.id === id);
    if (!item) return;

    // Visiting [Monument.tsx / Project.tsx]: monuments accept help.
    if (machine.context.visitorId !== undefined) {
      if (!(name in REQUIRED_CHEERS)) return;
      const project =
        game.socialFarming?.villageProjects?.[
          name as keyof typeof REQUIRED_CHEERS
        ];
      if (project?.helpedAt) return; // already helped
      this.bridge.dispatch({
        type: "project.helped",
        project: name,
        totalHelpedToday: machine.context.totalHelpedToday ?? 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      if (
        isHelpComplete({
          game: this.bridge.select((state) => state.context.state),
        })
      ) {
        this.bridge.farmModal.open("farmHelped");
      }
      return;
    }

    if ((item.readyAt ?? 0) > Date.now()) {
      this.bridge.farmModal.open("collectibleConstructing", { name, id });
      return;
    }

    // Reveal collectibles [GenieLamp.tsx / ManekiNeko.tsx / FestiveTree.tsx].
    if (name === "Genie Lamp") {
      this.bridge.farmModal.open("genieLamp", { id });
      return;
    }
    if (name === "Maneki Neko") {
      // Global 24h cooldown across every placement surface.
      const all = [
        ...(game.collectibles["Maneki Neko"] ?? []),
        ...(game.home.collectibles["Maneki Neko"] ?? []),
        ...(game.interior?.ground.collectibles["Maneki Neko"] ?? []),
        ...(game.interior?.level_one?.collectibles["Maneki Neko"] ?? []),
      ];
      const hasShakenRecently = all.some(
        (placed) => !canShake((placed as { shakenAt?: number }).shakenAt || 0),
      );
      if (hasShakenRecently) return;
      this.bridge.dispatch({
        type: "REVEAL",
        event: { type: "maneki.shook", id, createdAt: new Date() },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      this.bridge.farmModal.open("manekiNekoReveal");
      return;
    }
    if ((name as string) === "Festive Tree") {
      this.onFestiveTreeClick(game, item, id);
      return;
    }

    // [SaltSculpture.tsx] click opens the level/upgrade modal.
    if (name === "Salt Sculpture") {
      this.bridge.farmModal.open("saltSculpture");
      return;
    }

    // Expired boost [TimeWarpTotem.tsx handleRemove / RenewCollectible]:
    // renew when a replacement waits in the chest, otherwise burn.
    if (isExpiringCollectible(name)) {
      const cfg = EXPIRING_COLLECTIBLES[name]!;
      const duration = getExpiryCooldown(name, game);
      const hasExpired = (item.createdAt ?? 0) + duration <= Date.now();
      if (!hasExpired) {
        // [ObsidianShrine.tsx] the active shrine opens the bulk-actions
        // modal; other active boosts show the SFT popover with the
        // remaining time [TimeWarpTotem.tsx / PetShrine.tsx].
        if (name === "Obsidian Shrine") {
          this.bridge.farmModal.open("obsidianShrine", {
            id,
            createdAt: item.createdAt ?? 0,
          });
          return;
        }
        this.openSftPopover(name, id, (item.createdAt ?? 0) + duration);
        return;
      }
      if (cfg.renewFlow === "petShrine") {
        this.bridge.farmModal.open("renewPetShrine", { name, id });
        return;
      }
      if (getChestItems(game)[name]?.gt(0)) {
        this.bridge.farmModal.open("renewCollectible", { name, id });
      } else {
        this.bridge.dispatch("collectible.burned", {
          name,
          location: "farm",
          id,
        });
      }
      return;
    }

    // [WickerMan.tsx / TomatoBombard.tsx] click plays the burst + popover.
    if (CLICK_SHEETS[name]) {
      this.playClickSheet(name, id);
      this.openSftPopover(name, id);
      return;
    }

    // [Monument.tsx] own-farm monuments: completion modal when done,
    // popover with cheer progress otherwise.
    if (name in REQUIRED_CHEERS) {
      const project = name as MonumentName;
      const cheers = game.socialFarming.villageProjects[project]?.cheers ?? 0;
      const required = REQUIRED_CHEERS[project];
      if (cheers >= required) {
        this.bridge.farmModal.open("projectComplete", { project });
      } else {
        this.openSftPopover(name, id, undefined, `${cheers}/${required}`);
      }
      return;
    }

    // Default: the SFT detail popover [SFTDetailPopover.tsx].
    this.openSftPopover(name, id);
  }

  /** [Bed.tsx] can this bed unlock the next farmhand? */
  private canSleepHere(name: BedName, game: GameState): boolean {
    const bumpkinCount = Object.keys(game.farmHands.bumpkins).length + 1;
    const uniqueBeds = getPlacedBedNames({
      collectibles: game.collectibles,
      home: { collectibles: game.home.collectibles },
      interior: {
        ground: { collectibles: game.interior.ground.collectibles },
        level_one: game.interior.level_one
          ? { collectibles: game.interior.level_one.collectibles }
          : undefined,
      },
    });
    const beds = (Object.keys(BED_FARMHAND_COUNT) as BedName[])
      .filter((bedName) => uniqueBeds.has(bedName))
      .sort(
        (a, b) => (BED_FARMHAND_COUNT[b] ?? 0) - (BED_FARMHAND_COUNT[a] ?? 0),
      );
    const availableBeds = beds.length - bumpkinCount;
    return beds.indexOf(name) < availableBeds;
  }

  /** Register the shared anchor at the clicked node's box, then open. */
  private openSftPopover(
    name: CollectibleName,
    id: string,
    expiresAt?: number,
    cheersProgress?: string,
  ) {
    const objects = this.nodes.get(`${name}#${id}`);
    if (!objects) return;
    this.bridge.anchors.setAnchor("sft-popover", objects.box);
    // Deferred past this pointerdown — the popover's outside-click closer is
    // a document mousedown listener (same gotcha as quick-select).
    setTimeout(
      () =>
        this.bridge.sftPopover.set({
          anchorId: "sft-popover",
          name,
          expiresAt,
          cheersProgress,
        }),
      0,
    );
  }

  /**
   * [FestiveTree.tsx shake] Dec 20 - Jan 5 window; one gift per festive
   * season (which straddles the year boundary).
   */
  private onFestiveTreeClick(game: GameState, item: PlacedItem, id: string) {
    const now = new Date();
    const month = now.getUTCMonth();
    const day = now.getUTCDate();
    const currentYear = now.getUTCFullYear();
    const isFestivePeriod =
      (month === 11 && day >= 20) || (month === 0 && day <= 5);

    const shakenAt = (item as { shakenAt?: number }).shakenAt;
    if (shakenAt) {
      const shakenDate = new Date(shakenAt);
      const shakenMonth = shakenDate.getUTCMonth();
      const shakenDay = shakenDate.getUTCDate();
      const shakenYear = shakenDate.getUTCFullYear();
      let sameSeason = false;
      if (month === 11) {
        sameSeason =
          (shakenMonth === 11 && shakenYear === currentYear) ||
          (shakenMonth === 0 &&
            shakenDay <= 5 &&
            shakenYear === currentYear + 1);
      } else if (month === 0) {
        sameSeason =
          (shakenMonth === 11 &&
            shakenDay >= 20 &&
            shakenYear === currentYear - 1) ||
          (shakenMonth === 0 && shakenYear === currentYear);
      }
      if (sameSeason) {
        this.bridge.farmModal.open("festiveTreeGifted");
        return;
      }
    }

    if (!isFestivePeriod) return;
    this.bridge.dispatch({
      type: "REVEAL",
      event: { type: "festiveTree.shook", id, createdAt: new Date() },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    this.bridge.farmModal.open("festiveTreeReveal");
  }

  private destroyNode(objects: NodeObjects) {
    objects.expiryIconTween?.remove();
    objects.expiryIcon?.destroy();
    objects.zone.destroy();
    objects.art?.destroy();
    objects.sheet?.destroy();
    objects.shadow?.destroy();
    objects.bar?.destroy();
  }

  protected onDestroy() {
    this.nodes.forEach((objects) => this.destroyNode(objects));
    this.nodes.clear();
  }
}
