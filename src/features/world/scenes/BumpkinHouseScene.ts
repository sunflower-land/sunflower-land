import mapJSON from "assets/map/bumpkin_house.json";

import { SceneId } from "../mmoMachine";
import { NPCBumpkin } from "./BaseScene";
import { FactionHouseScene } from "./FactionHouseScene";
import { PetStateSprite } from "./SunflorianHouseScene";
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

const PET_STATE_COORDS: { [key in PetStateSprite]: { x: number; y: number } } =
  {
    pet_hungry: {
      x: 241,
      y: 286,
    },
    pet_sleeping: {
      x: 239,
      y: 289,
    },
    pet_happy: {
      x: 239,
      y: 283,
    },
  };

export class BumpkinHouseScene extends FactionHouseScene {
  sceneId: SceneId = "bumpkin_house";

  public tater: Phaser.GameObjects.Sprite | undefined;
  private _petState: PetStateSprite = "pet_hungry";

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
    this.petState = this.getPetState();
    this.tater = this.add.sprite(
      PET_STATE_COORDS[this.petState].x,
      PET_STATE_COORDS[this.petState].y,
      "pet_hungry",
    );
    this.tater
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", (p: Phaser.Input.Pointer) => {
        if (p.downElement.nodeName === "CANVAS") {
          npcModalManager.open("blaze");
        }
      });
  }

  set petState(newValue: PetStateSprite) {
    this._petState = newValue;
    this.onPetStateChange(newValue); // Call the function when value changes
  }

  get petState() {
    return this._petState;
  }

  onPetStateChange(newValue: PetStateSprite) {
    this.tater?.setTexture(newValue);
    this.tater?.setPosition(
      PET_STATE_COORDS[newValue].x,
      PET_STATE_COORDS[newValue].y,
    );
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
