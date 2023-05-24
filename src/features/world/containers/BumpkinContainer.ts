import { SQUARE_WIDTH } from "features/game/lib/constants";
import { SpeechBubble } from "./SpeechBubble";
import { buildNPCSheets } from "features/bumpkins/actions/buildNPCSheets";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export class BumpkinContainer extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;

  public speech: SpeechBubble | undefined;

  private clothing: BumpkinParts;

  // Animation Keys
  private idleAnimationKey: string | undefined;
  private walkingAnimationKey: string | undefined;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    clothing: BumpkinParts,
    onClick?: () => void
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.clothing = clothing;

    scene.physics.add.existing(this);

    this.loadSprites(scene);

    const shadow = this.scene.add
      .sprite(0.5, 8, "shadow")
      .setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.add(shadow);

    this.setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.scene.add.existing(this);

    if (onClick) {
      this.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
        console.log("Bumpkin clicked");
        onClick();
      });
    }
  }

  private async loadSprites(scene: Phaser.Scene) {
    const { sheets } = await buildNPCSheets({
      parts: this.clothing,
    });

    const r = (Math.random() + 1).toString(36).substring(7);
    const idleSpriteSheetKey = `${r}-bumpkin-idle-sheet`;
    const walkingSpriteSheetKey = `${r}-bumpkin-walking-sheet`;

    const idleLoader = this.scene.load.spritesheet(
      idleSpriteSheetKey,
      sheets.idle,
      {
        frameWidth: 20,
        frameHeight: 19,
      }
    );

    const walkingLoader = this.scene.load.spritesheet(
      walkingSpriteSheetKey,
      sheets.walking,
      {
        frameWidth: 20,
        frameHeight: 19,
      }
    );

    idleLoader.on(Phaser.Loader.Events.COMPLETE, () => {
      this.sprite = scene.add
        .sprite(0, 0, idleSpriteSheetKey)
        .setSize(SQUARE_WIDTH, SQUARE_WIDTH);

      this.add(this.sprite);

      this.idleAnimationKey = `${r}-bumpkin-idle`;
      scene.anims.create({
        key: this.idleAnimationKey,
        frames: scene.anims.generateFrameNumbers(idleSpriteSheetKey, {
          start: 0,
          end: 8,
        }),
        repeat: -1,
        frameRate: 10,
      });

      this.sprite.play(this.idleAnimationKey, true);
    });

    walkingLoader.on(Phaser.Loader.Events.COMPLETE, () => {
      this.walkingAnimationKey = `${r}-bumpkin-walking`;
      scene.anims.create({
        key: this.walkingAnimationKey,
        frames: scene.anims.generateFrameNumbers(walkingSpriteSheetKey, {
          start: 0,
          end: 8,
        }),
        repeat: -1,
        frameRate: 10,
      });
    });

    scene.load.start();
    console.log("sprite after start", this.sprite);
  }

  public speak(text: string) {
    if (this.speech) {
      this.speech.destroy();
    }

    this.speech = new SpeechBubble(this.scene, text);
    this.add(this.speech);

    setTimeout(() => {
      this.speech?.destroy();
    }, 2000);
  }

  public walk() {
    console.log("walking");
    if (this.sprite) {
      this.sprite.anims.play(this.walkingAnimationKey as string, true);
    }
  }

  public idle() {
    if (this.sprite) {
      this.sprite.anims.play(this.idleAnimationKey as string, true);
    }
  }
}
