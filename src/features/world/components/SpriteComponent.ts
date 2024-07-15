export class SpriteComponent {
  container: Phaser.GameObjects.Container;
  scene: Phaser.Scene;
  key: string;
  url: string;

  constructor({
    container,
    key,
    sprite,
    scene,
  }: {
    container: Phaser.GameObjects.Container;
    key: string;
    sprite: string;
    scene: Phaser.Scene;
  }) {
    this.container = container;
    this.scene = scene;
    this.key = key;
    this.url = sprite;

    this.update();
  }

  update() {
    if (this.scene.textures.exists(this.key)) {
      const sprite = this.scene.add.sprite(0, 0, this.key).setOrigin(0.5);
      this.container.add(sprite);
      console.log("EXISTED AND ADDED");
    } else {
      // Load sprite then add it
      const loader = this.scene.load.image(this.key, this.url);
      console.log("FIRE LOAD");

      loader.addListener(Phaser.Loader.Events.COMPLETE, () => {
        const sprite = this.scene.add.sprite(0, 0, this.key).setOrigin(0.5);
        this.container.add(sprite);
        console.log("LOADED AND ADDED");
      });

      this.scene.load.start();
    }
  }
}
