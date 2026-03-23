import mapJson from "assets/map/emptyMap2.json";
// import tilesetconfig from "assets/map/tileset.json";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "./Core/BaseScene";
import { MachineInterpreter } from "./lib/Machine";
import { EventObject } from "xstate";
import { isTouchDevice } from "features/world/lib/device";
import {
  PORTAL_NAME,
  WALKING_SPEED,
  BLAST_SKELETON_POSITIONS,
  MENACE_SKELETON_POSITIONS,
  CANNON_CONFIG,
  LUMBER_CONFIG,
  DRIP_WALKER_POSITIONS,
  REFEREE_POSITION,
  RICE_BUN_POSITIONS,
  RICE_BUN_SPAWN_INTERVAL,
  SIMULATED_LAG_DURATION,
  POWER_UNLOCK_THRESHOLDS,
  CHEST_SPAWN_INTERVAL,
  HONEY_SPAWN_POSITION,
} from "./Constants";
import { Side, Position, Enemy } from "./Types";
import { EventBus } from "./lib/EventBus";
import { Giant_Skeleton } from "./containers/Giant_Skeleton";
import { Sniper_Skeleton } from "./containers/Sniper_Skeleton";
import { Menace_Skeleton } from "./containers/Menace_Skeleton";
import { Blast_Skeleton } from "./containers/Blast_Skeleton";
import { Cannon } from "./containers/Cannon";
import { createAnimation } from "./lib/Utils";
import { Lumber } from "./containers/Lumber";
import { DripWalker } from "./containers/DripWalker";
import { Referee } from "./containers/Referee";
import { RiceBun } from "./containers/RiceBun";
import { Honey } from "./containers/Honey";
import { Chest } from "./containers/Chest";
import { LineGlitch } from "./containers/LineGlitch";

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
  private isCannonEnabled: Record<Side, boolean> = {
    left: false,
    right: false,
  };
  private activeCannonPosition: Position = { x: 0, y: 0 };
  private isUsingCannon = false;
  private activeCannondSide: Side | null = null;
  private menaceSkeleton: Menace_Skeleton[] = [];
  private blastSkeleton: Blast_Skeleton[] = [];
  public allEnemies: Enemy[] = [];
  private riceBuns: RiceBun[] = [];
  private honey?: Honey;
  public chests: Chest[] = [];
  private glitch!: LineGlitch;

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

  private get riceBunsCollected() {
    return this.portalService?.state.context.riceBunsCollected ?? 0;
  }

  private get isAppleShotUnlocked() {
    return this.riceBunsCollected >= POWER_UNLOCK_THRESHOLDS.CANNON;
  }

  public get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }

  private restartGameScene = () => {
    if (!this.scene.manager || this.sys.isActive() === false) return;
    this.scene.restart();
  };

  private onStart = (event: EventObject) => {
    if (!this.sys || !this.sys.isActive() || !this.sys.displayList) return;
    if (event.type === "START") {
      this.initializeCreates();
    }
  };

  private onRetry = (event: EventObject) => {
    if (!this.sys || !this.sys.isActive() || !this.sys.displayList) return;
    if (event.type === "RETRY") {
      this.restartGameScene();
    }
  };

  private onContinue = (event: EventObject) => {
    if (!this.sys || !this.sys.isActive() || !this.sys.displayList) return;
    if (event.type === "CONTINUE") {
      this.restartGameScene();
    }
  };

  private onContinueTraining = (event: EventObject) => {
    if (!this.sys || !this.sys.isActive() || !this.sys.displayList) return;
    if (event.type === "CONTINUE_TRAINING") {
      this.restartGameScene();
    }
  };

  addToUpdate(key: string, fn: () => void) {
    this.updateCallbacks.push({ key, fn });
  }

  removeFromUpdate(key: string) {
    this.updateCallbacks = this.updateCallbacks.filter((cb) => cb.key !== key);
  }

  preload() {
    super.preload();

    // Minigame assets
    this.load.spritesheet(
      "giant_idle",
      "/world/portal/images/Giant_Cardboard_Skeleton_Idle.webp",
      {
        frameWidth: 40,
        frameHeight: 35,
      },
    );
    this.load.spritesheet(
      "giant_attack",
      "/world/portal/images/Giant_Cardboard_Skeleton_Attack.webp",
      {
        frameWidth: 40,
        frameHeight: 35,
      },
    );
    this.load.spritesheet(
      "giant_death",
      "/world/portal/images/Giant_Cardboard_Skeleton_Death.webp",
      {
        frameWidth: 45,
        frameHeight: 38,
      },
    );
    this.load.spritesheet(
      "sniper_skeleton_idle",
      "/world/portal/images/skeleton_attack.webp",
      {
        frameWidth: 23,
        frameHeight: 24,
      },
    );
    this.load.spritesheet(
      "sniper_skeleton_attack",
      "/world/portal/images/skeleton_attack.webp",
      {
        frameWidth: 23,
        frameHeight: 24,
      },
    );
    this.load.spritesheet(
      "sniper_skeleton_move",
      "/world/portal/images/skeleton_hurt.webp",
      {
        frameWidth: 23,
        frameHeight: 26,
      },
    );
    this.load.spritesheet(
      "sniper_skeleton_death",
      "/world/portal/images/skeleton_death.webp",
      {
        frameWidth: 29,
        frameHeight: 29,
      },
    );
    this.load.spritesheet(
      "blast_skeleton_emerge",
      "/world/portal/images/blast_skeleton_emerge.webp",
      {
        frameWidth: 23,
        frameHeight: 24,
      },
    );
    this.load.spritesheet(
      "blast_skeleton_walk",
      "/world/portal/images/blast_skeleton_walk.webp",
      {
        frameWidth: 23,
        frameHeight: 21,
      },
    );
    this.load.spritesheet(
      "sniper_idle",
      "/world/portal/images/sniper_skeleton_idle.webp",
      {
        frameWidth: 24,
        frameHeight: 24,
      },
    );
    this.load.spritesheet(
      "sniper_attack",
      "/world/portal/images/sniper_skeleton_attack.webp",
      {
        frameWidth: 24,
        frameHeight: 24,
      },
    );
    // Vege Splats
    this.load.spritesheet(
      "sniper_skeleton_carrot_splat",
      "/world/portal/images/carrot_splat.webp",
      {
        frameWidth: 20,
        frameHeight: 20,
      },
    );
    this.load.spritesheet(
      "sniper_skeleton_tomato_splat",
      "/world/portal/images/tomato_splat.webp",
      {
        frameWidth: 18,
        frameHeight: 16,
      },
    );
    this.load.spritesheet(
      "sniper_skeleton_cabbage_splat",
      "/world/portal/images/cabbage_splat.webp",
      {
        frameWidth: 27,
        frameHeight: 19,
      },
    );
    this.load.spritesheet(
      "sniper_skeleton_potato_splat",
      "/world/portal/images/potato_splat.webp",
      {
        frameWidth: 26,
        frameHeight: 26,
      },
    );
    this.load.spritesheet(
      "sniper_tomato_splatter",
      "/world/portal/images/tomato_splatter.webp",
      {
        frameWidth: 17,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      "blast_skeleton_tomato_screenSplat",
      "/world/portal/images/tomato_screenSplat.webp",
      {
        frameWidth: 160,
        frameHeight: 160,
      },
    );
    this.load.spritesheet(
      "blast_skeleton_tomato_rolling",
      "/world/portal/images/tomato_rolling.webp",
      {
        frameWidth: 160,
        frameHeight: 160,
      },
    );
    this.load.spritesheet(
      "waves_up",
      "/world/portal/images/waves_tile_up.webp",
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      "waves_center",
      "/world/portal/images/waves_tile_center.webp",
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      "waves_down",
      "/world/portal/images/waves_tile_down.webp",
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.image("giant_barrel", "/world/portal/images/Wooden_Barrel.webp");
    this.load.image(
      "sniper_skeleton_carrot",
      "/world/portal/images/carrot.png",
    );
    this.load.image(
      "sniper_skeleton_tomato",
      "/world/portal/images/tomato.webp",
    );
    this.load.image(
      "sniper_tomato",
      "/world/portal/images/tomato.webp",
    );
    this.load.image(
      "blast_skeleton_tomato",
      "/world/portal/images/tomato.webp",
    );
    this.load.image(
      "sniper_skeleton_cabbage",
      "/world/portal/images/cabbage.png",
    );
    this.load.image(
      "sniper_skeleton_potato",
      "/world/portal/images/potato.png",
    );
    this.load.image("wood", "/world/portal/images/wood.png");
    this.load.image("lumber", "/world/portal/images/lumber.png");
    this.load.spritesheet(
      "basket",
      "/world/portal/images/basket.png",
      {
        frameWidth: 15,
        frameHeight: 20,
      },
    );
    this.load.image("puddle", "/world/portal/images/puddle.png");
    this.load.image("honey", "/world/portal/images/honey_icon.png");
    this.load.spritesheet(
      "honey_screenSplat",
      "/world/portal/images/honey_screenSplat.png",
      {
        frameWidth: 160,
        frameHeight: 160,
      },
    );
    this.load.image("chest", "/world/portal/images/chest.png");
    this.load.spritesheet(
      "open_chest",
      "/world/portal/images/open_chest.webp",
      {
        frameWidth: 22,
        frameHeight: 25,
      },
    );
    this.load.image("health_full", "/world/portal/images/health_bar_full.webp");
    this.load.image("health_half", "/world/portal/images/health_bar_half.webp");
    this.load.image("health_low", "/world/portal/images/health_bar_low.webp")

    // Food
    this.load.image("rice_bun", "/world/portal/images/rice_bun.png");
    this.load.image("orange", "/world/portal/images/orange.png");
    this.load.image("apple", "/world/portal/images/apple.png");
    this.load.image("cabbage", "/world/portal/images/cabbage.png");
    this.load.image("potato", "/world/portal/images/potato.png");
    this.load.image("banana", "/world/portal/images/banana.png");
    this.load.image("sunflower", "/world/portal/images/sunflower.png");

    this.load.spritesheet(
      "cabbage_splat",
      "/world/portal/images/cabbage_splat.webp",
      {
        frameWidth: 27,
        frameHeight: 19,
      },
    );

    // Progress Bar
    this.load.image("progress_bar_1", "/world/portal/images/progress_bar_1.png");
    this.load.image("progress_bar_2", "/world/portal/images/progress_bar_2.png");

    // Cannon
    this.load.image("tree", "/world/portal/images/tree.webp");
    this.load.image("rock_1", "/world/portal/images/rock_1.webp");
    this.load.image("rock_2", "/world/portal/images/rock_2.webp");
    this.load.image("flower", "/world/portal/images/flower.webp");
    this.load.image("bush", "/world/portal/images/bush.webp");
    this.load.image("empty", "/world/portal/images/empty.png");
    this.load.spritesheet(
      "spawn", "/world/portal/images/spawn.png",
      {
        frameWidth: 24,
        frameHeight: 24
      }
    );

    // Player cannon
    this.load.spritesheet(
      "player_cannon_shoot", "/world/portal/images/cannon_shoot.png",
      {
        frameWidth: 21,
        frameHeight: 29
      }
    );

    // Referee
    this.load.spritesheet(
      "referee", "/world/portal/images/referee.png",
      {
        frameWidth: 22,
        frameHeight: 25
      }
    );
    this.load.spritesheet(
      "referee_yellow_card", "/world/portal/images/referee_yellow_card.png",
      {
        frameWidth: 25,
        frameHeight: 26
      }
    );

    // SFX
    this.load.audio("spawn", "/world/portal/SFX/spawn.wav");
    this.load.audio("death", "/world/portal/SFX/death.mp3");
    this.load.audio("splat", "/world/portal/SFX/splat.mp3");
    this.load.audio("blast_emerge", "/world/portal/SFX/blast_emerge.wav");
    this.load.audio("blast_splat", "/world/portal/SFX/blast_splat.wav");
    this.load.audio("sniper_spawn", "/world/portal/SFX/sniper.wav");
    this.load.audio("giant_spawn", "/world/portal/SFX/giant.wav");
    this.load.audio("barrel", "/world/portal/SFX/barrel.mp3");
    this.load.audio("giant_death", "/world/portal/SFX/giant_death.wav");
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

    // Create background elements
    this.createOcean();
    this.createShips();
    this.createLumbers();

    // Config
    this.input.addPointer(3);
    this.physics.world.drawDebug = true;

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
      this.resetVelocity();
    }

    super.update();
  }

  private initialiseProperties() {
    this.velocity = 0;
    this.updateCallbacks = [];
    this.allEnemies = [];
    this.riceBuns = [];
  }

  private initializeCreates() {
    this.createGlitch();
    this.createEnemies();
    this.createCannons();
    this.createReferee();
    this.createRiceBuns();
    this.createHoney();
    this.createChest();
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
    EventBus.on(
      "activate-cannon-button",
      (data: { isActivated: boolean; side: Side; position: Position }) => {
        this.isCannonEnabled[data.side] = data.isActivated;
        if (data.isActivated) {
          this.activeCannonPosition = data.position;
          this.activeCannondSide = data.side;
        } else if (this.activeCannondSide === data.side) {
          // player walked away while not using — clear active side
          if (!this.isUsingCannon) this.activeCannondSide = null;
        }
      },
    );

    EventBus.on("cannon-dismount", (data: { side: Side }) => {
      if (this.isUsingCannon && this.activeCannondSide === data.side) {
        this.resetVelocity();
        this.isUsingCannon = false;
        EventBus.emit("cannon-aim-stop", { side: this.activeCannondSide });
      }
    });

    EventBus.on("simulate-lag", () => {
      const start = Date.now();
      const interval = setInterval(() => {
        if (Date.now() - start > SIMULATED_LAG_DURATION || this.scene.isActive() === false) {
          clearInterval(interval);
          this.scene.resume();
          this.portalService?.send("SIMULATE_ERROR", { hasError: true });
          return;
        }
        this.scene.pause();
        setTimeout(() => {
          this.scene.resume();
        }, 100);
      }, 150);
    });

    EventBus.on("throw-honey", () => {
      this.honey?.throw();
    });

    const portalService = this.portalService;
    if (!portalService) return;

    const mainEvents = [
      this.onStart,
      this.onRetry,
      this.onContinue,
      this.onContinueTraining,
    ];

    const resetMainEvents = () => {
      mainEvents.forEach((event) => {
        portalService.off(event);
      });
    };
    resetMainEvents();

    mainEvents.forEach((event) => {
      portalService.onEvent(event);
    });

    this.events.once("shutdown", () => {
      resetMainEvents();
    });
    this.events.once("destroy", () => {
      resetMainEvents();
    });
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
    if (!this.currentPlayer || this.currentPlayer.isHurting) return;
    if (!this.cursorKeys) return;

    const animation = this.isMoving && !this.isCannonEnabled
      ? "carryNone"
      : "carryNoneIdle";

    this.currentPlayer[animation]?.();
  }

  private controls() {
    if (!this.cursorKeys || this.currentPlayer?.isHurting) return;
    const spaceKey = this.cursorKeys.space;

    if (this.isUsingCannon) {
      this.currentPlayer?.resetShootCharge();
    } else if (this.isAppleShotUnlocked) {
      if (Phaser.Input.Keyboard.JustDown(spaceKey) && this.currentPlayer?.canShoot()) {
        this.currentPlayer.startShootCharge();
      }

      if (spaceKey.isDown) {
        this.currentPlayer?.updateShootCharge(this.allEnemies);
      }

      if (Phaser.Input.Keyboard.JustUp(spaceKey)) {
        if (this.currentPlayer?.isShootCharging()) {
          this.currentPlayer?.shoot(this.allEnemies);
        }
        this.currentPlayer?.resetShootCharge();
      }
    } else if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
      this.currentPlayer?.shoot(this.allEnemies);
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.e!) &&
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
        this.resetVelocity();
        this.isUsingCannon = false;

        if (this.activeCannondSide) {
          EventBus.emit("cannon-aim-stop", { side: this.activeCannondSide });
        }
      }
    }
  }

  private resetVelocity() {
    this.velocity = WALKING_SPEED;
  }

  private createEnemies() {
    this.createGiantSkeleton();
    this.createSniperSkeleton();
    this.createMenaceSkeleton();
    this.createBlastSkeleton();
    this.createDripWalkers();
  }

  private createGlitch(delay: number = 4000) {
    this.glitch = new LineGlitch(this, {
      lineCount: 60,
      maxOffset: 100
    })
    this.time.delayedCall(delay, () => {
      this.glitch.stop();
      this.glitch.destroy();
    });
  }

  private createGiantSkeleton() {
    const { x, y } = { x: 230, y: 100 };
    const giantCardboard = new Giant_Skeleton({
      x,
      y,
      scene: this,
      player: this.currentPlayer,
    });
    this.allEnemies.push(giantCardboard);
  }

  private createSniperSkeleton() {
    const { x, y } = { x: 250, y: 20 };
    const sniperSkeleton = new Sniper_Skeleton({
      x,
      y,
      scene: this,
      player: this.currentPlayer,
    });
    this.allEnemies.push(sniperSkeleton);
  }

  private createMenaceSkeleton() {
    this.menaceSkeleton = MENACE_SKELETON_POSITIONS.map((pos) => {
      const skel = new Menace_Skeleton({
        x: pos.x,
        y: pos.y,
        scene: this,
        player: this.currentPlayer,
      });
      this.allEnemies.push(skel);
      return skel;
    });
  }

  private createBlastSkeleton() {
    this.blastSkeleton = BLAST_SKELETON_POSITIONS.map((pos) => {
      const skel = new Blast_Skeleton({
        x: pos.x,
        y: pos.y,
        scene: this,
        player: this.currentPlayer,
      });
      this.allEnemies.push(skel);
      return skel;
    });
  }

  private createDripWalkers() {
    new DripWalker({
      x: DRIP_WALKER_POSITIONS[0].x,
      y: DRIP_WALKER_POSITIONS[0].y,
      scene: this,
    });
  }

  private createCannons() {
    CANNON_CONFIG.forEach(({ x, y, side }) => {
      new Cannon({
        x,
        y,
        scene: this,
        side,
        player: this.currentPlayer,
        allEnemies: this.allEnemies,
      });
    });
  }

  private createReferee() {
    const referee = new Referee({
      x: REFEREE_POSITION.x,
      y: REFEREE_POSITION.y,
      scene: this,
    });
    this.allEnemies.push(referee);
  }

  private createRiceBuns() {
    this.time.addEvent({
      delay: RICE_BUN_SPAWN_INTERVAL,
      callback: () => {
        const availablePositions = RICE_BUN_POSITIONS.filter(pos => {
          return !this.riceBuns.some(rb => rb.active && rb.x === pos.x && rb.y === pos.y);
        });

        if (availablePositions.length === 0) return;

        const position = Phaser.Math.RND.pick(availablePositions);
        const riceBun = new RiceBun({
          x: position.x,
          y: position.y,
          scene: this,
        });
        this.riceBuns.push(riceBun);

        this.riceBuns = this.riceBuns.filter(rb => rb.active);
      },
      loop: true,
    });
  }

  private createHoney() {
    this.honey = new Honey({
      x: HONEY_SPAWN_POSITION.x,
      y: HONEY_SPAWN_POSITION.y,
      scene: this,
    });
  }

  private createChest() {
    this.time.addEvent({
      delay: CHEST_SPAWN_INTERVAL,
      callback: () => {
        const chest = new Chest({ scene: this });
        this.chests.push(chest);
        this.chests = this.chests.filter(c => c.active);
      },
      loop: true,
    });
  }

  private createOcean() {
    const wavesUpTileIndexes = [1356, 1358];
    const wavesCenterTileIndexes = [1228, 1230];

    const loadWaterForLayer = (layer: Phaser.Tilemaps.TilemapLayer | null, isBorder = false) => {
      if (!layer) return;
      const upTileIndexes = isBorder
        ? wavesUpTileIndexes.map((index) => index - 1)
        : wavesUpTileIndexes;
      const centerTileIndexes = isBorder
        ? wavesCenterTileIndexes.map((index) => index - 1)
        : wavesCenterTileIndexes;

      layer.layer.data.forEach((row: Phaser.Tilemaps.Tile[]) => {
        row.forEach((tile: Phaser.Tilemaps.Tile) => {
          if (tile && upTileIndexes.includes(tile.index)) {
            const worldX = tile.pixelX + layer.x + tile.width / 2;
            const worldY = tile.pixelY + layer.y + tile.height / 2;
            const sprite = this.add
              .sprite(worldX, worldY, "waves_up")
              .setOrigin(0.25);
            createAnimation(this, sprite, "waves_up", "", 0, 8, 15, -1);
          }
          if (tile && centerTileIndexes.includes(tile.index)) {
            const worldX = tile.pixelX + layer.x + tile.width / 2;
            const worldY = tile.pixelY + layer.y + tile.height / 2;
            const sprite = this.add
              .sprite(worldX, worldY, "waves_center")
              .setOrigin(0.25);
            createAnimation(this, sprite, "waves_up", "", 0, 8, 15, -1);
          }
        });
      });
    };
    loadWaterForLayer(
      (this.layers["Water"] as Phaser.Tilemaps.TilemapLayer | null) ?? null,
    );
    if (this.borderMapLeft) {
      loadWaterForLayer(
        this.borderMapLeft.getLayer("Water")?.tilemapLayer ?? null,
        true,
      );
    }
    if (this.borderMapRight) {
      loadWaterForLayer(
        this.borderMapRight.getLayer("Water")?.tilemapLayer ?? null,
        true,
      );
    }
  }

  private createShips() {
    const ground = 578;
    const layer = this.layers["Ground"];
    layer.layer.data.forEach((row: Phaser.Tilemaps.Tile[]) => {
      row.forEach((tile: Phaser.Tilemaps.Tile) => {
        if (tile && ground === tile.index) {
          const worldX = tile.pixelX + layer.x + tile.width / 2;
          const worldY = tile.pixelY + layer.y + tile.height / 2;
          this.add.sprite(worldX, worldY, "wood").setScale(0.95);
        }
      });
    });
  }

  private createLumbers() {
    LUMBER_CONFIG.forEach(({ x, y }) => {
      new Lumber({
        x,
        y,
        scene: this
      });
    });
  }
}
