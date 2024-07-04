import mapJSON from "assets/map/sunflorian_house.json";

import { SceneId } from "../mmoMachine";
import { NPCBumpkin } from "./BaseScene";
import { FactionHouseScene } from "./FactionHouseScene";
import { npcModalManager } from "../ui/NPCModals";
import { getFactionPetUpdate } from "../ui/factions/actions/getFactionPetUpdate";
import { getFactionWeek } from "features/game/lib/factions";
import { PET_SLEEP_DURATION, PetState } from "../ui/factions/FactionPetPanel";
import { CollectivePet } from "features/game/types/game";
import { Label } from "../containers/Label";

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

type PetState = "pet_sleeping" | "pet_hungry" | "pet_happy";

const PET_STATE_COORDS: { [key in PetState]: { x: number; y: number } } = {
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
  public collectivePet: CollectivePet | undefined;
  private _petState: PetState = "pet_hungry";

  private fetchInterval: NodeJS.Timeout | null = null;

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

  getPetState() {
    const week = getFactionWeek({ date: new Date() });
    const beginningOfWeek = new Date(week).getTime();

    if (!this.collectivePet) return "pet_hungry";

    if (
      this.collectivePet.streak === 0 &&
      Date.now() < beginningOfWeek + PET_SLEEP_DURATION
    ) {
      return "pet_sleeping";
    }

    if (this.collectivePet.goalReached) return "pet_happy";

    return "pet_hungry";
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
    const label = new Label(this, "BLAZE");
    // Add the label to the scene
    label.setPosition(240, 248);
    this.add.existing(label);
  }

  set petState(newValue: PetState) {
    this._petState = newValue;
    this.onPetStateChange(newValue); // Call the function when value changes
  }

  get petState() {
    return this._petState;
  }

  onPetStateChange(newValue: PetState) {
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
    this.fetchInterval = setInterval(() => this.makeFetchRequest(), 10 * 1000);
  }

  async makeFetchRequest() {
    const { farmId } = this.gameService.state.context;
    const data = await getFactionPetUpdate({ farmId });

    this.collectivePet = data;
  }

  shutdown() {
    if (this.fetchInterval) {
      clearInterval(this.fetchInterval);
    }
  }

  destroy() {
    if (this.fetchInterval) {
      clearInterval(this.fetchInterval);
    }
  }
}
