/**
 * Place objects in the MMO world
 * Currently only supports Buds
 */
export class PlaceableContainer extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;

  constructor({
    scene,
    x,
    y,
    sprite,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    sprite: string;
  }) {
    super(scene, x, y);
    this.scene = scene;
    scene.physics.add.existing(this);

    this.setDepth(y);

    this.setSize(16, 16);
    const key = `placeable-${sprite}`;

    console.log("LETSS GO!");
    const spriteLoader = scene.load.spritesheet(key, sprite, {
      frameWidth: 32,
      frameHeight: 32,
    });

    spriteLoader.addListener(Phaser.Loader.Events.COMPLETE, () => {
      if (this.sprite) return;

      const idle = scene.add.sprite(0, 0, key).setOrigin(0.5);
      this.add(idle);
      this.sprite = idle;

      this.scene.anims.create({
        key: `${key}_anim`,
        frames: this.scene.anims.generateFrameNumbers(key, {
          start: 0,
          // TODO - buds with longer animation frames?
          end: 8,
        }),
        repeat: -1,
        frameRate: 10,
      });

      this.sprite?.play("idle_animation", true);
    });

    this.setInteractive({ cursor: "pointer" }).on(
      "pointerdown",
      (p: Phaser.Input.Pointer) => {
        console.log("Clicked");
      }
    );

    this.scene.add.existing(this);
  }
}
