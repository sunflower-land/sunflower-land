import streamJSON from "assets/map/stream.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

const BUMPKINS: NPCBumpkin[] = [];

export class StreamScene extends BaseScene {
  sceneId: SceneId = "stream";

  spawn: Coordinates = {
    x: 55,
    y: 157,
  };
  constructor() {
    super({ name: "stream", map: { json: streamJSON } });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "stream",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
