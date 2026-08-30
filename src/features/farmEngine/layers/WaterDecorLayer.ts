import Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import finSheet from "assets/decorations/fin_sheet.png";
import fins1 from "assets/decorations/fins_yellow.webp";
import fins2 from "assets/decorations/fins_green.webp";
import fins3 from "assets/decorations/fins2.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { MachineState } from "features/game/lib/gameMachine";
import type { TemperateSeasonName } from "features/game/types/game";
import { getActiveCalendarEvent } from "features/game/types/calendar";
import { getIslandAnchorX } from "features/game/expansion/lib/island";
import { queueSpritesheet, runLoader } from "../core/assets";
import { nativeScale } from "../core/pixelArt";
import { queueArt, resolveArtObject, type ArtObject } from "../core/animated";
import { makeClickable } from "../core/clickable";
import { gridToWorld } from "../core/coordinates";
import { DEPTHS } from "../core/depths";
import { EntityRenderer } from "../entities/EntityRenderer";

/**
 * The ocean's cast — swimmers, snorkler, shark fin, mushroom island — ported
 * from Water.tsx (minus the boats, which live in BoatsLayer). Gameplay
 * rendering is Phaser; the snorkler/shark click modals stay React, opened via
 * bridge.farmModal.
 *
 * KNOWN PARITY GAP: several source assets are animated GIF/WebP
 * (goblin_swimming, goblinSnorkling, swimmer1-4). Phaser renders their first
 * frame; their idle wiggles return when the art ships as spritesheets.
 */

// Water.tsx: offset pushing decorations out as the land grows (LAND_WIDTH 6).
const decorOffset = (expansionCount: number) =>
  Math.ceil((Math.sqrt(expansionCount) * 6) / 2);

const SHARK_INTERVAL_MS = 45_000;
const SHARK_FRAME_COUNT = 55;
const SHARK_FPS = 8;
// CSS .swimming: translateX 300 css px over 10s, looping.
const SHARK_DRIFT_WORLD = 300 / PIXEL_SCALE;
const SHARK_DRIFT_MS = 10_000;

type Slice = {
  landscaping: boolean;
  season: TemperateSeasonName;
  expansionCount: number;
  fullMoon: boolean;
};

type SpriteSpec = {
  texture: string;
  /** Grid cell of the DOM MapPlacement. */
  grid: { x: number; y: number };
  /** Extra offset inside the placement, source px (style left/top / PIXEL_SCALE). */
  offset?: { x?: number; y?: number };
  /** Art width in source px (style width / PIXEL_SCALE). */
  width: number;
  flipX?: boolean;
  onClick?: () => void;
  /** Horizontal drift tween (world px per loopMs), for the fish fins. */
  drift?: { distance: number; durationMs: number };
};

export class WaterDecorLayer extends EntityRenderer<Slice> {
  private sprites: ArtObject[] = [];
  private tweens: Phaser.Tweens.Tween[] = [];
  private shark: {
    sprite: Phaser.GameObjects.Sprite;
    timer: Phaser.Time.TimerEvent;
    tween?: Phaser.Tweens.Tween;
  } | null = null;

  selector(state: MachineState): Slice {
    return {
      landscaping: state.matches("landscaping"),
      season: state.context.state.season.season,
      expansionCount:
        state.context.state.inventory["Basic Land"]?.toNumber() ?? 3,
      fullMoon:
        getActiveCalendarEvent({
          calendar: state.context.state.calendar,
        }) === "fullMoon",
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.landscaping === b.landscaping &&
    a.season === b.season &&
    a.expansionCount === b.expansionCount &&
    a.fullMoon === b.fullMoon;

  private specs({ season, expansionCount, fullMoon }: Slice): SpriteSpec[] {
    const offset = decorOffset(expansionCount);
    const specs: SpriteSpec[] = [];

    if (season !== "winter") {
      specs.push({
        texture: SUNNYSIDE.npcs.goblin_swimming,
        grid: { x: -6 - offset, y: -1 },
        width: 96,
      });
      specs.push({
        texture: SUNNYSIDE.npcs.goblinSnorkling,
        grid: { x: -2, y: offset + 12 },
        width: 24,
        onClick: () => this.bridge.farmModal.open("snorkler"),
      });

      if (fullMoon) {
        specs.push({
          texture: fins1,
          grid: { x: -7 - offset, y: 9 },
          offset: { x: -3 },
          width: 17,
          drift: { distance: 300 / PIXEL_SCALE, durationMs: 10_000 },
        });
        specs.push({
          texture: fins2,
          grid: { x: offset + 7, y: 2 },
          offset: { x: -3 },
          width: 17,
          drift: { distance: 300 / PIXEL_SCALE, durationMs: 20_000 },
        });
        specs.push({
          texture: fins3,
          grid: { x: -6 - offset, y: -9 },
          offset: { x: -3 },
          width: 9,
          drift: { distance: 300 / PIXEL_SCALE, durationMs: 10_000 },
        });
      }
    }

    if (season === "winter") {
      specs.push({
        texture: SUNNYSIDE.npcs.frozen_swimmer,
        grid: { x: offset + 7, y: 6 },
        width: 43,
        flipX: true,
      });
      specs.push({
        texture: SUNNYSIDE.decorations.frozen_cossies,
        grid: { x: offset + 7, y: 6 },
        offset: { x: 9, y: 33 },
        width: 28,
        flipX: true,
      });
    } else if (season === "summer") {
      specs.push(
        {
          texture: SUNNYSIDE.npcs.swimmer,
          grid: { x: offset + 7, y: 6 },
          width: 16,
          flipX: true,
        },
        {
          texture: SUNNYSIDE.decorations.cossies,
          grid: { x: offset + 7, y: 6 },
          offset: { x: 16 },
          width: 16,
          flipX: true,
        },
        {
          texture: SUNNYSIDE.npcs.swimmer2,
          grid: { x: -8 - offset, y: -5 },
          width: 16,
        },
        {
          texture: SUNNYSIDE.decorations.cossies2,
          grid: { x: -8 - offset, y: -5 },
          offset: { x: -18 },
          width: 16,
        },
        {
          texture: SUNNYSIDE.npcs.swimmer3,
          grid: { x: -6 - offset, y: offset - 21 },
          width: 16,
        },
        {
          texture: SUNNYSIDE.decorations.cossies3,
          grid: { x: -6 - offset, y: offset - 21 },
          offset: { x: 12, y: 16 },
          width: 16,
          flipX: true,
        },
        {
          texture: SUNNYSIDE.npcs.swimmer4,
          grid: { x: -7 - offset, y: -1 },
          width: 16,
        },
        {
          texture: SUNNYSIDE.decorations.cossies4,
          grid: { x: -7 - offset, y: -1 },
          offset: { x: 25, y: 18 },
          width: 16,
          flipX: true,
        },
      );
    } else {
      specs.push(
        {
          texture: SUNNYSIDE.npcs.swimmer,
          grid: { x: offset + 7, y: 6 },
          width: 16,
          flipX: true,
        },
        {
          texture: SUNNYSIDE.decorations.cossies,
          grid: { x: offset + 7, y: 6 },
          offset: { x: 16 },
          width: 16,
          flipX: true,
        },
      );
    }

    // Mushroom island tracks the land's left edge.
    specs.push({
      texture: SUNNYSIDE.land.mushroomIsland,
      grid: { x: getIslandAnchorX(expansionCount), y: 6 },
      offset: { x: -3 },
      width: 54,
    });

    return specs;
  }

  async sync(slice: Slice) {
    const token = this.beginSync();
    // [Land.tsx:1302-1334] the DOM unmounts this during landscaping.
    if (slice.landscaping) {
      this.clear();
      return;
    }
    const specs = this.specs(slice);
    specs.forEach(({ texture }) => queueArt(this.scene, texture));
    queueSpritesheet(this.scene, finSheet, { frameWidth: 13, frameHeight: 11 });
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    this.clear();

    this.sprites = specs.flatMap((spec) => {
      const world = gridToWorld(spec.grid);
      // Animated art (swimmers, snorkling goblin) becomes a looping Sprite.
      const sprite = resolveArtObject(this.scene, undefined, spec.texture);
      if (!sprite) return [];
      sprite
        .setPosition(
          world.x + (spec.offset?.x ?? 0),
          world.y + (spec.offset?.y ?? 0),
        )
        .setOrigin(0, 0)
        .setDepth(DEPTHS.WATER_DECOR)
        .setFlipX(!!spec.flipX);
      nativeScale(sprite, spec.width);

      if (spec.onClick) {
        makeClickable(this.scene, sprite, spec.onClick);
      }
      if (spec.drift) {
        this.tweens.push(
          this.scene.tweens.add({
            targets: sprite,
            x: sprite.x + spec.drift.distance,
            duration: spec.drift.durationMs,
            repeat: -1,
            ease: "Linear",
          }),
        );
      }
      return [sprite];
    });

    if (slice.season !== "winter") {
      this.createShark(decorOffset(slice.expansionCount));
    }
  }

  /**
   * SharkBumpkin.tsx: every 45s the fin surfaces, swims one 55-frame pass
   * (8fps) while drifting, then submerges.
   */
  private createShark(offset: number) {
    const world = gridToWorld({ x: -8, y: offset + 10 });
    const animKey = "farm-shark-fin";
    if (!this.scene.anims.exists(animKey)) {
      this.scene.anims.create({
        key: animKey,
        frames: this.scene.anims.generateFrameNumbers(finSheet, {
          start: 0,
          end: SHARK_FRAME_COUNT - 1,
        }),
        frameRate: SHARK_FPS,
      });
    }

    const sprite = this.scene.add
      .sprite(world.x, world.y, finSheet)
      .setOrigin(0, 0)
      .setDepth(DEPTHS.WATER_DECOR)
      .setVisible(false);
    makeClickable(this.scene, sprite, () =>
      this.bridge.farmModal.open("sharkBumpkin"),
    );

    const surface = () => {
      sprite.setPosition(world.x, world.y).setVisible(true);
      sprite.play(animKey);
      const tween = this.scene.tweens.add({
        targets: sprite,
        x: world.x + SHARK_DRIFT_WORLD,
        duration: SHARK_DRIFT_MS,
        ease: "Linear",
      });
      if (this.shark) this.shark.tween = tween;
      sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        tween.stop();
        sprite.setVisible(false);
      });
    };

    const timer = this.scene.time.addEvent({
      delay: SHARK_INTERVAL_MS,
      loop: true,
      callback: surface,
    });

    this.shark = { sprite, timer };
  }

  private clear() {
    this.tweens.forEach((tween) => tween.remove());
    this.tweens = [];
    this.sprites.forEach((sprite) => sprite.destroy());
    this.sprites = [];
    if (this.shark) {
      this.shark.timer.remove();
      this.shark.tween?.remove();
      this.shark.sprite.destroy();
      this.shark = null;
    }
  }

  protected onDestroy() {
    this.clear();
  }
}
