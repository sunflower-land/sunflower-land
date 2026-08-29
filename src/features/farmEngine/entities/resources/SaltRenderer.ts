import type Phaser from "phaser";
import plusIcon from "assets/icons/plus.png";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState } from "features/game/types/game";
import {
  getPendingSaltNodeIdsForUpgrade,
  getSaltChargeGenerationTime,
  getSaltNodeCoordinates,
  getMaxStoredSaltCharges,
  getStoredSaltCharges,
} from "features/game/types/salt";
import {
  canInstantHarvestSaltNode,
  getSaltNodeSprite,
} from "features/game/expansion/components/salt/saltNodeStage";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { queueImage, runLoader } from "../../core/assets";
import { makeClickable } from "../../core/clickable";
import { gridToWorld, WORLD_TILE } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { EntityRenderer } from "../EntityRenderer";
import type { Unsubscribe } from "../../bridge/subscriptions";

/**
 * The salt farm [salt/SaltNode.tsx + SaltNodePlaceholder.tsx]. Node positions
 * are DERIVED (dock offset + per-node table via getSaltNodeCoordinates), not
 * stored on the nodes, so this is a standalone renderer rather than a
 * ResourceNodeRenderer. Stage art from stored charges (regenerating every
 * ~7h), alert icon when harvestable, plus upgrade placeholders for locked
 * nodes. A minute-level tick keeps stages fresh.
 */

type Slice = {
  landscaping: boolean;
  saltNodes: GameState["saltFarm"]["nodes"];
  saltFarmLevel: number;
  basicLand: number;
};

type SaltObjects = {
  zone: Phaser.GameObjects.Zone;
  art: Phaser.GameObjects.Image;
  alert?: Phaser.GameObjects.Image;
  plus?: Phaser.GameObjects.Image;
};

const TICK_MS = 30_000;

export class SaltRenderer extends EntityRenderer<Slice> {
  private nodes = new Map<string, SaltObjects>();
  private placeholders = new Map<string, SaltObjects>();
  private tickMs = 0;
  private unsubscribeUi: Unsubscribe | undefined;

  selector(state: MachineState): Slice {
    const game = state.context.state;
    return {
      landscaping: state.matches("landscaping"),
      saltNodes: game.saltFarm.nodes,
      saltFarmLevel: game.saltFarm.level,
      basicLand: game.inventory["Basic Land"]?.toNumber() ?? 3,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.landscaping === b.landscaping &&
    a.saltNodes === b.saltNodes &&
    a.saltFarmLevel === b.saltFarmLevel &&
    a.basicLand === b.basicLand;

  anchorId(id: string) {
    return `salt-${id}`;
  }

  async sync(slice: Slice) {
    const token = this.beginSync();
    // [Land.tsx:1302-1334] the DOM unmounts this during landscaping.
    if (slice.landscaping) {
      this.clear();
      return;
    }
    // Queue every stage sprite (small set) + icons.
    for (let charges = 0; charges <= 5; charges++) {
      queueImage(this.scene, getSaltNodeSprite(charges));
    }
    queueImage(this.scene, SUNNYSIDE.icons.expression_alerted);
    queueImage(this.scene, plusIcon);
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    const game = this.game();
    const now = Date.now();
    const { chargeGenerationTimeMs } = getSaltChargeGenerationTime({
      gameState: game,
    });
    const maxCharges = getMaxStoredSaltCharges(
      (game as { sculptures?: Record<string, { level?: number }> })
        .sculptures?.["Salt Sculpture"]?.level ?? 0,
    );

    // Active nodes.
    const liveIds = new Set(Object.keys(slice.saltNodes));
    for (const [id, objects] of this.nodes) {
      if (liveIds.has(id)) continue;
      this.destroyObjects(objects);
      this.bridge.anchors.removeAnchor(this.anchorId(id));
      this.nodes.delete(id);
    }
    for (const [id, node] of Object.entries(slice.saltNodes)) {
      const coordinates = getSaltNodeCoordinates(slice.basicLand, id);
      const world = gridToWorld(coordinates);
      const charges = getStoredSaltCharges(node, now, {
        chargeIntervalMs: chargeGenerationTimeMs,
        maxCharges,
      });

      let objects = this.nodes.get(id);
      if (!objects) {
        const art = this.scene.add
          .image(0, 0, getSaltNodeSprite(charges))
          .setOrigin(0, 0);
        const zone = this.scene.add
          .zone(0, 0, WORLD_TILE, WORLD_TILE)
          .setOrigin(0, 0);
        makeClickable(this.scene, zone, () => this.onNodeClick(id), {
          onHoverChange: (hovered) =>
            this.bridge.hover.set(
              hovered ? { type: "resource", kind: "salt", id } : null,
            ),
        });
        objects = { zone, art };
        this.nodes.set(id, objects);
      }

      objects.zone.setPosition(world.x, world.y);
      objects.zone.setDepth(DEPTHS.ENTITY_BASE + world.y);
      objects.art.setTexture(getSaltNodeSprite(charges));
      objects.art.setScale(18 / objects.art.width);
      objects.art.setPosition(world.x, world.y);
      objects.art.setDepth(DEPTHS.ENTITY_BASE + world.y);

      objects.alert?.destroy();
      objects.alert = undefined;
      if (charges > 0) {
        const alert = this.scene.add
          .image(
            world.x + WORLD_TILE / 2,
            world.y - 2,
            SUNNYSIDE.icons.expression_alerted,
          )
          .setOrigin(0.5, 1)
          .setDepth(DEPTHS.ENTITY_BASE + world.y + 1);
        alert.setScale(4 / alert.width);
        objects.alert = alert;
      }

      this.bridge.anchors.setAnchor(this.anchorId(id), {
        x: world.x,
        y: world.y,
        width: WORLD_TILE,
        height: WORLD_TILE,
      });
    }

    // Upgrade placeholders for locked nodes.
    const pendingIds = getPendingSaltNodeIdsForUpgrade({
      level: slice.saltFarmLevel,
      nodes: slice.saltNodes,
    } as GameState["saltFarm"]);
    const pendingSet = new Set(pendingIds);
    for (const [id, objects] of this.placeholders) {
      if (pendingSet.has(id)) continue;
      this.destroyObjects(objects);
      this.placeholders.delete(id);
    }
    for (const id of pendingIds) {
      const world = gridToWorld(getSaltNodeCoordinates(slice.basicLand, id));
      let objects = this.placeholders.get(id);
      if (!objects) {
        const art = this.scene.add
          .image(0, 0, getSaltNodeSprite(0))
          .setOrigin(0, 0);
        const plus = this.scene.add.image(0, 0, plusIcon).setOrigin(0, 0);
        const zone = this.scene.add
          .zone(0, 0, WORLD_TILE, WORLD_TILE)
          .setOrigin(0, 0);
        makeClickable(this.scene, zone, () =>
          this.bridge.farmModal.open("upgradeSaltFarm"),
        );
        objects = { zone, art, plus };
        this.placeholders.set(id, objects);
      }
      objects.zone.setPosition(world.x, world.y);
      objects.zone.setDepth(DEPTHS.ENTITY_BASE + world.y);
      objects.art.setScale(18 / objects.art.width);
      objects.art.setPosition(world.x, world.y);
      objects.art.setDepth(DEPTHS.ENTITY_BASE + world.y);
      if (objects.plus) {
        objects.plus.setScale(8 / objects.plus.width);
        objects.plus.setPosition(world.x + 4, world.y + 2);
        objects.plus.setDepth(DEPTHS.ENTITY_BASE + world.y + 1);
      }
    }
  }

  /** [SaltNode.tsx onClick] */
  private onNodeClick(id: string) {
    const game = this.game();
    const node = game.saltFarm.nodes[id];
    if (!node) return;

    const now = Date.now();
    const { chargeGenerationTimeMs } = getSaltChargeGenerationTime({
      gameState: game,
    });
    const maxCharges = getMaxStoredSaltCharges(
      (game as { sculptures?: Record<string, { level?: number }> })
        .sculptures?.["Salt Sculpture"]?.level ?? 0,
    );
    const storedCharges = getStoredSaltCharges(node, now, {
      chargeIntervalMs: chargeGenerationTimeMs,
      maxCharges,
    });
    const rakeFree = isCollectibleBuilt({ name: "Ascended Idol", game });
    const availableRakes = Math.floor(
      game.inventory["Salt Rake"]?.toNumber() ?? 0,
    );

    if (
      canInstantHarvestSaltNode({
        visiting: false,
        storedCharges,
        availableRakes,
        rakeFree,
      })
    ) {
      this.bridge.dispatch("salt.harvested", { id });
      if (!rakeFree) this.bridge.selectItem("Salt Rake");
    }
  }

  /** Charges regenerate over hours — a coarse tick keeps stages honest. */
  update(_time: number, delta: number) {
    this.tickMs += delta;
    if (this.tickMs < TICK_MS) return;
    this.tickMs = 0;
    void this.sync(this.bridge.select((state) => this.selector(state)));
  }

  private game(): GameState {
    return this.bridge.select((state) => state.context.state);
  }

  private destroyObjects(objects: SaltObjects) {
    objects.zone.destroy();
    objects.art.destroy();
    objects.alert?.destroy();
    objects.plus?.destroy();
  }

  private clear() {
    for (const [id, objects] of this.nodes) {
      this.destroyObjects(objects);
      this.bridge.anchors.removeAnchor(this.anchorId(id));
    }
    this.nodes.clear();
    this.placeholders.forEach((objects) => this.destroyObjects(objects));
    this.placeholders.clear();
  }

  protected onDestroy() {
    this.unsubscribeUi?.();
    this.clear();
  }
}
