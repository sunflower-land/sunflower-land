import Decimal from "decimal.js-light";
import crystalArt from "assets/resources/ascension_crystal/ascension_crystal.webp";
import crystalDrop from "assets/resources/ascension_crystal/crystal_rock_drop.png";
import sunstoneSpark from "assets/resources/sunstone/sunstone_rock_spark.png";
import { SUNNYSIDE } from "assets/sunnyside";
import type { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { queueImage } from "../../core/assets";
import { playSound } from "../../core/sounds";
import { playYieldFloat } from "../../components/YieldFloat";
import {
  ResourceNodeRenderer,
  type NodeObjects,
  type NodeSlice,
  type RenderContext,
} from "./ResourceNodeRenderer";
import {
  playDropSheet,
  playSheet,
  queueSheet,
  type NodeBox,
  type SheetSpec,
} from "./lib";

/**
 * Ascension crystals [AscensionCrystal.tsx + useMinedCrystalGhosts.ts].
 * Single-use: mining deletes the record, so the node's removal IS the
 * depleted state — the removal hook plays the 3-second drop "ghost" at the
 * old position, with the +3 shard float.
 */

type CrystalNode = GameState["ascensionCrystals"][string];

const SHARDS_PER_MINE = 3;

const SPARK: SheetSpec = {
  url: sunstoneSpark,
  frameWidth: 48,
  frameHeight: 48,
  fps: 24,
  steps: 6,
  bottom: 0,
  right: -4,
};

const DROP: SheetSpec = {
  url: crystalDrop,
  frameWidth: 48,
  frameHeight: 48,
  fps: 20,
  steps: 10,
  bottom: -2,
  right: -8,
};

export class AscensionCrystalRenderer extends ResourceNodeRenderer<CrystalNode> {
  protected readonly rendererKey = "ascensionCrystal";
  protected readonly tileDims = { width: 2, height: 2 };
  protected readonly hoverKind = "ascensionCrystal" as const;

  protected selectNodes(game: GameState) {
    return game.ascensionCrystals;
  }

  protected collectAssets(_slice: NodeSlice<CrystalNode>) {
    queueImage(this.scene, crystalArt);
    queueSheet(this.scene, SPARK);
    queueSheet(this.scene, DROP);
    queueImage(this.scene, SUNNYSIDE.ui.emptyBar);
    queueImage(this.scene, ITEM_DETAILS["Ascension Shard"].image); // yield float
  }

  protected renderNode(
    _id: string,
    _node: CrystalNode,
    objects: NodeObjects,
    ctx: RenderContext,
  ) {
    this.setArt(objects, ctx, {
      texture: crystalArt,
      width: 27,
      bottom: 1,
      right: 2,
    });
    if (objects.touch > 0) {
      objects.strike = playSheet(
        this.scene,
        objects.strike,
        ctx.box,
        SPARK,
        ctx.depth + 1,
      );
      this.showHealthBar(objects, ctx.box);
    } else {
      objects.strike?.destroy();
      objects.strike = undefined;
    }
  }

  /** Mining ghost: play the drop sheet + shard float at the old position. */
  protected onNodeRemoved(
    id: string,
    _node: CrystalNode | undefined,
    box: NodeBox,
  ) {
    if (!this.bridge.ui.get().showAnimations) return;
    playDropSheet(this.scene, box, DROP, box.y + 100_000, 3000 - 400);
    playYieldFloat(this.scene, {
      x: box.x - 8,
      y: box.y - 2,
      amount: SHARDS_PER_MINE,
      icon: ITEM_DETAILS["Ascension Shard"].image,
      iconWidth: 10,
      depth: box.y + 100_000,
      durationMs: 3000,
    });
  }

  protected onNodeClick(id: string) {
    const game = this.game();
    const node = game.ascensionCrystals[id];
    if (!node) return;
    if (!(game.inventory["Gold Pickaxe"] ?? new Decimal(0)).gte(1)) return;

    this.bridge.selectItem("Gold Pickaxe");
    playSound("mining");

    const fire = this.bumpTouch(id);
    void this.sync(this.bridge.select((state) => this.selector(state)));
    if (!fire) return;

    this.bridge.dispatch("ascensionCrystal.mined", { index: id });
    playSound("mining_fall");
  }
}
