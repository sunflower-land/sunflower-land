import Phaser from "phaser";

import tilesheet from "./assets/sokoban_tilesheet.png";
export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.spritesheet("sokoban", tilesheet, {
      frameWidth: 64,
    });

    // this.load.image('bear', 'textures/bear.png')
    // this.load.image('chicken', 'textures/chicken.png')
    // this.load.image('duck', 'textures/duck.png')
    // this.load.image('parrot', 'textures/parrot.png')
    // this.load.image('penguin', 'textures/penguin.png')
  }

  create() {
    this.anims.create({
      key: "down-idle",
      frames: [{ key: "sokoban", frame: 52 }],
    });

    this.anims.create({
      key: "down-walk",
      frames: this.anims.generateFrameNumbers("sokoban", {
        start: 52,
        end: 54,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "up-idle",
      frames: [{ key: "sokoban", frame: 55 }],
    });

    this.anims.create({
      key: "up-walk",
      frames: this.anims.generateFrameNumbers("sokoban", {
        start: 55,
        end: 57,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "left-idle",
      frames: [{ key: "sokoban", frame: 81 }],
    });

    this.anims.create({
      key: "left-walk",
      frames: this.anims.generateFrameNumbers("sokoban", {
        start: 81,
        end: 83,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right-idle",
      frames: [{ key: "sokoban", frame: 78 }],
    });

    this.anims.create({
      key: "right-walk",
      frames: this.anims.generateFrameNumbers("sokoban", {
        start: 78,
        end: 80,
      }),
      frameRate: 10,
      repeat: -1,
    });

    console.log("Done!");
    this.scene.start("game");
  }
}
