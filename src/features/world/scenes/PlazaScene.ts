import mapJson from "assets/map/plaza.json";

import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Label } from "../containers/Label";

export const PLAZA_BUMPKINS: NPCBumpkin[] = [
  {
    x: 400,
    y: 400,
    npc: "pumpkin' pete",
  },
  {
    x: 625,
    y: 110,
    npc: "timmy",
  },
  {
    x: 313,
    y: 71,
    npc: "lily",
  },
  {
    x: 380,
    y: 130,
    npc: "blacksmith",
  },
  {
    x: 760,
    y: 390,
    npc: "grimbly",
  },
  {
    x: 810,
    y: 380,
    npc: "grimtooth",
  },
  {
    x: 120,
    y: 170,
    npc: "gabi",
  },
  {
    x: 480,
    y: 140,
    npc: "cornwell",
  },
  {
    x: 795,
    y: 118,
    npc: "bert",
  },
  {
    x: 513,
    y: 288,
    npc: "birdie",
  },
  {
    x: 33,
    y: 321,
    npc: "old salty",
  },
  {
    x: 840,
    y: 291,
    npc: "grubnuk",
  },
  {
    x: 800,
    y: 291,
    npc: "tywin",
  },
  {
    x: 820,
    y: 291,
    npc: "raven",
  },
];
export class PlazaScene extends BaseScene {
  roomId: RoomId = "plaza";

  constructor() {
    super({
      name: "plaza",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    this.load.spritesheet("plaza_bud", "world/plaza_bud.png", {
      frameWidth: 15,
      frameHeight: 18,
    });

    super.preload();
  }

  async create() {
    this.map = this.make.tilemap({
      key: "main-map",
    });

    super.create();

    this.initialiseNPCs(PLAZA_BUMPKINS);

    const auctionLabel = new Label(this, "AUCTIONS", "brown");
    auctionLabel.setPosition(591, 260);
    auctionLabel.setDepth(10000000);
    this.add.existing(auctionLabel);

    const clotheShopLabel = new Label(this, "STYLIST", "brown");
    clotheShopLabel.setPosition(256, 264);
    clotheShopLabel.setDepth(10000000);
    this.add.existing(clotheShopLabel);

    const decorationShopLabel = new Label(this, "DECORATIONS", "brown");
    decorationShopLabel.setPosition(797, 252);
    decorationShopLabel.setDepth(10000000);
    this.add.existing(decorationShopLabel);

    // Plaza Bud
    const bud = this.add.sprite(500, 420, "plaza_bud");
    this.anims.create({
      key: "plaza_bud_animation",
      frames: this.anims.generateFrameNumbers("plaza_bud", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    bud.play("plaza_bud_animation", true);
  }
}
