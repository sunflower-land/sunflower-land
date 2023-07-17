import Phaser, { Physics } from "phaser";
import { Room } from "colyseus.js";

import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

import { MachineInterpreter as GameMachineInterpreter } from "features/game/lib/gameMachine";
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
import { AudioController, WalkAudioController } from "../lib/AudioController";
import { createErrorLogger } from "lib/errorLogger";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { Footsteps } from "assets/sound-effects/soundEffects";

type SceneTransitionData = {
  previousSceneId: RoomId;
};

export type NPCBumpkin = {
  x: number;
  y: number;
  npc: NPCName;
  clothing?: BumpkinParts;
  onClick?: () => void;
};

// 3 Times per second send position to server
const SEND_PACKET_RATE = 10;
const NAME_TAG_OFFSET_PX = 12;

type BaseSceneOptions = {
  name: RoomId;
  map: {
    tilesetUrl?: string;
    json: any;
  };
  mmo?: {
    enabled: boolean;
    url?: string;
    roomId?: string;
  };
  controls?: {
    enabled: boolean; // Default to true
  };
  audio?: {
    fx: {
      walk_key: Footsteps;
    };
  };
  player?: {
    spawn: Coordinates;
  };
};

export abstract class BaseScene extends Phaser.Scene {
  abstract roomId: RoomId;
  eventListener?: (event: EventObject) => void;

  private joystick?: VirtualJoystick;
  private sceneTransitionData?: SceneTransitionData;
  private options: Required<BaseSceneOptions>;

  public map: Phaser.Tilemaps.Tilemap = {} as Phaser.Tilemaps.Tilemap;
  room: Room | undefined;

  currentPlayer: BumpkinContainer | undefined;
  serverPosition: { x: number; y: number } = { x: 0, y: 0 };
  packetSentAt = 0;

  playerEntities: {
    [sessionId: string]: BumpkinContainer;
  } = {};

  customColliders?: Phaser.GameObjects.Group;
  soundEffects: AudioController[] = [];
  walkAudioController?: WalkAudioController;

  joystickKeys:
    | {
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
      }
    | undefined;

  cursorKeys:
    | {
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
        w?: Phaser.Input.Keyboard.Key;
        s?: Phaser.Input.Keyboard.Key;
        a?: Phaser.Input.Keyboard.Key;
        d?: Phaser.Input.Keyboard.Key;
      }
    | undefined;

  inputPayload = {
    left: false,
    right: false,
    up: false,
    down: false,
    // tick: undefined,
  };

  // Advanced server timing - not used
  elapsedTime = 0;
  fixedTimeStep = 1000 / 60;

  currentTick = 0;

  constructor(options: BaseSceneOptions) {
    const defaultedOptions: Required<BaseSceneOptions> = {
      ...options,
      name: options.name ?? "community_island",
      audio: options.audio ?? { fx: { walk_key: "wood_footstep" } },
      controls: options.controls ?? { enabled: true },
      mmo: options.mmo ?? { enabled: true },
      player: options.player ?? { spawn: { x: 0, y: 0 } },
    };

    super(defaultedOptions.name);

    this.options = defaultedOptions;
  }

  preload() {
    if (this.options.map?.json) {
      this.load.tilemapTiledJSON(this.options.name, this.options.map.json);
    }

    if (this.options.map?.tilesetUrl)
      this.load.image("community-tileset", this.options.map.tilesetUrl);
  }

  init(data: SceneTransitionData) {
    this.sceneTransitionData = data;
  }

  async create() {
    const errorLogger = createErrorLogger(
      "phaser_base_scene",
      this.roomService.state.context.farmId
    );

    try {
      this.initialiseMap();
      this.initialiseSounds();

      if (this.options.mmo.enabled) {
        this.initialiseMMO();
      }

      if (this.options.controls.enabled) {
        this.initialiseControls();
      }

      const from = this.sceneTransitionData?.previousSceneId as RoomId;

      let spawn = this.options.player.spawn;

      if (SPAWNS[this.roomId]) {
        spawn = SPAWNS[this.roomId][from] ?? SPAWNS[this.roomId].default;
      }

      this.createPlayer({
        x: spawn.x ?? 0,
        y: spawn.y ?? 0,
        farmId: this.roomService.state.context.farmId,
        isCurrentPlayer: true,
        clothing: this.roomService.state.context.bumpkin.equipped,
      });

      this.initialiseCamera();

      // this.physics.world.fixedStep = false; // activates sync
      // this.physics.world.fixedStep = true; // deactivates sync (default)
    } catch (error) {
      console.log({ error });
      errorLogger(JSON.stringify(error));
    }
  }

  public initialiseMap() {
    this.map = this.make.tilemap({
      key: this.options.name,
    });

    const tileset = this.options.map?.tilesetUrl
      ? // Community tileset
        (this.map.addTilesetImage(
          "Sunnyside V3",
          "community-tileset",
          16,
          16
        ) as Phaser.Tilemaps.Tileset)
      : // Standard tileset
        (this.map.addTilesetImage(
          "Sunnyside V3",
          "tileset",
          16,
          16,
          1,
          2
        ) as Phaser.Tilemaps.Tileset);

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
    this.map.layers.forEach((layerData) => {
      const layer = this.map.createLayer(layerData.name, tileset, 0, 0);
      if (TOP_LAYERS.includes(layerData.name)) {
        layer?.setDepth(1000000);
      }
    });

    this.physics.world.setBounds(
      0,
      0,
      this.map.width * SQUARE_WIDTH,
      this.map.height * SQUARE_WIDTH
    );
  }

  public initialiseCamera() {
    const camera = this.cameras.main;

    camera.setBounds(
      0,
      0,
      this.map.width * SQUARE_WIDTH,
      this.map.height * SQUARE_WIDTH
    );
    camera.setZoom(4);

    // Center it on canvas
    const offsetX = (window.innerWidth - this.map.width * 4 * SQUARE_WIDTH) / 2;
    const offsetY =
      (window.innerHeight - this.map.height * 4 * SQUARE_WIDTH) / 2;
    camera.setPosition(Math.max(offsetX, 0), Math.max(offsetY, 0));

    camera.fadeIn();
  }

  public initialiseMMO() {
    this.eventListener = (event) => {
      if (event.type === "CHAT_MESSAGE_RECEIVED") {
        const { sessionId, text, roomId } = event as ChatMessageReceived;

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
        const { farmId, sessionId, x, y, clothing, roomId, npc } =
          event as PlayerJoined;

        if (roomId !== this.roomId) return;

        const room = this.roomService.state.context.rooms[roomId];

        if (!room) return;

        // Current player
        if (sessionId !== room.sessionId) {
          const player = this.createPlayer({
            x,
            y,
            farmId,
            clothing,
            isCurrentPlayer: false,
            npc,
          });

          this.playerEntities[sessionId] = player;
        }
      }

      if (event.type === "PLAYER_QUIT") {
        const { sessionId, roomId } = event as PlayerQuit;

        if (roomId !== this.roomService.state.context.roomId) return;

        this.destroyPlayer(sessionId);
      }
    };

    this.roomService.off(this.eventListener);
    this.roomService.onEvent(this.eventListener);

    // Connect to Room
    this.roomService.send("CHANGE_ROOM", {
      roomId: this.options.mmo.roomId ?? this.roomId,
      url: this.options.mmo.url,
    });
  }

  public initialiseSounds() {
    this.walkAudioController = new WalkAudioController(
      this.sound.add(this.options.audio.fx.walk_key)
    );
  }

  public initialiseControls() {
    if (isTouchDevice()) {
      // Initialise joystick
      const { x, y, centerX, centerY, width, height } = this.cameras.main;
      const zoom = 4;
      this.joystick = new VirtualJoystick(this, {
        x: centerX,
        y: centerY - 35 + height / zoom / 2,
        radius: 15,
        base: this.add.circle(0, 0, 15, 0x000000, 0.2).setDepth(1000000000),
        thumb: this.add.circle(0, 0, 7, 0xffffff, 0.2).setDepth(1000000000),
        dir: "8dir",
        // fixed: true,
        forceMin: 3,
      });
      this.joystickKeys = this.joystick.createCursorKeys();
    }
    // Initialise Keyboard
    this.cursorKeys = this.input.keyboard?.createCursorKeys();
    if (this.cursorKeys) {
      // this.cursorKeys.w = this.input.keyboard?.addKey(
      //   Phaser.Input.Keyboard.KeyCodes.W
      // );
      // this.cursorKeys.a = this.input.keyboard?.addKey(
      //   Phaser.Input.Keyboard.KeyCodes.A
      // );
      // this.cursorKeys.s = this.input.keyboard?.addKey(
      //   Phaser.Input.Keyboard.KeyCodes.S
      // );
      // this.cursorKeys.d = this.input.keyboard?.addKey(
      //   Phaser.Input.Keyboard.KeyCodes.D
      // );

      this.input.keyboard?.removeCapture("SPACE");
    }

    this.input.setTopOnly(true);
  }

  public get roomService() {
    return this.registry.get("roomService") as MachineInterpreter;
  }

  public get gameService() {
    return this.registry.get("gameService") as GameMachineInterpreter;
  }

  createPlayer({
    x,
    y,
    farmId,
    isCurrentPlayer,
    clothing,
    npc,
  }: {
    isCurrentPlayer: boolean;
    x: number;
    y: number;
    farmId: number;
    clothing: BumpkinParts;
    npc?: NPCName;
  }): BumpkinContainer {
    const defaultClick = () => {
      const distance = Phaser.Math.Distance.BetweenPoints(
        entity,
        this.currentPlayer as BumpkinContainer
      );

      if (distance > 50) {
        entity.speak("You are too far away");
        return;
      }

      if (npc) {
        npcModalManager.open(npc);
      }

      // TODO - open player modals
    };

    const entity = new BumpkinContainer({
      scene: this,
      x,
      y,
      clothing,
      name: npc,
      onClick: defaultClick,
    });
    if (!npc) {
      const nameTag = this.createPlayerText({
        x: 0,
        y: 0,
        text: `#${farmId}`,
      });
      entity.add(nameTag);
    }

    // Is current player
    if (isCurrentPlayer) {
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
                  previousSceneId: this.roomService.state.context.roomId,
                };
                this.scene.start(warpTo, data);
              },
              this
            );
          }

          const interactable = (obj2 as any).data?.list?.open;
          if (interactable) {
            interactableModalManager.open(interactable);
          }
        }
      );
    }

    return entity;
  }

  createPlayerText({ x, y, text }: { x: number; y: number; text: string }) {
    const textObject = this.add.text(x, y + NAME_TAG_OFFSET_PX, text, {
      fontSize: "4px",
      fontFamily: "monospace",
      resolution: 4,
    });
    textObject.setOrigin(0.5);

    this.physics.add.existing(textObject);
    (textObject.body as Phaser.Physics.Arcade.Body).checkCollision.none = true;

    return textObject;
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

    this.inputPayload.left =
      (this.cursorKeys?.left.isDown ||
        this.cursorKeys?.a?.isDown ||
        this.joystickKeys?.left.isDown) ??
      false;
    this.inputPayload.right =
      (this.cursorKeys?.right.isDown ||
        this.cursorKeys?.d?.isDown ||
        this.joystickKeys?.right.isDown) ??
      false;
    this.inputPayload.up =
      (this.cursorKeys?.up.isDown ||
        this.cursorKeys?.w?.isDown ||
        this.joystickKeys?.up.isDown) ??
      false;
    this.inputPayload.down =
      (this.cursorKeys?.down.isDown ||
        this.cursorKeys?.s?.isDown ||
        this.joystickKeys?.down.isDown) ??
      false;

    if (!this.game.input.enabled) {
      this.input.keyboard?.resetKeys();
    }

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

    const isMoving =
      this.inputPayload.left ||
      this.inputPayload.right ||
      this.inputPayload.up ||
      this.inputPayload.down;

    if (this.soundEffects) {
      this.soundEffects.forEach((audio) =>
        audio.setVolumeAndPan(
          this.currentPlayer?.x ?? 0,
          this.currentPlayer?.y ?? 0
        )
      );
    } else {
      console.error("audioController is undefined");
    }

    if (this.walkAudioController) {
      this.walkAudioController.handleWalkSound(isMoving);
    } else {
      console.error("walkAudioController is undefined");
    }

    if (isMoving) {
      this.currentPlayer.walk();
    } else {
      this.currentPlayer.idle();
    }

    this.currentPlayer.setDepth(Math.floor(this.currentPlayer.y));

    // this.cameras.main.setScroll(this.currentPlayer.x, this.currentPlayer.y);
  }

  updateOtherPlayers() {
    const room =
      this.roomService.state.context.rooms[
        this.roomService.state.context.roomId
      ];
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
      const defaultClick = () => {
        const distance = Phaser.Math.Distance.BetweenPoints(
          container,
          this.currentPlayer as BumpkinContainer
        );

        if (distance > 50) {
          container.speak("You are too far away");
          return;
        }
        npcModalManager.open(bumpkin.npc);
      };

      const container = new BumpkinContainer({
        scene: this,
        x: bumpkin.x,
        y: bumpkin.y,
        clothing: bumpkin.clothing ?? NPC_WEARABLES[bumpkin.npc],
        onClick: bumpkin.onClick ?? defaultClick,
        name: bumpkin.npc,
      });

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
}
