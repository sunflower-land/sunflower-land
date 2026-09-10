import Phaser from "phaser";
import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import type { GameState } from "features/game/types/game";
import { playMushroomSound } from "../../core/sounds";
import { DEPTHS } from "../../core/depths";
import { queueImage, queueSpritesheet } from "../../core/assets";
import { gridToWorld, WORLD_TILE } from "../../core/coordinates";
import { playYieldFloat } from "../../components/YieldFloat";
import {
  ResourceNodeRenderer,
  type NodeObjects,
  type NodeSlice,
  type RenderContext,
} from "./ResourceNodeRenderer";
import { ensureSheetAnim, type SheetSpec } from "./lib";

/**
 * Mushrooms [island/mushrooms/Mushroom.tsx]. A looping 5-frame idle sheet
 * with a random 0-15s pause between loops, always painted on top (the DOM's
 * z=99999), one click to pick.
 */

type MushroomNode = NonNullable<GameState["mushrooms"]>["mushrooms"][string];

const SHEETS: Record<string, string> = {
  "Wild Mushroom": SUNNYSIDE.resource.wild_mushroom_sheet,
  "Magic Mushroom": SUNNYSIDE.resource.magic_mushroom_sheet,
};

const sheetSpec = (name: string): SheetSpec => ({
  url: SHEETS[name] ?? SHEETS["Wild Mushroom"],
  frameWidth: 10,
  frameHeight: 12,
  fps: 10,
  steps: 5,
});

const IDLE_GAP_MAX_MS = 15_000;

export class MushroomRenderer extends ResourceNodeRenderer<MushroomNode> {
  protected readonly rendererKey = "mushroom";
  protected readonly tileDims = { width: 1, height: 1 };
  protected readonly hoverKind = null;

  private sprites = new Map<string, Phaser.GameObjects.Sprite>();

  protected glowTarget(id: string) {
    return this.sprites.get(id);
  }
  private timers = new Map<string, Phaser.Time.TimerEvent>();

  protected selectNodes(game: GameState) {
    return game.mushrooms?.mushrooms ?? {};
  }

  protected collectAssets(slice: NodeSlice<MushroomNode>) {
    for (const node of Object.values(slice.nodes)) {
      const spec = sheetSpec(node.name);
      queueSpritesheet(this.scene, spec.url, {
        frameWidth: spec.frameWidth,
        frameHeight: spec.frameHeight,
      });
      // The pick float shows the item icon; have it ready on click.
      const icon = ITEM_DETAILS[node.name]?.image;
      if (icon) queueImage(this.scene, icon);
    }
  }

  protected renderNode(
    id: string,
    node: MushroomNode,
    objects: NodeObjects,
    ctx: RenderContext,
  ) {
    const spec = sheetSpec(node.name);
    const animKey = ensureSheetAnim(this.scene, spec);

    let sprite = this.sprites.get(id);
    if (!sprite) {
      sprite = this.scene.add.sprite(0, 0, spec.url).setOrigin(0.5, 0.5);
      this.sprites.set(id, sprite);

      // Loop with a random idle gap [Mushroom.tsx getDelay].
      const scheduleReplay = () => {
        const timer = this.scene.time.delayedCall(
          Math.random() * IDLE_GAP_MAX_MS,
          () => {
            if (sprite?.active) sprite.play(animKey);
          },
        );
        this.timers.get(id)?.remove();
        this.timers.set(id, timer);
      };
      sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, scheduleReplay);
      sprite.play(animKey);
    }

    // Centred in the tile, 10px art, always on top (DOM z=99999).
    sprite.setScale(10 / spec.frameWidth);
    sprite.setPosition(
      ctx.box.x + ctx.box.width / 2,
      ctx.box.y + ctx.box.height / 2,
    );
    sprite.setDepth(DEPTHS.ALWAYS_ON_TOP);
  }

  protected onNodeClick(id: string) {
    this.pick(id);
  }

  /** The DOM pick path [Mushroom.tsx]. */
  private pick(id: string) {
    const game = this.game();
    const node = game.mushrooms?.mushrooms[id];
    if (!node) return;
    playMushroomSound();

    // Read the position and the inventory BEFORE dispatching: the node is
    // gone from state once the machine applies the pick, so the generic
    // YieldEventFloats path can't anchor it.
    const world = gridToWorld({ x: node.x, y: node.y });
    const before = game.inventory[node.name] ?? new Decimal(0);

    const newState = this.bridge.dispatch("mushroom.picked", { id });

    if (!this.bridge.ui.get().showAnimations) return;
    const gained = (
      newState.context.state.inventory[node.name] ?? new Decimal(0)
    ).minus(before);
    if (gained.lessThanOrEqualTo(0)) return;

    playYieldFloat(this.scene, {
      x: world.x + WORLD_TILE * 0.4,
      y: world.y - 2,
      amount: gained.toNumber(),
      icon: ITEM_DETAILS[node.name]?.image,
      iconWidth: 8,
      // The float band every other yield uses — clears the mushroom's own
      // always-on-top band AND the cloud/vignette layers above it.
      depth: world.y + 100_000,
      durationMs: 2000,
    });
  }

  protected onNodeRemoved(id: string) {
    this.timers.get(id)?.remove();
    this.timers.delete(id);
    this.sprites.get(id)?.destroy();
    this.sprites.delete(id);
  }

  protected onDestroy() {
    this.timers.forEach((timer) => timer.remove());
    this.timers.clear();
    this.sprites.forEach((sprite) => sprite.destroy());
    this.sprites.clear();
    super.onDestroy();
  }
}
