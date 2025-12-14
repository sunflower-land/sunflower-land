// Animal domain events
export { buyAnimal } from "./buyAnimal";
export type { BuyAnimalAction } from "./buyAnimal";

export { feedAnimal, ANIMAL_SLEEP_DURATION } from "./feedAnimal";
export type { FeedAnimalAction } from "./feedAnimal";

export { loveAnimal } from "./loveAnimal";
export type { LoveAnimalAction } from "./loveAnimal";

export { sellAnimal } from "./sellAnimal";
export type { SellAnimalAction } from "./sellAnimal";

export { claimProduce } from "./claimProduce";
export type { ClaimProduceAction } from "./claimProduce";

export { wakeAnimal, getAnimalToy } from "./wakeUpAnimal";
export type { WakeUpAnimalAction } from "./wakeUpAnimal";

import { buyAnimal } from "./buyAnimal";
import { feedAnimal } from "./feedAnimal";
import { loveAnimal } from "./loveAnimal";
import { sellAnimal } from "./sellAnimal";
import { claimProduce } from "./claimProduce";
import { wakeAnimal } from "./wakeUpAnimal";

// Event handlers grouped by domain
export const ANIMAL_EVENTS = {
  "animal.bought": buyAnimal,
  "animal.fed": feedAnimal,
  "animal.loved": loveAnimal,
  "animal.sold": sellAnimal,
  "produce.claimed": claimProduce,
  "animal.wakeUp": wakeAnimal,
} as const;
