import Decimal from "decimal.js-light";
import { useActor } from "@xstate/react";
import React, { useContext, useState,useEffect } from "react";
import { GameState, Inventory, InventoryItemName } from "../../../../game/types/game";
import { Context } from "features/game/GameProvider";
import { Crop } from "features/game/types/crops";

//All farming buffs

export type CropName =
  | "Sunflower"
  | "Potato"
  | "Pumpkin"
  | "Carrot"
  | "Cabbage"
  | "Beetroot"
  | "Cauliflower"
  | "Parsnip"
  | "Radish"
  | "Wheat"

export var Crops: Record<
  CropName,
  {
    seedPrice: number;
    sellPrice: number;
    growthTime: number;
    harvestMult: number;
    key: string[];
  }
> = {
  "Sunflower": {
    seedPrice: 1,
    sellPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["1"]
  },
  "Potato": {
    seedPrice: 1,
    sellPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["2"]
  },
  "Pumpkin": {
    seedPrice: 1,
    sellPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["3"]
  },
  "Carrot": {
    seedPrice: 1,
    sellPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["4"]
  },
  "Cabbage": {
    seedPrice: 1,
    sellPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["5"]
  },
  "Beetroot": {
    seedPrice: 1,
    sellPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["6"]
  },
  "Cauliflower": {
    seedPrice: 1,
    sellPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["7"]
  },
  "Parsnip": {
    seedPrice: 1,
    sellPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["8"]
  },
  "Radish": {
    seedPrice: 1,
    sellPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["9"]
  },
  "Wheat": {
    seedPrice: 1,
    sellPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["10"]
  }
};

var hasGreenThumbBuff = false;

export var greenThumbBuff = (inventory: Inventory ) => {
  if ((
      inventory["Green Thumb"]?.greaterThanOrEqualTo(1)) &&
      hasGreenThumbBuff == false)
  {
    Crops.Sunflower.sellPrice = Crops.Sunflower.sellPrice * 1.05
    Crops.Potato.sellPrice = Crops.Potato.sellPrice * 1.05
    Crops.Pumpkin.sellPrice = Crops.Pumpkin.sellPrice * 1.05
    Crops.Carrot.sellPrice = Crops.Carrot.sellPrice * 1.05
    Crops.Cabbage.sellPrice = Crops.Cabbage.sellPrice * 1.05
    Crops.Beetroot.sellPrice = Crops.Beetroot.sellPrice * 1.05
    Crops.Cauliflower.sellPrice = Crops.Cauliflower.sellPrice * 1.05
    Crops.Parsnip.sellPrice = Crops.Parsnip.sellPrice * 1.05
    Crops.Radish.sellPrice = Crops.Radish.sellPrice * 1.05
    Crops.Wheat.sellPrice = Crops.Wheat.sellPrice * 1.05

    hasGreenThumbBuff = true
  }
}

var hasSeedSpecialistBuff = false;

export var seedSpecialistBuff = (inventory: Inventory ) => {
  if ((
      inventory["Seed Specialist"]?.greaterThanOrEqualTo(1)) &&
      hasSeedSpecialistBuff == false)
  {
    Crops.Sunflower.growthTime = Crops.Sunflower.growthTime * 0.9
    Crops.Potato.growthTime = Crops.Potato.growthTime * 0.9
    Crops.Pumpkin.growthTime = Crops.Pumpkin.growthTime * 0.9
    Crops.Carrot.growthTime = Crops.Carrot.growthTime * 0.9
    Crops.Cabbage.growthTime = Crops.Cabbage.growthTime * 0.9
    Crops.Beetroot.growthTime = Crops.Beetroot.growthTime * 0.9
    Crops.Cauliflower.growthTime = Crops.Cauliflower.growthTime * 0.9
    Crops.Parsnip.growthTime = Crops.Parsnip.growthTime * 0.9
    Crops.Radish.growthTime = Crops.Radish.growthTime * 0.9
    Crops.Wheat.growthTime = Crops.Wheat.growthTime * 0.9
    hasSeedSpecialistBuff = true
  }
}

var hasNancyBuff = false;

export var nancyBuff = (inventory: Inventory ) => {
  if ((
      inventory.Nancy?.greaterThanOrEqualTo(1) ||
      inventory.Scarecrow?.greaterThanOrEqualTo(1) ||
      inventory.Kuebiko?.greaterThanOrEqualTo(1)) &&
      hasNancyBuff == false)
  {
    Crops.Sunflower.growthTime = Crops.Sunflower.growthTime * 0.85
    Crops.Potato.growthTime = Crops.Potato.growthTime * 0.85
    Crops.Pumpkin.growthTime = Crops.Pumpkin.growthTime * 0.85
    Crops.Carrot.growthTime = Crops.Carrot.growthTime * 0.85
    Crops.Cabbage.growthTime = Crops.Cabbage.growthTime * 0.85
    Crops.Beetroot.growthTime = Crops.Beetroot.growthTime * 0.85
    Crops.Cauliflower.growthTime = Crops.Cauliflower.growthTime * 0.85
    Crops.Parsnip.growthTime = Crops.Parsnip.growthTime * 0.85
    Crops.Radish.growthTime = Crops.Radish.growthTime * 0.85
    Crops.Wheat.growthTime = Crops.Wheat.growthTime * 0.85

    hasNancyBuff = true
  }
}

var hasScarecrowBuff = false;

export var scarecrowBuff = (inventory: Inventory ) => {
  if ((
      inventory.Scarecrow?.greaterThanOrEqualTo(1) ||
      inventory.Kuebiko?.greaterThanOrEqualTo(1)) &&
      hasScarecrowBuff == false)
  {
    Crops.Sunflower.harvestMult = Crops.Sunflower.harvestMult * 1.2
    Crops.Potato.harvestMult = Crops.Potato.harvestMult * 1.2
    Crops.Pumpkin.harvestMult = Crops.Pumpkin.harvestMult * 1.2
    Crops.Carrot.harvestMult = Crops.Carrot.harvestMult * 1.2
    Crops.Cabbage.harvestMult = Crops.Cabbage.harvestMult * 1.2
    Crops.Beetroot.harvestMult = Crops.Beetroot.harvestMult * 1.2
    Crops.Cauliflower.harvestMult = Crops.Cauliflower.harvestMult * 1.2
    Crops.Parsnip.harvestMult = Crops.Parsnip.harvestMult * 1.2
    Crops.Radish.harvestMult = Crops.Radish.harvestMult * 1.2
    Crops.Wheat.harvestMult = Crops.Wheat.harvestMult * 1.2

    hasScarecrowBuff = true
  }
}

var hasKuebikoBuff = false;

export var kuebikoBuff = (inventory: Inventory ) => {
  if ((
      inventory.Kuebiko?.greaterThanOrEqualTo(1)) &&
      hasKuebikoBuff == false)
  {
    Crops.Sunflower.seedPrice = Crops.Sunflower.seedPrice * 0
    Crops.Potato.seedPrice = Crops.Potato.seedPrice * 0
    Crops.Pumpkin.seedPrice = Crops.Pumpkin.seedPrice * 0
    Crops.Carrot.seedPrice = Crops.Carrot.seedPrice * 0
    Crops.Cabbage.seedPrice = Crops.Cabbage.seedPrice * 0
    Crops.Beetroot.seedPrice = Crops.Beetroot.seedPrice * 0
    Crops.Cauliflower.seedPrice = Crops.Cauliflower.seedPrice * 0
    Crops.Parsnip.seedPrice = Crops.Parsnip.seedPrice * 0
    Crops.Radish.seedPrice = Crops.Radish.seedPrice * 0
    Crops.Wheat.seedPrice = Crops.Wheat.seedPrice * 0

    hasKuebikoBuff = true
  }
}

var hasEasterBunnyBuff = false;

export var easterBunnyBuff = (inventory: Inventory ) => {
  if ((
      inventory["Easter Bunny"]?.greaterThanOrEqualTo(1)) &&
      hasEasterBunnyBuff == false)
  {
    Crops.Carrot.harvestMult = Crops.Carrot.harvestMult * 1.2
    hasEasterBunnyBuff = true 
  }
}

var hasGoldenCauliflowerBuff = false;

export var goldenCauliflowerBuff = (inventory: Inventory ) => {
  if ((
      inventory["Golden Cauliflower"]?.greaterThanOrEqualTo(1)) &&
      hasGoldenCauliflowerBuff == false)
  {
    Crops.Cauliflower.harvestMult = Crops.Cauliflower.harvestMult * 2
    hasGoldenCauliflowerBuff = true 
  }
}

var hasMysteriousParsnipBuff = false;

export var mysteriousParsnipBuff = (inventory: Inventory ) => {
  if ((
      inventory["Mysterious Parsnip"]?.greaterThanOrEqualTo(1)) &&
      hasMysteriousParsnipBuff == false)
  {
    Crops.Parsnip.growthTime = Crops.Parsnip.growthTime * 0.5
    hasMysteriousParsnipBuff = true 
  }
}

//All gathering buffs

export type GatheringName =
  | "Wood"
  | "Stone"
  | "Iron"
  | "Gold"

export var Gathering: Record<
  GatheringName,
  {
    toolPrice: number;
    harvestingPrice: number;
    growthTime: number;
    harvestMult: number;
    key: string[];
  }
> = {
  "Wood": {
    toolPrice: 1,
    harvestingPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["1"]
  },
  "Stone": {
    toolPrice: 1,
    harvestingPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["2"]
  },
  "Iron": {
    toolPrice: 1,
    harvestingPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["3"]
  },
  "Gold": {
    toolPrice: 1,
    harvestingPrice: 1,
    growthTime: 1,
    harvestMult: 1,
    key: ["4"]
  },
};

var hasLumberjackBuff = false;

export var lumberjackBuff = (inventory: Inventory ) => {
  if (( 
      inventory.Lumberjack?.greaterThanOrEqualTo(1)) &&
      hasLumberjackBuff == false)
  {
    Gathering.Wood.harvestMult = Gathering.Wood.harvestMult * 1.1
    hasLumberjackBuff = true 
  }
}

var hasProspectorBuff = false;

export var prospectorBuff = (inventory: Inventory ) => {
  if (( 
      inventory.Prospector?.greaterThanOrEqualTo(1)) &&
      hasProspectorBuff == false)
  {
    Gathering.Stone.harvestMult = Gathering.Stone.harvestMult * 1.2
    hasProspectorBuff = true 
  }
}

var hasLoggerBuff = false;

export var loggerBuff = (inventory: Inventory ) => {
  if (( 
      inventory.Logger?.greaterThanOrEqualTo(1)) &&
      hasLoggerBuff == false)
  {
    Gathering.Wood.harvestingPrice = Gathering.Wood.harvestingPrice * 0.75
    hasLoggerBuff = true 
  }
}

var hasGoldRushBuff = false;

export var goldRushBuff = (inventory: Inventory ) => {
  if (( 
      inventory["Gold Rush"]?.greaterThanOrEqualTo(1)) &&
      hasGoldRushBuff == false)
  {
    Gathering.Gold.harvestMult = Gathering.Gold.harvestMult * 1.5
    hasGoldRushBuff = true 
  }
}

var hasWoodyTheBeaverBuff = false;

export var woodyTheBeaverBuff = (inventory: Inventory ) => {
  if ((
      inventory["Woody the Beaver"]?.greaterThanOrEqualTo(1) || 
      inventory["Apprentice Beaver"]?.greaterThanOrEqualTo(1) || 
      inventory["Foreman Beaver"]?.greaterThanOrEqualTo(1)) &&
      hasWoodyTheBeaverBuff == false)
  {
    Gathering.Wood.harvestMult = Gathering.Wood.harvestMult * 1.2
    hasWoodyTheBeaverBuff = true 
  }
}

var hasApprenticeBeaverBuff = false;

export var apprenticeBeaverBuff = (inventory: Inventory ) => {
  if ((
      inventory["Apprentice Beaver"]?.greaterThanOrEqualTo(1) ||
      inventory["Foreman Beaver"]?.greaterThanOrEqualTo(1)) &&
      hasApprenticeBeaverBuff == false)
  {
    Gathering.Wood.growthTime = Gathering.Wood.growthTime * 0.5
    hasApprenticeBeaverBuff = true 
  }
}

var hasForemanBeaverBuff = false;

export var foremanBeaverBuff = (inventory: Inventory ) => {
  if ((
      inventory["Foreman Beaver"]?.greaterThanOrEqualTo(1)) &&
      hasForemanBeaverBuff == false)
  {
    Gathering.Wood.harvestingPrice = Gathering.Wood.harvestingPrice * 0
    hasForemanBeaverBuff = true 
  }
}

//All contributor buffs

var hasArtistBuff = false;

export var artistBuff = (inventory: Inventory ) => {
  if ((
      inventory.Artist?.greaterThanOrEqualTo(1)) &&
      hasArtistBuff == false)
  {

    Crops.Sunflower.seedPrice = Crops.Sunflower.seedPrice * 0.9
    Crops.Potato.seedPrice = Crops.Potato.seedPrice * 0.9
    Crops.Pumpkin.seedPrice = Crops.Pumpkin.seedPrice * 0.9
    Crops.Carrot.seedPrice = Crops.Carrot.seedPrice * 0.9
    Crops.Cabbage.seedPrice = Crops.Cabbage.seedPrice * 0.9
    Crops.Beetroot.seedPrice = Crops.Beetroot.seedPrice * 0.9
    Crops.Cauliflower.seedPrice = Crops.Cauliflower.seedPrice * 0.9
    Crops.Parsnip.seedPrice = Crops.Parsnip.seedPrice * 0.9
    Crops.Radish.seedPrice = Crops.Radish.seedPrice * 0.9
    Crops.Wheat.seedPrice = Crops.Wheat.seedPrice * 0.9

    Gathering.Wood.toolPrice = Gathering.Wood.toolPrice * 0.9
    Gathering.Stone.toolPrice = Gathering.Stone.toolPrice * 0.9
    Gathering.Iron.toolPrice = Gathering.Iron.toolPrice * 0.9
    Gathering.Gold.toolPrice = Gathering.Gold.toolPrice * 0.9

    hasArtistBuff = true
  }
}

var hasCoderBuff = false;

export var coderBuff = (inventory: Inventory ) => {
  if ((
      inventory.Coder?.greaterThanOrEqualTo(1)) &&
      hasCoderBuff == false)
  {

    Crops.Sunflower.harvestMult = Crops.Sunflower.harvestMult * 1.2
    Crops.Potato.harvestMult = Crops.Potato.harvestMult * 1.2
    Crops.Pumpkin.harvestMult = Crops.Pumpkin.harvestMult * 1.2
    Crops.Carrot.harvestMult = Crops.Carrot.harvestMult * 1.2
    Crops.Cabbage.harvestMult = Crops.Cabbage.harvestMult * 1.2
    Crops.Beetroot.harvestMult = Crops.Beetroot.harvestMult * 1.2
    Crops.Cauliflower.harvestMult = Crops.Cauliflower.harvestMult * 1.2
    Crops.Parsnip.harvestMult = Crops.Parsnip.harvestMult * 1.2
    Crops.Radish.harvestMult = Crops.Radish.harvestMult * 1.2
    Crops.Wheat.harvestMult = Crops.Wheat.harvestMult * 1.2

    hasCoderBuff = true
  }
}

var hasDiscordModBuff = false;

export var discordModBuff = (inventory: Inventory ) => {
  if ((
      inventory["Discord Mod"]?.greaterThanOrEqualTo(1)) &&
      hasDiscordModBuff == false)
  {

    Gathering.Wood.harvestMult = Gathering.Wood.harvestMult * 1.35

    hasDiscordModBuff = true
  }
}

