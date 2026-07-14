import {
  type LandExpansionPlantAction,
  plant as landExpansionPlant,
} from "./landExpansion/plant";
import {
  harvest as landExpansionHarvest,
  type LandExpansionHarvestAction,
} from "./landExpansion/harvest";
import {
  chop as landExpansionChop,
  type LandExpansionChopAction,
} from "./landExpansion/chop";
import {
  mineStone as landExpansionMineStone,
  type LandExpansionStoneMineAction,
} from "./landExpansion/stoneMine";
import {
  mineGold as landExpansionMineGold,
  type LandExpansionGoldMineAction,
} from "./landExpansion/mineGold";

import {
  mineIron as landExpansionIronMine,
  type LandExpansionIronMineAction,
} from "./landExpansion/ironMine";

import {
  bumpkinWave,
  type BumpkinWaveAction,
} from "./landExpansion/bumpkinWave";

import type { GameState } from "../types/game";
import { claimAirdrop, type ClaimAirdropAction } from "./claimAirdrop";
import {
  placeBuilding,
  type PlaceBuildingAction,
} from "./landExpansion/placeBuilding";
import {
  constructBuilding,
  type ConstructBuildingAction,
} from "./landExpansion/constructBuilding";
import {
  placeCollectible,
  type PlaceCollectibleAction,
} from "./landExpansion/placeCollectible";
import {
  upgradeInterior,
  type UpgradeInteriorAction,
} from "./landExpansion/upgradeInterior";
import { cook, type RecipeCookedAction } from "./landExpansion/cook";
import {
  collectRecipe,
  type CollectRecipeAction,
} from "./landExpansion/collectRecipe";
import {
  cancelProcessedResource,
  type CancelProcessedResourceAction,
} from "./landExpansion/cancelProcessedResource";
import {
  processProcessedResource,
  type ProcessProcessedResourceAction,
} from "./landExpansion/processResource";
import {
  collectProcessedResource,
  type CollectProcessedResourceAction,
} from "./landExpansion/collectProcessedResource";
import {
  collectFermentation,
  type CollectFermentationAction,
} from "./landExpansion/collectFermentation";
import {
  startFermentation,
  type StartFermentationAction,
} from "./landExpansion/startFermentation";
import { startAging, type StartAgingAction } from "./landExpansion/startAging";
import {
  collectAgedFish,
  type CollectAgedFishAction,
} from "./landExpansion/collectAgedFish";
import {
  startSpiceRack,
  type StartSpiceRackAction,
} from "./landExpansion/startSpiceRack";
import {
  collectSpiceRack,
  type CollectSpiceRackAction,
} from "./landExpansion/collectSpiceRack";
import {
  feedBumpkin,
  type FeedBumpkinAction,
} from "./landExpansion/feedBumpkin";
import { detectBot, type DetectBotAction } from "./detectBot";
import { choseSkill, type ChoseSkillAction } from "./landExpansion/choseSkill";
import {
  upgradeSkill,
  type UpgradeSkillAction,
} from "./landExpansion/upgradeSkill";
import {
  resetSkills,
  type ResetSkillsAction,
} from "./landExpansion/resetSkills";
import { seedBought, type SeedBoughtAction } from "./landExpansion/seedBought";
import {
  claimAchievement,
  type ClaimAchievementAction,
} from "./landExpansion/claimAchievement";
import { craftTool, type CraftToolAction } from "./landExpansion/craftTool";
import {
  buyDecoration,
  type BuyDecorationAction,
} from "./landExpansion/buyDecoration";
import { sellCrop, type SellCropAction } from "./landExpansion/sellCrop";
import {
  fertilisePlot as landExpansionFertilise,
  type LandExpansionFertiliseCropAction,
} from "./landExpansion/fertilisePlot";
import {
  removeCrop as landExpansionRemoveCrop,
  type LandExpansionRemoveCropAction,
} from "./landExpansion/removeCrop";
import {
  removeBuilding,
  type RemoveBuildingAction,
} from "./landExpansion/removeBuilding";
import {
  removeCollectible,
  type RemoveCollectibleAction,
} from "./landExpansion/removeCollectible";
import {
  plantFruit,
  type PlantFruitAction,
} from "./landExpansion/fruitPlanted";
import {
  harvestFruit,
  type HarvestFruitAction,
} from "./landExpansion/fruitHarvested";
import {
  type RemoveFruitTreeAction,
  removeFruitTree,
} from "./landExpansion/fruitTreeRemoved";
import {
  craftCollectible,
  type CraftCollectibleAction,
} from "./landExpansion/craftCollectible";
import {
  sellTreasure,
  type SellTreasureAction,
} from "./landExpansion/treasureSold";
import { restock, type RestockAction } from "./landExpansion/restock";
import {
  sellGarbage,
  type SellGarbageAction,
} from "./landExpansion/garbageSold";
import { placeTree, type PlaceTreeAction } from "./landExpansion/placeTree";
import { expandLand, type ExpandLandAction } from "./landExpansion/expandLand";
import { placePlot, type PlacePlotAction } from "./landExpansion/placePlot";
import { placeStone, type PlaceStoneAction } from "./landExpansion/placeStone";
import { placeGold, type PlaceGoldAction } from "./landExpansion/placeGold";
import { placeIron, type PlaceIronAction } from "./landExpansion/placeIron";
import {
  placeFruitPatch,
  type PlaceFruitPatchAction,
} from "./landExpansion/placeFruitPatch";
import { type MessageRead, readMessage } from "./landExpansion/readMessage";
import {
  moveCollectible,
  type MoveCollectibleAction,
} from "./landExpansion/moveCollectible";
import {
  moveBuilding,
  type MoveBuildingAction,
} from "./landExpansion/moveBuilding";
import { moveTree, type MoveTreeAction } from "./landExpansion/moveTree";
import { moveCrop, type MoveCropAction } from "./landExpansion/moveCrop";
import {
  moveFruitPatch,
  type MoveFruitPatchAction,
} from "./landExpansion/moveFruitPatch";
import { moveIron, type MoveIronAction } from "./landExpansion/moveIron";
import { moveStone, type MoveStoneAction } from "./landExpansion/moveStone";
import { moveGold, type MoveGoldAction } from "./landExpansion/moveGold";
import {
  pickMushroom,
  type PickMushroomAction,
} from "./landExpansion/pickMushroom";
import type { Announcements } from "../types/announcements";
import { deliverOrder, type DeliverOrderAction } from "./landExpansion/deliver";
import { equip, type EquipBumpkinAction } from "./landExpansion/equip";
import { refundBid, type RefundBidAction } from "./landExpansion/refundBid";
import { cancelBid, type CancelBidAction } from "./landExpansion/cancelBid";
import { mixPotion, type MixPotionAction } from "./landExpansion/mixPotion";
import {
  buyWearable,
  type BuyWearableAction,
} from "./landExpansion/buyWearable";
import { skipOrder, type SkipOrderAction } from "./landExpansion/skipOrder";
import {
  type StartPotionAction,
  startPotion,
} from "./landExpansion/startPotion";
import { moveBud, type MoveNFTAction } from "./landExpansion/moveNFT";
import { removeNFT, type RemoveNFTAction } from "./landExpansion/removeNFT";
import {
  startComposter,
  type StartComposterAction,
} from "./landExpansion/startComposter";
import {
  collectCompost,
  type collectCompostAction,
} from "./landExpansion/collectCompost";
import {
  fertiliseFruitPatch,
  type FertiliseFruitAction,
} from "./landExpansion/fertiliseFruitPatch";
import { castRod, type CastRodAction } from "./landExpansion/castRod";
import { reelRod, type ReelRodAction } from "./landExpansion/reelRod";
import {
  catchMarvel,
  type CatchMarvelAction,
} from "./landExpansion/catchMarvel";
import {
  claimMilestone,
  type ClaimMilestoneAction,
} from "./landExpansion/claimMilestone";
import { missMap, type MissMapAction } from "./landExpansion/missMap";
import { revealLand, type RevealLandAction } from "./landExpansion/revealLand";
import {
  burnCollectible,
  type BurnCollectibleAction,
} from "./landExpansion/burnCollectible";
import { claimBonus, type ClaimBonusAction } from "./landExpansion/claimBonus";
import {
  claimDailyReward,
  type ClaimDailyRewardAction,
} from "./landExpansion/claimDailyReward";
import {
  accelerateComposter,
  type AccelerateComposterAction,
} from "./landExpansion/accelerateComposter";
import {
  moveCrimstone,
  type MoveCrimstoneAction,
} from "./landExpansion/moveCrimstone";
import {
  mineCrimstone,
  type MineCrimstoneAction,
} from "./landExpansion/mineCrimstone";
import {
  placeCrimstone,
  type PlaceCrimstoneAction,
} from "./landExpansion/placeCrimstone";
import {
  equipFarmhand,
  type EquipFarmHandAction,
} from "./landExpansion/equipFarmHand";
import {
  moveBeehive,
  type MoveBeehiveAction,
} from "./landExpansion/moveBeehive";
import {
  placeBeehive,
  type PlaceBeehiveAction,
} from "./landExpansion/placeBeehive";
import {
  harvestBeehive,
  type HarvestBeehiveAction,
} from "./landExpansion/harvestBeehive";
import {
  plantFlower,
  type PlantFlowerAction,
} from "./landExpansion/plantFlower";
import {
  harvestFlower,
  type HarvestFlowerAction,
} from "./landExpansion/harvestFlower";
import {
  moveFlowerBed,
  type MoveFlowerBedAction,
} from "./landExpansion/moveFlowerBed";
import {
  placeFlowerBed,
  type PlaceFlowerBedAction,
} from "./landExpansion/placeFlowerBed";
import {
  upgrade as upgrade,
  type UpgradeFarmAction,
} from "./landExpansion/upgradeFarm";
import {
  placeSunstone,
  type PlaceSunstoneAction,
} from "./landExpansion/placeSunstone";
import {
  moveSunstone,
  type MoveSunstoneAction,
} from "./landExpansion/moveSunstone";
import {
  mineSunstone,
  type MineSunstoneAction,
} from "./landExpansion/mineSunstone";
import {
  placeAscensionCrystal,
  type PlaceAscensionCrystalAction,
} from "./landExpansion/placeAscensionCrystal";
import {
  moveAscensionCrystal,
  type MoveAscensionCrystalAction,
} from "./landExpansion/moveAscensionCrystal";
import {
  mineAscensionCrystal,
  type MineAscensionCrystalAction,
} from "./landExpansion/mineAscensionCrystal";
import {
  type FlowerShopTradedAction,
  tradeFlowerShop,
} from "./landExpansion/tradeFlowerShop";

import {
  completeSpecialEventTask,
  type CompleteSpecialEventTaskAction,
} from "./landExpansion/completeSpecialEventTask";
import {
  claimGift,
  type ClaimGiftAction,
} from "./landExpansion/claimBumpkinGift";
import {
  giftFlowers,
  type GiftFlowersAction,
} from "./landExpansion/giftFlowers";

import {
  exchangeSFLtoCoins,
  type ExchangeSFLtoCoinsAction,
} from "./landExpansion/exchangeSFLtoCoins";
import {
  moveOilReserve,
  type MoveOilReserveAction,
} from "./landExpansion/moveOilReserve";
import {
  placeOilReserve,
  type PlaceOilReserveAction,
} from "./landExpansion/placeOilReserve";
import {
  drillOilReserve,
  type DrillOilReserveAction,
} from "./landExpansion/drillOilReserve";
import {
  harvestGreenHouse,
  type HarvestGreenhouseAction,
} from "./landExpansion/harvestGreenHouse";
import {
  plantGreenhouse,
  type PlantGreenhouseAction,
} from "./landExpansion/plantGreenhouse";
import {
  fertiliseGreenhouse,
  type FertiliseGreenhouseAction,
} from "./landExpansion/fertiliseGreenhouse";
import {
  oilGreenhouse,
  type OilGreenhouseAction,
} from "./landExpansion/oilGreenHouse";
import {
  supplyCookingOil,
  type SupplyCookingOilAction,
} from "./landExpansion/supplyCookingOil";

import {
  type PurchaseMinigameAction,
  purchaseMinigameItem,
} from "./minigames/purchaseMinigameItem";
import {
  claimMinigamePrize,
  type ClaimMinigamePrizeAction,
} from "./minigames/claimMinigamePrize";
import {
  supplyCropMachine,
  type SupplyCropMachineAction,
} from "./landExpansion/supplyCropMachine";
import {
  supplyCropMachineOil,
  type SupplyCropMachineOilAction,
} from "./landExpansion/supplyCropMachineOil";
import {
  harvestCropMachine,
  type HarvestCropMachineAction,
} from "./landExpansion/harvestCropMachine";
import {
  removeCropMachinePack,
  type RemoveCropMachinePackAction,
} from "./landExpansion/removeCropMachinePack";
import {
  joinFaction,
  type JoinFactionAction,
} from "./landExpansion/joinFaction";
import {
  completeKingdomChore,
  type CompleteKingdomChoreAction,
} from "./landExpansion/completeKingdomChore";
import {
  type DeliverFactionKitchenAction,
  deliverFactionKitchen,
} from "./landExpansion/deliverFactionKitchen";
import {
  type BuyFactionShopItemAction,
  buyFactionShopItem,
} from "./landExpansion/buyFactionShopItem";
import {
  claimFactionPrize,
  type ClaimFactionPrizeAction,
} from "./landExpansion/claimFactionPrize";
import {
  type FeedFactionPetAction,
  feedFactionPet,
} from "./landExpansion/feedFactionPet";
import { type FeedPetAction, feedPet } from "./pets/feedPet";
import {
  refreshKingdomChores,
  type RefreshKingdomChoresAction,
} from "./landExpansion/refreshKingdomChores";
import {
  skipKingdomChore,
  type SkipKingdomChoreAction,
} from "./landExpansion/skipKingdomChore";
import {
  leaveFaction,
  type LeaveFactionAction,
} from "./landExpansion/leaveFaction";
import {
  type BuyMoreDigsAction,
  buyMoreDigs,
} from "./landExpansion/buyMoreDigs";
import {
  claimTrackMilestone,
  type ClaimTrackMilestoneAction,
} from "./landExpansion/claimTrackMilestone";

import {
  startMinigameAttempt,
  type StartMinigameAttemptAction,
} from "./minigames/startMinigameAttempt";
import {
  submitMinigameScore,
  type SubmitMinigameScoreAction,
} from "./minigames/submitMinigameScore";
import {
  claimOffer,
  type ClaimOfferAction,
} from "./landExpansion/offerClaimed";
import {
  startCompetition,
  type StartCompetitionAction,
} from "./landExpansion/startCompetition";
import { startTrial, type StartTrialAction } from "./landExpansion/startTrial";
import {
  shipmentRestock,
  type ShipmentRestockAction,
} from "./landExpansion/shipmentRestocked";
import {
  speedUpRecipe,
  type InstantCookRecipe,
} from "./landExpansion/speedUpRecipe";
import {
  speedUpExpansion,
  type InstantExpand,
} from "./landExpansion/speedUpExpansion";
import {
  speedUpCollectible,
  type SpeedUpCollectible,
} from "./landExpansion/speedUpCollectible";
import {
  speedUpBuilding,
  type SpeedUpBuilding,
} from "./landExpansion/speedUpBuilding";
import { buyAnimal, type BuyAnimalAction } from "./landExpansion/buyAnimal";
import { feedAnimal, type FeedAnimalAction } from "./landExpansion/feedAnimal";
import { loveAnimal, type LoveAnimalAction } from "./landExpansion/loveAnimal";
import {
  feedMixed,
  type FeedMixedAction,
} from "features/feederMachine/feedMixed";
import {
  upgradeBuilding,
  type UpgradeBuildingAction,
} from "./landExpansion/upgradeBuilding";
import { sellAnimal, type SellAnimalAction } from "./landExpansion/sellAnimal";
import {
  startCrafting,
  type StartCraftingAction,
} from "./landExpansion/startCrafting";
import {
  collectCrafting,
  type CollectCraftingAction,
} from "./landExpansion/collectCrafting";
import {
  cancelQueuedCrafting,
  type CancelQueuedCraftingAction,
} from "./landExpansion/cancelQueuedCrafting";
import {
  completeNPCChore,
  type CompleteNPCChoreAction,
} from "./landExpansion/completeNPCChore";
import {
  claimProduce,
  type ClaimProduceAction,
} from "./landExpansion/claimProduce";
import {
  applyAnimalFeedBuff,
  type ApplyAnimalFeedBuffAction,
} from "./landExpansion/applyAnimalFeedBuff";
import { sellBounty, type SellBountyAction } from "./landExpansion/sellBounty";
import {
  bulkSellBounty,
  type BulkSellBountyAction,
} from "./landExpansion/bulkSellBounty";
import {
  buyChapterItem,
  type BuyChapterItemAction,
} from "./landExpansion/buyChapterItem";

import {
  sacrificeBear,
  type SacrificeBearAction,
} from "./landExpansion/sacrificeBear";
import { type ClaimPurchaseAction, claimPurchase } from "./claimPurchase";
import { npcRestock, type NPCRestockAction } from "./landExpansion/npcRestock";
import {
  redeemTradeReward,
  type RedeemTradeRewardsAction,
} from "./landExpansion/redeemTradeReward";
import { skillUse, type SkillUseAction } from "./landExpansion/skillUsed";
import { dailyReset, type DailyResetAction } from "./landExpansion/dailyReset";
import {
  acknowledgeCalendarEvent,
  type AcknowledgeCalendarEventAction,
} from "./landExpansion/acknowledgeCalendarEvent";

import {
  collectLavaPit,
  type CollectLavaPitAction,
} from "./landExpansion/collectLavaPit";
import {
  startLavaPit,
  type StartLavaPitAction,
} from "./landExpansion/startLavaPit";
import {
  harvestSalt,
  type HarvestSaltAction,
} from "./landExpansion/harvestSalt";
import {
  placeLavaPit,
  type PlaceLavaPitAction,
} from "./landExpansion/placeLavaPit";
import {
  moveLavaPit,
  type MoveLavaPitAction,
} from "./landExpansion/moveLavaPit";
import {
  buyResource,
  type ResourceBoughtAction,
} from "./landExpansion/buyResource";
import {
  exchangeObsidian,
  type ObsidianExchangedAction,
} from "./landExpansion/exchangeObsidian";
import {
  cancelQueuedRecipe,
  type CancelQueuedRecipeAction,
} from "./landExpansion/cancelQueuedRecipe";
import {
  speedUpUpgrade,
  type SpeedUpUpgradeAction,
} from "./landExpansion/speedUpUpgrade";
import {
  acknowledgeOnChainAirdrop,
  type AcknowledgeOnChainAirdropAction,
} from "./landExpansion/acknowledgeOnChainAirdrop";
import {
  completeSocialTask,
  type CompleteSocialTaskAction,
} from "./landExpansion/completeSocialTask";
import {
  claimReferralRewards,
  type ClaimReferralRewardsAction,
} from "./landExpansion/claimReferralRewards";
import {
  claimVipReferralMilestones,
  type ClaimVipReferralMilestonesAction,
} from "./landExpansion/claimVipReferralMilestones";
import {
  exchangeFlower,
  type ExchangeFlowerAction,
} from "./landExpansion/exchangeFLOWER";
import {
  buyFloatingShopItem,
  type BuyFloatingShopItemAction,
} from "./landExpansion/buyFloatingShopItem";
import {
  buyEventShopItem,
  type BuyMinigameItemAction,
} from "./landExpansion/buyPortalItem";
import {
  updateNetwork,
  type UpdateNetworkAction,
} from "./landExpansion/updateNetwork";
import {
  updateEconomiesEnabled,
  type EconomiesEnabledAction,
} from "./updateEconomiesEnabled";
import {
  updateInteriorsEnabled,
  type InteriorsEnabledAction,
} from "./updateInteriorsEnabled";
import {
  acknowledgeRewardBox,
  type AcknowledgeRewardBoxAction,
} from "./landExpansion/acknowledgeRewardBox";
import {
  openRewardBox,
  type OpenRewardBoxAction,
} from "./landExpansion/openRewardBox";
import {
  claimBountyBonus,
  type ClaimBountyBonusAction,
} from "./landExpansion/claimBountyBonus";
import {
  claimPetalPrize,
  type ClaimPetalPrizeAction,
} from "./landExpansion/claimPetalPrize";
import {
  buyOptionPurchaseItem,
  type BuyOptionPurchaseItemAction,
} from "../types/buyOptionPurchaseItem";
import {
  type InstantCraftAction,
  speedUpCrafting,
} from "./landExpansion/speedUpCrafting";
import { buyBiome, type BuyBiomeAction } from "./landExpansion/buyBiome";
import { applyBiome, type ApplyBiomeAction } from "./landExpansion/applyBiome";
import {
  buyMonument,
  type BuyMonumentAction,
} from "./landExpansion/buyMonument";
import { removeTree, type RemoveTreeAction } from "./landExpansion/removeTree";
import {
  removeStone,
  type RemoveStoneAction,
} from "./landExpansion/removeStone";
import { removeIron, type RemoveIronAction } from "./landExpansion/removeIron";
import { removeGold, type RemoveGoldAction } from "./landExpansion/removeGold";
import {
  removeCrimstone,
  type RemoveCrimstoneAction,
} from "./landExpansion/removeCrimstone";
import {
  removeSunstone,
  type RemoveSunstoneAction,
} from "./landExpansion/removeSunstone";
import {
  removeAscensionCrystal,
  type RemoveAscensionCrystalAction,
} from "./landExpansion/removeAscensionCrystal";
import {
  removeLavaPit,
  type RemoveLavaPitAction,
} from "./landExpansion/removeLavaPit";
import {
  removeOilReserve,
  type RemoveOilReserveAction,
} from "./landExpansion/removeOilReserve";
import { removePlot, type RemovePlotAction } from "./landExpansion/removePlot";
import {
  removeFruitPatch,
  type RemoveFruitPatchAction,
} from "./landExpansion/removeFruitPatch";
import {
  removeFlowerBed,
  type RemoveFlowerBedAction,
} from "./landExpansion/removeFlowerBed";
import {
  removeBeehive,
  type RemoveBeehiveAction,
} from "./landExpansion/removeBeehive";
import { removeAll, type RemoveAllAction } from "./landExpansion/removeAll";
import { saveLayout, type SaveLayoutAction } from "./landExpansion/saveLayout";
import {
  applyLayout,
  type ApplyLayoutAction,
} from "./landExpansion/applyLayout";
import {
  renameLayout,
  type RenameLayoutAction,
} from "./landExpansion/renameLayout";
import {
  deleteLayout,
  type DeleteLayoutAction,
} from "./landExpansion/deleteLayout";
import {
  saveAscensionLayout,
  type SaveAscensionLayoutAction,
} from "./landExpansion/saveAscensionLayout";
import {
  wakeAnimal,
  type WakeUpAnimalAction,
} from "./landExpansion/wakeUpAnimal";

import { retryFish, type RetryFishAction } from "./landExpansion/retryFish";
import {
  flipCollectible,
  type FlipCollectibleAction,
} from "./landExpansion/flipCollectible";
import {
  flipFarmHand,
  type FlipFarmHandAction,
} from "./landExpansion/flipFarmHand";
import {
  flipBumpkin,
  type FlipBumpkinAction,
} from "./landExpansion/flipBumpkin";

// Visiting local events
import {
  collectGarbage,
  type CollectGarbageAction,
} from "./visiting/collectGarbage";
import { helpProject, type HelpProjectAction } from "./visiting/helpProject";
import {
  burnClutter,
  type BurnClutterAction,
} from "./landExpansion/burnClutter";
import {
  increaseHelpLimit,
  type IncreaseHelpLimitAction,
} from "./landExpansion/increaseHelpLimit";
import {
  instantGrowProject,
  type InstantGrowProjectAction,
} from "./landExpansion/instaGrowProject";
import {
  startProject,
  type StartProjectAction,
} from "./landExpansion/startProject";
import {
  instaGrowFlower,
  type InstaGrowFlowerAction,
} from "./landExpansion/instaGrowFlower";
import {
  upgradeRock,
  type UpgradeRockAction,
} from "./landExpansion/upgradeRock";
import {
  upgradeTree,
  type UpgradeTreeAction,
} from "./landExpansion/upgradeTree";
import { bulkFeedPets, type BulkFeedPetsAction } from "./pets/bulkFeedPets";
import { bulkFetchPets, type BulkFetchPetsAction } from "./pets/bulkFetchPets";
import { type NeglectPetAction, neglectPet } from "./pets/neglectPet";
import { petPet, type PetPetAction } from "./pets/petPet";
import { fetchPet, type FetchPetAction } from "./pets/fetchPet";
import { helpPets, type HelpPetsAction } from "./visiting/helpPets";
import {
  helpAllPetsInHouse,
  type HelpAllPetsInHouseAction,
} from "./visiting/helpAllPetsInHouse";
import { type BulkPlantAction, bulkPlant } from "./landExpansion/bulkPlant";
import {
  bulkHarvest,
  type BulkHarvestAction,
} from "./landExpansion/bulkHarvest";
import {
  bulkFertilisePlot,
  type BulkFertilisePlotAction,
} from "./landExpansion/bulkFertilisePlot";
import { clearTrades, type ClearTradesAction } from "./clearTrades";
import { placeNFT, type PlaceNFTAction } from "./landExpansion/placeNFT";
import { walkPet, type WalkPetAction } from "./pets/walkPet";
import {
  renewPetShrine,
  type RenewPetShrineAction,
} from "./landExpansion/renewPetShrine";
import {
  renewCollectible,
  type RenewCollectibleAction,
} from "./landExpansion/renewCollectible";
import {
  renewWeatherCollectible,
  type RenewWeatherCollectibleAction,
} from "./landExpansion/renewWeatherCollectible";
import {
  placeWaterTrap,
  type PlaceWaterTrapAction,
} from "./landExpansion/placeWaterTrap";
import {
  collectWaterTrap,
  type CollectWaterTrapAction,
} from "./landExpansion/collectWaterTrap";
import {
  placeFarmHand,
  type PlaceFarmHandAction,
} from "./landExpansion/placeFarmHand";
import {
  moveFarmHand,
  type MoveFarmHandAction,
} from "./landExpansion/moveFarmHand";
import {
  removeFarmHand,
  type RemoveFarmHandAction,
} from "./landExpansion/removeFarmHand";
import {
  placeBumpkin,
  type PlaceBumpkinAction,
} from "./landExpansion/placeBumpkin";
import {
  moveBumpkin,
  type MoveBumpkinAction,
} from "./landExpansion/moveBumpkin";
import {
  removeBumpkinPlacement,
  type RemoveBumpkinPlacementAction,
} from "./landExpansion/removeBumpkinPlacement";
import {
  promoteFarmhand,
  type PromoteFarmhandAction,
} from "./landExpansion/promoteFarmhand";
import {
  speedUpProcessing,
  type SpeedUpProcessingAction,
} from "./landExpansion/speedUpProcessing";
import {
  upgradeSaltFarm,
  type UpgradeSaltFarmAction,
} from "./landExpansion/upgradeSaltFarm";
import {
  upgradeSaltSculpture,
  type UpgradeSaltSculptureAction,
} from "./landExpansion/upgradeSaltSculpture";

export type PlayingEvent =
  | ObsidianExchangedAction
  | SpeedUpUpgradeAction
  | ResourceBoughtAction
  | SellAnimalAction
  | SpeedUpBuilding
  | SacrificeBearAction
  | SpeedUpCollectible
  | SellBountyAction
  | BulkSellBountyAction
  | ClaimBountyBonusAction
  | FeedMixedAction
  | InstantExpand
  | InstantCookRecipe
  | ShipmentRestockAction
  | StartCompetitionAction
  | ClaimOfferAction
  | OilGreenhouseAction
  | HarvestGreenhouseAction
  | PlantGreenhouseAction
  | FertiliseGreenhouseAction
  | LandExpansionPlantAction
  | LandExpansionFertiliseCropAction
  | LandExpansionRemoveCropAction
  | LandExpansionHarvestAction
  | LandExpansionChopAction
  | LandExpansionStoneMineAction
  | LandExpansionIronMineAction
  | LandExpansionGoldMineAction
  | MineCrimstoneAction
  | MineSunstoneAction
  | MineAscensionCrystalAction
  | ClaimAirdropAction
  | RecipeCookedAction
  | CollectRecipeAction
  | CancelProcessedResourceAction
  | ProcessProcessedResourceAction
  | CollectProcessedResourceAction
  | StartFermentationAction
  | CollectFermentationAction
  | StartAgingAction
  | CollectAgedFishAction
  | StartSpiceRackAction
  | CollectSpiceRackAction
  | FeedBumpkinAction
  | DetectBotAction
  | ChoseSkillAction
  | UpgradeSkillAction
  | ResetSkillsAction
  | SeedBoughtAction
  | ClaimAchievementAction
  | CraftToolAction
  | BuyDecorationAction
  | BuyMonumentAction
  | SellCropAction
  | PlantFruitAction
  | HarvestFruitAction
  | RemoveFruitTreeAction
  | CraftCollectibleAction
  | SellTreasureAction
  | ClearTradesAction
  | RestockAction
  | NPCRestockAction
  | SellGarbageAction
  | ExpandLandAction
  | MessageRead
  | PickMushroomAction
  | RemoveCollectibleAction
  | DeliverOrderAction
  | EquipBumpkinAction
  | CancelBidAction
  | RefundBidAction
  | MixPotionAction
  | BuyWearableAction
  | SkipOrderAction
  | StartPotionAction
  | StartComposterAction
  | collectCompostAction
  | FertiliseFruitAction
  | CastRodAction
  | ReelRodAction
  | CatchMarvelAction
  | ClaimMilestoneAction
  | MissMapAction
  | RevealLandAction
  | BurnCollectibleAction
  | ClaimReferralRewardsAction
  | ClaimVipReferralMilestonesAction
  | ClaimBonusAction
  | ClaimDailyRewardAction
  | AccelerateComposterAction
  | EquipFarmHandAction
  | HarvestBeehiveAction
  | PlantFlowerAction
  | HarvestFlowerAction
  | UpgradeFarmAction
  | FlowerShopTradedAction
  | CompleteSpecialEventTaskAction
  | GiftFlowersAction
  | ClaimGiftAction
  | ExchangeSFLtoCoinsAction
  | DrillOilReserveAction
  | ClaimMinigamePrizeAction
  | PurchaseMinigameAction
  | StartMinigameAttemptAction
  | SubmitMinigameScoreAction
  | SkillUseAction
  | SupplyCropMachineAction
  | SupplyCropMachineOilAction
  | HarvestCropMachineAction
  | RemoveCropMachinePackAction
  | SupplyCookingOilAction
  | JoinFactionAction
  | CompleteKingdomChoreAction
  | SkipKingdomChoreAction
  | RefreshKingdomChoresAction
  | DeliverFactionKitchenAction
  | BuyFactionShopItemAction
  | ClaimFactionPrizeAction
  | FeedFactionPetAction
  | FeedPetAction
  | WalkPetAction
  | FetchPetAction
  | BulkFeedPetsAction
  | BulkFetchPetsAction
  | NeglectPetAction
  | PetPetAction
  | LeaveFactionAction
  | BuyMoreDigsAction
  | BuyAnimalAction
  | FeedAnimalAction
  | LoveAnimalAction
  | UpgradeBuildingAction
  | StartCraftingAction
  | CollectCraftingAction
  | CancelQueuedCraftingAction
  | CompleteNPCChoreAction
  | ClaimProduceAction
  | ApplyAnimalFeedBuffAction
  | BuyChapterItemAction
  | ClaimPurchaseAction
  | RedeemTradeRewardsAction
  | DailyResetAction
  | AcknowledgeCalendarEventAction
  | CollectLavaPitAction
  | StartLavaPitAction
  | HarvestSaltAction
  | UpgradeSaltFarmAction
  | CancelQueuedRecipeAction
  | AcknowledgeOnChainAirdropAction
  | CompleteSocialTaskAction
  | ExchangeFlowerAction
  | BuyFloatingShopItemAction
  | UpdateNetworkAction
  | EconomiesEnabledAction
  | InteriorsEnabledAction
  | BuyMinigameItemAction
  | AcknowledgeRewardBoxAction
  | OpenRewardBoxAction
  | ClaimPetalPrizeAction
  | BuyOptionPurchaseItemAction
  | InstantCraftAction
  | BuyBiomeAction
  | ApplyBiomeAction
  | WakeUpAnimalAction
  | RetryFishAction
  | BurnClutterAction
  | InstantGrowProjectAction
  | StartProjectAction
  | InstaGrowFlowerAction
  | UpgradeRockAction
  | UpgradeTreeAction
  | BulkPlantAction
  | BulkHarvestAction
  | BumpkinWaveAction
  | BulkFertilisePlotAction
  | RenewPetShrineAction
  | RenewCollectibleAction
  | RenewWeatherCollectibleAction
  | CollectWaterTrapAction
  | PlaceWaterTrapAction
  | PlaceFarmHandAction
  | MoveFarmHandAction
  | RemoveFarmHandAction
  | PlaceBumpkinAction
  | MoveBumpkinAction
  | RemoveBumpkinPlacementAction
  | PromoteFarmhandAction
  | SpeedUpProcessingAction
  | ClaimTrackMilestoneAction
  | StartTrialAction
  | UpgradeSaltSculptureAction
  | UpgradeInteriorAction;

export type LocalVisitingEvent =
  | CollectGarbageAction
  | HelpProjectAction
  | HelpPetsAction
  | HelpAllPetsInHouseAction;

export type VisitingEvent = IncreaseHelpLimitAction | LocalVisitingEvent;

export type PlacementEvent =
  | ConstructBuildingAction
  | PlaceBuildingAction
  | PlaceCollectibleAction
  | PlaceTreeAction
  | PlacePlotAction
  | PlaceStoneAction
  | PlaceGoldAction
  | PlaceIronAction
  | PlaceCrimstoneAction
  | PlaceFruitPatchAction
  | PlaceSunstoneAction
  | PlaceAscensionCrystalAction
  | BuyDecorationAction
  | BuyMonumentAction
  | CraftCollectibleAction
  | MoveCollectibleAction
  | MoveBuildingAction
  | MoveCropAction
  | MoveFruitPatchAction
  | MoveTreeAction
  | MoveIronAction
  | MoveStoneAction
  | MoveGoldAction
  | MoveCrimstoneAction
  | MoveSunstoneAction
  | MoveAscensionCrystalAction
  | RemoveBuildingAction
  | RemoveCollectibleAction
  | PlaceNFTAction
  | MoveNFTAction
  | RemoveNFTAction
  | MoveBeehiveAction
  | PlaceBeehiveAction
  | MoveFlowerBedAction
  | PlaceFlowerBedAction
  | MoveOilReserveAction
  | PlaceOilReserveAction
  | PlaceLavaPitAction
  | MoveLavaPitAction
  | RemoveTreeAction
  | RemoveStoneAction
  | RemoveIronAction
  | RemoveGoldAction
  | RemoveCrimstoneAction
  | RemoveSunstoneAction
  | RemoveAscensionCrystalAction
  | RemoveLavaPitAction
  | RemoveOilReserveAction
  | RemovePlotAction
  | RemoveFruitPatchAction
  | RemoveFlowerBedAction
  | RemoveBeehiveAction
  | RemoveAllAction
  | SaveLayoutAction
  | SaveAscensionLayoutAction
  | ApplyLayoutAction
  | RenameLayoutAction
  | DeleteLayoutAction
  | FlipCollectibleAction
  | FlipFarmHandAction
  | FlipBumpkinAction
  | PlaceFarmHandAction
  | MoveFarmHandAction
  | RemoveFarmHandAction
  | PlaceBumpkinAction
  | MoveBumpkinAction
  | RemoveBumpkinPlacementAction;

export type GameEvent = PlayingEvent | PlacementEvent | VisitingEvent;

export type GameEventName<T> = Extract<T, { type: string }>["type"];

export function isEventType<T extends PlayingEvent>(
  action: PlayingEvent,
  typeName: T["type"],
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
    announcements?: Announcements;
    farmId: number;
    visitorState?: GameState;
    createdAt: number;
  }) => GameState | [GameState, GameState];
};

export const PLAYING_EVENTS: Handlers<PlayingEvent> = {
  "processing.spedUp": speedUpProcessing,
  "onChainAirdrop.acknowledged": acknowledgeOnChainAirdrop,
  "recipe.cancelled": cancelQueuedRecipe,
  "obsidian.exchanged": exchangeObsidian,
  "resource.bought": buyResource,
  "animal.sold": sellAnimal,
  "building.spedUp": speedUpBuilding,
  "bear.sacrificed": sacrificeBear,
  "collectible.spedUp": speedUpCollectible,
  "expansion.spedUp": speedUpExpansion,
  "recipe.spedUp": speedUpRecipe,
  "bounty.sold": sellBounty,
  "bounty.bulkSold": bulkSellBounty,
  "competition.started": startCompetition,
  "offer.claimed": claimOffer,
  "faction.left": leaveFaction,
  "faction.prizeClaimed": claimFactionPrize,
  "greenhouse.oiled": oilGreenhouse,
  "greenhouse.harvested": harvestGreenHouse,
  "greenhouse.planted": plantGreenhouse,
  "greenhouse.fertilised": fertiliseGreenhouse,
  "minigame.itemPurchased": purchaseMinigameItem,
  "minigame.prizeClaimed": claimMinigamePrize,
  "minigame.attemptStarted": startMinigameAttempt,
  "minigame.scoreSubmitted": submitMinigameScore,
  "airdrop.claimed": claimAirdrop,
  "bot.detected": detectBot,
  "seed.planted": landExpansionPlant,
  "seeds.bulkPlanted": bulkPlant,
  "crop.harvested": landExpansionHarvest,
  "crops.bulkHarvested": bulkHarvest,
  "plot.fertilised": landExpansionFertilise,
  "plots.bulkFertilised": bulkFertilisePlot,
  "crop.removed": landExpansionRemoveCrop,
  "stoneRock.mined": landExpansionMineStone,
  "ironRock.mined": landExpansionIronMine,
  "goldRock.mined": landExpansionMineGold,
  "crimstoneRock.mined": mineCrimstone,
  "sunstoneRock.mined": mineSunstone,
  "ascensionCrystal.mined": mineAscensionCrystal,

  "timber.chopped": landExpansionChop,
  "recipe.cooked": cook,
  "recipes.collected": collectRecipe,
  "processedResource.cancelled": cancelProcessedResource,
  "processedResource.processed": processProcessedResource,
  "processedResource.collected": collectProcessedResource,
  "fermentation.started": startFermentation,
  "fermentation.collected": collectFermentation,
  "agingRack.started": startAging,
  "agingRack.collected": collectAgedFish,
  "spiceRack.started": startSpiceRack,
  "spiceRack.collected": collectSpiceRack,
  "bumpkin.feed": feedBumpkin,
  "trackMilestone.claimed": claimTrackMilestone,
  "skill.chosen": choseSkill,
  "skill.upgraded": upgradeSkill,
  "skills.reset": resetSkills,
  "seed.bought": seedBought,
  "achievement.claimed": claimAchievement,
  "tool.crafted": craftTool,
  "decoration.bought": buyDecoration,
  "monument.bought": buyMonument,
  "crop.sold": sellCrop,

  "fruit.planted": plantFruit,
  "fruit.harvested": harvestFruit,
  "fruitTree.removed": removeFruitTree,
  "collectible.crafted": craftCollectible,
  "treasure.sold": sellTreasure,
  "shops.restocked": restock,
  "npc.restocked": npcRestock,
  "garbage.sold": sellGarbage,
  "land.expanded": expandLand,
  "message.read": readMessage,
  "mushroom.picked": pickMushroom,
  "collectible.removed": removeCollectible,
  "order.delivered": deliverOrder,
  "order.skipped": skipOrder,
  "bumpkin.equipped": equip,
  "bid.cancelled": cancelBid,
  "bid.refunded": refundBid,
  "potion.mixed": mixPotion,
  "wearable.bought": buyWearable,
  "potion.started": startPotion,
  "composter.started": startComposter,
  "compost.collected": collectCompost,
  "fruitPatch.fertilised": fertiliseFruitPatch,
  "rod.casted": castRod,
  "rod.reeled": reelRod,
  "marvel.caught": catchMarvel,
  "milestone.claimed": claimMilestone,
  "map.missed": missMap,
  "land.revealed": revealLand,
  "collectible.burned": burnCollectible,
  "collectible.renewed": renewCollectible,
  "weatherCollectible.renewed": renewWeatherCollectible,
  "bonus.claimed": claimBonus,
  "dailyReward.claimed": claimDailyReward,
  "compost.accelerated": accelerateComposter,
  "farmHand.equipped": equipFarmhand,
  "beehive.harvested": harvestBeehive,
  "flower.planted": plantFlower,
  "flower.harvested": harvestFlower,
  "flower.instaGrown": instaGrowFlower,
  "farm.upgraded": upgrade,
  "flowerShop.traded": tradeFlowerShop,
  "specialEvent.taskCompleted": completeSpecialEventTask,
  "flowers.gifted": giftFlowers,
  "gift.claimed": claimGift,
  "sfl.exchanged": exchangeSFLtoCoins,
  "faction.joined": joinFaction,
  "oilReserve.drilled": drillOilReserve,
  "cropMachine.oilSupplied": supplyCropMachineOil,
  "cropMachine.packRemoved": removeCropMachinePack,
  "cropMachine.supplied": supplyCropMachine,
  "cropMachine.harvested": harvestCropMachine,
  "cookingOil.supplied": supplyCookingOil,
  "kingdomChore.completed": completeKingdomChore,
  "kingdomChore.skipped": skipKingdomChore,
  "kingdomChores.refreshed": refreshKingdomChores,
  "factionKitchen.delivered": deliverFactionKitchen,
  "factionShopItem.bought": buyFactionShopItem,
  "factionPet.fed": feedFactionPet,
  "pet.fed": feedPet,
  "pet.walked": walkPet,
  "pet.fetched": fetchPet,
  "pets.bulkFeed": bulkFeedPets,
  "pets.bulkFetch": bulkFetchPets,
  "pet.neglected": neglectPet,
  "desert.digsBought": buyMoreDigs,
  "shipment.restocked": shipmentRestock,
  "animal.bought": buyAnimal,
  "animal.fed": feedAnimal,
  "animal.loved": loveAnimal,
  "feed.mixed": feedMixed,
  "skill.used": skillUse,
  "building.upgraded": upgradeBuilding,
  "crafting.started": startCrafting,
  "crafting.collected": collectCrafting,
  "crafting.cancelled": cancelQueuedCrafting,
  "chore.fulfilled": completeNPCChore,
  "produce.claimed": claimProduce,
  "animal.feedBuffApplied": applyAnimalFeedBuff,
  "chapterItem.bought": buyChapterItem,
  "purchase.claimed": claimPurchase,
  "reward.redeemed": redeemTradeReward,
  "daily.reset": dailyReset,
  "calendarEvent.acknowledged": acknowledgeCalendarEvent,
  "lavaPit.collected": collectLavaPit,
  "lavaPit.started": startLavaPit,
  "salt.harvested": harvestSalt,
  "saltFarm.upgraded": upgradeSaltFarm,
  "upgrade.spedUp": speedUpUpgrade,
  "socialTask.completed": completeSocialTask,
  "referral.rewardsClaimed": claimReferralRewards,
  "referral.vipMilestonesClaimed": claimVipReferralMilestones,
  "exchange.flower": exchangeFlower,
  "floatingShopItem.bought": buyFloatingShopItem,
  "network.updated": updateNetwork,
  "economies.enabled": updateEconomiesEnabled,
  "interiors.enabled": updateInteriorsEnabled,
  "minigameItem.bought": buyEventShopItem,
  "rewardBox.acknowledged": acknowledgeRewardBox,
  "rewardBox.opened": openRewardBox,
  "claim.bountyBoardBonus": claimBountyBonus,
  "petalPuzzle.solved": claimPetalPrize,
  "optionPurchaseItem.bought": buyOptionPurchaseItem,
  "crafting.spedUp": speedUpCrafting,
  "biome.bought": buyBiome,
  "biome.applied": applyBiome,
  "animal.wakeUp": wakeAnimal,
  "bumpkin.wave": bumpkinWave,
  "clutter.burned": burnClutter,
  "project.instantGrow": instantGrowProject,
  "project.started": startProject,
  "trial.started": startTrial,
  "rock.upgraded": upgradeRock,
  "tree.upgraded": upgradeTree,
  "fish.retried": retryFish,
  "pet.pet": petPet,
  "trades.cleared": clearTrades,
  "petShrine.renewed": renewPetShrine,
  "waterTrap.placed": placeWaterTrap,
  "waterTrap.collected": collectWaterTrap,
  "farmHand.placed": placeFarmHand,
  "farmHand.moved": moveFarmHand,
  "farmHand.removed": removeFarmHand,
  "bumpkin.placed": placeBumpkin,
  "bumpkin.moved": moveBumpkin,
  "bumpkin.removedPlacement": removeBumpkinPlacement,
  "farmhand.promoted": promoteFarmhand,
  "saltSculpture.upgraded": upgradeSaltSculpture,
  "interior.upgrade": upgradeInterior,
};

export const LOCAL_VISITING_EVENTS: Handlers<LocalVisitingEvent> = {
  "garbage.collected": collectGarbage,
  "project.helped": helpProject,
  "pet.visitingPets": helpPets,
  "pet.helpAllPetsInHouse": helpAllPetsInHouse,
};

export const VISITING_EVENTS: Handlers<VisitingEvent> = {
  "helpLimit.increased": increaseHelpLimit,
  ...LOCAL_VISITING_EVENTS,
};

export const PLACEMENT_EVENTS: Handlers<PlacementEvent> = {
  "building.constructed": constructBuilding,
  "building.placed": placeBuilding,
  "collectible.placed": placeCollectible,
  "tree.placed": placeTree,
  "plot.placed": placePlot,
  "stone.placed": placeStone,
  "gold.placed": placeGold,
  "iron.placed": placeIron,
  "crimstone.placed": placeCrimstone,
  "fruitPatch.placed": placeFruitPatch,
  "decoration.bought": buyDecoration,
  "monument.bought": buyMonument,
  "collectible.crafted": craftCollectible,
  "collectible.moved": moveCollectible,
  "building.moved": moveBuilding,
  "fruitPatch.moved": moveFruitPatch,
  "tree.moved": moveTree,
  "crop.moved": moveCrop,
  "iron.moved": moveIron,
  "stone.moved": moveStone,
  "gold.moved": moveGold,
  "crimstone.moved": moveCrimstone,
  "building.removed": removeBuilding,
  "collectible.removed": removeCollectible,
  "nft.placed": placeNFT,
  "nft.moved": moveBud,
  "nft.removed": removeNFT,
  "farmHand.placed": placeFarmHand,
  "farmHand.moved": moveFarmHand,
  "farmHand.removed": removeFarmHand,
  "bumpkin.placed": placeBumpkin,
  "bumpkin.moved": moveBumpkin,
  "bumpkin.removedPlacement": removeBumpkinPlacement,
  "beehive.moved": moveBeehive,
  "beehive.placed": placeBeehive,
  "flowerBed.moved": moveFlowerBed,
  "flowerBed.placed": placeFlowerBed,
  "sunstone.placed": placeSunstone,
  "sunstone.moved": moveSunstone,
  "ascensionCrystal.placed": placeAscensionCrystal,
  "ascensionCrystal.moved": moveAscensionCrystal,
  "oilReserve.moved": moveOilReserve,
  "oilReserve.placed": placeOilReserve,
  "lavaPit.placed": placeLavaPit,
  "lavaPit.moved": moveLavaPit,
  "tree.removed": removeTree,
  "stone.removed": removeStone,
  "iron.removed": removeIron,
  "gold.removed": removeGold,
  "crimstone.removed": removeCrimstone,
  "sunstone.removed": removeSunstone,
  "ascensionCrystal.removed": removeAscensionCrystal,
  "lavaPit.removed": removeLavaPit,
  "oilReserve.removed": removeOilReserve,
  "plot.removed": removePlot,
  "fruitPatch.removed": removeFruitPatch,
  "flowerBed.removed": removeFlowerBed,
  "beehive.removed": removeBeehive,
  "items.removed": removeAll,
  "layout.saved": saveLayout,
  "layout.ascensionSaved": saveAscensionLayout,
  "layout.applied": applyLayout,
  "layout.renamed": renameLayout,
  "layout.deleted": deleteLayout,
  "collectible.flipped": flipCollectible,
  "farmHand.flipped": flipFarmHand,
  "bumpkin.flipped": flipBumpkin,
};

export const EVENTS = {
  ...PLAYING_EVENTS,
  ...VISITING_EVENTS,
  ...PLACEMENT_EVENTS,
};
