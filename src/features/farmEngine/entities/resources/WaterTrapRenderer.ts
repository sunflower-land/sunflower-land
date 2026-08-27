import type Phaser from "phaser";
import crabSpot1 from "assets/wharf/crab_spot_1.webp";
import crabSpot2 from "assets/wharf/crab_spot_2.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState, IslandType } from "features/game/types/game";
import {
  caughtCrustacean,
  getWaterTrapCoordinates,
} from "features/game/types/crustaceans";
import { getObjectEntries } from "lib/object";
import { queueImage, runLoader } from "../../core/assets";
import { makeClickable } from "../../core/clickable";
import { gridToWorld, WORLD_TILE } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { ProgressBarSprite } from "../../components/ProgressBarSprite";
import { EntityRenderer } from "../EntityRenderer";
import { ensureSheetAnim, queueSheet, type SheetSpec } from "./lib";

/**
 * Crab-trap spots [island/fisherman/WaterTrapSpot.tsx]. Positions derive from
 * the wharf (getWaterTrapCoordinates), so this is standalone like the salt
 * farm. Empty spot art / a 2-frame placed-pot loop / sparkle + alert when
 * ready, with the in-scene soak progress bar. Empty click opens the placement
 * modal; ready click collects and shows the catch modal.
 */

type Slice = {
  trapSpots: NonNullable<GameState["crabTraps"]["trapSpots"]>;
  basicLand: number;
  islandType: IslandType;
};

type TrapObjects = {
  zone: Phaser.GameObjects.Zone;
  art?: Phaser.GameObjects.Image;
  pot?: Phaser.GameObjects.Sprite;
  sparkle?: Phaser.GameObjects.Image;
  alert?: Phaser.GameObjects.Image;
  bar?: ProgressBarSprite;
};

const POT_SHEETS: Record<string, SheetSpec> = {
  "Crab Pot": {
    url: SUNNYSIDE.tools.crab_pot_placed,
    frameWidth: 13,
    frameHeight: 15,
    fps: 3,
    steps: 2,
  },
  "Mariner Pot": {
    url: SUNNYSIDE.tools.mariner_pot_placed,
    frameWidth: 15,
    frameHeight: 17,
    fps: 3,
    steps: 2,
  },
};

export class WaterTrapRenderer extends EntityRenderer<Slice> {
  private traps = new Map<string, TrapObjects>();
  private tickMs = 0;

  selector(state: MachineState): Slice {
    const game = state.context.state;
    return {
      trapSpots: game.crabTraps.trapSpots ?? {},
      basicLand: game.inventory["Basic Land"]?.toNumber() ?? 3,
      islandType: game.island.type,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.trapSpots === b.trapSpots &&
    a.basicLand === b.basicLand &&
    a.islandType === b.islandType;

  anchorId(id: string) {
    return `waterTrap-${id}`;
  }

  async sync(slice: Slice) {
    const token = this.beginSync();
    [
      crabSpot1,
      crabSpot2,
      SUNNYSIDE.fx.sparkle,
      SUNNYSIDE.icons.expression_alerted,
      SUNNYSIDE.ui.emptyBar,
    ].forEach((url) => queueImage(this.scene, url));
    Object.values(POT_SHEETS).forEach((spec) => queueSheet(this.scene, spec));
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    const now = Date.now();
    const liveIds = new Set(Object.keys(slice.trapSpots));
    for (const [id, objects] of this.traps) {
      if (liveIds.has(id)) continue;
      this.destroyTrap(objects);
      this.bridge.anchors.removeAnchor(this.anchorId(id));
      this.traps.delete(id);
    }

    for (const [id, spot] of Object.entries(slice.trapSpots)) {
      const coordinates = getWaterTrapCoordinates(
        slice.basicLand,
        slice.islandType,
        id,
      );
      if (!coordinates) continue;
      const world = gridToWorld(coordinates);
      const depth = DEPTHS.ENTITY_BASE + world.y;

      let objects = this.traps.get(id);
      if (!objects) {
        const zone = this.scene.add
          .zone(0, 0, WORLD_TILE, WORLD_TILE)
          .setOrigin(0, 0);
        makeClickable(this.scene, zone, () => this.onTrapClick(id), {
          onHoverChange: (hovered) =>
            this.bridge.hover.set(
              hovered ? { type: "resource", kind: "waterTrap", id } : null,
            ),
        });
        objects = { zone };
        this.traps.set(id, objects);
      }
      objects.zone.setPosition(world.x, world.y);
      this.bridge.anchors.setAnchor(this.anchorId(id), {
        x: world.x,
        y: world.y,
        width: WORLD_TILE,
        height: WORLD_TILE,
      });

      const waterTrap = spot.waterTrap;
      const isReady = !!waterTrap && waterTrap.readyAt <= now;

      // Reset visuals each pass (cheap: a handful of spots).
      objects.art?.destroy();
      objects.art = undefined;
      objects.pot?.destroy();
      objects.pot = undefined;
      objects.sparkle?.destroy();
      objects.sparkle = undefined;
      objects.alert?.destroy();
      objects.alert = undefined;

      if (!waterTrap) {
        objects.bar?.destroy();
        objects.bar = undefined;
        const art = this.scene.add
          .image(
            world.x + WORLD_TILE / 2,
            world.y + WORLD_TILE / 2,
            Number(id) > 2 ? crabSpot2 : crabSpot1,
          )
          .setOrigin(0.5, 0.5)
          .setDepth(depth);
        art.setDisplaySize(15, 20);
        objects.art = art;
        continue;
      }

      const sheet = POT_SHEETS[waterTrap.type] ?? POT_SHEETS["Crab Pot"];
      const animKey = ensureSheetAnim(this.scene, sheet);
      const pot = this.scene.add
        .sprite(world.x + WORLD_TILE / 2, world.y + WORLD_TILE / 2, sheet.url)
        .setOrigin(0.5, 0.5)
        .setDepth(depth);
      pot.play({ key: animKey, repeat: -1 });
      objects.pot = pot;

      if (isReady) {
        objects.bar?.destroy();
        objects.bar = undefined;
        const sparkle = this.scene.add
          .image(world.x, world.y, SUNNYSIDE.fx.sparkle)
          .setOrigin(0, 0)
          .setDepth(depth + 1);
        sparkle.setScale(6 / sparkle.width);
        objects.sparkle = sparkle;
        const alert = this.scene.add
          .image(
            world.x + WORLD_TILE - 3.5,
            world.y - 8,
            SUNNYSIDE.icons.expression_alerted,
          )
          .setOrigin(1, 1)
          .setDepth(depth + 1);
        alert.setScale(4 / alert.width);
        objects.alert = alert;
      } else if (this.bridge.ui.get().showTimers) {
        const barX = world.x + WORLD_TILE / 2 - 7.5;
        const barY = world.y + WORLD_TILE - 7 - 4;
        objects.bar ??= new ProgressBarSprite(this.scene, {
          x: barX,
          y: barY,
          formatLength: "short",
          depth: depth + 1,
        });
        objects.bar.setPosition(barX, barY);
        this.updateBar(id, spot);
      }
    }
  }

  private updateBar(id: string, spot: Slice["trapSpots"][string]) {
    const objects = this.traps.get(id);
    const waterTrap = spot.waterTrap;
    if (!objects?.bar || !waterTrap) return;
    const now = Date.now();
    const secondsLeft = Math.max((waterTrap.readyAt - now) / 1000, 0);
    const total = Math.max((waterTrap.readyAt - waterTrap.placedAt) / 1000, 1);
    const percentage = Math.min(
      (Math.max(total - secondsLeft, 0) / total) * 100,
      100,
    );
    objects.bar.set(percentage, secondsLeft);
    if (secondsLeft <= 0) {
      void this.sync(this.bridge.select((state) => this.selector(state)));
    }
  }

  update(_time: number, delta: number) {
    this.tickMs += delta;
    if (this.tickMs < 1000) return;
    this.tickMs = 0;
    const slice = this.bridge.select((state) => this.selector(state));
    for (const [id, spot] of Object.entries(slice.trapSpots)) {
      this.updateBar(id, spot);
    }
  }

  /** [WaterTrapSpot.tsx handleClick] */
  private onTrapClick(id: string) {
    const game = this.bridge.select((state) => state.context.state);
    const spot = game.crabTraps.trapSpots?.[id];
    if (!spot) return;

    const waterTrap = spot.waterTrap;
    if (!waterTrap) {
      this.bridge.farmModal.open("waterTrap", id);
      return;
    }

    if (waterTrap.readyAt <= Date.now()) {
      const caught =
        waterTrap.caught ?? caughtCrustacean(waterTrap.type, waterTrap.chum);
      const [item, amount] = getObjectEntries(caught)[0] ?? [];
      this.bridge.dispatch({ type: "waterTrap.collected", trapId: id });
      if (item) {
        this.bridge.farmModal.open("crustaceanCaught", {
          item,
          amount: amount ?? 1,
        });
      }
    }
  }

  private destroyTrap(objects: TrapObjects) {
    objects.zone.destroy();
    objects.art?.destroy();
    objects.pot?.destroy();
    objects.sparkle?.destroy();
    objects.alert?.destroy();
    objects.bar?.destroy();
  }

  protected onDestroy() {
    for (const [id, objects] of this.traps) {
      this.destroyTrap(objects);
      this.bridge.anchors.removeAnchor(this.anchorId(id));
    }
    this.traps.clear();
  }
}
