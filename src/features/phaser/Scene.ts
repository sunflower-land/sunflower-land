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

import Phaser from "phaser";
import { Room, Client } from "colyseus.js";

export const BACKEND_URL =
  window.location.href.indexOf("localhost") === -1
    ? `${window.location.protocol.replace("http", "ws")}//${
        window.location.hostname
      }${window.location.port && `:${window.location.port}`}`
    : "ws://localhost:2567";

export const BACKEND_HTTP_URL = BACKEND_URL.replace("ws", "http");

export class PhaserScene extends Phaser.Scene {
  room: Room;

  currentPlayer: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  playerEntities: {
    [sessionId: string]: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  } = {};

  debugFPS: Phaser.GameObjects.Text;

  localRef: Phaser.GameObjects.Rectangle;
  remoteRef: Phaser.GameObjects.Rectangle;

  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  inputPayload = {
    left: false,
    right: false,
    up: false,
    down: false,
    tick: undefined,
  };

  elapsedTime = 0;
  fixedTimeStep = 1000 / 60;

  currentTick = 0;

  constructor() {
    super({ key: "part4" });
  }

  preload() {
    // load the PNG file
    this.load.image("base_tiles", "assets/base_tiles.png");

    // load the JSON file
    this.load.tilemapTiledJSON("tilemap", "assets/base_tiles.json");
  }

  async create() {
    // 👌 sanity check by displaying the entire tileset image
    this.add.image(0, 0, "base_tiles");

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.debugFPS = this.add.text(4, 4, "", { color: "#ff0000" });

    // connect with the room
    await this.connect();

    this.room.state.players.onAdd((player, sessionId) => {
      const entity = this.physics.add.image(player.x, player.y, "ship_0001");
      this.playerEntities[sessionId] = entity;

      // is current player
      if (sessionId === this.room.sessionId) {
        this.currentPlayer = entity;

        this.localRef = this.add.rectangle(0, 0, entity.width, entity.height);
        this.localRef.setStrokeStyle(1, 0x00ff00);

        this.remoteRef = this.add.rectangle(0, 0, entity.width, entity.height);
        this.remoteRef.setStrokeStyle(1, 0xff0000);

        player.onChange(() => {
          this.remoteRef.x = player.x;
          this.remoteRef.y = player.y;
        });
      } else {
        // listening for server updates
        player.onChange(() => {
          //
          // we're going to LERP the positions during the render loop.
          //
          entity.setData("serverX", player.x);
          entity.setData("serverY", player.y);
        });
      }
    });

    // remove local reference when entity is removed from the server
    this.room.state.players.onRemove((player, sessionId) => {
      const entity = this.playerEntities[sessionId];
      if (entity) {
        entity.destroy();
        delete this.playerEntities[sessionId];
      }
    });

    // this.cameras.main.startFollow(this.ship, true, 0.2, 0.2);
    // this.cameras.main.setZoom(1);
    this.cameras.main.setBounds(0, 0, 800, 600);
  }

  async connect() {
    // add connection status text
    const connectionStatusText = this.add
      .text(0, 0, "Trying to connect with the server...")
      .setStyle({ color: "#ff0000" })
      .setPadding(4);

    const client = new Client(BACKEND_URL);

    try {
      this.room = await client.joinOrCreate("part4_room", {});

      // connection successful!
      connectionStatusText.destroy();
    } catch (e) {
      // couldn't connect
      connectionStatusText.text = "Could not connect with the server.";
    }
  }

  update(time: number, delta: number): void {
    // skip loop if not connected yet.
    if (!this.currentPlayer) {
      return;
    }

    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
      this.elapsedTime -= this.fixedTimeStep;
      this.fixedTick(time, this.fixedTimeStep);
    }

    this.debugFPS.text = `Frame rate: ${this.game.loop.actualFps}`;
  }

  fixedTick(time, delta) {
    this.currentTick++;

    // const currentPlayerRemote = this.room.state.players.get(this.room.sessionId);
    // const ticksBehind = this.currentTick - currentPlayerRemote.tick;
    // console.log({ ticksBehind });

    const velocity = 2;
    this.inputPayload.left = this.cursorKeys.left.isDown;
    this.inputPayload.right = this.cursorKeys.right.isDown;
    this.inputPayload.up = this.cursorKeys.up.isDown;
    this.inputPayload.down = this.cursorKeys.down.isDown;
    this.inputPayload.tick = this.currentTick;
    this.room.send(0, this.inputPayload);

    if (this.inputPayload.left) {
      this.currentPlayer.x -= velocity;
    } else if (this.inputPayload.right) {
      this.currentPlayer.x += velocity;
    }

    if (this.inputPayload.up) {
      this.currentPlayer.y -= velocity;
    } else if (this.inputPayload.down) {
      this.currentPlayer.y += velocity;
    }

    this.localRef.x = this.currentPlayer.x;
    this.localRef.y = this.currentPlayer.y;

    for (const sessionId in this.playerEntities) {
      // interpolate all player entities
      // (except the current player)
      if (sessionId === this.room.sessionId) {
        continue;
      }

      const entity = this.playerEntities[sessionId];
      const { serverX, serverY } = entity.data.values;

      entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
      entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
    }
  }
}
