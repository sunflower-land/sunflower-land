import { HalloweenScene } from "../HalloweenScene";

interface Props {
  x: number;
  y: number;
  scene: HalloweenScene;
  width: number;
  maxHealth: number;
}

export class LifeBar extends Phaser.GameObjects.Container {
  private border: Phaser.GameObjects.Rectangle;
  private background: Phaser.GameObjects.Rectangle;
  private bar: Phaser.GameObjects.Rectangle;
  private maxWidth: number;
  maxHealth: number;
  currentHealth: number;

  constructor({ x, y, scene, width, maxHealth }: Props) {
    super(scene, x, y);

    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
    this.maxWidth = width;

    // Border
    this.border = scene.add.rectangle(0, 0, width + 2, 4, 0xffffff);
    this.border.setOrigin(0.5);

    // Background
    this.background = scene.add.rectangle(0, 0, width, 2, 0x000);
    this.background.setOrigin(0.5);

    // Bar
    this.bar = scene.add.rectangle(0, 0, width, 2, 0x00ff00);
    this.bar.setOrigin(0.5);

    this.setVisible(false);
    this.add([this.border, this.background, this.bar]);
  }

  decrease(amount: number) {
    this.setHealth(this.currentHealth - amount);
  }

  increase(amount: number) {
    this.setHealth(this.currentHealth + amount);
  }

  setHealth(value: number) {
    const isVisible = value < this.maxHealth ? true : false;
    this.setVisible(isVisible);
    this.currentHealth = Phaser.Math.Clamp(value, 0, this.maxHealth);
    const healthRatio = this.currentHealth / this.maxHealth;
    this.bar.width = this.maxWidth * healthRatio;

    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
      new Phaser.Display.Color(255, 0, 0),
      new Phaser.Display.Color(0, 255, 0),
      this.maxHealth,
      this.currentHealth,
    );
    this.bar.fillColor = Phaser.Display.Color.GetColor(
      color.r,
      color.g,
      color.b,
    );
  }
}
