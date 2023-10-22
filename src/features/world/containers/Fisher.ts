export class Fisher extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;

  // Animation Keys
  private idleSpriteKey: string | undefined;
  private walkingSpriteKey: string | undefined;
  private idleAnimationKey: string | undefined;
  private walkingAnimationKey: string | undefined;
  private direction: "left" | "right" = "right";

  constructor({ scene }: { scene: Phaser.Scene }) {
    super(scene, 100, 100);
    this.scene = scene;
  }
}
