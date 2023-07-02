import { SQUARE_WIDTH } from "features/game/lib/constants";

const FLOWER_STAGE: Record<number, string> = {
  0: "dawn_flower_sprout",
  1: "dawn_flower_sprout",
  2: "dawn_flower_growing",
  3: "dawn_flower_growing",
  4: "dawn_flower_growing",
  5: "dawn_flower_growing",
  6: "dawn_flower_growing",
  7: "dawn_flower_growing",
  8: "dawn_flower_growing",
  9: "dawn_flower_growing",
  10: "dawn_flower",
};
export class DawnFlower extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;
  public water: Phaser.GameObjects.Sprite | undefined;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    stage: number,
    isReady: boolean,
    onClick?: () => void
  ) {
    super(scene, x, y);
    this.scene = scene;

    scene.physics.add.existing(this);

    this.setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.scene.add.existing(this);

    if (onClick) {
      this.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
        onClick();
      });
    }

    if (stage > 0) {
      this.update(stage, isReady);
    }
  }

  public update(stage: number, isReady: boolean) {
    const idle = this.scene.add
      .sprite(0, 0, FLOWER_STAGE[stage] ?? "dawn_flower_sprout")
      .setOrigin(0.5);
    this.add(idle);

    console.log({ isReady, stage });
    if (isReady) {
      this.water = this.scene.add.sprite(6, -6, "water").setOrigin(0.5);
      this.add(this.water);
    } else if (this.water) {
      this.water.destroy();
    }
  }
}
