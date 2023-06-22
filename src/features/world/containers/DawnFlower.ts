import { SQUARE_WIDTH } from "features/game/lib/constants";

const PROGRESS_STAGES: Record<number, string> = {
  0: "progress_0",
  1: "progress_1",
  2: "progress_2",
  3: "progress_2",
  4: "progress_3",
  5: "progress_3",
  6: "progress_4",
  7: "progress_4",
  8: "progress_5",
  9: "progress_5",
};

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

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    stage: number,
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
      this.update(stage);
    }
  }

  public update(stage: number) {
    const idle = this.scene.add
      .sprite(0, 0, FLOWER_STAGE[stage] ?? "dawn_flower_sprout")
      .setOrigin(0.5);
    this.add(idle);

    if (stage <= 9) {
      const bar = this.scene.add
        .sprite(0, 12, PROGRESS_STAGES[stage] ?? "progress_0")
        .setOrigin(0.5);
      this.add(bar);
    }
  }
}
