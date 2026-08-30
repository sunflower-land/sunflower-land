import type Phaser from "phaser";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState, IslandType } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { playerModalManager } from "features/social/lib/playerModalManager";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { queueImage } from "../../core/assets";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import { HOME_EXTRA_OFFSETS } from "../buildings/BuildingRenderer";
import { gridRectToWorld, gridToWorld } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { makeClickable } from "../../core/clickable";
import { EntityRenderer } from "../EntityRenderer";
import { NPCSprite } from "../npc/NPCSprite";

/**
 * The player's placed bumpkin [island/bumpkin/PlacedBumpkin.tsx +
 * PlayerNPC.tsx] and farm hands [island/farmhand/FarmHand.tsx]. Both are
 * idle-composited bumpkins via NPCSprite (the animation service's 96×64 idle
 * sheet), 1×1 tile boxes, skipped when location === "home".
 *
 * Clicks: the bumpkin opens the BumpkinModal (feed tab); a farm hand opens
 * its equip modal — both via the farmModal bridge.
 *
 * DEFERRED: aura back/front layers (20×19 8-frame 14fps sheets); the
 * tutorial click helper; visiting player modal; the DOM's 0.78 src px
 * bumpkin-vs-farmhand vertical delta (both use NPCSprite's anchor).
 */

type Slice = {
  bumpkin: GameState["bumpkin"];
  farmHands: GameState["farmHands"];
  buildings: GameState["buildings"];
  islandType: IslandType;
  /** [PlayerNPC.tsx _showHelper] first Rhubarb Tart / Pumpkin Soup nudge. */
  showBumpkinHelper: boolean;
};

/**
 * [PlacedBumpkin.tsx] the main bumpkin renders through PlayerNPC inside a
 * `top: -24px` wrapper that the farm hands don't have; after the surrounding
 * flow compensates, the net effect measured against the DOM is the bumpkin
 * sitting 2 CSS px (0.76 source px) LOWER than a farm hand on the same row.
 */
const BUMPKIN_Y_NUDGE = 2 / PIXEL_SCALE;

/** [HomeBumpkins.tsx] unplaced-slot capacity per island. */
const BACKYARD_CAPACITY: Record<IslandType, number> = {
  basic: 2,
  spring: 2,
  desert: 3,
  volcano: 4,
  swamp: 4,
  spooky: 4,
  crystal: 4,
  galaxy: 4,
  marble: 4,
};

type Entry = {
  sprite: NPCSprite;
  helper?: Phaser.GameObjects.Image;
  helperTween?: Phaser.Tweens.Tween;
  /**
   * The DOM's clickable surface is the 16-wide NPC box (the sheet frame is
   * 96px wide and mostly transparent — sprite-level clicks would swallow
   * neighbours' clicks), so the click zone is separate.
   */
  zone: Phaser.GameObjects.Zone;
  /** Recreate when this changes (position/equipment/flip). */
  signature: string;
};

export class PlayerRenderer extends EntityRenderer<Slice> {
  private entries = new Map<string, Entry>();

  selector(state: MachineState): Slice {
    const game = state.context.state;
    return {
      bumpkin: game.bumpkin,
      farmHands: game.farmHands,
      buildings: game.buildings,
      islandType: game.island.type,
      showBumpkinHelper:
        (game.bumpkin?.experience === 0 &&
          !!game.inventory["Rhubarb Tart"]?.gte(1)) ||
        (!meetsLevelRequirement(
          getAscensionLevel({
            experience: game.bumpkin?.experience ?? 0,
            ascensionLevel: game.island.ascensionLevel ?? 0,
          }),
          { ascension: 0, level: 4 },
        ) &&
          !!game.inventory["Pumpkin Soup"]?.gte(1)),
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.bumpkin === b.bumpkin &&
    a.farmHands === b.farmHands &&
    a.buildings === b.buildings &&
    a.islandType === b.islandType &&
    a.showBumpkinHelper === b.showBumpkinHelper;

  sync(slice: Slice) {
    const wanted = new Map<
      string,
      {
        parts: GameState["bumpkin"]["equipped"];
        world: { x: number; y: number };
        flipped: boolean;
        helper?: boolean;
        onClick: () => void;
      }
    >();

    const bumpkin = slice.bumpkin;
    const onThisSurface = (location?: string) =>
      this.scene.location === "farm"
        ? location !== "home"
        : location === this.scene.location;

    if (bumpkin?.coordinates && onThisSurface(bumpkin.location)) {
      const bumpkinWorld = gridToWorld(bumpkin.coordinates);
      wanted.set("bumpkin", {
        parts: bumpkin.equipped,
        world: { x: bumpkinWorld.x, y: bumpkinWorld.y + BUMPKIN_Y_NUDGE },
        flipped: !!bumpkin.flipped,
        helper: slice.showBumpkinHelper,
        onClick: () => this.onBumpkinClick(),
      });
    }
    for (const [id, hand] of Object.entries(slice.farmHands.bumpkins ?? {})) {
      if (!hand.coordinates || !onThisSurface(hand.location)) continue;
      wanted.set(`hand#${id}`, {
        parts: hand.equipped,
        world: gridToWorld(hand.coordinates),
        flipped: !!hand.flipped,
        onClick: () => this.bridge.farmModal.open("farmHandEquip", { id }),
      });
    }

    // [HomeBumpkins.tsx] the unplaced bumpkin + farm hands lined up in front
    // of the home building (16px slots + mr-1 gap, row bottom `bottomUp`
    // above the box bottom; capacity-capped per island).
    const homeName =
      this.scene.location !== "farm"
        ? undefined
        : (
            Object.keys(
              HOME_EXTRA_OFFSETS,
            ) as (keyof typeof HOME_EXTRA_OFFSETS)[]
          ).find((name) =>
            (slice.buildings[name] ?? []).some((item) => item.coordinates),
          );
    if (homeName) {
      const item = (slice.buildings[homeName] ?? []).find(
        (placed) => placed.coordinates,
      )!;
      const box = gridRectToWorld(
        item.coordinates!,
        BUILDINGS_DIMENSIONS[homeName],
      );
      const offsets = HOME_EXTRA_OFFSETS[homeName];
      const rowBottom = box.y + box.height - offsets.row.bottomUp;
      let slotX = box.x + offsets.row.left;
      const advance = () => {
        const x = slotX;
        slotX += 16 + 1.5; // GRID_WIDTH_PX slot + mr-1
        return x;
      };

      if (bumpkin && !bumpkin.coordinates) {
        wanted.set("home-bumpkin", {
          parts: bumpkin.equipped,
          world: { x: advance(), y: rowBottom - 16 },
          flipped: false,
          onClick: () => this.bridge.farmModal.open("bumpkinPlayer"),
        });
      }
      Object.entries(slice.farmHands.bumpkins ?? {})
        .filter(([, hand]) => !hand.coordinates)
        .slice(0, BACKYARD_CAPACITY[slice.islandType])
        .forEach(([id, hand]) => {
          wanted.set(`home-hand#${id}`, {
            parts: hand.equipped,
            world: { x: advance(), y: rowBottom - 16 },
            flipped: false,
            onClick: () => this.bridge.farmModal.open("farmHandEquip", { id }),
          });
        });
    }

    for (const [key, entry] of this.entries) {
      if (wanted.has(key)) continue;
      entry.sprite.destroy();
      entry.zone.destroy();
      entry.helperTween?.remove();
      entry.helper?.destroy();
      this.entries.delete(key);
    }

    for (const [key, config] of wanted) {
      const world = config.world;
      const signature = `${JSON.stringify(config.parts)}|${world.x},${world.y}|${config.flipped}|${!!config.helper}`;
      const existing = this.entries.get(key);
      if (existing) {
        if (existing.signature === signature) continue;
        existing.sprite.destroy();
        existing.zone.destroy();
        existing.helperTween?.remove();
        existing.helper?.destroy();
        this.entries.delete(key);
      }
      const sprite = new NPCSprite(this.scene, {
        parts: config.parts,
        x: world.x,
        y: world.y,
        flipX: config.flipped,
        depth: DEPTHS.ENTITY_BASE + world.y,
      });
      void sprite.create();
      // [NPCPlaceable] 16-wide box. The composed sprite's visible body runs
      // from ~16px above the box down to ~16px below it (the 64px service
      // frame is centred at y+16), so the zone spans the full figure — a
      // 32-tall zone left the legs/feet dead to clicks.
      const zone = this.scene.add
        .zone(world.x, world.y - 16, 16, 48)
        .setOrigin(0, 0)
        .setDepth(DEPTHS.ENTITY_BASE + world.y);
      makeClickable(this.scene, zone, config.onClick);
      const entry: Entry = { sprite, zone, signature };
      // The worker experiment drives the main bumpkin around the farm.
      if (key === "bumpkin") {
        (this.scene as unknown as { mainBumpkin?: NPCSprite }).mainBumpkin =
          sprite;
      }
      // [PlayerNPC.tsx showHelper] pulsating click icon (18px, right -8,
      // top 20 of the NPC box).
      if (config.helper) {
        queueImage(this.scene, SUNNYSIDE.icons.click_icon);
        if (this.scene.textures.exists(SUNNYSIDE.icons.click_icon)) {
          const helper = this.scene.add
            .image(
              world.x + 16 + 8 - 18,
              world.y + 20,
              SUNNYSIDE.icons.click_icon,
            )
            .setOrigin(0, 0)
            .setDepth(DEPTHS.ENTITY_BASE + world.y + 2);
          helper.setScale(18 / helper.width);
          makeClickable(this.scene, helper, config.onClick);
          if (this.bridge.ui.get().showAnimations) {
            entry.helperTween = this.scene.tweens.add({
              targets: helper,
              scale: helper.scale * 1.15,
              duration: 500,
              yoyo: true,
              repeat: -1,
            });
          }
          entry.helper = helper;
        }
      }
      this.entries.set(key, entry);
    }
  }

  /**
   * [PlayerNPC.tsx handleClick] on your own farm the bumpkin opens the feed
   * modal; while visiting it opens the visited player's social profile
   * through the global playerModalManager.
   */
  private onBumpkinClick() {
    // EXPERIMENT: on your own farm the bumpkin is a worker you can select and
    // give jobs to; the profile modal stays one click away while visiting.
    const worker = (this.scene as unknown as { worker?: { toggle(): void } })
      .worker;
    if (
      worker &&
      this.bridge.select((s) => s.context.visitorId) === undefined
    ) {
      worker.toggle();
      return;
    }
    const machine = this.bridge.select((state) => state);
    if (machine.context.visitorId === undefined) {
      this.bridge.farmModal.open("bumpkinPlayer");
      return;
    }
    const game = machine.context.state;
    playerModalManager.open({
      farmId: machine.context.farmId,
      username: game.username ?? "",
      clothing: game.bumpkin?.equipped,
      experience: game.bumpkin?.experience ?? 0,
      ascensionLevel: game.island.ascensionLevel ?? 0,
      faction: game.faction?.name,
    });
  }

  protected onDestroy() {
    this.entries.forEach((entry) => {
      entry.sprite.destroy();
      entry.zone.destroy();
      entry.helperTween?.remove();
      entry.helper?.destroy();
    });
    this.entries.clear();
  }
}
