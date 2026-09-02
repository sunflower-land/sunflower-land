import type Phaser from "phaser";
import shadowArt from "assets/npcs/shadow.png";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState } from "features/game/types/game";
import { getBudImage } from "lib/buds/types";
import { queueImage, runLoader } from "../../core/assets";
import {
  queueArt,
  resolveArtObject,
  type ArtObject,
} from "../../core/animated";
import { makeClickable } from "../../core/clickable";
import { gridToWorld, WORLD_TILE } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { EntityRenderer } from "../EntityRenderer";

/**
 * Placed buds [island/buds/Bud.tsx + collectibles/components/Bud.tsx]. Art is
 * one CDN webp/gif per token id (traits baked in) — the DOM's <img> plays it
 * natively, so ids covered by the converted strips [scripts/
 * gif-to-spritesheet.js -> assets/animations/buds_<id>.png] loop here too;
 * unconverted ids fall back to the static CDN frame. Shadow + click zone
 * render even when the CDN image is missing entirely (the DOM keeps its
 * broken-img wrapper clickable). Shadow 16 wide flush with the tile; bud 32
 * wide at (-8, -16) from the tile's top-left (Retreat type sits 1.52 lower).
 *
 * Clicks open the bud detail popover (label + buffs + marketplace details)
 * via the shared sftPopover channel.
 */

type Slice = { buds: GameState["buds"] };

type Entry = {
  shadow: Phaser.GameObjects.Image;
  art?: ArtObject;
  zone: Phaser.GameObjects.Zone;
};

export class BudRenderer extends EntityRenderer<Slice> {
  private entries = new Map<string, Entry>();

  selector(state: MachineState): Slice {
    return { buds: state.context.state.buds };
  }

  equals = (a: Slice, b: Slice) => a.buds === b.buds;

  async sync(slice: Slice) {
    this.movingUnsubscribe ??= this.bridge.landscapingMoving.subscribe(() =>
      this.applyMovingVisibility(),
    );
    const token = this.beginSync();
    const placed = Object.entries(slice.buds ?? {}).filter(
      ([, bud]) =>
        !!bud.coordinates &&
        (this.scene.location === "farm"
          ? !bud.location || bud.location === "farm"
          : bud.location === this.scene.location),
    );

    queueImage(this.scene, shadowArt);
    for (const [id] of placed) {
      queueArt(this.scene, getBudImage(Number(id)));
    }
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    const liveIds = new Set(placed.map(([id]) => id));
    for (const [id, entry] of this.entries) {
      if (liveIds.has(id)) continue;
      entry.shadow.destroy();
      entry.art?.destroy();
      entry.zone.destroy();
      this.entries.delete(id);
    }

    for (const [id, bud] of placed) {
      const world = gridToWorld(bud.coordinates!);
      const depth = DEPTHS.ENTITY_BASE + world.y;
      const texture = getBudImage(Number(id));

      let entry = this.entries.get(id);
      if (!entry) {
        const shadow = this.scene.add.image(0, 0, shadowArt).setOrigin(0, 1);
        // 1-tile hit box like the DOM bud wrapper [Bud.tsx].
        const zone = this.scene.add
          .zone(0, 0, WORLD_TILE, WORLD_TILE * 2)
          .setOrigin(0, 0);
        makeClickable(this.scene, zone, () => this.onBudClick(id), {
          visitClickable: true,
        });
        entry = { shadow, zone };
        this.entries.set(id, entry);
      }
      entry.shadow.setScale(16 / entry.shadow.width);
      entry.shadow.setPosition(world.x, world.y + 16);
      entry.shadow.setDepth(depth - 0.5);
      entry.zone.setPosition(world.x, world.y - 16);
      entry.zone.setDepth(depth);

      // [Bud.tsx] -translate-x-1/4 of the 32-wide art, top -16 (+1.52 Retreat)
      entry.art = resolveArtObject(this.scene, entry.art, texture);
      if (entry.art) {
        entry.art.setOrigin(0, 0);
        entry.art.setScale(32 / entry.art.width);
        entry.art.setPosition(
          world.x - 8,
          world.y - 16 + (bud.type === "Retreat" ? 4 / 2.625 : 0),
        );
        entry.art.setDepth(depth);
      }
    }
  }

  /** [MovableComponent] hide the moving bud — the drag preview is the bud. */
  private applyMovingVisibility() {
    const moving = this.bridge.landscapingMoving.get();
    for (const [id, entry] of this.entries) {
      const hidden =
        !!moving?.dragging && moving.name === "Bud" && moving.id === id;
      entry.art?.setVisible(!hidden);
      entry.shadow.setVisible(!hidden);
    }
  }

  private movingUnsubscribe?: () => void;

  /** [Bud.tsx] click -> anchored detail popover. */
  private onBudClick(id: string) {
    const bud = this.bridge.select(
      (state) => state.context.state.buds?.[Number(id)],
    );
    if (!bud?.coordinates) return;
    const world = gridToWorld(bud.coordinates);
    this.bridge.anchors.setAnchor("sft-popover", {
      x: world.x,
      y: world.y - 16,
      width: WORLD_TILE,
      height: WORLD_TILE * 2,
    });
    setTimeout(
      () =>
        this.bridge.sftPopover.set({
          anchorId: "sft-popover",
          budId: Number(id),
        }),
      0,
    );
  }

  protected onDestroy() {
    this.movingUnsubscribe?.();
    this.entries.forEach((entry) => {
      entry.shadow.destroy();
      entry.art?.destroy();
      entry.zone.destroy();
    });
    this.entries.clear();
  }
}
