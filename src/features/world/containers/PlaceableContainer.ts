/**
 * Place objects in the MMO world
 * Currently only supports Buds
 */
export class PlaceableContainer extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;
  public shadow: Phaser.GameObjects.Sprite | undefined;

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

    this.shadow = this.scene.add.sprite(0, 13, "shadow").setSize(16, 16);
    this.add(this.shadow);

    this.setDepth(y);

    this.setSize(16, 16);
    const key = `placeable-${x}-${y}`;

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

      this.sprite?.play(`${key}_anim`, true);
    });

    // TODO
    // this.setInteractive({ cursor: "pointer" }).on(
    //   "pointerdown",
    //   (p: Phaser.Input.Pointer) => {
    //     console.log("Clicked");
    //   }
    // );

    scene.load.start();

    this.scene.add.existing(this);
  }

  public disappear() {
    if (this.sprite?.active) this.sprite?.destroy();
    if (this.shadow?.active) this.shadow?.destroy();

    const poof = this.scene.add.sprite(0, 4, "poof").setOrigin(0.5);
    this.add(poof);

    this.scene.anims.create({
      key: `poof_anim`,
      frames: this.scene.anims.generateFrameNumbers("poof", {
        start: 0,
        // TODO - buds with longer animation frames?
        end: 8,
      }),
      repeat: 0,
      frameRate: 10,
    });

    poof.play(`poof_anim`, true);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const container = this;
    // Listen for the animation complete event
    poof.on("animationcomplete", function (animation: { key: string }) {
      if (animation.key === "poof_anim" && container.active) {
        // Animation 'poof_anim' has completed, destroy the sprite
        container.destroy();
      }
    });
  }
}
