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
  getResourceDropAmount,
  isMaxLevel,
} from "features/game/lib/animals";
import { REQUIRED_FOOD_QTY } from "features/game/events/landExpansion/feedAnimal";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "lib/object";
import { queueImage, queueSpritesheet, runLoader } from "../../core/assets";
import { nativeScale } from "../../core/pixelArt";
import { makeClickable } from "../../core/clickable";
import { gridToWorld, WORLD_TILE } from "../../core/coordinates";
import { DEPTHS } from "../../core/depths";
import { EntityRenderer } from "../EntityRenderer";
import { RequestBubbleSprite } from "../../components/RequestBubbleSprite";
import { playYieldFloat } from "../../components/YieldFloat";
import { pixelText } from "../../components/pixelText";
import { AnimalInteraction, type AnimalBuildingKey } from "./animalInteraction";

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

/** [Cow.tsx / Sheep.tsx / Chicken.tsx animalImageInfo] art per state. */
const ANIMAL_ART: Record<
  AnimalType,
  Record<
    "ready" | "sleeping" | "sick" | "idle",
    { image: string; width: number }
  >
> = {
  Cow: {
    ready: { image: SUNNYSIDE.animals.cowReady, width: 13 },
    sleeping: { image: SUNNYSIDE.animals.cowSleeping, width: 13 },
    sick: { image: SUNNYSIDE.animals.cowSick, width: 11 },
    idle: { image: SUNNYSIDE.animals.cowIdle, width: 11 },
  },
  Sheep: {
    ready: { image: SUNNYSIDE.animals.sheepReady, width: 13 },
    sleeping: { image: SUNNYSIDE.animals.sheepSleeping, width: 13 },
    sick: { image: SUNNYSIDE.animals.sheepSick, width: 11 },
    idle: { image: SUNNYSIDE.animals.sheepIdle, width: 11 },
  },
  Chicken: {
    ready: { image: SUNNYSIDE.animals.chickenReady, width: 13 },
    sleeping: { image: SUNNYSIDE.animals.chickenAsleep, width: 13 },
    sick: { image: SUNNYSIDE.animals.chickenSick, width: 11 },
    idle: { image: SUNNYSIDE.animals.chickenIdle, width: 11 },
  },
};

/**
 * [Cow.tsx ANIMAL_EMOTION_ICONS] the badge over the animal, offsets in
 * source px from the 2x2 cell's top-right.
 */
const EMOTION_ICONS: Partial<
  Record<
    AnimalVisualState,
    { icon: string; width: number; top: number; right: number }
  >
> = {
  ready: {
    icon: SUNNYSIDE.icons.expression_ready,
    width: 9,
    top: 2,
    right: -1,
  },
  sleeping: { icon: SUNNYSIDE.icons.sleeping, width: 9, top: 4.5, right: 1.1 },
  happy: { icon: SUNNYSIDE.icons.happy, width: 7, top: 4.5, right: 1.1 },
  sad: { icon: SUNNYSIDE.icons.sad, width: 7, top: 4.5, right: 1.1 },
};

/** [AnimalFeedBuffBadge.tsx] */
const BUFF_ICON: Record<AnimalFeedBuffName, string> = {
  "Salt Lick": powerup,
  "Honey Treat": SUNNYSIDE.icons.lightning,
};

const CELL = 2 * WORLD_TILE; // animals sit in a 2x2-tile cell
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
  art: Phaser.GameObjects.Image;
  zone: Phaser.GameObjects.Zone;
  emotion?: Phaser.GameObjects.Image;
  lock?: Phaser.GameObjects.Image;
  buff?: Phaser.GameObjects.Image;
  bubble?: RequestBubbleSprite;
  bubbleKey?: string;
  barFill?: Phaser.GameObjects.Rectangle;
  levelText?: Phaser.GameObjects.Text;
  sparkle?: Phaser.GameObjects.Sprite;
  /** Visual state last synced, for bulk-claim detection. */
  lastState?: AnimalVisualState;
};

export class AnimalHouseRenderer extends EntityRenderer<Slice> {
  private animals = new Map<string, AnimalObjects>();
  private tickMs = 0;
  private interaction?: AnimalInteraction;
  /** id -> reaction shown until timestamp [animalMachine happy/sad 2s]. */
  private reactions = new Map<
    string,
    { state: "happy" | "sad"; until: number }
  >();
  private unsubscribeDeal?: () => void;

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

    const sorted = getKeys(slice.animals)
      .map((id) => slice.animals[id])
      .sort((a, b) =>
        a.type === b.type
          ? b.experience - a.experience
          : a.type.localeCompare(b.type),
      );

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
   * [animalMachine `initial`] the visual state, in the machine's priority
   * order, plus the transient post-feed reaction.
   */
  private stateOf(animal: Animal): AnimalVisualState {
    const reaction = this.reactions.get(animal.id);
    if (reaction && reaction.until > Date.now()) return reaction.state;

    const sleeping = animal.awakeAt > Date.now();
    const needsLove = getNextLoveAvailableAt(animal) < Date.now();

    if (animal.state === "ready" && sleeping) return "sleeping";
    if (animal.state === "ready") return "ready";
    if (sleeping && needsLove) return "needsLove";
    if (sleeping) return "sleeping";
    if (animal.state === "sick") return "sick";
    return "idle";
  }

  async sync(slice: Slice) {
    const token = this.beginSync();
    Object.values(ANIMAL_ART).forEach((states) =>
      Object.values(states).forEach(({ image }) =>
        queueImage(this.scene, image),
      ),
    );
    Object.values(EMOTION_ICONS).forEach(
      (icon) => icon && queueImage(this.scene, icon.icon),
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
    for (const animal of Object.values(slice.animals)) {
      const request = this.requestFor(animal, game);
      if (request) queueImage(this.scene, ITEM_DETAILS[request].image);
      const level = getAnimalLevel(animal.experience, animal.type);
      const drops = ANIMAL_RESOURCE_DROP[animal.type][level as AnimalLevel];
      Object.keys(drops ?? {}).forEach((item) =>
        queueImage(this.scene, ITEM_DETAILS[item as InventoryItemName].image),
      );
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

    const deal = this.bridge.animalDeal.get();
    for (const { animal, x, y } of placed) {
      this.syncAnimal(animal, x, y, game, !!deal);
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

    if (state === "sick") return "Barn Delight";
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
    dealActive: boolean,
  ) {
    const id = animal.id;
    const state = this.stateOf(animal);
    const locked = !isAnimalFeedable(this.buildingKey, game, id);
    const animating = this.interaction?.isAnimating(id) ?? false;

    // Bulk operations (Feed All) claim without a click — play the same drop
    // animation the DOM does when ready flips to asleep underneath us.
    const objects0 = this.animals.get(id);
    if (objects0?.lastState === "ready" && state === "sleeping" && !animating) {
      this.playDropsVisual(id);
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
    const art = ANIMAL_ART[animal.type][animating ? "ready" : artState];
    if (!this.scene.textures.exists(art.image)) return;

    let objects = objects0;
    if (!objects) {
      const container = this.scene.add.container(0, 0);
      const image = this.scene.add.image(0, 0, art.image).setOrigin(0.5, 0.5);
      const zone = this.scene.add.zone(0, 0, CELL, CELL).setOrigin(0, 0);
      makeClickable(this.scene, zone, () => this.onAnimalClick(id));
      container.add(image);
      objects = { container, art: image, zone };
      this.animals.set(id, objects);
    }
    objects.lastState = state;

    const depth = DEPTHS.ENTITY_BASE + y;
    objects.container.setPosition(x, y);
    objects.container.setDepth(depth);
    objects.zone.setPosition(x, y);
    objects.zone.setDepth(depth);

    // [Cow.tsx] the animal image is centred in the 2x2 cell.
    objects.art.setTexture(art.image);
    nativeScale(objects.art, art.width);
    objects.art.setPosition(CELL / 2 + 0.4, CELL / 2 + 0.8);

    // Deal mode [BarnInside.tsx]: invalid animals dim to 50% and are inert.
    const validForDeal = dealActive
      ? isValidDeal({ animal, deal: this.bridge.animalDeal.get()!.deal })
      : true;
    objects.container.setAlpha(dealActive && !validForDeal ? 0.5 : 1);

    // Emotion badge, top-right of the cell [Cow.tsx ANIMAL_EMOTION_ICONS].
    const emotionState = animating ? "ready" : state;
    const emotion =
      emotionState === "idle" ||
      emotionState === "needsLove" ||
      emotionState === "sick"
        ? undefined
        : EMOTION_ICONS[emotionState];
    if (emotion && this.scene.textures.exists(emotion.icon)) {
      if (!objects.emotion) {
        objects.emotion = this.scene.add
          .image(0, 0, emotion.icon)
          .setOrigin(0, 0);
        objects.container.add(objects.emotion);
      }
      objects.emotion.setTexture(emotion.icon);
      nativeScale(objects.emotion, emotion.width);
      objects.emotion.setPosition(
        CELL - emotion.right - emotion.width,
        emotion.top,
      );
      objects.emotion.setVisible(true);
    } else {
      objects.emotion?.setVisible(false);
    }

    // Over-capacity lock [Cow.tsx], w7 at (right 1, top 1).
    if (locked) {
      if (!objects.lock) {
        objects.lock = this.scene.add
          .image(0, 0, SUNNYSIDE.icons.lock)
          .setOrigin(0, 0);
        nativeScale(objects.lock, 7);
        objects.lock.setPosition(CELL - 1 - 7, 1);
        objects.container.add(objects.lock);
      }
      objects.lock.setVisible(true);
    } else {
      objects.lock?.setVisible(false);
    }

    // Feed buff badge [AnimalFeedBuffBadge.tsx], w7 bottom-right.
    const buffIcon = animal.feedBuff
      ? BUFF_ICON[animal.feedBuff.name]
      : undefined;
    if (buffIcon && this.scene.textures.exists(buffIcon)) {
      if (!objects.buff) {
        objects.buff = this.scene.add.image(0, 0, buffIcon).setOrigin(1, 1);
        objects.container.add(objects.buff);
      }
      objects.buff.setTexture(buffIcon);
      nativeScale(objects.buff, 7);
      objects.buff.setPosition(CELL, CELL);
      objects.buff.setVisible(true);
    } else {
      objects.buff?.setVisible(false);
    }

    // Request bubble [RequestBubble.tsx] at (left 23, top 1); quantity only
    // for a hungry animal without golden cover.
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
          }).foodQuantity.toNumber()
        : undefined;
    const bubbleKey = request ? `${request}#${quantity ?? ""}` : undefined;
    if (bubbleKey !== objects.bubbleKey) {
      objects.bubble?.destroy();
      objects.bubble = undefined;
      objects.bubbleKey = bubbleKey;
      if (request) {
        objects.bubble = new RequestBubbleSprite(this.scene, {
          // [Cow.tsx] beside the head; the DOM's (23, 1) is against a bubble
          // roughly half this one's old size.
          x: 20,
          y: 2,
          icon: ITEM_DETAILS[request].image,
          // Native art size [core/pixelArt.ts]; the bubble fits itself to it.
          iconWidth: 0,
          quantity,
          depth: 0,
        });
        objects.container.add(objects.bubble.container);
      }
    }

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
   * [LevelProgress.tsx] the XP bar + level number under the animal. The bar
   * shows progress into the current level (100% when ready); a ready animal
   * displays the previous level until it wakes.
   */
  private syncLevelProgress(
    objects: AnimalObjects,
    animal: Animal,
    state: AnimalVisualState,
  ) {
    const level = getAnimalLevel(animal.experience, animal.type);
    const displayLevel =
      animal.state === "ready" && !isMaxLevel(animal.type, level)
        ? level - 1
        : level;

    const percentage = (() => {
      if (state === "ready") return 100;
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

    // Bar under the animal's feet, level number to its left [LevelProgress.tsx
    // AnimatedBar — the same 15x7 frame, no time label]. The DOM hangs it off
    // the cell bottom, which leaves a big gap under the smaller animals
    // (chickens sit ~6px tall in a 32px cell), so it rides up to the feet.
    const barX = (CELL - BAR.width) / 2 + 2;
    const barY = CELL - 8;
    if (!objects.barFill) {
      const frame = this.scene.add
        .image(barX, barY, SUNNYSIDE.ui.emptyBar)
        .setOrigin(0, 0);
      frame.setScale(BAR.width / frame.width);
      const background = this.scene.add
        .rectangle(
          barX + BAR.marginLeft,
          barY + BAR.marginTop,
          BAR.innerWidth,
          BAR.innerHeight,
          0x193c3e,
        )
        .setOrigin(0, 0);
      objects.barFill = this.scene.add
        .rectangle(
          barX + BAR.marginLeft,
          barY + BAR.marginTop,
          0,
          BAR.innerHeight,
          0x63c74d,
        )
        .setOrigin(0, 0);
      objects.container.add([frame, background, objects.barFill]);
    }
    objects.barFill.width = Math.floor(
      (BAR.innerWidth * Math.max(0, Math.min(percentage, 100))) / 100,
    );

    if (!objects.levelText) {
      objects.levelText = pixelText(this.scene, 0, 0, "", {
        color: "#71e358",
      }).setOrigin(1, 0.5);
      objects.container.add(objects.levelText);
    }
    objects.levelText.setText(`${displayLevel}`);
    objects.levelText.setPosition(barX - 1, barY + 3.5);
  }

  /** Clicks: bounty-deal selection when a deal is active, else the tree. */
  private onAnimalClick(id: string) {
    const deal = this.bridge.animalDeal.get();
    if (deal) {
      const animal = this.bridge.select(
        (state) => state.context.state[this.buildingKey].animals[id],
      );
      if (!animal || !isValidDeal({ animal, deal: deal.deal })) return;
      this.bridge.animalDeal.set({ ...deal, selectedId: id });
      return;
    }
    void this.interaction?.onClick(id);
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
      playDrops: (id) => this.playDropsVisual(id),
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
    this.scene.time.delayedCall(1000, () => group.destroy());
  }

  /**
   * [ProduceDrops.tsx + Cow.tsx onReadyClick timing] the 1.4s drop
   * animation: each drop item floats up staggered by 400ms.
   */
  private playDropsVisual(id: string): Promise<void> {
    const objects = this.animals.get(id);
    const game = this.bridge.select((state) => state.context.state);
    const animal = game[this.buildingKey].animals[id];
    if (!objects || !animal) return Promise.resolve();

    const level = getAnimalLevel(animal.experience, animal.type);
    const drops = ANIMAL_RESOURCE_DROP[animal.type][level as AnimalLevel] ?? {};

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
    this.tickMs += delta;
    if (this.tickMs < 1000) return;
    this.tickMs = 0;
    // Drop expired reactions so the derived state takes back over.
    for (const [id, reaction] of this.reactions) {
      if (reaction.until <= Date.now()) this.reactions.delete(id);
    }
    this.resync();
  }

  private destroyAnimal(objects: AnimalObjects) {
    objects.bubble?.destroy();
    objects.container.destroy(); // children go with it
    objects.zone.destroy();
  }

  protected onDestroy() {
    this.animals.forEach((objects) => this.destroyAnimal(objects));
    this.animals.clear();
    this.unsubscribeDeal?.();
  }
}
