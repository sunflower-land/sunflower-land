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

import Phaser, { Physics } from "phaser";
import { Room, Client } from "colyseus.js";

import mapPng from "./assets/embedded.png";
import mapJson from "./assets/world_plaza.json";
import auctionJson from "./assets/auction.json";
import speechBubble from "./assets/speech_bubble.png";
import shadow from "assets/npcs/shadow.png";
import silhouette from "assets/npcs/silhouette.webp";
import fontPng from "./assets/newer.png";
import { INITIAL_BUMPKIN, SQUARE_WIDTH } from "features/game/lib/constants";
import { BumpkinContainer } from "./BumpkinContainer";
import { interactableModalManager } from "./InteractableModals";
import { MachineInterpreter, RoomEvent } from "./roomMachine";

export const BACKEND_URL =
  window.location.href.indexOf("localhost") === -1
    ? `${window.location.protocol.replace("http", "ws")}//${
        window.location.hostname
      }${window.location.port && `:${window.location.port}`}`
    : "ws://localhost:2567";

export const BACKEND_HTTP_URL = BACKEND_URL.replace("ws", "http");

export class BaseScene extends Phaser.Scene {
  public map: Phaser.Tilemaps.Tilemap;
  room: Room | undefined;

  currentPlayer: BumpkinContainer | undefined;
  betty: BumpkinContainer | undefined;
  playerEntities: {
    [sessionId: string]: BumpkinContainer;
  } = {};

  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
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

  // We manually inject room service onto the initialised Phaser Game
  private get roomService() {
    return (this.game as any).roomService as MachineInterpreter;
  }
  preload() {
    this.load.tilemapTiledJSON("main-map", mapJson);
    this.load.tilemapTiledJSON("auction-map", auctionJson);
    this.load.image("tileset", mapPng);
    this.load.image("speech_bubble", speechBubble);
    this.load.image("shadow", shadow);
    this.load.spritesheet("silhouette", silhouette, {
      frameWidth: 14,
      frameHeight: 18,
    });
    this.load.bitmapFont(
      "bitmapFont",
      fontPng,
      "./src/features/phaser/assets/newer.fnt"
    );
  }

  async create() {
    console.log({ game: this.game });

    const tileset = this.map.addTilesetImage(
      "Sunnyside V3",
      "tileset",
      16,
      16
    ) as Phaser.Tilemaps.Tileset;

    // Set up colliders
    const customColliders = this.add.group();
    const collisionPolygons = this.map.createFromObjects("Collision", {
      scene: this,
    });
    collisionPolygons.forEach((polygon) => {
      customColliders.add(polygon);
      this.physics.world.enable(polygon);
      (polygon.body as Physics.Arcade.Body).setImmovable(true);
    });

    const interactablesPolygons = this.map.createFromObjects(
      "Interactable",
      {}
    );

    interactablesPolygons.forEach((polygon) => {
      polygon.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
        const position = polygon as unknown as Phaser.Math.Vector2;
        const distance = Phaser.Math.Distance.BetweenPoints(
          position,
          this.currentPlayer as BumpkinContainer
        );
        if (distance > 30) {
          const text = this.add.bitmapText(
            position.x - 20,
            position.y,
            "bitmapFont",
            "Move closer!",
            6
          );

          setTimeout(() => {
            text.destroy();
          }, 1000);

          return;
        }

        const id = polygon.data.list.id;
        interactableModalManager.open(id);
      });
    });

    this.physics.world.drawDebug = true;

    const TOP_LAYERS = [
      "Decorations Layer 1",
      "Decorations Layer 2",
      "Decorations Layer 3",
      "Building Layer 2",
      "Building Layer 3",
    ];

    this.map.layers.forEach((layerData, idx) => {
      const layer = this.map.createLayer(layerData.name, tileset, 0, 0);

      if (TOP_LAYERS.includes(layerData.name)) {
        console.log("Got it");
        layer?.setDepth(1);
      }
    });

    this.cursorKeys = this.input.keyboard?.createCursorKeys();

    const camera = this.cameras.main;

    // Render existing players
    // getKeys(this.roomService.state.context.players).forEach((sessionId) => {
    //   const player = this.roomService.state.context.players[sessionId];
    //   const entity = new BumpkinContainer(
    //     this,
    //     player.x,
    //     player.y,
    //     INITIAL_BUMPKIN
    //   );
    //   this.playerEntities[sessionId] = entity;
    // });

    this.roomService.onEvent((event: RoomEvent) => {
      if (event.type === "CHAT_MESSAGE_RECEIVED") {
        if (event.sessionId && String(event.sessionId).length > 4) {
          this.playerEntities[event.sessionId].speak(event.text);
        }
      }

      if (event.type === "PLAYER_JOINED") {
        console.log("Player JOINED", event.sessionId);
        const entity = new BumpkinContainer(
          this,
          event.x,
          event.y,
          INITIAL_BUMPKIN
        );

        if (
          event.sessionId === this.roomService.state.context.room?.sessionId
        ) {
          this.currentPlayer = entity;

          this.currentPlayer.body.width = 10;
          this.currentPlayer.body.height = 8;
          this.currentPlayer.body.setOffset(3, 10);
          this.currentPlayer.body.setCollideWorldBounds(true);
          this.physics.add.collider(this.currentPlayer, customColliders);
          // this.physics.add.collider(this.currentPlayer, this.betty);
          camera.startFollow(this.currentPlayer, true, 0.08, 0.08);
        }
        this.playerEntities[event.sessionId] = entity;
      }

      if (event.type === "PLAYER_QUIT") {
        const entity = this.playerEntities[event.sessionId];
        if (entity) {
          entity.destroy();
          delete this.playerEntities[event.sessionId];
        }
      }
    });

    this.roomService.send("CONNECT");

    const keySPACE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.input.keyboard?.removeCapture("SPACE");

    camera.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);
    camera.setZoom(4);

    this.physics.world.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);

    this.initialiseNPCs();
  }

  private initialiseNPCs() {
    // Betty

    // this.physics.add.collider(this.currentPlayer, this.betty);

    // this.physics.collide(this.currentPlayer, this.betty);
    // this.physics.add.collider(this.currentPlayer, betty.body);

    return;

    // betty.body.setCollideWorldBounds(true);
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
    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
      this.elapsedTime -= this.fixedTimeStep;
      this.fixedTick(time, this.fixedTimeStep);
    }
  }

  fixedTick(time: number, delta: number) {
    // Still initialising

    this.currentTick++;

    const speed = 50;

    this.inputPayload.left = this.cursorKeys?.left.isDown ?? false;
    this.inputPayload.right = this.cursorKeys?.right.isDown ?? false;
    this.inputPayload.up = this.cursorKeys?.up.isDown ?? false;
    this.inputPayload.down = this.cursorKeys?.down.isDown ?? false;
    // this.inputPayload.tick = this.currentTick;

    // if (!this.currentPlayer?.body || !this.currentPlayer.sprite) {
    //   return;
    // }
    if (this.inputPayload.left) {
      this.currentPlayer.body.setVelocityX(-speed);
      this.currentPlayer.sprite.setScale(-1, 1);
      this.currentPlayer.body.width = 10;
      this.currentPlayer.body.height = 10;
      this.currentPlayer.body.setOffset(2, 10);
    } else if (this.inputPayload.right) {
      this.currentPlayer.body.setVelocityX(speed);
      this.currentPlayer.sprite.setScale(1, 1);
      this.currentPlayer.body.setOffset(3, 10);
    } else {
      this.currentPlayer.body.setVelocityX(0);
    }

    const isMovingHorizontally =
      this.inputPayload.left || this.inputPayload.right;

    const baseSpeed = isMovingHorizontally ? 0.7 : 1;
    if (this.inputPayload.up) {
      // this.currentPlayer.y -= velocity;
      this.currentPlayer.body.setVelocityY(-speed * baseSpeed);
    } else if (this.inputPayload.down) {
      // this.currentPlayer.y += velocity;
      this.currentPlayer.body.setVelocityY(speed * baseSpeed);
    } else {
      this.currentPlayer.body.setVelocityY(0);
    }

    // TODO - check if we need to send position?
    if (
      this.inputPayload.left ||
      this.inputPayload.right ||
      this.inputPayload.up ||
      this.inputPayload.down
    ) {
      this.roomService.send("SEND_POSITION", {
        x: this.currentPlayer.x,
        y: this.currentPlayer.y,
      });
    }

    for (const sessionId in this.playerEntities) {
      if (sessionId === this.roomService.state.context.room?.sessionId) {
        continue;
      }

      const entity = this.playerEntities[sessionId];

      const position = this.roomService.state.context.players[sessionId];

      if (position.x > entity.x) {
        entity.setScale(1, 1);
      } else if (position.x < entity.x) {
        entity.setScale(-1, 1);
      }

      entity.x = Phaser.Math.Linear(entity.x, position.x, 0.2);
      entity.y = Phaser.Math.Linear(entity.y, position.y, 0.2);
    }
  }
}
