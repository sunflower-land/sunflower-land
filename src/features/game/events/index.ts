import { craft, CraftAction } from "./craft";
import { sell, SellAction } from "./sell";
import { plant, PlantAction } from "./plant";
import { harvest, HarvestAction } from "./harvest";
import { removeCrop, RemoveCropAction } from "./removeCrop";
import { mineGold, GoldMineAction } from "./goldMine";
import { mineStone, StoneMineAction } from "./stoneMine";
import { mineIron, IronMineAction } from "./ironMine";
import { chop, ChopAction } from "./chop";
import { openReward, OpenRewardAction } from "./rewarded";
import { collectEggs, CollectAction } from "./collectEgg";
import { feedChicken, FeedAction } from "./feedChicken";
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

import { GameState } from "../types/game";
import { trade, TradeAction } from "./trade";
import { PebbleStrikeAction, strikePebble } from "./landExpansion/pebbleStrike";
import { chopShrub, ChopShrubAction } from "./chopShrub";
import { reveal, RevealAction } from "./revealExpansion";
import { fertiliseCrop, FertiliseCropAction } from "./fertiliseCrop";
import { claimAirdrop, ClaimAirdropAction } from "./claimAirdrop";

export type GameEvent =
  | CraftAction
  | SellAction
  | PlantAction
  | HarvestAction
  | StoneMineAction
  | IronMineAction
  | GoldMineAction
  | ChopAction
  | OpenRewardAction
  | FeedAction
  | RemoveCropAction
  | CollectAction
  | TradeAction
  | LandExpansionPlantAction
  | LandExpansionHarvestAction
  | LandExpansionChopAction
  | LandExpansionStoneMineAction
  | PebbleStrikeAction
  | TradeAction
  | ChopShrubAction
  | RevealAction
  | FertiliseCropAction
  | ClaimAirdropAction;

export type EventName = Extract<GameEvent, { type: string }>["type"];

/**
 * Type which enables us to map the event name to the payload containing that event name
 */
type Handlers = {
  [Name in EventName]: (options: {
    state: GameState;
    // Extract the correct event payload from the list of events
    action: Extract<GameEvent, { type: Name }>;
  }) => GameState;
};

export const EVENTS: Handlers = {
  "item.planted": plant,
  "item.harvested": harvest,
  "item.crafted": craft,
  "item.sell": sell,
  "stone.mined": mineStone,
  "iron.mined": mineIron,
  "gold.mined": mineGold,
  "tree.chopped": chop,
  "reward.opened": openReward,
  "chicken.collectEgg": collectEggs,
  "chicken.feed": feedChicken,
  "item.traded": trade,
  "item.removed": removeCrop,
  "airdrop.claimed": claimAirdrop,
  // Land Expansion Handlers
  "seed.planted": landExpansionPlant,
  "crop.harvested": landExpansionHarvest,
  "pebble.struck": strikePebble,
  "shrub.chopped": chopShrub,
  "expansion.revealed": reveal,
  "timber.chopped": landExpansionChop,
  "rock.mined": landExpansionMineStone,
  "item.fertilised": fertiliseCrop,
};
