import { SQUARE_WIDTH } from "features/game/lib/constants";

export class Candy extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;

  constructor({ scene, x, y }: { scene: Phaser.Scene; x: number; y: number }) {
    super(scene, x, y);
    this.scene = scene;
    scene.physics.add.existing(this);

    this.sprite = this.scene.add
      .sprite(x, y, "candy")
      .setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    // this.setDepth(bumpkin.y);
    (this.body as Phaser.Physics.Arcade.Body)
      .setSize(16, 20)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    this.setDepth(100000000);
  }
}
