import clothesShopJson from "assets/map/clothe_shop.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [
  {
    x: 144,
    y: 134,
    npc: "stella",
  },
];

export class ClothesShopScene extends BaseScene {
  sceneId: SceneId = "clothes_shop";

  constructor() {
    super({ name: "clothes_shop", map: { json: clothesShopJson } });
  }

  async create() {
    // eslint-disable-next-line no-console
    console.log("Create clothes shop");
    this.map = this.make.tilemap({
      key: "clothes-shop",
    });
    // eslint-disable-next-line no-console
    console.log("Created auction");

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
