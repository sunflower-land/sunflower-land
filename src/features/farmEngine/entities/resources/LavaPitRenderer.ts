import lavaPitAnimation from "assets/resources/lava/lava_pit_animation.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import type { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { queueImage } from "../../core/assets";
import { queueArt } from "../../core/animated";
import { ProgressBarSprite } from "../../components/ProgressBarSprite";
import {
  ResourceNodeRenderer,
  type NodeObjects,
  type NodeSlice,
  type RenderContext,
} from "./ResourceNodeRenderer";

/**
 * Lava pits [lavaPit/LavaPit.tsx]. Idle / running (progress bar) / ready
 * (alert icon) states; every click opens the React modal, which owns the
 * start/collect events.
 *
 * PARITY GAP: the running art is an animated webp — static first frame in
 * Phaser until spritesheet art exists.
 */

type LavaPitNode = GameState["lavaPits"][string];

export class LavaPitRenderer extends ResourceNodeRenderer<LavaPitNode> {
  protected readonly rendererKey = "lavaPit";
  protected readonly tileDims = { width: 2, height: 2 };
  protected readonly hoverKind = null;

  private bars = new Map<string, ProgressBarSprite>();
  private barTickMs = 0;

  protected selectNodes(game: GameState) {
    return game.lavaPits;
  }

  protected collectAssets(_slice: NodeSlice<LavaPitNode>) {
    queueArt(this.scene, lavaPitAnimation);
    queueImage(this.scene, ITEM_DETAILS["Lava Pit"].image);
    queueImage(this.scene, SUNNYSIDE.icons.expression_alerted);
    queueImage(this.scene, SUNNYSIDE.ui.emptyBar);
  }

  protected renderNode(
    id: string,
    node: LavaPitNode,
    objects: NodeObjects,
    ctx: RenderContext,
  ) {
    const now = Date.now();
    const secondsToReady = ((node?.readyAt ?? 0) - now) / 1000;
    const running = secondsToReady > 0;
    const ready = !!node?.readyAt && secondsToReady <= 0 && !node?.collectedAt;

    this.setArt(objects, ctx, {
      texture: running ? lavaPitAnimation : ITEM_DETAILS["Lava Pit"].image,
      width: 36,
      top: 0,
      left: 0,
    });

    const alert = objects.extras.get("alert");
    alert?.destroy();
    objects.extras.delete("alert");
    if (ready) {
      const icon = this.scene.add
        .image(
          ctx.box.x + ctx.box.width / 2,
          ctx.box.y - 2,
          SUNNYSIDE.icons.expression_alerted,
        )
        .setOrigin(0.5, 1)
        .setDepth(ctx.depth + 1);
      icon.setScale(4 / icon.width);
      objects.extras.set("alert", icon);
    }

    const bar = this.bars.get(id);
    if (running && this.bridge.ui.get().showTimers) {
      // [LavaPit.tsx] centred bar near the pit's base.
      const barX = ctx.box.x - 2 + (36 - 15) / 2;
      const barY = ctx.box.y + ctx.box.height - 12 / 2.625 - 7;
      const sprite =
        bar ??
        new ProgressBarSprite(this.scene, {
          x: barX,
          y: barY,
          formatLength: secondsToReady <= 24 * 60 * 60 ? "short" : "medium",
          depth: ctx.depth + 1,
        });
      sprite.setPosition(barX, barY);
      this.bars.set(id, sprite);
      this.updateBar(id, node);
    } else {
      bar?.destroy();
      this.bars.delete(id);
    }
  }

  private updateBar(id: string, node: LavaPitNode) {
    const bar = this.bars.get(id);
    if (!bar || !node?.readyAt) return;
    const now = Date.now();
    const secondsToReady = Math.max((node.readyAt - now) / 1000, 0);
    const total = Math.max((node.readyAt - (node.startedAt ?? 0)) / 1000, 0);
    const percentage =
      total > 0 ? Math.min(((total - secondsToReady) / total) * 100, 100) : 0;
    bar.set(percentage, secondsToReady);
    if (secondsToReady <= 0) {
      void this.sync(this.bridge.select((state) => this.selector(state)));
    }
  }

  update(_time: number, delta: number) {
    if (this.bars.size === 0) return;
    this.barTickMs += delta;
    if (this.barTickMs < 1000) return;
    this.barTickMs = 0;
    const game = this.game();
    for (const id of this.bars.keys()) {
      this.updateBar(id, game.lavaPits[id]);
    }
  }

  protected onNodeClick(id: string) {
    this.bridge.farmModal.open("lavaPit", id);
  }

  protected onDestroy() {
    this.bars.forEach((bar) => bar.destroy());
    this.bars.clear();
    super.onDestroy();
  }
}
