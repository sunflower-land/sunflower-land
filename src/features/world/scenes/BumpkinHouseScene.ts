import mapJSON from "assets/map/bumpkin_house.json";

import { SceneId } from "../mmoMachine";
import { NPCBumpkin } from "./BaseScene";
import { FactionHouseScene, PET_STATE_COORDS } from "./FactionHouseScene";
import { npcModalManager } from "../ui/NPCModals";

export const BUMPKIN_HOUSE_NPCS: NPCBumpkin[] = [
  {
    x: 384,
    y: 199,
    npc: "haymitch",
    direction: "left",
  },
  {
    x: 182,
    y: 160,
    npc: "buttercup",
    direction: "right",
  },
  {
    x: 389,
    y: 335,
    npc: "chef maple",
    direction: "left",
  },
];

export class BumpkinHouseScene extends FactionHouseScene {
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

    this.load.image("pet_sleeping", "world/bumpkins_pet_sleeping.webp");
    this.load.image("pet_happy", "world/bumpkins_pet_happy.webp");
    this.load.image("pet_hungry", "world/bumpkins_pet_hungry.webp");
  }

  setUpPet() {
    this.pet = this.add.sprite(
      PET_STATE_COORDS.bumpkins[this.petState].x,
      PET_STATE_COORDS.bumpkins[this.petState].y,
      this.petState,
    );
    this.pet
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", (p: Phaser.Input.Pointer) => {
        if (p.downElement.nodeName === "CANVAS") {
          npcModalManager.open("tater");
        }
      });
  }

  create() {
    super.create();
    this.map = this.make.tilemap({
      key: "faction_house",
    });

    this.initialiseNPCs(BUMPKIN_HOUSE_NPCS);

    this.setupPrize({ x: 240, y: 368 });
    this.setUpPet();
    this.setupNotice({ x: 328, y: 288 });
  }
}
