import woodlandsJSON from "assets/map/woodlands.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { npcModalManager } from "../ui/NPCModals";
import { interactableModalManager } from "../ui/InteractableModals";

const BUMPKINS: NPCBumpkin[] = [
  {
    x: 150,
    y: 80,
    npc: "eins",
    onClick: () => {
      interactableModalManager.open("potion_table");
    },
  },
  {
    x: 380,
    y: 60,
    npc: "garth",
    direction: "left",
    onClick: () => {
      npcModalManager.open("garth");
    },
  },
];

export class WoodlandsScene extends BaseScene {
  sceneId: SceneId = "woodlands";

  constructor() {
    super({
      name: "woodlands",
      map: { json: woodlandsJSON },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();
  }

  create() {
    console.log("Create woodlands shop");
    this.map = this.make.tilemap({
      key: "woodlands",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
