import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState } from "features/game/types/game";
import { queueImage, runLoader } from "../../core/assets";
import { makeClickable } from "../../core/clickable";
import { gridToWorld } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { EntityRenderer } from "../EntityRenderer";

/**
 * Placed airdrops [expansion/components/Airdrop.tsx]: a treasure chest with
 * the DOM's bulge pulse, an alert icon floating above, click -> claim modal
 * via the bridge. Coordinate-less airdrops stay with the React overlay
 * (Game.tsx's AirdropPopup) and are not rendered here.
 */

type Slice = { airdrops: GameState["airdrops"] };

type Entry = {
  chest: Phaser.GameObjects.Image;
  alert: Phaser.GameObjects.Image;
  tweens: Phaser.Tweens.Tween[];
};

export class AirdropRenderer extends EntityRenderer<Slice> {
  private entries = new Map<string, Entry>();

  selector(state: MachineState): Slice {
    return { airdrops: state.context.state.airdrops };
  }

  equals = (a: Slice, b: Slice) => a.airdrops === b.airdrops;

  async sync(slice: Slice) {
    const token = this.beginSync();
    const placed = (slice.airdrops ?? []).filter(
      (airdrop) => !!airdrop.coordinates,
    );

    queueImage(this.scene, SUNNYSIDE.decorations.treasure_chest);
    queueImage(this.scene, SUNNYSIDE.icons.expression_alerted);
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    const liveIds = new Set(placed.map((airdrop) => airdrop.id));
    for (const [id, entry] of this.entries) {
      if (liveIds.has(id)) continue;
      this.destroyEntry(entry);
      this.entries.delete(id);
    }

    for (const airdrop of placed) {
      const world = gridToWorld(airdrop.coordinates!);
      const depth = DEPTHS.ENTITY_BASE + world.y;

      let entry = this.entries.get(airdrop.id);
      if (!entry) {
        const chest = this.scene.add
          .image(
            world.x + 8,
            world.y + 16,
            SUNNYSIDE.decorations.treasure_chest,
          )
          .setOrigin(0.5, 1);
        chest.setScale(16 / chest.width);
        makeClickable(
          this.scene,
          chest,
          () => this.bridge.farmModal.open("airdrop", { id: airdrop.id }),
          { glow: () => chest },
        );

        const alert = this.scene.add
          .image(world.x + 6, world.y - 12, SUNNYSIDE.icons.expression_alerted)
          .setOrigin(0, 0);
        alert.setScale(4 / alert.width);

        const tweens: Phaser.Tweens.Tween[] = [];
        if (this.bridge.ui.get().showAnimations) {
          // [styles.css bulgeRepeat] quick squash at the top of a 1200ms loop.
          const base = chest.scale;
          tweens.push(
            this.scene.tweens.add({
              targets: chest,
              scaleX: base * 1.15,
              scaleY: base * 0.9,
              duration: 150,
              yoyo: true,
              repeat: -1,
              repeatDelay: 900,
            }),
          );
          // [tailwind animate-float]
          tweens.push(
            this.scene.tweens.add({
              targets: alert,
              y: alert.y + 6 / 2.625,
              duration: 1500,
              yoyo: true,
              repeat: -1,
              ease: "Sine.easeInOut",
            }),
          );
        }

        entry = { chest, alert, tweens };
        this.entries.set(airdrop.id, entry);
      }
      entry.chest.setDepth(depth);
      entry.alert.setDepth(depth + 1);
    }
  }

  private destroyEntry(entry: Entry) {
    entry.tweens.forEach((tween) => tween.remove());
    entry.chest.destroy();
    entry.alert.destroy();
  }

  protected onDestroy() {
    this.entries.forEach((entry) => this.destroyEntry(entry));
    this.entries.clear();
  }
}
