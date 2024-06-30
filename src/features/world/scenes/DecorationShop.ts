import decorationShopJSON from "assets/map/decorations.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

const BUMPKINS: NPCBumpkin[] = [
  {
    x: 112,
    y: 60,
    npc: "frankie",
  },
];

export class DecorationShopScene extends BaseScene {
  sceneId: SceneId = "decorations_shop";

  spawn: Coordinates = {
    x: 55,
    y: 157,
  };
  constructor() {
    super({ name: "decorations_shop", map: { json: decorationShopJSON } });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "decorations-shop",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
