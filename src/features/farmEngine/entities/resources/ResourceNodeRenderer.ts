import Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState, TemperateSeasonName } from "features/game/types/game";
import {
  getCurrentBiome,
  type LandBiomeName,
} from "features/island/biomes/biomes";
import { runLoader } from "../../core/assets";
import { nativeScale } from "../../core/pixelArt";
import { makeClickable } from "../../core/clickable";
import type { GlowTarget } from "../../core/hoverGlow";
import type { ArtObject } from "../../core/animated";
import { gridToWorld } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { ProgressBarSprite } from "../../components/ProgressBarSprite";
import type { ResourceHoverKind } from "../../bridge/GameBridge";
import { EntityRenderer } from "../EntityRenderer";
import { applyArt, type ArtSpec, type NodeBox } from "./lib";

/**
 * Base for every resource node (trees, rocks, oil...): reconciles a
 * Record<id, node> slice into a zone (input), a main art image, optional
 * strike overlay and health bar, and a per-node anchor for the React overlay
 * (popovers / no-tool warnings via bridge.hover).
 *
 * Touch counts replicate the DOM's STALE-read semantics: the count is read
 * BEFORE incrementing, so with HITS=3 the third click fires. An outside click
 * (any pointerdown not inside a touched node's box) resets its count, like
 * the DOM's document-level listener.
 */

export type NodeSlice<N> = {
  nodes: Record<string, N>;
  island: GameState["island"];
  season: TemperateSeasonName;
  collectibles: GameState["collectibles"];
};

export type NodeObjects = {
  zone: Phaser.GameObjects.Zone;
  art?: ArtObject;
  strike?: Phaser.GameObjects.Sprite;
  bar?: ProgressBarSprite;
  /** Named extra display objects a subclass manages (overlays, icons). */
  extras: Map<string, Phaser.GameObjects.GameObject>;
  touch: number;
};

export type RenderContext = {
  box: NodeBox;
  depth: number;
  biome: LandBiomeName;
  season: TemperateSeasonName;
};

export abstract class ResourceNodeRenderer<
  N extends { x?: number; y?: number },
> extends EntityRenderer<NodeSlice<N>> {
  /** Anchor prefix + registry label. */
  protected abstract readonly rendererKey: string;
  /** Placement box, tiles. */
  protected abstract readonly tileDims: { width: number; height: number };
  /** Hover kind for the React overlay (null = no hover popovers). */
  protected abstract readonly hoverKind: ResourceHoverKind | null;

  protected abstract selectNodes(game: GameState): Record<string, N>;
  /** Queue every texture/sheet the slice needs (before the loader runs). */
  protected abstract collectAssets(slice: NodeSlice<N>): void;
  /** (Re)build a node's visuals for its current state. */
  protected abstract renderNode(
    id: string,
    node: N,
    objects: NodeObjects,
    ctx: RenderContext,
  ): void;
  /** Click on a node (after the shared plumbing). */
  protected abstract onNodeClick(id: string): void;

  /** Hook for removal effects (e.g. the ascension-crystal mining ghost). */
  protected onNodeRemoved(_id: string, _node: N | undefined, _box: NodeBox) {
    // default: nothing
  }

  protected nodes = new Map<string, NodeObjects>();
  protected prevNodes: Record<string, N> = {};
  private outsideClickHandler:
    | ((pointer: Phaser.Input.Pointer) => void)
    | undefined;

  anchorId(id: string) {
    return `${this.rendererKey}-${id}`;
  }

  selector(state: MachineState): NodeSlice<N> {
    const game = state.context.state;
    return {
      nodes: this.selectNodes(game),
      island: game.island,
      season: game.season.season,
      collectibles: game.collectibles,
    };
  }

  equals = (a: NodeSlice<N>, b: NodeSlice<N>) =>
    a.nodes === b.nodes &&
    a.island === b.island &&
    a.season === b.season &&
    a.collectibles === b.collectibles;

  mount() {
    super.mount();
    // DOM parity: a click outside a struck node resets its touch count.
    this.outsideClickHandler = (pointer: Phaser.Input.Pointer) => {
      for (const [id, objects] of this.nodes) {
        if (objects.touch === 0) continue;
        const box = this.boxOf(id);
        if (!box) continue;
        const inside =
          pointer.worldX >= box.x &&
          pointer.worldX <= box.x + box.width &&
          pointer.worldY >= box.y &&
          pointer.worldY <= box.y + box.height;
        if (!inside) this.resetTouch(id);
      }
    };
    this.scene.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      this.outsideClickHandler,
    );
  }

  private movingUnsubscribe?: () => void;

  async sync(slice: NodeSlice<N>) {
    this.movingUnsubscribe ??= this.bridge.landscapingMoving.subscribe(() =>
      this.applyMovingVisibility(),
    );
    const token = this.beginSync();
    this.collectAssets(slice);
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    // Only PLACED nodes render [Land.tsx maps entries with coordinates];
    // chest-stored ones have no x/y and were drawing at the origin.
    const placed = Object.fromEntries(
      Object.entries(slice.nodes).filter(
        ([, node]) =>
          (node as { x?: number }).x !== undefined &&
          (node as { y?: number }).y !== undefined,
      ),
    ) as NodeSlice<N>["nodes"];

    // Removals (run the hook with the node's last-known data + box).
    for (const [id, objects] of this.nodes) {
      if (placed[id]) continue;
      const prev = this.prevNodes[id];
      const box = prev ? this.boxFor(prev) : undefined;
      this.destroyNode(id, objects);
      if (box) this.onNodeRemoved(id, prev, box);
    }

    const biome = getCurrentBiome(slice.island);
    for (const [id, node] of Object.entries(placed)) {
      const objects = this.ensureNode(id);
      const box = this.boxFor(node);
      objects.zone.setPosition(box.x, box.y);
      objects.zone.setSize(box.width, box.height);
      objects.zone.setDepth(DEPTHS.ENTITY_BASE + box.y);
      objects.zone.setInteractive(); // refresh hit area after resize
      this.bridge.anchors.setAnchor(this.anchorId(id), box);
      this.renderNode(id, node, objects, {
        box,
        depth: DEPTHS.ENTITY_BASE + box.y,
        biome,
        season: slice.season,
      });
    }

    this.prevNodes = placed;
  }

  protected boxFor(node: N): NodeBox {
    const world = gridToWorld({ x: node.x ?? 0, y: node.y ?? 0 });
    return {
      x: world.x,
      y: world.y,
      width: this.tileDims.width * 16,
      height: this.tileDims.height * 16,
    };
  }

  protected boxOf(id: string): NodeBox | undefined {
    const node = this.prevNodes[id];
    return node ? this.boxFor(node) : undefined;
  }

  private ensureNode(id: string): NodeObjects {
    let objects = this.nodes.get(id);
    if (objects) return objects;

    const zone = this.scene.add.zone(0, 0, 16, 16).setOrigin(0, 0);
    makeClickable(this.scene, zone, () => this.onNodeClick(id), {
      onHoverChange: (hovered) => {
        if (!this.hoverKind) return;
        this.bridge.hover.set(
          hovered ? { type: "resource", kind: this.hoverKind, id } : null,
        );
      },
      // The node's primary art object.
      glow: () => this.glowTarget(id),
    });
    objects = { zone, extras: new Map(), touch: 0 };
    this.nodes.set(id, objects);
    return objects;
  }

  /** Main art helper (creates/reuses objects.art). */
  /** Art lit by the hover glow; subclasses with their own art maps override. */
  protected glowTarget(id: string): GlowTarget | undefined {
    return this.nodes.get(id)?.art;
  }

  protected setArt(objects: NodeObjects, ctx: RenderContext, spec: ArtSpec) {
    objects.art = applyArt(this.scene, objects.art, ctx.box, spec, ctx.depth);
    objects.art.setVisible(true);
  }

  /**
   * DOM stale-read touch: returns true when this click should FIRE the
   * collect (i.e. the pre-increment count already reached hits-1... the DOM
   * pattern reads the old value, so with threshold 2 the 3rd click fires).
   */
  protected bumpTouch(id: string, threshold = 2): boolean {
    const objects = this.nodes.get(id);
    if (!objects) return false;
    const stale = objects.touch;
    objects.touch += 1;
    return stale >= threshold;
  }

  /**
   * [Tree.tsx / Gold.tsx / Crimstone.tsx] boost feedback: when a node's
   * recovery timestamp changes externally (a boost re-stamps it), flash the
   * lightning icon at the top-right ~2s later if the node is recovered.
   */
  protected scheduleBoostFlash(id: string, isReady: () => boolean) {
    if (!this.bridge.ui.get().showAnimations) return;
    this.scene.time.delayedCall(1900, () => {
      if (!isReady()) return;
      const box = this.boxOf(id);
      if (!box) return;
      const texture = SUNNYSIDE.icons.lightning;
      if (!this.scene.textures.exists(texture)) return;
      const icon = this.scene.add
        .image(box.x + box.width, box.y + 2, texture)
        .setOrigin(1, 1)
        .setDepth(DEPTHS.ENTITY_BASE + box.y + 3)
        .setAlpha(0);
      nativeScale(icon);
      this.scene.tweens.add({
        targets: icon,
        alpha: 1,
        y: icon.y - 4,
        duration: 200,
        onComplete: () => {
          this.scene.time.delayedCall(300, () => {
            this.scene.tweens.add({
              targets: icon,
              alpha: 0,
              duration: 100,
              onComplete: () => icon.destroy(),
            });
          });
        },
      });
    });
  }

  /**
   * [resourceNodeAnimations.css resource-node-shake] 0.82s x-wobble played
   * when a replenishing node is harvested (fruit trees).
   */
  protected shakeNode(id: string) {
    if (!this.bridge.ui.get().showAnimations) return;
    const objects = this.nodes.get(id);
    const art = objects?.art;
    if (!art) return;
    const baseX = art.x;
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 820,
      onUpdate: (tween) => {
        if (!art.active) return;
        const progress = tween.getValue() ?? 0;
        const amp = progress < 0.15 || progress > 0.85 ? 0.5 : 1.2;
        art.setX(baseX + Math.sin(progress * Math.PI * 8) * amp);
      },
      onComplete: () => {
        if (art.active) art.setX(baseX);
      },
    });
  }

  protected resetTouch(id: string) {
    const objects = this.nodes.get(id);
    if (!objects) return;
    objects.touch = 0;
    objects.strike?.destroy();
    objects.strike = undefined;
    objects.bar?.destroy();
    objects.bar = undefined;
    // Restore the untouched look.
    const node = this.prevNodes[id];
    if (node) {
      const slice = this.bridge.select((state) => this.selector(state));
      this.renderNode(id, node, objects, {
        box: this.boxFor(node),
        depth: DEPTHS.ENTITY_BASE + this.boxFor(node).y,
        biome: getCurrentBiome(slice.island),
        season: slice.season,
      });
    }
  }

  /** DOM health bar: centred, 2 source px above the box floor overhang. */
  protected showHealthBar(objects: NodeObjects, box: NodeBox) {
    objects.bar ??= new ProgressBarSprite(this.scene, {
      x: box.x + box.width / 2 - 8,
      y: box.y + box.height - 2,
      type: "health",
      formatLength: "short",
      depth: DEPTHS.ENTITY_BASE + box.y + 1,
    });
    objects.bar.set(100 - (objects.touch / 3) * 100, 0);
  }

  protected game(): GameState {
    return this.bridge.select((state) => state.context.state);
  }

  private destroyNode(id: string, objects: NodeObjects) {
    objects.zone.destroy();
    objects.art?.destroy();
    objects.strike?.destroy();
    objects.bar?.destroy();
    objects.extras.forEach((extra) => extra.destroy());
    this.bridge.anchors.removeAnchor(this.anchorId(id));
    this.nodes.delete(id);
  }

  /** Placement name per rendererKey [LandscapingController placements()]. */
  private static MOVE_NAMES: Record<string, string> = {
    tree: "Tree",
    stone: "Stone Rock",
    iron: "Iron Rock",
    gold: "Gold Rock",
    crimstone: "Crimstone Rock",
    sunstone: "Sunstone Rock",
    oil: "Oil Reserve",
    lavaPit: "Lava Pit",
    beehive: "Beehive",
    fruitPatch: "Fruit Patch",
    flowerBed: "Flower Bed",
    ascensionCrystal: "Ascension Crystal",
  };

  /**
   * [MovableComponent] the landscaping drag preview IS the item — hide the
   * original while it is the selection so it doesn't sit duplicated at its
   * old position (same treatment as buildings/collectibles).
   */
  protected applyMovingVisibility() {
    const moving = this.bridge.landscapingMoving.get();
    const moveName = ResourceNodeRenderer.MOVE_NAMES[this.rendererKey];
    for (const [id, objects] of this.nodes) {
      const hidden =
        !!moving?.dragging && moving.name === moveName && moving.id === id;
      objects.art?.setVisible(!hidden);
      objects.strike?.setVisible(!hidden);
      objects.bar?.setVisible(!hidden);
      objects.extras.forEach((extra) =>
        (extra as { setVisible?: (v: boolean) => void }).setVisible?.(!hidden),
      );
    }
  }

  protected onDestroy() {
    this.movingUnsubscribe?.();
    if (this.outsideClickHandler) {
      this.scene.input.off(
        Phaser.Input.Events.POINTER_DOWN,
        this.outsideClickHandler,
      );
      this.outsideClickHandler = undefined;
    }
    for (const [id, objects] of this.nodes) {
      objects.zone.destroy();
      objects.art?.destroy();
      objects.strike?.destroy();
      objects.bar?.destroy();
      objects.extras.forEach((extra) => extra.destroy());
      this.bridge.anchors.removeAnchor(this.anchorId(id));
    }
    this.nodes.clear();
  }
}
