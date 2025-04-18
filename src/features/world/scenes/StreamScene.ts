import streamJSON from "assets/map/stream.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { getKeys } from "features/game/types/decorations";
import { Physics } from "phaser";
import { hasFeatureAccess } from "lib/flags";

const BUMPKINS: NPCBumpkin[] = [];

export class StreamScene extends BaseScene {
  sceneId: SceneId = "stream";

  spawn: Coordinates = {
    x: 55,
    y: 157,
  };
  constructor() {
    super({ name: "stream", map: { json: streamJSON } });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "stream",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    if (hasFeatureAccess(this.gameState, "STREAM_STAGE_ACCESS")) {
      // Disable all the colliders
      this.colliders?.getChildren().forEach((collider) => {
        collider.setActive(false);

        this.physics.world.disable(collider);
        (collider.body as Physics.Arcade.Body).setImmovable(false);
      });
    }
  }

  update() {
    super.update();

    // Make the players face the center
    getKeys(this.playerEntities).forEach((playerId) => {
      const player = this.playerEntities[playerId];

      // Skip if the player hasn't been set up yet
      if (!player?.active) return;

      if (player.x < 240) {
        player.faceRight();
      } else {
        player.faceLeft();
      }
    });
  }

  // We don't overload the server with events
  sendPositionToServer() {
    return;
  }
}
