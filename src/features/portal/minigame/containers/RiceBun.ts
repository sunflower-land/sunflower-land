import { RICE_BUN_DESPAWN_DURATION } from "../Constants";
import { Scene } from "../Scene";

interface Props {
  x: number;
  y: number;
  scene: Scene;
}

export class RiceBun extends Phaser.GameObjects.Container {
  scene: Scene;
  private sprite: Phaser.GameObjects.Sprite;
  private isCollected = false;

  constructor({ x, y, scene }: Props) {
    super(scene, x, y);
    this.scene = scene;

    this.sprite = this.scene.add.sprite(0, 0, "rice_bun");
    this.add(this.sprite);
    this.setDepth(2);

    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.sprite.width, this.sprite.height);
    body.setOffset(-this.sprite.width / 2, -this.sprite.height / 2);

    this.scene.add.existing(this);

    // Overlaps
    this.createOverlaps();

    // Timers
    this.createTimers();
  }

  private createOverlaps() {
    if (this.scene.currentPlayer) {
      this.scene.physics.add.overlap(this, this.scene.currentPlayer, () => {
        this.collect();
      });
    }
  }

  private createTimers() {
    this.scene.time.delayedCall(RICE_BUN_DESPAWN_DURATION, () => {
      if (!this.isCollected) {
        this.destroy();
      }
    });
  }

  private collect() {
    if (this.isCollected) return;
    this.isCollected = true;

    this.scene.portalService?.send("COLLECT_RICE_BUN");
    this.destroy();
  }
}
