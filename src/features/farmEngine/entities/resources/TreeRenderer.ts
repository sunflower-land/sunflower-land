import Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState, InventoryItemName } from "features/game/types/game";
import type { FarmActivityName } from "features/game/types/farmActivity";
import { KNOWN_IDS } from "features/game/types";
import {
  getRequiredAxeAmount,
  getTreeReadyAt,
  getWoodDropAmount,
  getReward,
  TUTORIAL_WOOD_NATIVE_BONUS,
} from "features/game/events/landExpansion/chop";
import { getTutorialNudge } from "features/island/lib/tutorialNudge";
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
import { nativeScale } from "../../core/pixelArt";
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

/** [Tree.tsx activityCount] the per-tree-type counter behind the PRNG rolls. */
const choppedCounter = (game: GameState, node: TreeNode) => {
  const name = treeName(node);
  const key =
    `${name === "Tree" ? "Basic Tree" : name} Chopped` as FarmActivityName;
  return game.farmActivity[key] ?? 0;
};

/**
 * The node slice plus the narrow inputs of the tutorial chop helper
 * [Tree.tsx showHelper]: the chop count for the first-three walk, and, on a
 * basic island only, what getTutorialNudge reads. Off the tutorial they stay
 * undefined so established farms never re-sync on them.
 */
type TreeSlice = NodeSlice<TreeNode> & {
  treesChopped: number;
  inventory?: GameState["inventory"];
  farmActivity?: GameState["farmActivity"];
  crops?: GameState["crops"];
  experience?: number;
  deliveriesFulfilled?: number;
  expansionConstruction?: GameState["expansionConstruction"];
};

const HELPER_KEY = "helper";

export class TreeRenderer extends ResourceNodeRenderer<TreeNode> {
  protected readonly rendererKey = "tree";
  protected readonly tileDims = { width: 2, height: 2 };
  protected readonly hoverKind = "tree" as const;

  private recoveryTimers = new Map<string, () => void>();
  /** Farm-wide helper inputs, resolved once per game state, not per tree. */
  private helperCache:
    | { game: GameState; treesChopped: number; chopNudge: boolean }
    | undefined;

  protected selectNodes(game: GameState) {
    return game.trees;
  }

  selector(state: MachineState): TreeSlice {
    const game = state.context.state;
    const treesChopped = game.farmActivity["Tree Chopped"] ?? 0;
    const tutorialIsland = game.island.type === "basic";
    return {
      ...super.selector(state),
      treesChopped,
      inventory:
        tutorialIsland || treesChopped < 3 ? game.inventory : undefined,
      farmActivity: tutorialIsland ? game.farmActivity : undefined,
      crops: tutorialIsland ? game.crops : undefined,
      experience: tutorialIsland ? game.bumpkin.experience : undefined,
      deliveriesFulfilled: tutorialIsland
        ? game.delivery.fulfilledCount
        : undefined,
      expansionConstruction: tutorialIsland
        ? game.expansionConstruction
        : undefined,
    };
  }

  equals = (a: NodeSlice<TreeNode>, b: NodeSlice<TreeNode>) => {
    const prev = a as TreeSlice;
    const next = b as TreeSlice;
    return (
      prev.nodes === next.nodes &&
      prev.island === next.island &&
      prev.season === next.season &&
      prev.collectibles === next.collectibles &&
      prev.treesChopped === next.treesChopped &&
      prev.inventory === next.inventory &&
      prev.farmActivity === next.farmActivity &&
      prev.crops === next.crops &&
      prev.experience === next.experience &&
      prev.deliveriesFulfilled === next.deliveriesFulfilled &&
      prev.expansionConstruction === next.expansionConstruction
    );
  };

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
    queueImage(this.scene, SUNNYSIDE.icons.chop_icon); // tutorial helper
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

  /** Windowed recovery; a tree with no marker reads as the raw time. */
  private readyAt(node: TreeNode, game: GameState): number {
    return getTreeReadyAt(node, game);
  }

  /** Tool gate [Tree.tsx HasTool / chop.ts getRequiredAxeAmount]. */
  private hasTool(game: GameState, id: string): boolean {
    const { amount: required } = getRequiredAxeAmount(game.inventory, game, id);
    return required.lte(0) || !!game.inventory.Axe?.gte(required);
  }

  /**
   * [Tree.tsx showHelper] the first-three walk steps tree by tree; the
   * post-delivery chop-trees nudge lights every standing tree.
   */
  private showHelper(id: string): boolean {
    const game = this.game();
    if (this.helperCache?.game !== game) {
      this.helperCache = {
        game,
        treesChopped: game.farmActivity["Tree Chopped"] ?? 0,
        chopNudge: getTutorialNudge(game) === "chop-trees",
      };
    }
    const { treesChopped, chopNudge } = this.helperCache;
    return (
      this.hasTool(game, id) &&
      ((treesChopped < 3 && treesChopped + 1 === Number(id)) || chopNudge)
    );
  }

  /**
   * [RecoveredTree.tsx] the pulsating chop icon: 18px, right -4, top -4 of
   * the 2x2 box.
   */
  private syncHelper(
    id: string,
    objects: NodeObjects,
    ctx: RenderContext,
    recovered: boolean,
  ) {
    const texture = SUNNYSIDE.icons.chop_icon;
    const existing = objects.extras.get(HELPER_KEY) as
      | Phaser.GameObjects.Image
      | undefined;
    const wanted =
      recovered && this.showHelper(id) && this.scene.textures.exists(texture);

    if (!wanted) {
      existing?.destroy();
      objects.extras.delete(HELPER_KEY);
      return;
    }

    const x = ctx.box.x + ctx.box.width + 4 - 18;
    const y = ctx.box.y - 4;
    if (existing) {
      existing.setPosition(x, y).setDepth(ctx.depth + 2);
      return;
    }

    const icon = this.scene.add
      .image(x, y, texture)
      .setOrigin(0, 0)
      .setDepth(ctx.depth + 2);
    nativeScale(icon, 18);
    if (this.bridge.ui.get().showAnimations) {
      this.scene.tweens.add({
        targets: icon,
        scale: icon.scale * 1.15,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
      icon.once(Phaser.GameObjects.Events.DESTROY, () =>
        this.scene.tweens.killTweensOf(icon),
      );
    }
    objects.extras.set(HELPER_KEY, icon);
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

    this.syncHelper(id, objects, ctx, !chopped);

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
    const size = TREE_SIZE_VARIANTS(ctx.biome, ctx.season, name as never);
    // [Resource.tsx treeStyle] the img sits in flow from the tile top,
    // raised by (size.height - 32). Art whose canvas is taller than its
    // listed size (the 26x35 ancient tree vs 26x34) therefore hangs that much
    // below the box, as it does in the DOM.
    this.setArt(objects, ctx, {
      texture: TREE_VARIANTS(ctx.biome, ctx.season, name as never),
      width: size.width,
      top: 32 - size.height,
      left: (32 - size.width) / 2,
    });
  }

  protected onNodeClick(id: string) {
    const machine = this.bridge.select((state) => state);
    const game = machine.context.state;
    const node = game.trees[id];
    if (!node) return;

    const now = Date.now();
    // A stump or a missing axe can't chop: show the timer / "Craft axe".
    if (now <= this.readyAt(node, game) || !this.hasTool(game, id)) {
      this.showIdleClickPopover(id);
      return;
    }

    if (!isCollectibleBuilt({ name: "Foreman Beaver", game })) {
      this.bridge.selectItem("Axe");
    }

    playSound("chop");
    this.impact(id, "wood");
    const instaChop = !!game.bumpkin?.skills["Insta-Chop"];
    const fire = instaChop || this.bumpTouch(id);

    // Re-render to show the shake sheet + health bar.
    void this.sync(this.bridge.select((state) => this.selector(state)));

    if (!fire) return;

    const name = treeName(node);
    const counter = choppedCounter(game, node);
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
    const counter = choppedCounter(game, node);
    const woodAmount =
      node.wood.amount ??
      getWoodDropAmount({
        game,
        tree: node,
        farmId: machine.context.farmId,
        itemId: KNOWN_IDS[name as InventoryItemName],
        counter,
        now: Date.now(),
      }).amount;

    const newState = this.bridge.dispatch("timber.chopped", {
      index: id,
      item: "Axe",
    });
    playSound("tree_fall");
    this.impact(id, "leaf", "break");

    // [Tree.tsx] tutorial popups open as soon as the chop lands. The three
    // starting trees are exactly the first expansion's cost.
    const treesChopped =
      newState.context.state.farmActivity["Tree Chopped"] ?? 0;
    if (treesChopped === 3) {
      this.bridge.openModal("EXPAND_LAND");
    }
    // The first scripted +1 wood is the cue to explain the native bonus.
    const basicTreesChopped =
      newState.context.state.farmActivity["Basic Tree Chopped"] ?? 0;
    if (basicTreesChopped === TUTORIAL_WOOD_NATIVE_BONUS.indexOf(true) + 1) {
      this.bridge.openModal("NATIVE_BONUS");
    }

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

    if (treesChopped === 1) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:TreeChopped:Completed",
      });
    }

    this.resetTouch(id);
  }
}
