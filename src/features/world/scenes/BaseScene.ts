import Phaser, { Physics } from "phaser";
import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

import { SQUARE_WIDTH } from "features/game/lib/constants";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { PetContainer } from "../containers/PetContainer";
import { PetNFTType } from "features/game/types/pets";
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
import { MicroInteraction, Player, PlazaRoomState } from "../types/Room";
import {
  FactionName,
  GameState,
  IslandType,
  Order,
} from "features/game/types/game";
import { hasOrderRequirements } from "features/island/delivery/components/Orders";
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
import { playerInteractionMenuManager } from "../ui/player/PlayerInteractionMenu";

import { STREAM_REWARD_COOLDOWN } from "../ui/player/StreamReward";
import { hasVipAccess } from "features/game/lib/vipAccess";
import {
  playerModalManager,
  PlayerModalPlayer,
} from "features/social/lib/playerModalManager";
import { rewardModalManager } from "features/social/lib/rewardModalManager";
import { waveModalManager } from "features/social/lib/waveModalManager";
import { BONUSES } from "features/game/types/bonuses";

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
  mmo?: { enabled: boolean; url?: string; serverId?: string; sceneId?: string };
  controls?: {
    enabled: boolean; // Default to true
  };
  audio?: { fx: { walk_key: Footsteps } };
  player?: { spawn: Coordinates };
};

export const FACTION_NAME_COLORS: Record<FactionName, string> = {
  sunflorians: "#fee761",
  bumpkins: "#528ec9",
  goblins: "#669c82",
  nightshades: "#a878ac",
};

type MicroInteractionAction = "wave" | "cheer";
type MicroInteractionResponse =
  | "wave_ack"
  | "wave_cancel"
  | "cheer_ack"
  | "cheer_cancel";

type MicroInteractionState = {
  senderId: number;
  receiverId: number;
  type: MicroInteractionAction | MicroInteractionResponse;
  indicator?: Phaser.GameObjects.Container;
};

type OutgoingMicroInteractionState = {
  timeout: Phaser.Time.TimerEvent;
  indicator?: Phaser.GameObjects.Container;
};

const MICRO_INTERACTION_TIMEOUT_MS = 5000;

export abstract class BaseScene extends Phaser.Scene {
  abstract sceneId: SceneId;
  eventListener?: (event: EventObject) => void;
  private lastModalOpenTime = 0;

  public joystick?: VirtualJoystick;
  private switchToScene?: SceneId;
  public isCameraFading = false;
  private options: Required<BaseSceneOptions>;

  public map: Phaser.Tilemaps.Tilemap = {} as Phaser.Tilemaps.Tilemap;

  private activeInteractionMenu?: Phaser.GameObjects.Container;
  private activeInteractionTarget?: BumpkinContainer;

  npcs: Partial<Record<NPCName, BumpkinContainer>> = {};

  currentPlayer: BumpkinContainer | undefined;
  isFacingLeft = false;
  movementAngle: number | undefined;
  serverPosition: { x: number; y: number } = { x: 0, y: 0 };
  packetSentAt = 0;

  playerEntities: { [sessionId: string]: BumpkinContainer } = {};

  private receivedMicroInteractions: Map<number, MicroInteractionState> =
    new Map();
  private outgoingMicroInteractions: Map<
    number,
    OutgoingMicroInteractionState
  > = new Map();

  pets: { [sessionId: string]: PetContainer } = {};

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

      // When game state updates (e.g. after completing a delivery), refresh NPC delivery icons
      this.game.events.on("gameStateUpdated", this.refreshDeliveryIcons, this);
      this.events.once("shutdown", () => {
        this.game.events.off("gameStateUpdated", this.refreshDeliveryIcons);
      });

      // handles player modal
      // get all player under the pointer click
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        // ignore click if the joystick is active
        if (this.joystick?.pointer) return;

        const clickedObjects = this.input.hitTestPointer(pointer);

        // If an interaction menu is open and the click happened outside of it,
        // close the menu.
        if (this.activeInteractionMenu) {
          const menu = this.activeInteractionMenu;
          const clickInsideMenu = clickedObjects.some((obj) => {
            let current = obj as Phaser.GameObjects.GameObject | null;

            // Traverse up the parentContainer chain so any descendant of the
            // menu (not just direct children) is treated as "inside" the menu.
            while (current) {
              if (current === menu) return true;

              const withParent = current as Phaser.GameObjects.GameObject & {
                parentContainer?: Phaser.GameObjects.Container | null;
              };

              current =
                (withParent.parentContainer as Phaser.GameObjects.GameObject | null) ??
                null;
            }

            return false;
          });

          if (!clickInsideMenu) {
            menu.destroy();
            this.activeInteractionMenu = undefined;
            this.activeInteractionTarget = undefined;
          }
        }

        playerInteractionMenuManager.close();

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

          const player = players[0];
          const target = clickedBumpkins[0];
          const existing = target.getByName("interactionMenu") as
            | Phaser.GameObjects.Container
            | undefined;

          if (!existing) {
            this.showInteractionMenu(player, target);
          }

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

  private openPlayerProfile(player: PlayerModalPlayer) {
    if (
      player.clothing?.hat === "Streamer Hat" ||
      player.clothing?.shirt === "Gift Giver"
    ) {
      rewardModalManager.open(player);
      return;
    }

    playerModalManager.open(player);
  }

  private createRoundIconButton(x: number, y: number, icon: string) {
    const container = this.add.container(x, y);
    const buttonImage = this.add.image(0, 0, "round_button");
    const iconImage = this.add.image(0, 0, icon);
    iconImage.setDisplaySize(6, 6);
    container.add(buttonImage);
    container.add(iconImage);
    buttonImage.setDisplaySize(14, 14);
    buttonImage.setInteractive({ useHandCursor: true });
    buttonImage.on("pointerdown", () => {
      this.sound.play("button");
      buttonImage.setTexture("round_button_pressed");
    });
    buttonImage.on("pointerup", () => {
      buttonImage.setTexture("round_button");
    });

    return { container, buttonImage, iconImage };
  }

  // micro interactions code

  private canCheerBumpkin(receiverId: number) {
    const today = new Date().toISOString().split("T")[0];

    if (this.gameState.socialFarming.cheersGiven.date !== today) return true;

    return !this.gameState.socialFarming.cheersGiven.farms.includes(receiverId);
  }

  private updateInteractionTargetProximity() {
    if (!this.currentPlayer) return;

    // If we no longer have a valid menu/target, clear any stale references
    if (!this.activeInteractionMenu || !this.activeInteractionTarget) {
      this.activeInteractionMenu = undefined;
      this.activeInteractionTarget = undefined;
      return;
    }

    // If either the menu or the target bumpkin has been destroyed/despawned,
    // clear the state and avoid accessing a destroyed entity.
    if (
      !this.activeInteractionMenu.active ||
      !this.activeInteractionTarget.active
    ) {
      this.activeInteractionMenu = undefined;
      this.activeInteractionTarget = undefined;
      return;
    }

    const distance = Phaser.Math.Distance.BetweenPoints(
      this.currentPlayer as BumpkinContainer,
      this.activeInteractionTarget,
    );

    if (distance > 50) {
      this.activeInteractionMenu.destroy();
      this.activeInteractionTarget = undefined;
      this.activeInteractionMenu = undefined;
      return;
    }
  }

  private showInteractionMenu(
    player: PlayerModalPlayer,
    target: BumpkinContainer,
  ) {
    // Destroy any existing menu anywhere
    if (this.activeInteractionMenu && this.activeInteractionMenu.active) {
      this.activeInteractionMenu.destroy();
      this.activeInteractionTarget = undefined;
      this.activeInteractionMenu = undefined;
    }

    // If there is already a pending micro interaction from this target player
    // *towards* the current player, don't allow opening an interaction menu on
    // them. This keeps the flow focused on responding to the existing request.
    const currentFarmId = this.currentPlayer?.farmId;
    const targetFarmId = target.farmId;
    if (currentFarmId && targetFarmId) {
      const pendingForUs = this.receivedMicroInteractions.get(currentFarmId);
      if (pendingForUs && pendingForUs.senderId === targetFarmId) {
        return;
      }
    }

    // 2. Container positioned above the head, in *local* coordinates
    const menu = this.add.container(0, -20);
    menu.setName("interactionMenu");
    this.activeInteractionMenu = menu;
    this.activeInteractionTarget = target;

    const canCheer = target.farmId && this.canCheerBumpkin(target.farmId);

    const totalButtons = canCheer ? 3 : 2;
    const spacing = totalButtons === 3 ? 14 : 16; // distance between buttons (horizontal)
    const verticalSpacing = totalButtons === 3 ? 5 : 0;

    // Compute positions so:
    // - With 3 buttons: [-spacing, 0, +spacing]
    // - With 2 buttons: [-spacing/2, +spacing/2]
    let detailsX: number;
    let waveX: number;
    let cheerX: number | null = null;

    if (totalButtons === 3) {
      detailsX = -spacing;
      waveX = 0;
      cheerX = spacing;
    } else {
      detailsX = -spacing / 2;
      waveX = spacing / 2;
    }

    // Left button - "details"
    const { container: detailsBtnContainer, buttonImage: detailsBtn } =
      this.createRoundIconButton(detailsX, verticalSpacing, "player_small");
    detailsBtn.on("pointerup", () => {
      detailsBtn.setTexture("round_button");
      this.openPlayerProfile(player);
      const existing = target.getByName("interactionMenu") as
        | Phaser.GameObjects.Container
        | undefined;
      existing?.destroy();
    });

    // middle/right button - "wave"
    const { container: waveBtnContainer, buttonImage: waveBtn } =
      this.createRoundIconButton(waveX, 0, "hand_wave");

    waveBtn.on("pointerup", () => {
      this.requestMicroInteraction(target, "wave");
      const existing = target.getByName("interactionMenu") as
        | Phaser.GameObjects.Container
        | undefined;
      existing?.destroy();
    });

    // right button - "cheer"
    let cheerBtnContainer: Phaser.GameObjects.Container | undefined;
    if (canCheer) {
      const { container, buttonImage: cheerBtn } = this.createRoundIconButton(
        cheerX ?? spacing,
        verticalSpacing,
        "cheer",
      );
      cheerBtnContainer = container;

      cheerBtn.on("pointerup", () => {
        this.requestMicroInteraction(target, "cheer");
        const existing = target.getByName("interactionMenu") as
          | Phaser.GameObjects.Container
          | undefined;
        existing?.destroy();
      });
    }

    const menuButtons = [detailsBtnContainer, waveBtnContainer];
    if (cheerBtnContainer) {
      menuButtons.push(cheerBtnContainer);
    }

    menu.add(menuButtons);

    menu.y = 4; // roughly where their body is
    menu.alpha = 0;
    menu.scale = 0.6;

    target.add(menu);
    target.bringToTop(menu);

    // Tween up above the head
    this.tweens.add({
      targets: menu,
      y: -18, // final position above the head
      alpha: 1,
      scale: 1,
      duration: 220,
      ease: "Back.Out",
    });
  }
  protected requestMicroInteraction(
    target: BumpkinContainer,
    interaction: "wave" | "cheer",
  ) {
    const senderFarmId = this.currentPlayer?.farmId;
    const receiverFarmId = target.farmId;

    // Must have two valid and different farm ids
    if (!senderFarmId || !receiverFarmId) return;
    if (senderFarmId === receiverFarmId) {
      return;
    }

    // Only allow a single pending hello for a given receiver at a time
    if (this.receivedMicroInteractions.has(receiverFarmId)) {
      // Don't spam
      return;
    }

    if (this.outgoingMicroInteractions.has(receiverFarmId)) {
      // Don't spam
      return;
    }

    // Send micro interaction request to the server (sender -> receiver)
    this.sendMicroInteraction(interaction, senderFarmId, receiverFarmId);

    // Show a local, non-clickable indicator above the receiver so the sender
    // knows their interaction is pending.
    const outgoingIndicator = this.createOutgoingMicroInteractionIndicator(
      target,
      interaction,
    );

    // Auto cancel the event after 5 seconds if no acknowledgement is received
    const timeout = this.time.addEvent({
      delay: MICRO_INTERACTION_TIMEOUT_MS,
      callback: () => {
        if (!this.outgoingMicroInteractions.has(receiverFarmId)) {
          return;
        }

        this.sendMicroInteraction(
          `${interaction}_cancel`,
          senderFarmId,
          receiverFarmId,
        );
        this.clearOutgoingMicroInteractionRequest(receiverFarmId);
      },
    });

    this.outgoingMicroInteractions.set(receiverFarmId, {
      timeout,
      indicator: outgoingIndicator,
    });
    return;
  }

  private sendMicroInteraction(
    type:
      | "wave"
      | "wave_ack"
      | "wave_cancel"
      | "cheer"
      | "cheer_ack"
      | "cheer_cancel",
    senderId: number,
    receiverId: number,
  ) {
    this.mmoServer?.send(0, {
      microInteraction: {
        type,
        senderId,
        receiverId,
        sentAt: Date.now(),
        sceneId: this.options.name,
      },
    });
  }

  // Renders a local, non-clickable indicator above the receiver bumpkin
  // so the initiator can see that their micro interaction is pending.
  private createOutgoingMicroInteractionIndicator(
    target: BumpkinContainer,
    type: MicroInteractionAction,
  ) {
    const existingIndicator = target.getByName(
      "outgoingMicroInteractionIndicator",
    ) as Phaser.GameObjects.Container | undefined;
    existingIndicator?.destroy();

    const icon = type === "wave" ? "hand_wave" : "cheer";

    const indicator = this.add.container(0, -20);
    indicator.setName("outgoingMicroInteractionIndicator");

    const iconImage = this.add.image(0, 0, icon);
    iconImage.setDisplaySize(8, 8);
    indicator.add(iconImage);

    indicator.y = 4; // roughly where their body is
    indicator.alpha = 0.8;
    indicator.scale = 1;

    target.add(indicator);
    target.bringToTop(indicator);

    // Tween up above the head
    this.tweens.add({
      targets: indicator,
      y: -16, // final position above the head
      duration: 220,
      ease: "Back.Out",
    });

    this.tweens.add({
      targets: indicator,
      scale: 1.1,
      duration: 500,
      ease: "Linear",
      repeat: -1,
      yoyo: true,
    });

    return indicator;
  }

  // Renders a lightweight clickable indicator above the receiver bumpkin.
  private createMicroInteractionIndicator(
    target: BumpkinContainer,
    type: MicroInteractionAction,
    senderId: number,
    receiverId: number,
  ) {
    // Destroy any existing menu on this target
    const existingIndicator = target.getByName("microInteractionIndicator") as
      | Phaser.GameObjects.Container
      | undefined;
    existingIndicator?.destroy();

    const icon = type === "wave" ? "hand_wave" : "cheer";

    const indicator = this.add.container(0, -20);
    indicator.setName("microInteractionIndicator");

    const { container: indicatorBtnContainer, buttonImage: indicatorBtn } =
      this.createRoundIconButton(0, 0, icon);

    indicatorBtn.on("pointerup", () => {
      this.sendMicroInteraction(`${type}_ack`, senderId, receiverId);
      indicator.destroy();
    });

    indicator.add(indicatorBtnContainer);

    indicator.y = 4; // roughly where their body is
    indicator.alpha = 0;
    indicator.scale = 0.6;

    target.add(indicator);
    target.bringToTop(indicator);

    // Tween up above the head
    this.tweens.add({
      targets: indicator,
      y: -16, // final position above the head
      alpha: 1,
      scale: 1,
      duration: 220,
      ease: "Back.Out",
    });

    this.tweens.add({
      targets: indicator,
      scale: 0.9,
      delay: 220,
      duration: 500,
      ease: "Linear",
      repeat: -1,
      yoyo: true,
    });

    return { indicator };
  }

  // Handle the action coming from the server
  private handleMicroInteractionAction(action: MicroInteraction) {
    if (action.sceneId && action.sceneId !== this.options.name) return;
    if (action.sentAt && action.sentAt < Date.now() - 5000) return;

    const { receiverId, senderId } = action;

    const target = this.findBumpkinByFarmId(senderId);
    if (!target) return;

    const type = action.type.includes("ack")
      ? "acknowledged"
      : action.type.includes("cancel")
        ? "cancelled"
        : "action";

    switch (type) {
      case "action": {
        const isReceiver = this.currentPlayer?.farmId === receiverId;

        if (isReceiver) {
          // If we are the receiver and currently have an interaction menu open
          // (e.g. we were inspecting or initiating something ourselves), close it
          // so we can clearly see and respond to the incoming request.
          if (this.activeInteractionMenu) {
            this.activeInteractionMenu.destroy();
            this.activeInteractionMenu = undefined;
            this.activeInteractionTarget = undefined;
          }

          // Clear any stale pending interaction for this receiver before showing
          // the new one, so we always surface the latest request.
          const existing = this.receivedMicroInteractions.get(receiverId);
          if (existing?.indicator) {
            this.destroyMicroInteractionIndicator(existing.indicator);
          }
          if (existing) {
            this.receivedMicroInteractions.delete(receiverId);
          }

          const { indicator } = this.createMicroInteractionIndicator(
            target,
            action.type as MicroInteractionAction,
            senderId,
            receiverId,
          );

          this.receivedMicroInteractions.set(receiverId, {
            senderId,
            receiverId,
            type: action.type,
            indicator,
          });
        }

        break;
      }
      case "acknowledged": {
        if (this.currentPlayer?.farmId === senderId) {
          // Stop the initiator's local timeout
          this.clearOutgoingMicroInteractionRequest(receiverId);
        }

        if (this.currentPlayer?.farmId === receiverId) {
          const pending = this.receivedMicroInteractions.get(receiverId);
          // Only clear if this ack corresponds to the current pending sender.
          // Otherwise this is a stale ack from an older interaction.
          if (pending && pending.senderId === senderId) {
            this.receivedMicroInteractions.delete(receiverId);
            this.destroyMicroInteractionIndicator(pending.indicator);
          }
        }

        // Trigger interaction between the two bumpkins
        this.triggerInteraction(
          senderId,
          receiverId,
          action.type as MicroInteractionResponse,
        );
        break;
      }
      case "cancelled": {
        if (this.currentPlayer?.farmId !== receiverId) return;
        // Cancel sent from the sender after their timeout
        const pending = this.receivedMicroInteractions.get(receiverId);
        // Only cancel if the current pending request is from the cancelling sender.
        // This prevents a late cancel from wiping a newer pending request.
        if (!pending || pending.senderId !== senderId) return;

        this.cancelMicroInteraction(receiverId, "timeout");
        break;
      }
      default:
        break;
    }
  }

  private cancelMicroInteraction(
    receiverFarmId: number,
    reason: "timeout" | "despawn" | "initiatorLeft",
  ) {
    const interaction = this.receivedMicroInteractions.get(receiverFarmId);
    if (!interaction) return;

    this.receivedMicroInteractions.delete(receiverFarmId);
    this.destroyMicroInteractionIndicator(interaction.indicator);

    const sender = this.findBumpkinByFarmId(interaction.senderId);

    if (reason === "timeout") {
      sender?.speak(translate("microInteraction.maybe.later"));
    }
  }

  private destroyMicroInteractionIndicator(
    indicator?: Phaser.GameObjects.Container,
  ) {
    if (!indicator || !indicator.active) return;

    indicator.removeAll(true);
    indicator.destroy();
  }

  private triggerInteraction(
    senderId: number,
    receiverId: number,
    interaction: MicroInteractionResponse,
  ) {
    const sender = this.findBumpkinByFarmId(senderId);
    const receiver = this.findBumpkinByFarmId(receiverId);

    if (!sender || !receiver) return;

    this.faceReceiverTowardSender(receiver, sender);
    this.faceSenderTowardReceiver(sender, receiver);

    this.interact(sender, interaction);
    this.interact(receiver, interaction);

    if (
      this.currentPlayer &&
      (this.currentPlayer.farmId === senderId ||
        this.currentPlayer.farmId === receiverId)
    ) {
      switch (interaction) {
        case "wave_ack": {
          sender.speak(translate("microInteraction.great.to.see.you"));
          receiver.speak(translate("microInteraction.hey.there"));

          // Determine the other participant for wave tracking
          const currentFarmId = this.currentPlayer?.farmId;
          const otherFarmId =
            currentFarmId === senderId ? receiverId : senderId;

          let shouldShowSocialPointReaction = false;

          if (currentFarmId && otherFarmId) {
            // Mirror the bumpkinWave logic to determine whether this wave
            // will actually award a social point for the current player.
            const socialFarming = this.gameState.socialFarming;
            const today = new Date().toISOString().split("T")[0];

            const waves = socialFarming.waves;
            const isToday = waves?.date === today;
            const farmsToday = isToday ? (waves?.farms ?? []) : [];

            const hasAlreadyWavedThisPlayerToday =
              farmsToday.includes(otherFarmId);
            const hasReachedDailyWaveLimit = farmsToday.length >= 20;

            shouldShowSocialPointReaction =
              !hasAlreadyWavedThisPlayerToday && !hasReachedDailyWaveLimit;

            // Award social points via the game machine (subject to daily limits)
            this.gameService?.send({
              type: "bumpkin.wave",
              otherFarmId,
            });
          }

          // Visual feedback for a successful social interaction:
          // only show the Social Point reaction if this wave is expected
          // to actually grant a point to the current player.
          if (shouldShowSocialPointReaction) {
            setTimeout(() => {
              this.mmoServer?.send(0, {
                reaction: {
                  reaction: "Social Point",
                  quantity: 1,
                },
              });
              // Wait for the speech bubble to be gone
            }, 5000);
          }

          // Show tiara claim prompt to the sender when waving at a tiara-wearing player
          const senderIsCurrentPlayer = currentFarmId === senderId;
          const receiverHasTiara = receiver.clothing?.hat === "2026 Tiara";
          const wardrobe = this.getLatestWardrobe();
          const previousWardrobe = this.getLatestPreviousWardrobe();
          const alreadyHasTiara =
            !!wardrobe?.["2026 Tiara"] || !!previousWardrobe?.["2026 Tiara"];
          const isEventActive =
            BONUSES["2026-tiara-wave"].expiresAt &&
            BONUSES["2026-tiara-wave"].expiresAt > Date.now();

          if (
            isEventActive &&
            senderIsCurrentPlayer &&
            receiverHasTiara &&
            !alreadyHasTiara &&
            !waveModalManager.isOpen
          ) {
            const openTiaraModal = () => {
              // Double-check ownership and modal state at open time
              const latestWardrobe = this.getLatestWardrobe();
              const latestPreviousWardrobe = this.getLatestPreviousWardrobe();
              const ownsTiara =
                !!latestWardrobe?.["2026 Tiara"] ||
                !!latestPreviousWardrobe?.["2026 Tiara"];

              if (!ownsTiara && !waveModalManager.isOpen) {
                waveModalManager.open({
                  wavedAtClothing: receiver.clothing,
                });
              }
            };

            const sprite = sender.sprite;

            if (sprite) {
              // Prefer to wait until the current wave animation completes
              sprite.once(
                Phaser.Animations.Events.ANIMATION_COMPLETE,
                openTiaraModal,
              );
              // Safety net in case the event does not fire (e.g. missing animation)
              this.time.delayedCall(1200, openTiaraModal);
            } else {
              // Fallback timing if no sprite is available
              this.time.delayedCall(1200, openTiaraModal);
            }
          }

          break;
        }
        case "cheer_ack":
          sender.speak(translate("microInteraction.here.s.a.cheer.for.you"));
          setTimeout(() => {
            receiver.speak(translate("microInteraction.thanks"));
          }, 1000);
          if (this.currentPlayer?.farmId === receiverId) {
            setTimeout(() => {
              this.mmoServer?.send(0, {
                reaction: {
                  reaction: "Social Point",
                  quantity: 3,
                },
              });
              // Wait for the speech bubble to be gone
            }, 5000);
          }
          if (this.currentPlayer?.farmId === senderId) {
            this.gameService?.send("farm.cheered", {
              effect: {
                type: "farm.cheered",
                cheeredFarmId: receiverId,
              },
            });
            setTimeout(() => {
              this.mmoServer?.send(0, {
                reaction: {
                  reaction: "Social Point",
                  quantity: 3,
                },
              });
              // Wait for the speech bubble to be gone
            }, 6000);
          }
          break;
      }
    }
  }

  private faceReceiverTowardSender(
    receiver: BumpkinContainer,
    sender: BumpkinContainer,
  ) {
    if (!receiver || !sender) return;

    if (sender.x > receiver.x) {
      receiver.faceRight();
    } else if (sender.x < receiver.x) {
      receiver.faceLeft();
    }
  }

  private faceSenderTowardReceiver(
    sender: BumpkinContainer,
    receiver: BumpkinContainer,
  ) {
    if (!sender || !receiver) return;

    if (receiver.x > sender.x) {
      sender.faceRight();
    } else if (receiver.x < sender.x) {
      sender.faceLeft();
    }
  }

  private interact(
    entity: BumpkinContainer,
    interaction: MicroInteractionResponse,
  ) {
    switch (interaction) {
      case "wave_ack":
        entity.wave();
        break;
      case "cheer_ack":
        entity.cheer();
        break;
      default:
        return;
    }
  }

  private findBumpkinByFarmId(farmId?: number) {
    if (!farmId) return undefined;

    if (this.currentPlayer?.farmId === farmId) {
      return this.currentPlayer;
    }

    return Object.values(this.playerEntities).find(
      (entity) => entity.farmId === farmId,
    );
  }

  private cleanupMicroInteractionsForFarm(farmId?: number) {
    if (!farmId) return;

    // If this farm had a pending request *towards* us (they were the initiator),
    // clear the indicator so we don't keep showing an interaction from a player
    // that has already left the scene.
    const pendingFromDepartingFarm = Array.from(
      this.receivedMicroInteractions.values(),
    ).find((interaction) => interaction.senderId === farmId);

    if (pendingFromDepartingFarm) {
      this.cancelMicroInteraction(
        pendingFromDepartingFarm.receiverId,
        "initiatorLeft",
      );
    }

    this.clearOutgoingMicroInteractionRequest(farmId);
  }

  private clearOutgoingMicroInteractionRequest(receiverFarmId?: number) {
    if (!receiverFarmId) return;

    const state = this.outgoingMicroInteractions.get(receiverFarmId);
    if (!state) return;

    state.timeout.remove();
    if (state.indicator) {
      this.destroyMicroInteractionIndicator(state.indicator);
    }

    this.outgoingMicroInteractions.delete(receiverFarmId);
  }

  private roof: Phaser.Tilemaps.TilemapLayer | null = null;

  public initialiseMap() {
    this.map = this.make.tilemap({ key: this.options.name });

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
      this.mmoService?.send({
        type: "CONNECT",
        url: this.options.mmo.url,
        serverId: this.options.mmo.serverId,
      });
    }

    const initialiseReactions = (server: Room<PlazaRoomState>) => {
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

      const removeReactionListener = server.state.reactions.onAdd(
        (reaction) => {
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
        },
      );

      const removeActionListener = server.state.microInteractions?.onAdd(
        (action) => {
          this.handleMicroInteractionAction(action as MicroInteraction);
        },
      );

      this.events.on("shutdown", () => {
        removeMessageListener();
        removeReactionListener();
        removeActionListener?.();

        window.removeEventListener(AUDIO_MUTED_EVENT as any, this.onAudioMuted);
        this.input.off("pointerdown"); // clean up pointerdown event listener
      });
    };

    const server = this.mmoServer;
    if (server) initialiseReactions(server);

    // If the underlying server changes, we need to re-initialise the reactions
    this.registry.events.on(
      "changedata-mmoServer",
      (
        _parent: Phaser.Data.DataManager,
        server: Room<PlazaRoomState> | undefined,
      ) => {
        if (!server) return;
        initialiseReactions(server);
      },
    );
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

  private getLatestWardrobe() {
    const snapshot = this.gameService?.getSnapshot();
    return snapshot?.context.state.wardrobe ?? this.gameState.wardrobe;
  }

  private getLatestPreviousWardrobe() {
    const snapshot = this.gameService?.getSnapshot();
    return (
      snapshot?.context.state.previousWardrobe ??
      this.gameState.previousWardrobe
    );
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
      onClick: !isCurrentPlayer ? defaultClick : undefined,
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
      // If the interaction menu is currently open for this entity, close it and
      // clear the tracked target to avoid orphaned UI or stale references.
      if (this.activeInteractionTarget === entity) {
        if (this.activeInteractionMenu?.active) {
          this.activeInteractionMenu.destroy();
        }
        this.activeInteractionMenu = undefined;
        this.activeInteractionTarget = undefined;
      }

      this.cleanupMicroInteractionsForFarm(entity.farmId);

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
    this.updatePets();
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

    const isMoving =
      this.movementAngle !== undefined && this.walkingSpeed !== 0;
    const isInteracting = this.currentPlayer?.isInteracting();

    // change player direction if angle is changed from left to right or vise versa
    if (
      this.movementAngle !== undefined &&
      Math.abs(this.movementAngle) !== 90 &&
      isMoving &&
      !isInteracting
    ) {
      this.isFacingLeft = Math.abs(this.movementAngle) > 90;
      this.isFacingLeft
        ? this.currentPlayer.faceLeft()
        : this.currentPlayer.faceRight();
    }

    // set player velocity
    const currentPlayerBody = this.currentPlayer
      .body as Phaser.Physics.Arcade.Body;
    if (isInteracting) {
      currentPlayerBody.setVelocity(0, 0);
    } else if (this.movementAngle !== undefined) {
      currentPlayerBody.setVelocity(
        this.walkingSpeed * Math.cos((this.movementAngle * Math.PI) / 180),
        this.walkingSpeed * Math.sin((this.movementAngle * Math.PI) / 180),
      );
    } else {
      currentPlayerBody.setVelocity(0, 0);
    }

    this.sendPositionToServer();
    this.updateInteractionTargetProximity();

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
      this.walkAudioController.handleWalkSound(isMoving && !isInteracting);
    } else {
      // eslint-disable-next-line no-console
      console.error("walkAudioController is undefined");
    }

    if (!isInteracting) {
      if (isMoving) {
        this.currentPlayer.walk();
      } else {
        this.currentPlayer.idle();
      }
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

  public addPet(
    sessionId: string,
    petId: number,
    petType: string,
    x: number,
    y: number,
  ) {
    const petContainer = new PetContainer(
      this,
      x,
      y,
      petId,
      petType as PetNFTType,
    );
    this.pets[sessionId] = petContainer;
  }

  public updatePets() {
    const server = this.mmoServer;
    if (!server) return;

    Object.keys(this.pets).forEach((sessionId) => {
      const petsMap = server.state.pets;
      if (!petsMap) return;

      const hasLeft =
        !petsMap.get(sessionId) ||
        petsMap.get(sessionId)?.sceneId !== this.scene.key;

      const isInactive = !this.pets[sessionId]?.active;

      if (hasLeft || isInactive) {
        this.pets[sessionId]?.destroy();
        delete this.pets[sessionId];
      }
    });

    server.state.pets?.forEach((pet, sessionId) => {
      if (pet.sceneId !== this.scene.key) return;

      const petContainer = this.pets[sessionId];
      if (!petContainer) {
        this.addPet(sessionId, pet.id, pet.type, pet.x, pet.y);
        return;
      }

      if (petContainer) {
        const distance = Phaser.Math.Distance.BetweenPoints(petContainer, pet);

        if (distance > 1) {
          if ((pet.x || 0) > petContainer.x) {
            petContainer.faceRight();
          } else if ((pet.x || 0) < petContainer.x) {
            petContainer.faceLeft();
          }
          petContainer.walk();
        } else {
          petContainer.idle();
        }

        petContainer.x = Phaser.Math.Linear(petContainer.x, pet.x, 0.04);
        petContainer.y = Phaser.Math.Linear(petContainer.y, pet.y, 0.04);
        // Render the pet behind its owner
        const ownerEntity = this.playerEntities[sessionId];
        const ownerPlayer = server.state.players.get(sessionId);
        const ownerDepth = ownerEntity
          ? Math.floor(ownerEntity.y)
          : ownerPlayer
            ? Math.floor(ownerPlayer.y ?? petContainer.y)
            : petContainer.y;
        petContainer.setDepth(Math.max(0, ownerDepth - 2));
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

      const isInteracting = entity.isInteracting();

      if (!isInteracting) {
        const movingHorizontally = Math.abs(player.x - entity.x) > 0.5;
        if (movingHorizontally) {
          if (player.x > entity.x) {
            entity.faceRight();
          } else if (player.x < entity.x) {
            entity.faceLeft();
          }
        }
      }

      const distance = Phaser.Math.Distance.BetweenPoints(player, entity);

      if (!isInteracting) {
        if (distance < 2) {
          entity.idle();
        } else {
          entity.walk();
        }
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
          this.gameService.getSnapshot().context.state.pumpkinPlaza.streamerHat
            ?.openedAt ?? 0;

        if (
          now - this.lastModalOpenTime > STREAM_REWARD_COOLDOWN &&
          !rewardModalManager.isOpen &&
          distance < 75
        ) {
          rewardModalManager.open({
            farmId: player.farmId,
            clothing: player.clothing,
            experience: player.experience,
            username: player.username,
            faction: player.faction,
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

      let spawn = this.options.player.spawn;
      if (SPAWNS()[warpTo]) {
        spawn = SPAWNS()[warpTo][this.sceneId] ?? SPAWNS()[warpTo].default;
      }
      // This will cause a loop
      // this.registry.get("navigate")(`/world/${warpTo}`);

      // this.mmoService?.state.context.server?.send(0, { sceneId: warpTo });
      this.mmoService?.send("SWITCH_SCENE", {
        sceneId: warpTo,
        playerCoordinates: {
          x: spawn.x,
          y: spawn.y,
        },
      });
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
    const now = Date.now();
    const gameState = this.gameState;
    const orders = gameState.delivery?.orders ?? [];
    npcs.forEach((bumpkin) => {
      const order = orders.find(
        (o: Order) =>
          o.from === bumpkin.npc && now >= o.readyAt && !o.completedAt,
      );
      const showDeliveryIcon =
        !!order && hasOrderRequirements({ order, state: gameState });

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
        showDeliveryIcon,
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

  private refreshDeliveryIcons = () => {
    for (const [npcName, container] of Object.entries(this.npcs)) {
      if (npcName && container) {
        container.updateDeliveryIconVisibility(npcName as NPCName);
      }
    }
  };

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
