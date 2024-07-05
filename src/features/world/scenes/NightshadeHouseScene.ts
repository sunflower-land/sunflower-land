import mapJSON from "assets/map/nightshade_house.json";

import { SceneId } from "../mmoMachine";
import { NPCBumpkin } from "./BaseScene";
import { FactionHouseScene } from "./FactionHouseScene";
import { PetStateSprite } from "./SunflorianHouseScene";
import { npcModalManager } from "../ui/NPCModals";
import { Label } from "../containers/Label";

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

export class NightshadeHouseScene extends FactionHouseScene {
  sceneId: SceneId = "nightshade_house";

  public sable: Phaser.GameObjects.Sprite | undefined;
  private _petState: PetStateSprite = "pet_hungry";

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

    this.load.image("pet_sleeping", "world/nightshades_pet_sleeping.webp");
    this.load.image("pet_happy", "world/nightshades_pet_happy.webp");
    this.load.image("pet_hungry", "world/nightshades_pet_hungry.webp");
  }

  setUpPet() {
    this.petState = this.getPetState();
    this.sable = this.add.sprite(241, 284, this.petState);
    this.sable
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", (p: Phaser.Input.Pointer) => {
        if (p.downElement.nodeName === "CANVAS") {
          npcModalManager.open("sable");
        }
      });
    const label = new Label(this, "SABLE");
    // Add the label to the scene
    label.setPosition(240, 310);
    this.add.existing(label);
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

    this.setupPrize({ x: 240, y: 416 });
    this.setUpPet();
  }

  set petState(newValue: PetStateSprite) {
    this._petState = newValue;
    this.onPetStateChange(newValue); // Call the function when value changes
  }

  get petState() {
    return this._petState;
  }

  onPetStateChange(newValue: PetStateSprite) {
    this.sable?.setTexture(newValue);
  }
}
