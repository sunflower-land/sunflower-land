import Decimal from "decimal.js-light";
import oilReserveFull from "assets/resources/oil/oil_reserve_full.webp";
import oilReserveHalf from "assets/resources/oil/oil_reserve_half.webp";
import oilReserveEmpty from "assets/resources/oil/oil_reserve_empty.webp";
import spurtingWell from "assets/resources/oil/spurting_well.webp";
import oilIcon from "assets/resources/oil.webp";
import type { GameState } from "features/game/types/game";
import {
  getOilBoostWindows,
  workAccruedAt,
} from "features/game/lib/boostWindows";
import {
  canDrillOilReserve,
  getOilDropAmount,
  getRequiredOilDrillAmount,
  isNextDrillHasBonus,
  OIL_RESERVE_RECOVERY_TIME,
} from "features/game/events/landExpansion/drillOilReserve";
import { queueImage } from "../../core/assets";
import { queueArt, resolveArtObject } from "../../core/animated";
import { playYieldFloat } from "../../components/YieldFloat";
import {
  ResourceNodeRenderer,
  type NodeObjects,
  type NodeSlice,
  type RenderContext,
} from "./ResourceNodeRenderer";

/**
 * Oil reserves [OilReserve.tsx + components]. Three static states keyed off
 * remaining WORK (full / half-recovered / empty), the spurting-well overlay
 * when the next drill carries the every-3rd bonus, and a single-click drill.
 */

type OilNode = GameState["oilReserves"][string];

export class OilReserveRenderer extends ResourceNodeRenderer<OilNode> {
  protected readonly rendererKey = "oil";
  protected readonly tileDims = { width: 2, height: 2 };
  protected readonly hoverKind = "oil" as const;

  private recoveryTimers = new Map<string, () => void>();

  protected selectNodes(game: GameState) {
    return game.oilReserves;
  }

  protected collectAssets(_slice: NodeSlice<OilNode>) {
    [oilReserveFull, oilReserveHalf, oilReserveEmpty, oilIcon].forEach((url) =>
      queueImage(this.scene, url),
    );
    queueArt(this.scene, spurtingWell);
  }

  private workLeftSeconds(node: OilNode, game: GameState, now: number) {
    const { drilledAt, baseDurationMs } = node.oil;
    if (baseDurationMs !== undefined) {
      const done = workAccruedAt({
        startedAt: drilledAt,
        at: now,
        windows: getOilBoostWindows(game),
      });
      return Math.max((baseDurationMs - done) / 1000, 0);
    }
    return Math.max(
      (drilledAt + OIL_RESERVE_RECOVERY_TIME * 1000 - now) / 1000,
      0,
    );
  }

  protected renderNode(
    id: string,
    node: OilNode,
    objects: NodeObjects,
    ctx: RenderContext,
  ) {
    this.recoveryTimers.get(id)?.();
    this.recoveryTimers.delete(id);

    const game = this.game();
    const now = Date.now();
    const workLeft = this.workLeftSeconds(node, game, now);
    const halfThreshold =
      node.oil.baseDurationMs !== undefined
        ? node.oil.baseDurationMs / 2000
        : OIL_RESERVE_RECOVERY_TIME / 2;

    const spurt = objects.extras.get("spurt");
    spurt?.destroy();
    objects.extras.delete("spurt");

    if (workLeft <= 0) {
      this.setArt(objects, ctx, {
        texture: oilReserveFull,
        width: 30,
        centered: true,
      });
      if (isNextDrillHasBonus(node)) {
        // The spurting gusher is an animated webp in the DOM's <img>; play
        // its converted strip here [core/animated.ts].
        const overlay = resolveArtObject(this.scene, undefined, spurtingWell);
        if (overlay) {
          overlay.setOrigin(0, 0);
          overlay.setPosition(
            ctx.box.x + 1,
            ctx.box.y + ctx.box.height - 8.5 - 38,
          );
          overlay.setDepth(ctx.depth + 1);
          overlay.setScale(29 / overlay.width);
          objects.extras.set("spurt", overlay);
        }
      }
      return;
    }

    this.setArt(objects, ctx, {
      texture: workLeft <= halfThreshold ? oilReserveHalf : oilReserveEmpty,
      width: 30,
      centered: true,
      alpha: 0.5,
    });

    // Re-render at the next state boundary (empty->half or half->full).
    const nextBoundarySeconds =
      workLeft > halfThreshold ? workLeft - halfThreshold : workLeft;
    const timer = this.scene.time.delayedCall(
      nextBoundarySeconds * 1000 + 100,
      () => void this.sync(this.bridge.select((state) => this.selector(state))),
    );
    this.recoveryTimers.set(id, () => timer.remove());
  }

  protected onNodeClick(id: string) {
    const game = this.game();
    const node = game.oilReserves[id];
    if (!node) return;

    const now = Date.now();
    if (!canDrillOilReserve(node, game, now)) return;
    const drills = game.inventory["Oil Drill"] ?? new Decimal(0);
    if (drills.lt(getRequiredOilDrillAmount(game).amount)) return;

    const amount = Number(getOilDropAmount(game, node).amount);
    this.bridge.dispatch({ type: "oilReserve.drilled", id });

    if (this.bridge.ui.get().showAnimations) {
      const box = this.boxOf(id) ?? this.boxFor(node);
      playYieldFloat(this.scene, {
        x: box.x + 12,
        y: box.y - 2,
        amount: Number(amount),
        icon: oilIcon,
        iconWidth: 7,
        depth: box.y + 100_000,
        durationMs: 2000,
      });
    }
  }

  protected onDestroy() {
    this.recoveryTimers.forEach((cancel) => cancel());
    this.recoveryTimers.clear();
    super.onDestroy();
  }
}
