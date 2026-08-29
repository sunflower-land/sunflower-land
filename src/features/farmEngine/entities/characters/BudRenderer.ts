import type Phaser from "phaser";
import shadowArt from "assets/npcs/shadow.png";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState } from "features/game/types/game";
import { getBudImage } from "lib/buds/types";
import { queueImage, runLoader } from "../../core/assets";
import { gridToWorld } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { EntityRenderer } from "../EntityRenderer";

/**
 * Placed buds [island/buds/Bud.tsx + collectibles/components/Bud.tsx]. Art is
 * one CDN webp per token id (traits baked in) — animated in the DOM, first
 * frame here until sheet art exists. Shadow 16 wide flush with the tile; bud
 * 32 wide at (-8, -16) from the tile's top-left (Retreat type sits 1.52 lower).
 *
 * DEFERRED: the click popover (bud label + buffs + marketplace details).
 */

type Slice = { buds: GameState["buds"] };

type Entry = {
  shadow: Phaser.GameObjects.Image;
  bud: Phaser.GameObjects.Image;
};

export class BudRenderer extends EntityRenderer<Slice> {
  private entries = new Map<string, Entry>();

  selector(state: MachineState): Slice {
    return { buds: state.context.state.buds };
  }

  equals = (a: Slice, b: Slice) => a.buds === b.buds;

  async sync(slice: Slice) {
    const token = this.beginSync();
    const placed = Object.entries(slice.buds ?? {}).filter(
      ([, bud]) =>
        !!bud.coordinates && (!bud.location || bud.location === "farm"),
    );

    queueImage(this.scene, shadowArt);
    for (const [id] of placed) {
      queueImage(this.scene, getBudImage(Number(id)));
    }
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    const liveIds = new Set(placed.map(([id]) => id));
    for (const [id, entry] of this.entries) {
      if (liveIds.has(id)) continue;
      entry.shadow.destroy();
      entry.bud.destroy();
      this.entries.delete(id);
    }

    for (const [id, bud] of placed) {
      const world = gridToWorld(bud.coordinates!);
      const depth = DEPTHS.ENTITY_BASE + world.y + 16;
      const texture = getBudImage(Number(id));
      if (!this.scene.textures.exists(texture)) continue;

      let entry = this.entries.get(id);
      if (!entry) {
        const shadow = this.scene.add.image(0, 0, shadowArt).setOrigin(0, 1);
        const image = this.scene.add.image(0, 0, texture).setOrigin(0, 0);
        entry = { shadow, bud: image };
        this.entries.set(id, entry);
      }
      entry.shadow.setScale(16 / entry.shadow.width);
      entry.shadow.setPosition(world.x, world.y + 16);
      entry.shadow.setDepth(depth - 0.5);

      entry.bud.setTexture(texture);
      entry.bud.setScale(32 / entry.bud.width);
      // [Bud.tsx] -translate-x-1/4 of the 32-wide art, top -16 (+1.52 Retreat)
      entry.bud.setPosition(
        world.x - 8,
        world.y - 16 + (bud.type === "Retreat" ? 4 / 2.625 : 0),
      );
      entry.bud.setDepth(depth);
    }
  }

  protected onDestroy() {
    this.entries.forEach((entry) => {
      entry.shadow.destroy();
      entry.bud.destroy();
    });
    this.entries.clear();
  }
}
