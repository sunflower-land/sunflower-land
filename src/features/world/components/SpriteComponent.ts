import { SQUARE_WIDTH } from "features/game/lib/constants";

export type AnimatedSprite = {
  frames: number;
  width: number;
  height: number;
  repeat: boolean;
  play: boolean;
};

export type SpriteProps = {
  container?: Phaser.GameObjects.Container;
  key: string;
  sprite: string;
  scene: Phaser.Scene;
  x?: number;
  y?: number;
  depth?: number;
  animation?: AnimatedSprite;
};

export const PHASER_SCALE = 4;
export const PHASER_GRID_WIDTH = SQUARE_WIDTH * PHASER_SCALE;

export class SpriteComponent {
  container?: Phaser.GameObjects.Container;
  scene: Phaser.Scene;
  key: string;
  url: string;
  x: number;
  y: number;
  animation?: AnimatedSprite;
  sprite: Phaser.GameObjects.Sprite;

  constructor({
    container,
    key,
    sprite,
    scene,
    x = 0,
    y = 0,
    animation,
  }: SpriteProps) {
    this.container = container;
    this.scene = scene;
    this.key = key;
    this.url = sprite;
    this.x = x;
    this.y = y;
    this.animation = animation;

    this.sprite = this.scene.add.sprite(
      this.x * PHASER_SCALE,
      this.y * PHASER_SCALE,
      "shadow",
    );

    this.container?.add(this.sprite);

    this.sprite.setScale(PHASER_SCALE);

    this.update();
  }

  loadingKey?: string;

  async update() {
    // Check if sprite already set with key
    if (this.sprite?.texture.key === this.key || this.loadingKey === this.key)
      return;

    this.loadingKey = this.key;

    if (!this.scene.textures.exists(this.key)) {
      await this.loadTexture();
    }

    this.sprite.setTexture(this.key);

    if (this.animation?.play) {
      this.startAnimation();
    }

    if (this.animation) {
      this.sprite.setOrigin(0.5, 0.5);
    } else {
      this.sprite.setOrigin(0, 0);
    }

    this.sprite.setPosition(this.x * PHASER_SCALE, this.y * PHASER_SCALE);

    if (this.sprite?.texture.key === this.loadingKey) {
      delete this.loadingKey;
    }
  }

  async loadTexture() {
    const loadedKey = new Promise((res) => {
      const loader = this.animation
        ? this.scene.load.spritesheet(this.key, this.url, {
            frameWidth: this.animation.width,
            frameHeight: this.animation.height,
          })
        : this.scene.load.image(this.key, this.url);

      loader.addListener(Phaser.Loader.Events.COMPLETE, () => {
        res(this.key);
      });

      this.scene.load.start();
    });

    await loadedKey;
  }

  startAnimation() {
    if (this.animation && !this.scene.anims.exists(`${this.key}-animation`)) {
      this.scene.anims.create({
        key: `${this.key}-animation`,
        frames: this.scene.anims.generateFrameNumbers(this.key as string, {
          start: 0,
          end: this.animation.frames - 1,
        }),
        repeat: this.animation.repeat ? -1 : 0,
        frameRate: 10,
      });
    }

    this.sprite?.play(`${this.key}-animation`, true);
  }

  destroy() {
    if (this.sprite.active) {
      this.sprite?.destroy();
    }
  }
}
