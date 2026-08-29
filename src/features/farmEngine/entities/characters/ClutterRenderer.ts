import type Phaser from "phaser";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState } from "features/game/types/game";
import { isHelpComplete } from "features/game/types/monuments";
import { FARM_PEST } from "features/game/types/clutter";
import { ITEM_DETAILS } from "features/game/types/images";
import type { InventoryItemName } from "features/game/types/game";
import { queueImage, queueSpritesheet, runLoader } from "../../core/assets";
import { makeClickable } from "../../core/clickable";
import { gridToWorld, WORLD_TILE } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { EntityRenderer } from "../EntityRenderer";

/**
 * Visiting clutter [island/clutter/Clutter.tsx]: trash/dung/weed + pests on
 * the visited farm. 10-wide art centred in a 1×1 tile, pests painted below
 * garbage, everything above the entity band (the DOM's z 999999/99999999).
 * Click -> garbage.collected (local-only event; goes to the visitor's
 * inventory) then the FarmHelped modal when the farm's help is complete.
 *
 * Sparkle twinkle rendered from the world's sparkle.png sheet (20x19, 7
 * frames @6fps) at the DOM overlay's offset [Clutter.tsx].
 */

type Slice = {
  clutter: NonNullable<GameState["socialFarming"]>["clutter"];
  hasHelpedToday: boolean;
  visiting: boolean;
};

type Entry = {
  art: Phaser.GameObjects.Image;
  sparkle?: Phaser.GameObjects.Sprite;
  zone: Phaser.GameObjects.Zone;
};

/** The world scene's twinkle sheet [Preloader.ts "sparkle"]. */
const SPARKLE_SHEET = "world/sparkle.png";

export class ClutterRenderer extends EntityRenderer<Slice> {
  private entries = new Map<string, Entry>();

  selector(state: MachineState): Slice {
    return {
      clutter: state.context.state.socialFarming?.clutter,
      hasHelpedToday: !!state.context.hasHelpedPlayerToday,
      visiting: state.context.visitorId !== undefined,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.clutter === b.clutter &&
    a.hasHelpedToday === b.hasHelpedToday &&
    a.visiting === b.visiting;

  async sync(slice: Slice) {
    const token = this.beginSync();
    const locations =
      slice.visiting && !slice.hasHelpedToday
        ? (slice.clutter?.locations ?? {})
        : {};

    for (const spot of Object.values(locations)) {
      queueImage(
        this.scene,
        ITEM_DETAILS[spot.type as InventoryItemName].image,
      );
    }
    queueSpritesheet(this.scene, SPARKLE_SHEET, {
      frameWidth: 20,
      frameHeight: 19,
    });
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    const liveIds = new Set(Object.keys(locations));
    for (const [id, entry] of this.entries) {
      if (liveIds.has(id)) continue;
      entry.art.destroy();
      entry.sparkle?.destroy();
      entry.zone.destroy();
      this.entries.delete(id);
    }

    for (const [id, spot] of Object.entries(locations)) {
      const world = gridToWorld(spot);
      const texture = ITEM_DETAILS[spot.type as InventoryItemName].image;
      if (!this.scene.textures.exists(texture)) continue;
      // [Clutter.tsx] pests (z 999999) paint below garbage (z 99999999).
      const depth = DEPTHS.ALWAYS_ON_TOP + (spot.type in FARM_PEST ? 100 : 200);

      let entry = this.entries.get(id);
      if (!entry) {
        const art = this.scene.add.image(0, 0, texture).setOrigin(0.5, 0.5);
        const zone = this.scene.add
          .zone(0, 0, WORLD_TILE, WORLD_TILE)
          .setOrigin(0, 0);
        makeClickable(this.scene, zone, () => this.onClutterClick(id), {
          visitClickable: true,
        });
        entry = { art, zone };
        // [Clutter.tsx] 6px twinkle at (7, 6) inside the tile.
        if (this.scene.textures.exists(SPARKLE_SHEET)) {
          const animKey = "clutter-sparkle";
          if (!this.scene.anims.exists(animKey)) {
            this.scene.anims.create({
              key: animKey,
              frames: this.scene.anims.generateFrameNumbers(SPARKLE_SHEET, {
                start: 0,
                end: 6,
              }),
              frameRate: 6,
              repeat: -1,
            });
          }
          const sparkle = this.scene.add
            .sprite(0, 0, SPARKLE_SHEET)
            .setOrigin(0, 0);
          sparkle.setScale(6 / 20);
          sparkle.play(animKey);
          entry.sparkle = sparkle;
        }
        this.entries.set(id, entry);
      }
      entry.art.setTexture(texture);
      entry.art.setScale(10 / entry.art.width);
      entry.art.setPosition(world.x + 8, world.y + 8);
      entry.art.setDepth(depth);
      entry.zone.setPosition(world.x, world.y);
      entry.zone.setDepth(depth);
      entry.sparkle?.setPosition(world.x + 7, world.y + 6);
      entry.sparkle?.setDepth(depth + 1);
    }
  }

  /** [Clutter.tsx onClick] */
  private onClutterClick(id: string) {
    const machine = this.bridge.select((state) => state);
    if (machine.context.visitorId === undefined) return;
    this.bridge.dispatch({
      type: "garbage.collected",
      id,
      visitedFarmId: machine.context.farmId,
      totalHelpedToday: machine.context.totalHelpedToday ?? 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    const game = this.bridge.select((state) => state.context.state);
    if (isHelpComplete({ game })) {
      this.bridge.farmModal.open("farmHelped");
    }
  }

  protected onDestroy() {
    this.entries.forEach((entry) => {
      entry.art.destroy();
      entry.sparkle?.destroy();
      entry.zone.destroy();
    });
    this.entries.clear();
  }
}
