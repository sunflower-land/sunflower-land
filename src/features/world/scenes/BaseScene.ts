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
import { FactionName, GameState, IslandType } from "features/game/types/game";
import { translate } from "lib/i18n/translate";
import { Room } from "colyseus.js";

import defaultTilesetConfig from "assets/map/tileset.json";

import { MachineInterpreter } from "features/game/lib/gameMachine";
import { MachineInterpreter as AuthMachineInterpreter } from "features/auth/lib/authMachine";
import { PhaserNavMesh } from "phaser-navmesh";
import {
  AUDIO_MUTED_EVENT,
  getAudioMutedSetting,
} from "lib/utils/hooks/useIsAudioMuted";
import { NightShaderPipeline } from "../shaders/nightShader";
import {
  PLAZA_SHADER_EVENT,
  PlazaShader,
  PlazaShaders,
  getPlazaShaderSetting,
} from "lib/utils/hooks/usePlazaShader";
import { playerSelectionListManager } from "../ui/PlayerSelectionList";
import { playerModalManager } from "../ui/player/PlayerModals";
import { STREAM_REWARD_COOLDOWN } from "../ui/player/StreamReward";
import { hasVipAccess } from "features/game/lib/vipAccess";

export type NPCBumpkin = {
  x: number;
  y: number;
  npc: NPCName;
  direction?: "left" | "right";
  clothing?: BumpkinParts;
  onClick?: () => void;
  hideLabel?: boolean;
};

// 3 Times per second send position to server
const SEND_PACKET_RATE = 10;
const NAME_TAG_OFFSET_PX = 12;

const WALKING_SPEED = 50;

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

export const FACTION_NAME_COLORS: Record<FactionName, string> = {
  sunflorians: "#fee761",
  bumpkins: "#528ec9",
  goblins: "#669c82",
  nightshades: "#a878ac",
};

export abstract class BaseScene extends Phaser.Scene {
  abstract sceneId: SceneId;
  eventListener?: (event: EventObject) => void;
  private lastModalOpenTime = 0;

  public joystick?: VirtualJoystick;
  private switchToScene?: SceneId;
  public isCameraFading = false;
  private options: Required<BaseSceneOptions>;

  public map: Phaser.Tilemaps.Tilemap = {} as Phaser.Tilemaps.Tilemap;

  npcs: Partial<Record<NPCName, BumpkinContainer>> = {};

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
  otherDiggers: Map<string, { x: number; y: number }> = new Map();
  /**
   * navMesh can be used to find paths between two points. The map will need to have
   * a layer of "walkable rectangles" that the player can walk on.
   * ref: https://github.com/mikewesthad/navmesh
   */
  navMesh: PhaserNavMesh | undefined;

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

  private onAudioMuted = (event: CustomEvent) => {
    this.sound.mute = event.detail;
  };

  /**
   * Changes the shader when the event is triggered.
   * @param event The event.
   */
  private onSetPlazaShader = (event: CustomEvent) => {
    if (!this.cameras.main) return;

    const plazaShader = event.detail as PlazaShader;

    // reset shader if no shader is selected
    if (plazaShader === "none" && this.cameras.main.hasPostPipeline) {
      this.cameras.main.resetPostPipeline();
      return;
    }

    const existingPipelines = this.cameras.main.postPipelines;
    const existingSamePipelines = existingPipelines.filter(
      (pipeline) => pipeline.name === plazaShader,
    );
    const existingOtherPipelines = existingPipelines.filter(
      (pipeline) => pipeline.name !== plazaShader,
    );

    // add the shader if it doesn't exist
    if (existingSamePipelines.length === 0) {
      this.cameras.main.setPostPipeline(plazaShader);
    }

    // remove other shaders
    if (existingOtherPipelines.length > 0) {
      existingOtherPipelines.forEach((pipeline) =>
        this.cameras.main.removePostPipeline(pipeline),
      );
    }
  };

  /**
   * Initializes the shaders and listeners.
   */
  private initializeShaders = () => {
    const rendererPipelines = (
      this.renderer as Phaser.Renderer.WebGL.WebGLRenderer
    ).pipelines;

    // define all shaders here
    const shaderActions: Record<PlazaShader, () => void> = {
      none: () => undefined,
      night: () =>
        rendererPipelines?.addPostPipeline("night", NightShaderPipeline),
      // add other shaders here
    };

    // add all shaders to pipeline
    const plazaShaders = Object.keys(PlazaShaders) as PlazaShader[];
    plazaShaders.forEach((shader) => {
      shaderActions[shader]?.();
    });

    // add event listener for settings
    window.addEventListener(PLAZA_SHADER_EVENT as any, this.onSetPlazaShader);
    this.onSetPlazaShader({ detail: getPlazaShaderSetting() } as CustomEvent);
  };

  /**
   * Updates the shaders.
   */
  updateShaders = () => {
    // get pipeline
    const nightShaderPipeline = this.cameras.main.getPostPipeline(
      "night",
    ) as NightShaderPipeline;
    if (!nightShaderPipeline || !this.currentPlayer) return;

    // calculate the player's position relative to the camera
    const mapWidth = this.map.widthInPixels;
    const mapHeight = this.map.heightInPixels;
    const screenWidth = this.cameras.main.worldView.width;
    const screenHeight = this.cameras.main.worldView.height;
    const worldViewX = this.cameras.main.worldView.x;
    const worldViewY = this.cameras.main.worldView.y;
    const offsetX = Math.max(0, (screenWidth - mapWidth) / 2);
    const offsetY = Math.max(0, (screenHeight - mapHeight) / 2);

    const relativeX =
      (this.currentPlayer.x - worldViewX + offsetX) / screenWidth;
    const relativeY =
      (this.currentPlayer.y - worldViewY + offsetY) / screenHeight;

    // set light sources
    nightShaderPipeline.lightSources = [{ x: relativeX, y: relativeY }];
  };

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

  create() {
    const errorLogger = createErrorLogger("phaser_base_scene", Number(this.id));

    try {
      this.initialiseMap();
      this.initialiseSounds();

      this.initializeShaders();

      // set audio mute state and listen for changes
      this.sound.mute = getAudioMutedSetting();
      window.addEventListener(AUDIO_MUTED_EVENT as any, this.onAudioMuted);

      if (this.options.mmo.enabled) {
        this.initialiseMMO();
      }

      if (this.options.controls.enabled) {
        this.initialiseControls();
      }

      const from = this.mmoService?.state.context.previousSceneId as SceneId;

      let spawn = this.options.player.spawn;

      if (SPAWNS()[this.sceneId]) {
        spawn = SPAWNS()[this.sceneId][from] ?? SPAWNS()[this.sceneId].default;
      }

      this.createPlayer({
        x: spawn.x ?? 0,
        y: spawn.y ?? 0,
        // gameService
        farmId: Number(this.id),
        faction: this.gameState.faction?.name,
        username: this.username,
        isCurrentPlayer: true,
        // gameService
        clothing: {
          ...(this.gameState.bumpkin?.equipped as BumpkinParts),
          updatedAt: 0,
        },
        experience: this.gameState.bumpkin?.experience ?? 0,
        totalDeliveries: this.gameState.delivery.fulfilledCount ?? 0,
        dailyStreak: this.gameState.dailyRewards?.streaks ?? 0,
        isVip: hasVipAccess({ game: this.gameState }),
        createdAt: this.gameState.createdAt,
        islandType: this.gameState.island.type,
      });

      this.initialiseCamera();

      // handles player modal
      // get all player under the pointer click
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        // ignore click if the joystick is active
        if (this.joystick?.pointer) return;

        const clickedObjects = this.input.hitTestPointer(pointer);

        // filter other players
        const clickedBumpkins = clickedObjects.filter((clickedObject) => {
          const isBumpkinContainer = clickedObject instanceof BumpkinContainer;
          if (!isBumpkinContainer) return false;

          const bumpkinContainer = clickedObject as BumpkinContainer;
          return (
            (bumpkinContainer.farmId !== this.id ||
              (bumpkinContainer.farmId === this.id &&
                this.gameState.bumpkin.equipped.shirt === "Gift Giver")) &&
            bumpkinContainer.farmId !== undefined
          );
        }) as BumpkinContainer[];

        if (clickedBumpkins.length === 0) return;

        const players = clickedBumpkins.map((clickedBumpkin) => {
          const {
            farmId,
            clothing,
            totalDeliveries,
            dailyStreak,
            isVip,
            createdAt,
            faction,
            islandType,
            experience,
            username,
          } = clickedBumpkin;
          return {
            farmId: farmId as number,
            clothing,
            experience: experience as number,
            username: username as string,
            faction,
            totalDeliveries: totalDeliveries as number,
            dailyStreak: dailyStreak as number,
            isVip: isVip as boolean,
            createdAt: createdAt as number,
            islandType: islandType as IslandType,
          };
        });

        if (clickedBumpkins.length === 1) {
          const distance = Phaser.Math.Distance.BetweenPoints(
            this.currentPlayer as BumpkinContainer,
            clickedBumpkins[0],
          );

          if (distance > 50) {
            this.currentPlayer?.speak(translate("base.far.away"));
            return;
          }

          playerModalManager.open(players[0]);
          return;
        }

        // Check distance for all clicked bumpkins
        const closestBumpkin = clickedBumpkins.reduce((closest, current) => {
          const closestDistance = Phaser.Math.Distance.BetweenPoints(
            this.currentPlayer as BumpkinContainer,
            closest,
          );
          const currentDistance = Phaser.Math.Distance.BetweenPoints(
            this.currentPlayer as BumpkinContainer,
            current,
          );
          return currentDistance < closestDistance ? current : closest;
        });

        const closestDistance = Phaser.Math.Distance.BetweenPoints(
          this.currentPlayer as BumpkinContainer,
          closestBumpkin,
        );

        if (closestDistance > 50) {
          this.currentPlayer?.speak(translate("base.far.away"));
          return;
        }

        playerSelectionListManager.open(players);
      });

      // this.physics.world.fixedStep = false; // activates sync
      // this.physics.world.fixedStep = true; // deactivates sync (default)
    } catch (error) {
      errorLogger(JSON.stringify(error));
    }

    this.setUpNavMesh();
  }

  public setUpNavMesh = () => {
    const meshLayer = this.map.getObjectLayer("NavMesh");
    if (!meshLayer) return;

    this.navMesh = this.navMeshPlugin.buildMeshFromTiled(
      "NavMesh",
      meshLayer,
      16,
    );
  };

  private roof: Phaser.Tilemaps.TilemapLayer | null = null;

  public initialiseMap() {
    this.map = this.make.tilemap({
      key: this.options.name,
    });

    const tilesetKey = this.options.map?.tilesetUrl ?? "Sunnyside V3";
    const imageKey = this.options.map?.imageKey ?? "tileset";

    const tileset = this.map.addTilesetImage(
      tilesetKey,
      imageKey,
      16,
      16,
      1,
      2,
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
        {},
      );
      interactablesPolygons.forEach((polygon) => {
        polygon
          .setInteractive({ cursor: "pointer" })
          .on("pointerdown", (p: Phaser.Input.Pointer) => {
            if (p.downElement.nodeName === "CANVAS") {
              const id = polygon.data.list.id;

              const distance = Phaser.Math.Distance.BetweenPoints(
                this.currentPlayer as BumpkinContainer,
                polygon as Phaser.GameObjects.Polygon,
              );

              if (distance > 50) {
                this.currentPlayer?.speak(translate("base.iam.far.away"));
                return;
              }

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
      "Building Layer 4",
      "Building Decorations 2",
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
      this.map.height * SQUARE_WIDTH,
    );
  }

  public initialiseCamera() {
    const camera = this.cameras.main;

    camera.setBounds(
      0,
      0,
      this.map.width * SQUARE_WIDTH,
      this.map.height * SQUARE_WIDTH,
    );

    camera.setZoom(this.zoom);

    // Center it on canvas
    const offsetX = (window.innerWidth - this.map.width * 4 * SQUARE_WIDTH) / 2;
    const offsetY =
      (window.innerHeight - this.map.height * 4 * SQUARE_WIDTH) / 2;
    camera.setPosition(Math.max(offsetX, 0), Math.max(offsetY, 0));

    camera.fadeIn(500);

    camera.on(
      "camerafadeincomplete",
      () => {
        this.isCameraFading = false;
      },
      this,
    );
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
        this.playerEntities[reaction.sessionId].react(
          reaction.reaction,
          reaction.quantity,
        );
      } else if (reaction.sessionId === server.sessionId) {
        this.currentPlayer?.react(reaction.reaction, reaction.quantity);
      }
    });

    // send the scene player is in
    // this.room.send()

    this.events.on("shutdown", () => {
      removeMessageListener();
      removeReactionListener();

      window.removeEventListener(AUDIO_MUTED_EVENT as any, this.onAudioMuted);
      this.input.off("pointerdown"); // clean up pointerdown event listener
    });
  }

  public initialiseSounds() {
    this.walkAudioController = new WalkAudioController(
      this.sound.add(this.options.audio.fx.walk_key),
    );
  }

  public initialiseControls() {
    if (isTouchDevice()) {
      // Initialise joystick
      const { centerX, centerY, height } = this.cameras.main;
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
        localStorage.getItem("mmo_settings") ?? "{}",
      );
      const layout = mmoLocalSettings.layout ?? "QWERTY";

      // add WASD keys
      this.cursorKeys.w = this.input.keyboard?.addKey(
        layout === "QWERTY" ? "W" : "Z",
        false,
      );
      this.cursorKeys.a = this.input.keyboard?.addKey(
        layout === "QWERTY" ? "A" : "Q",
        false,
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

  public get authService() {
    return this.registry.get("authService") as AuthMachineInterpreter;
  }

  public get username() {
    return this.gameState.username;
  }

  public get selectedItem() {
    return this.registry.get("selectedItem");
  }

  public get shortcutItem() {
    return this.registry.get("shortcutItem");
  }

  createPlayer({
    x,
    y,
    farmId,
    username,
    faction,
    isCurrentPlayer,
    clothing,
    npc,
    experience,
    totalDeliveries,
    dailyStreak,
    isVip,
    createdAt,
    islandType,
  }: {
    isCurrentPlayer: boolean;
    x: number;
    y: number;
    farmId: number;
    username?: string;
    faction?: FactionName;
    clothing: Player["clothing"];
    npc?: NPCName;
    experience?: number;
    totalDeliveries?: number;
    dailyStreak?: number;
    isVip?: boolean;
    createdAt?: number;
    islandType?: IslandType;
  }): BumpkinContainer {
    const defaultClick = () => {
      const distance = Phaser.Math.Distance.BetweenPoints(
        entity,
        this.currentPlayer as BumpkinContainer,
      );

      if (!npc) return;

      if (distance > 50) {
        entity.speak(translate("base.far.away"));
        return;
      }

      npcModalManager.open(npc);
    };

    const entity = new BumpkinContainer({
      scene: this,
      x,
      y,
      clothing,
      name: npc,
      username,
      experience,
      farmId,
      faction,
      onClick: defaultClick,
      totalDeliveries,
      dailyStreak,
      isVip,
      createdAt,
      islandType,
    });

    if (!npc) {
      const color = faction
        ? FACTION_NAME_COLORS[faction as FactionName]
        : "#fff";

      const nameTag = this.createPlayerText({
        x: 0,
        y: 0,
        text: username ?? "",
        color,
      });
      nameTag.setShadow(1, 1, "#161424", 0, false, true);
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
        false,
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
          if (warpTo && !this.isCameraFading) {
            this.changeScene(warpTo);
          }

          const interactable = (obj2 as any).data?.list?.open;
          if (interactable) {
            interactableModalManager.open(interactable);
          }
        },
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
        },
      );
    } else {
      (entity.body as Phaser.Physics.Arcade.Body)
        .setSize(16, 20)
        .setOffset(0, 0);
    }

    return entity;
  }

  createPlayerText({
    x,
    y,
    text,
    color,
  }: {
    x: number;
    y: number;
    text: string;
    color?: string;
  }) {
    const textObject = this.add.text(x, y + NAME_TAG_OFFSET_PX, text, {
      fontSize: "4px",
      fontFamily: "monospace",
      resolution: 4,
      padding: { x: 2, y: 2 },
      color: color ?? "#ffffff",
    });

    textObject.setOrigin(0.5);

    this.physics.add.existing(textObject);
    (textObject.body as Phaser.Physics.Arcade.Body).checkCollision.none = true;

    return textObject;
  }

  destroyPlayer(sessionId: string) {
    const entity = this.playerEntities[sessionId];
    if (entity) {
      // Dispatch player leave event
      const event = new CustomEvent("player_leave", {
        detail: { playerId: entity.farmId },
      });
      window.dispatchEvent(event);

      entity.disappear();
      delete this.playerEntities[sessionId];
    }
  }

  update(): void {
    this.currentTick++;

    this.switchScene();
    this.updatePlayer();
    this.updateOtherPlayers();
    this.updateShaders();
    this.updateUsernames();
    this.updateFactions();
  }

  keysToAngle(
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean,
  ): number | undefined {
    // calculate the x and y components based on key states
    const x = (right ? 1 : 0) - (left ? 1 : 0);
    const y = (down ? 1 : 0) - (up ? 1 : 0);

    if (x === 0 && y === 0) {
      return undefined;
    }

    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  get walkingSpeed() {
    if (this.isCameraFading) return 0;

    return WALKING_SPEED;
  }

  updatePlayer() {
    if (!this.currentPlayer?.body) {
      return;
    }

    // Update faction
    const faction = this.gameState.faction?.name;

    if (this.currentPlayer.faction !== faction) {
      this.currentPlayer.faction = faction;
      this.mmoServer?.send(0, { faction });
      this.checkAndUpdateNameColor(
        this.currentPlayer,
        faction ? FACTION_NAME_COLORS[faction] : "white",
      );
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
        this.walkingSpeed * Math.sin((this.movementAngle * Math.PI) / 180),
      );
    } else {
      currentPlayerBody.setVelocity(0, 0);
    }

    this.sendPositionToServer();

    const isMoving =
      this.movementAngle !== undefined && this.walkingSpeed !== 0;

    if (this.soundEffects) {
      this.soundEffects.forEach((audio) =>
        audio.setVolumeAndPan(
          this.currentPlayer?.x ?? 0,
          this.currentPlayer?.y ?? 0,
        ),
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
          faction: player.faction,
          clothing: player.clothing,
          isCurrentPlayer: sessionId === server.sessionId,
          npc: player.npc,
          experience: player.experience,
          totalDeliveries: player.totalDeliveries,
          dailyStreak: player.dailyStreak,
          isVip: player.isVip,
          createdAt: player.createdAt,
          islandType: player.islandType,
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

  checkAndUpdateNameColor(entity: BumpkinContainer, color: string) {
    const nameTag = entity.getByName("nameTag") as
      | Phaser.GameObjects.Text
      | undefined;

    if (nameTag && nameTag.style.color !== color) {
      nameTag.setColor(color);
    }
  }

  updateFactions() {
    const server = this.mmoServer;
    if (!server) return;

    server.state.players.forEach((player, sessionId) => {
      if (!player.faction) return;

      if (this.playerEntities[sessionId]) {
        const faction = player.faction;
        const color = faction
          ? FACTION_NAME_COLORS[faction as FactionName]
          : "#fff";

        this.checkAndUpdateNameColor(this.playerEntities[sessionId], color);
      }
    });
  }

  renderPlayers() {
    const server = this.mmoServer;
    if (!server) return;

    const playerInVIP = this.physics.world.overlap(
      this.hiddenColliders as Phaser.GameObjects.Group,
      this.currentPlayer,
    );

    // Render current players
    server.state.players.forEach((player, sessionId) => {
      if (sessionId === server.sessionId) return;

      if (this.otherDiggers.has(sessionId)) return;

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
        entity,
      );

      const hidden = !playerInVIP && overlap;

      // Check if player is in area as well
      if (hidden === entity.visible) {
        entity.setVisible(!hidden);
      }

      // Check for streamer hat
      if (player.clothing?.hat === "Streamer Hat") {
        const distance = Phaser.Math.Distance.BetweenPoints(
          this.currentPlayer as BumpkinContainer,
          entity,
        );
        const now = Date.now();
        const streamerHatLastClaimedAt =
          this.gameService.state.context.state.pumpkinPlaza.streamerHat
            ?.openedAt ?? 0;

        if (
          now - this.lastModalOpenTime > STREAM_REWARD_COOLDOWN &&
          distance < 75
        ) {
          playerModalManager.open({
            farmId: player.farmId,
            clothing: player.clothing,
            experience: player.experience,
            username: player.username,
            isVip: hasVipAccess({ game: this.gameState }),
            faction: player.faction,
            createdAt: player.createdAt,
            islandType: player.islandType,
            totalDeliveries: player.totalDeliveries,
            dailyStreak: player.dailyStreak,
          });
          this.lastModalOpenTime = streamerHatLastClaimedAt;
        }
      }
    });
  }

  switchScene() {
    if (this.switchToScene) {
      const warpTo = this.switchToScene;
      this.switchToScene = undefined;

      // This will cause a loop
      // this.registry.get("navigate")(`/world/${warpTo}`);

      // this.mmoService?.state.context.server?.send(0, { sceneId: warpTo });
      this.mmoService?.send("SWITCH_SCENE", { sceneId: warpTo });
    }
  }
  updateOtherPlayers() {
    const server = this.mmoServer;
    if (!server) return;

    this.syncPlayers();
    this.updateClothing();
    this.renderPlayers();
  }

  checkDistanceToSprite(
    sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image,
    maxDistance: number,
  ) {
    const distance = Phaser.Math.Distance.BetweenPoints(
      sprite,
      this.currentPlayer as BumpkinContainer,
    );

    if (distance > maxDistance) return false;
    return true;
  }

  initialiseNPCs(npcs: NPCBumpkin[]) {
    npcs.forEach((bumpkin) => {
      const defaultClick = () => {
        const distance = Phaser.Math.Distance.BetweenPoints(
          container,
          this.currentPlayer as BumpkinContainer,
        );

        if (distance > 50) {
          container.speak(translate("base.far.away"));
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
        name: bumpkin.hideLabel ? undefined : bumpkin.npc,
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
      this.npcs[bumpkin.npc] = container;
    });
  }

  teleportModerator(x: number, y: number, sceneId: SceneId) {
    if (sceneId === this.sceneId) {
      this.currentPlayer?.setPosition(x, y);
    } else {
      this.switchToScene = sceneId;
    }
  }

  /**
   * Changes the scene to the desired scene.
   * @param {SceneId} scene The desired scene.
   */
  protected changeScene = (scene: SceneId) => {
    this.isCameraFading = true;

    this.currentPlayer?.stopSpeaking();
    this.cameras.main.fadeOut(500);

    this.cameras.main.on(
      "camerafadeoutcomplete",
      () => {
        this.switchToScene = scene;
      },
      this,
    );
  };
}
