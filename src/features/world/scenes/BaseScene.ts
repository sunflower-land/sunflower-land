import Phaser, { Physics } from "phaser";

import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

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
import { Player, PlazaRoomState } from "../types/Room";
import { playerModalManager } from "../ui/PlayerModals";
import { GameState } from "features/game/types/game";
import { translate } from "lib/i18n/translate";
import { Room } from "colyseus.js";

import defaultTilesetConfig from "assets/map/tileset.json";

import {
  AudioLocalStorageKeys,
  getCachedAudioSetting,
} from "../../game/lib/audio";
import { MachineInterpreter } from "features/game/lib/gameMachine";

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
    imageKey?: string;
    defaultTilesetConfig?: any;
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

  public joystick?: VirtualJoystick;
  private sceneTransitionData?: SceneTransitionData;
  private switchToScene?: SceneId;
  private options: Required<BaseSceneOptions>;

  public map: Phaser.Tilemaps.Tilemap = {} as Phaser.Tilemaps.Tilemap;

  currentPlayer: BumpkinContainer | undefined;
  isFacingLeft = false;
  movementAngle: number | undefined;
  serverPosition: { x: number; y: number } = { x: 0, y: 0 };
  packetSentAt = 0;

  playerEntities: {
    [sessionId: string]: BumpkinContainer;
  } = {};

  colliders?: Phaser.GameObjects.Group;
  triggerColliders?: Phaser.GameObjects.Group;
  hiddenColliders?: Phaser.GameObjects.Group;

  soundEffects: AudioController[] = [];
  walkAudioController?: WalkAudioController;

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
      throw new Error(translate("base.missing"));
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
      const json = {
        ...this.options.map.json,
        tilesets:
          this.options.map.defaultTilesetConfig ??
          defaultTilesetConfig.tilesets,
      };
      this.load.tilemapTiledJSON(this.options.name, json);
    }
  }

  init(data: SceneTransitionData) {
    this.sceneTransitionData = data;
  }

  create() {
    const errorLogger = createErrorLogger("phaser_base_scene", Number(this.id));

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

      if (SPAWNS()[this.sceneId]) {
        spawn = SPAWNS()[this.sceneId][from] ?? SPAWNS()[this.sceneId].default;
      }

      this.createPlayer({
        x: spawn.x ?? 0,
        y: spawn.y ?? 0,
        // gameService
        farmId: Number(this.id),
        username: this.username,
        isCurrentPlayer: true,
        // gameService
        clothing: {
          ...(this.gameState.bumpkin?.equipped as BumpkinParts),
          updatedAt: 0,
        },
        experience: 0,
      });

      this.initialiseCamera();

      // this.physics.world.fixedStep = false; // activates sync
      // this.physics.world.fixedStep = true; // deactivates sync (default)
    } catch (error) {
      errorLogger(JSON.stringify(error));
    }
  }

  private roof: Phaser.Tilemaps.TilemapLayer | null = null;

  public initialiseMap() {
    this.map = this.make.tilemap({
      key: this.options.name,
    });

    const tileset = this.map.addTilesetImage(
      "Sunnyside V3",
      this.options.map.imageKey ?? "tileset",
      16,
      16,
      1,
      2
    ) as Phaser.Tilemaps.Tileset;

    // Set up collider layers
    this.colliders = this.add.group();

    if (this.map.getObjectLayer("Collision")) {
      const collisionPolygons = this.map.createFromObjects("Collision", {
        scene: this,
      });
      collisionPolygons.forEach((polygon) => {
        this.colliders?.add(polygon);
        this.physics.world.enable(polygon);
        (polygon.body as Physics.Arcade.Body).setImmovable(true);
      });
    }

    // Setup interactable layers
    if (this.map.getObjectLayer("Interactable")) {
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
    }

    this.triggerColliders = this.add.group();

    if (this.map.getObjectLayer("Trigger")) {
      const triggerPolygons = this.map.createFromObjects("Trigger", {
        scene: this,
      });

      triggerPolygons.forEach((polygon) => {
        this.triggerColliders?.add(polygon);
        this.physics.world.enable(polygon);
        (polygon.body as Physics.Arcade.Body).setImmovable(true);
      });
    }

    this.hiddenColliders = this.add.group();

    if (this.map.getObjectLayer("Hidden")) {
      const hiddenPolygons = this.map.createFromObjects("Hidden", {
        scene: this,
      });

      hiddenPolygons.forEach((polygon) => {
        this.hiddenColliders?.add(polygon);
        this.physics.world.enable(polygon);
        (polygon.body as Physics.Arcade.Body).setImmovable(true);
      });
    }

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

      const layer = this.map.createLayer(layerData.name, [tileset], 0, 0);
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
      this.mmoService?.send("CONNECT", {
        url: this.options.mmo.url,
        serverId: this.options.mmo.serverId,
      });
    }

    const server = this.mmoServer;
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

    const removeReactionListener = server.state.reactions.onAdd((reaction) => {
      // Old message
      if (reaction.sentAt < Date.now() - 5000) {
        return;
      }

      if (reaction.sceneId !== this.options.name) {
        return;
      }

      if (!this.scene?.isActive()) {
        return;
      }

      if (this.playerEntities[reaction.sessionId]) {
        this.playerEntities[reaction.sessionId].react(reaction.reaction);
      } else if (reaction.sessionId === server.sessionId) {
        this.currentPlayer?.react(reaction.reaction);
      }
    });

    // send the scene player is in
    // this.room.send()

    this.events.on("shutdown", () => {
      removeMessageListener();
      removeReactionListener();
    });
  }

  public initialiseSounds() {
    const audioMuted = getCachedAudioSetting<boolean>(
      AudioLocalStorageKeys.audioMuted,
      false
    );
    if (!audioMuted) {
      this.walkAudioController = new WalkAudioController(
        this.sound.add(this.options.audio.fx.walk_key)
      );
    }
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
        forceMin: 2,
      });
    }
    // Initialise Keyboard
    this.cursorKeys = this.input.keyboard?.createCursorKeys();
    if (this.cursorKeys) {
      const mmoLocalSettings = JSON.parse(
        localStorage.getItem("mmo_settings") ?? "{}"
      );
      const layout = mmoLocalSettings.layout ?? "QWERTY";

      // add WASD keys
      this.cursorKeys.w = this.input.keyboard?.addKey(
        layout === "QWERTY" ? "W" : "Z",
        false
      );
      this.cursorKeys.a = this.input.keyboard?.addKey(
        layout === "QWERTY" ? "A" : "Q",
        false
      );
      this.cursorKeys.s = this.input.keyboard?.addKey("S", false);
      this.cursorKeys.d = this.input.keyboard?.addKey("D", false);

      this.input.keyboard?.removeCapture("SPACE");
    }

    this.input.setTopOnly(true);
  }

  // LEGACY: Used in community islands
  public get mmoService() {
    return this.registry.get("mmoService") as MMOMachineInterpreter | undefined;
  }

  public get mmoServer() {
    return this.registry.get("mmoServer") as Room<PlazaRoomState>;
  }

  public get gameState() {
    return this.registry.get("gameState") as GameState;
  }

  public get id() {
    return this.registry.get("id") as number;
  }

  public get gameService() {
    return this.registry.get("gameService") as MachineInterpreter;
  }

  public get username() {
    return this.gameState.username;
  }

  createPlayer({
    x,
    y,
    farmId,
    username,
    isCurrentPlayer,
    clothing,
    npc,
    experience = 0,
  }: {
    isCurrentPlayer: boolean;
    x: number;
    y: number;
    farmId: number;
    username?: string;
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
        entity.speak(translate("base.far.away"));
        return;
      }

      if (npc) {
        npcModalManager.open(npc);
      } else {
        if (farmId !== this.id) {
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
        text: username ? username : `#${farmId}`,
      });
      nameTag.name = "nameTag";
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

          // Change scenes
          const warpTo = (obj2 as any).data?.list?.warp;
          if (warpTo) {
            this.currentPlayer?.stopSpeaking();
            this.cameras.main.fadeOut(1000);

            this.cameras.main.on(
              "camerafadeoutcomplete",
              () => {
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
    } else {
      (entity.body as Phaser.Physics.Arcade.Body)
        .setSize(16, 20)
        .setOffset(0, 0);
    }

    return entity;
  }

  createPlayerText({ x, y, text }: { x: number; y: number; text: string }) {
    const textObject = this.add.text(x, y + NAME_TAG_OFFSET_PX, text, {
      fontSize: "4px",
      fontFamily: "monospace",
      resolution: 4,
      padding: { x: 2, y: 2 },
    });
    textObject.setOrigin(0.5);

    this.physics.add.existing(textObject);
    (textObject.body as Phaser.Physics.Arcade.Body).checkCollision.none = true;

    return textObject;
  }

  destroyPlayer(sessionId: string) {
    const entity = this.playerEntities[sessionId];
    if (entity) {
      entity.disappear();
      delete this.playerEntities[sessionId];
    }
  }

  update(): void {
    this.currentTick++;

    this.switchScene();
    this.updatePlayer();
    this.updateOtherPlayers();
    this.updateUsernames();
  }

  keysToAngle(
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean
  ): number | undefined {
    // calculate the x and y components based on key states
    const x = (right ? 1 : 0) - (left ? 1 : 0);
    const y = (down ? 1 : 0) - (up ? 1 : 0);

    if (x === 0 && y === 0) {
      return undefined;
    }

    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  public walkingSpeed = 50;

  updatePlayer() {
    if (!this.currentPlayer?.body) {
      return;
    }

    // joystick is active if force is greater than zero
    this.movementAngle = this.joystick?.force
      ? this.joystick?.angle
      : undefined;

    // use keyboard control if joystick is not active
    if (this.movementAngle === undefined) {
      if (document.activeElement?.tagName === "INPUT") return;

      const left =
        (this.cursorKeys?.left.isDown || this.cursorKeys?.a?.isDown) ?? false;
      const right =
        (this.cursorKeys?.right.isDown || this.cursorKeys?.d?.isDown) ?? false;
      const up =
        (this.cursorKeys?.up.isDown || this.cursorKeys?.w?.isDown) ?? false;
      const down =
        (this.cursorKeys?.down.isDown || this.cursorKeys?.s?.isDown) ?? false;

      this.movementAngle = this.keysToAngle(left, right, up, down);
    }

    // change player direction if angle is changed from left to right or vise versa
    if (
      this.movementAngle !== undefined &&
      Math.abs(this.movementAngle) !== 90
    ) {
      this.isFacingLeft = Math.abs(this.movementAngle) > 90;
      this.isFacingLeft
        ? this.currentPlayer.faceLeft()
        : this.currentPlayer.faceRight();
    }

    // set player velocity
    const currentPlayerBody = this.currentPlayer
      .body as Phaser.Physics.Arcade.Body;
    if (this.movementAngle !== undefined) {
      currentPlayerBody.setVelocity(
        this.walkingSpeed * Math.cos((this.movementAngle * Math.PI) / 180),
        this.walkingSpeed * Math.sin((this.movementAngle * Math.PI) / 180)
      );
    } else {
      currentPlayerBody.setVelocity(0, 0);
    }

    this.sendPositionToServer();

    const isMoving = this.movementAngle !== undefined;

    if (this.soundEffects) {
      this.soundEffects.forEach((audio) =>
        audio.setVolumeAndPan(
          this.currentPlayer?.x ?? 0,
          this.currentPlayer?.y ?? 0
        )
      );
    } else {
      // eslint-disable-next-line no-console
      console.error("audioController is undefined");
    }

    if (this.walkAudioController) {
      this.walkAudioController.handleWalkSound(isMoving);
    } else {
      // eslint-disable-next-line no-console
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

  sendPositionToServer() {
    if (!this.currentPlayer) {
      return;
    }

    // sync player position to server
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

      const server = this.mmoServer;
      if (server) {
        server.send(0, this.serverPosition);
      }
    }
  }

  syncPlayers() {
    const server = this.mmoServer;
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
          username: player.username,
          clothing: player.clothing,
          isCurrentPlayer: sessionId === server.sessionId,
          npc: player.npc,
          experience: player.experience,
        });
      }
    });
  }

  updateClothing() {
    const server = this.mmoServer;
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

  updateUsernames() {
    const server = this.mmoServer;
    if (!server) return;

    server.state.players.forEach((player, sessionId) => {
      if (this.playerEntities[sessionId]) {
        const nameTag = this.playerEntities[sessionId].getByName("nameTag") as
          | Phaser.GameObjects.Text
          | undefined;

        if (nameTag && player.username && nameTag.text !== player.username) {
          nameTag.setText(player.username);
        }
      } else if (sessionId === server.sessionId) {
        const nameTag = this.currentPlayer?.getByName("nameTag") as
          | Phaser.GameObjects.Text
          | undefined;

        if (nameTag && player.username && nameTag.text !== player.username) {
          nameTag.setText(player.username);
        }
      }
    });
  }

  renderPlayers() {
    const server = this.mmoServer;
    if (!server) return;

    const playerInVIP = this.physics.world.overlap(
      this.hiddenColliders as Phaser.GameObjects.Group,
      this.currentPlayer
    );

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

      // Hide if in club house
      const overlap = this.physics.world.overlap(
        this.hiddenColliders as Phaser.GameObjects.Group,
        entity
      );

      const hidden = !playerInVIP && overlap;

      // Check if player is in area as well
      if (hidden === entity.visible) {
        entity.setVisible(!hidden);
      }
    });
  }

  switchScene() {
    if (this.switchToScene) {
      const warpTo = this.switchToScene;
      this.switchToScene = undefined;
      // this.mmoService?.state.context.server?.send(0, { sceneId: warpTo });
      this.mmoService?.send("SWITCH_SCENE", { sceneId: warpTo });
      this.scene.start(warpTo, { previousSceneId: this.sceneId });
    }
  }
  updateOtherPlayers() {
    const server = this.mmoServer;
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

  teleportModerator(x: number, y: number) {
    this.currentPlayer?.setPosition(x, y);
  }
}
