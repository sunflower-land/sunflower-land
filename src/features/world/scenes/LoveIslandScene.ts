import loveIslandJSON from "assets/map/love_island.json";
import seasonal_tileset from "assets/map/seasonal_tileset.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

const BUMPKINS: NPCBumpkin[] = [];

export class LoveIslandScene extends BaseScene {
  sceneId: SceneId = "love_island";

  spawn: Coordinates = {
    x: 55,
    y: 157,
  };
  constructor() {
    super({
      name: "love_island",
      map: {
        json: loveIslandJSON,
        imageKey: "seasonal-tileset",
        defaultTilesetConfig: seasonal_tileset,
      },
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "love_island",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
