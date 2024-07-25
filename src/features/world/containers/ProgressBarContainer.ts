export class ProgressBarContainer extends Phaser.GameObjects.Container {
  public progressBarBackground: Phaser.GameObjects.Graphics;
  public progressBar: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.progressBar = this.scene.add.graphics().setDepth(1);
    this.progressBarBackground = this.scene.add.graphics().setDepth(0);
    const progressBar = this.scene.add
      .sprite(0, 0, "empty_progress_bar")
      .setDisplaySize(18, 7);
    this.add(progressBar);

    // this.bringToTop(this.progressBarBackground);

    this.progressBarBackground.fillStyle(0x193c3e, 1);
    this.progressBarBackground.fillRect(-8, -2, 15, 3);

    this.add(this.progressBarBackground);
    this.add(this.progressBar);
    this.scene.add.existing(this);

    this.bringToTop(progressBar);
  }

  updateBar(progress: number) {
    // Round up to the nearest 10 (expect for 100)
    let amount = Math.min(Math.ceil(progress * 10) / 10, 100);
    if (amount === 100 && progress !== 100) {
      amount = 90;
    }

    this.progressBar.fillStyle(0x63c74d, 1);
    this.progressBar.fillRect(-7, -2, (14 * amount) / 100, 4);
  }
}
