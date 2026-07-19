import streamJSON from "assets/map/stream.json";

import type { SceneId } from "../mmoMachine";
import { BaseScene, type NPCBumpkin } from "./BaseScene";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import { getKeys } from "lib/object";
import type { Physics } from "phaser";
import { hasFeatureAccess } from "lib/flags";
import { npcModalManager } from "../ui/NPCModals";
import { interactableModalManager } from "../ui/InteractableModals";
import { Label } from "../containers/Label";

const BUMPKINS: NPCBumpkin[] = [
  {
    npc: "streamer",
    x: 210,
    y: 117,
    hideLabel: true,
  },
];

export class StreamScene extends BaseScene {
  sceneId: SceneId = "stream";

  spawn: Coordinates = {
    x: 55,
    y: 157,
  };
  constructor() {
    super({ name: "stream", map: { json: streamJSON } });
  }

  async preload() {
    super.preload();
    this.load.image("speaker", "world/speaker.webp");
    this.load.image("giveaway_gift", "world/vip_gift.png");
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

    const image = this.add.image(215, 102, "speaker");
    image.on("pointerdown", () => {
      npcModalManager.open("streamer");
    });

    // Town-hall giveaway board — opens the giveaway modal.
    const giveaway = this.add
      .sprite(120, 150, "giveaway_gift")
      .setInteractive({ cursor: "pointer" });
    giveaway.on("pointerdown", () => {
      interactableModalManager.open("giveaway_board");
    });

    const giveawayLabel = new Label(this, "GIVEAWAY", "brown");
    giveawayLabel.setPosition(120, 135);
    giveawayLabel.setDepth(10000000);
    this.add.existing(giveawayLabel);
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
