import Phaser, { Physics } from "phaser";
import { Room } from "colyseus.js";

import mapJson from "assets/map/plaza.json";
import auctionJson from "assets/map/auction.json";

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
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { npcModalManager } from "../ui/NPCModals";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export type NPCBumpkin = {
  x: number;
  y: number;
  npc: NPCName;
};

export class BaseScene extends Phaser.Scene {
  public map: Phaser.Tilemaps.Tilemap = {} as Phaser.Tilemaps.Tilemap;
  room: Room | undefined;

  readonly = false;

  currentPlayer: BumpkinContainer | undefined;
  betty: BumpkinContainer | undefined;
  playerEntities: {
    [sessionId: string]: BumpkinContainer;
  } = {};

  customColliders?: Phaser.GameObjects.Group;

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
    console.log("preload");
    this.load.tilemapTiledJSON("main-map", mapJson);
    this.load.tilemapTiledJSON("auction-map", auctionJson);

    // Phaser assets must be served from an URL
    this.load.image("tileset", `${CONFIG.PROTECTED_IMAGE_URL}/world/map.png`);
    this.load.image("speech_bubble", "world/speech_bubble.png");
    this.load.image("shadow", "world/shadow.png");
    this.load.spritesheet("silhouette", "world/silhouette.webp", {
      frameWidth: 14,
      frameHeight: 18,
    });
  }

  async create() {
    console.log("create");

    const camera = this.cameras.main;
    camera.fadeIn();
    const tileset = this.map.addTilesetImage(
      "Sunnyside V3",
      "tileset",
      16,
      16
    ) as Phaser.Tilemaps.Tileset;

    // Set up collider layers
    this.customColliders = this.add.group();
    const collisionPolygons = this.map.createFromObjects("Collision", {
      scene: this,
    });
    collisionPolygons.forEach((polygon) => {
      this.customColliders?.add(polygon);
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
          // const text = this.add.bitmapText(
          //   position.x - 20,
          //   position.y,
          //   "bitmapFont",
          //   "Move closer!",
          //   6
          // );

          // setTimeout(() => {
          //   text.destroy();
          // }, 1000);

          return;
        }

        const id = polygon.data.list.id;
        interactableModalManager.open(id);
      });
    });

    // Debugging purposes - display colliders in pink
    this.physics.world.drawDebug = false;

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

    console.log("initialiser room...");
    // Respond to Websocket events
    this.roomService.onEvent((event) => {
      if (event.type === "CHAT_MESSAGE_RECEIVED") {
        const { sessionId, text } = event as ChatMessageReceived;
        if (sessionId && String(sessionId).length > 4) {
          this.playerEntities[sessionId].speak(text);
        }
      }

      if (event.type === "PLAYER_JOINED") {
        const { sessionId, x, y, clothing } = event as PlayerJoined;
        const player = this.createPlayer({
          x,
          y,
          clothing,
          isCurrentPlayer:
            sessionId === this.roomService.state.context.room?.sessionId,
        });
        this.playerEntities[sessionId] = player;
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

    this.roomService.onTransition((state) => {
      if (state.value === "error" && !this.readonly) {
        console.log("We have an error");
        // Render the player for readonly
        this.createPlayer({
          x: 300,
          y: 300,
          isCurrentPlayer: true,
          clothing: INITIAL_BUMPKIN.equipped,
        });

        this.readonly = true;
      }
    });
    // If we cannot connect to server = render the player the anyway

    // this.createPlayer({
    //   x: 300,
    //   y: 300,
    //   isCurrentPlayer: true,
    // });

    // Connect to Room
    this.roomService.send("CONNECT");
  }

  createPlayer({
    x,
    y,
    isCurrentPlayer,
    clothing,
  }: {
    isCurrentPlayer: boolean;
    x: number;
    y: number;
    clothing: BumpkinParts;
  }): BumpkinContainer {
    const entity = new BumpkinContainer(this, x, y, clothing);

    // Is current player
    if (isCurrentPlayer) {
      this.currentPlayer = entity;

      // (this.currentPlayer.body as Phaser.Physics.Arcade.Body).width = 10;
      (this.currentPlayer.body as Phaser.Physics.Arcade.Body)
        .setOffset(3, 10)
        .setSize(10, 8)
        .setCollideWorldBounds(true);

      // Follow player with camera
      this.cameras.main.startFollow(this.currentPlayer, true, 0.08, 0.08);

      // Callback to fire on collisions
      this.physics.add.collider(
        this.currentPlayer,
        this.customColliders as Phaser.GameObjects.Group,
        // Read custom Tiled Properties
        async (obj1, obj2) => {
          // Change scenes
          const warpTo = (obj2 as any).data?.list?.warp;
          if (warpTo) {
            this.cameras.main.fadeOut(1000);

            this.cameras.main.on(
              "camerafadeoutcomplete",
              () => {
                console.log("Fade complete");
                this.roomService.send("CHANGE_ROOM", {
                  roomId: warpTo,
                });

                this.game.scene.switch(this.scene.key, warpTo);
              },
              this
            );
          }
        }
      );
    }

    return entity;
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

    this.roomService.send("SEND_POSITION", {
      x: this.currentPlayer.x,
      y: this.currentPlayer.y,
    });

    if (
      this.inputPayload.left ||
      this.inputPayload.right ||
      this.inputPayload.up ||
      this.inputPayload.down
    ) {
      this.currentPlayer.walk();
    } else {
      this.currentPlayer.idle();
    }
  }

  initialiseNPCs(npcs: NPCBumpkin[]) {
    npcs.forEach((bumpkin, index) => {
      const container = new BumpkinContainer(
        this,
        bumpkin.x,
        bumpkin.y,
        NPC_WEARABLES[bumpkin.npc],
        () => {
          const distance = Phaser.Math.Distance.BetweenPoints(
            container,
            this.currentPlayer as BumpkinContainer
          );

          if (distance > 50) {
            container.speak("You are too far away");
            return;
          }
          npcModalManager.open(bumpkin.npc);
        }
      );
      (container.body as Phaser.Physics.Arcade.Body)
        .setSize(16, 20)
        .setOffset(0, 0)
        .setImmovable(true)
        .setCollideWorldBounds(true);

      this.physics.world.enable(container);
      this.customColliders?.add(container);
    });
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

      const distance = Phaser.Math.Distance.BetweenPoints(position, entity);

      if (distance < 2) {
        entity.idle();
      } else {
        entity.walk();
      }

      entity.x = Phaser.Math.Linear(entity.x, position.x, 0.05);
      entity.y = Phaser.Math.Linear(entity.y, position.y, 0.05);
    }
  }

  fixedTick(time: number, delta: number) {
    this.currentTick++;

    this.moveCurrentPlayer();
    this.moveOtherPlayers();
  }
}
