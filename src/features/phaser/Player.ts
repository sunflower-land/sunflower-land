import { SQUARE_WIDTH } from "features/game/lib/constants";
import { SpeechBubble } from "./SpeechBubble";
import { Bumpkin } from "features/game/types/game";
import { buildNPCSheet } from "features/bumpkins/actions/buildNPCSheet";

export class Player extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite;

  public speech: SpeechBubble | undefined;

  private bumpkin: Bumpkin;

  constructor(scene: Phaser.Scene, x: number, y: number, bumpkin: Bumpkin) {
    super(scene, x, y);
    this.scene = scene;
    this.bumpkin = bumpkin;

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

    this.scene.anims.create({
      key: `bumpkin-idle`,
      frames: this.scene.anims.generateFrameNumbers("bumpkin", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.scene.anims.create({
      key: `bumpkin-walking`,
      frames: this.scene.anims.generateFrameNumbers("walking", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.scene.add.existing(this);

    this.loadSprites();
    console.log("Player Doine");
  }

  private async loadSprites() {
    const sheet = await buildNPCSheet({
      parts: this.bumpkin.equipped,
    });

    console.log({ sheet });
    // const spriteSheedKey = `${this.bumpkin.id}-bumpkin-idle-sheet`;

    // this.scene.load.spritesheet(spriteSheedKey, sheet, {
    //   frameWidth: 14,
    //   frameHeight: 18,
    // });
    // await new Promise((r) => setTimeout(r, 1000));

    this.scene.load.start();
    console.log("HERE");
    this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
      console.log("Load complete");
    });

    this.scene.anims.create({
      key: `${this.bumpkin.id}-bumpkin-idle`,
      frames: this.scene.anims.generateFrameNumbers("bumpkin", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });

    // TODO - custom walking
    this.scene.anims.create({
      key: `${this.bumpkin.id}-bumpkin-walking`,
      frames: this.scene.anims.generateFrameNumbers("walking", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
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
    this.add(this.speech);
  }

  public walk() {
    this.sprite.play(`${this.bumpkin.id}-bumpkin-walking`, true);
  }

  public stop() {
    this.sprite.play(`${this.bumpkin.id}-bumpkin-idle`, true);
  }
}
