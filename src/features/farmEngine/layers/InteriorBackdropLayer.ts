import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState, IslandType } from "features/game/types/game";
import type { FarmSurface } from "../core/surface";
import { nativeScale } from "../core/pixelArt";
import { HOME_BOUNDS } from "features/game/expansion/placeable/lib/collisionDetection";
import { EXTERIOR_ISLAND_BG } from "features/barn/BarnInside";
import { PET_HOUSE_IMAGES } from "features/petHouse/PetHouseInside";
import { ANIMAL_HOUSE_IMAGES } from "features/henHouse/HenHouseInside";
import {
  INTERIOR_BACKGROUNDS,
  INTERIOR_BACKGROUND_NATIVE,
  HOME_EXPANSION_BACKGROUNDS,
  HOME_EXPANSION_BACKGROUND_NATIVE,
} from "features/interior/lib/interiorBackgrounds";
import { INTERIOR_CANVAS } from "features/game/expansion/placeable/lib/interiorLayouts";
import type { HomeExpansionTier } from "features/game/types/game";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { queueImage, runLoader } from "../core/assets";
import { makeClickable } from "../core/clickable";
import { WORLD_TILE } from "../core/coordinates";
import { DEPTHS } from "../core/depths";
import { EntityRenderer } from "../entities/EntityRenderer";

/**
 * The room an interior sits in [home/Home.tsx, petHouse/PetHouseInside.tsx,
 * ...]: a repeating exterior island backdrop with the room art on top.
 *
 * Every interior uses the same DOM shell — a `left-1/2 top-1/2 -translate-1/2`
 * wrapper — so the room art is always CENTRED on the world origin, with an
 * optional nudge. Placements use the normal grid, so nothing here offsets
 * them; the room just has to line up around the bounds.
 */

type Slice = {
  islandType: IslandType;
  island: GameState["island"];
  petHouseLevel: number;
  barnLevel: number;
  henHouseLevel: number;
  /** [interior/LevelOne.tsx] the active home-expansion tier, if bought. */
  expansion?: HomeExpansionTier;
};

/** [Home.tsx BACKGROUND_IMAGE] the room art per island tier. */
const HOME_ART: Record<IslandType, string> = {
  basic: SUNNYSIDE.land.tent_inside,
  spring: SUNNYSIDE.land.house_inside,
  desert: SUNNYSIDE.land.manor_inside,
  volcano: SUNNYSIDE.land.mansion_inside,
  swamp: SUNNYSIDE.land.mansion_inside,
  spooky: SUNNYSIDE.land.mansion_inside,
  crystal: SUNNYSIDE.land.mansion_inside,
  galaxy: SUNNYSIDE.land.mansion_inside,
  marble: SUNNYSIDE.land.mansion_inside,
};

/** [Home.tsx] the walls the placement grid is inset by, in source px. */
export const HOME_WALL_OFFSET = { x: 6, y: 16 };

/** The exterior backdrop tile is drawn at 96 source px. */
const BACKDROP_TILE = 96;

/** [BarnInside.tsx / HenHouseInside.tsx] room art per building level. */
const animalHouseRoom = (level: number): RoomArt => {
  const art = ANIMAL_HOUSE_IMAGES[Math.min(Math.max(level, 1), 3)];
  return { texture: art.src, width: art.width, height: art.height };
};

type RoomArt = {
  texture: string;
  /** Room size in source px. */
  width: number;
  height: number;
  /** Nudge from centre, source px. */
  offsetX?: number;
  offsetY?: number;
};

/**
 * Per-surface room art. Sizes are source px; the art is centred on the
 * origin like the DOM's translate wrapper.
 */
const ROOMS: Partial<
  Record<FarmSurface, (slice: Slice) => RoomArt | undefined>
> = {
  home: (slice) => {
    const bounds = HOME_BOUNDS[slice.islandType];
    return {
      texture: HOME_ART[slice.islandType],
      // [Home.tsx] grid plus the wall the art carries.
      width: bounds.width * WORLD_TILE + 12,
      height: bounds.height * WORLD_TILE + 32,
    };
  },
  barn: (slice) => animalHouseRoom(slice.barnLevel),
  henHouse: (slice) => animalHouseRoom(slice.henHouseLevel),
  interior: (slice) => ({
    // [Interior.tsx] 380x320 art, bottom-left anchored on the 384x384 canvas.
    texture: INTERIOR_BACKGROUNDS[slice.islandType],
    width: INTERIOR_BACKGROUND_NATIVE.width,
    height: INTERIOR_BACKGROUND_NATIVE.height,
    offsetX:
      INTERIOR_BACKGROUND_NATIVE.width / 2 -
      (INTERIOR_CANVAS.width * WORLD_TILE) / 2,
    offsetY:
      (INTERIOR_CANVAS.height * WORLD_TILE) / 2 -
      INTERIOR_BACKGROUND_NATIVE.height / 2,
  }),
  level_one: (slice) =>
    slice.expansion
      ? {
          // [LevelOne.tsx] per-tier 384x320 art, same anchoring.
          texture: HOME_EXPANSION_BACKGROUNDS[slice.expansion],
          width: HOME_EXPANSION_BACKGROUND_NATIVE.width,
          height: HOME_EXPANSION_BACKGROUND_NATIVE.height,
          offsetX:
            HOME_EXPANSION_BACKGROUND_NATIVE.width / 2 -
            (INTERIOR_CANVAS.width * WORLD_TILE) / 2,
          offsetY:
            (INTERIOR_CANVAS.height * WORLD_TILE) / 2 -
            HOME_EXPANSION_BACKGROUND_NATIVE.height / 2,
        }
      : undefined,
  greenhouse: () => ({
    // [GreenhouseInside.tsx] fixed 176x192 room.
    texture: SUNNYSIDE.land.greenhouse_inside,
    width: 176,
    height: 192,
  }),
  petHouse: (slice) => {
    const level = Math.min(Math.max(slice.petHouseLevel, 1), 3);
    const art = PET_HOUSE_IMAGES[level];
    // [PetHouseInside.tsx] the room img carries a half-tile left nudge.
    return {
      texture: art.src,
      width: art.width,
      height: art.height,
      offsetX: WORLD_TILE / 2,
    };
  },
};

/**
 * The room's world rect for a surface — overlay chrome anchors to this so it
 * sits above/below the room exactly like the DOM's siblings do.
 */
export function interiorRoomRect(
  location: FarmSurface,
  islandType: IslandType,
  petHouseLevel: number,
  expansion?: HomeExpansionTier,
): { x: number; y: number; width: number; height: number } | undefined {
  const room = ROOMS[location]?.({
    islandType,
    island: { type: islandType } as GameState["island"],
    petHouseLevel,
    barnLevel: petHouseLevel,
    henHouseLevel: petHouseLevel,
    expansion,
  });
  if (!room) return undefined;
  return {
    x: -room.width / 2 + (room.offsetX ?? 0),
    y: -room.height / 2 + (room.offsetY ?? 0),
    width: room.width,
    height: room.height,
  };
}

export class InteriorBackdropLayer extends EntityRenderer<Slice> {
  private objects: Phaser.GameObjects.GameObject[] = [];

  selector(state: MachineState): Slice {
    const game = state.context.state;
    return {
      islandType: game.island.type,
      island: game.island,
      petHouseLevel: game.petHouse?.level ?? 1,
      barnLevel: game.barn.level,
      henHouseLevel: game.henHouse.level,
      expansion: game.interior.expansion,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.islandType === b.islandType &&
    a.island === b.island &&
    a.petHouseLevel === b.petHouseLevel &&
    a.barnLevel === b.barnLevel &&
    a.henHouseLevel === b.henHouseLevel &&
    a.expansion === b.expansion;

  async sync(slice: Slice) {
    const token = this.beginSync();
    const room = ROOMS[this.scene.location]?.(slice);
    const backdrop = EXTERIOR_ISLAND_BG[getCurrentBiome(slice.island)];

    if (room) queueImage(this.scene, room.texture);
    queueImage(this.scene, backdrop);
    queueImage(this.scene, SUNNYSIDE.decorations.painting);
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    this.clear();

    // [Interior.tsx] the interior floors sit in a dark void, not on the
    // island; every other interior repeats the exterior backdrop.
    const darkVoid =
      this.scene.location === "interior" || this.scene.location === "level_one";
    if (darkVoid) {
      const span = 120 * WORLD_TILE;
      this.objects.push(
        this.scene.add
          .rectangle(-span, -span, span * 2, span * 2, 0x181425)
          .setOrigin(0, 0)
          .setDepth(DEPTHS.OCEAN),
      );
    }

    // Repeating exterior backdrop, comfortably larger than any room.
    if (!darkVoid && this.scene.textures.exists(backdrop)) {
      const span = 60 * WORLD_TILE;
      for (let x = -span; x < span; x += BACKDROP_TILE) {
        for (let y = -span; y < span; y += BACKDROP_TILE) {
          const tile = this.scene.add
            .image(x, y, backdrop)
            .setOrigin(0, 0)
            .setDepth(DEPTHS.OCEAN);
          tile.setDisplaySize(BACKDROP_TILE, BACKDROP_TILE);
          this.objects.push(tile);
        }
      }
    }

    if (!room || !this.scene.textures.exists(room.texture)) return;

    const image = this.scene.add
      .image(
        -room.width / 2 + (room.offsetX ?? 0),
        -room.height / 2 + (room.offsetY ?? 0),
        room.texture,
      )
      .setOrigin(0, 0)
      .setDepth(DEPTHS.LAND_BASE);
    image.setDisplaySize(room.width, room.height);
    this.objects.push(image);

    // [Home.tsx] the clickable painting on the wall, 11px at (30, 4).
    if (this.scene.location === "home") {
      const painting = SUNNYSIDE.decorations.painting;
      if (this.scene.textures.exists(painting)) {
        const art = this.scene.add
          .image(image.x + 30, image.y + 4, painting)
          .setOrigin(0, 0)
          .setDepth(DEPTHS.LAND_BASE + 1);
        nativeScale(art, 11);
        makeClickable(this.scene, art, () =>
          this.bridge.farmModal.open("bumpkinPainting"),
        );
        this.objects.push(art);
      }
    }
  }

  private clear() {
    this.objects.forEach((object) => object.destroy());
    this.objects = [];
  }

  protected onDestroy() {
    this.clear();
  }
}
