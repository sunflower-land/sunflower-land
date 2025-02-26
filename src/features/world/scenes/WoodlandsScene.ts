import seasonal_woodland from "assets/map/seasonal_woodlands.json";
import rabbitJson from "assets/map/rabbit_woodlands.json";
import rabbitTileset from "assets/map/rabbit-tileset.json";
import seasonal_tileset from "assets/map/seasonal_tileset.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { npcModalManager } from "../ui/NPCModals";
import { interactableModalManager } from "../ui/InteractableModals";
import { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { capitalize } from "lib/utils/capitalize";

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
        json: IS_EASTER ? rabbitJson : seasonal_woodland,
        imageKey: IS_EASTER ? "easter-tileset" : "seasonal-tileset",
        defaultTilesetConfig: IS_EASTER ? rabbitTileset : seasonal_tileset,
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

    const season = this.gameState.season.season;

    // List of all seasonal elements
    const seasonElements = [
      "Ground",
      "Ground Decorations",
      "Flowers & Grass",
      "Paths",
      "Paths Layer 2",
      "Decoration Base",
      "Decoration Base 2",
      "Decoration Base 3",
      "Decorations Layer 2",
      "Decorations Layer 3",
      "Decorations Layer 4",
      "Building Base",
      "Building Base Decorations",
      "Building Layer 2",
      "Building Layer 3",
    ];
    const seasons = ["Spring", "Summer", "Autumn", "Winter"];

    const topElements = [
      "Decorations Layer 2",
      "Decorations Layer 3",
      "Decorations Layer 4",
      "Building Layer 2",
      "Building Layer 3",
    ];

    const topElementsSet = new Set(topElements);

    // Filter all seasonal layers that are not used for the active season
    seasons
      .filter((seasonName) => seasonName !== capitalize(season)) // Skip the active season
      .forEach((seasonName) => {
        seasonElements.forEach((element) => {
          const layerName = `${element}/${seasonName} ${element}`;
          const layer = this.layers[layerName];

          if (!layer) return; // Skip undefined layers

          layer.setVisible(false); // Hide inactive season layer

          // Set depth for elements that should be drawn on top
          if (topElementsSet.has(element)) {
            layer.setDepth(1000000);
          }
        });
      });
  }
}
