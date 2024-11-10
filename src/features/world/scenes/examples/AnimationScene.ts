import { NPC_WEARABLES } from "lib/npcs";
import { ANIMATION, getAnimationUrl } from "../../lib/animations";
import { getKeys } from "features/game/types/decorations";
import { BaseScene } from "../BaseScene";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { SceneId } from "features/world/mmoMachine";

/**
 * Using this file is as easy as 1, 2, 3!
 * 1. Load SpriteSheet
 * 2. Create Animation
 * 3. Play Animation
 */
export class ExampleAnimationScene extends Phaser.Scene {
  sceneId: SceneId = "examples_animations";
  constructor() {
    super("examples_animations");
  }

  preload() {
    const bumpkin: BumpkinParts = {
      ...NPC_WEARABLES["raven"],
    };

    getKeys(ANIMATION).forEach((animationName) => {
      /**
       * 1. Load SpriteSheet
       * Use the helper function getAnimationUrl to generate to the correct URL
       */
      const url = getAnimationUrl(bumpkin, [animationName]);
      this.load.spritesheet(animationName, url, {
        frameWidth:
          animationName === "idle-small" || animationName === "walking-small"
            ? 20
            : 96,
        frameHeight:
          animationName === "idle-small" || animationName === "walking-small"
            ? 19
            : 64,
      });
    });
  }

  create() {
    this.cameras.main.setBackgroundColor("#555555");
    this.initialiseCamera();

    getKeys(ANIMATION).forEach((animationName, i) => {
      this.addText(animationName, i);

      /**
       * 2. Create Animation
       * Phaser can figure out how many frames are required
       */
      this.anims.create({
        key: animationName,
        frames: this.anims.generateFrameNumbers(animationName),
        frameRate: 10,
        repeat: -1,
      });

      /**
       * 3. Play Animation at X & Y
       */
      this.add.sprite(this.x(i), this.y(i), animationName).play(animationName);
    });
  }

  /**
   * Information below this line is only used for the demo. Not required to use animations :)
   */
  cellWidth = 64;
  rowLength = 5;

  x(i: number) {
    return (
      window.innerWidth / 2 -
      150 +
      ((i * this.cellWidth) % (this.cellWidth * this.rowLength))
    );
  }

  y(i: number) {
    return (
      window.innerHeight / 2 -
      100 +
      Math.floor((i * this.cellWidth) / (this.cellWidth * this.rowLength)) *
        this.cellWidth
    );
  }

  addText(animationName: string, i: number) {
    this.add
      .text(this.x(i), this.y(i) + 20, animationName, {
        fontSize: "4px",
      })
      .setResolution(10);
  }

  zoom = 3;
  map = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  initialiseCamera = BaseScene.prototype.initialiseCamera;
}
