import {
  collectEggs as landExpansionCollectEggs,
  LandExpansionCollectEggAction as LandExpansionCollectEggsAction,
} from "./landExpansion/collectEgg";
import {
  LandExpansionPlantAction,
  plant as landExpansionPlant,
} from "./landExpansion/plant";
import {
  harvest as landExpansionHarvest,
  LandExpansionHarvestAction,
} from "./landExpansion/harvest";
import {
  chop as landExpansionChop,
  LandExpansionChopAction,
} from "./landExpansion/chop";
import {
  mineStone as landExpansionMineStone,
  LandExpansionStoneMineAction,
} from "./landExpansion/stoneMine";
import {
  mineGold as landExpansionMineGold,
  LandExpansionMineGoldAction,
} from "./landExpansion/mineGold";

import {
  mineIron as landExpansionIronMine,
  LandExpansionIronMineAction,
} from "./landExpansion/ironMine";

import {
  feedChicken as LandExpansionFeedChicken,
  LandExpansionFeedChickenAction,
} from "./landExpansion/feedChicken";

import { GameState } from "../types/game";
import { trade, TradeAction } from "./trade";
import { claimAirdrop, ClaimAirdropAction } from "./claimAirdrop";
import {
  placeBuilding,
  PlaceBuildingAction,
} from "./landExpansion/placeBuilding";
import {
  constructBuilding,
  ConstructBuildingAction,
} from "./landExpansion/constructBuilding";
import {
  placeCollectible,
  PlaceCollectibleAction,
} from "./landExpansion/placeCollectible";
import { cook, RecipeCookedAction } from "./landExpansion/cook";
import {
  collectRecipe,
  CollectRecipeAction,
} from "./landExpansion/collectRecipe";
import { feedBumpkin, FeedBumpkinAction } from "./landExpansion/feedBumpkin";
import { detectBot, DetectBotAction } from "./detectBot";
import { pickSkill, PickSkillAction } from "./landExpansion/pickSkill";
import { seedBought, SeedBoughtAction } from "./landExpansion/seedBought";
import {
  claimAchievement,
  ClaimAchievementAction,
} from "./landExpansion/claimAchievement";
import { buyChicken, BuyChickenAction } from "./landExpansion/buyChicken";
import { placeChicken, PlaceChickenAction } from "./landExpansion/placeChicken";
import {
  fulfillGrubOrder,
  FulFillGrubOrderAction,
} from "./landExpansion/fulfillGrubOrder";
import { craftTool, CraftToolAction } from "./landExpansion/craftTool";
import {
  buyDecoration,
  buyDecorationAction,
} from "./landExpansion/buyDecoration";
import { sellCrop, SellCropAction } from "./landExpansion/sellCrop";
import {
  fertiliseCrop as landExpansionFertilise,
  LandExpansionFertiliseCropAction,
} from "./landExpansion/fertiliseCrop";
import {
  removeCrop as landExpansionRemoveCrop,
  LandExpansionRemoveCropAction,
} from "./landExpansion/removeCrop";
import {
  removeBuilding,
  RemoveBuildingAction,
} from "./landExpansion/removeBuilding";
import {
  removeCollectible,
  RemoveCollectibleAction,
} from "./landExpansion/removeCollectible";
import { beanBought, BeanBoughtAction } from "./landExpansion/buyBean";
import {
  collectCropReward,
  CollectCropRewardAction,
} from "./landExpansion/collectCropReward";
import {
  collectTreeReward,
  CollectTreeRewardAction,
} from "features/game/events/landExpansion/collectTreeReward";
import {
  removeChicken,
  RemoveChickenAction,
} from "./landExpansion/removeChicken";
import { plantFruit, PlantFruitAction } from "./landExpansion/fruitPlanted";
import {
  harvestFruit,
  HarvestFruitAction,
} from "./landExpansion/fruitHarvested";
import {
  RemoveFruitTreeAction,
  removeFruitTree,
} from "./landExpansion/fruitTreeRemoved";
import {
  craftCollectible,
  CraftCollectibleAction,
} from "./landExpansion/craftCollectible";
import { sellTreasure, SellTreasureAction } from "./landExpansion/treasureSold";
import { restock, RestockAction } from "./landExpansion/restock";
import { sellGarbage, SellGarbageAction } from "./landExpansion/garbageSold";
import { startChore, StartChoreAction } from "./landExpansion/startChore";
import {
  completeChore,
  CompleteChoreAction,
} from "./landExpansion/completeChore";
import { placeTree, PlaceTreeAction } from "./landExpansion/placeTree";
import { expandLand, ExpandLandAction } from "./landExpansion/expandLand";
import { placePlot, PlacePlotAction } from "./landExpansion/placePlot";
import { placeStone, PlaceStoneAction } from "./landExpansion/placeStone";
import { placeGold, PlaceGoldAction } from "./landExpansion/placeGold";
import { placeIron, PlaceIronAction } from "./landExpansion/placeIron";
import {
  placeFruitPatch,
  PlaceFruitPatchAction,
} from "./landExpansion/placeFruitPatch";
import {
  collectEasterEgg,
  CollectEasterEggAction,
} from "features/game/events/landExpansion/collectEasterEgg";
import { ConversationEnded, endConversation } from "./landExpansion/converse";

export type PlayingEvent =
  | TradeAction
  | LandExpansionPlantAction
  | LandExpansionFertiliseCropAction
  | LandExpansionRemoveCropAction
  | LandExpansionHarvestAction
  | LandExpansionChopAction
  | LandExpansionStoneMineAction
  | LandExpansionIronMineAction
  | LandExpansionMineGoldAction
  | ClaimAirdropAction
  | RecipeCookedAction
  | CollectRecipeAction
  | FeedBumpkinAction
  | DetectBotAction
  | PickSkillAction
  | SeedBoughtAction
  | ClaimAchievementAction
  | FulFillGrubOrderAction
  | LandExpansionFeedChickenAction
  | CraftToolAction
  | buyDecorationAction
  | SellCropAction
  | RemoveBuildingAction
  | RemoveCollectibleAction
  | RemoveChickenAction
  | BeanBoughtAction
  | CollectCropRewardAction
  | CollectTreeRewardAction
  | LandExpansionCollectEggsAction
  | PlantFruitAction
  | HarvestFruitAction
  | RemoveFruitTreeAction
  | CraftCollectibleAction
  | SellTreasureAction
  | RestockAction
  | SellGarbageAction
  | StartChoreAction
  | CompleteChoreAction
  | ExpandLandAction
  | CollectEasterEggAction
  | ConversationEnded;

export type PlacementEvent =
  | ConstructBuildingAction
  | PlaceBuildingAction
  | PlaceCollectibleAction
  | BuyChickenAction
  | PlaceChickenAction
  | PlaceTreeAction
  | PlacePlotAction
  | PlaceStoneAction
  | PlaceGoldAction
  | PlaceIronAction
  | PlaceFruitPatchAction;

export type GameEvent = PlayingEvent | PlacementEvent;
export type GameEventName<T> = Extract<T, { type: string }>["type"];

type EventNames = GameEventName<GameEvent>;

export function isEventType<T extends PlayingEvent>(
  action: PlayingEvent,
  typeName: T["type"]
): action is T {
  return action.type === typeName;
}

/**
 * Type which enables us to map the event name to the payload containing that event name
 */
type Handlers<T> = {
  [Name in GameEventName<T>]: (options: {
    state: GameState;
    // Extract the correct event payload from the list of events
    action: Extract<GameEventName<T>, { type: Name }>;
  }) => GameState;
};

export const PLAYING_EVENTS: Handlers<PlayingEvent> = {
  "item.traded": trade,
  "airdrop.claimed": claimAirdrop,
  "bot.detected": detectBot,
  "seed.planted": landExpansionPlant,
  "crop.harvested": landExpansionHarvest,
  "crop.fertilised": landExpansionFertilise,
  "crop.removed": landExpansionRemoveCrop,
  "chicken.collectEgg": landExpansionCollectEggs,
  "stoneRock.mined": landExpansionMineStone,
  "ironRock.mined": landExpansionIronMine,
  "goldRock.mined": landExpansionMineGold,
  "timber.chopped": landExpansionChop,
  "recipe.cooked": cook,
  "recipe.collected": collectRecipe,
  "bumpkin.feed": feedBumpkin,
  "skill.picked": pickSkill,
  "seed.bought": seedBought,
  "achievement.claimed": claimAchievement,
  "grubOrder.fulfilled": fulfillGrubOrder,
  "chicken.fed": LandExpansionFeedChicken,
  "tool.crafted": craftTool,
  "decoration.bought": buyDecoration,
  "crop.sold": sellCrop,
  "building.removed": removeBuilding,
  "collectible.removed": removeCollectible,
  "chicken.removed": removeChicken,
  "bean.bought": beanBought,
  "cropReward.collected": collectCropReward,
  "treeReward.collected": collectTreeReward,
  "fruit.planted": plantFruit,
  "fruit.harvested": harvestFruit,
  "fruitTree.removed": removeFruitTree,
  "collectible.crafted": craftCollectible,
  "treasure.sold": sellTreasure,
  "shops.restocked": restock,
  "garbage.sold": sellGarbage,
  "chore.completed": completeChore,
  "chore.started": startChore,
  "land.expanded": expandLand,
  "easterEgg.collected": collectEasterEgg,
  "conversation.ended": endConversation,
};

export const PLACEMENT_EVENTS: Handlers<PlacementEvent> = {
  "building.constructed": constructBuilding,
  "building.placed": placeBuilding,
  "collectible.placed": placeCollectible,
  "chicken.bought": buyChicken,
  "chicken.placed": placeChicken,
  "tree.placed": placeTree,
  "plot.placed": placePlot,
  "stone.placed": placeStone,
  "gold.placed": placeGold,
  "iron.placed": placeIron,
  "fruitPatch.placed": placeFruitPatch,
};

export const EVENTS = { ...PLAYING_EVENTS, ...PLACEMENT_EVENTS };
