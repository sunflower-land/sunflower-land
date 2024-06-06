import mapJSON from "assets/map/faction_house.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

export const SUNFLORIAN_HOUSE_NPCS: NPCBumpkin[] = [
  {
    x: 410,
    y: 200,
    npc: "solara",
    direction: "left",
  },
];

export class SunflorianHouseScene extends BaseScene {
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
  }

  create() {
    super.create();
    this.map = this.make.tilemap({
      key: "faction_house",
    });

    this.initialiseNPCs(SUNFLORIAN_HOUSE_NPCS);
  }
}
