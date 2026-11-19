import type Phaser from "phaser";
import shopDisc from "assets/icons/shop_disc.png";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type {
  AnimalBuildingKey,
  GameState,
  IslandType,
} from "features/game/types/game";
import type { AnimalBuildingType } from "features/game/types/animals";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { canApplyMud } from "features/pigpen/lib/applyMud";
import {
  getCoveredAnimalTypes,
  getFeedAllTargets,
} from "features/game/events/landExpansion/feedAllAnimals";
import { queueImage, runLoader } from "../../core/assets";
import { makeClickable } from "../../core/clickable";
import { DEPTHS } from "../../core/depths";
import { fitWidth } from "../../core/pixelArt";
import { playSound } from "../../core/sounds";
import { interiorRoomRect } from "../../layers/InteriorBackdropLayer";
import { EntityRenderer } from "../EntityRenderer";

/**
 * The animal house's in-room controls: the feeder machine, Feed All, the
 * pigpen's Apply Mud, and the shop / quick-sell / upgrade discs
 * [BarnInside.tsx + HenHouseInside.tsx + PigpenInside.tsx].
 *
 * These sit ON the room — they pan and zoom with it — so by the engine's
 * boundary rule they're Phaser. They used to be DOM elements in
 * overlay/AnimalHouseUI.tsx positioned off the `interior-room` anchor, which
 * is exactly the "whole in-world component hosted in the overlay" the
 * architecture guide rules out.
 *
 * What stays React is the UI half: the buy/sell modal, the upgrade modal, the
 * feeder-machine modal and the bounty-exchange HUD. Clicks here open those
 * through `bridge.animalHouseModal`, the same handshake every other in-world
 * click uses.
 */

type Slice = {
  islandType: IslandType;
  level: number;
  /** Changes whenever the animals do, so Feed All re-evaluates. */
  animals: GameState["henHouse"]["animals"];
  game: GameState;
};

const DISC = 18;
const MACHINE = 30;
const GRINDER = 18;
const LIGHTNING = 8;
const SKULL = 7;
/** The quick-sell disc's right edge sits this far left of the shop disc's. */
const SELL_DISC_GAP = 19;

/**
 * The DOM laid this chrome out in CSS px against a SCREEN rect; here it is
 * world px against the room rect, so every raw CSS offset from AnimalHouseUI
 * divides by PIXEL_SCALE. (Sizes written as `PIXEL_SCALE * n` there were
 * already n world px and carry over unchanged.)
 */
const css = (px: number) => px / PIXEL_SCALE;

/** Discs are inset this far from the room's top corners [AnimalHouseUI]. */
const DISC_INSET = css(18);
/** Feed All sits to the right of the feeder machine [AnimalHouseUI]. */
const FEED_ALL_OFFSET = { x: css(58), y: css(11) };
/** [ApplyMudButton.tsx] disc w18, Mud icon w10, lightning corner badge w6. */
const MUD_ICON = 10;
const MUD_LIGHTNING = 6;
/** The badge overhangs the disc's top-right corner (`-top-0.5 -right-0.5`). */
const MUD_BADGE_OVERHANG = css(2);

const BUILDING_NAME: Record<AnimalBuildingKey, AnimalBuildingType> = {
  barn: "Barn",
  henHouse: "Hen House",
  pigpen: "Pigpen",
};

/** The grinder badge overhangs the machine's right edge [FeederMachine]. */
const GRINDER_OVERHANG = css(16);

/** Above the room art and the animals. */
const CONTROL_DEPTH = DEPTHS.ALWAYS_ON_TOP + 50;

export class AnimalHouseControls extends EntityRenderer<Slice> {
  private objects: Phaser.GameObjects.Image[] = [];
  private tweens: Phaser.Tweens.Tween[] = [];
  private dealUnsubscribe: (() => void) | undefined;
  /** What Apply Mud last drew as, so the 1s re-check redraws only on a flip. */
  private mudEnabled: boolean | undefined;

  private get buildingKey(): AnimalBuildingKey {
    const { location } = this.scene;
    return location === "barn" || location === "pigpen" ? location : "henHouse";
  }

  private get building(): AnimalBuildingType {
    return BUILDING_NAME[this.buildingKey];
  }

  selector(state: MachineState): Slice {
    const game = state.context.state;
    const key = this.buildingKey;
    return {
      islandType: game.island.type,
      level: game[key].level,
      animals: game[key].animals,
      game,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.islandType === b.islandType &&
    a.level === b.level &&
    a.animals === b.animals &&
    a.game === b.game;

  mount() {
    super.mount();
    // The exchange HUD replaces this chrome while a deal is live.
    this.dealUnsubscribe = this.bridge.animalDeal.subscribe(() =>
      this.resync(),
    );
  }

  private resync() {
    void this.sync(this.bridge.select((state) => this.selector(state)));
  }

  async sync(slice: Slice) {
    const token = this.beginSync();
    [
      shopDisc,
      ITEM_DETAILS.Mud.image,
      SUNNYSIDE.icons.disc,
      SUNNYSIDE.icons.death,
      SUNNYSIDE.icons.upgrade_disc,
      SUNNYSIDE.building.feederMachine,
      SUNNYSIDE.animalFoods.grinder,
      SUNNYSIDE.icons.lightning,
    ].forEach((url) => queueImage(this.scene, url));
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    this.clear();

    const room = interiorRoomRect(
      this.scene.location,
      slice.islandType,
      slice.level,
    );
    if (!room) return;

    // [BarnInside.tsx] the feeder machine always stays; Feed All hides while
    // the quick-sell panel is open so animals can't be fed mid-sale; the
    // discs hide for a bounty deal and for the panel. [PigpenInside.tsx] the
    // same, the trade-in pick counting as a deal, and Apply Mud always stays.
    const sale = this.bridge.animalDeal.get();
    this.addFeederMachine(room);
    if (!sale?.sellPanel) this.addFeedAll(room, slice);
    if (this.buildingKey === "pigpen") this.addApplyMud(room, slice);
    if (!sale) this.addDiscs(room);
  }

  /**
   * [ApplyMudButton.tsx] mirrors the Feed All slot on the feeder's other
   * side: the white round disc with the Mud icon centred and a lightning
   * corner badge. Dimmed and inert with no Mud or no Pig to mud; the badge
   * pulses when it can be used. The click asks React for the button's own
   * flow (the confirmation, then `pigs.bulkMudApplied`).
   */
  private addApplyMud(
    room: { x: number; y: number; width: number },
    slice: Slice,
  ) {
    const enabled = canApplyMud(slice.game, Date.now());
    this.mudEnabled = enabled;

    // `right-1/2 -translate-x-[58px]`: the disc's RIGHT edge sits 58 CSS px
    // left of the room's centre line.
    const x = room.x + room.width / 2 - FEED_ALL_OFFSET.x - DISC;
    const y = room.y - FEED_ALL_OFFSET.y;
    const alpha = enabled ? 1 : 0.6;

    const disc = this.image(
      SUNNYSIDE.icons.disc,
      x,
      y,
      DISC,
      CONTROL_DEPTH + 2,
    );
    if (!disc) return;
    disc.setAlpha(alpha);

    this.image(ITEM_DETAILS.Mud.image, 0, 0, MUD_ICON, CONTROL_DEPTH + 3)
      ?.setOrigin(0.5, 0.5)
      .setPosition(x + disc.displayWidth / 2, y + disc.displayHeight / 2)
      .setAlpha(alpha);

    const bolt = this.image(
      SUNNYSIDE.icons.lightning,
      0,
      0,
      MUD_LIGHTNING,
      CONTROL_DEPTH + 4,
    );
    if (bolt) {
      // Centre origin so the pulse grows in place, as CSS scale does.
      bolt
        .setOrigin(0.5, 0.5)
        .setPosition(
          x + DISC + MUD_BADGE_OVERHANG - bolt.displayWidth / 2,
          y - MUD_BADGE_OVERHANG + bolt.displayHeight / 2,
        )
        .setAlpha(alpha);
      if (enabled) this.pulse(bolt);
    }

    if (!enabled) return;
    makeClickable(
      this.scene,
      disc,
      () => this.bridge.animalHouseModal.set("applyMud"),
      { glow: () => disc },
    );
  }

  private pulse(target: Phaser.GameObjects.Image) {
    this.tweens.push(
      this.scene.tweens.add({
        targets: target,
        scale: target.scale * 1.15,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      }),
    );
  }

  /**
   * [ApplyMudButton.tsx `useNow` 1s] a sleeping Pig's love window opens on
   * its own, which can leave no Pig the Mud may go on — re-check each second.
   */
  update(_time: number, delta: number) {
    if (this.buildingKey !== "pigpen" || !this.secondElapsed(delta)) return;
    const game = this.bridge.select((state) => state.context.state);
    if (canApplyMud(game, Date.now()) !== this.mudEnabled) this.resync();
  }

  /** Top-centre of the room, hanging 4px above its top edge. */
  private addFeederMachine(room: { x: number; y: number; width: number }) {
    const centreX = room.x + room.width / 2;
    const machine = this.image(
      SUNNYSIDE.building.feederMachine,
      centreX - MACHINE / 2,
      room.y - 4,
      MACHINE,
      CONTROL_DEPTH,
    );
    if (!machine) return;
    // The grinder badge rides the machine's top-right, overhanging it
    // [FeederMachine.tsx: `top-0 -right-4`].
    const grinder = this.image(
      SUNNYSIDE.animalFoods.grinder,
      centreX + MACHINE / 2 + GRINDER_OVERHANG - GRINDER,
      room.y - 4,
      GRINDER,
      CONTROL_DEPTH + 1,
    );
    const open = () => this.bridge.animalHouseModal.set("feeder");
    makeClickable(this.scene, machine, open, { glow: () => machine });
    if (grinder)
      makeClickable(this.scene, grinder, open, { glow: () => machine });
  }

  /**
   * [FeedAllButton.tsx] hidden when this building covers no animal types;
   * dimmed with a still badge when nothing is eligible, pulsing when it is.
   */
  private addFeedAll(
    room: { x: number; y: number; width: number },
    slice: Slice,
  ) {
    const building = this.building;
    const covered = getCoveredAnimalTypes({ state: slice.game, building });
    if (covered.length === 0) return;

    const { toClaim, toCure, toFeed } = getFeedAllTargets({
      state: slice.game,
      building,
      createdAt: Date.now(),
    });
    const enabled = toClaim.length + toCure.length + toFeed.length > 0;

    const x = room.x + room.width / 2 + FEED_ALL_OFFSET.x;
    const y = room.y - FEED_ALL_OFFSET.y;

    const grinder = this.image(
      SUNNYSIDE.animalFoods.grinder,
      x,
      y,
      GRINDER,
      CONTROL_DEPTH + 2,
    );
    if (!grinder) return;
    grinder.setAlpha(enabled ? 1 : 0.6);

    const bolt = this.image(
      SUNNYSIDE.icons.lightning,
      x + GRINDER - LIGHTNING / 2,
      y - LIGHTNING / 4,
      LIGHTNING,
      CONTROL_DEPTH + 3,
    );
    if (bolt) {
      bolt.setAlpha(enabled ? 1 : 0.6);
      if (enabled) this.pulse(bolt);
    }

    if (!enabled) return;
    makeClickable(
      this.scene,
      grinder,
      () => {
        // [FeedAllButton] re-derive from the LIVE snapshot: a double-tap can
        // arrive before this renderer has re-synced on the first one.
        const state = this.bridge.select((s) => s.context.state);
        const targets = getFeedAllTargets({ state, building });
        if (
          targets.toClaim.length +
            targets.toCure.length +
            targets.toFeed.length ===
          0
        ) {
          return;
        }
        this.bridge.dispatch({ type: "animals.fedAll", building });
        playSound("feed_animal");
      },
      { glow: () => grinder },
    );
  }

  /**
   * Shop top-right with the quick-sell disc beside it, upgrade top-left
   * [BarnInside.tsx].
   */
  private addDiscs(room: { x: number; y: number; width: number }) {
    const shop = this.image(
      shopDisc,
      room.x + room.width - DISC_INSET - DISC,
      room.y + DISC_INSET,
      DISC,
      CONTROL_DEPTH,
    );
    if (shop) {
      makeClickable(
        this.scene,
        shop,
        () => this.bridge.animalHouseModal.set("shop"),
        { glow: () => shop },
      );
    }

    // [BarnInside.tsx] the skull disc docks the bounty cards at the bottom of
    // the screen. The shop disc has a 2px bag sprite above its disc, so the
    // plain disc sits 2px lower to line the two faces up, 19px to its left.
    const sell = this.image(
      SUNNYSIDE.icons.disc,
      room.x + room.width - DISC_INSET - SELL_DISC_GAP - DISC,
      room.y + DISC_INSET + 2,
      DISC,
      CONTROL_DEPTH,
    );
    if (sell) {
      // The skull is centred on the disc face.
      const skull = this.image(
        SUNNYSIDE.icons.death,
        0,
        0,
        SKULL,
        CONTROL_DEPTH + 1,
      );
      skull
        ?.setOrigin(0.5, 0.5)
        .setPosition(
          sell.x + sell.displayWidth / 2,
          sell.y + sell.displayHeight / 2,
        );
      makeClickable(
        this.scene,
        sell,
        () => this.bridge.animalDeal.set({ sellPanel: true }),
        { glow: () => sell },
      );
    }

    const upgrade = this.image(
      SUNNYSIDE.icons.upgrade_disc,
      room.x + DISC_INSET,
      room.y + DISC_INSET,
      DISC,
      CONTROL_DEPTH,
    );
    if (upgrade) {
      makeClickable(
        this.scene,
        upgrade,
        () => this.bridge.animalHouseModal.set("upgrade"),
        { glow: () => upgrade },
      );
    }
  }

  private image(
    texture: string,
    x: number,
    y: number,
    width: number,
    depth: number,
  ): Phaser.GameObjects.Image | undefined {
    if (!this.scene.textures.exists(texture)) return undefined;
    const image = this.scene.add
      .image(x, y, texture)
      .setOrigin(0, 0)
      .setDepth(depth);
    fitWidth(image, width);
    this.objects.push(image);
    return image;
  }

  private clear() {
    this.tweens.forEach((tween) => tween.remove());
    this.tweens = [];
    this.objects.forEach((object) => object.destroy());
    this.objects = [];
  }

  protected onDestroy() {
    this.dealUnsubscribe?.();
    this.dealUnsubscribe = undefined;
    this.clear();
  }
}
