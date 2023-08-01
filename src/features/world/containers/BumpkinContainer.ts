import { SQUARE_WIDTH } from "features/game/lib/constants";
import { SpeechBubble } from "./SpeechBubble";
import { buildNPCSheets } from "features/bumpkins/actions/buildNPCSheets";
import { tokenUriBuilder } from "lib/utils/tokenUriBuilder";
import { Label } from "./Label";
import debounce from "lodash.debounce";
import { Player } from "../types/Room";
import { NPCName, acknowedlgedNPCs } from "lib/npcs";

const NPCS_WITH_ALERTS: Partial<Record<NPCName, boolean>> = {
  "pumpkin' pete": true,
  luna: true,
  birdie: true,
  hank: true,
};

export class BumpkinContainer extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;
  public alert: Phaser.GameObjects.Sprite | undefined;
  public silhoutte: Phaser.GameObjects.Sprite | undefined;

  public speech: SpeechBubble | undefined;
  public invincible = false;
  public isWalking = false;

  private clothing: Player["clothing"];
  private ready = false;

  // Animation Keys
  private idleSpriteKey: string | undefined;
  private walkingSpriteKey: string | undefined;
  private idleAnimationKey: string | undefined;
  private walkingAnimationKey: string | undefined;
  private direction: "left" | "right" = "right";

  constructor({
    scene,
    x,
    y,
    clothing,
    onClick,
    name,
    direction,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    clothing: Player["clothing"];
    onClick?: () => void;
    onCollide?: () => void;
    name?: string;
    direction?: "left" | "right";
  }) {
    super(scene, x, y);
    this.scene = scene;
    this.clothing = clothing;
    this.direction = direction ?? "right";
    scene.physics.add.existing(this);

    this.silhoutte = scene.add.sprite(0, 0, "silhouette");
    this.add(this.silhoutte);
    this.sprite = this.silhoutte;

    this.loadSprites(scene);

    const shadow = this.scene.add
      .sprite(0.5, 8, "shadow")
      .setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.add(shadow);

    this.setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    if (name) {
      const label = new Label(this.scene, name.toUpperCase());
      this.add(label);
      label.setPosition(label.width / 2, -16);
      if (
        !!NPCS_WITH_ALERTS[name as NPCName] &&
        !acknowedlgedNPCs()[name as NPCName] &&
        this.scene.textures.exists("alert")
      ) {
        this.alert = this.scene.add.sprite(1, -23, "alert").setSize(4, 10);
        this.add(this.alert);
      }
    }

    this.scene.add.existing(this);

    if (onClick) {
      this.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
        onClick();

        if (name) {
          this.alert?.destroy();
        }
      });
    }
  }

  get directionFacing() {
    return this.direction;
  }

  private async loadSprites(scene: Phaser.Scene) {
    const keyName = tokenUriBuilder(this.clothing);
    this.idleSpriteKey = `${keyName}-bumpkin-idle-sheet`;
    this.walkingSpriteKey = `${keyName}-bumpkin-walking-sheet`;
    this.idleAnimationKey = `${keyName}-bumpkin-idle`;
    this.walkingAnimationKey = `${keyName}-bumpkin-walking`;

    const { sheets } = await buildNPCSheets({
      parts: this.clothing,
    });

    if (scene.textures.exists(this.idleSpriteKey)) {
      const idle = scene.add.sprite(0, 0, this.idleSpriteKey).setOrigin(0.5);
      this.add(idle);
      this.sprite = idle;

      if (this.direction === "left") {
        this.faceLeft();
      }

      this.sprite.play(this.idleAnimationKey, true);

      this.silhoutte?.destroy();

      this.ready = true;
    } else {
      const idleLoader = scene.load.spritesheet(
        this.idleSpriteKey,
        sheets.idle,
        {
          frameWidth: 20,
          frameHeight: 19,
        }
      );

      idleLoader.addListener(Phaser.Loader.Events.COMPLETE, () => {
        if (
          !scene.textures.exists(this.idleSpriteKey as string) ||
          this.ready
        ) {
          return;
        }

        const idle = scene.add
          .sprite(0, 0, this.idleSpriteKey as string)
          .setOrigin(0.5);
        this.add(idle);
        this.sprite = idle;

        if (this.direction === "left") {
          this.faceLeft();
        }

        scene.anims.create({
          key: this.idleAnimationKey,
          frames: scene.anims.generateFrameNumbers(
            this.idleSpriteKey as string,
            {
              start: 0,
              end: 8,
            }
          ),
          repeat: -1,
          frameRate: 10,
        });

        this.sprite.play(this.idleAnimationKey as string, true);

        this.ready = true;
        this.silhoutte?.destroy();

        idleLoader.removeAllListeners();
      });
    }

    if (!scene.textures.exists(this.walkingSpriteKey)) {
      const walkingLoader = scene.load.spritesheet(
        this.walkingSpriteKey,
        sheets.walking,
        {
          frameWidth: 20,
          frameHeight: 19,
        }
      );

      walkingLoader.on(Phaser.Loader.Events.COMPLETE, () => {
        scene.anims.create({
          key: this.walkingAnimationKey,
          frames: scene.anims.generateFrameNumbers(
            this.walkingSpriteKey as string,
            {
              start: 0,
              end: 7,
            }
          ),
          repeat: -1,
          frameRate: 10,
        });
      });
    }

    scene.load.start();
  }

  public changeClothing(clothing: Player["clothing"]) {
    if (!this.ready) return;
    if (this.clothing.updatedAt === clothing.updatedAt) return;
    this.clothing.updatedAt = clothing.updatedAt;

    if (tokenUriBuilder(clothing) === tokenUriBuilder(this.clothing)) return;

    this.ready = false;
    this.sprite?.destroy();

    this.clothing = clothing;
    this.loadSprites(this.scene);
  }

  public faceRight() {
    if (this.sprite?.scaleX === 1) return;

    this.direction = "right";
    this.sprite?.setScale(1, 1);

    if (this.speech) {
      this.speech.setScale(1, 1);
      this.speech.changeDirection("right");
    }
  }

  public faceLeft() {
    if (this.sprite?.scaleX === -1) return;

    this.direction = "left";
    this.sprite?.setScale(-1, 1);

    if (this.speech) {
      this.speech.changeDirection("left");
    }
  }

  /**
   * Use a debouncer to allow players new messages not to be destroyed by old timeouts
   */
  destroySpeechBubble = debounce(() => {
    this.stopSpeaking();
  }, 5000);

  public stopSpeaking() {
    this.speech?.destroy();
    this.speech = undefined;

    this.destroySpeechBubble.cancel();
  }

  public speak(text: string) {
    if (this.speech) {
      this.speech.destroy();
    }

    this.speech = new SpeechBubble(
      this.scene,
      text,
      this.sprite?.scaleX === 1 ? "right" : "left"
    );
    this.add(this.speech);

    this.destroySpeechBubble();
  }

  public walk() {
    if (
      this.sprite?.anims &&
      this.scene?.anims.exists(this.walkingAnimationKey as string) &&
      this.sprite?.anims.getName() !== this.walkingAnimationKey
    ) {
      this.sprite.anims.play(this.walkingAnimationKey as string, true);
      this.isWalking = true;
    }
  }

  public idle() {
    if (
      this.sprite?.anims &&
      this.scene?.anims.exists(this.idleAnimationKey as string) &&
      this.sprite?.anims.getName() !== this.idleAnimationKey
    ) {
      this.sprite.anims.play(this.idleAnimationKey as string, true);
      if (this.isWalking) {
        this.isWalking = false;
      }
    }
  }

  public hitPlayer() {
    this.invincible = true;

    // make sprite flash opacity
    const tween = this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.5,
      duration: 100,
      ease: "Linear",
      repeat: -1,
      yoyo: true,
    });

    setTimeout(() => {
      this.invincible = false;
      tween.remove();
    }, 2000);
  }
}
