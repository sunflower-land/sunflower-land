import { SQUARE_WIDTH } from "features/game/lib/constants";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";

import mapJson from "assets/bumpkin-fight-club/map.json";

export class PortalScene extends BaseScene {
  sceneId: SceneId = "bumpkin_fight_club";

  constructor() {
    super({
      name: "bumpkin_fight_club",
      map: {
        json: mapJson,
        tilesetUrl: "tileset-extruded.png",
        padding: [1, 2],
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    // Ambience SFX
    if (!this.sound.get("nature_1")) {
      const nature1 = this.sound.add("nature_1");
      nature1.play({ loop: true, volume: 0.01 });
    }

    // Shut down the sound when the scene changes
    this.events.once("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
    });
  }

  async create() {
    super.create();

    if (this.mmoServer) {
      // this.mmoServer.state.actions.onAdd(async (action) => {});
    }
  }

  update() {
    this.updateOtherPlayers();

    if (!this.currentPlayer?.body) {
      return;
    }

    const x = this.currentPlayer?.x ?? 0;
    const y = this.currentPlayer?.y ?? 0;

    const playerX = x / SQUARE_WIDTH;
    const playerY = y / SQUARE_WIDTH;

    this.updatePlayer();
  }
}
