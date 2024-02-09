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

    this.load.spritesheet("drummer", "world/drummer_lunar_new_year.png", {
      frameWidth: 30,
      frameHeight: 30,
    });

    this.load.spritesheet("dancing_girl", "world/dancing_girl.png", {
      frameWidth: 19,
      frameHeight: 21,
    });

    if (!this.sound.get("cherry_blossoms")) {
      const music = this.sound.add("cherry_blossoms") as Sound;
      music.play({ loop: true, volume: 0 });
      this.soundEffects.push(
        new AudioController({
          sound: music,
          distanceThreshold: 150,
          coordinates: drummerCoords,
          maxVolume: 1,
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
  }
}
