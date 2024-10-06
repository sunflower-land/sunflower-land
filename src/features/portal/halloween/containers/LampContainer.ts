import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { BaseScene } from "features/world/scenes/BaseScene";
import { MachineInterpreter } from "../lib/halloweenMachine";
import { MAX_PLAYER_LAMPS } from "../HalloweenConstants";

interface Props {
  x: number;
  y: number;
  scene: BaseScene;
  player?: BumpkinContainer;
}

export class LampContainer extends Phaser.GameObjects.Container {
  private player?: BumpkinContainer;

  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;

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

  private get portalService() {
    return this.scene.registry.get("portalService") as
      | MachineInterpreter
      | undefined;
  }

  private collectLamp() {
    if (this.portalService?.state.context.lamps === MAX_PLAYER_LAMPS) {
      this.player?.speak("No more space!");
      return;
    }

    this.player?.stopSpeaking();
    this.portalService?.send("COLLECT_LAMP");
    this.destroyLamp();
  }

  private destroyLamp() {
    this.setPosition(-9999, -9999);
    this.destroy();
  }
}
