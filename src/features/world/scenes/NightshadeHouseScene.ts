import mapJSON from "assets/map/nightshade_house.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

export const NIGHTSHADE_HOUSE_NPCS: NPCBumpkin[] = [
  {
    x: 382,
    y: 205,
    npc: "dusk",
    direction: "left",
  },
  {
    x: 181,
    y: 161,
    npc: "shadow",
    direction: "right",
  },
  {
    x: 296,
    y: 156,
    npc: "chef ebon",
    direction: "left",
  },
];

export class NightshadeHouseScene extends BaseScene {
  sceneId: SceneId = "nightshade_house";

  constructor() {
    super({
      name: "nightshade_house",
      map: { json: mapJSON },
      audio: { fx: { walk_key: "wood_footstep" } },
    });
  }

  preload() {
    super.preload();

    this.load.spritesheet("fire", "world/fire_sheet.png", {
      frameWidth: 8,
      frameHeight: 12,
    });
  }

  create() {
    super.create();
    this.map = this.make.tilemap({
      key: "faction_house",
    });

    this.initialiseNPCs(NIGHTSHADE_HOUSE_NPCS);

    const fire = this.add.sprite(239, 348, "fire");
    const fire2 = this.add.sprite(287, 205, "fire");
    this.anims.create({
      key: "fire_anim",
      frames: this.anims.generateFrameNumbers("fire", {
        start: 0,
        end: 3,
      }),
      repeat: -1,
      frameRate: 10,
    });
    fire.play("fire_anim", true);
    fire2.play("fire_anim", true);
  }
}
