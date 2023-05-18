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

  constructor() {
    super("game");
  }

  // We manually inject room service onto the initialised Phaser Game
  private get roomService() {
    return (this.game as any).roomService as MachineInterpreter;
  }
  preload() {
    this.load.tilemapTiledJSON("main-map", mapJson);
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
    const map = this.make.tilemap({
      key: "main-map",
    });
    const tileset = map.addTilesetImage(
      "Sunnyside V3",
      "tileset",
      16,
      16
    ) as Phaser.Tilemaps.Tileset;

    // Set up colliders
    const customColliders = this.add.group();
    const collisionPolygons = map.createFromObjects("Collision", {
      scene: this,
    });
    collisionPolygons.forEach((polygon) => {
      customColliders.add(polygon);
      this.physics.world.enable(polygon);
      (polygon.body as Physics.Arcade.Body).setImmovable(true);
    });

    const interactablesPolygons = map.createFromObjects("Interactable", {});

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

    map.layers.forEach((layerData, idx) => {
      const layer = map.createLayer(layerData.name, tileset, 0, 0);

      if (TOP_LAYERS.includes(layerData.name)) {
        console.log("Got it");
        layer?.setDepth(1);
      }
    });

    this.cursorKeys = this.input.keyboard?.createCursorKeys();

    const camera = this.cameras.main;

    this.currentPlayer = new BumpkinContainer(
      this,
      300,
      300,
      INITIAL_BUMPKIN
    ) as BumpkinContainer;

    this.currentPlayer.body.width = 10;
    this.currentPlayer.body.height = 8;
    this.currentPlayer.body.setOffset(3, 10);
    this.currentPlayer.body.setCollideWorldBounds(true);
    this.physics.add.collider(this.currentPlayer, customColliders);
    this.physics.add.collider(this.currentPlayer, this.betty);
    camera.startFollow(this.currentPlayer, true, 0.08, 0.08);

    this.roomService.onEvent((event: RoomEvent) => {
      console.log({ inner: event });
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

    // this.room?.state.players.onAdd((player: any, sessionId: string) => {
    //   console.log({ player, sessionId });

    //   if (sessionId === this.room?.sessionId) {
    //     return;
    //   }
    //   const entity = new BumpkinContainer(
    //     this,
    //     player.x,
    //     player.y,
    //     INITIAL_BUMPKIN
    //   );
    //   this.playerEntities[sessionId] = entity;
    //   // listening for server updates
    //   player.onChange(() => {
    //     console.log({ player });
    //     //
    //     // we're going to LERP the positions during the render loop.
    //     //
    //     entity.setData("serverX", player.x);
    //     entity.setData("serverY", player.y);
    //   });
    // });

    // remove local reference when entity is removed from the server
    // this.room?.state.players.onRemove((_player: any, sessionId: string) => {
    //   const entity = this.playerEntities[sessionId];
    //   if (entity) {
    //     entity.destroy();
    //     delete this.playerEntities[sessionId];
    //   }
    // });

    const { width, height } = this.scale;

    console.log({ width, height });

    console.log("play");

    const { game } = this.sys;
    console.log(JSON.stringify(game.scale.gameSize));

    camera.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);
    camera.setZoom(4);

    this.physics.world.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);

    this.initialiseNPCs();
  }

  private initialiseNPCs() {
    // Betty

    console.log({ player: this.currentPlayer });
    // this.physics.add.collider(this.currentPlayer, this.betty);

    // this.physics.collide(this.currentPlayer, this.betty);
    // this.physics.add.collider(this.currentPlayer, betty.body);

    return;

    // betty.body.setCollideWorldBounds(true);
    console.log({ player: this.currentPlayer });
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
    this.roomService.send("SEND_POSITION", {
      x: this.currentPlayer.x,
      y: this.currentPlayer.y,
    });
    // this.room.send(0, {
    //   x: this.currentPlayer.x,
    //   y: this.currentPlayer.y,
    // });

    for (const sessionId in this.playerEntities) {
      // interpolate all player entities
      // (except the current player)
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
