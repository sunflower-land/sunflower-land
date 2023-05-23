import Phaser, { Physics } from "phaser";
import { Room } from "colyseus.js";

import mapJson from "assets/map/plaza.json";
import auctionJson from "assets/map/auction.json";

import speechBubble from "../assets/speech_bubble.png";
import shadow from "assets/npcs/shadow.png";
import silhouette from "assets/npcs/silhouette.webp";
import fontPng from "../assets/bitmapTest.png";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { interactableModalManager } from "../ui/InteractableModals";
import {
  ChatMessageReceived,
  MachineInterpreter,
  PlayerJoined,
  PlayerQuit,
} from "../roomMachine";
import { CONFIG } from "lib/config";

export class BaseScene extends Phaser.Scene {
  public map: Phaser.Tilemaps.Tilemap = {} as Phaser.Tilemaps.Tilemap;
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

  // Advanced server timing - not used
  elapsedTime = 0;
  fixedTimeStep = 1000 / 60;

  currentTick = 0;

  // We manually inject room service onto the initialised Phaser Game
  public get roomService() {
    return (this.game as any).roomService as MachineInterpreter;
  }
  preload() {
    this.load.tilemapTiledJSON("main-map", mapJson);
    this.load.tilemapTiledJSON("auction-map", auctionJson);
    this.load.image("tileset", `${CONFIG.PROTECTED_IMAGE_URL}/world/map.png`);
    this.load.image("speech_bubble", speechBubble);
    this.load.image("shadow", shadow);
    this.load.spritesheet("silhouette", silhouette, {
      frameWidth: 14,
      frameHeight: 18,
    });
    this.load.bitmapFont(
      "bitmapFont",
      fontPng,
      "./src/features/phaser/assets/bitmapTest.fnt"
    );
  }

  async create() {
    const tileset = this.map.addTilesetImage(
      "Sunnyside V3",
      "tileset",
      16,
      16
    ) as Phaser.Tilemaps.Tileset;

    // Set up collider layers
    const customColliders = this.add.group();
    const collisionPolygons = this.map.createFromObjects("Collision", {
      scene: this,
    });
    collisionPolygons.forEach((polygon) => {
      customColliders.add(polygon);
      this.physics.world.enable(polygon);
      (polygon.body as Physics.Arcade.Body).setImmovable(true);
    });

    // Setup interactable layers
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

    // Debugging purposes - display colliders in pink
    this.physics.world.drawDebug = true;

    // Set up the Z layers to draw in correct order
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
        layer?.setDepth(1);
      }
    });

    // Initialise Keyboard
    this.cursorKeys = this.input.keyboard?.createCursorKeys();
    this.input.keyboard?.removeCapture("SPACE");

    const camera = this.cameras.main;

    // Respond to Websocket events
    this.roomService.onEvent((event) => {
      if (event.type === "CHAT_MESSAGE_RECEIVED") {
        const { sessionId, text } = event as ChatMessageReceived;
        if (sessionId && String(sessionId).length > 4) {
          this.playerEntities[sessionId].speak(text);
        }
      }

      if (event.type === "PLAYER_JOINED") {
        const { sessionId, x, y } = event as PlayerJoined;
        const entity = new BumpkinContainer(this, x, y, INITIAL_BUMPKIN);

        // Is current player
        if (sessionId === this.roomService.state.context.room?.sessionId) {
          this.currentPlayer = entity;

          // (this.currentPlayer.body as Phaser.Physics.Arcade.Body).width = 10;
          (this.currentPlayer.body as Phaser.Physics.Arcade.Body)
            .setOffset(3, 10)
            .setSize(10, 8)
            .setCollideWorldBounds(true);

          // Follow player with camera
          camera.startFollow(this.currentPlayer, true, 0.08, 0.08);

          // Callback to fire on collisions
          this.physics.add.collider(
            this.currentPlayer,
            customColliders,
            // Read custom Tiled Properties
            (obj1, obj2) => {
              // Change scenes
              const warpTo = (obj2 as any).data?.list?.warp;
              if (warpTo) {
                this.roomService.send("CHANGE_ROOM", {
                  roomId: warpTo,
                });

                this.game.scene.switch(this.scene.key, warpTo);
              }
            }
          );
        }
        this.playerEntities[sessionId] = entity;
      }

      if (event.type === "PLAYER_QUIT") {
        const { sessionId } = event as PlayerQuit;
        const entity = this.playerEntities[sessionId];
        if (entity) {
          entity.destroy();
          delete this.playerEntities[sessionId];
        }
      }
    });

    // Connect to Room
    this.roomService.send("CONNECT");
  }

  update(time: number, delta: number): void {
    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
      this.elapsedTime -= this.fixedTimeStep;
      this.fixedTick(time, this.fixedTimeStep);
    }
  }

  moveCurrentPlayer() {
    if (!this.currentPlayer?.body) {
      return;
    }

    const speed = 50;

    this.inputPayload.left = this.cursorKeys?.left.isDown ?? false;
    this.inputPayload.right = this.cursorKeys?.right.isDown ?? false;
    this.inputPayload.up = this.cursorKeys?.up.isDown ?? false;
    this.inputPayload.down = this.cursorKeys?.down.isDown ?? false;

    // Horizontal movements
    if (this.inputPayload.left) {
      // Flip sprite
      this.currentPlayer.sprite?.setScale(-1, 1);

      // Move character
      (this.currentPlayer.body as Phaser.Physics.Arcade.Body)
        .setVelocityX(-speed)
        .setSize(10, 10)
        .setOffset(2, 10);
    } else if (this.inputPayload.right) {
      this.currentPlayer.sprite?.setScale(1, 1);
      (this.currentPlayer.body as Phaser.Physics.Arcade.Body)
        .setVelocityX(speed)
        .setOffset(3, 10);
    } else {
      (this.currentPlayer.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
    }

    const isMovingHorizontally =
      this.inputPayload.left || this.inputPayload.right;

    // Vertical movements - bonus calculation to ensure correct diagonal speed
    const baseSpeed = isMovingHorizontally ? 0.7 : 1;
    if (this.inputPayload.up) {
      (this.currentPlayer.body as Phaser.Physics.Arcade.Body).setVelocityY(
        -speed * baseSpeed
      );
    } else if (this.inputPayload.down) {
      (this.currentPlayer.body as Phaser.Physics.Arcade.Body).setVelocityY(
        speed * baseSpeed
      );
    } else {
      (this.currentPlayer.body as Phaser.Physics.Arcade.Body).setVelocityY(0);
    }

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
  }

  moveOtherPlayers() {
    for (const sessionId in this.playerEntities) {
      if (sessionId === this.roomService.state.context.room?.sessionId) {
        continue;
      }

      const entity = this.playerEntities[sessionId];

      const position = this.roomService.state.context.players[sessionId];

      if (!position) {
        return;
      }
      if (position.x > entity.x) {
        entity.setScale(1, 1);
      } else if (position.x < entity.x) {
        entity.setScale(-1, 1);
      }

      entity.x = Phaser.Math.Linear(entity.x, position.x, 0.2);
      entity.y = Phaser.Math.Linear(entity.y, position.y, 0.2);
    }
  }

  fixedTick(time: number, delta: number) {
    this.currentTick++;

    this.moveCurrentPlayer();
    this.moveOtherPlayers();
  }
}
