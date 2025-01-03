export class DogContainer extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;
  private dogNumber: 1 | 2;

  constructor(scene: Phaser.Scene, x: number, y: number, dogNumber: 1 | 2) {
    super(scene, x, y);
    this.dogNumber = dogNumber;

    this.sprite = this.scene.add.sprite(0, 0, `dog_${this.dogNumber}`);
    this.add(this.sprite);

    scene.add.existing(this);

    // Walking animation
    this.sprite?.anims.create({
      key: `dog_${this.dogNumber}-walking`,
      frames: this.sprite?.anims.generateFrameNumbers(`dog_${this.dogNumber}`, {
        start: 0,
        end: 6,
      }),
      frameRate: 1000 / 70,
      repeat: -1,
    });

    // Idle animation
    this.sprite?.anims.create({
      key: `dog_${this.dogNumber}-idle`,
      frames: this.sprite?.anims.generateFrameNumbers(`dog_${this.dogNumber}`, {
        start: 6,
        end: 10,
      }),
      frameRate: 1000 / 280,
      repeat: -1,
    });
  }

  public walk() {
    this.sprite?.play(`dog_${this.dogNumber}-walking`, true);
  }

  public idle() {
    this.sprite?.play(`dog_${this.dogNumber}-idle`, true);
  }

  public faceRight() {
    this.sprite?.setFlipX(false);
  }

  public faceLeft() {
    this.sprite?.setFlipX(true);
  }
}
