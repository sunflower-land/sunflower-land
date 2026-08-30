import type Phaser from "phaser";
import confetti from "canvas-confetti";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState, IslandType } from "features/game/types/game";
import {
  EXPANSION_ORIGINS,
  LAND_SIZE,
} from "features/game/expansion/lib/constants";
import { expansionRequirements } from "features/game/events/landExpansion/expandLand";
import { craftingRequirementsMet } from "features/game/lib/craftingRequirement";
import Decimal from "decimal.js-light";
import coinsIcon from "assets/icons/coins.webp";
import { ITEM_DETAILS } from "features/game/types/images";
import { getExpansionCoinCostWithVip } from "features/game/lib/vipAccess";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { getKeys } from "lib/object";
import { formatNumber } from "lib/utils/formatNumber";
import { translate } from "lib/i18n/translate";
import { queueImage, runLoader } from "../core/assets";
import { nativeScale } from "../core/pixelArt";
import { queueArt, resolveArtObject } from "../core/animated";
import { makeClickable } from "../core/clickable";
import { ProgressBarSprite } from "../components/ProgressBarSprite";
import { LabelChip } from "../components/LabelSprite";
import { gridToWorld, WORLD_TILE } from "../core/coordinates";
import { DEPTHS } from "../core/depths";
import { EntityRenderer } from "./EntityRenderer";

/**
 * The next piece of land [UpcomingExpansion.tsx]: the expand icon when idle
 * (with its requirement label chips), the pontoon + progress bar while
 * construction runs, the completed land + reveal marker when done — all
 * game-layer content, all Phaser. Clicks open React modals via the bridge.
 */

export const UPCOMING_EXPANSION_ANCHOR_ID = "upcoming-expansion";

type Slice = {
  landscaping: boolean;
  basicLand: number;
  islandType: IslandType;
  construction: GameState["expansionConstruction"];
  hasRequirements: boolean;
  showHelper: boolean;
};

const BLOCK_TILES = LAND_SIZE; // the 6x6 expansion block

export class UpcomingExpansionRenderer extends EntityRenderer<Slice> {
  private objects: Phaser.GameObjects.GameObject[] = [];
  private tweens: Phaser.Tweens.Tween[] = [];
  private readyTimer: Phaser.Time.TimerEvent | undefined;
  private pontoonBar: ProgressBarSprite | undefined;
  private pontoonTiming: { createdAt: number; readyAt: number } | undefined;
  private barTickMs = 0;
  private chips: LabelChip[] = [];

  selector(state: MachineState): Slice {
    const game = state.context.state;
    const basicLand = game.inventory["Basic Land"]?.toNumber() ?? 3;
    const { requirements } = expansionRequirements({
      game,
      now: Date.now(),
    });

    // ExpandIcon's pulsate helper (VIP coin discount folded in at render time
    // via getExpansionCoinCostWithVip; the pulsate gate ignores it).
    const canExpand = craftingRequirementsMet(game, requirements);
    const showHelper =
      canExpand &&
      (game.farmActivity["Tree Chopped"] ?? 0) >= 3 &&
      !!game.inventory["Basic Land"]?.lte(4);

    return {
      landscaping: state.matches("landscaping"),
      basicLand,
      islandType: game.island.type,
      construction: game.expansionConstruction,
      hasRequirements: !!requirements,
      showHelper,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.landscaping === b.landscaping &&
    a.basicLand === b.basicLand &&
    a.islandType === b.islandType &&
    a.construction === b.construction &&
    a.hasRequirements === b.hasRequirements &&
    a.showHelper === b.showHelper;

  async sync(slice: Slice) {
    const token = this.beginSync();
    // [Land.tsx:1302-1334] the DOM unmounts this during landscaping.
    if (slice.landscaping) {
      this.clear();
      return;
    }
    [
      SUNNYSIDE.icons.expand,
      SUNNYSIDE.land.pontoon,
      SUNNYSIDE.land.landComplete,
      SUNNYSIDE.icons.disc,
      SUNNYSIDE.icons.confirm,
      SUNNYSIDE.icons.cancel,
      SUNNYSIDE.icons.lock,
      SUNNYSIDE.ui.emptyBar,
      coinsIcon,
    ].forEach((texture) => queueArt(this.scene, texture));
    LabelChip.queueAssets(this.scene);

    // Requirement-chip item icons for the current expansion.
    const game = this.bridge.select((state) => state.context.state);
    const { requirements } = expansionRequirements({ game, now: Date.now() });
    for (const name of getKeys(requirements?.resources ?? {})) {
      queueImage(this.scene, ITEM_DETAILS[name].image);
    }
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    this.clear();

    const origin = EXPANSION_ORIGINS[slice.basicLand];
    if (!origin) return;

    // MapPlacement(origin.x - 3, origin.y + 3, 6, 6) — block top-left.
    const block = gridToWorld({
      x: origin.x - BLOCK_TILES / 2,
      y: origin.y + BLOCK_TILES / 2,
    });
    const blockSize = BLOCK_TILES * WORLD_TILE;

    this.bridge.anchors.setAnchor(UPCOMING_EXPANSION_ANCHOR_ID, {
      x: block.x,
      y: block.y,
      width: blockSize,
      height: blockSize,
    });

    if (slice.construction) {
      if (slice.construction.readyAt > Date.now()) {
        this.createPontoon(block, slice.construction);
      } else {
        this.createLandComplete(block, slice);
      }
      return;
    }

    const maxExpanded =
      slice.islandType === "basic"
        ? slice.basicLand + 1 > 9
        : slice.islandType === "spring"
          ? slice.basicLand + 1 > 16
          : false;

    if (slice.hasRequirements && !maxExpanded) {
      this.createExpandIcon(block, blockSize, slice.showHelper);
    }
  }

  /** Goblins building the land: pontoon art + a re-sync when it completes. */
  private createPontoon(
    block: { x: number; y: number },
    { createdAt, readyAt }: { createdAt: number; readyAt: number },
  ) {
    // The pontoon is an animated GIF in the DOM — play its converted strip.
    const pontoon =
      resolveArtObject(this.scene, undefined, SUNNYSIDE.land.pontoon) ??
      this.scene.add.image(0, 0, SUNNYSIDE.land.pontoon);
    pontoon
      .setPosition(block.x - 10, block.y + 20)
      .setOrigin(0, 0)
      .setDepth(DEPTHS.WATER_DECOR);
    nativeScale(pontoon, 129);
    makeClickable(this.scene, pontoon, () =>
      this.bridge.farmModal.open("pontoon"),
    );
    this.objects.push(pontoon);

    // In-scene construction progress [Pontoon.tsx: bar at (45, 82) in the block].
    this.pontoonTiming = { createdAt, readyAt };
    if (this.bridge.ui.get().showTimers) {
      this.pontoonBar = new ProgressBarSprite(this.scene, {
        x: block.x + 45,
        y: block.y + 82,
        formatLength: "medium",
        depth: DEPTHS.WATER_DECOR + 1,
      });
      this.updatePontoonBar();
    }

    // Flip to the reveal state the moment construction finishes.
    this.readyTimer = this.scene.time.delayedCall(
      Math.max(readyAt - Date.now(), 0) + 100,
      () => void this.sync(this.bridge.select((state) => this.selector(state))),
    );
  }

  private updatePontoonBar() {
    if (!this.pontoonBar || !this.pontoonTiming) return;
    const { createdAt, readyAt } = this.pontoonTiming;
    const now = Date.now();
    const total = (readyAt - createdAt) / 1000;
    const secondsLeft = Math.max((readyAt - now) / 1000, 0);
    this.pontoonBar.set(((total - secondsLeft) / total) * 100, secondsLeft);
  }

  update(_time: number, delta: number) {
    if (!this.pontoonBar) return;
    this.barTickMs += delta;
    if (this.barTickMs < 1000) return;
    this.barTickMs = 0;
    this.updatePontoonBar();
  }

  /** Construction done: completed land art + pulsating reveal marker. */
  private createLandComplete(block: { x: number; y: number }, slice: Slice) {
    const blockBottom = block.y + BLOCK_TILES * WORLD_TILE;

    const land = this.scene.add
      .image(block.x + 18, blockBottom - 12, SUNNYSIDE.land.landComplete)
      .setOrigin(0, 1)
      .setDepth(DEPTHS.WATER_DECOR);
    nativeScale(land, 66);
    makeClickable(this.scene, land, () => this.onReveal(slice));

    const disc = this.scene.add
      .image(block.x + 42, blockBottom - 36, SUNNYSIDE.icons.disc)
      .setOrigin(0, 1)
      .setDepth(DEPTHS.WATER_DECOR);
    nativeScale(disc, 20);

    const confirm = this.scene.add
      .image(block.x + 42 + 4, blockBottom - 36 - 5, SUNNYSIDE.icons.confirm)
      .setOrigin(0, 1)
      .setDepth(DEPTHS.WATER_DECOR);
    nativeScale(confirm, 12);

    this.tweens.push(
      this.scene.tweens.add({
        targets: [disc, confirm],
        scale: "*=1.1",
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      }),
    );

    this.objects.push(land, disc, confirm);
  }

  /** UpcomingExpansion's onReveal, verbatim behaviour. */
  private onReveal(slice: Slice) {
    this.bridge.dispatch("land.revealed");
    this.bridge.dispatch("SAVE");

    if (this.bridge.ui.get().showAnimations) confetti();

    const expansions = slice.basicLand + 1;
    if (expansions === 4) this.bridge.openModal("BETTY");
    if (expansions === 5) this.bridge.openModal("FIREPIT");
  }

  private createExpandIcon(
    block: { x: number; y: number },
    blockSize: number,
    showHelper: boolean,
  ) {
    // DOM centres icon + labels as a flex column; labels are game-layer
    // content, so they render here in Phaser too.
    const icon = this.scene.add
      .image(
        block.x + blockSize / 2,
        block.y + blockSize / 2 - 6,
        SUNNYSIDE.icons.expand,
      )
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTHS.WATER_DECOR);
    nativeScale(icon, 18);
    makeClickable(this.scene, icon, () =>
      this.bridge.farmModal.open("expansionRequirements"),
    );

    if (showHelper) {
      this.tweens.push(
        this.scene.tweens.add({
          targets: icon,
          scale: icon.scale * 1.2,
          duration: 500,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        }),
      );
    }

    this.objects.push(icon);
    this.createRequirementLabels(block, blockSize);
  }

  /**
   * [UpcomingExpansion.tsx ExpandIcon] requirement labels under the icon —
   * game-layer content, rendered as Phaser label chips.
   */
  private createRequirementLabels(
    block: { x: number; y: number },
    blockSize: number,
  ) {
    const machine = this.bridge.select((state) => state);
    const game = machine.context.state;
    const now = Date.now();
    const { requirements } = expansionRequirements({ game, now });
    if (!requirements) return;

    const centreX = block.x + blockSize / 2;
    let rowY = block.y + blockSize / 2 + 6;
    const depth = DEPTHS.WATER_DECOR + 1;

    const addRow = (chips: LabelChip[]) => {
      const gap = 2;
      const total =
        chips.reduce((sum, chip) => sum + chip.width, 0) +
        gap * (chips.length - 1);
      let x = centreX - total / 2;
      for (const chip of chips) {
        chip.setPosition(x, rowY);
        x += chip.width + gap;
      }
      this.chips.push(...chips);
      rowY += 10;
    };

    const showRequirements = !!game.inventory["Basic Land"]?.lte(5);

    if (showRequirements) {
      const coinCost = getExpansionCoinCostWithVip({
        coins: requirements.coins,
        game,
        now,
      });
      const chips: LabelChip[] = [];

      if (requirements.coins) {
        chips.push(
          new LabelChip(this.scene, {
            x: 0,
            y: 0,
            icon: coinsIcon,
            iconWidth: 6,
            text: `${formatNumber(coinCost)}`,
            type: game.coins >= coinCost ? "default" : "danger",
            depth,
          }),
        );
      }
      for (const name of getKeys(requirements.resources ?? {})) {
        if (name === "Gem") continue;
        const required = requirements.resources[name] ?? 0;
        const have = game.inventory[name] ?? new Decimal(0);
        chips.push(
          new LabelChip(this.scene, {
            x: 0,
            y: 0,
            icon: ITEM_DETAILS[name].image,
            iconWidth: 6,
            text: `${formatNumber(have)}/${formatNumber(required)}`,
            type: have.gte(required) ? "default" : "danger",
            depth,
          }),
        );
      }
      addRow(chips);

      const playerLevel = getAscensionLevel({
        experience: game.bumpkin?.experience ?? 0,
        ascensionLevel: game.island.ascensionLevel ?? 0,
      });
      if (!meetsLevelRequirement(playerLevel, requirements.bumpkinLevel)) {
        addRow([
          new LabelChip(this.scene, {
            x: 0,
            y: 0,
            icon: SUNNYSIDE.icons.lock,
            iconWidth: 6,
            text: `Lvl ${requirements.bumpkinLevel.level}`,
            depth,
          }),
        ]);
      }
      return;
    }

    const coinCost = getExpansionCoinCostWithVip({
      coins: requirements.coins,
      game,
      now,
    });
    const canExpand = craftingRequirementsMet(game, {
      ...requirements,
      coins: coinCost,
    });
    addRow([
      new LabelChip(this.scene, {
        x: 0,
        y: 0,
        icon: canExpand ? SUNNYSIDE.icons.confirm : SUNNYSIDE.icons.cancel,
        iconWidth: 6,
        text: translate("expand"),
        depth,
      }),
    ]);
  }

  private clear() {
    this.chips.forEach((chip) => chip.destroy());
    this.chips = [];
    this.pontoonBar?.destroy();
    this.pontoonBar = undefined;
    this.pontoonTiming = undefined;
    this.readyTimer?.remove();
    this.readyTimer = undefined;
    this.tweens.forEach((tween) => tween.remove());
    this.tweens = [];
    this.objects.forEach((object) => object.destroy());
    this.objects = [];
    this.bridge.anchors.removeAnchor(UPCOMING_EXPANSION_ANCHOR_ID);
  }

  protected onDestroy() {
    this.clear();
  }
}
