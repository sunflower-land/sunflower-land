import cornMazeJSON from "assets/map/corn_maze.json";
import { mazeManager } from "features/world/ui/cornMaze/MazeHud";

import { BaseScene, NPCBumpkin } from "./BaseScene";
import { CONFIG } from "lib/config";
import { SceneId } from "../mmoMachine";
import { NPC_WEARABLES } from "lib/npcs";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import eventBus from "../lib/eventBus";
import { SOUNDS } from "assets/sound-effects/soundEffects";
import { SeasonWeek } from "features/game/types/game";
import { ENEMIES, Enemy } from "../ui/cornMaze/lib/enemies";
import { MachineInterpreter } from "features/game/lib/gameMachine";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";

const LUNA: NPCBumpkin = {
  x: 333,
  y: 330,
  npc: "luna",
  direction: "left",
};

export class CornScene extends BaseScene {
  sceneId: SceneId = "corn_maze";
  // Don't allow portal hit to be triggered multiple times
  canHandlePortalHit = true;
  currentWeek: SeasonWeek = 1;
  enemies?: Phaser.GameObjects.Group;
  spotlight?: Phaser.GameObjects.Image;
  mazePortal?: Phaser.GameObjects.Sprite;
  portalTravelSound?: Phaser.Sound.BaseSound;

  constructor() {
    super({
      name: "corn_maze",
      map: {
        // Copy json from the backend for the week you're looking for if running in art mode
        json: CONFIG.API_URL ? `${CONFIG.API_URL}/maps/corn` : cornMazeJSON,
      },
      audio: { fx: { walk_key: "sand_footstep" } },
    });

    this.currentWeek = getSeasonWeek();
  }

  async preload() {
    super.preload();

    this.load.spritesheet("maze_portal", "world/maze_portal.png", {
      frameWidth: 12,
      frameHeight: 12,
    });
    this.load.image("crow", "world/crow.png");
    this.load.image("spotlight", "world/spotlight.webp");

    // SFX
    this.load.audio("ouph", SOUNDS.voices.ouph);
    this.load.audio("crow_collected", SOUNDS.notifications.crow_collected);

    this.setUpSound();
  }

  create() {
    super.create();

    this.setUpSpotlight();
    this.setUpPortal();
    this.setUpCrows();
    this.setUpLuna();
    this.setUpEnemies();
    this.setUpEnemyColliders();

    this.map = this.make.tilemap({
      key: "corn_maze",
    });

    this.scene.pause();

    mazeManager.sceneLoaded();

    eventBus.on("corn_maze:startScene", () => {
      this.scene.resume();
      this.mazePortal?.play("maze_portal_anim", true);
    });

    eventBus.on("corn_maze:pauseScene", () => {
      this.scene.pause();
    });

    eventBus.on("corn_maze:resumeScene", () => {
      this.scene.resume();
      setTimeout(() => {
        this.canHandlePortalHit = true;
      }, 2000);
    });

    this.canHandlePortalHit = true;
  }

  setUpSound() {
    this.portalTravelSound = this.sound.add("portal_travel");

    // Shut down the sound when the scene changes
    // this.events.once("shutdown", () => {
    //   this.portalTravelSound?.play({ volume: 0.5 });
    //   if (!this.portalTravelSound || this.portalTravelSound.isPaused) {
    //     this.sound.getAllPlaying().forEach((sound) => {
    //       sound.destroy();
    //     });
    //   }
    // });

    if (!this.sound.get("nature_1")) {
      const nature = this.sound.add("nature_1");
      nature.play({ loop: true, volume: 0.05 });
    }
  }

  setUpSpotlight() {
    // add spot light image to cover the whole scene
    this.spotlight = this.add.image(0, 0, "spotlight");
    this.spotlight.setOrigin(0, 0);
    this.spotlight.setDepth(100000000000);

    this.updateSpotlightPosition();
  }

  updateSpotlightPosition() {
    if (this.currentPlayer && this.spotlight) {
      // have the center of the spotlight be the center of the currentPlayer
      this.spotlight.x = this.currentPlayer.x - this.spotlight.width / 2;
      this.spotlight.y = this.currentPlayer.y - this.spotlight.height / 2;
    }
  }

  setUpPortal() {
    this.mazePortal = this.add.sprite(320, 319, "maze_portal");

    this.anims.create({
      key: "maze_portal_anim",
      frames: this.anims.generateFrameNumbers("maze_portal", {
        start: 0,
        end: 12,
      }),
      repeat: -1,
      frameRate: 10,
    });
  }

  setUpLuna() {
    const container = new BumpkinContainer({
      scene: this,
      x: LUNA.x,
      y: LUNA.y,
      clothing: { ...NPC_WEARABLES.luna, updatedAt: 0 },
      direction: "left",
    });

    // container.setDepth(LUNA.y);
    (container.body as Phaser.Physics.Arcade.Body)
      .setSize(16, 20)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    this.physics.world.enable(container);

    if (this.currentPlayer) {
      this.physics.add.collider(container, this.currentPlayer, () => {
        this.handlePortalHit();
      });
    }
  }

  getFoundCrowIds() {
    const gameService = this.registry.get("gameService") as MachineInterpreter;
    const currentWeek = getSeasonWeek();
    const witchesEve = gameService.state.context.state.witchesEve;
    const weekData = witchesEve?.maze[currentWeek];

    // Attempt is added to game start when Luna is paid
    const activeAttempt = weekData?.attempts?.find(
      (attempt) => !attempt.completedAt
    );

    if (!activeAttempt) return;

    return activeAttempt.crowIds ?? [];
  }

  setUpCrows() {
    const crowsLayer = this.map.getLayer("Crows");
    if (crowsLayer) {
      const foundCrowIds = this.getFoundCrowIds();

      // Access the tile data from the layer
      const tileData = crowsLayer.data;

      // Assuming the tilemap has a fixed tile width and height
      const tileWidth = this.map.tileWidth;
      const tileHeight = this.map.tileHeight;

      // Now, you can iterate through the tile data and get the positions of the sprites
      for (let y = 0; y < this.map.height; y++) {
        for (let x = 0; x < this.map.width; x++) {
          const tile = tileData[y][x];
          if (tile.index !== -1) {
            // 'tile' represents each tile in the layer

            // Access the position of the sprite
            const spriteX = x * tileWidth + tileWidth / 2;
            const spriteY = y * tileHeight + tileHeight / 2;

            const crowId = `${spriteX}-${spriteY}`;

            // Only add the crow if it hasn't already been found
            if (!foundCrowIds?.includes(crowId)) {
              const crow = this.physics.add.sprite(spriteX, spriteY, "crow");
              // on collision with player, collect crow
              if (this.currentPlayer) {
                this.physics.add.overlap(this.currentPlayer, crow, () => {
                  this.collect(crowId);
                  const collected = this.sound.add("crow_collected");
                  collected.play({ volume: 0.7 });
                  crow.destroy();
                });
              }
            }
          }
        }
      }
    }
  }

  setUpEnemies() {
    this.enemies = this.add.group();
    ENEMIES[this.currentWeek].forEach((enemy) => {
      const container = new BumpkinContainer({
        scene: this,
        x: enemy.x,
        y: enemy.y,
        clothing: {
          ...(enemy.clothing ?? NPC_WEARABLES[enemy.npc]),
          updatedAt: 0,
        },
        direction: enemy.target.startFacingLeft ? "left" : "right",
        isEnemy: true,
      });

      container.setDepth(enemy.y);
      (container.body as Phaser.Physics.Arcade.Body)
        .setSize(16, 20)
        .setOffset(0, 0)
        .setCollideWorldBounds(true);

      this.physics.world.enable(container);

      container.walk();
      this.enemies?.add(container);

      // Create a tween configuration object
      const tweenConfig: Phaser.Types.Tweens.TweenBuilderConfig = {
        targets: container,
        x: enemy.target.x,
        y: enemy.target.y,
        duration: enemy.target.duration,
        ease: "Linear",
        repeat: -1,
        yoyo: true,
        onUpdate: (tween, target) => {
          if (enemy.target.direction === "horizontal") {
            this.handleDirectionChange(enemy, target as BumpkinContainer);
          }

          if (enemy.target.hold) {
            this.handleRandomEnemyHold(
              tween,
              enemy,
              target as BumpkinContainer
            );
          }

          if (!target.isWalking && !enemy.target.hold) {
            target.walk();
          }
        },
      };

      // Create the tween
      this.tweens.add(tweenConfig);
    });
  }

  setUpEnemyColliders() {
    if (!this.currentPlayer || !this.enemies) return;

    this.physics.add.overlap(this.currentPlayer, this.enemies, () => {
      if (!this.currentPlayer?.invincible) {
        mazeManager.hit();
        const hit = this.sound.add("ouph");
        hit.play({ volume: 0.5 });
        this.currentPlayer?.hitPlayer();
      }
    });
  }

  handleDirectionChange(enemy: Enemy, container: BumpkinContainer) {
    const startDirection = enemy.target.startFacingLeft ? "left" : "right";
    if (startDirection === "right") {
      if (
        container.x === enemy.target.x &&
        container.directionFacing === "right"
      ) {
        container.faceLeft();
      } else if (
        container.x === enemy.x &&
        container.directionFacing === "left"
      ) {
        container.faceRight();
      }
    } else {
      if (
        container.x === enemy.target.x &&
        container.directionFacing === "left"
      ) {
        container.faceRight();
      } else if (
        container.x === enemy.x &&
        container.directionFacing === "right"
      ) {
        container.faceLeft();
      }
    }
  }

  handleRandomEnemyHold(
    tween: Phaser.Tweens.Tween,
    enemy: Enemy,
    container: BumpkinContainer
  ) {
    // Generate a random hold time between 500ms and 2000ms (adjust as needed)
    const minHoldTime = 1; // Minimum hold time in milliseconds
    const maxHoldTime = enemy.target.duration + 1000; // Maximum hold time in milliseconds
    const randomHoldTime = Phaser.Math.Between(minHoldTime, maxHoldTime);

    if (
      enemy.target.direction === "horizontal" &&
      container.x === enemy.target.x
    ) {
      tween.pause();
      container.idle();
      setTimeout(() => {
        if (tween && tween.isPaused()) {
          tween.resume();
          container.walk();
        }
      }, randomHoldTime);
    } else if (
      enemy.target.direction === "vertical" &&
      container.y === enemy.target.y
    ) {
      tween.pause();
      container.idle();
      setTimeout(() => {
        tween.resume();
        container.walk();
      }, randomHoldTime);
    }
  }

  collect(id: string) {
    mazeManager.collect(id);
  }

  update(time: number, delta: number): void {
    super.update(time, delta);

    this.updateSpotlightPosition();
  }
}
