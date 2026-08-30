import type { GameBridge } from "../bridge/GameBridge";
import type { FarmScene } from "../scenes/FarmScene";
import type { EntityRenderer } from "./EntityRenderer";
import { OceanLayer } from "../layers/OceanLayer";
import { LandBaseLayer } from "../layers/LandBaseLayer";
import { DirtLayer } from "../layers/DirtLayer";
import { BackgroundIslandsLayer } from "../layers/BackgroundIslandsLayer";
import { CloudsLayer } from "../layers/CloudsLayer";
import { InteriorBackdropLayer } from "../layers/InteriorBackdropLayer";
import { GreenhousePotRenderer } from "./greenhouse/GreenhousePotRenderer";
import { GreenhouseOilRenderer } from "./greenhouse/GreenhouseOilRenderer";
import { AnimalHouseRenderer } from "./animals/AnimalHouseRenderer";
import { WaterDecorLayer } from "../layers/WaterDecorLayer";
import { BoatsLayer } from "../layers/BoatsLayer";
import { UpcomingExpansionRenderer } from "./UpcomingExpansionRenderer";
import { CropRenderer } from "./crops/CropRenderer";
import { TreeRenderer } from "./resources/TreeRenderer";
import {
  MineralRenderer,
  STONE_CONFIG,
  IRON_CONFIG,
  GOLD_CONFIG,
  CRIMSTONE_CONFIG,
  SUNSTONE_CONFIG,
} from "./resources/MineralRenderer";
import { AscensionCrystalRenderer } from "./resources/AscensionCrystalRenderer";
import { OilReserveRenderer } from "./resources/OilReserveRenderer";
import { LavaPitRenderer } from "./resources/LavaPitRenderer";
import { BoulderRenderer } from "./resources/BoulderRenderer";
import { FruitPatchRenderer } from "./resources/FruitPatchRenderer";
import { FlowerBedRenderer } from "./resources/FlowerBedRenderer";
import { BeehiveRenderer } from "./resources/BeehiveRenderer";
import { MushroomRenderer } from "./resources/MushroomRenderer";
import { SaltRenderer } from "./resources/SaltRenderer";
import { WaterTrapRenderer } from "./resources/WaterTrapRenderer";
import { FishermanRenderer } from "./resources/FishermanRenderer";
import { BuildingRenderer } from "./buildings/BuildingRenderer";
import { CollectibleRenderer } from "./collectibles/CollectibleRenderer";
import { PlayerRenderer } from "./characters/PlayerRenderer";
import { BudRenderer } from "./characters/BudRenderer";
import { PetRenderer } from "./characters/PetRenderer";
import { AirdropRenderer } from "./characters/AirdropRenderer";
import { ClutterRenderer } from "./characters/ClutterRenderer";

export type RendererFactory = (
  scene: FarmScene,
  bridge: GameBridge,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => EntityRenderer<any>;

/**
 * The successor of Land.tsx's islandElements arrays: everything the farm
 * renders, in one place. Adding a new entity type to the farm = one renderer
 * class + one entry here. FarmScene instantiates, mounts, updates, and
 * destroys everything in this map — nothing else needs to know a type exists.
 *
 * Paint order comes from each renderer's DEPTHS band, not from this map's
 * order. Keys are labels for debugging/logging only.
 *
 * Filled in as the port progresses (crops in Phase 2, trees/rocks in Phase 3,
 * ...).
 */
/**
 * Home interior [home/Home.tsx]: the room backdrop plus the placement
 * renderers, which pick their slice from the scene's location.
 */
export const HOME_RENDERERS: Record<string, RendererFactory> = {
  interiorBackdrop: (scene, bridge) => new InteriorBackdropLayer(scene, bridge),
  collectibles: (scene, bridge) => new CollectibleRenderer(scene, bridge),
  buds: (scene, bridge) => new BudRenderer(scene, bridge),
  pets: (scene, bridge) => new PetRenderer(scene, bridge),
  players: (scene, bridge) => new PlayerRenderer(scene, bridge),
};

/** [PetHouseInside.tsx] the pet house: room + placed pets (common + NFT). */
export const PET_HOUSE_RENDERERS: Record<string, RendererFactory> = {
  interiorBackdrop: (scene, bridge) => new InteriorBackdropLayer(scene, bridge),
  collectibles: (scene, bridge) => new CollectibleRenderer(scene, bridge),
  pets: (scene, bridge) => new PetRenderer(scene, bridge),
};

/** [GreenhouseInside.tsx] the greenhouse: room + its four pots. */
export const GREENHOUSE_RENDERERS: Record<string, RendererFactory> = {
  interiorBackdrop: (scene, bridge) => new InteriorBackdropLayer(scene, bridge),
  pots: (scene, bridge) => new GreenhousePotRenderer(scene, bridge),
  oil: (scene, bridge) => new GreenhouseOilRenderer(scene, bridge),
};

/** [BarnInside.tsx / HenHouseInside.tsx] the animal houses. */
export const ANIMAL_HOUSE_RENDERERS: Record<string, RendererFactory> = {
  interiorBackdrop: (scene, bridge) => new InteriorBackdropLayer(scene, bridge),
  animals: (scene, bridge) => new AnimalHouseRenderer(scene, bridge),
};

/** [interior/Interior.tsx + LevelOne.tsx] the interior floors. */
export const INTERIOR_FLOOR_RENDERERS: Record<string, RendererFactory> = {
  interiorBackdrop: (scene, bridge) => new InteriorBackdropLayer(scene, bridge),
  collectibles: (scene, bridge) => new CollectibleRenderer(scene, bridge),
  buds: (scene, bridge) => new BudRenderer(scene, bridge),
  pets: (scene, bridge) => new PetRenderer(scene, bridge),
  players: (scene, bridge) => new PlayerRenderer(scene, bridge),
};

export const RENDERERS: Record<string, RendererFactory> = {
  ocean: (scene, bridge) => new OceanLayer(scene, bridge),
  landBase: (scene, bridge) => new LandBaseLayer(scene, bridge),
  dirt: (scene, bridge) => new DirtLayer(scene, bridge),
  backgroundIslands: (scene, bridge) =>
    new BackgroundIslandsLayer(scene, bridge),
  clouds: (scene, bridge) => new CloudsLayer(scene, bridge),
  waterDecor: (scene, bridge) => new WaterDecorLayer(scene, bridge),
  boats: (scene, bridge) => new BoatsLayer(scene, bridge),
  upcomingExpansion: (scene, bridge) =>
    new UpcomingExpansionRenderer(scene, bridge),
  crops: (scene, bridge) => new CropRenderer(scene, bridge),
  trees: (scene, bridge) => new TreeRenderer(scene, bridge),
  stones: (scene, bridge) => new MineralRenderer(scene, bridge, STONE_CONFIG),
  iron: (scene, bridge) => new MineralRenderer(scene, bridge, IRON_CONFIG),
  gold: (scene, bridge) => new MineralRenderer(scene, bridge, GOLD_CONFIG),
  crimstones: (scene, bridge) =>
    new MineralRenderer(scene, bridge, CRIMSTONE_CONFIG),
  sunstones: (scene, bridge) =>
    new MineralRenderer(scene, bridge, SUNSTONE_CONFIG),
  ascensionCrystals: (scene, bridge) =>
    new AscensionCrystalRenderer(scene, bridge),
  oilReserves: (scene, bridge) => new OilReserveRenderer(scene, bridge),
  lavaPits: (scene, bridge) => new LavaPitRenderer(scene, bridge),
  boulders: (scene, bridge) => new BoulderRenderer(scene, bridge),
  fruitPatches: (scene, bridge) => new FruitPatchRenderer(scene, bridge),
  flowerBeds: (scene, bridge) => new FlowerBedRenderer(scene, bridge),
  beehives: (scene, bridge) => new BeehiveRenderer(scene, bridge),
  mushrooms: (scene, bridge) => new MushroomRenderer(scene, bridge),
  saltFarm: (scene, bridge) => new SaltRenderer(scene, bridge),
  waterTraps: (scene, bridge) => new WaterTrapRenderer(scene, bridge),
  fisherman: (scene, bridge) => new FishermanRenderer(scene, bridge),
  buildings: (scene, bridge) => new BuildingRenderer(scene, bridge),
  collectibles: (scene, bridge) => new CollectibleRenderer(scene, bridge),
  players: (scene, bridge) => new PlayerRenderer(scene, bridge),
  buds: (scene, bridge) => new BudRenderer(scene, bridge),
  pets: (scene, bridge) => new PetRenderer(scene, bridge),
  airdrops: (scene, bridge) => new AirdropRenderer(scene, bridge),
  clutter: (scene, bridge) => new ClutterRenderer(scene, bridge),
};
