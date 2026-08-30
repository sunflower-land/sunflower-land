import Decimal from "decimal.js-light";
import type {
  Animal,
  AnimalFeedBuffName,
  AnimalFoodName,
  AnimalMedicineName,
  GameState,
  LoveAnimalItem,
} from "features/game/types/game";
import type { AnimalType } from "features/game/types/animals";
import {
  getAnimalFavoriteFood,
  getBoostedFoodQuantity,
  isAnimalFood,
} from "features/game/lib/animals";
import {
  getBarnDelightCost,
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
import { getAnimalLevel } from "features/game/lib/animals";

/**
 * The animal click decision tree [barn/components/Cow.tsx handleClick — the
 * Sheep and Chicken trees are copies with the type swapped].
 *
 * The DOM runs an xstate machine per animal, but the machine only mirrors
 * game state plus two purely-visual bits (the 2s happy/sad reaction after a
 * feed and the produce-drop animation). Here the tree is a single function of
 * game state that dispatches the same events, and the renderer supplies the
 * visual effects through `AnimalEffects` — no machines, no per-animal
 * lifecycle to keep in sync.
 */

export type AnimalBuildingKey = "barn" | "henHouse";

/** The renderer-side visual effects the tree triggers. */
export type AnimalEffects = {
  /** 2s happy/sad emotion after a feed [animalMachine happy/sad states]. */
  showReaction(id: string, reaction: "happy" | "sad"): void;
  /** Floating "+N" XP text (green when the food matches). */
  showXP(id: string, amount: number, color: string): void;
  /** 1s info message (no food selected / not enough / no medicine). */
  showMessage(id: string, message: string): void;
  /**
   * The claim animation [Cow.tsx onReadyClick]: drops + sounds over 1.4s.
   * The tree dispatches `produce.claimed` when the promise resolves; clicks
   * on the animal are ignored while it runs.
   */
  playDrops(id: string): Promise<void>;
  openDetails(id: string): void;
  openLocked(id: string): void;
  /** Mutant reward intercept — claim continues from the modal's button. */
  openMutant(id: string, mutant: string, onContinue: () => void): void;
};

const COLLECT_SOUND: Record<
  AnimalType,
  "cow_collect" | "sheep_collect" | "chicken_collect"
> = {
  Cow: "cow_collect",
  Sheep: "sheep_collect",
  Chicken: "chicken_collect",
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

  constructor(
    private readonly bridge: GameBridge,
    private readonly building: AnimalBuildingKey,
    private readonly effects: AnimalEffects,
  ) {}

  isAnimating(id: string) {
    return this.animating.has(id);
  }

  private game(): GameState {
    return this.bridge.select((state) => state.context.state);
  }

  private animal(id: string): Animal | undefined {
    return this.game()[this.building].animals[id];
  }

  /** [Cow.tsx handleClick] the full tree, in the DOM's order. */
  async onClick(id: string) {
    const game = this.game();
    const animal = this.animal(id);
    if (!animal) return;
    if (this.animating.has(id)) return;

    const type = animal.type;
    const sleeping = animal.awakeAt > Date.now();
    const sick = animal.state === "sick";
    const ready = animal.state === "ready";
    const needsLove = sleeping && this.needsLove(animal);
    const locked = !isAnimalFeedable(this.building, game, id);
    const golden = isAnimalCoveredByGoldenAsset({
      state: game,
      animalType: type,
    });
    const selectedItem = this.bridge.ui.get().selectedItem;

    // Ready wins over everything, sick included [animalMachine initial].
    if (ready && !sleeping) return this.claim(id, animal);
    if (ready && sleeping) return this.details(id);

    if (sick && !sleeping && !needsLove) return this.cure(id, animal);

    if (needsLove) {
      if (golden) return this.details(id);
      return this.love(id, animal);
    }

    // Feed buffs apply from any awake state [Cow.tsx hasBuffSelected].
    if (selectedItem && isAnimalFeedBuffItem(selectedItem)) {
      const count = game.inventory[selectedItem] ?? new Decimal(0);
      if (!animal.feedBuff && count.gte(1)) {
        this.bridge.dispatch("animal.feedBuffApplied", {
          animal: type,
          id,
          item: selectedItem as AnimalFeedBuffName,
        });
        playSound("feed_animal");
        return;
      }
      return this.effects.showMessage(id, translate("animal.noFoodMessage"));
    }

    if (sleeping) return this.details(id);

    if (locked) return this.effects.openLocked(id);

    // Awake and hungry: feed.
    const { foodQuantity: requiredQty } = getBoostedFoodQuantity({
      animalType: type,
      foodQuantity: REQUIRED_FOOD_QTY[type],
      game,
      animal,
    });

    if (golden) return this.feed(id, animal, undefined);

    if (selectedItem && isAnimalFood(selectedItem)) {
      const count = game.inventory[selectedItem] ?? new Decimal(0);
      if (count.lt(requiredQty)) {
        return this.effects.showMessage(
          id,
          translate("animal.notEnoughFood", {
            amount: requiredQty.toNumber(),
          }),
        );
      }
      return this.feed(id, animal, selectedItem as AnimalFoodName);
    }

    this.effects.showMessage(id, translate("animal.noFoodMessage"));
  }

  private needsLove(animal: Animal): boolean {
    return getNextLoveAvailableAt(animal) < Date.now();
  }

  /** [Cow.tsx feedCow] */
  private feed(id: string, animal: Animal, item: AnimalFoodName | undefined) {
    const game = this.game();
    const golden = isAnimalCoveredByGoldenAsset({
      state: game,
      animalType: animal.type,
    });
    const favFood = getAnimalFavoriteFood(animal.type, animal.experience);
    const level = getAnimalLevel(animal.experience, animal.type);

    const updated = this.bridge.dispatch("animal.fed", {
      animal: animal.type,
      id,
      item,
    });
    playSound("feed_animal");

    const { foodXp } = handleFoodXP({
      state: game,
      animal: animal.type,
      level,
      food: golden ? favFood : (item as AnimalFoodName),
    });
    const matched = item === favFood || item === "Omnifeed" || golden;
    if (foodXp) {
      this.effects.showXP(id, foodXp, matched ? "#71e358" : "#ffffff");
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
      playSound("cure_animal");
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
      const drops = this.effects.playDrops(id);
      await wait(500);
      playSound(COLLECT_SOUND[animal.type]);
      await wait(900);
      playSound("level_up");
      await drops;
      this.bridge.dispatch("produce.claimed", { animal: animal.type, id });
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
