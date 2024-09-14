import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { BaseScene } from "features/world/scenes/BaseScene";
import { DarknessPipeline } from "../shaders/DarknessShader";
import { STEP_PLAYER_LIGHT_RADIUS } from "../HalloweenConstants";

interface Props {
  x: number;
  y: number;
  scene: BaseScene;
  player?: BumpkinContainer;
}

export class LampContainer extends Phaser.GameObjects.Container {
  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);
    this.scene = scene;

    // Sprite Lamp
    const spriteName = "speech_bubble";
    const lamp = scene.add.image(0, 0, spriteName);

    scene.physics.add.existing(this);

    if (!!this.body && !!player) {
      (this.body as Phaser.Physics.Arcade.Body)
        .setSize(lamp.width, lamp.height)
        .setOffset(0, 2)
        .setImmovable(true)
        .setCollideWorldBounds(true);

      scene.physics.add.overlap(this, player, () => this.collectLamp());
    }

    this.setSize(lamp.width, lamp.height);
    this.add(lamp);

    scene.add.existing(this);
  }

  private collectLamp() {
    const darknessPipeline = this.scene.cameras.main.getPostPipeline(
      "DarknessPipeline",
    ) as DarknessPipeline;

    const finalStep =
      darknessPipeline.lightRadius[0] + STEP_PLAYER_LIGHT_RADIUS;
    const step = STEP_PLAYER_LIGHT_RADIUS / 10;

    const animationRadius = setInterval(() => {
      darknessPipeline.lightRadius[0] += step;
      if (darknessPipeline.lightRadius[0] >= finalStep) {
        darknessPipeline.lightRadius[0] = finalStep;
        clearInterval(animationRadius);
      }
    }, 10);
    this.destroyLamp();
  }

  private destroyLamp() {
    this.setPosition(-9999, -9999);
    this.destroy();
  }
}
