import Phaser, { Physics } from "phaser";

import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

import { MachineInterpreter as GameMachineInterpreter } from "features/game/lib/gameMachine";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { interactableModalManager } from "../ui/InteractableModals";
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
import {
  MachineInterpreter as MMOMachineInterpreter,
  SceneId,
} from "../mmoMachine";
import { Player } from "../types/Room";
import { mazeManager } from "../ui/cornMaze/MazeHud";
import { playerModalManager } from "../ui/PlayerModals";

type SceneTransitionData = {
  previousSceneId: SceneId;
};

export type NPCBumpkin = {
  x: number;
  y: number;
  npc: NPCName;
  direction?: "left" | "right";
  clothing?: BumpkinParts;
  onClick?: () => void;
};

// 3 Times per second send position to server
const SEND_PACKET_RATE = 10;
const NAME_TAG_OFFSET_PX = 12;

type BaseSceneOptions = {
  name: SceneId;
  map: {
    tilesetUrl?: string;
    json: any;
    padding?: [number, number];
  };
  mmo?: {
    enabled: boolean;
    url?: string;
    serverId?: string;
    sceneId?: string;
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
  abstract sceneId: SceneId;
  eventListener?: (event: EventObject) => void;

  private joystick?: VirtualJoystick;
  private sceneTransitionData?: SceneTransitionData;
  private switchToScene?: SceneId;
  private options: Required<BaseSceneOptions>;

  public map: Phaser.Tilemaps.Tilemap = {} as Phaser.Tilemaps.Tilemap;

  canHandlePortalHit = true;

  currentPlayer: BumpkinContainer | undefined;
  serverPosition: { x: number; y: number } = { x: 0, y: 0 };
  packetSentAt = 0;

  playerEntities: {
    [sessionId: string]: BumpkinContainer;
  } = {};

  colliders?: Phaser.GameObjects.Group;
  triggerColliders?: Phaser.GameObjects.Group;
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

  zoom = window.innerWidth < 500 ? 3 : 4;

  layers: Record<string, Phaser.Tilemaps.TilemapLayer> = {};

  onCollision: Record<
    string,
    Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
  > = {};

  constructor(options: BaseSceneOptions) {
    if (!options.name) {
      throw new Error("Missing name in config");
    }

    const defaultedOptions: Required<BaseSceneOptions> = {
      ...options,
      name: options.name,
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

    // Shut down the sound when the scene changes
    const event = this.events.once("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
      this.soundEffects = [];
    });
  }

  init(data: SceneTransitionData) {
    this.sceneTransitionData = data;
  }

  create() {
    const errorLogger = createErrorLogger(
      "phaser_base_scene",
      Number(this.gameService.state.context.state.id)
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

      const from = this.sceneTransitionData?.previousSceneId as SceneId;

      let spawn = this.options.player.spawn;

      if (SPAWNS[this.sceneId]) {
        spawn = SPAWNS[this.sceneId][from] ?? SPAWNS[this.sceneId].default;
      }

      this.createPlayer({
        x: spawn.x ?? 0,
        y: spawn.y ?? 0,
        // gameService
        farmId: Number(this.gameService.state.context.state.id),
        isCurrentPlayer: true,
        // gameService
        clothing: {
          ...(this.gameService.state.context.state.bumpkin
            ?.equipped as BumpkinParts),
          updatedAt: 0,
        },
        experience: 0,
      });

      this.initialiseCamera();

      // this.physics.world.fixedStep = false; // activates sync
      // this.physics.world.fixedStep = true; // deactivates sync (default)
    } catch (error) {
      console.log({ error });
      errorLogger(JSON.stringify(error));
    }
  }

  private roof: Phaser.Tilemaps.TilemapLayer | null = null;

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
          16,
          ...(this.options.map.padding ?? [0, 0])
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
    this.colliders = this.add.group();
    const collisionPolygons = this.map.createFromObjects("Collision", {
      scene: this,
    });
    collisionPolygons.forEach((polygon) => {
      this.colliders?.add(polygon);
      this.physics.world.enable(polygon);
      (polygon.body as Physics.Arcade.Body).setImmovable(true);
    });

    // Setup interactable layers
    const interactablesPolygons = this.map.createFromObjects(
      "Interactable",
      {}
    );
    interactablesPolygons.forEach((polygon) => {
      polygon
        .setInteractive({ cursor: "pointer" })
        .on("pointerdown", (p: Phaser.Input.Pointer) => {
          if (p.downElement.nodeName === "CANVAS") {
            const id = polygon.data.list.id;
            interactableModalManager.open(id);
          }
        });
    });

    this.triggerColliders = this.add.group();

    const triggerPolygons = this.map.createFromObjects("Trigger", {
      scene: this,
    });

    triggerPolygons.forEach((polygon) => {
      this.triggerColliders?.add(polygon);
      this.physics.world.enable(polygon);
      (polygon.body as Physics.Arcade.Body).setImmovable(true);
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
      "Club House Roof",
    ];
    this.map.layers.forEach((layerData, idx) => {
      if (layerData.name === "Crows") return;

      const layer = this.map.createLayer(layerData.name, tileset, 0, 0);
      if (TOP_LAYERS.includes(layerData.name)) {
        layer?.setDepth(1000000);
      }

      this.layers[layerData.name] = layer as Phaser.Tilemaps.TilemapLayer;
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

    camera.setZoom(this.zoom);

    // Center it on canvas
    const offsetX = (window.innerWidth - this.map.width * 4 * SQUARE_WIDTH) / 2;
    const offsetY =
      (window.innerHeight - this.map.height * 4 * SQUARE_WIDTH) / 2;
    camera.setPosition(Math.max(offsetX, 0), Math.max(offsetY, 0));

    camera.fadeIn();
  }

  public initialiseMMO() {
    if (this.options.mmo.url && this.options.mmo.serverId) {
      this.mmoService.send("CONNECT", {
        url: this.options.mmo.url,
        serverId: this.options.mmo.serverId,
      });
    }

    const server = this.mmoService.state.context.server;
    if (!server) return;

    const removeMessageListener = server.state.messages.onAdd((message) => {
      // Old message
      if (message.sentAt < Date.now() - 5000) {
        return;
      }

      if (message.sceneId !== this.options.name) {
        return;
      }

      if (!this.scene?.isActive()) {
        return;
      }

      if (this.playerEntities[message.sessionId]) {
        this.playerEntities[message.sessionId].speak(message.text);
      } else if (message.sessionId === server.sessionId) {
        this.currentPlayer?.speak(message.text);
      }
    });

    // send the scene player is in
    // this.room.send()

    this.events.on("shutdown", () => {
      removeMessageListener();
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
      this.joystick = new VirtualJoystick(this, {
        x: centerX,
        y: centerY - 35 + height / this.zoom / 2,
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

  public get mmoService() {
    return this.registry.get("mmoService") as MMOMachineInterpreter;
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
    experience = 0,
  }: {
    isCurrentPlayer: boolean;
    x: number;
    y: number;
    farmId: number;
    clothing: Player["clothing"];
    npc?: NPCName;
    experience?: number;
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
      } else {
        if (farmId !== this.gameService.state.context.state.id) {
          playerModalManager.open({
            id: farmId,
            clothing,
            experience,
          });
        }
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
        this.colliders as Phaser.GameObjects.Group,
        // Read custom Tiled Properties
        async (obj1, obj2) => {
          const id = (obj2 as any).data?.list?.id;

          // See if scene has registered any callbacks to perform
          const cb = this.onCollision[id];
          if (cb) {
            cb(obj1, obj2);
          }

          if (id) {
            // Handled in corn scene
            if (id === "maze_portal_exit") {
              this.handlePortalHit();
              return;
            }
          }

          // Change scenes
          const warpTo = (obj2 as any).data?.list?.warp;
          if (warpTo) {
            this.currentPlayer?.stopSpeaking();
            this.cameras.main.fadeOut(1000);

            this.cameras.main.on(
              "camerafadeoutcomplete",
              () => {
                console.log("fade out complete in base scene");
                this.switchToScene = warpTo;
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

      this.physics.add.overlap(
        this.currentPlayer,
        this.triggerColliders as Phaser.GameObjects.Group,
        (obj1, obj2) => {
          // You can access custom properties of the trigger object here
          const id = (obj2 as any).data?.list?.id;

          // See if scene has registered any callbacks to perform
          const cb = this.onCollision[id];
          if (cb) {
            cb(obj1, obj2);
          }
        }
      );
    }

    return entity;
  }

  handlePortalHit() {
    if (this.canHandlePortalHit) {
      mazeManager.handlePortalHit();
      this.scene.pause();
      this.sound.getAllPlaying().forEach((sound) => {
        if (sound.key == "sand_footstep") sound.pause();
      });
      this.canHandlePortalHit = false;
    }
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
      entity.setVisible(false);
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

      const server = this.mmoService.state.context.server;
      if (server) {
        server.send(0, this.serverPosition);
      }
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

  syncPlayers() {
    const server = this.mmoService.state.context.server;
    if (!server) return;

    // Destroy any dereferenced players
    Object.keys(this.playerEntities).forEach((sessionId) => {
      if (
        !server.state.players.get(sessionId) ||
        server.state.players.get(sessionId)?.sceneId !== this.scene.key
      )
        this.destroyPlayer(sessionId);
      if (!this.playerEntities[sessionId]?.active)
        this.destroyPlayer(sessionId);
    });

    // Create new players
    server.state.players.forEach((player, sessionId) => {
      // Skip the current player
      if (sessionId === server.sessionId) return;

      if (player.sceneId !== this.scene.key) return;

      if (!this.playerEntities[sessionId]) {
        this.playerEntities[sessionId] = this.createPlayer({
          x: player.x,
          y: player.y,
          farmId: player.farmId,
          clothing: player.clothing,
          isCurrentPlayer: sessionId === server.sessionId,
          npc: player.npc,
          experience: player.experience,
        });
      }
    });
  }

  updateClothing() {
    const server = this.mmoService.state.context.server;
    if (!server) return;

    // Update clothing
    server.state.players.forEach((player, sessionId) => {
      if (this.playerEntities[sessionId]) {
        this.playerEntities[sessionId].changeClothing(player.clothing);
      } else if (sessionId === server.sessionId) {
        this.currentPlayer?.changeClothing(player.clothing);
      }
    });
  }

  renderPlayers() {
    const server = this.mmoService.state.context.server;
    if (!server) return;

    // Render current players
    server.state.players.forEach((player, sessionId) => {
      if (sessionId === server.sessionId) return;

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

  switchScene() {
    if (this.switchToScene) {
      const warpTo = this.switchToScene;
      this.switchToScene = undefined;
      this.mmoService.state.context.server?.send(0, { sceneId: warpTo });
      this.scene.start(warpTo, { previousSceneId: this.sceneId });
    }
  }
  updateOtherPlayers() {
    const server = this.mmoService.state.context.server;
    if (!server) return;

    this.syncPlayers();
    this.updateClothing();
    this.renderPlayers();
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
        clothing: {
          ...(bumpkin.clothing ?? NPC_WEARABLES[bumpkin.npc]),
          updatedAt: 0,
        },
        onClick: bumpkin.onClick ?? defaultClick,
        name: bumpkin.npc,
        direction: bumpkin.direction ?? "right",
      });

      container.setDepth(bumpkin.y);
      (container.body as Phaser.Physics.Arcade.Body)
        .setSize(16, 20)
        .setOffset(0, 0)
        .setImmovable(true)
        .setCollideWorldBounds(true);

      this.physics.world.enable(container);
      this.colliders?.add(container);
      this.triggerColliders?.add(container);
    });
  }

  fixedTick(time: number, delta: number) {
    this.currentTick++;

    this.switchScene();
    this.updatePlayer();
    this.updateOtherPlayers();
  }
}
