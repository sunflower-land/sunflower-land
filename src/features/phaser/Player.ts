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

    // this.sprite = this.scene.add
    //   .sprite(0, 0, "bumpkin")
    //   .setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.loadSprites();

    const shadow = this.scene.add
      .sprite(0.5, 8, "shadow")
      .setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.add(shadow);
    // this.add(this.sprite);

    this.setSize(SQUARE_WIDTH, SQUARE_WIDTH);
    scene.physics.world.enableBody(this);
    this.body.setCollideWorldBounds(true);

    // this.scene.anims.create({
    //   key: `bumpkin-idle`,
    //   frames: this.scene.anims.generateFrameNumbers("bumpkin", {
    //     start: 0,
    //     end: 8,
    //   }),
    //   repeat: -1,
    //   frameRate: 10,
    // });

    // this.scene.anims.create({
    //   key: `bumpkin-walking`,
    //   frames: this.scene.anims.generateFrameNumbers("walking", {
    //     start: 0,
    //     end: 8,
    //   }),
    //   repeat: -1,
    //   frameRate: 10,
    // });

    this.scene.add.existing(this);

    console.log("Player Doine");
  }

  private async testLoad(file: any) {
    const config = {};

    const xhr = new XMLHttpRequest();

    xhr.open("GET", file);
    // xhr.setRequestHeader("Accept", "image/webp");
    // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.withCredentials = true;
    // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    xhr.send();

    return xhr;
  }

  private async loadSprites() {
    const sheet = await buildNPCSheet({
      parts: this.bumpkin.equipped,
    });

    const spriteSheetKey = `${this.bumpkin.id}-bumpkin-idle-sheet`;

    const loader = this.scene.load.spritesheet(spriteSheetKey, sheet, {
      frameWidth: 20,
      frameHeight: 19,
    });

    loader.on(Phaser.Loader.Events.COMPLETE, () => {
      this.sprite = this.scene.add
        .sprite(0, 0, spriteSheetKey)
        .setSize(SQUARE_WIDTH, SQUARE_WIDTH);

      this.add(this.sprite);

      this.scene.anims.create({
        key: `${this.bumpkin.id}-bumpkin-idle`,
        frames: this.scene.anims.generateFrameNumbers(spriteSheetKey, {
          start: 0,
          end: 8,
        }),
        repeat: -1,
        frameRate: 10,
      });
      this.sprite.play(`${this.bumpkin.id}-bumpkin-idle`, true);
    });

    this.scene.load.start();

    // TODO - custom walking
    // this.scene.anims.create({
    //   key: `${this.bumpkin.id}-bumpkin-walking`,
    //   frames: this.scene.anims.generateFrameNumbers("walking", {
    //     start: 0,
    //     end: 8,
    //   }),
    //   repeat: -1,
    //   frameRate: 10,
    // });
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
    // this.sprite.play(`${this.bumpkin.id}-bumpkin-walking`, true);
  }

  public stop() {
    // this.sprite.play(`${this.bumpkin.id}-bumpkin-idle`, true);
  }
}
