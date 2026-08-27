import Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import type { GameState } from "features/game/types/game";
import { playMushroomSound } from "../../core/sounds";
import { DEPTHS } from "../../core/depths";
import { queueSpritesheet } from "../../core/assets";
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
    const game = this.game();
    if (!game.mushrooms?.mushrooms[id]) return;
    playMushroomSound();
    this.bridge.dispatch("mushroom.picked", { id });
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
