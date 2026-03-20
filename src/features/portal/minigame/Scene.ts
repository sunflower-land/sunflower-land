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
} from "./Constants";
import { Side, Position, Enemy } from "./Types";
import { EventBus } from "./lib/EventBus";
import { Giant_Skeleton } from "./containers/Giant_Skeleton";
import { Sniper_Skeleton } from "./containers/Sniper_Skeleton";
import { Menace_Skeleton } from "./containers/Menace_Skeleton";
import { Blast_Skeleton } from "./containers/Blast_Skeleton";
import { Cannon } from "./containers/Cannon";
import { createAnimation } from "./lib/Utils";
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
    this.load.image("orange", "/world/portal/images/orange.png");
    this.load.image("wood", "/world/portal/images/wood.png");
    this.load.image("health_full", "/world/portal/images/health_bar_full.webp");
    this.load.image("health_half", "/world/portal/images/health_bar_half.webp");
    this.load.image("health_low", "/world/portal/images/health_bar_low.webp")

    // Cannon
    this.load.image("cannon", "/world/portal/images/tree.webp");

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

    // Enemies
    this.allEnemies = [];
    this.createGlitch();
    this.createEnemies();

    // Cannons
    this.createCannons();

    // Ocean
    this.createOcean();

    this.createShips();

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
      this.resetVelocity();
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

    const animation = this.isMoving && !this.isCannonEnabled ? "walk" : "idle";

    this.currentPlayer[animation]?.();
  }

  private controls() {
    if (!this.cursorKeys) return;
    if (!this.cursorKeys.e) return;

    if (
      Phaser.Input.Keyboard.JustDown(this.cursorKeys.e) &&
      (this.isCannonEnabled.left || this.isCannonEnabled.right)
    ) {
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

  private createOcean() {
    const wavesUpTileIndexes = [1356, 1358];
    const wavesCenterTileIndexes = [1228, 1230];

    // const wavesUpTileIndexes = [
    //   1356, 1357, 1358, 1359,
    //   1228, 1229, 1230, 1231,
    // ];
    // const wavesCenterTileIndexes = [
    //   1164, 1165, 1166, 1167,
    //   1292, 1293, 1294, 1295
    // ];

    const loadWaterForLayer = (
      layer: Phaser.Tilemaps.TilemapLayer | null,
      isBorder = false,
    ) => {
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
}
