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
    this.x = x * PHASER_SCALE;
    this.y = y * PHASER_SCALE;
    this.animation = animation;

    this.sprite = this.scene.add
      .sprite(this.x, this.y, "shadow")
      .setOrigin(0, 0)
      .setScale(PHASER_SCALE);

    this.container?.add(this.sprite);

    this.update();
  }

  async update() {
    // Check if sprite already set with key
    if (this.sprite?.texture.key === this.key) return;

    if (!this.scene.textures.exists(this.key)) {
      await this.loadTexture();
    }

    this.sprite.setTexture(this.key);

    this.sprite.setScale(PHASER_SCALE);

    if (this.animation?.play) {
      this.startAnimation();
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

    this.sprite.setScale(PHASER_SCALE);
  }

  destroy() {
    if (this.sprite.active) {
      this.sprite?.destroy();
    }
  }
}
