import mapJSON from "assets/map/goblin_house.json";

import { SceneId } from "../mmoMachine";
import { NPCBumpkin } from "./BaseScene";
import { FactionHouseScene } from "./FactionHouseScene";
import { PetStateSprite } from "./SunflorianHouseScene";
import { npcModalManager } from "../ui/NPCModals";
import { Label } from "../containers/Label";

export const GOBLIN_HOUSE_NPCS: NPCBumpkin[] = [
  {
    // Trader
    x: 410,
    y: 200,
    npc: "glinteye",
    direction: "left",
  },
  {
    x: 378,
    y: 336,
    npc: "grizzle",
    direction: "left",
  },
  {
    x: 110,
    y: 239,
    npc: "chef tuck",
  },
];

export class GoblinHouseScene extends FactionHouseScene {
  sceneId: SceneId = "goblin_house";
  public snaggle: Phaser.GameObjects.Sprite | undefined;
  private _petState: PetStateSprite = "pet_hungry";

  constructor() {
    super({
      name: "goblin_house",
      map: { json: mapJSON },
      audio: { fx: { walk_key: "wood_footstep" } },
    });
  }

  preload() {
    super.preload();

    this.load.image("pet_sleeping", "world/goblins_pet_sleeping.webp");
    this.load.image("pet_satiated", "world/goblins_pet_happy.webp");
    this.load.image("pet_hungry", "world/goblins_pet_hungry.webp");
  }

  setUpPet() {
    this.petState = this.getPetState();
    this.snaggle = this.add.sprite(242, 237, this.petState);
    this.snaggle
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", (p: Phaser.Input.Pointer) => {
        if (p.downElement.nodeName === "CANVAS") {
          npcModalManager.open("snaggle");
        }
      });
    const label = new Label(this, "SNAGGLE");
    // Add the label to the scene
    label.setPosition(240, 265);
    this.add.existing(label);
  }

  set petState(newValue: PetStateSprite) {
    this._petState = newValue;
    this.onPetStateChange(newValue); // Call the function when value changes
  }

  get petState() {
    return this._petState;
  }

  onPetStateChange(newValue: PetStateSprite) {
    this.snaggle?.setTexture(newValue);
  }

  create() {
    super.create();
    this.map = this.make.tilemap({
      key: "faction_house",
    });

    this.initialiseNPCs(GOBLIN_HOUSE_NPCS);

    this.setupPrize({ x: 240, y: 416 });
    this.setUpPet();
  }
  update() {
    super.update();
  }
}
