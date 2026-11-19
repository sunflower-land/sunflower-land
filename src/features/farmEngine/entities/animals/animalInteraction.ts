import Decimal from "decimal.js-light";
import type {
  Animal,
  AnimalFeedBuffName,
  AnimalBuildingKey,
  AnimalFoodName,
  AnimalMedicineName,
  GameState,
  InventoryItemName,
  LoveAnimalItem,
} from "features/game/types/game";
import type { AnimalLevel, AnimalType } from "features/game/types/animals";
import { isBeetle } from "features/game/types/beetles";
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
  getBoostedFoodQuantity,
  getFeedItem,
  getFeedQuantity,
  getNextClaimLevel,
  isFoodForAnimal,
  isMuddy,
  MUD_PER_APPLICATION,
  resolveAnimal,
} from "features/game/lib/animals";
import {
  getBarnDelightCost,
  getFeedBatchSize,
  handleFoodXP,
  REQUIRED_FOOD_QTY,
} from "features/game/events/landExpansion/feedAnimal";
import {
  getAnimalXP,
  getNextLoveAvailableAt,
} from "features/game/events/landExpansion/loveAnimal";
import { isAnimalFeedable } from "features/game/events/landExpansion/buyAnimal";
import { isAnimalFeedBuffItem } from "features/game/events/landExpansion/applyAnimalFeedBuff";
import { isAnimalCoveredByGoldenAsset } from "features/game/events/landExpansion/feedAllAnimals";
import { isWearableActive } from "features/game/lib/wearables";
import { translate } from "lib/i18n/translate";
import type { GameBridge } from "../../bridge/GameBridge";
import { playSound } from "../../core/sounds";

/**
 * The animal click decision tree [barn/components/Cow.tsx handleClick — the
 * Sheep and Chicken trees are copies with the type swapped; the Pig's
 * [pigpen/components/Pig.tsx] differs in the few places marked below].
 *
 * The DOM runs an xstate machine per animal, but the machine only mirrors
 * game state plus two purely-visual bits (the 2s happy/sad reaction after a
 * feed and the produce-drop animation). Here the tree is a single function of
 * game state that dispatches the same events, and the renderer supplies the
 * visual effects through `AnimalEffects` — no machines, no per-animal
 * lifecycle to keep in sync.
 */

export type { AnimalBuildingKey };

/**
 * World anchor over an animal marked for a bulk sale — the renderer registers
 * it, overlay/AnimalHouseUI.tsx hangs the PendingSaleTag off it.
 */
export const animalSaleAnchorId = (id: string) => `animal-sale-${id}`;

/**
 * World anchor over a Pig that can be traded in [PigpenInside.tsx
 * isTradeable] — overlay/AnimalHouseUI.tsx hangs the Bristles Label off it.
 */
export const animalTradeInAnchorId = (id: string) => `animal-trade-in-${id}`;

/** The renderer-side visual effects the tree triggers. */
export type AnimalEffects = {
  /** 2s happy/sad emotion after a feed [animalMachine happy/sad states]. */
  showReaction(id: string, reaction: "happy" | "sad"): void;
  /** Floating "+N" XP text (green when the food matches). */
  showXP(id: string, amount: number, color: string): void;
  /**
   * 1s info message (no food selected / not enough / no medicine / Honey
   * Treat on a golden-covered animal). Replaces the animal's earlier one.
   */
  showMessage(id: string, message: string): void;
  /** Drop the animal's info message early. */
  clearMessage(id: string): void;
  /**
   * The claim animation [Cow.tsx onReadyClick]: the produce of `level` drops
   * with sounds over 1.4s. The tree dispatches `produce.claimed` when the
   * promise resolves; clicks on the animal are ignored while it runs.
   */
  playDrops(id: string, level: AnimalLevel): Promise<void>;
  openDetails(id: string): void;
  openLocked(id: string): void;
  /** Mutant reward intercept — claim continues from the modal's button. */
  openMutant(id: string, mutant: string, onContinue: () => void): void;
};

const COLLECT_SOUND: Record<
  AnimalType,
  "cow_collect" | "sheep_collect" | "chicken_collect" | "pig_collect"
> = {
  Cow: "cow_collect",
  Sheep: "sheep_collect",
  Chicken: "chicken_collect",
  Pig: "pig_collect",
};

/**
 * [Pig.tsx] only an actual feed grunts and a cure squeals; love, Mud and
 * treats keep the generic clip, as every other animal does throughout.
 */
const FEED_SOUND: Record<AnimalType, "feed_animal" | "pig_feed"> = {
  Cow: "feed_animal",
  Sheep: "feed_animal",
  Chicken: "feed_animal",
  Pig: "pig_feed",
};
const CURE_SOUND: Record<AnimalType, "cure_animal" | "pig_cure"> = {
  Cow: "cure_animal",
  Sheep: "cure_animal",
  Chicken: "cure_animal",
  Pig: "pig_cure",
};

/**
 * [Cow.tsx / Sheep.tsx / Chicken.tsx getInfoPopoverMessage] the Honey Treat
 * notice names the golden asset. [Pig.tsx] has no such notice: a treat goes
 * on a Pig whether or not its feed is free.
 */
const GOLDEN_ASSET: Record<Exclude<AnimalType, "Pig">, string> = {
  Cow: "Golden Cow",
  Sheep: "Golden Sheep",
  Chicken: "Gold Egg",
};

/** [Cow.tsx handleShowDetails] suppress the modal right after an event. */
const firedRecently = (bridge: GameBridge) => {
  const actions = bridge.select((state) => state.context.actions);
  const last = actions.length
    ? actions[actions.length - 1]?.createdAt
    : undefined;
  return Date.now() - (last?.getTime?.() ?? 0) < 500;
};

export class AnimalInteraction {
  /** Animals with a claim animation in flight — their clicks are ignored. */
  private animating = new Set<string>();
  /** Animals showing the Honey Treat notice — the next click clears it. */
  private freeFeedNotices = new Set<string>();
  /** Click-claims the renderer has not yet seen land in game state. */
  private clickClaimed = new Set<string>();

  constructor(
    private readonly bridge: GameBridge,
    private readonly building: AnimalBuildingKey,
    private readonly effects: AnimalEffects,
  ) {}

  isAnimating(id: string) {
    return this.animating.has(id);
  }

  /**
   * True once for a claim this tree animated and dispatched itself. The DOM
   * machine is already asleep when its bulk-claim effect runs after a click
   * [Cow.tsx lastSynced effect], so that claim never animates twice; the
   * renderer asks here before treating a claim as a bulk one.
   */
  consumeClickClaim(id: string) {
    return this.clickClaimed.delete(id);
  }

  private game(): GameState {
    return this.bridge.select((state) => state.context.state);
  }

  private animal(id: string): Animal | undefined {
    // The stored awakeAt can be stale under live boost windows — resolve to
    // the windowed wake time, exactly like Cow.tsx does before acting.
    const game = this.game();
    const animal = game[this.building].animals[id];
    return animal && resolveAnimal(animal, game);
  }

  /**
   * [Cow.tsx handleClick] the full tree, in the DOM's order. The DOM branches
   * on its animal machine's state; each machine state is derived here:
   *  - needsLove: asleep with love available — whatever `animal.state` is, so
   *    a banked (ready-but-asleep) animal can still be petted
   *    [animalMachine sleeping TICK -> needsLove];
   *  - sleeping: asleep otherwise;
   *  - ready: `state: "ready"` and awake;
   *  - sick: `animal.state === "sick"`, asleep or not [Cow.tsx `sick`].
   */
  async onClick(id: string) {
    const game = this.game();
    const animal = this.animal(id);
    if (!animal) return;
    // [Cow.tsx `if (showDrops) return`] a claim animation is in flight.
    if (this.animating.has(id)) return;
    // [Cow.tsx] a new click replaces an earlier Honey Treat notice.
    if (this.freeFeedNotices.delete(id)) this.effects.clearMessage(id);

    const type = animal.type;
    const asleep = animal.awakeAt > Date.now();
    const sick = animal.state === "sick";
    const needsLove = asleep && this.needsLove(animal);
    const ready = animal.state === "ready" && !asleep;
    const locked = !isAnimalFeedable(this.building, game, id);
    const golden = isAnimalCoveredByGoldenAsset({
      state: game,
      animalType: type,
    });
    const selectedItem = this.bridge.ui.get().selectedItem;

    if (sick) return this.cure(id, animal);

    if (needsLove && !golden) return this.love(id, animal);

    if (type === "Pig") {
      // [Pig.tsx] a Pig waiting to be petted never reaches the Mud or treat
      // branches: with its feed covered the click only shows its details.
      if (needsLove) return this.details(id);

      // [Pig.tsx] Mud goes on exactly like a treat: after the love flow and
      // with no capacity check.
      if (selectedItem === "Mud") {
        const mud = game.inventory.Mud ?? new Decimal(0);
        if (!isMuddy(animal) && mud.gte(MUD_PER_APPLICATION)) {
          this.bridge.dispatch("animal.mudApplied", { id });
          playSound("feed_animal");
          return;
        }
        return this.effects.showMessage(id, translate("animal.noFoodMessage"));
      }
    }

    // A selected feed buff wins over details, claiming and feeding
    // [Cow.tsx hasBuffSelected].
    if (selectedItem && isAnimalFeedBuffItem(selectedItem)) {
      const buffItem = selectedItem as AnimalFeedBuffName;
      const count = game.inventory[buffItem] ?? new Decimal(0);
      // Honey Treat only cuts feed, and the golden asset already makes it
      // free.
      if (buffItem === "Honey Treat" && golden && type !== "Pig") {
        this.freeFeedNotices.add(id);
        return this.effects.showMessage(
          id,
          translate("animal.honeyTreatFreeFeed", {
            item: GOLDEN_ASSET[type],
          }),
        );
      }
      if (!animal.feedBuff && count.gte(1)) {
        this.bridge.dispatch("animal.feedBuffApplied", {
          animal: type,
          id,
          item: buffItem,
        });
        playSound("feed_animal");
        return;
      }
      return this.effects.showMessage(id, translate("animal.noFoodMessage"));
    }

    if (needsLove && golden) return this.details(id);

    if (asleep) return this.details(id);

    if (ready) return this.claim(id, animal);

    if (locked) return this.effects.openLocked(id);

    // Awake and hungry: one click feeds the whole batch that gets the animal
    // ready [Cow.tsx requiredFoodQty].
    const batch = getFeedBatchSize({ state: game, animal });

    if (golden) return this.feed(id, animal, undefined, batch);

    const { foodQuantity: perFeedQty } = getBoostedFoodQuantity({
      animalType: type,
      foodQuantity: REQUIRED_FOOD_QTY[type],
      game,
      animal,
      now: Date.now(),
    });
    const requiredQty = perFeedQty.mul(batch);

    // Auto-select the favourite food when it is held so a stale selection
    // never feeds the wrong item [Cow.tsx getFeedItem]. `ui.selectedItem` is
    // stale for the rest of this tick, so the chosen item is carried locally.
    const feedItem = getFeedItem({
      animal: type,
      selectedItem,
      favouriteFood: getAnimalFavoriteFood(type, animal.experience),
      inventory: game.inventory,
      requiredQty,
    });
    if (feedItem && feedItem !== selectedItem) {
      this.bridge.selectItem(feedItem);
    }

    if (feedItem && (isFoodForAnimal(type, feedItem) || isBeetle(feedItem))) {
      const count = game.inventory[feedItem] ?? new Decimal(0);
      // A Beetle is one per click; anything else is the whole batch.
      const needed = getFeedQuantity(feedItem, requiredQty);
      if (count.lt(needed)) {
        return this.effects.showMessage(
          id,
          translate("animal.notEnoughFood", { amount: needed.toNumber() }),
        );
      }
      return this.feed(id, animal, feedItem, batch);
    }

    this.effects.showMessage(id, translate("animal.noFoodMessage"));
  }

  private needsLove(animal: Animal): boolean {
    return getNextLoveAvailableAt(animal, animal.awakeAt) < Date.now();
  }

  /** [Cow.tsx feedCow + getAnimalXPEarned] */
  private feed(
    id: string,
    animal: Animal,
    item: InventoryItemName | undefined,
    batch: number,
  ) {
    const game = this.game();
    const golden = isAnimalCoveredByGoldenAsset({
      state: game,
      animalType: animal.type,
    });
    const favFood = getAnimalFavoriteFood(animal.type, animal.experience);
    const level = getAnimalLevel(animal.experience, animal.type);

    // Captured before feeding: a level-up changes what the same feed is
    // worth. A Beetle is one per click; anything else is the whole batch.
    const { foodXp } = handleFoodXP({
      state: game,
      animal: animal.type,
      level,
      food: golden ? favFood : (item as AnimalFoodName),
      // [Pig.tsx getAnimalXPEarned] a muddy Pig's feed is worth more.
      ...(animal.type === "Pig" ? { mud: animal.mud } : {}),
    });
    const xp = item && isBeetle(item) ? foodXp : foodXp * batch;

    const updated = this.bridge.dispatch("animal.fed", {
      animal: animal.type,
      id,
      item: item ? (item as AnimalFoodName) : undefined,
    });
    playSound(FEED_SOUND[animal.type]);

    // [Cow.tsx xpIndicatorColor]
    const matched =
      item === favFood ||
      item === "Omnifeed" ||
      (!!item && isBeetle(item)) ||
      golden;
    if (xp) {
      this.effects.showXP(id, xp, matched ? "#71e358" : "#ffffff");
    }

    // The persisted state after a feed is the reaction [animalMachine FEED].
    const after = updated.context.state[this.building].animals[id];
    if (after?.state === "happy" || after?.state === "sad") {
      this.effects.showReaction(id, after.state);
    }
  }

  /** [Cow.tsx onLoveClick + loveCow] */
  private love(id: string, animal: Animal) {
    const game = this.game();
    const item = animal.item;
    if ((game.inventory[item] ?? new Decimal(0)).lt(1)) {
      return this.details(id);
    }

    this.bridge.selectItem(item);
    this.bridge.dispatch("animal.loved", {
      animal: animal.type,
      id,
      item: item as LoveAnimalItem,
    });
    playSound("feed_animal");

    const { animalXP } = getAnimalXP({
      state: game,
      name: item as LoveAnimalItem,
      animal: animal.type,
    });
    if (animalXP) this.effects.showXP(id, animalXP, "#ffffff");
  }

  /** [Cow.tsx onSickClick + cureCow] */
  private cure(id: string, animal: Animal) {
    const game = this.game();
    const medicine = game.inventory["Barn Delight"] ?? new Decimal(0);
    const { amount: cost } = getBarnDelightCost({ state: game });
    const hasSyringe = isWearableActive({ name: "Oracle Syringe", game });

    if (hasSyringe || medicine.gte(cost)) {
      playSound(CURE_SOUND[animal.type]);
      this.bridge.dispatch("animal.fed", {
        animal: animal.type,
        id,
        item: "Barn Delight" as AnimalMedicineName,
      });
      return;
    }

    this.effects.showMessage(id, translate("animal.noMedicine"));
  }

  /** [Cow.tsx onReadyClick] mutant intercept, then the drop animation. */
  private claim(id: string, animal: Animal) {
    const mutant = animal.reward?.items?.[0]?.name;
    if (mutant) {
      return this.effects.openMutant(id, mutant, () => this.runClaim(id));
    }
    return this.runClaim(id);
  }

  private async runClaim(id: string) {
    const animal = this.animal(id);
    if (!animal || this.animating.has(id)) return;

    this.animating.add(id);
    try {
      playSound("produce_drop");
      // Read BEFORE the claim: the level this claim pays [Cow.tsx
      // `setDropsLevel(getNextClaimLevel(cow))`].
      const drops = this.effects.playDrops(id, getNextClaimLevel(animal));
      await wait(500);
      playSound(COLLECT_SOUND[animal.type]);
      await wait(900);
      playSound("level_up");
      await drops;
      this.bridge.dispatch("produce.claimed", { animal: animal.type, id });
      // Only once the claim went through: the renderer must not replay the
      // drops for it as a bulk claim.
      this.clickClaimed.add(id);
    } finally {
      this.animating.delete(id);
    }
  }

  private details(id: string) {
    if (firedRecently(this.bridge)) return;
    this.effects.openDetails(id);
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
