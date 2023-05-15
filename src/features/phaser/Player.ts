import { SQUARE_WIDTH } from "features/game/lib/constants";
import { SpeechBubble } from "./SpeechBubble";

export class Player extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite;

  public speech: SpeechBubble | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;

    scene.physics.add.existing(this);

    this.sprite = this.scene.add
      .sprite(0, 0, "bumpkin")
      .setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    const shadow = this.scene.add
      .sprite(0.5, 8, "shadow")
      .setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.add(shadow);
    this.add(this.sprite);

    this.setSize(SQUARE_WIDTH, SQUARE_WIDTH);
    scene.physics.world.enableBody(this);
    this.body.setCollideWorldBounds(true);

    // this.scene.physics.add.staticGroup(this);
    this.scene.add.existing(this);
    console.log("Player Doine");
  }

  addedToScene() {
    super.addedToScene();
    console.log("container:addedToScene");
  }

  public speak(text: string) {
    if (this.speech) {
      this.speech.destroy();
    }

    this.speech = new SpeechBubble(this.scene, text);
    console.log({ s: this.speech });
    this.add(this.speech);
  }
}
