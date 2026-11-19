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
import {
  gridRectToWorld,
  gridToWorld,
  WORLD_TILE,
} from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { makeClickable } from "../../core/clickable";
import { nativeScale } from "../../core/pixelArt";
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

/**
 * How far a composed bumpkin's visible figure spills out of its 1x1 grid box,
 * in world px. Measured from the drawn frames: the figure (16-18px wide,
 * 15-19px tall) starts 4-8px inside the box top — hats reach the top — and
 * its feet end ~7px below the box. The click zone is the box plus this.
 *
 * It was 16 above and 16 below (a 16x48 zone over a ~16x18 figure), which
 * swallowed clicks on whatever stood above and below a bumpkin.
 *
 * Exported because landscaping hit-tests these NPCs itself
 * [LandscapingController.hitTest] — normal click zones are inert in edit mode
 * — and the two must describe the same figure. They didn't: landscaping
 * granted only the headroom, so a bumpkin could be grabbed by the head and
 * the air above it but not by the body it appears to stand on.
 */
export const NPC_FIGURE = { above: 0, below: 8 } as const;

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
  /**
   * [PlacedBumpkin.tsx] heart over the PLACED bumpkin for 3s after
   * recipes.collected (by the house it is drawn by BuildingRenderer).
   */
  private heart?: Phaser.GameObjects.Image;
  private heartTween?: Phaser.Tweens.Tween;
  /** Pending hide; defined exactly while the heart is due to be shown. */
  private heartHide?: Phaser.Time.TimerEvent;
  private unsubscribeEvents: (() => void) | undefined;

  mount() {
    super.mount();
    this.unsubscribeEvents = this.bridge.onGameEvent((event) => {
      if (event.type !== "recipes.collected") return;
      this.heartHide?.remove();
      this.heartHide = this.scene.time.delayedCall(3000, () => {
        this.heartHide = undefined;
        this.syncHeart();
      });
      this.syncHeart();
    });
  }

  /**
   * Draw, move or drop the collect heart: width 10, top -8, left 3 of the
   * DOM's `top: -24px` wrapper around the placed bumpkin; not shown while
   * landscaping (the DOM renders the moveable branch, which has no heart).
   */
  private syncHeart() {
    const entry = this.entries.get("bumpkin");
    const show =
      !!this.heartHide &&
      !!entry &&
      !this.bridge.select((state) => state.matches("landscaping")) &&
      this.scene.textures.exists(SUNNYSIDE.icons.heart);
    if (!show || !entry) {
      this.heartTween?.remove();
      this.heartTween = undefined;
      this.heart?.destroy();
      this.heart = undefined;
      return;
    }
    // The zone sits at the bumpkin's world position, NPC_FIGURE.above higher.
    const tileY = entry.zone.y + NPC_FIGURE.above - BUMPKIN_Y_NUDGE;
    const y = tileY - 24 / PIXEL_SCALE - 8;
    this.heart ??= this.scene.add
      .image(0, 0, SUNNYSIDE.icons.heart)
      .setOrigin(0, 0);
    const x = entry.zone.x + 3 + nativeScale(this.heart, 10);
    // Just in front of the bumpkin's row, as before the zone was trimmed.
    this.heart.setDepth(DEPTHS.ENTITY_BASE + tileY - 14);
    // Already floating at this spot (the tween owns y, so compare the rest y).
    if (this.heart.x === x && this.heart.getData("restY") === y) return;
    this.heartTween?.remove();
    this.heartTween = undefined;
    this.heart.setPosition(x, y).setData("restY", y);
    // [animate-float] 0 -> 6 CSS px -> 0 over 3s, ease-in-out.
    if (this.bridge.ui.get().showAnimations) {
      this.heartTween = this.scene.tweens.add({
        targets: this.heart,
        y: y + 6 / PIXEL_SCALE,
        duration: 1500,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }

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
      // [Land.tsx] the farm draws only characters placed ON the farm — one
      // standing on an interior floor belongs to that surface.
      this.scene.location === "farm"
        ? (location ?? "farm") === "farm"
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
      // 16-wide box around the drawn figure (see NPC_FIGURE).
      const zone = this.scene.add
        .zone(
          world.x,
          world.y - NPC_FIGURE.above,
          WORLD_TILE,
          NPC_FIGURE.above + WORLD_TILE + NPC_FIGURE.below,
        )
        .setOrigin(0, 0)
        .setDepth(DEPTHS.ENTITY_BASE + world.y);
      makeClickable(this.scene, zone, config.onClick, {
        glow: () => sprite.body(),
      });
      const entry: Entry = { sprite, zone, signature };
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
          makeClickable(this.scene, helper, config.onClick, {
            glow: () => sprite.body(),
          });
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

    // Follow the bumpkin if it moved (or was lifted) mid-heart.
    queueImage(this.scene, SUNNYSIDE.icons.heart);
    if (this.heartHide) this.syncHeart();
  }

  /**
   * [PlayerNPC.tsx handleClick] on your own farm the bumpkin opens the feed
   * modal; while visiting it opens the visited player's social profile
   * through the global playerModalManager.
   */
  private onBumpkinClick() {
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
    this.unsubscribeEvents?.();
    this.unsubscribeEvents = undefined;
    this.heartHide?.remove();
    this.heartHide = undefined;
    this.heartTween?.remove();
    this.heart?.destroy();
    this.heart = undefined;
    this.entries.forEach((entry) => {
      entry.sprite.destroy();
      entry.zone.destroy();
      entry.helperTween?.remove();
      entry.helper?.destroy();
    });
    this.entries.clear();
  }
}
