import mapJSON from "assets/map/sunflorian_house.json";

import { SceneId } from "../mmoMachine";
import { NPCBumpkin } from "./BaseScene";
import { FactionHouseScene } from "./FactionHouseScene";

export const SUNFLORIAN_HOUSE_NPCS: NPCBumpkin[] = [
  {
    x: 136,
    y: 325,
    npc: "solara",
    direction: "left",
  },
  {
    x: 390,
    y: 223,
    npc: "flora",
    direction: "left",
  },
  {
    x: 94,
    y: 212,
    npc: "chef lumen",
  },
];

export type PetStateSprite = "pet_sleeping" | "pet_hungry" | "pet_happy";

export class SunflorianHouseScene extends FactionHouseScene {
  sceneId: SceneId = "sunflorian_house";

  constructor() {
    super({
      name: "sunflorian_house",
      map: { json: mapJSON },
      audio: { fx: { walk_key: "wood_footstep" } },
    });
  }

  preload() {
    super.preload();

    this.load.image("pet_sleeping", "world/sunflorians_pet_sleeping.webp");
    this.load.image("pet_happy", "world/sunflorians_pet_happy.webp");
    this.load.image("pet_hungry", "world/sunflorians_pet_hungry.webp");
    this.makeFetchRequest();
  }

  create() {
    super.create();
    this.map = this.make.tilemap({
      key: "faction_house",
    });

    this.initialiseNPCs(SUNFLORIAN_HOUSE_NPCS);
    this.setupPrize({ x: 240, y: 384 });
    this.setUpPet();
    this.setupNotice({ x: 312, y: 226 });
  }
}
