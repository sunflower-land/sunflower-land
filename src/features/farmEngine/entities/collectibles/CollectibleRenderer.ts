import type Phaser from "phaser";
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
import { queueImage, runLoader } from "../../core/assets";
import { makeClickable } from "../../core/clickable";
import {
  gridRectToWorld,
  WORLD_TILE,
  type WorldRect,
} from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { ProgressBarSprite } from "../../components/ProgressBarSprite";
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
  art?: Phaser.GameObjects.Image;
  sheet?: Phaser.GameObjects.Sprite;
  shadow?: Phaser.GameObjects.Image;
  bar?: ProgressBarSprite;
};

export class CollectibleRenderer extends EntityRenderer<Slice> {
  private nodes = new Map<string, NodeObjects>();
  private tickMs = 0;

  selector(state: MachineState): Slice {
    const game = state.context.state;
    return { collectibles: game.collectibles, crops: game.crops };
  }

  equals = (a: Slice, b: Slice) =>
    a.collectibles === b.collectibles && a.crops === b.crops;

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
  ): { texture: string; spec?: StaticCollectibleSpec; tile?: boolean } | null {
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
      const art = this.artFor(name, item, grid);
      if (art) queueImage(this.scene, art.texture);
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

      this.renderNode(objects, name, item, grid, now);
    }
  }

  private renderNode(
    objects: NodeObjects,
    name: CollectibleName,
    item: PlacedItem,
    grid: GameGrid,
    now: number,
  ) {
    const { box } = objects;

    const sheetCfg = SHEET_COLLECTIBLES[name];
    if (sheetCfg) {
      this.renderSheetNode(objects, item, sheetCfg, now);
      return;
    }

    const art = this.artFor(name, item, grid);
    if (!art || !this.scene.textures.exists(art.texture)) return;

    // Depth [Land.tsx sort]: tiles lowest, then rugs/furniture, then painter's.
    const isTileBand = art.tile || name.includes("Tile");
    const nonColliding = NON_COLLIDING_OBJECTS.includes(name);
    const depth = isTileBand
      ? DEPTHS.DIRT + 100
      : nonColliding
        ? DEPTHS.DIRT + 200
        : DEPTHS.ENTITY_BASE + box.y + box.height;

    if (!objects.art) {
      objects.art = this.scene.add.image(0, 0, art.texture);
    }
    const image = objects.art;
    image.setTexture(art.texture);
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

  /** Looping sheet collectible [SquirrelMonkey.tsx]. */
  private renderSheetNode(
    objects: NodeObjects,
    item: PlacedItem,
    cfg: NonNullable<(typeof SHEET_COLLECTIBLES)[CollectibleName]>,
    now: number,
  ) {
    const { box } = objects;
    if (!this.scene.textures.exists(cfg.sheet.url)) return;
    const depth = DEPTHS.ENTITY_BASE + box.y + box.height;

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
    if (!anyInProgress) return;
    const grid = this.buildGrid(slice);
    const now = Date.now();
    for (const { name, item } of this.placements(slice)) {
      const objects = this.nodes.get(`${name}#${item.id}`);
      if (objects) this.renderNode(objects, name, item, grid, now);
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
    }
  }

  private destroyNode(objects: NodeObjects) {
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
