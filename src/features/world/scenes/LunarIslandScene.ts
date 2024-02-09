import mapJSON from "assets/map/lunar_island.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { CONFIG } from "lib/config";
import { AudioController, Sound } from "../lib/AudioController";
import { interactableModalManager } from "../ui/InteractableModals";

export const PLAZA_BUMPKINS: NPCBumpkin[] = [
  {
    x: 347,
    y: 207,
    npc: "Chun Long",
  },
];

const drummerCoords = { x: 290, y: 520 };
const xiangCoords = { x: 570, y: 270 };
const mrChuCoords = { x: 150, y: 270 };
const dragonCoords = { x: 350, y: 80 };
const fireOne = { x: 481.5, y: 114.5 };
const fireTwo = { x: 481.5, y: 199.5 };
const fireThree = { x: 212.5, y: 114.5 };
const fireFour = { x: 212.5, y: 199.5 };

export class LunarIslandScene extends BaseScene {
  sceneId: SceneId = "lunar_island";

  constructor() {
    super({
      name: "lunar_island",
      map: {
        json: mapJSON,
        defaultTilesetConfig: mapJSON.tilesets,
        imageKey: "lunar-tileset",
      },
    });
  }

  preload() {
    super.preload();

    this.load.image(
      "lunar-tileset",
      `${CONFIG.PROTECTED_IMAGE_URL}/world/lunar-map-extruded.png`
    );

    this.load.image("red_chest", `world/red_chest.png`);
    this.load.spritesheet(
      "dragon",
      "src/assets/events/lunar-new-year/dragon.png",
      {
        frameWidth: 121,
        frameHeight: 170,
      }
    );

    this.load.spritesheet("fire", "src/assets/events/lunar-new-year/fire.png", {
      frameWidth: 23,
      frameHeight: 45,
    });

    this.load.spritesheet("drummer", "world/drummer_lunar_new_year.png", {
      frameWidth: 30,
      frameHeight: 30,
    });

    this.load.spritesheet("xiang", "world/xiang.png", {
      frameWidth: 20,
      frameHeight: 19,
    });

    this.load.spritesheet("mrchu", "world/mr_chu.png", {
      frameWidth: 17,
      frameHeight: 21,
    });

    if (!this.sound.get("cherry_blossoms")) {
      const music = this.sound.add("cherry_blossoms") as Sound;
      music.play({ loop: true, volume: 0 });
      this.soundEffects.push(
        new AudioController({
          sound: music,
          distanceThreshold: 500,
          coordinates: drummerCoords,
          maxVolume: 0.1,
        })
      );
    }
  }

  async create() {
    this.map = this.make.tilemap({
      key: "lunar_island",
    });

    super.create();

    this.initialiseNPCs(PLAZA_BUMPKINS);

    const xiang = this.add.sprite(xiangCoords.x, xiangCoords.y, "xiang");
    xiang.flipX = true;
    this.anims.create({
      key: "xiang_animation",
      frames: this.anims.generateFrameNumbers("xiang", {
        start: 0,
        end: 9,
      }),
      repeat: -1,
      frameRate: 10,
    });
    xiang.play("xiang_animation", true);

    const mrChu = this.add.sprite(mrChuCoords.x, mrChuCoords.y, "mrchu");
    this.anims.create({
      key: "mrchu_animation",
      frames: this.anims.generateFrameNumbers("mrchu", {
        start: 0,
        end: 9,
      }),
      repeat: -1,
      frameRate: 12.5,
    });
    mrChu.play("mrchu_animation", true);

    const drummer = this.add.sprite(
      drummerCoords.x,
      drummerCoords.y,
      "drummer"
    );

    const chest = this.add.sprite(280, 280, "red_chest");
    chest
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", (p: Phaser.Input.Pointer) => {
        interactableModalManager.open("basic_chest");
      });

    this.add.sprite(280, 270, "alert").setSize(4, 10);

    this.anims.create({
      key: "drummer_animation",
      frames: this.anims.generateFrameNumbers("drummer", {
        start: 0,
        end: 18,
      }),
      repeat: -1,
      frameRate: 13.8,
    });
    drummer.play("drummer_animation", true);

    const dragon = this.add.sprite(dragonCoords.x, dragonCoords.y, "dragon");

    this.anims.create({
      key: "dragon_animation",
      frames: this.anims.generateFrameNumbers("dragon", {
        start: 0,
        end: 10,
      }),
      repeat: -1,
      frameRate: 8.3,
    });
    dragon.play("dragon_animation", true);

    const fire1 = this.add.sprite(fireOne.x, fireOne.y, "fire");

    this.anims.create({
      key: "fire_animation",
      frames: this.anims.generateFrameNumbers("fire", {
        start: 0,
        end: 11,
      }),
      repeat: -1,
      frameRate: 7,
    });

    fire1.play("fire_animation", true);

    const fire2 = this.add.sprite(fireTwo.x, fireTwo.y, "fire");
    fire2.play("fire_animation", true);

    const fire3 = this.add.sprite(fireThree.x, fireThree.y, "fire");
    fire3.play("fire_animation", true);

    const fire4 = this.add.sprite(fireFour.x, fireFour.y, "fire");
    fire4.play("fire_animation", true);
  }
}
