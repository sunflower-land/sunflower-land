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
  LandExpansionGoldMineAction,
} from "./landExpansion/mineGold";

import {
  mineIron as landExpansionIronMine,
  LandExpansionIronMineAction,
} from "./landExpansion/ironMine";

import { bumpkinWave, BumpkinWaveAction } from "./landExpansion/bumpkinWave";

import { GameState } from "../types/game";
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
import {
  cancelProcessedResource,
  CancelProcessedResourceAction,
} from "./landExpansion/cancelProcessedResource";
import {
  processProcessedResource,
  ProcessProcessedResourceAction,
} from "./landExpansion/processResource";
import {
  collectProcessedResource,
  CollectProcessedResourceAction,
} from "./landExpansion/collectProcessedResource";
import { feedBumpkin, FeedBumpkinAction } from "./landExpansion/feedBumpkin";
import { detectBot, DetectBotAction } from "./detectBot";
import { choseSkill, ChoseSkillAction } from "./landExpansion/choseSkill";
import { resetSkills, ResetSkillsAction } from "./landExpansion/resetSkills";
import { seedBought, SeedBoughtAction } from "./landExpansion/seedBought";
import {
  claimAchievement,
  ClaimAchievementAction,
} from "./landExpansion/claimAchievement";
import { craftTool, CraftToolAction } from "./landExpansion/craftTool";
import {
  buyDecoration,
  BuyDecorationAction,
} from "./landExpansion/buyDecoration";
import { sellCrop, SellCropAction } from "./landExpansion/sellCrop";
import {
  fertilisePlot as landExpansionFertilise,
  LandExpansionFertiliseCropAction,
} from "./landExpansion/fertilisePlot";
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
import { MessageRead, readMessage } from "./landExpansion/readMessage";
import {
  moveCollectible,
  MoveCollectibleAction,
} from "./landExpansion/moveCollectible";
import { moveBuilding, MoveBuildingAction } from "./landExpansion/moveBuilding";
import { moveTree, MoveTreeAction } from "./landExpansion/moveTree";
import { moveCrop, MoveCropAction } from "./landExpansion/moveCrop";
import {
  moveFruitPatch,
  MoveFruitPatchAction,
} from "./landExpansion/moveFruitPatch";
import { moveIron, MoveIronAction } from "./landExpansion/moveIron";
import { moveStone, MoveStoneAction } from "./landExpansion/moveStone";
import { moveGold, MoveGoldAction } from "./landExpansion/moveGold";
import { pickMushroom, PickMushroomAction } from "./landExpansion/pickMushroom";
import { Announcements } from "../types/announcements";
import { deliverOrder, DeliverOrderAction } from "./landExpansion/deliver";
import { equip, EquipBumpkinAction } from "./landExpansion/equip";
import { refundBid, RefundBidAction } from "./landExpansion/refundBid";
import { cancelBid, CancelBidAction } from "./landExpansion/cancelBid";
import { mixPotion, MixPotionAction } from "./landExpansion/mixPotion";
import { buyWearable, BuyWearableAction } from "./landExpansion/buyWearable";
import { skipOrder, SkipOrderAction } from "./landExpansion/skipOrder";
import { StartPotionAction, startPotion } from "./landExpansion/startPotion";
import { moveBud, MoveNFTAction } from "./landExpansion/moveNFT";
import { removeNFT, RemoveNFTAction } from "./landExpansion/removeNFT";
import {
  startComposter,
  StartComposterAction,
} from "./landExpansion/startComposter";
import {
  collectCompost,
  collectCompostAction,
} from "./landExpansion/collectCompost";
import {
  fertiliseFruitPatch,
  FertiliseFruitAction,
} from "./landExpansion/fertiliseFruitPatch";
import { castRod, CastRodAction } from "./landExpansion/castRod";
import { reelRod, ReelRodAction } from "./landExpansion/reelRod";
import { catchMarvel, CatchMarvelAction } from "./landExpansion/catchMarvel";
import {
  claimMilestone,
  ClaimMilestoneAction,
} from "./landExpansion/claimMilestone";
import { missMap, MissMapAction } from "./landExpansion/missMap";
import { revealLand, RevealLandAction } from "./landExpansion/revealLand";
import {
  burnCollectible,
  BurnCollectibleAction,
} from "./landExpansion/burnCollectible";
import { claimBonus, ClaimBonusAction } from "./landExpansion/claimBonus";
import {
  claimDailyReward,
  ClaimDailyRewardAction,
} from "./landExpansion/claimDailyReward";
import {
  accelerateComposter,
  AccelerateComposterAction,
} from "./landExpansion/accelerateComposter";
import {
  moveCrimstone,
  MoveCrimstoneAction,
} from "./landExpansion/moveCrimstone";
import {
  mineCrimstone,
  MineCrimstoneAction,
} from "./landExpansion/mineCrimstone";
import {
  placeCrimstone,
  PlaceCrimstoneAction,
} from "./landExpansion/placeCrimstone";
import { buyFarmhand, BuyFarmHandAction } from "./landExpansion/buyFarmHand";
import {
  equipFarmhand,
  EquipFarmHandAction,
} from "./landExpansion/equipFarmHand";
import { moveBeehive, MoveBeehiveAction } from "./landExpansion/moveBeehive";
import { placeBeehive, PlaceBeehiveAction } from "./landExpansion/placeBeehive";
import {
  harvestBeehive,
  HarvestBeehiveAction,
} from "./landExpansion/harvestBeehive";
import { plantFlower, PlantFlowerAction } from "./landExpansion/plantFlower";
import {
  harvestFlower,
  HarvestFlowerAction,
} from "./landExpansion/harvestFlower";
import {
  moveFlowerBed,
  MoveFlowerBedAction,
} from "./landExpansion/moveFlowerBed";
import {
  placeFlowerBed,
  PlaceFlowerBedAction,
} from "./landExpansion/placeFlowerBed";
import {
  upgrade as upgrade,
  UpgradeFarmAction,
} from "./landExpansion/upgradeFarm";
import {
  placeSunstone,
  PlaceSunstoneAction,
} from "./landExpansion/placeSunstone";
import { moveSunstone, MoveSunstoneAction } from "./landExpansion/moveSunstone";
import { mineSunstone, MineSunstoneAction } from "./landExpansion/mineSunstone";
import {
  FlowerShopTradedAction,
  tradeFlowerShop,
} from "./landExpansion/tradeFlowerShop";

import {
  completeSpecialEventTask,
  CompleteSpecialEventTaskAction,
} from "./landExpansion/completeSpecialEventTask";
import { claimGift, ClaimGiftAction } from "./landExpansion/claimBumpkinGift";
import { giftFlowers, GiftFlowersAction } from "./landExpansion/giftFlowers";

import {
  exchangeSFLtoCoins,
  ExchangeSFLtoCoinsAction,
} from "./landExpansion/exchangeSFLtoCoins";
import {
  moveOilReserve,
  MoveOilReserveAction,
} from "./landExpansion/moveOilReserve";
import {
  placeOilReserve,
  PlaceOilReserveAction,
} from "./landExpansion/placeOilReserve";
import {
  drillOilReserve,
  DrillOilReserveAction,
} from "./landExpansion/drillOilReserve";
import {
  harvestGreenHouse,
  HarvestGreenhouseAction,
} from "./landExpansion/harvestGreenHouse";
import {
  plantGreenhouse,
  PlantGreenhouseAction,
} from "./landExpansion/plantGreenhouse";
import {
  oilGreenhouse,
  OilGreenhouseAction,
} from "./landExpansion/oilGreenHouse";
import {
  supplyCookingOil,
  SupplyCookingOilAction,
} from "./landExpansion/supplyCookingOil";

import {
  PurchaseMinigameAction,
  purchaseMinigameItem,
} from "./minigames/purchaseMinigameItem";
import {
  claimMinigamePrize,
  ClaimMinigamePrizeAction,
} from "./minigames/claimMinigamePrize";
import {
  supplyCropMachine,
  SupplyCropMachineAction,
} from "./landExpansion/supplyCropMachine";
import {
  supplyCropMachineOil,
  SupplyCropMachineOilAction,
} from "./landExpansion/supplyCropMachineOil";
import {
  harvestCropMachine,
  HarvestCropMachineAction,
} from "./landExpansion/harvestCropMachine";
import {
  removeCropMachinePack,
  RemoveCropMachinePackAction,
} from "./landExpansion/removeCropMachinePack";
import { joinFaction, JoinFactionAction } from "./landExpansion/joinFaction";
import {
  completeKingdomChore,
  CompleteKingdomChoreAction,
} from "./landExpansion/completeKingdomChore";
import {
  DeliverFactionKitchenAction,
  deliverFactionKitchen,
} from "./landExpansion/deliverFactionKitchen";
import {
  BuyFactionShopItemAction,
  buyFactionShopItem,
} from "./landExpansion/buyFactionShopItem";
import {
  claimFactionPrize,
  ClaimFactionPrizeAction,
} from "./landExpansion/claimFactionPrize";
import {
  FeedFactionPetAction,
  feedFactionPet,
} from "./landExpansion/feedFactionPet";
import { FeedPetAction, feedPet } from "./pets/feedPet";
import {
  refreshKingdomChores,
  RefreshKingdomChoresAction,
} from "./landExpansion/refreshKingdomChores";
import {
  skipKingdomChore,
  SkipKingdomChoreAction,
} from "./landExpansion/skipKingdomChore";
import { leaveFaction, LeaveFactionAction } from "./landExpansion/leaveFaction";
import { BuyMoreDigsAction, buyMoreDigs } from "./landExpansion/buyMoreDigs";
import {
  claimTrackMilestone,
  ClaimTrackMilestoneAction,
} from "./landExpansion/claimTrackMilestone";

import {
  startMinigameAttempt,
  StartMinigameAttemptAction,
} from "./minigames/startMinigameAttempt";
import {
  submitMinigameScore,
  SubmitMinigameScoreAction,
} from "./minigames/submitMinigameScore";
import { claimOffer, ClaimOfferAction } from "./landExpansion/offerClaimed";
import {
  startCompetition,
  StartCompetitionAction,
} from "./landExpansion/startCompetition";
import {
  shipmentRestock,
  ShipmentRestockAction,
} from "./landExpansion/shipmentRestocked";
import {
  speedUpRecipe,
  InstantCookRecipe,
} from "./landExpansion/speedUpRecipe";
import {
  speedUpExpansion,
  InstantExpand,
} from "./landExpansion/speedUpExpansion";
import {
  speedUpCollectible,
  SpeedUpCollectible,
} from "./landExpansion/speedUpCollectible";
import {
  speedUpBuilding,
  SpeedUpBuilding,
} from "./landExpansion/speedUpBuilding";
import { buyAnimal, BuyAnimalAction } from "./landExpansion/buyAnimal";
import { feedAnimal, FeedAnimalAction } from "./landExpansion/feedAnimal";
import { loveAnimal, LoveAnimalAction } from "./landExpansion/loveAnimal";
import { feedMixed, FeedMixedAction } from "features/feederMachine/feedMixed";
import {
  upgradeBuilding,
  UpgradeBuildingAction,
} from "./landExpansion/upgradeBuilding";
import { sellAnimal, SellAnimalAction } from "./landExpansion/sellAnimal";
import {
  startCrafting,
  StartCraftingAction,
} from "./landExpansion/startCrafting";
import {
  collectCrafting,
  CollectCraftingAction,
} from "./landExpansion/collectCrafting";
import {
  completeNPCChore,
  CompleteNPCChoreAction,
} from "./landExpansion/completeNPCChore";
import { claimProduce, ClaimProduceAction } from "./landExpansion/claimProduce";
import { sellBounty, SellBountyAction } from "./landExpansion/sellBounty";
import {
  buyChapterItem,
  BuyChapterItemAction,
} from "./landExpansion/buyChapterItem";

import {
  unlockFarmhand,
  UnlockFarmhandAction,
} from "./landExpansion/unlockFarmhand";
import {
  sacrificeBear,
  SacrificeBearAction,
} from "./landExpansion/sacrificeBear";
import { ClaimPurchaseAction, claimPurchase } from "./claimPurchase";
import { npcRestock, NPCRestockAction } from "./landExpansion/npcRestock";
import {
  redeemTradeReward,
  RedeemTradeRewardsAction,
} from "./landExpansion/redeemTradeReward";
import { skillUse, SkillUseAction } from "./landExpansion/skillUsed";
import { dailyReset, DailyResetAction } from "./landExpansion/dailyReset";
import {
  acknowledgeCalendarEvent,
  AcknowledgeCalendarEventAction,
} from "./landExpansion/acknowledgeCalendarEvent";

import {
  collectLavaPit,
  CollectLavaPitAction,
} from "./landExpansion/collectLavaPit";
import { startLavaPit, StartLavaPitAction } from "./landExpansion/startLavaPit";
import { placeLavaPit, PlaceLavaPitAction } from "./landExpansion/placeLavaPit";
import { moveLavaPit, MoveLavaPitAction } from "./landExpansion/moveLavaPit";
import { buyResource, ResourceBoughtAction } from "./landExpansion/buyResource";
import {
  exchangeObsidian,
  ObsidianExchangedAction,
} from "./landExpansion/exchangeObsidian";
import {
  cancelQueuedRecipe,
  CancelQueuedRecipeAction,
} from "./landExpansion/cancelQueuedRecipe";
import {
  speedUpUpgrade,
  SpeedUpUpgradeAction,
} from "./landExpansion/speedUpUpgrade";
import {
  acknowledgeOnChainAirdrop,
  AcknowledgeOnChainAirdropAction,
} from "./landExpansion/acknowledgeOnChainAirdrop";
import {
  completeSocialTask,
  CompleteSocialTaskAction,
} from "./landExpansion/completeSocialTask";
import {
  claimReferralRewards,
  ClaimReferralRewardsAction,
} from "./landExpansion/claimReferralRewards";
import {
  exchangeFlower,
  ExchangeFlowerAction,
} from "./landExpansion/exchangeFLOWER";
import {
  buyFloatingShopItem,
  BuyFloatingShopItemAction,
} from "./landExpansion/buyFloatingShopItem";
import {
  buyEventShopItem,
  BuyMinigameItemAction,
} from "./landExpansion/buyPortalItem";
import {
  updateNetwork,
  UpdateNetworkAction,
} from "./landExpansion/updateNetwork";
import {
  acknowledgeRewardBox,
  AcknowledgeRewardBoxAction,
} from "./landExpansion/acknowledgeRewardBox";
import {
  openRewardBox,
  OpenRewardBoxAction,
} from "./landExpansion/openRewardBox";
import {
  claimBountyBonus,
  ClaimBountyBonusAction,
} from "./landExpansion/claimBountyBonus";
import {
  claimPetalPrize,
  ClaimPetalPrizeAction,
} from "./landExpansion/claimPetalPrize";
import { claimBlessing, ClaimBlessingAction } from "./claimBlessing";
import {
  buyOptionPurchaseItem,
  BuyOptionPurchaseItemAction,
} from "../types/buyOptionPurchaseItem";
import {
  InstantCraftAction,
  speedUpCrafting,
} from "./landExpansion/speedUpCrafting";
import { buyBiome, BuyBiomeAction } from "./landExpansion/buyBiome";
import { applyBiome, ApplyBiomeAction } from "./landExpansion/applyBiome";
import { buyMonument, BuyMonumentAction } from "./landExpansion/buyMonument";
import { removeTree, RemoveTreeAction } from "./landExpansion/removeTree";
import { removeStone, RemoveStoneAction } from "./landExpansion/removeStone";
import { removeIron, RemoveIronAction } from "./landExpansion/removeIron";
import { removeGold, RemoveGoldAction } from "./landExpansion/removeGold";
import {
  removeCrimstone,
  RemoveCrimstoneAction,
} from "./landExpansion/removeCrimstone";
import {
  removeSunstone,
  RemoveSunstoneAction,
} from "./landExpansion/removeSunstone";
import {
  removeLavaPit,
  RemoveLavaPitAction,
} from "./landExpansion/removeLavaPit";
import {
  removeOilReserve,
  RemoveOilReserveAction,
} from "./landExpansion/removeOilReserve";
import { removePlot, RemovePlotAction } from "./landExpansion/removePlot";
import {
  removeFruitPatch,
  RemoveFruitPatchAction,
} from "./landExpansion/removeFruitPatch";
import {
  removeFlowerBed,
  RemoveFlowerBedAction,
} from "./landExpansion/removeFlowerBed";
import {
  removeBeehive,
  RemoveBeehiveAction,
} from "./landExpansion/removeBeehive";
import { removeAll, RemoveAllAction } from "./landExpansion/removeAll";
import { wakeAnimal, WakeUpAnimalAction } from "./landExpansion/wakeUpAnimal";

import { retryFish, RetryFishAction } from "./landExpansion/retryFish";
import {
  flipCollectible,
  FlipCollectibleAction,
} from "./landExpansion/flipCollectible";

// Visiting local events
import {
  collectGarbage,
  CollectGarbageAction,
} from "./visiting/collectGarbage";
import { helpProject, HelpProjectAction } from "./visiting/helpProject";
import { burnClutter, BurnClutterAction } from "./landExpansion/burnClutter";
import {
  increaseHelpLimit,
  IncreaseHelpLimitAction,
} from "./landExpansion/increaseHelpLimit";
import {
  instantGrowProject,
  InstantGrowProjectAction,
} from "./landExpansion/instaGrowProject";
import { startProject, StartProjectAction } from "./landExpansion/startProject";
import {
  instaGrowFlower,
  InstaGrowFlowerAction,
} from "./landExpansion/instaGrowFlower";
import { upgradeRock, UpgradeRockAction } from "./landExpansion/upgradeRock";
import { upgradeTree, UpgradeTreeAction } from "./landExpansion/upgradeTree";
import { bulkFeedPets, BulkFeedPetsAction } from "./pets/bulkFeedPets";
import { NeglectPetAction, neglectPet } from "./pets/neglectPet";
import { petPet, PetPetAction } from "./pets/petPet";
import { fetchPet, FetchPetAction } from "./pets/fetchPet";
import { helpPets, HelpPetsAction } from "./visiting/helpPets";
import { BulkPlantAction, bulkPlant } from "./landExpansion/bulkPlant";
import { bulkHarvest, BulkHarvestAction } from "./landExpansion/bulkHarvest";
import {
  bulkFertilisePlot,
  BulkFertilisePlotAction,
} from "./landExpansion/bulkFertilisePlot";
import { clearTrades, ClearTradesAction } from "./clearTrades";
import { placeNFT, PlaceNFTAction } from "./landExpansion/placeNFT";
import { walkPet, WalkPetAction } from "./pets/walkPet";
import {
  renewPetShrine,
  RenewPetShrineAction,
} from "./landExpansion/renewPetShrine";
import {
  placeWaterTrap,
  PlaceWaterTrapAction,
} from "./landExpansion/placeWaterTrap";
import {
  collectWaterTrap,
  CollectWaterTrapAction,
} from "./landExpansion/collectWaterTrap";
import {
  speedUpProcessing,
  SpeedUpProcessingAction,
} from "./landExpansion/speedUpProcessing";

export type PlayingEvent =
  | ObsidianExchangedAction
  | SpeedUpUpgradeAction
  | ResourceBoughtAction
  | SellAnimalAction
  | SpeedUpBuilding
  | SacrificeBearAction
  | SpeedUpCollectible
  | SellBountyAction
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
  | ClaimAirdropAction
  | RecipeCookedAction
  | CollectRecipeAction
  | CancelProcessedResourceAction
  | ProcessProcessedResourceAction
  | CollectProcessedResourceAction
  | FeedBumpkinAction
  | DetectBotAction
  | ChoseSkillAction
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
  | ClaimBonusAction
  | ClaimDailyRewardAction
  | AccelerateComposterAction
  | BuyFarmHandAction
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
  | CompleteNPCChoreAction
  | ClaimProduceAction
  | BuyChapterItemAction
  | UnlockFarmhandAction
  | ClaimPurchaseAction
  | RedeemTradeRewardsAction
  | DailyResetAction
  | AcknowledgeCalendarEventAction
  | CollectLavaPitAction
  | StartLavaPitAction
  | CancelQueuedRecipeAction
  | AcknowledgeOnChainAirdropAction
  | CompleteSocialTaskAction
  | ExchangeFlowerAction
  | BuyFloatingShopItemAction
  | UpdateNetworkAction
  | BuyMinigameItemAction
  | AcknowledgeRewardBoxAction
  | OpenRewardBoxAction
  | ClaimPetalPrizeAction
  | ClaimBlessingAction
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
  | CollectWaterTrapAction
  | PlaceWaterTrapAction
  | SpeedUpProcessingAction
  | ClaimTrackMilestoneAction;

export type LocalVisitingEvent =
  | CollectGarbageAction
  | HelpProjectAction
  | HelpPetsAction;

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
  | RemoveLavaPitAction
  | RemoveOilReserveAction
  | RemovePlotAction
  | RemoveFruitPatchAction
  | RemoveFlowerBedAction
  | RemoveBeehiveAction
  | RemoveAllAction
  | FlipCollectibleAction;

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
  "competition.started": startCompetition,
  "offer.claimed": claimOffer,
  "faction.left": leaveFaction,
  "faction.prizeClaimed": claimFactionPrize,
  "greenhouse.oiled": oilGreenhouse,
  "greenhouse.harvested": harvestGreenHouse,
  "greenhouse.planted": plantGreenhouse,
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

  "timber.chopped": landExpansionChop,
  "recipe.cooked": cook,
  "recipes.collected": collectRecipe,
  "processedResource.cancelled": cancelProcessedResource,
  "processedResource.processed": processProcessedResource,
  "processedResource.collected": collectProcessedResource,
  "bumpkin.feed": feedBumpkin,
  "trackMilestone.claimed": claimTrackMilestone,
  "skill.chosen": choseSkill,
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
  "bonus.claimed": claimBonus,
  "dailyReward.claimed": claimDailyReward,
  "compost.accelerated": accelerateComposter,
  "farmHand.bought": buyFarmhand,
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
  "chore.fulfilled": completeNPCChore,
  "produce.claimed": claimProduce,
  "chapterItem.bought": buyChapterItem,
  "farmHand.unlocked": unlockFarmhand,
  "purchase.claimed": claimPurchase,
  "reward.redeemed": redeemTradeReward,
  "daily.reset": dailyReset,
  "calendarEvent.acknowledged": acknowledgeCalendarEvent,
  "lavaPit.collected": collectLavaPit,
  "lavaPit.started": startLavaPit,
  "upgrade.spedUp": speedUpUpgrade,
  "socialTask.completed": completeSocialTask,
  "referral.rewardsClaimed": claimReferralRewards,
  "exchange.flower": exchangeFlower,
  "floatingShopItem.bought": buyFloatingShopItem,
  "network.updated": updateNetwork,
  "minigameItem.bought": buyEventShopItem,
  "rewardBox.acknowledged": acknowledgeRewardBox,
  "rewardBox.opened": openRewardBox,
  "claim.bountyBoardBonus": claimBountyBonus,
  "petalPuzzle.solved": claimPetalPrize,
  "blessing.claimed": claimBlessing,
  "optionPurchaseItem.bought": buyOptionPurchaseItem,
  "crafting.spedUp": speedUpCrafting,
  "biome.bought": buyBiome,
  "biome.applied": applyBiome,
  "animal.wakeUp": wakeAnimal,
  "bumpkin.wave": bumpkinWave,
  "clutter.burned": burnClutter,
  "project.instantGrow": instantGrowProject,
  "project.started": startProject,
  "rock.upgraded": upgradeRock,
  "tree.upgraded": upgradeTree,
  "fish.retried": retryFish,
  "pet.pet": petPet,
  "trades.cleared": clearTrades,
  "petShrine.renewed": renewPetShrine,
  "waterTrap.placed": placeWaterTrap,
  "waterTrap.collected": collectWaterTrap,
};

export const LOCAL_VISITING_EVENTS: Handlers<LocalVisitingEvent> = {
  "garbage.collected": collectGarbage,
  "project.helped": helpProject,
  "pet.visitingPets": helpPets,
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
  "beehive.moved": moveBeehive,
  "beehive.placed": placeBeehive,
  "flowerBed.moved": moveFlowerBed,
  "flowerBed.placed": placeFlowerBed,
  "sunstone.placed": placeSunstone,
  "sunstone.moved": moveSunstone,
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
  "lavaPit.removed": removeLavaPit,
  "oilReserve.removed": removeOilReserve,
  "plot.removed": removePlot,
  "fruitPatch.removed": removeFruitPatch,
  "flowerBed.removed": removeFlowerBed,
  "beehive.removed": removeBeehive,
  "items.removed": removeAll,
  "collectible.flipped": flipCollectible,
};

export const EVENTS = {
  ...PLAYING_EVENTS,
  ...VISITING_EVENTS,
  ...PLACEMENT_EVENTS,
};
