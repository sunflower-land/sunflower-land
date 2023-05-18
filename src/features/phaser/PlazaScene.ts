/**
 * ---------------------------
 * Phaser + Colyseus - Part 4.
 * ---------------------------
 * - Connecting with the room
 * - Sending inputs at the user's framerate
 * - Update other player's positions WITH interpolation (for other players)
 * - Client-predicted input for local (current) player
 * - Fixed tickrate on both client and server
 */

// import tilesheet from "./assets/idle-Sheet.png";
// import walking from "./assets/walking.png";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { npcModalManager } from "./NPCModals";
import { BumpkinContainer } from "./BumpkinContainer";
import { BaseScene } from "./BaseScene";

export const BACKEND_URL =
  window.location.href.indexOf("localhost") === -1
    ? `${window.location.protocol.replace("http", "ws")}//${
        window.location.hostname
      }${window.location.port && `:${window.location.port}`}`
    : "ws://localhost:2567";

export const BACKEND_HTTP_URL = BACKEND_URL.replace("ws", "http");

export class PhaserScene extends BaseScene {
  async create() {
    super.create();

    this.betty = new BumpkinContainer(
      this,
      400,
      400,
      {
        ...INITIAL_BUMPKIN,
        id: 44444,
        equipped: {
          ...INITIAL_BUMPKIN.equipped,
          hair: "Rancher Hair",
        },
      },
      () => npcModalManager.open("betty")
    );
    this.betty.body.width = 16;
    this.betty.body.height = 20;
    this.betty.body.setOffset(0, 0);
    this.physics.world.enable(this.betty);
    this.betty.body.setImmovable(true);

    this.betty.body.setCollideWorldBounds(true);
  }
}
