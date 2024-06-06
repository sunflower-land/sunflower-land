import mapJSON from "assets/map/faction_house.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

export const BUMPKIN_HOUSE_NPCS: NPCBumpkin[] = [
  {
    x: 410,
    y: 200,
    npc: "haymitch",
    direction: "left",
  },
];

export class BumpkinHouseScene extends BaseScene {
  sceneId: SceneId = "bumpkin_house";

  constructor() {
    super({
      name: "bumpkin_house",
      map: { json: mapJSON },
      audio: { fx: { walk_key: "wood_footstep" } },
    });
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    this.map = this.make.tilemap({
      key: "faction_house",
    });

    this.initialiseNPCs(BUMPKIN_HOUSE_NPCS);
  }
}
