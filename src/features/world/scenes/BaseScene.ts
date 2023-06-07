import Phaser, { Physics } from "phaser";
import { Room } from "colyseus.js";

import mapJson from "assets/map/plaza.json";
import auctionJson from "assets/map/auction.json";
import clothesShopJson from "assets/map/clothe_shop.json";
import decorationShopJSON from "assets/map/decorations.json";
import windmillFloorJSON from "assets/map/windmill_floor.json";
import igorHomeJSON from "assets/map/blacksmith_home.json";
import bertHomeJSON from "assets/map/bert_home.json";
import timmyHomeJSON from "assets/map/timmy_home.json";
import bettyHomeJSON from "assets/map/betty_home.json";
import woodlandsJSON from "assets/map/woodlands.json";

import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { interactableModalManager } from "../ui/InteractableModals";
import {
  ChatContext,
  ChatMessageReceived,
  MachineInterpreter,
  PlayerJoined,
  PlayerQuit,
  RoomEvent,
  RoomId,
} from "../roomMachine";
import { CONFIG } from "lib/config";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { npcModalManager } from "../ui/NPCModals";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { SUNNYSIDE } from "assets/sunnyside";
import { EventObject, State } from "xstate";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { isTouchDevice } from "../lib/device";

export type NPCBumpkin = {
  x: number;
  y: number;
  npc: NPCName;
};

export abstract class BaseScene extends Phaser.Scene {
  abstract roomId: RoomId;
  abstract spawn: Coordinates;
  eventListener: (event: EventObject) => void;
  transitionListener: (
    state: State<ChatContext, RoomEvent, any, any, any>,
    event: RoomEvent
  ) => void;

  private joystick?: VirtualJoystick;

  constructor(key: string) {
    super(key);

    this.eventListener = (event) => {
      if (event.type === "CHAT_MESSAGE_RECEIVED") {
        const { sessionId, text } = event as ChatMessageReceived;
        if (
          sessionId &&
          String(sessionId).length > 4 &&
          this.playerEntities[sessionId]
        ) {
          this.playerEntities[sessionId].speak(text);
        }
      }

      if (event.type === "PLAYER_JOINED") {
        const { sessionId, x, y, clothing, roomId } = event as PlayerJoined;

        if (roomId !== this.roomId) return;

        const room = this.roomService.state.context.rooms[roomId];

        if (!room) return;

        const player = this.createPlayer({
          x,
          y,
          clothing,
          isCurrentPlayer: sessionId === room.sessionId,
        });
        this.playerEntities[sessionId] = player;
      }

      if (event.type === "PLAYER_QUIT") {
        const { sessionId, roomId } = event as PlayerQuit;

        if (roomId !== this.roomId) return;

        this.destroyPlayer(sessionId);
      }
    };

    this.transitionListener = (state) => {
      if (state.value === "error" && !this.readonly) {
        console.log("We have an error");
        // Render the player for readonly
        this.createPlayer({
          x: this.spawn.x ?? 0,
          y: this.spawn.y ?? 0,
          isCurrentPlayer: true,
          clothing: INITIAL_BUMPKIN.equipped,
        });

        this.readonly = true;
      }
    };
  }

  public map: Phaser.Tilemaps.Tilemap = {} as Phaser.Tilemaps.Tilemap;
  room: Room | undefined;

  readonly = false;

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

  preload() {
    this.load.tilemapTiledJSON("main-map", mapJson);
    this.load.tilemapTiledJSON("auction-map", auctionJson);
    this.load.tilemapTiledJSON("clothes-shop", clothesShopJson);
    this.load.tilemapTiledJSON("decorations-shop", decorationShopJSON);
    this.load.tilemapTiledJSON("windmill-floor", windmillFloorJSON);
    this.load.tilemapTiledJSON("igor-home", igorHomeJSON);
    this.load.tilemapTiledJSON("bert-home", bertHomeJSON);
    this.load.tilemapTiledJSON("timmy-home", timmyHomeJSON);
    this.load.tilemapTiledJSON("betty-home", bettyHomeJSON);
    this.load.tilemapTiledJSON("woodlands", woodlandsJSON);

    // Phaser assets must be served from an URL
    this.load.image("tileset", `${CONFIG.PROTECTED_IMAGE_URL}/world/map.png`);
    this.load.image("speech_bubble", "world/speech_bubble.png");
    this.load.image("label", "world/label.png");
    this.load.image("brown_label", "world/brown_label.png");
    this.load.image("hammer", SUNNYSIDE.icons.hammer);
    this.load.image("disc", SUNNYSIDE.icons.disc);
    this.load.image("shadow", "world/shadow.png");
    this.load.spritesheet("silhouette", "world/silhouette.webp", {
      frameWidth: 14,
      frameHeight: 18,
    });
    this.load.bitmapFont(
      "Small 5x3",
      "world/small_3x5.png",
      "world/small_3x5.xml"
    );
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
      console.log({ x, y, centerX, centerY, width, height, zoom });
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
    this.roomService.off(this.transitionListener);
    this.roomService.onEvent(this.eventListener);
    this.roomService.onTransition(this.transitionListener);

    // Connect to Room
    this.roomService.send("CHANGE_ROOM", {
      roomId: this.roomId,
    });
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
                this.scene.start(warpTo);
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
        entity.setScale(1, 1);
      } else if (player.x < entity.x) {
        entity.setScale(-1, 1);
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
