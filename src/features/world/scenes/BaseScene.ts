import Phaser, { Physics } from "phaser";
import { Room } from "colyseus.js";

import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

import { SQUARE_WIDTH } from "features/game/lib/constants";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { interactableModalManager } from "../ui/InteractableModals";
import {
  ChatMessageReceived,
  MachineInterpreter,
  PlayerJoined,
  PlayerQuit,
  RoomId,
} from "../roomMachine";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { npcModalManager } from "../ui/NPCModals";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { EventObject } from "xstate";
import { isTouchDevice } from "../lib/device";
import { SPAWNS } from "../lib/spawn";

type SceneTransitionData = {
  previousSceneId: RoomId;
};

export type NPCBumpkin = {
  x: number;
  y: number;
  npc: NPCName;
};

export abstract class BaseScene extends Phaser.Scene {
  abstract roomId: RoomId;
  eventListener: (event: EventObject) => void;

  private joystick?: VirtualJoystick;

  private sceneTransitionData?: SceneTransitionData;

  constructor(key: RoomId) {
    super(key);

    this.eventListener = (event) => {
      if (event.type === "CHAT_MESSAGE_RECEIVED") {
        console.log({ CHAT: event });
        const { sessionId, text, roomId } = event as ChatMessageReceived;
        if (roomId !== this.roomId) return;

        const room = this.roomService.state.context.rooms[roomId];

        if (
          sessionId &&
          String(sessionId).length > 4 &&
          this.playerEntities[sessionId]
        ) {
          this.playerEntities[sessionId].speak(text);
        } else if (sessionId === room?.sessionId) {
          this.currentPlayer?.speak(text);
        }
      }

      if (event.type === "PLAYER_JOINED") {
        const { sessionId, x, y, clothing, roomId } = event as PlayerJoined;
        if (roomId !== this.roomId) return;

        const room = this.roomService.state.context.rooms[roomId];

        if (!room) return;

        // Current player
        if (sessionId !== room.sessionId) {
          const player = this.createPlayer({
            x,
            y,
            clothing,
            isCurrentPlayer: sessionId === room.sessionId,
          });
          this.playerEntities[sessionId] = player;
        }
      }

      if (event.type === "PLAYER_QUIT") {
        const { sessionId, roomId } = event as PlayerQuit;

        if (roomId !== this.roomId) return;

        this.destroyPlayer(sessionId);
      }
    };
  }

  public map: Phaser.Tilemaps.Tilemap = {} as Phaser.Tilemaps.Tilemap;
  room: Room | undefined;

  currentPlayer: BumpkinContainer | undefined;
  betty: BumpkinContainer | undefined;
  playerEntities: {
    [sessionId: string]: BumpkinContainer;
  } = {};

  customColliders?: Phaser.GameObjects.Group;

  cursorKeys:
    | {
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
      }
    | undefined;

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

  public get roomService() {
    return this.registry.get("roomService") as MachineInterpreter;
  }

  init(data: SceneTransitionData) {
    console.log({ data });
    this.sceneTransitionData = data;
  }

  preload() {
    console.log("Preload");
  }
  async create() {
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
        const id = polygon.data.list.id;
        interactableModalManager.open(id);
      });
    });

    // Debugging purposes - display colliders in pink
    this.physics.world.drawDebug = false;

    // Set up the Z layers to draw in correct order
    const TOP_LAYERS = [
      "Decorations Layer 1",
      "Decorations Foreground",
      "Decorations Layer 2",
      "Decorations Layer 3",
      "Decorations Layer 4",
      "Building Layer 2",
      "Building Layer 3",
      "Building Layer 4",
    ];
    this.map.layers.forEach((layerData, idx) => {
      const layer = this.map.createLayer(layerData.name, tileset, 0, 0);
      if (TOP_LAYERS.includes(layerData.name)) {
        layer?.setDepth(1);
      }
    });

    if (isTouchDevice()) {
      // Initialise joystick
      const { x, y, centerX, centerY, width, height } = this.cameras.main;
      const zoom = 4;
      this.joystick = new VirtualJoystick(this, {
        x: centerX + 25 - width / zoom / 2,
        y: centerY - 25 + height / zoom / 2,
        radius: 40,
        base: this.add.circle(0, 0, 20, 0x000000, 0.2).setDepth(100),
        thumb: this.add.circle(0, 0, 10, 0xffffff, 0.2).setDepth(100),
        dir: "8dir",
        fixed: true,
        forceMin: 10,
      });

      this.cursorKeys = this.joystick?.createCursorKeys();
    } else {
      // Initialise Keyboard
      this.cursorKeys = this.input.keyboard?.createCursorKeys();
      this.input.keyboard?.removeCapture("SPACE");
    }

    this.roomService.off(this.eventListener);
    this.roomService.onEvent(this.eventListener);

    // Connect to Room
    this.roomService.send("CHANGE_ROOM", {
      roomId: this.roomId,
    });

    const from = this.sceneTransitionData?.previousSceneId as RoomId;
    const spawn = SPAWNS[this.roomId][from] ?? SPAWNS[this.roomId].default;
    this.createPlayer({
      x: spawn.x ?? 0,
      y: spawn.y ?? 0,
      isCurrentPlayer: true,
      clothing: this.roomService.state.context.bumpkin.equipped,
    });

    camera.setBounds(
      0,
      0,
      this.map.width * SQUARE_WIDTH,
      this.map.height * SQUARE_WIDTH
    );
    camera.setZoom(4);
    this.physics.world.setBounds(
      0,
      0,
      this.map.width * SQUARE_WIDTH,
      this.map.height * SQUARE_WIDTH
    );

    // Center it on canvas
    const offsetX = (window.innerWidth - this.map.width * 4 * SQUARE_WIDTH) / 2;
    const offsetY =
      (window.innerHeight - this.map.height * 4 * SQUARE_WIDTH) / 2;
    camera.setPosition(Math.max(offsetX, 0), Math.max(offsetY, 0));
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
            (
              this.currentPlayer?.body as Physics.Arcade.Body | undefined
            )?.destroy();

            this.cameras.main.on(
              "camerafadeoutcomplete",
              () => {
                const data: SceneTransitionData = {
                  previousSceneId: this.roomId,
                };
                this.scene.start(warpTo, data);
              },
              this
            );
          }
        }
      );
    }

    return entity;
  }

  destroyPlayer(sessionId: string) {
    const entity = this.playerEntities[sessionId];
    if (entity) {
      console.log({ destroy: sessionId });
      entity.destroy();
      delete this.playerEntities[sessionId];
    }
  }

  update(time: number, delta: number): void {
    // this.elapsedTime += delta;
    // while (this.elapsedTime >= this.fixedTimeStep) {
    //   this.elapsedTime -= this.fixedTimeStep;
    //   this.fixedTick(time, this.fixedTimeStep);
    // }

    this.fixedTick(time, this.fixedTimeStep);
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
      this.currentPlayer.faceLeft();
      // Move character
      (this.currentPlayer.body as Phaser.Physics.Arcade.Body)
        .setVelocityX(-speed)
        .setSize(10, 10)
        .setOffset(2, 10);
    } else if (this.inputPayload.right) {
      this.currentPlayer.faceRight();
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

    const room = this.roomService.state.context.rooms[this.roomId];
    const player = room?.state.players.get(room.sessionId);

    // Only send position if the server has different coordinates
    // to the client
    if (
      player?.x !== this.currentPlayer.x ||
      player?.y !== this.currentPlayer.y
    ) {
      this.roomService.send("SEND_POSITION", {
        x: this.currentPlayer.x,
        y: this.currentPlayer.y,
      });
    }

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
        },
        bumpkin.npc
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
    const room = this.roomService.state.context.rooms[this.roomId];
    if (!room) return;

    // Destroy any dereferenced players
    Object.keys(this.playerEntities).forEach((sessionId) => {
      if (!room.state.players.get(sessionId)) {
        this.destroyPlayer(sessionId);
      }
    });

    // Render current players
    room?.state.players.forEach((player, sessionId) => {
      if (sessionId === room.sessionId) return;

      const entity = this.playerEntities[sessionId];

      // Skip if the player hasn't been set up yet
      if (!entity.active) return;

      if (player.x > entity.x) {
        entity.faceRight();
      } else if (player.x < entity.x) {
        entity.faceLeft();
      }

      const distance = Phaser.Math.Distance.BetweenPoints(player, entity);

      if (distance < 2) {
        entity.idle();
      } else {
        entity.walk();
      }

      entity.x = Phaser.Math.Linear(entity.x, player.x, 0.05);
      entity.y = Phaser.Math.Linear(entity.y, player.y, 0.05);
    });
  }

  fixedTick(time: number, delta: number) {
    this.currentTick++;

    this.moveCurrentPlayer();
    this.moveOtherPlayers();
  }
}
