import mapJson from "assets/map/emptyMap2.json";
// import tilesetconfig from "assets/map/tileset.json";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "./Core/BaseScene";
import { MachineInterpreter } from "./lib/Machine";
import { EventObject } from "xstate";
import { isTouchDevice } from "features/world/lib/device";
import { CANNON_CONFIG, PORTAL_NAME, WALKING_SPEED } from "./Constants";
import { EventBus } from "./lib/EventBus";
import { Giant_Skeleton } from "./containers/Giant_Skeleton";
import { Sniper_Skeleton } from "./containers/Sniper_Skeleton";
import { Cannon } from "./containers/Cannon";
import { Position, Side } from "./Types";

// export const NPCS: NPCBumpkin[] = [
//   {
//     x: 380,
//     y: 400,
//     // View NPCModals.tsx for implementation of pop up modal
//     npc: "portaller",
//   },
// ];

export class Scene extends BaseScene {
  private backgroundMusic!: Phaser.Sound.BaseSound;
  private updateCallbacks!: { key: string; fn: () => void }[];
  private isCannonEnabled: Record<Side, boolean> = { left: false, right: false };
  private activeCannonPosition: Position = { x: 0, y: 0 };
  private isUsingCannon = false;
  private activeCannondSide: Side | null = null;

  sceneId: SceneId = PORTAL_NAME;

  constructor() {
    super({
      name: PORTAL_NAME,
      map: {
        json: mapJson,
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  private get isGameReady() {
    return this.portalService?.state.matches("ready") === true;
  }

  private get isGamePlaying() {
    return this.portalService?.state.matches("playing") === true;
  }

  public get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }

  addToUpdate(key: string, fn: () => void) {
    this.updateCallbacks.push({ key, fn });
  }

  removeFromUpdate(key: string) {
    this.updateCallbacks = this.updateCallbacks.filter((cb) => cb.key !== key);
  }

  preload() {
    super.preload();

    // Minigame assets
    this.load.spritesheet("giant_skeleton_idle", "/world/portal/images/skeleton_hurt.webp", {
      frameWidth: 23,
      frameHeight: 26
    })
    this.load.spritesheet("sniper_skeleton_idle", "/world/portal/images/skeleton_attack.webp", {
      frameWidth: 23,
      frameHeight: 24
    })
    this.load.spritesheet("sniper_skeleton_carrot_splat", "/world/portal/images/carrot_splat.webp", {
      frameWidth: 18,
      frameHeight: 16
    })
    this.load.spritesheet("sniper_skeleton_tomato_splat", "/world/portal/images/tomato_splat.webp", {
      frameWidth: 18,
      frameHeight: 16
    })
    this.load.spritesheet("sniper_skeleton_cabbage_splat", "/world/portal/images/cabbage_splat.webp", {
      frameWidth: 18,
      frameHeight: 15
    })
    this.load.image("giant_skeleton_barrel", "/world/portal/images/Wooden_Barrel.webp")
    this.load.image("sniper_skeleton_carrot", "/world/portal/images/carrot.png")
    this.load.image("sniper_skeleton_tomato", "/world/portal/images/tomato.webp")
    this.load.image("sniper_skeleton_cabbage", "/world/portal/images/cabbage.png")

    // Cannon
    this.load.image("cannon", "/world/portal/images/tree.webp")

    // Music
    // Background
    this.load.audio(
      "backgroundMusic",
      "/world/portal/music/background-music.mp3",
    );
  }

  async create() {
    this.map = this.make.tilemap({
      key: PORTAL_NAME,
    });
    super.create();

    // Reset listeners
    EventBus.removeAllListeners();

    // Initialise
    this.initialiseProperties();
    this.initializeControls();
    this.initialiseEvents();
    this.initialiseFontFamily();

    // Enemies
    this.createGiantSkeleton();
    this.createSniperSkeleton();

    // Cannons
    this.createCannons();

    // Config
    this.input.addPointer(3);
    this.physics.world.drawDebug = false;

    // Background music
    // this.backgroundMusic = this.sound.add("backgroundMusic", {
    //   loop: true,
    //   volume: 0.1,
    // });
    // this.backgroundMusic.play();
  }

  update() {
    if (this.isGamePlaying) {
      // The game has started
      for (const cb of this.updateCallbacks) {
        cb.fn();
      }
      this.controls();
      this.loadBumpkinAnimations();
    } else if (this.isGameReady) {
      this.portalService?.send("START");
      this.velocity = WALKING_SPEED;
    }

    super.update();
  }

  private initialiseProperties() {
    this.velocity = 0;
    this.updateCallbacks = [];
  }

  private initializeControls() {
    if (isTouchDevice()) {
      // const baseX = this.cameras.main.width / 2;
      // const baseY = this.cameras.main.height / 2;
      // const offsetX = window.innerWidth / (2 * this.zoom) - TILE_SIZE;
      // const offsetY = window.innerHeight / (2 * this.zoom) - TILE_SIZE;

      // // Joystick
      // this.joystick = new VirtualJoyStick(this, {
      //   x: baseX - offsetX,
      //   y: baseY + offsetY,
      //   radius: 15,
      //   base: this.add.circle(0, 0, 20, 0x000000, 0.5).setDepth(1000000000),
      //   thumb: this.add.circle(0, 0, 8, 0xffffff, 0.5).setDepth(1000000000),
      //   forceMin: 2,
      // });

      // // Use tool button
      // const useToolButton = this.add
      //   .image(
      //     baseX + offsetX - TILE_SIZE / 6,
      //     baseY + offsetY,
      //     "use_tool_button",
      //   )
      //   .setInteractive()
      //   .setScrollFactor(0)
      //   .setScale(1.5)
      //   .setAlpha(0.8)
      //   .setDepth(1000000000000)
      //   .on("pointerdown", () => {
      //     if (this.isUseToolButtonPressed) return;
      //     this.isUseToolButtonPressed = true;
      //     this.mobileKeys.useTool = true;
      //     useToolButton.setTexture("use_tool_button_pressed");
      //   })
      //   .on("pointerup", () => {
      //     this.isUseToolButtonPressed = false;
      //     useToolButton.setTexture("use_tool_button");
      //   })
      //   .on("pointerout", () => {
      //     this.isUseToolButtonPressed = false;
      //     useToolButton.setTexture("use_tool_button");
      //   });

      // // Change tool button
      // const changeToolButton = this.add
      //   .image(
      //     baseX + offsetX + TILE_SIZE / 3,
      //     baseY + offsetY - TILE_SIZE + TILE_SIZE / 8,
      //     "change_tool_button",
      //   )
      //   .setInteractive()
      //   .setScrollFactor(0)
      //   .setScale(0.75)
      //   .setAlpha(0.8)
      //   .setDepth(1000000000000)
      //   .on("pointerdown", () => {
      //     if (this.isChangeToolButtonPressed) return;
      //     this.isChangeToolButtonPressed = true;
      //     this.mobileKeys.changeTool = true;
      //     changeToolButton.setTexture("change_tool_button_pressed");
      //   })
      //   .on("pointerup", () => {
      //     this.isChangeToolButtonPressed = false;
      //     changeToolButton.setTexture("change_tool_button");
      //   })
      //   .on("pointerout", () => {
      //     this.isChangeToolButtonPressed = false;
      //     changeToolButton.setTexture("change_tool_button");
      //   });

      this.portalService?.send("SET_JOYSTICK_ACTIVE", {
        isJoystickActive: true,
      });
    }
  }

  private initialiseEvents() {
    EventBus.on("activate-cannon-button",
      (data: { isActivated: boolean, side: Side, position: Position }) => {
        this.isCannonEnabled[data.side] = data.isActivated;
        if (data.isActivated) {
          this.activeCannonPosition = data.position;
          this.activeCannondSide = data.side;
        } else if (this.activeCannondSide === data.side) {
          // player walked away while not using — clear active side
          if (!this.isUsingCannon) this.activeCannondSide = null;
        }
      });

    // reload scene when player hit retry
    const onRetry = (event: EventObject) => {
      if (event.type === "RETRY") {
        this.scene.restart();
      }
    };
    this.portalService?.onEvent(onRetry);

    // Restart scene when player hit start
    const onContinue = (event: EventObject) => {
      if (event.type === "CONTINUE") {
        this.scene.restart();
      }
    };
    this.portalService?.onEvent(onContinue);

    // Restart scene when player hit start training
    const onContinueTraining = (event: EventObject) => {
      if (event.type === "CONTINUE_TRAINING") {
        this.scene.restart();
      }
    };
    this.portalService?.onEvent(onContinueTraining);
  }

  private initialiseFontFamily() {
    this.add
      .text(0, 0, ".", {
        fontFamily: "Teeny",
        fontSize: "1px",
        color: "#000000",
      })
      .setAlpha(0);
  }

  private loadBumpkinAnimations() {
    if (!this.currentPlayer) return;
    if (!this.cursorKeys) return;

    const animation = this.isMoving && !this.isCannonEnabled
      ? "walk"
      : "idle";

    this.currentPlayer[animation]?.();
  }

  private controls() {
    if (!this.cursorKeys) return;

    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.e) &&
      (this.isCannonEnabled.left || this.isCannonEnabled.right)) {
      if (!this.isUsingCannon) {
        this.currentPlayer?.setX(this.activeCannonPosition.x);
        this.currentPlayer?.setY(this.activeCannonPosition.y + 20);
        this.velocity = 0;
        this.isUsingCannon = true;

        if (this.activeCannondSide) {
          EventBus.emit("cannon-aim-start", { side: this.activeCannondSide });
        }
      } else {
        this.velocity = WALKING_SPEED;
        this.isUsingCannon = false;

        if (this.activeCannondSide) {
          EventBus.emit("cannon-aim-stop", { side: this.activeCannondSide });
        }
      }
    }
  }

  private createGiantSkeleton() {
    const { x, y } = { x: 230, y: 240 }
    const giantCardboard = new Giant_Skeleton({
      x,
      y,
      scene: this,
      player: this.currentPlayer
    });
  }

  private createSniperSkeleton() {
    const { x, y } = { x: 250, y: 260 }
    const sniperSkeleton = new Sniper_Skeleton({
      x,
      y,
      scene: this,
      player: this.currentPlayer
    });
  }

  private createCannons() {
    CANNON_CONFIG.forEach(({ x, y, side }) => {
      new Cannon({
        x,
        y,
        scene: this,
        side,
        player: this.currentPlayer
      });
    });
  }
}
