import lightningIcon from "assets/icons/lightning.png";
import fullMoonIcon from "assets/icons/full_moon.png";
import mapIcon from "assets/icons/map.webp";
import { isFishFrenzy, isFullMoon } from "features/game/types/calendar";
import { MAP_PIECE_MARVELS } from "features/game/types/fishing";
import Phaser from "phaser";
import springWharf from "assets/wharf/spring_wharf.png";
import desertWharf from "assets/wharf/desert_wharf.png";
import volcanoWharf from "assets/wharf/volcano_wharf.png";
import bubbles from "assets/decorations/water_bubbles.png";
import winterBubbles from "assets/decorations/winter_water_bubbles.png";
import frozenWharf from "assets/decorations/frozen_wharf.png";
import fishSilhouette from "assets/decorations/fish_silhouette.png";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type {
  GameState,
  IslandType,
  TemperateSeasonName,
} from "features/game/types/game";
import { getWharfCoordinates } from "features/game/expansion/lib/constants";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { queueImage, runLoader } from "../../core/assets";
import { makeClickable } from "../../core/clickable";
import { gridToWorld } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { EntityRenderer } from "../EntityRenderer";
import { queueSheet, type SheetSpec } from "./lib";

/**
 * The fisherman + dock [island/fisherman/Fisherman.tsx + FishermanNPC.tsx].
 * Dock art per island with the DOM's exact offsets, bubble/fish decor, and
 * the 56-frame fishing sheet driven as a frame-range state machine
 * (idle -> casting -> waiting -> reeling -> caught). Clicks open the cast
 * modal; the reel label collects the catch.
 *
 * DEFERRED: fish frenzy / full moon / marvel-hunt / treasure-map icons, and
 * the map puzzle challenge (reeling collects directly).
 */

type Slice = {
  landscaping: boolean;
  fishFrenzy: boolean;
  fullMoon: boolean;
  readyMarvel: boolean;
  expansionCount: number;
  islandType: IslandType;
  season: TemperateSeasonName;
  wharf: GameState["fishing"]["wharf"];
  canFish: boolean;
};

const FISHING_SHEET: SheetSpec = {
  url: SUNNYSIDE.npcs.fishing_sheet,
  frameWidth: 58,
  frameHeight: 50,
  fps: 14,
  steps: 56,
};

type FishingState = "idle" | "casting" | "waiting" | "reeling" | "caught";

/** 1-indexed DOM frame ranges -> 0-indexed Phaser frames. */
const FRAMES: Record<
  FishingState,
  { start: number; end: number; loop: boolean }
> = {
  idle: { start: 0, end: 8, loop: true },
  casting: { start: 9, end: 23, loop: false },
  waiting: { start: 24, end: 32, loop: true },
  reeling: { start: 33, end: 45, loop: true },
  caught: { start: 46, end: 55, loop: false },
};

/** Fisherman.tsx extendedWharfPosition(): {width, top, right} in source px. */
const wharfArt = (
  island: IslandType,
  expansions: number,
): { texture: string; width: number; top: number; right: number } | null => {
  if (island === "spring") {
    if (expansions <= 10)
      return { texture: springWharf, width: 46, top: 1.52, right: 40 };
    if (expansions <= 20)
      return { texture: springWharf, width: 44.476, top: 5.71, right: 41.52 };
    return { texture: springWharf, width: 44.476, top: 1.128, right: 41.286 };
  }
  if (hasRequiredIslandExpansion(island, "volcano")) {
    return expansions <= 7
      ? { texture: volcanoWharf, width: 76, top: 24, right: 10.619 }
      : { texture: volcanoWharf, width: 76, top: 24, right: 11.76 };
  }
  if (island === "desert") {
    if (expansions <= 10)
      return { texture: desertWharf, width: 59.48, top: 1.9, right: 26.255 };
    if (expansions <= 20)
      return { texture: desertWharf, width: 59.48, top: 7.23, right: 26.522 };
    return { texture: desertWharf, width: 59.48, top: 1.897, right: 26.255 };
  }
  return null; // basic island: no dock art
};

/** Fisherman.tsx bubblePosition(): {right, bottom} of the bubble cluster. */
const bubbleAnchor = (
  island: IslandType,
): { right: number; bottom: number } => {
  if (island === "spring") return { right: 10, bottom: -77 };
  if (island === "desert") return { right: -4, bottom: -78 };
  if (hasRequiredIslandExpansion(island, "volcano"))
    return { right: -23, bottom: -93 };
  return { right: 32, bottom: -48 };
};

/** FishermanNPC.tsx fishermanPosition(): hitbox offset in the box. */
const npcOffset = (island: IslandType): { x: number; y: number } => {
  if (hasRequiredIslandExpansion(island, "volcano")) return { x: 53, y: 44 };
  if (island === "desert") return { x: 34, y: 30 };
  if (island === "spring") return { x: 20, y: 29 };
  return { x: 0, y: 0 };
};

const BOX_TILES = 5; // ceil(76*PIXEL_SCALE / GRID_WIDTH_PX)

export class FishermanRenderer extends EntityRenderer<Slice> {
  private objects: Phaser.GameObjects.GameObject[] = [];
  private npc: Phaser.GameObjects.Sprite | undefined;
  private reelLabel: Phaser.GameObjects.Image | undefined;
  private fishState: FishingState = "idle";

  selector(state: MachineState): Slice {
    const game = state.context.state;
    return {
      landscaping: state.matches("landscaping"),
      fishFrenzy: isFishFrenzy(game),
      fullMoon: isFullMoon(game),
      readyMarvel: !!MAP_PIECE_MARVELS.find(
        (marvel) =>
          !game.farmActivity[`${marvel} Caught`] &&
          (game.farmActivity[`${marvel} Map Piece Found`] ?? 0) >= 9,
      ),
      expansionCount: game.inventory["Basic Land"]?.toNumber() ?? 3,
      islandType: game.island.type,
      season: game.season.season,
      wharf: game.fishing.wharf,
      canFish: meetsLevelRequirement(
        getAscensionLevel({
          experience: game.bumpkin?.experience ?? 0,
          ascensionLevel: game.island.ascensionLevel ?? 0,
        }),
        { ascension: 0, level: 5 },
      ),
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.landscaping === b.landscaping &&
    a.fishFrenzy === b.fishFrenzy &&
    a.fullMoon === b.fullMoon &&
    a.readyMarvel === b.readyMarvel &&
    a.expansionCount === b.expansionCount &&
    a.islandType === b.islandType &&
    a.season === b.season &&
    a.wharf === b.wharf &&
    a.canFish === b.canFish;

  async sync(slice: Slice) {
    const token = this.beginSync();
    // [Land.tsx:1302-1334] the DOM unmounts this during landscaping.
    if (slice.landscaping) {
      this.clear();
      return;
    }
    [
      springWharf,
      desertWharf,
      volcanoWharf,
      bubbles,
      lightningIcon,
      fullMoonIcon,
      mapIcon,
      winterBubbles,
      frozenWharf,
      fishSilhouette,
      SUNNYSIDE.icons.fish_icon,
      SUNNYSIDE.icons.lock,
      SUNNYSIDE.icons.expression_alerted,
      SUNNYSIDE.ui.reel,
    ].forEach((url) => queueImage(this.scene, url));
    queueSheet(this.scene, FISHING_SHEET);
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    this.clear();

    const wharfGrid = getWharfCoordinates(slice.expansionCount);
    const box = gridToWorld(wharfGrid);
    const boxWidth = BOX_TILES * 16;
    const depth = DEPTHS.ENTITY_BASE + box.y;

    // Dock art (right/top anchored inside the box).
    const dock = wharfArt(slice.islandType, slice.expansionCount);
    if (dock) {
      const image = this.scene.add
        .image(0, 0, dock.texture)
        .setOrigin(0, 0)
        .setDepth(depth);
      image.setScale(dock.width / image.width);
      image.setPosition(
        box.x + boxWidth - dock.right - image.displayWidth,
        box.y + dock.top,
      );
      this.objects.push(image);
    }

    // Bubble cluster (right/bottom anchored offsets from the box).
    const anchor = bubbleAnchor(slice.islandType);
    const clusterX = box.x + boxWidth - anchor.right;
    const clusterY = box.y + 16 - anchor.bottom;
    if (slice.season === "winter") {
      const frozen = this.scene.add
        .image(clusterX - -13 - 57, clusterY - -12, frozenWharf)
        .setOrigin(0, 1)
        .setDepth(depth + 1);
      frozen.setScale(57 / frozen.width);
      this.objects.push(frozen);
      const winterBub = this.scene.add
        .image(clusterX - -6 - 37, clusterY - -7, winterBubbles)
        .setOrigin(0, 1)
        .setDepth(depth + 1);
      winterBub.setScale(37 / winterBub.width);
      this.objects.push(winterBub);
    } else {
      const bub = this.scene.add
        .image(clusterX - -6 - 37, clusterY - -7, bubbles)
        .setOrigin(0, 1)
        .setDepth(depth + 1);
      bub.setScale(37 / bub.width);
      this.objects.push(bub);
      const fish = this.scene.add
        .image(clusterX - 0 - 11, clusterY - -20, fishSilhouette)
        .setOrigin(0, 1)
        .setDepth(depth + 1);
      fish.setScale(11 / fish.width);
      this.scene.tweens.add({
        targets: fish,
        x: fish.x - 20,
        duration: 6000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        onYoyo: () => fish.setFlipX(true),
        onRepeat: () => fish.setFlipX(false),
      });
      this.objects.push(fish);
    }

    // NPC hitbox + fishing sheet.
    const offset = npcOffset(slice.islandType);
    const hitX = box.x + offset.x;
    const hitY = box.y + offset.y;
    const hitSize = 50 / 2.625; // HITBOX_SIZE_PX in CSS px -> world

    const zone = this.scene.add
      .zone(hitX, hitY, hitSize, hitSize)
      .setOrigin(0, 0)
      .setDepth(depth);
    makeClickable(this.scene, zone, () => this.onClick(), {
      glow: () => this.npc,
    });
    this.objects.push(zone);

    if (slice.canFish) {
      this.npc = this.scene.add
        .sprite(hitX - 10, hitY - 14, FISHING_SHEET.url)
        .setOrigin(0, 0)
        .setDepth(depth + 2);
      this.objects.push(this.npc);
      this.applyFishState(slice);

      // Event icons above the fisherman [FishermanNPC.tsx].
      const eventIcon = slice.readyMarvel
        ? { src: mapIcon, width: 12, left: 3 }
        : slice.fishFrenzy
          ? { src: lightningIcon, width: 8, left: 5 }
          : slice.fullMoon
            ? { src: fullMoonIcon, width: 10, left: 3 }
            : undefined;
      if (eventIcon && this.scene.textures.exists(eventIcon.src)) {
        const icon = this.scene.add
          .image(hitX + eventIcon.left, hitY - 19, eventIcon.src)
          .setOrigin(0, 0)
          .setDepth(depth + 3);
        icon.setScale(eventIcon.width / icon.width);
        this.objects.push(icon);
      }
    } else {
      // Locked overlay [FishermanNPC.tsx].
      const fishIcon = this.scene.add
        .image(hitX + hitSize - 1 - 18, hitY + 9, SUNNYSIDE.icons.fish_icon)
        .setOrigin(0, 0)
        .setDepth(depth + 2);
      fishIcon.setScale(18 / fishIcon.width);
      const lock = this.scene.add
        .image(hitX + hitSize - 10 - 12, hitY + 7, SUNNYSIDE.icons.lock)
        .setOrigin(0, 0)
        .setDepth(depth + 3);
      lock.setScale(12 / lock.width);
      this.objects.push(fishIcon, lock);
    }
  }

  /** Frame-range state machine [FishermanNPC.tsx FISHING_FRAMES]. */
  private applyFishState(slice: Slice) {
    if (!this.npc) return;
    const { wharf } = slice;
    const desired: FishingState = wharf.caught
      ? "reeling"
      : wharf.castedAt
        ? "waiting"
        : "idle";

    this.playRange(
      desired === "waiting" && this.fishState === "idle" ? "casting" : desired,
    );
  }

  private playRange(state: FishingState) {
    if (!this.npc) return;
    this.fishState = state;
    const range = FRAMES[state];
    const key = `${FISHING_SHEET.url}-${state}`;
    if (!this.scene.anims.exists(key)) {
      this.scene.anims.create({
        key,
        frames: this.scene.anims.generateFrameNumbers(FISHING_SHEET.url, {
          start: range.start,
          end: range.end,
        }),
        frameRate: FISHING_SHEET.fps,
        repeat: range.loop ? -1 : 0,
      });
    }
    this.npc.off(Phaser.Animations.Events.ANIMATION_COMPLETE);
    this.npc.play(key);

    if (state === "casting") {
      this.npc.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        this.playRange("waiting"),
      );
    }
    if (state === "caught") {
      this.npc.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.bridge.farmModal.open("fisherman", { caught: true });
        this.playRange("idle");
      });
    }

    // Reel label while a catch waits [FishermanNPC.tsx].
    this.reelLabel?.destroy();
    this.reelLabel = undefined;
    if (state === "reeling") {
      const reel = this.scene.add
        .image(this.npc.x + 16, this.npc.y + 36, SUNNYSIDE.ui.reel)
        .setOrigin(0, 0)
        .setDepth(this.npc.depth + 1);
      reel.setScale(39 / reel.width);
      this.reelLabel = reel;
      this.objects.push(reel);
    }
  }

  /** [FishermanNPC.tsx handleClick] */
  private onClick() {
    const slice = this.bridge.select((state) => this.selector(state));
    if (!slice.canFish) {
      this.bridge.farmModal.open("fisherman", { locked: true });
      return;
    }
    if (this.fishState === "reeling") {
      // [FishermanNPC.tsx reelIn] a treasure map on the line runs the
      // fishing puzzle first; otherwise reel straight in.
      const maps = Object.keys(slice.wharf.maps ?? {});
      if (maps.length > 0) {
        this.bridge.farmModal.open("fishingChallenge", {
          onDone: () => this.playRange("caught"),
        });
        return;
      }
      // Reel in: play the catch, then the caught modal claims via rod.reeled.
      this.playRange("caught");
      return;
    }
    if (slice.wharf.castedAt) return;
    this.bridge.farmModal.open("fisherman");
  }

  private clear() {
    this.npc = undefined;
    this.reelLabel = undefined;
    this.objects.forEach((object) => object.destroy());
    this.objects = [];
  }

  protected onDestroy() {
    this.clear();
  }
}
