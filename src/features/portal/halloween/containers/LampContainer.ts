import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { BaseScene } from "features/world/scenes/BaseScene";
import { DarknessPipeline } from "../shaders/DarknessShader";
import { STEP_PLAYER_LIGHT_RADIUS } from "../HalloweenConstants";
import { MachineInterpreter } from "../lib/halloweenMachine";

interface Props {
  x: number;
  y: number;
  scene: BaseScene;
  player?: BumpkinContainer;
  portalService?: MachineInterpreter;
}

export class LampContainer extends Phaser.GameObjects.Container {
  private portalService?: MachineInterpreter;

  constructor({ x, y, scene, player, portalService }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.portalService = portalService;

    // Sprite Lamp
    const spriteName = "lamp";
    const lamp = scene.add.sprite(0, 0, spriteName);

    // Animation
    this.scene.anims.create({
      key: spriteName + "_action",
      frames: this.scene.anims.generateFrameNumbers(spriteName, {
        start: 0,
        end: 3,
      }),
      repeat: -1,
      frameRate: 10,
    });
    lamp.play(spriteName + "_action", true);

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
    this.setScale(0.8);

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
    this.portalService?.send("COLLECT_LAMP");
  }

  private destroyLamp() {
    this.setPosition(-9999, -9999);
    this.destroy();
  }
}
