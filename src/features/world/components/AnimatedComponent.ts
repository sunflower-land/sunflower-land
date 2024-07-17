export class AnimatedComponent {
  container: Phaser.GameObjects.Container;
  scene: Phaser.Scene;
  key: string;
  url: string;
  width: number;
  height: number;
  frames: number;
  x: number;
  y: number;
  sprite?: Phaser.GameObjects.Sprite;
  repeat = true;

  constructor({
    container,
    key,
    sprite,
    scene,
    width,
    height,
    frames,
    x = 0,
    y = 0,
  }: {
    container: Phaser.GameObjects.Container;
    key: string;
    sprite: string;
    scene: Phaser.Scene;
    width: number;
    height: number;
    frames: number;
    x?: number;
    y?: number;
  }) {
    this.container = container;
    this.scene = scene;
    this.key = key;
    this.url = sprite;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frames = frames;

    this.update();
  }

  async update() {
    // Check if sprite already set with key
    if (this.sprite?.texture.key === this.key) return;

    if (!this.scene.textures.exists(this.key)) {
      await this.loadTexture();
    }

    if (this.sprite) {
      this.sprite.setTexture(this.key);
    } else {
      this.sprite = this.scene.add
        .sprite(this.x, this.y, this.key)
        .setOrigin(0.5);
      this.container.add(this.sprite);
    }

    this.startAnimation();
  }

  async loadTexture() {
    const loadedKey = new Promise((res) => {
      const loader = this.scene.load.spritesheet(this.key, this.url, {
        frameWidth: this.width,
        frameHeight: this.height,
      });

      loader.addListener(Phaser.Loader.Events.COMPLETE, () => {
        res(this.key);
      });

      this.scene.load.start();
    });

    await loadedKey;
  }

  startAnimation() {
    if (!this.scene.anims.exists(`${this.key}-animation`)) {
      this.scene.anims.create({
        key: `${this.key}-animation`,
        frames: this.scene.anims.generateFrameNumbers(this.key as string, {
          start: 0,
          end: this.frames - 1,
        }),
        repeat: this.repeat ? -1 : 0,
        frameRate: 10,
      });
    }

    console.log({ play: `${this.key}-animation` });
    this.sprite?.play(`${this.key}-animation`, true);
  }

  destroy() {
    this.sprite?.destroy();
    this.sprite = undefined;
  }
}
