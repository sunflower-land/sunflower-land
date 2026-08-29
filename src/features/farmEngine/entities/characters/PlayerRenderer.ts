import type Phaser from "phaser";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState } from "features/game/types/game";
import { gridToWorld } from "../../core/coordinates";
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
};

type Entry = {
  sprite: NPCSprite;
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
    return { bumpkin: game.bumpkin, farmHands: game.farmHands };
  }

  equals = (a: Slice, b: Slice) =>
    a.bumpkin === b.bumpkin && a.farmHands === b.farmHands;

  sync(slice: Slice) {
    const wanted = new Map<
      string,
      {
        parts: GameState["bumpkin"]["equipped"];
        coordinates: { x: number; y: number; oX?: number; oY?: number };
        flipped: boolean;
        onClick: () => void;
      }
    >();

    const bumpkin = slice.bumpkin;
    if (bumpkin?.coordinates && bumpkin.location !== "home") {
      wanted.set("bumpkin", {
        parts: bumpkin.equipped,
        coordinates: bumpkin.coordinates,
        flipped: !!bumpkin.flipped,
        onClick: () => this.bridge.farmModal.open("bumpkinPlayer"),
      });
    }
    for (const [id, hand] of Object.entries(slice.farmHands.bumpkins ?? {})) {
      if (!hand.coordinates || hand.location === "home") continue;
      wanted.set(`hand#${id}`, {
        parts: hand.equipped,
        coordinates: hand.coordinates,
        flipped: !!hand.flipped,
        onClick: () => this.bridge.farmModal.open("farmHandEquip", { id }),
      });
    }

    for (const [key, entry] of this.entries) {
      if (wanted.has(key)) continue;
      entry.sprite.destroy();
      entry.zone.destroy();
      this.entries.delete(key);
    }

    for (const [key, config] of wanted) {
      const world = gridToWorld(config.coordinates);
      const signature = `${JSON.stringify(config.parts)}|${world.x},${world.y}|${config.flipped}`;
      const existing = this.entries.get(key);
      if (existing) {
        if (existing.signature === signature) continue;
        existing.sprite.destroy();
        existing.zone.destroy();
        this.entries.delete(key);
      }
      const sprite = new NPCSprite(this.scene, {
        parts: config.parts,
        x: world.x,
        y: world.y,
        flipX: config.flipped,
        depth: DEPTHS.ENTITY_BASE + world.y + 16,
      });
      void sprite.create();
      // [NPCPlaceable] 16-wide box, bumpkin standing above the tile.
      const zone = this.scene.add
        .zone(world.x, world.y - 16, 16, 32)
        .setOrigin(0, 0);
      makeClickable(this.scene, zone, config.onClick);
      this.entries.set(key, { sprite, zone, signature });
    }
  }

  protected onDestroy() {
    this.entries.forEach((entry) => {
      entry.sprite.destroy();
      entry.zone.destroy();
    });
    this.entries.clear();
  }
}
