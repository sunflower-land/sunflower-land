import type Phaser from "phaser";
import shopDisc from "assets/icons/shop_disc.png";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState, IslandType } from "features/game/types/game";
import type { AnimalBuildingType } from "features/game/types/animals";
import { PIXEL_SCALE } from "features/game/lib/constants";
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
 * The animal house's in-room controls: the feeder machine, Feed All, and the
 * shop / upgrade discs [BarnInside.tsx + HenHouseInside.tsx].
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
/** The grinder badge overhangs the machine's right edge [FeederMachine]. */
const GRINDER_OVERHANG = css(16);

/** Above the room art and the animals. */
const CONTROL_DEPTH = DEPTHS.ALWAYS_ON_TOP + 50;

export class AnimalHouseControls extends EntityRenderer<Slice> {
  private objects: Phaser.GameObjects.Image[] = [];
  private lightningTween: Phaser.Tweens.Tween | undefined;
  private dealUnsubscribe: (() => void) | undefined;

  private get building(): AnimalBuildingType {
    return this.scene.location === "barn" ? "Barn" : "Hen House";
  }

  selector(state: MachineState): Slice {
    const game = state.context.state;
    const key = this.scene.location === "barn" ? "barn" : "henHouse";
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
      SUNNYSIDE.icons.upgrade_disc,
      SUNNYSIDE.building.feederMachine,
      SUNNYSIDE.animalFoods.grinder,
      SUNNYSIDE.icons.lightning,
    ].forEach((url) => queueImage(this.scene, url));
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    this.clear();

    // [BarnInside.tsx] the room chrome hides while a bounty deal is running.
    if (this.bridge.animalDeal.get()) return;

    const room = interiorRoomRect(
      this.scene.location,
      slice.islandType,
      slice.level,
    );
    if (!room) return;

    this.addFeederMachine(room);
    this.addFeedAll(room, slice);
    this.addDiscs(room);
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
      if (enabled) {
        this.lightningTween = this.scene.tweens.add({
          targets: bolt,
          scale: bolt.scale * 1.15,
          duration: 500,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      }
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

  /** Shop top-right, upgrade top-left [AnimalHouseUI]. */
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
    this.lightningTween?.remove();
    this.lightningTween = undefined;
    this.objects.forEach((object) => object.destroy());
    this.objects = [];
  }

  protected onDestroy() {
    this.dealUnsubscribe?.();
    this.dealUnsubscribe = undefined;
    this.clear();
  }
}
