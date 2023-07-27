import cornMazeJSON from "assets/map/corn_maze.json";
import { mazeManager } from "features/world/ui/MazeHud";

import { BaseScene, NPCBumpkin } from "./BaseScene";
import { CONFIG } from "lib/config";
import { SceneId } from "../mmoMachine";
import { NPC_WEARABLES } from "lib/npcs";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";

type Enemy = NPCBumpkin & {
  target: {
    x: number;
    y: number;
    direction: "vertical" | "horizontal";
    duration: number;
  };
};

const ENEMIES: Enemy[] = [
  {
    x: 104,
    y: 328,
    npc: "dreadhorn",
    target: {
      x: 104,
      y: 471,
      direction: "vertical",
      duration: 2000,
    },
  },
  {
    x: 57,
    y: 72,
    npc: "dreadhorn",
    target: {
      x: 294,
      y: 72,
      direction: "horizontal",
      duration: 4000,
    },
  },
];

export class CornScene extends BaseScene {
  sceneId: SceneId = "corn_maze";
  score = 0;
  health = 3;
  enemies?: Phaser.GameObjects.Group;

  constructor() {
    super({
      name: "corn_maze",
      map: {
        json: CONFIG.API_URL ? `${CONFIG.API_URL}/maps/corn` : cornMazeJSON,
      },
    });
  }

  preload() {
    super.preload();

    this.load.image("corn", CROP_LIFECYCLE.Corn.crop);
  }

  async create() {
    // this.load.json()
    console.log("Create corn example");
    this.map = this.make.tilemap({
      key: "corn_maze",
    });

    super.create();
    // this.setUpEnemies();
    this.setUpCorn();
    this.setUpEnemies();
    this.setUpEnemyColliders();

    // Get x,y coordinates of
  }

  setUpCorn() {
    const cornLayer = this.map.getLayer("Corn");
    if (cornLayer) {
      // Access the tile data from the layer
      const tileData = cornLayer.data;

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

            // Now you have the position of the sprite at (spriteX, spriteY)
            // You can use this information to create or manipulate sprites as needed
            // render dawn_flower.png at spriteX, spriteY
            const corn = this.physics.add.sprite(spriteX, spriteY, "corn");
            // on collision with player, collect corn
            if (this.currentPlayer) {
              this.physics.add.overlap(this.currentPlayer, corn, () => {
                this.collect(`${spriteX}-${spriteY}`);
                corn.destroy();
              });
            }
          }
        }
      }
    }
  }

  setUpEnemies() {
    this.enemies = this.add.group();
    ENEMIES.forEach((bumpkin) => {
      const enemy = new BumpkinContainer({
        scene: this,
        x: bumpkin.x,
        y: bumpkin.y,
        clothing: {
          ...(bumpkin.clothing ?? NPC_WEARABLES[bumpkin.npc]),
          updatedAt: 0,
        },
        direction: bumpkin.direction ?? "right",
      });

      enemy.setDepth(bumpkin.y);
      (enemy.body as Phaser.Physics.Arcade.Body)
        .setSize(16, 20)
        .setOffset(0, 0)
        .setCollideWorldBounds(true);

      this.physics.world.enable(enemy);
      this.enemies?.add(enemy);

      // Create a tween configuration object
      const tweenConfig: Phaser.Types.Tweens.TweenBuilderConfig = {
        targets: enemy,
        x: bumpkin.target.x,
        y: bumpkin.target.y,
        duration: bumpkin.target.duration,
        ease: "Linear",
        repeat: -1,
        yoyo: true,
        onUpdate: (_, target) => {
          if (bumpkin.target.direction === "horizontal") {
            if (target.x === bumpkin.target.x && target.direction === "right") {
              target.faceLeft();
            } else if (target.x === bumpkin.x && target.direction === "left") {
              target.faceRight();
            }
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
        this.currentPlayer?.hitPlayer();
      }
    });
  }

  collect(id: string) {
    mazeManager.collect(id);
  }
}
