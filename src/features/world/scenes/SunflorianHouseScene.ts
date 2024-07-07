import mapJSON from "assets/map/sunflorian_house.json";

import { SceneId } from "../mmoMachine";
import { NPCBumpkin } from "./BaseScene";
import { FactionHouseScene } from "./FactionHouseScene";
import { npcModalManager } from "../ui/NPCModals";

export const SUNFLORIAN_HOUSE_NPCS: NPCBumpkin[] = [
  {
    x: 136,
    y: 325,
    npc: "solara",
    direction: "left",
  },
  {
    x: 390,
    y: 223,
    npc: "flora",
    direction: "left",
  },
  {
    x: 94,
    y: 212,
    npc: "chef lumen",
  },
];

export type PetStateSprite = "pet_sleeping" | "pet_hungry" | "pet_happy";

const PET_STATE_COORDS: { [key in PetStateSprite]: { x: number; y: number } } =
  {
    pet_hungry: {
      x: 243,
      y: 220,
    },
    pet_sleeping: {
      x: 243,
      y: 229,
    },
    pet_happy: {
      x: 243,
      y: 220,
    },
  };

export class SunflorianHouseScene extends FactionHouseScene {
  sceneId: SceneId = "sunflorian_house";

  public blaze: Phaser.GameObjects.Sprite | undefined;
  private _petState: PetStateSprite = "pet_hungry";

  constructor() {
    super({
      name: "sunflorian_house",
      map: { json: mapJSON },
      audio: { fx: { walk_key: "wood_footstep" } },
    });
  }

  preload() {
    super.preload();

    this.load.image("pet_sleeping", "world/sunflorians_pet_sleeping.webp");
    this.load.image("pet_happy", "world/sunflorians_pet_happy.webp");
    this.load.image("pet_hungry", "world/sunflorians_pet_hungry.webp");
    this.makeFetchRequest();
  }

  setUpPet() {
    this.petState = this.getPetState();
    this.blaze = this.add.sprite(
      PET_STATE_COORDS[this.petState].x,
      PET_STATE_COORDS[this.petState].y,
      this.petState,
    );
    this.blaze
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
    this.blaze?.setTexture(newValue);
    this.blaze?.setPosition(
      PET_STATE_COORDS[newValue].x,
      PET_STATE_COORDS[newValue].y,
    );
  }

  create() {
    super.create();
    this.map = this.make.tilemap({
      key: "faction_house",
    });

    this.initialiseNPCs(SUNFLORIAN_HOUSE_NPCS);
    this.setupPrize({ x: 240, y: 384 });
    this.setUpPet();
  }
}
