import { SUNNYSIDE } from "assets/sunnyside";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { KNOWN_IDS } from "features/game/types";
import { TREE_RECOVERY_TIME } from "features/game/lib/constants";
import {
  getTreeBoostWindows,
  computeReadyAt,
} from "features/game/lib/boostWindows";
import {
  getRequiredAxeAmount,
  getWoodDropAmount,
  getReward,
} from "features/game/events/landExpansion/chop";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isSeasonedPlayer } from "features/game/lib/seasonedPlayer";
import {
  CHOPPED_SHEET_VARIANTS,
  STUMP_VARIANTS,
  TREE_SHAKE_SHEET_VARIANTS,
  TREE_SIZE_VARIANTS,
  TREE_VARIANTS,
} from "features/island/lib/alternateArt";
import { setPrecision } from "lib/utils/formatNumber";
import { gameAnalytics } from "lib/gameAnalytics";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { queueImage } from "../../core/assets";
import { DEPTHS } from "../../core/depths";
import { playSound } from "../../core/sounds";
import { playYieldFloat } from "../../components/YieldFloat";
import {
  ResourceNodeRenderer,
  type NodeObjects,
  type NodeSlice,
  type RenderContext,
} from "./ResourceNodeRenderer";
import { playDropSheet, playSheet, queueSheet, type SheetSpec } from "./lib";

/**
 * Trees [resources/tree/Tree.tsx + components]. Three shakes to chop (stale
 * touch reads — 3rd click fires), Insta-Chop skips the gate, chest-reward
 * captcha for non-seasoned players, stump + recovery while chopped.
 *
 * DEFERRED: the ready lightning flash on recovery (Transition polish).
 */

type TreeNode = GameState["trees"][string];

const treeName = (node: TreeNode) => node.name ?? "Tree";

export class TreeRenderer extends ResourceNodeRenderer<TreeNode> {
  protected readonly rendererKey = "tree";
  protected readonly tileDims = { width: 2, height: 2 };
  protected readonly hoverKind = "tree" as const;

  private recoveryTimers = new Map<string, () => void>();

  protected selectNodes(game: GameState) {
    return game.trees;
  }

  protected collectAssets(slice: NodeSlice<TreeNode>) {
    const biome = this.biomeOf(slice);
    for (const node of Object.values(slice.nodes)) {
      const name = treeName(node);
      queueImage(this.scene, TREE_VARIANTS(biome, slice.season, name));
      queueSheet(this.scene, this.shakeSheet(slice, name));
      queueImage(this.scene, STUMP_VARIANTS[biome][slice.season]);
    }
    queueSheet(this.scene, this.choppedSheet(slice.season));
    queueImage(this.scene, SUNNYSIDE.ui.emptyBar);
    queueImage(this.scene, SUNNYSIDE.resource.wood); // chop yield float
  }

  private biomeOf(slice: NodeSlice<TreeNode>) {
    return getCurrentBiome(slice.island);
  }

  private shakeSheet(slice: NodeSlice<TreeNode>, name: string): SheetSpec {
    return {
      url: TREE_SHAKE_SHEET_VARIANTS(
        this.biomeOf(slice),
        slice.season,
        name as never,
      ),
      frameWidth: 64,
      frameHeight: 48,
      fps: 24,
      steps: 7,
      bottom: 0,
      right: -4,
    };
  }

  private choppedSheet(season: NodeSlice<TreeNode>["season"]): SheetSpec {
    return {
      url: CHOPPED_SHEET_VARIANTS[season],
      frameWidth: 80,
      frameHeight: 48,
      fps: 20,
      steps: 11,
      bottom: 4,
      right: -6,
    };
  }

  private readyAt(node: TreeNode, game: GameState): number {
    const { choppedAt, baseDurationMs } = node.wood;
    return baseDurationMs !== undefined
      ? computeReadyAt({
          startedAt: choppedAt,
          baseDurationMs,
          windows: getTreeBoostWindows(game),
        })
      : choppedAt + TREE_RECOVERY_TIME * 1000;
  }

  protected renderNode(
    id: string,
    node: TreeNode,
    objects: NodeObjects,
    ctx: RenderContext,
  ) {
    // Boost feedback: an external choppedAt change flashes lightning once
    // the tree shows recovered [Tree.tsx isAnimationRunning].
    const prev = this.prevNodes[id];
    if (prev && prev.wood.choppedAt !== node.wood.choppedAt) {
      this.scheduleBoostFlash(id, () => {
        const fresh = this.game().trees[id];
        return !!fresh && Date.now() > this.readyAt(fresh, this.game());
      });
    }
    this.recoveryTimers.get(id)?.();
    this.recoveryTimers.delete(id);

    const game = this.game();
    const now = Date.now();
    const readyAt = this.readyAt(node, game);
    const chopped = now <= readyAt;
    const name = treeName(node);

    if (chopped) {
      objects.strike?.destroy();
      objects.strike = undefined;
      objects.bar?.destroy();
      objects.bar = undefined;
      this.setArt(objects, ctx, {
        texture: STUMP_VARIANTS[ctx.biome][ctx.season],
        width: 16,
        bottom: 5,
        left: 8,
        alpha: 0.5,
      });
      // Re-render the moment recovery completes.
      const timer = this.scene.time.delayedCall(
        Math.max(readyAt - now, 0) + 100,
        () =>
          void this.sync(this.bridge.select((state) => this.selector(state))),
      );
      this.recoveryTimers.set(id, () => timer.remove());
      return;
    }

    if (objects.touch > 0) {
      // Shaking: the sheet replaces the static art.
      objects.art?.setVisible(false);
      objects.strike = playSheet(
        this.scene,
        objects.strike,
        ctx.box,
        this.shakeSheet(
          { ...this.bridge.select((s) => this.selector(s)) },
          name,
        ),
        ctx.depth + 1,
      );
      this.showHealthBar(objects, ctx.box);
      return;
    }

    objects.strike?.destroy();
    objects.strike = undefined;
    const size = TREE_SIZE_VARIANTS(ctx.biome, name as never);
    // [Resource.tsx treeStyle] relative-flow math lands the art bottom flush
    // with the box bottom — matching the shake sheet, so tapping doesn't
    // shift the tree.
    this.setArt(objects, ctx, {
      texture: TREE_VARIANTS(ctx.biome, ctx.season, name as never),
      width: size.width,
      bottom: 0,
      left: (32 - size.width) / 2,
    });
  }

  protected onNodeClick(id: string) {
    const machine = this.bridge.select((state) => state);
    const game = machine.context.state;
    const node = game.trees[id];
    if (!node) return;

    const now = Date.now();
    if (now <= this.readyAt(node, game)) return; // stump — nothing to do

    // Tool gate [chop.ts getRequiredAxeAmount].
    const { amount: required } = getRequiredAxeAmount(game.inventory, game, id);
    const hasTool = required.lte(0) || !!game.inventory.Axe?.gte(required);
    if (!hasTool) return;

    if (!isCollectibleBuilt({ name: "Foreman Beaver", game })) {
      this.bridge.selectItem("Axe");
    }

    playSound("chop");
    const instaChop = !!game.bumpkin?.skills["Insta-Chop"];
    const fire = instaChop || this.bumpTouch(id);

    // Re-render to show the shake sheet + health bar.
    void this.sync(this.bridge.select((state) => this.selector(state)));

    if (!fire) return;

    const name = treeName(node);
    const counter = game.farmActivity["Tree Chopped"] ?? 0;
    const expectedReward =
      node.wood.reward ??
      getReward({
        skills: game.bumpkin?.skills ?? {},
        farmId: machine.context.farmId,
        itemId: KNOWN_IDS[name as InventoryItemName],
        counter,
      }).reward;

    if (
      expectedReward &&
      !isSeasonedPlayer({ game, verified: machine.context.verified, now })
    ) {
      this.bridge.chestReward.set({
        anchorId: this.anchorId(id),
        reward: expectedReward,
        collectedItem: "Wood",
        onResult: (success) => {
          this.bridge.chestReward.set(null);
          if (success) this.chop(id);
        },
      });
      this.resetTouch(id);
      return;
    }

    this.chop(id);
  }

  /** Port of Tree.tsx's chop(). */
  private chop(id: string) {
    const machine = this.bridge.select((state) => state);
    const game = machine.context.state;
    const node = game.trees[id];
    if (!node) return;

    const name = treeName(node);
    const counter = game.farmActivity["Tree Chopped"] ?? 0;
    const woodAmount =
      node.wood.amount ??
      getWoodDropAmount({
        game,
        tree: node,
        farmId: machine.context.farmId,
        itemId: KNOWN_IDS[name as InventoryItemName],
        counter,
      }).amount;

    const newState = this.bridge.dispatch("timber.chopped", {
      index: id,
      item: "Axe",
    });
    playSound("tree_fall");

    const { showAnimations } = this.bridge.ui.get();
    if (showAnimations) {
      const slice = this.bridge.select((state) => this.selector(state));
      const box = this.boxOf(id) ?? this.boxFor(node);
      playDropSheet(
        this.scene,
        box,
        this.choppedSheet(slice.season),
        DEPTHS.ENTITY_BASE + box.y + 2,
      );
      playYieldFloat(this.scene, {
        x: box.x - 8,
        y: box.y - 2,
        amount: setPrecision(woodAmount, 2).toNumber(),
        icon: SUNNYSIDE.resource.wood,
        iconWidth: 11,
        depth: box.y + 100_000,
        durationMs: 3000,
      });
    }

    if (newState.context.state.farmActivity?.["Tree Chopped"] === 1) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:TreeChopped:Completed",
      });
    }

    this.resetTouch(id);
  }
}
