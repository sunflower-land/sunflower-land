import woodlandsJSON from "assets/map/woodlands.json";
import rabbitJson from "assets/map/rabbit_woodlands.json";
import rabbitTileset from "assets/map/rabbit-tileset.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { npcModalManager } from "../ui/NPCModals";
import { interactableModalManager } from "../ui/InteractableModals";
import { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";

import { EVENT_BUMPKINS, sheepPlace } from "../ui/npcs/Sheep"; // Remove after released

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
  {
    x: 309,
    y: 360,
    npc: "orlin",
    direction: "left",
    onClick: () => {
      npcModalManager.open("orlin");
    },
  },
];

export class WoodlandsScene extends BaseScene {
  sceneId: SceneId = "woodlands";

  constructor({ gameState }: { gameState: GameState }) {
    const IS_EASTER = hasFeatureAccess(gameState, "EASTER");
    super({
      name: "woodlands",
      map: {
        json: IS_EASTER ? rabbitJson : woodlandsJSON,
        imageKey: IS_EASTER ? "easter-tileset" : "tileset",
        defaultTilesetConfig: IS_EASTER ? rabbitTileset : undefined,
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();
  }

  create() {
    this.map = this.make.tilemap({
      key: "woodlands",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    // Remove after release
    if (sheepPlace() === this.sceneId) {
      this.initialiseNPCs(EVENT_BUMPKINS);
    }
  }
}
