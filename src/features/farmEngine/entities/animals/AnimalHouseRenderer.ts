import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import powerup from "assets/icons/level_up.png";
import sparkleSheet from "assets/animals/mutant_sparkle.png";
import type { MachineState } from "features/game/lib/gameMachine";
import type {
  Animal,
  AnimalFeedBuffName,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import {
  ANIMALS,
  ANIMAL_LEVELS,
  ANIMAL_RESOURCE_DROP,
  type AnimalLevel,
  type AnimalType,
} from "features/game/types/animals";
import type { AnimalResource } from "features/game/types/game";
import { ANIMAL_HOUSE_BOUNDS } from "features/game/expansion/placeable/lib/collisionDetection";
import { getNextLoveAvailableAt } from "features/game/events/landExpansion/loveAnimal";
import { isAnimalFeedable } from "features/game/events/landExpansion/buyAnimal";
import { isAnimalCoveredByGoldenAsset } from "features/game/events/landExpansion/feedAllAnimals";
import {
  getBoostedFoodQuantity,
  getAnimalFavoriteFood,
  getAnimalLevel,
  getAnimalShownLevel,
  getClaimedExperience,
  getNextClaimLevel,
  getPendingClaims,
  getResourceDropAmount,
  isMaxLevel,
  resolveAnimal,
} from "features/game/lib/animals";
import {
  getFeedBatchSize,
  REQUIRED_FOOD_QTY,
} from "features/game/events/landExpansion/feedAnimal";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";
import { ANIMAL_REQUEST_IMAGES } from "features/game/expansion/components/animals/RequestBubble";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "lib/object";
import { queueImage, queueSpritesheet, runLoader } from "../../core/assets";
import {
  artTexture,
  queueArt,
  resolveArtObject,
  type ArtObject,
} from "../../core/animated";
import { nativeScale } from "../../core/pixelArt";
import { makeClickable } from "../../core/clickable";
import { gridToWorld, WORLD_TILE } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { EntityRenderer } from "../EntityRenderer";
import { RequestBubbleSprite } from "../../components/RequestBubbleSprite";
import { playYieldFloat } from "../../components/YieldFloat";
import { outlinedText } from "../../components/outlinedText";
import { pixelText } from "../../components/pixelText";
import type { AnimalDealState } from "../../bridge/GameBridge";
import {
  AnimalInteraction,
  animalSaleAnchorId,
  type AnimalBuildingKey,
} from "./animalInteraction";

/**
 * The animals inside the barn and hen house [barn/BarnInside.tsx +
 * henHouse/HenHouseInside.tsx], interaction included.
 *
 * Animals aren't placed by the player: the DOM sorts them (type, then
 * experience) and flows them across the floor bounds, so the same layout is
 * computed here. Their look is a pure function of the animal record (the
 * DOM's per-animal xstate machine mirrors game state plus two visual-only
 * bits — the 2s happy/sad reaction and the claim drop animation — which live
 * here as transient effects instead). Clicks route through
 * `animalInteraction.ts`, the DOM's decision tree dispatching the same game
 * events.
 */

type Slice = {
  animals: Record<string, Animal>;
  level: number;
  /** Feedable-ness and boosts read wider state. */
  collectibles: GameState["collectibles"];
  bumpkin: GameState["bumpkin"];
  inventory: GameState["inventory"];
  selectedItem?: string;
};

type AnimalVisualState =
  | "sleeping"
  | "ready"
  | "needsLove"
  | "sick"
  | "idle"
  | "happy"
  | "sad";

/**
 * [Cow.tsx / Sheep.tsx / Chicken.tsx animalImageInfo] art per state; `width`
 * is the DOM's rendered width in world px. Cow.tsx and Sheep.tsx multiply
 * PIXEL_SCALE TWICE (the info width already carries it and the style adds it
 * again), so barn animals draw ~2.6x the chicken convention — that double
 * size is the shipped look, so it's baked in here.
 */
// Pigs live only in the DOM /pigpen route — the engine never renders them.
type EngineAnimalType = Exclude<AnimalType, "Pig">;

const ANIMAL_ART: Record<
  EngineAnimalType,
  Record<
    "ready" | "sleeping" | "sick" | "idle",
    { image: string; width: number }
  >
> = {
  Cow: {
    ready: { image: SUNNYSIDE.animals.cowReady, width: 13 * PIXEL_SCALE },
    sleeping: {
      image: SUNNYSIDE.animals.cowSleeping,
      width: 13 * PIXEL_SCALE,
    },
    sick: { image: SUNNYSIDE.animals.cowSick, width: 11 * PIXEL_SCALE },
    idle: { image: SUNNYSIDE.animals.cowIdle, width: 11 * PIXEL_SCALE },
  },
  Sheep: {
    ready: { image: SUNNYSIDE.animals.sheepReady, width: 13 * PIXEL_SCALE },
    sleeping: {
      image: SUNNYSIDE.animals.sheepSleeping,
      width: 13 * PIXEL_SCALE,
    },
    sick: { image: SUNNYSIDE.animals.sheepSick, width: 11 * PIXEL_SCALE },
    idle: { image: SUNNYSIDE.animals.sheepIdle, width: 11 * PIXEL_SCALE },
  },
  Chicken: {
    ready: { image: SUNNYSIDE.animals.chickenReady, width: 13 },
    sleeping: { image: SUNNYSIDE.animals.chickenAsleep, width: 13 },
    sick: { image: SUNNYSIDE.animals.chickenSick, width: 11 },
    idle: { image: SUNNYSIDE.animals.chickenIdle, width: 11 },
  },
};

type EmotionIcon = { icon: string; width: number; top: number; right: number };

/**
 * [Cow.tsx ANIMAL_EMOTION_ICONS / Chicken.tsx CHICKEN_EMOTION_ICONS] the
 * badge over the animal, in world px from the animal's inner-div top-right —
 * the two components position them differently.
 */
const EMOTION_ICONS: Record<
  "barn" | "henHouse",
  Partial<Record<AnimalVisualState, EmotionIcon>>
> = {
  barn: {
    ready: {
      icon: SUNNYSIDE.icons.expression_ready,
      width: 9,
      top: 2,
      right: -1,
    },
    sleeping: {
      icon: SUNNYSIDE.icons.sleeping,
      width: 9,
      top: 4.5,
      right: 1.1,
    },
    happy: { icon: SUNNYSIDE.icons.happy, width: 7, top: 4.5, right: 1.1 },
    sad: { icon: SUNNYSIDE.icons.sad, width: 7, top: 4.5, right: 1.1 },
  },
  henHouse: {
    ready: {
      icon: SUNNYSIDE.icons.expression_ready,
      width: 8,
      top: -2.3,
      right: 3.7,
    },
    sleeping: { icon: SUNNYSIDE.icons.sleeping, width: 9, top: -3.5, right: 2 },
    happy: { icon: SUNNYSIDE.icons.happy, width: 7, top: -1.3, right: 3.7 },
    sad: { icon: SUNNYSIDE.icons.sad, width: 7, top: -1.3, right: 3.7 },
  },
};

/** [AnimalFeedBuffBadge.tsx] */
const BUFF_ICON: Record<AnimalFeedBuffName, string> = {
  "Salt Lick": powerup,
  "Honey Treat": SUNNYSIDE.icons.lightning,
  "Truffle Seasoning": SUNNYSIDE.icons.stopwatch,
};

const CELL = 2 * WORLD_TILE; // animals sit in a 2x2-tile cell

/**
 * [Chicken.tsx] chicken badges anchor to a 19px-tall inner div centred in
 * the cell; the barn's inner div is the full cell.
 */
const INNER_TOP = { barn: 0, henHouse: (CELL - 19) / 2 } as const;
const INNER_BOTTOM = { barn: CELL, henHouse: (CELL - 19) / 2 + 19 } as const;
const SPARKLE_KEY = sparkleSheet; // spritesheets are keyed by URL

/** [ProgressBarSprite BAR] the shared 15x7 bar frame geometry. */
const BAR = {
  width: 15,
  innerWidth: 11,
  innerHeight: 2,
  marginTop: 2,
  marginLeft: 2,
};

type AnimalObjects = {
  container: Phaser.GameObjects.Container;
  art?: ArtObject;
  shadow?: Phaser.GameObjects.Image;
  zone: Phaser.GameObjects.Zone;
  emotion?: Phaser.GameObjects.Image;
  lock?: Phaser.GameObjects.Image;
  buff?: Phaser.GameObjects.Image;
  bubble?: RequestBubbleSprite;
  bubbleKey?: string;
  barFill?: Phaser.GameObjects.Rectangle;
  barFill2?: Phaser.GameObjects.Rectangle;
  levelText?: Phaser.GameObjects.Text;
  sparkle?: Phaser.GameObjects.Sprite;
  /** What was last synced, for bulk-claim detection [Cow.tsx lastSynced]. */
  last?: {
    visual: AnimalVisualState;
    state: Animal["state"];
    experience: number;
    claimedExperience?: number;
  };
  /** The 1s info message currently over the animal. */
  message?: Phaser.GameObjects.Container;
  /** Anchor the React PendingSaleTag hangs off while marked for bulk sale. */
  saleAnchor?: string;
};

/** [BarnInside.tsx isPendingSale] marked for a bounty in bulk sell mode. */
const isPendingSale = (sale: AnimalDealState, id: string) =>
  Object.values(sale?.pending ?? {}).includes(id);

export class AnimalHouseRenderer extends EntityRenderer<Slice> {
  private animals = new Map<string, AnimalObjects>();
  private interaction?: AnimalInteraction;
  /** id -> reaction shown until timestamp [animalMachine happy/sad 2s]. */
  private reactions = new Map<
    string,
    { state: "happy" | "sad"; until: number }
  >();
  private unsubscribeDeal?: () => void;
  /** The room order, recomputed only when herd membership changes. */
  private sortedIds?: { key: string; ids: string[] };

  private get buildingKey(): AnimalBuildingKey {
    return this.scene.location === "barn" ? "barn" : "henHouse";
  }

  selector(state: MachineState): Slice {
    const game = state.context.state;
    const building = game[this.buildingKey];
    return {
      animals: building.animals,
      level: building.level,
      collectibles: game.collectibles,
      bumpkin: game.bumpkin,
      inventory: game.inventory,
      selectedItem: this.bridge.ui.get().selectedItem,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.animals === b.animals &&
    a.level === b.level &&
    a.collectibles === b.collectibles &&
    a.bumpkin === b.bumpkin &&
    a.inventory === b.inventory &&
    a.selectedItem === b.selectedItem;

  /** [BarnInside.tsx] sort by type then experience, flow across the floor. */
  private layout(slice: Slice) {
    const bounds =
      ANIMAL_HOUSE_BOUNDS[this.buildingKey][Math.min(slice.level, 3)];
    const cellTiles = ANIMALS.Cow; // both houses lay out on 2x2 cells
    const perRow = Math.max(1, Math.floor(bounds.width / cellTiles.width));
    const verticalGap = 0.5;

    // [BarnInside.tsx sortedAnimalIds] positions must not move while the
    // player is in the room, so the order is recomputed only when the herd's
    // MEMBERSHIP changes — never when an animal's experience does. Keyed on
    // the id list, so selling one animal and buying another cannot leave a
    // stale id behind.
    const key = getKeys(slice.animals).sort().join(",");
    if (this.sortedIds?.key !== key) {
      this.sortedIds = {
        key,
        ids: getKeys(slice.animals)
          .map((id) => slice.animals[id])
          .sort((a, b) =>
            a.type === b.type
              ? b.experience - a.experience
              : a.type.localeCompare(b.type),
          )
          .map((animal) => animal.id),
      };
    }
    // The order is fixed, the records are fresh.
    const sorted = this.sortedIds.ids
      .map((id) => slice.animals[id])
      .filter(Boolean);

    const floor = gridToWorld({ x: bounds.x, y: bounds.y });
    return sorted.map((animal, index) => {
      const row = Math.floor(index / perRow);
      const col = index % perRow;
      return {
        animal,
        x: floor.x + col * cellTiles.width * WORLD_TILE,
        y: floor.y + row * (cellTiles.height + verticalGap) * WORLD_TILE,
      };
    });
  }

  /**
   * [animalMachine] the visual state, in the machine's priority order, plus
   * the transient post-feed reaction. An asleep animal that can be petted is
   * "needsLove" whatever its `state` — a banked animal stays `ready` while it
   * sleeps and the machine's sleeping state still moves it to needsLove.
   */
  private stateOf(animal: Animal): AnimalVisualState {
    const reaction = this.reactions.get(animal.id);
    if (reaction && reaction.until > Date.now()) return reaction.state;

    const sleeping = animal.awakeAt > Date.now();
    const needsLove =
      getNextLoveAvailableAt(animal, animal.awakeAt) < Date.now();

    if (sleeping && needsLove) return "needsLove";
    if (animal.state === "ready" && sleeping) return "sleeping";
    if (animal.state === "ready") return "ready";
    if (sleeping) return "sleeping";
    if (animal.state === "sick") return "sick";
    return "idle";
  }

  async sync(slice: Slice) {
    const token = this.beginSync();
    Object.values(ANIMAL_ART).forEach((states) =>
      Object.values(states).forEach(({ image }) => queueArt(this.scene, image)),
    );
    queueImage(this.scene, SUNNYSIDE.animals.chickenShadow);
    Object.values(EMOTION_ICONS).forEach((table) =>
      Object.values(table).forEach(
        (icon) => icon && queueImage(this.scene, icon.icon),
      ),
    );
    Object.values(BUFF_ICON).forEach((icon) => queueImage(this.scene, icon));
    queueImage(this.scene, SUNNYSIDE.icons.lock);
    queueImage(this.scene, SUNNYSIDE.ui.emptyBar);
    RequestBubbleSprite.queueAssets(this.scene);
    queueSpritesheet(this.scene, sparkleSheet, {
      frameWidth: 20,
      frameHeight: 19,
    });
    // Request + drop item icons for the animals present.
    const game = this.bridge.select((state) => state.context.state);
    for (const stored of Object.values(slice.animals)) {
      const animal = resolveAnimal(stored, game);
      const request = this.requestFor(animal, game);
      if (request) queueImage(this.scene, ITEM_DETAILS[request].image);
      // The levels a drop animation can show: the next click-claim's, and
      // the one a bulk claim just paid [Cow.tsx dropsLevel].
      for (const level of [
        getNextClaimLevel(animal),
        getAnimalLevel(getClaimedExperience(animal), animal.type),
      ]) {
        const drops = ANIMAL_RESOURCE_DROP[animal.type][level];
        Object.keys(drops ?? {}).forEach((item) =>
          queueImage(this.scene, ITEM_DETAILS[item as InventoryItemName].image),
        );
      }
    }
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    this.ensureInteraction();
    this.ensureSparkleAnim();

    const placed = this.layout(slice);
    const live = new Set(placed.map(({ animal }) => animal.id));
    for (const [id, objects] of this.animals) {
      if (live.has(id)) continue;
      this.destroyAnimal(objects);
      this.animals.delete(id);
    }

    const sale = this.bridge.animalDeal.get();
    for (const { animal, x, y } of placed) {
      // Stored awakeAt goes stale under live boost windows [Cow.tsx
      // resolveAnimal] — resolve before any state/time reads.
      this.syncAnimal(resolveAnimal(animal, game), x, y, game, sale);
    }
  }

  /** [Cow.tsx requestBubbleRequest] what the animal is asking for. */
  private requestFor(
    animal: Animal,
    game: GameState,
  ): InventoryItemName | undefined {
    const state = this.stateOf(animal);
    const golden = isAnimalCoveredByGoldenAsset({
      state: game,
      animalType: animal.type,
    });
    const locked = !isAnimalFeedable(this.buildingKey, game, animal.id);

    // [Cow.tsx `sick`] a sick animal asks for medicine even while asleep.
    if (state === "sick" || animal.state === "sick") return "Barn Delight";
    if (state === "needsLove" && !golden) return animal.item;
    if (
      state === "idle" &&
      !locked &&
      !this.interaction?.isAnimating(animal.id)
    ) {
      return getAnimalFavoriteFood(animal.type, animal.experience);
    }
    return undefined;
  }

  private syncAnimal(
    animal: Animal,
    x: number,
    y: number,
    game: GameState,
    sale: AnimalDealState,
  ) {
    const id = animal.id;
    const deal = sale?.deal;
    const dealActive = !!deal;
    const state = this.stateOf(animal);
    const locked = !isAnimalFeedable(this.buildingKey, game, id);
    const animating = this.interaction?.isAnimating(id) ?? false;

    // Bulk operations (Feed All) claim without a click — play the same drop
    // animation the DOM does [Cow.tsx lastSynced effect].
    const objects0 = this.animals.get(id);
    const prev = objects0?.last;
    if (
      prev &&
      (prev.state !== animal.state ||
        prev.experience !== animal.experience ||
        prev.claimedExperience !== animal.claimedExperience)
    ) {
      const asleep = animal.awakeAt > Date.now();
      // A banked claim leaves the animal ready (asleep until its next
      // claim), so the claimed mark moving on is what shows a claim happened.
      // A mark that was unset (an animal from before banking) is set by its
      // first feed, which is not a claim.
      const claimed =
        prev.visual === "ready" &&
        (animal.state === "idle" ||
          (animal.state === "ready" &&
            prev.claimedExperience !== undefined &&
            prev.claimedExperience !== animal.claimedExperience));
      // Bulk feeding can level an animal to ready and claim its produce in
      // the same event.
      const fedAndClaimed =
        (prev.visual === "idle" ||
          prev.visual === "happy" ||
          prev.visual === "sad") &&
        (animal.state === "idle" || animal.state === "ready") &&
        asleep;
      // A click-claim already played its drops before dispatching — the DOM
      // machine is asleep by the time this check runs, so it never replays.
      const clicked = this.interaction?.consumeClickClaim(id) ?? false;
      if ((claimed || fedAndClaimed) && !clicked && !animating) {
        // Already claimed: the level just paid.
        void this.playDropsVisual(
          id,
          getAnimalLevel(getClaimedExperience(animal), animal.type),
        );
      }
    }

    const artState =
      state === "ready"
        ? "ready"
        : state === "sick"
          ? "sick"
          : state === "sleeping" || state === "needsLove" || locked
            ? "sleeping"
            : "idle";
    // While the claim animation runs the animal still looks ready.
    const art =
      ANIMAL_ART[animal.type as EngineAnimalType][
        animating ? "ready" : artState
      ];
    if (!this.scene.textures.exists(artTexture(art.image))) return;

    let objects = objects0;
    if (!objects) {
      const container = this.scene.add.container(0, 0);
      const zone = this.scene.add.zone(0, 0, CELL, CELL).setOrigin(0, 0);
      makeClickable(this.scene, zone, () => this.onAnimalClick(id), {
        glow: () => this.animals.get(id)?.art,
      });
      objects = { container, zone };
      this.animals.set(id, objects);
    }
    objects.last = {
      visual: state,
      state: animal.state,
      experience: animal.experience,
      claimedExperience: animal.claimedExperience,
    };

    const depth = DEPTHS.ENTITY_BASE + y;
    objects.container.setPosition(x, y);
    objects.container.setDepth(depth);
    objects.zone.setPosition(x, y);
    objects.zone.setDepth(depth);

    // [Chicken.tsx] the brown roost under each chicken (chickenShadow, w13,
    // hanging off the bottom of the 19px inner div at cell top 6.5).
    if (
      this.buildingKey === "henHouse" &&
      !objects.shadow &&
      this.scene.textures.exists(SUNNYSIDE.animals.chickenShadow)
    ) {
      objects.shadow = this.scene.add
        .image(CELL / 2, INNER_BOTTOM.henHouse, SUNNYSIDE.animals.chickenShadow)
        .setOrigin(0.5, 1);
      nativeScale(objects.shadow);
      objects.container.addAt(objects.shadow, 0);
    }

    // [Cow.tsx] the animal image is centred in the 2x2 cell, drawn at the
    // DOM's hardcoded width — several states ship 2x art (ready chicken 26px
    // shown at 13, cow 25px at 11-13), so native size would double them.
    const artObject = resolveArtObject(this.scene, objects.art, art.image);
    if (!artObject) return;
    if (artObject !== objects.art) {
      objects.container.addAt(artObject, objects.shadow ? 1 : 0);
      objects.art = artObject;
    }
    artObject.setOrigin(0.5, 0.5);
    const nativeWidth = artObject.frame?.width ?? artObject.width;
    artObject.setScale(art.width / nativeWidth);
    artObject.setPosition(CELL / 2 + 0.4, CELL / 2 + 0.8);

    // Deal mode [BarnInside.tsx]: invalid animals dim to 50% and are inert.
    // An animal already marked for another bounty can't be picked again.
    const pendingSale = isPendingSale(sale, id);
    const validForDeal =
      !!deal && !pendingSale && isValidDeal({ animal, deal, game });
    objects.container.setAlpha(dealActive && !validForDeal ? 0.5 : 1);

    // [BarnInside.tsx PendingSaleTag] the tag itself is a React Label
    // (overlay/AnimalHouseUI.tsx) anchored to the marked animal's cell.
    if (pendingSale) {
      objects.saleAnchor = animalSaleAnchorId(id);
      this.bridge.anchors.setAnchor(objects.saleAnchor, {
        x,
        y,
        width: CELL,
        height: CELL,
      });
    } else if (objects.saleAnchor) {
      this.bridge.anchors.removeAnchor(objects.saleAnchor);
      objects.saleAnchor = undefined;
    }

    // Emotion badge, offset from the inner div's top-right [Cow.tsx
    // ANIMAL_EMOTION_ICONS / Chicken.tsx CHICKEN_EMOTION_ICONS].
    const emotionState = animating ? "ready" : state;
    const emotion =
      emotionState === "idle" ||
      emotionState === "needsLove" ||
      emotionState === "sick" ||
      animal.state === "sick"
        ? undefined
        : EMOTION_ICONS[this.buildingKey][emotionState];
    if (emotion && this.scene.textures.exists(emotion.icon)) {
      if (!objects.emotion) {
        objects.emotion = this.scene.add
          .image(0, 0, emotion.icon)
          .setOrigin(0, 0);
        objects.container.add(objects.emotion);
      }
      objects.emotion.setTexture(emotion.icon);
      objects.emotion.setScale(emotion.width / objects.emotion.width);
      objects.emotion.setPosition(
        CELL - emotion.right - emotion.width,
        emotion.top + INNER_TOP[this.buildingKey],
      );
      objects.emotion.setVisible(true);
    } else {
      objects.emotion?.setVisible(false);
    }

    // Over-capacity lock [Cow.tsx / Chicken.tsx], w7 at (right 1, top 1) of
    // the inner div.
    if (locked) {
      if (!objects.lock) {
        objects.lock = this.scene.add
          .image(0, 0, SUNNYSIDE.icons.lock)
          .setOrigin(1, 0);
        objects.lock.setScale(7 / objects.lock.width);
        objects.lock.setPosition(CELL - 1, 1 + INNER_TOP[this.buildingKey]);
        objects.container.add(objects.lock);
      }
      objects.lock.setVisible(true);
    } else {
      objects.lock?.setVisible(false);
    }

    // Feed buff badge [AnimalFeedBuffBadge.tsx], w7 at the inner div's
    // bottom-right.
    const buffIcon = animal.feedBuff
      ? BUFF_ICON[animal.feedBuff.name]
      : undefined;
    if (buffIcon && this.scene.textures.exists(buffIcon)) {
      if (!objects.buff) {
        objects.buff = this.scene.add.image(0, 0, buffIcon).setOrigin(1, 1);
        objects.container.add(objects.buff);
      }
      objects.buff.setTexture(buffIcon);
      objects.buff.setScale(7 / objects.buff.width);
      objects.buff.setPosition(CELL, INNER_BOTTOM[this.buildingKey]);
      objects.buff.setVisible(true);
    } else {
      objects.buff?.setVisible(false);
    }

    // Request bubble [RequestBubble.tsx] at (left 23, top 1); quantity only
    // for a hungry animal without golden cover — the whole batch one click
    // feeds [Cow.tsx requiredFoodQty].
    const request = dealActive ? undefined : this.requestFor(animal, game);
    const golden = isAnimalCoveredByGoldenAsset({
      state: game,
      animalType: animal.type,
    });
    const quantity =
      request && state === "idle" && !golden
        ? getBoostedFoodQuantity({
            animalType: animal.type,
            foodQuantity: REQUIRED_FOOD_QTY[animal.type],
            game,
            animal,
            now: Date.now(),
          })
            .foodQuantity.mul(getFeedBatchSize({ state: game, animal }))
            .toNumber()
        : undefined;
    const bubbleKey = request ? `${request}#${quantity ?? ""}` : undefined;
    if (bubbleKey !== objects.bubbleKey) {
      objects.bubble?.destroy();
      objects.bubble = undefined;
      objects.bubbleKey = bubbleKey;
      if (request) {
        const domSize =
          ANIMAL_REQUEST_IMAGES[request as keyof typeof ANIMAL_REQUEST_IMAGES];
        objects.bubble = new RequestBubbleSprite(this.scene, {
          x: 0,
          y: 0,
          icon: ITEM_DETAILS[request].image,
          // The DOM renders icons at CSS px (not art px) — ~6 world px.
          iconWidth: (domSize?.width ?? 16) / PIXEL_SCALE,
          quantity,
          // [RequestBubble.tsx z-10] bubbles paint above every animal in the
          // room, so they live at scene level in a band over the entities.
          depth: DEPTHS.ENTITY_BASE + 2_000 + y,
        });
      }
    }
    // [Cow.tsx] (23, 1) against the full-cell inner div; [Chicken.tsx]
    // (20, -3.5) against a 19px-tall centred inner div -> (20, 3) in cell
    // space.
    const barn = this.buildingKey === "barn";
    objects.bubble?.setPosition(x + (barn ? 23 : 20), y + (barn ? 1 : 3));

    // Mutant sparkles [MutantSparkles.tsx] when a mutant reward is waiting.
    const mutant = animal.reward?.items?.[0]?.name;
    if (mutant && this.scene.textures.exists(SPARKLE_KEY)) {
      if (!objects.sparkle) {
        objects.sparkle = this.scene.add
          .sprite(CELL / 2, CELL / 2, SPARKLE_KEY, 0)
          .setOrigin(0.5, 0.5);
        objects.sparkle.play(`${SPARKLE_KEY}-loop`);
        objects.container.add(objects.sparkle);
      }
      objects.sparkle.setVisible(true);
    } else {
      objects.sparkle?.setVisible(false);
    }

    this.syncLevelProgress(objects, animal, state);
  }

  /**
   * [LevelProgress.tsx] the XP bar + level number under the animal. An animal
   * levels up as its produce is claimed: one with a claim waiting shows the
   * level before that claim, a banked one climbs one level per claim, and the
   * bar stays full until every banked claim is paid.
   */
  private syncLevelProgress(
    objects: AnimalObjects,
    animal: Animal,
    state: AnimalVisualState,
  ) {
    const level = getAnimalLevel(animal.experience, animal.type);
    const displayLevel = getAnimalShownLevel(animal);

    const percentage = (() => {
      if (state === "ready" || getPendingClaims(animal) > 0) return 100;
      if (isMaxLevel(animal.type, level)) {
        const maxLevel = (getKeys(ANIMAL_LEVELS[animal.type]).length -
          1) as AnimalLevel;
        const maxXp = ANIMAL_LEVELS[animal.type][maxLevel];
        const prevXp =
          ANIMAL_LEVELS[animal.type][(maxLevel - 1) as AnimalLevel];
        const cycle = maxXp - prevXp;
        return (((animal.experience - maxXp) % cycle) / cycle) * 100;
      }
      const current = ANIMAL_LEVELS[animal.type][displayLevel as AnimalLevel];
      const next =
        ANIMAL_LEVELS[animal.type][(displayLevel + 1) as AnimalLevel];
      return ((animal.experience - current) / (next - current)) * 100;
    })();

    // Bar + level number [LevelProgress.tsx AnimatedBar — the same 15x7
    // frame, no time label]. DOM anchors, converted to world px: the barn
    // hangs the bar off the cell bottom (-bottom-2.5, ml-1), the hen house
    // tucks it just inside (bottom-1, ml-0.5).
    const barn = this.buildingKey === "barn";
    const barX = (CELL - BAR.width) / 2 + (barn ? 4 : 2) / PIXEL_SCALE;
    const barY = barn
      ? CELL + 10 / PIXEL_SCALE - 7
      : CELL - 4 / PIXEL_SCALE - 7;
    if (!objects.barFill) {
      // [AnimatedBar] paints the whole bar, then re-paints it semi-opaque on
      // top (frame 50%, background and fill 80%) — the doubled edges are part
      // of the shipped look.
      const makeFrame = (alpha: number) => {
        const frame = this.scene.add
          .image(barX, barY, SUNNYSIDE.ui.emptyBar)
          .setOrigin(0, 0)
          .setAlpha(alpha);
        frame.setScale(BAR.width / frame.width);
        return frame;
      };
      const makeRect = (color: number, alpha: number) =>
        this.scene.add
          .rectangle(
            barX + BAR.marginLeft,
            barY + BAR.marginTop,
            BAR.innerWidth,
            BAR.innerHeight,
            color,
          )
          .setOrigin(0, 0)
          .setAlpha(alpha);
      objects.barFill = makeRect(0x63c74d, 1);
      objects.barFill2 = makeRect(0x63c74d, 0.8);
      objects.container.add([
        makeFrame(1),
        makeRect(0x193c3e, 1),
        objects.barFill,
        makeFrame(0.5),
        makeRect(0x193c3e, 0.8),
        objects.barFill2,
      ]);
    }
    const fillWidth = Math.floor(
      (BAR.innerWidth * Math.max(0, Math.min(percentage, 100))) / 100,
    );
    // setSize, NOT `.width` — a Shape renders from its geom/pathData, and only
    // setSize regenerates it. Assigning `.width` left the fill painting at its
    // construction width, so the XP bar under every animal read as full and
    // sat wrong against the frame's inset.
    objects.barFill.setSize(fillWidth, BAR.innerHeight);
    objects.barFill.setVisible(fillWidth > 0);
    objects.barFill2?.setSize(fillWidth, BAR.innerHeight);
    objects.barFill2?.setVisible(fillWidth > 0);

    // [LevelProgress.tsx] the number overlaps the bar's left cap (right: 85%,
    // centre at top 11px), in the HD display face the yield floats use.
    if (!objects.levelText) {
      objects.levelText = outlinedText(this.scene, 0, 0, "", {
        // Sized to the DOM render: 12px Teeny digits stand ~12 CSS px tall,
        // which Grandstander-900 reaches at ~17px.
        fontPx: 17,
        fill: "#71e358",
      }).setOrigin(1, 0.55);
      objects.container.add(objects.levelText);
    }
    objects.levelText.setText(`${displayLevel}`);
    objects.levelText.setPosition(
      barX + BAR.width * 0.15,
      barY + 11 / PIXEL_SCALE,
    );
  }

  /**
   * Clicks [BarnInside.tsx animal wrapper onClick]: bounty selection while a
   * deal or the quick-sell panel is live, else the tree. React decides what a
   * reported click does (confirm, mark, unmark) from `clickedId`.
   */
  private onAnimalClick(id: string) {
    const sale = this.bridge.animalDeal.get();
    if (!sale) {
      void this.interaction?.onClick(id);
      return;
    }

    const pendingSale = isPendingSale(sale, id);
    // Bulk mode: clicking a marked animal removes its mark.
    if (!sale.deal && pendingSale) {
      this.bridge.animalDeal.set({ ...sale, clickedId: id });
      return;
    }
    if (sale.deal) {
      const game = this.bridge.select((state) => state.context.state);
      const animal = game[this.buildingKey].animals[id];
      if (
        !animal ||
        pendingSale ||
        !isValidDeal({ animal, deal: sale.deal, game })
      ) {
        return;
      }
      this.bridge.animalDeal.set({ ...sale, clickedId: id });
    }
    // The sell panel with no bounty picked: animals are disabled [Cow.tsx
    // `disabled`].
  }

  private ensureInteraction() {
    if (this.interaction) return;
    this.interaction = new AnimalInteraction(this.bridge, this.buildingKey, {
      showReaction: (id, reaction) => {
        this.reactions.set(id, { state: reaction, until: Date.now() + 2000 });
        this.resync();
      },
      showXP: (id, amount, color) => {
        const objects = this.animals.get(id);
        if (!objects) return;
        playYieldFloat(this.scene, {
          x: objects.container.x + CELL / 2 - 2,
          y: objects.container.y - 2,
          amount,
          color,
          depth: objects.container.depth + 5,
          durationMs: 700,
        });
      },
      showMessage: (id, message) => this.showMessage(id, message),
      clearMessage: (id) => this.clearMessage(id),
      playDrops: (id, level) => this.playDropsVisual(id, level),
      openDetails: (id) =>
        this.bridge.farmModal.open("animalDetails", {
          building: this.buildingKey,
          id,
        }),
      openLocked: (id) =>
        this.bridge.farmModal.open("animalLocked", {
          building: this.buildingKey,
          id,
        }),
      openMutant: (id, mutant, onContinue) =>
        this.bridge.farmModal.open("mutantAnimal", { mutant, onContinue }),
    });
    this.unsubscribeDeal = this.bridge.animalDeal.subscribe(() =>
      this.resync(),
    );
  }

  /** [InfoPopover] 1s text message above the animal. */
  private showMessage(id: string, message: string) {
    const objects = this.animals.get(id);
    if (!objects) return;
    // One message per animal [Cow.tsx InfoPopover] — a newer one replaces it.
    this.clearMessage(id);
    const label = pixelText(this.scene, 0, 0, message, {
      color: "#ffffff",
    }).setOrigin(0.5, 1);
    const pad = 2;
    const back = this.scene.add
      .rectangle(
        0,
        0,
        label.displayWidth + pad * 2,
        label.displayHeight + pad * 2,
        0x181425,
        0.85,
      )
      .setOrigin(0.5, 1);
    back.setPosition(0, pad);
    const group = this.scene.add.container(
      objects.container.x + CELL / 2,
      objects.container.y - 2,
      [back, label],
    );
    group.setDepth(objects.container.depth + 6);
    objects.message = group;
    this.scene.time.delayedCall(1000, () => {
      if (objects.message === group) objects.message = undefined;
      group.destroy();
    });
  }

  private clearMessage(id: string) {
    const objects = this.animals.get(id);
    objects?.message?.destroy();
    if (objects) objects.message = undefined;
  }

  /**
   * [ProduceDrops.tsx + Cow.tsx onReadyClick timing] the 1.4s drop
   * animation: each of `level`'s drop items floats up staggered by 400ms.
   */
  private playDropsVisual(id: string, level: AnimalLevel): Promise<void> {
    const objects = this.animals.get(id);
    const game = this.bridge.select((state) => state.context.state);
    const animal = game[this.buildingKey].animals[id];
    if (!objects || !animal) return Promise.resolve();

    const drops = ANIMAL_RESOURCE_DROP[animal.type][level] ?? {};

    Object.entries(drops).forEach(([item, amount], index) => {
      const { amount: boosted } = getResourceDropAmount({
        game,
        animalType: animal.type,
        baseAmount: amount.toNumber(),
        resource: item as AnimalResource,
        multiplier: animal.multiplier ?? 0,
        animal,
      });
      this.scene.time.delayedCall(index * 400, () => {
        if (!objects.container.active) return;
        playYieldFloat(this.scene, {
          x: objects.container.x + 6,
          y: objects.container.y + CELL / 2 + index * 6,
          amount: boosted,
          icon: ITEM_DETAILS[item as InventoryItemName]?.image,
          iconWidth: 8,
          depth: objects.container.depth + 5,
          durationMs: 1400,
        });
      });
    });

    this.resync();
    return new Promise((resolve) =>
      this.scene.time.delayedCall(1400, () => resolve()),
    );
  }

  private ensureSparkleAnim() {
    if (this.scene.anims.exists(`${SPARKLE_KEY}-loop`)) return;
    if (!this.scene.textures.exists(SPARKLE_KEY)) return;
    // [styles.css sparkle-burst] 7 frames over 1s, looping.
    this.scene.anims.create({
      key: `${SPARKLE_KEY}-loop`,
      frames: this.scene.anims.generateFrameNumbers(SPARKLE_KEY, {
        start: 0,
        end: 6,
      }),
      frameRate: 7,
      repeat: -1,
    });
  }

  private resync() {
    void this.sync(this.bridge.select((state) => this.selector(state)));
  }

  /** States are time-gated (awakeAt, love window), so re-derive each second. */
  update(_time: number, delta: number) {
    if (!this.secondElapsed(delta)) return;
    // Drop expired reactions so the derived state takes back over.
    for (const [id, reaction] of this.reactions) {
      if (reaction.until <= Date.now()) this.reactions.delete(id);
    }
    this.resync();
  }

  private destroyAnimal(objects: AnimalObjects) {
    objects.bubble?.destroy();
    objects.message?.destroy();
    if (objects.saleAnchor)
      this.bridge.anchors.removeAnchor(objects.saleAnchor);
    objects.container.destroy(); // children go with it
    objects.zone.destroy();
  }

  protected onDestroy() {
    this.animals.forEach((objects) => this.destroyAnimal(objects));
    this.animals.clear();
    this.unsubscribeDeal?.();
  }
}
