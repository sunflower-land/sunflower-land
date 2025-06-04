// RacingBumpkin.ts
import { buildNPCSheets } from "features/bumpkins/actions/buildNPCSheets";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { getAnimationUrl } from "features/world/lib/animations";
import { BumpkinParts, tokenUriBuilder } from "lib/utils/tokenUriBuilder";
import Phaser from "phaser";

interface Props {
  scene: Phaser.Scene;
  x: number;
  y: number;
  clothing: BumpkinParts;
}

export class RacingBumpkin extends Phaser.GameObjects.Container {
  public scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Sprite | undefined;
  private shadow: Phaser.GameObjects.Sprite | undefined;
  private silhouette: Phaser.GameObjects.Sprite | undefined;
  private clothing: BumpkinParts;
  private spriteKey: string | undefined;
  private idleAnimationKey: string | undefined;
  private ready = false;
  public racePositions: number[] = [];
  public currentRaceIndex = 0;

  constructor({ scene, x, y, clothing }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.clothing = clothing;
    this.silhouette = this.scene.make.sprite({
      x: 0,
      y: 0,
      key: "silhouette",
      add: false,
    });
    this.silhouette.setOrigin(0.5);
    this.add(this.silhouette);

    this.sprite = this.silhouette;

    this.shadow = this.scene.add
      .sprite(0, 14, "shadow")
      .setSize(SQUARE_WIDTH, SQUARE_WIDTH)
      .setOrigin(0.5);
    this.add(this.shadow);

    this.loadSprites(scene);
  }

  private async loadSprites(scene: Phaser.Scene) {
    this.spriteKey = tokenUriBuilder(this.clothing);
    this.idleAnimationKey = `${this.spriteKey}-bumpkin-idle`;

    await buildNPCSheets({
      parts: this.clothing,
    });

    if (scene.textures.exists(this.spriteKey)) {
      const idle = scene.add.sprite(0, 2, this.spriteKey).setOrigin(0.5);
      this.add(idle);
      this.sprite = idle;
      this.sprite.play(this.idleAnimationKey, true);

      this.ready = true;
      if (this.silhouette?.active) {
        this.silhouette?.destroy();
      }
    } else {
      const url = getAnimationUrl(this.clothing, ["idle"]);

      const idleLoader = scene.load.spritesheet(this.spriteKey, url, {
        frameWidth: 96,
        frameHeight: 64,
      });

      idleLoader.once(`filecomplete-spritesheet-${this.spriteKey}`, () => {
        if (!scene.textures.exists(this.spriteKey as string) || this.ready) {
          return;
        }

        const idle = scene.add
          .sprite(0, 2, this.spriteKey as string)
          .setOrigin(0.5);

        this.add(idle);
        this.sprite = idle;
        this.sprite.play(this.idleAnimationKey as string, true);

        this.sprite = idle;

        this.createIdleAnimation(0, 8);

        this.sprite.play(this.idleAnimationKey as string, true);

        this.ready = true;
        if (this.silhouette?.active) {
          this.silhouette?.destroy();
        }
      });
    }
    scene.load.start();
  }

  private createIdleAnimation(start: number, end: number) {
    if (!this.scene || !this.scene.anims) return;

    this.scene.anims.create({
      key: this.idleAnimationKey,
      frames: this.scene.anims.generateFrameNumbers(this.spriteKey as string, {
        start,
        end,
      }),
      repeat: -1,
      frameRate: 10,
    });
  }
}
