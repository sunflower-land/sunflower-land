import Phaser, { Physics } from "phaser";
import { Room } from "colyseus.js";

import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

import { SQUARE_WIDTH } from "features/game/lib/constants";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { interactableModalManager } from "../ui/InteractableModals";
import {
  ChatMessageReceived,
  ClothingChangedEvent,
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
import { Coordinates } from "features/game/expansion/components/MapPlacement";

type SceneTransitionData = {
  previousSceneId: RoomId;
};

export type NPCBumpkin = {
  x: number;
  y: number;
  npc: NPCName;
};

type RoomListener = (event: EventObject) => void;

// 3 Times per second send position to server
const SEND_PACKET_RATE = 10;

type BaseSceneOptions = {
  name: RoomId;
  mmo: {
    enabled: boolean;
  };
  map: {
    // tilesetUrl (Coming Soon)
    json: any;
  };
  controls: {
    enabled: boolean;
  };
};
export abstract class BaseScene extends Phaser.Scene {
  abstract roomId: RoomId;
  eventListener?: RoomListener;

  private joystick?: VirtualJoystick;

  private spawns = SPAWNS;

  private options: BaseSceneOptions;

  private sceneTransitionData?: SceneTransitionData;

  constructor(options: BaseSceneOptions) {
    super(options.name);
    this.options = options;
  }

  public map: Phaser.Tilemaps.Tilemap = {} as Phaser.Tilemaps.Tilemap;
  room: Room | undefined;

  currentPlayer: BumpkinContainer | undefined;
  serverPosition: { x: number; y: number } = { x: 0, y: 0 };
  packetSentAt = 0;

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
    this.sceneTransitionData = data;
  }

  preload() {
    this.map = this.make.tilemap({
      key: this.options.name,
    });
  }

  public loadMap() {
    this.map = this.make.tilemap({ key: this.options.name });

    const tileset = this.map.addTilesetImage(
      "Sunnyside V3",
      "tileset",
      16,
      16,
      // Extruded tileset
      1,
      2
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
        layer?.setDepth(1000000);
      }
    });
  }

  public initialiseControls() {
    if (isTouchDevice()) {
      // Initialise joystick
      const { x, y, centerX, centerY, width, height } = this.cameras.main;
      const zoom = 4;
      this.joystick = new VirtualJoystick(this, {
        x: centerX + 25 - width / zoom / 2,
        y: centerY - 25 + height / zoom / 2,
        radius: 40,
        base: this.add.circle(0, 0, 20, 0x000000, 0.2).setDepth(1000000000),
        thumb: this.add.circle(0, 0, 10, 0xffffff, 0.2).setDepth(1000000000),
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
  }

  public initialiseMMO() {
    this.eventListener = (event) => {
      if (event.type === "CHAT_MESSAGE_RECEIVED") {
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

      if (event.type === "CLOTHING_CHANGED") {
        const { sessionId, clothing, roomId } = event as ClothingChangedEvent;
        if (roomId !== this.roomId) return;

        const room = this.roomService.state.context.rooms[roomId];

        if (
          sessionId &&
          String(sessionId).length > 4 &&
          this.playerEntities[sessionId]
        ) {
          this.playerEntities[sessionId].changeClothing(clothing);
        } else if (sessionId === room?.sessionId) {
          this.currentPlayer?.changeClothing(clothing);
        }
      }

      if (event.type === "PLAYER_JOINED") {
        const { sessionId, x, y, clothing, roomId } = event as PlayerJoined;
        if (roomId !== this.roomId) return;

        const room = this.roomService.state.context.rooms[roomId];

        if (!room) return;

        if (sessionId !== room.sessionId) {
          const otherPlayer = new BumpkinContainer(this, x, y, clothing);
          this.playerEntities[sessionId] = otherPlayer;
        }
      }

      if (event.type === "PLAYER_QUIT") {
        const { sessionId, roomId } = event as PlayerQuit;

        if (roomId !== this.roomId) return;

        this.destroyPlayer(sessionId);
      }
    };

    this.roomService.off(this.eventListener as RoomListener);
    this.roomService.onEvent(this.eventListener as RoomListener);

    // Connect to Room
    this.roomService.send("CHANGE_ROOM", {
      roomId: this.roomId,
    });
  }

  public initialiseCamera() {
    const camera = this.cameras.main;
    camera.fadeIn();

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

  async create() {
    this.loadMap();

    if (this.options.mmo.enabled) {
      this.initialiseMMO();
    }

    if (this.options.controls.enabled) {
      this.initialiseControls();
    }

    this.initialiseCamera();

    // TODO move somewhere?
    const from = this.sceneTransitionData?.previousSceneId as RoomId;
    const spawn =
      this.spawns[this.roomId][from] ?? this.spawns[this.roomId].default;
    this.createPlayer({
      x: spawn.x ?? 0,
      y: spawn.y ?? 0,
      clothing: this.roomService.state.context.bumpkin.equipped,
    });
  }

  createPlayer({
    x,
    y,
    clothing,
  }: {
    x: number;
    y: number;
    clothing: BumpkinParts;
  }): BumpkinContainer {
    const entity = new BumpkinContainer(this, x, y, clothing);

    this.currentPlayer = entity;

    // (this.currentPlayer.body as Phaser.Physics.Arcade.Body).width = 10;
    (this.currentPlayer.body as Phaser.Physics.Arcade.Body)
      .setOffset(3, 10)
      .setSize(10, 8)
      .setCollideWorldBounds(true);

    (this.currentPlayer.body as Phaser.Physics.Arcade.Body).setAllowRotation(
      false
    );

    // Follow player with camera
    this.cameras.main.startFollow(this.currentPlayer);

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

        const interactable = (obj2 as any).data?.list?.open;
        if (interactable) {
          console.log({ interactable });
          interactableModalManager.open(interactable);
        }
      }
    );

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

  updatePlayer() {
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

    if (
      // Hasn't sent to server recently
      Date.now() - this.packetSentAt > 1000 / SEND_PACKET_RATE &&
      // Position has changed
      (this.serverPosition.x !== this.currentPlayer.x ||
        this.serverPosition.y !== this.currentPlayer.y)
    ) {
      this.serverPosition = {
        x: this.currentPlayer.x,
        y: this.currentPlayer.y,
      };

      this.packetSentAt = Date.now();

      this.roomService.send("SEND_POSITION", this.serverPosition);
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

    this.currentPlayer.setDepth(Math.floor(this.currentPlayer.y));
  }

  updateOtherPlayers() {
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
      if (!entity?.active) return;

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

      entity.setDepth(entity.y);
    });
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

      container.setDepth(bumpkin.y);
      (container.body as Phaser.Physics.Arcade.Body)
        .setSize(16, 20)
        .setOffset(0, 0)
        .setImmovable(true)
        .setCollideWorldBounds(true);

      this.physics.world.enable(container);
      this.customColliders?.add(container);
    });
  }

  fixedTick(time: number, delta: number) {
    this.currentTick++;

    this.updatePlayer();
    this.updateOtherPlayers();
  }

  public setSpawn(coordinates: Coordinates) {
    this.spawns[this.roomId] = {
      default: coordinates,
    };
  }
}

window.BaseScene = BaseScene;
