import mapJson from "assets/map/plaza.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Label } from "../containers/Label";
import { interactableModalManager } from "../ui/InteractableModals";

export const PLAZA_BUMPKINS: NPCBumpkin[] = [
  {
    x: 400,
    y: 400,
    npc: "pete",
  },
  {
    x: 815,
    y: 213,
    npc: "frankie",
    direction: "left",
  },
  {
    x: 312,
    y: 245,
    npc: "stella",
  },
  {
    x: 631,
    y: 98,
    npc: "timmy",
  },
  {
    x: 307,
    y: 72,
    npc: "raven",
    direction: "left",
  },
  {
    x: 364,
    y: 120,
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
    direction: "left",
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
    direction: "left",
  },
  {
    x: 534,
    y: 88,
    npc: "betty",
    direction: "left",
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
    direction: "left",
  },
  {
    x: 90,
    y: 70,
    npc: "tywin",
  },
  {
    x: 480,
    y: 235,
    npc: "luna",
    direction: "left",
  },
  {
    x: 505,
    y: 352,
    npc: "birdie",
    direction: "left",
  },
  {
    x: 208,
    y: 402,
    npc: "billy",
  },
  {
    x: 165,
    y: 293,
    npc: "hank",
  },
];
export class PlazaScene extends BaseScene {
  sceneId: SceneId = "plaza";

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

    this.load.spritesheet("plaza_bud_2", "world/plaza_bud_2.png", {
      frameWidth: 15,
      frameHeight: 18,
    });

    this.load.spritesheet("plaza_bud_3", "world/plaza_bud_3.png", {
      frameWidth: 15,
      frameHeight: 18,
    });

    this.load.spritesheet("fat_chicken", "world/fat_chicken.png", {
      frameWidth: 17,
      frameHeight: 21,
    });

    this.load.spritesheet("portal", "world/portal.png", {
      frameWidth: 30,
      frameHeight: 30,
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
    auctionLabel.setPosition(601, 260);
    auctionLabel.setDepth(10000000);
    this.add.existing(auctionLabel);

    // const clotheShopLabel = new Label(this, "STYLIST", "brown");
    // clotheShopLabel.setPosition(256, 264);
    // clotheShopLabel.setDepth(10000000);
    // this.add.existing(clotheShopLabel);

    // const decorationShopLabel = new Label(this, "DECORATIONS", "brown");
    // decorationShopLabel.setPosition(802, 229);
    // decorationShopLabel.setDepth(10000000);
    // this.add.existing(decorationShopLabel);

    const portal = this.add.sprite(505, 215, "portal");
    this.anims.create({
      key: "portal_anim",
      frames: this.anims.generateFrameNumbers("portal", {
        start: 0,
        end: 12,
      }),
      repeat: -1,
      frameRate: 10,
    });
    portal.play("portal_anim", true);

    // Plaza Bud
    const fatChicken = this.add.sprite(106, 352, "fat_chicken");
    this.anims.create({
      key: "fat_chicken_animation",
      frames: this.anims.generateFrameNumbers("fat_chicken", {
        start: 0,
        end: 9,
      }),
      repeat: -1,
      frameRate: 10,
    });
    fatChicken.play("fat_chicken_animation", true);
    fatChicken.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      interactableModalManager.open("fat_chicken");
    });

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

    // Plaza Bud
    const bud2 = this.add.sprite(601, 200, "plaza_bud_2");
    this.anims.create({
      key: "plaza_bud_animation_2",
      frames: this.anims.generateFrameNumbers("plaza_bud_2", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    bud2.play("plaza_bud_animation_2", true);
    bud2.setDepth(100000000000);

    const bud3 = this.add.sprite(206, 266, "plaza_bud_3");
    this.anims.create({
      key: "plaza_bud_animation_3",
      frames: this.anims.generateFrameNumbers("plaza_bud_3", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    bud3.play("plaza_bud_animation_3", true);
  }
}
