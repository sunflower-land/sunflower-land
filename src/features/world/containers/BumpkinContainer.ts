import { SQUARE_WIDTH } from "features/game/lib/constants";
import { SpeechBubble } from "./SpeechBubble";
import { buildNPCSheets } from "features/bumpkins/actions/buildNPCSheets";
import { tokenUriBuilder } from "lib/utils/tokenUriBuilder";
import { Label } from "./Label";
import debounce from "lodash.debounce";
import { Player } from "../types/Room";
import { NPCName, acknowledgedNPCs } from "lib/npcs";
import { ReactionName } from "features/pumpkinPlaza/components/Reactions";
import { getAnimationUrl } from "../lib/animations";
import { FactionName, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { CONFIG } from "lib/config";
import { formatNumber } from "lib/utils/formatNumber";

const NAME_ALIASES: Partial<Record<NPCName, string>> = {
  "pumpkin' pete": "pete",
  "hammerin harry": "auctioneer",
};
export const NPCS_WITH_ALERTS: Partial<Record<NPCName, boolean>> = {
  "pumpkin' pete": true,
  hank: true,
  santa: true,
  chase: true,
};

export class BumpkinContainer extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;
  public shadow: Phaser.GameObjects.Sprite | undefined;
  public alert: Phaser.GameObjects.Sprite | undefined;
  public silhouette: Phaser.GameObjects.Sprite | undefined;
  public skull: Phaser.GameObjects.Sprite | undefined;

  public speech: SpeechBubble | undefined;
  public reaction: Phaser.GameObjects.Group;
  public invincible = false;

  public icon: Phaser.GameObjects.Sprite | undefined;
  public fx: Phaser.GameObjects.Sprite | undefined;
  public label: Label | undefined;
  public backfx: Phaser.GameObjects.Sprite | undefined;
  public frontfx: Phaser.GameObjects.Sprite | undefined;
  public previousPosition:
    | { x: number; y: number; timestamp: number }
    | undefined;

  public clothing: Player["clothing"];
  public faction: FactionName | undefined;
  private ready = false;

  // Animation Keys
  private spriteKey: string | undefined;
  private idleAnimationKey: string | undefined;
  private walkingAnimationKey: string | undefined;
  private digAnimationKey: string | undefined;
  private drillAnimationKey: string | undefined;
  private backAuraKey: string | undefined;
  private frontAuraKey: string | undefined;
  private frontAuraAnimationKey: string | undefined;
  private backAuraAnimationKey: string | undefined;
  private direction: "left" | "right" = "right";

  constructor({
    scene,
    x,
    y,
    clothing,
    onClick,
    name,
    direction,
    faction,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    clothing: Player["clothing"];
    onClick?: () => void;
    onCollide?: () => void;
    name?: string;
    direction?: "left" | "right";
    faction?: FactionName;
  }) {
    super(scene, x, y);
    this.scene = scene;
    this.clothing = clothing;
    this.direction = direction ?? "right";
    scene.physics.add.existing(this);

    this.silhouette = scene.add.sprite(0, 0, "silhouette");
    this.add(this.silhouette);
    this.sprite = this.silhouette;

    this.shadow = this.scene.add
      .sprite(0.5, 8, "shadow")
      .setSize(SQUARE_WIDTH, SQUARE_WIDTH);
    this.add(this.shadow).moveTo(this.shadow, 0);

    this.loadSprites(scene);

    this.setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.reaction = this.scene.add.group();

    this.faction = faction;

    if (name) {
      const text = NAME_ALIASES[name as NPCName] ?? name;
      const label = new Label(this.scene, text.toUpperCase());
      this.add(label);
      label.setPosition(label.width / 2, -16);
      if (
        !!NPCS_WITH_ALERTS[name as NPCName] &&
        !acknowledgedNPCs()[name as NPCName] &&
        this.scene.textures.exists("alert")
      ) {
        this.alert = this.scene.add.sprite(1, -23, "alert").setSize(4, 10);
        this.add(this.alert);
      }

      this.label = label;
    }

    this.scene.add.existing(this);

    if (onClick) {
      this.setInteractive({ cursor: "pointer" }).on(
        "pointerdown",
        (p: Phaser.Input.Pointer) => {
          if (p.downElement.nodeName === "CANVAS") {
            onClick();

            if (name && this.alert?.active) {
              this.alert?.destroy();
            }
          }
        },
      );
    }

    if (clothing.shirt === "Gift Giver") {
      this.showGift();
    }
    this.showAura();
  }

  public teleport(x: number, y: number) {
    this.setPosition(x, y);
  }

  get directionFacing() {
    return this.direction;
  }

  private async loadSprites(scene: Phaser.Scene) {
    this.spriteKey = tokenUriBuilder(this.clothing);
    this.idleAnimationKey = `${this.spriteKey}-bumpkin-idle`;
    this.walkingAnimationKey = `${this.spriteKey}-bumpkin-walking`;
    this.digAnimationKey = `${this.spriteKey}-bumpkin-dig`;
    this.drillAnimationKey = `${this.spriteKey}-bumpkin-drilling`;

    await buildNPCSheets({
      parts: this.clothing,
    }); //Removing this causes Aura to not show onload

    if (scene.textures.exists(this.spriteKey)) {
      // If we have idle sheet then we can create the idle animation and set the sprite up straight away
      const idle = scene.add.sprite(0, 2, this.spriteKey).setOrigin(0.5);
      this.add(idle);
      if (this.clothing.aura !== undefined) {
        this.moveTo(idle, 2);
      } else if (this.clothing.aura === undefined && this.shadow?.active) {
        this.moveTo(idle, 1);
      }
      this.sprite = idle;

      if (this.direction === "left") {
        this.faceLeft();
      }

      this.sprite.play(this.idleAnimationKey, true);

      if (this.silhouette?.active) {
        this.silhouette?.destroy();
      }

      this.ready = true;
    } else {
      const url = getAnimationUrl(this.clothing, [
        "idle",
        "walking",
        "dig",
        "drilling",
      ]);
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
        if (this.clothing.aura !== undefined) {
          this.moveTo(idle, 2);
        } else if (this.clothing.aura === undefined && this.shadow?.active) {
          this.moveTo(idle, 1);
        }

        this.sprite = idle;

        if (this.direction === "left") {
          this.faceLeft();
        }

        this.createIdleAnimation(0, 8);
        this.createWalkingAnimation(9, 16);
        this.createDigAnimation(17, 29);
        this.createDrillAnimation(30, 38);
        this.sprite.play(this.idleAnimationKey as string, true);

        this.ready = true;
        if (this.silhouette?.active) {
          this.silhouette?.destroy();
        }
      });
    }

    scene.load.start();
  }

  private createDrillAnimation(start: number, end: number) {
    if (!this.scene || !this.scene.anims) return;

    this.scene.anims.create({
      key: this.drillAnimationKey,
      frames: this.scene.anims.generateFrameNumbers(this.spriteKey as string, {
        start,
        end,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  private createDigAnimation(start: number, end: number) {
    if (!this.scene || !this.scene.anims) return;

    this.scene.anims.create({
      key: this.digAnimationKey,
      frames: this.scene.anims.generateFrameNumbers(this.spriteKey as string, {
        start,
        end,
      }),
      frameRate: 10,
      repeat: -1,
    });
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

  private createFrontAuraAnimation() {
    if (!this.scene || !this.scene.anims) return;

    this.scene.anims.create({
      key: this.frontAuraAnimationKey,
      frames: this.scene.anims.generateFrameNumbers(
        this.frontAuraKey as string,
        {
          start: 0,
          end: 7,
        },
      ),
      repeat: -1,
      frameRate: 10,
    });
  }

  private createBackAuraAnimation() {
    if (!this.scene || !this.scene.anims) return;

    this.scene.anims.create({
      key: this.backAuraAnimationKey,
      frames: this.scene.anims.generateFrameNumbers(
        this.backAuraKey as string,
        {
          start: 0,
          end: 7,
        },
      ),
      repeat: -1,
      frameRate: 10,
    });
  }

  private createWalkingAnimation(start: number, end: number) {
    if (!this.scene || !this.scene.anims) return;

    this.scene.anims.create({
      key: this.walkingAnimationKey,
      frames: this.scene.anims.generateFrameNumbers(this.spriteKey as string, {
        start,
        end,
      }),
      repeat: -1,
      frameRate: 10,
    });
  }

  public changeClothing(clothing: Player["clothing"]) {
    if (!this.ready) return;
    if (this.clothing.updatedAt === clothing.updatedAt) return;
    this.clothing.updatedAt = clothing.updatedAt;

    if (tokenUriBuilder(clothing) === tokenUriBuilder(this.clothing)) return;
    this.ready = false;
    if (this.sprite?.active) {
      this.sprite?.destroy();
    }

    if (
      this.clothing.shirt !== "Gift Giver" &&
      clothing.shirt === "Gift Giver"
    ) {
      this.showGift();
    }

    if (
      this.clothing.shirt === "Gift Giver" &&
      clothing.shirt !== "Gift Giver"
    ) {
      this.removeGift();
    }
    if (this.clothing.aura === clothing.aura || clothing.aura === undefined) {
      this.removeAura();
    }

    this.clothing = clothing;

    this.loadSprites(this.scene);
    if (clothing.aura !== undefined) {
      this.showAura();
    }

    this.showSmoke();
  }

  public showGift() {
    if (this.icon) {
      this.removeGift();
    }

    this.icon = this.scene.add.sprite(0, -12, "gift_icon").setOrigin(0.5);
    this.add(this.icon);

    if (this.scene.textures.exists("sparkle")) {
      this.fx = this.scene.add.sprite(0, -8, "sparkle").setOrigin(0.5).setZ(10);
      this.add(this.fx);

      this.scene.anims.create({
        key: `sparkel_anim`,
        frames: this.scene.anims.generateFrameNumbers("sparkle", {
          start: 0,
          end: 6,
        }),
        repeat: -1,
        frameRate: 10,
      });

      this.fx.play(`sparkel_anim`, true);
    }
  }

  private removeGift() {
    if (this.icon?.active) {
      this.icon.destroy();
    }

    this.icon = undefined;

    if (this.fx?.active) {
      this.fx.destroy();
    }

    this.fx = undefined;
  }

  public showAura() {
    //If Bumpkin has an Aura equipped
    if (this.frontfx && this.backfx) {
      this.removeAura();
    }

    if (this.clothing?.aura) {
      if (!this.clothing?.aura) return; // Returns when no aura equipped
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const container = this;
      const auraName = this.clothing.aura;
      const auraID = ITEM_IDS[auraName];

      this.frontAuraKey = `${auraID}-bumpkin-aura-front-sheet`;
      this.frontAuraAnimationKey = `${auraID}-bumpkin-aura-front`;
      this.backAuraKey = `${auraID}-bumpkin-aura-back-sheet`;
      this.backAuraAnimationKey = `${auraID}-bumpkin-aura-back`;

      //Back-Aura
      if (container.scene.textures.exists(this.backAuraKey)) {
        const backaura = container.scene.add
          .sprite(0, -3, this.backAuraKey)
          .setOrigin(0.5);
        this.add(backaura);
        this.moveTo(backaura, 1);
        this.backfx = backaura;

        this.createBackAuraAnimation();
        this.backfx.play(this.backAuraAnimationKey as string, true);
      } else {
        const backauraLoader = container.scene.load.spritesheet(
          this.backAuraKey,
          `${CONFIG.PROTECTED_IMAGE_URL}/aura/back/${ITEM_IDS[auraName]}.png`,
          {
            frameWidth: 20,
            frameHeight: 19,
          },
        );

        backauraLoader.once(
          `filecomplete-spritesheet-${this.backAuraKey}`,
          () => {
            if (
              !container.scene.textures.exists(this.backAuraKey as string) ||
              this.ready
            ) {
              return;
            }
            const backaura = container.scene.add
              .sprite(0, -3, this.backAuraKey as string)
              .setOrigin(0.5);
            this.add(backaura);
            this.moveTo(backaura, 1);
            this.backfx = backaura;

            this.createBackAuraAnimation();
            this.backfx.play(this.backAuraAnimationKey as string, true);
          },
        );
      }
      //Front-Aura
      if (container.scene.textures.exists(this.frontAuraKey)) {
        const frontaura = container.scene.add
          .sprite(0, 2, this.frontAuraKey)
          .setOrigin(0.5);
        this.add(frontaura);
        this.moveTo(frontaura, 3);
        this.frontfx = frontaura;

        this.createFrontAuraAnimation();
        this.frontfx.play(this.frontAuraAnimationKey as string, true);
      } else {
        const frontauraLoader = container.scene.load.spritesheet(
          this.frontAuraKey,
          `${CONFIG.PROTECTED_IMAGE_URL}/aura/front/${ITEM_IDS[auraName]}.png`,
          {
            frameWidth: 20,
            frameHeight: 19,
          },
        );

        frontauraLoader.once(
          `filecomplete-spritesheet-${this.frontAuraKey}`,
          () => {
            if (
              !container.scene.textures.exists(this.frontAuraKey as string) ||
              this.ready
            ) {
              return;
            }
            const frontaura = container.scene.add
              .sprite(0, 2, this.frontAuraKey as string)
              .setOrigin(0.5);
            this.add(frontaura);
            this.moveTo(frontaura, 3);
            this.frontfx = frontaura;

            this.createFrontAuraAnimation();
            this.frontfx.play(this.frontAuraAnimationKey as string, true);
          },
        );
      }
    }
  }

  private removeAura() {
    //Removes the Aura before loading sprite
    if (this.frontfx?.active) {
      this.frontfx.destroy();
    }

    this.frontfx = undefined;

    if (this.backfx?.active) {
      this.backfx.destroy();
    }

    this.backfx = undefined;
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

  /**
   * Use a debouncer to allow players new messages not to be destroyed by old timeouts
   */
  destroyReaction = debounce(() => {
    this.stopReaction();
  }, 5000);

  public stopReaction() {
    this.reaction.clear(true, true);
    this.destroyReaction.cancel();
  }

  public stopSpeaking() {
    if (this.speech?.active) {
      this.speech?.destroy();
    }
    this.speech = undefined;

    this.destroySpeechBubble.cancel();
    this.label?.setVisible(true);
  }

  public speak(text: string) {
    this.stopReaction();
    this.label?.setVisible(false);

    if (this.speech?.active) {
      this.speech.destroy();
    }

    this.speech = new SpeechBubble(
      this.scene,
      text,
      this.sprite?.scaleX === 1 ? "right" : "left",
    );
    this.add(this.speech);

    this.destroySpeechBubble();
  }

  get isSpeaking() {
    return !!this.speech;
  }

  /**
   * Load texture from URL or Data API. Returns immediately if texture already exists.
   * @param key - Texture key
   * @param url - URL or Data API
   * @param onLoad - Callback when texture is loaded. Fired instantly if texture already exists.
   * @returns
   */
  private loadTexture(key: string, url: string, onLoad: () => void) {
    if (this.scene.textures.exists(key)) {
      onLoad();
    } else if (url.startsWith("data:")) {
      this.scene.textures.addBase64(key, url);
      this.scene.textures.once("addtexture", () => onLoad());
    } else {
      this.scene.load.image(key, url);
      this.scene.load.once(`filecomplete-image-${key}`, () => onLoad());
      this.scene.load.start();
    }
  }

  private _react(react: ReactionName | InventoryItemName, quantity?: number) {
    this.stopSpeaking();

    this.reaction.clear(true, true);

    if (!this.scene.textures.exists(react)) {
      return;
    }

    let offsetReaction = false;
    if (quantity) {
      const label = this.scene.add.bitmapText(
        0,
        -16,
        "Teeny Tiny Pixls",
        `+${formatNumber(quantity)}`,
        5,
        1,
      );
      label.setX(-label.width);
      offsetReaction = true;

      this.add(label);
      this.reaction.add(label);
    }

    const reaction = this.scene.add.sprite(0, -14, react);
    if (reaction.displayWidth > reaction.displayHeight) {
      reaction.displayWidth = 10;
      reaction.scaleY = reaction.scaleX;
    } else {
      reaction.displayHeight = 10;
      reaction.scaleX = reaction.scaleY;
    }

    if (offsetReaction) {
      reaction.setX(reaction.displayWidth / 2);
    }
    this.add(reaction);
    this.reaction.add(reaction);

    this.destroyReaction();
  }

  public react(reaction: ReactionName | InventoryItemName, quantity?: number) {
    if (this.scene.textures.exists(reaction)) {
      return this._react(reaction, quantity);
    }

    if (reaction in ITEM_DETAILS) {
      const image = ITEM_DETAILS[reaction as InventoryItemName].image;

      this.loadTexture(reaction, image, () => {
        this._react(reaction, quantity);
      });
    }
  }

  public dig() {
    if (
      this.sprite?.anims &&
      this.scene?.anims.exists(this.digAnimationKey as string) &&
      this.sprite?.anims.getName() !== this.digAnimationKey
    ) {
      try {
        this.sprite.anims.play(this.digAnimationKey as string, true);
        this.scene.sound.play("dig", { volume: 0.1 });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Bumpkin Container: Error playing dig animation: ", e);
      }
    }
  }

  public drill() {
    if (
      this.sprite?.anims &&
      this.scene?.anims.exists(this.drillAnimationKey as string) &&
      this.sprite?.anims.getName() !== this.drillAnimationKey
    ) {
      try {
        this.sprite.anims.play(this.drillAnimationKey as string, true);
        this.scene.sound.play("drill", { volume: 0.1 });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Bumpkin Container: Error playing drill animation: ", e);
      }
    }
  }

  public walk() {
    if (
      this.sprite?.anims &&
      this.scene?.anims.exists(this.walkingAnimationKey as string) &&
      this.sprite?.anims.getName() !== this.walkingAnimationKey
    ) {
      try {
        this.sprite.anims.play(this.walkingAnimationKey as string, true);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Bumpkin Container: Error playing walk animation: ", e);
      }
    }
  }

  public idle() {
    if (
      this.sprite?.anims &&
      this.scene?.anims.exists(this.idleAnimationKey as string) &&
      this.sprite?.anims.getName() !== this.idleAnimationKey
    ) {
      try {
        this.sprite.anims.play(this.idleAnimationKey as string, true);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Bumpkin Container: Error playing idle animation: ", e);
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

      if (tween && tween.isPlaying()) {
        tween.remove();
      }
    }, 2000);
  }

  private destroyed = false;
  public disappear() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const container = this;

    if (container.destroyed || !container.scene || !container.active) {
      return;
    }

    this.destroyed = true;

    if (this.sprite?.active) {
      this.sprite?.destroy();
    }
    if (this.shadow?.active) {
      this.shadow?.destroy();
    }
    if (this.frontfx?.active) {
      this.frontfx?.destroy();
    }
    if (this.backfx?.active) {
      this.backfx?.destroy();
    }
    if (this.icon?.active) {
      this.icon?.destroy();
    }
    if (this.fx?.active) {
      this.fx?.destroy();
    }

    const poof = this.scene.add.sprite(0, 4, "poof").setOrigin(0.5);
    this.add(poof);

    if (this.scene.anims.exists("poof_anim")) {
      poof.play("poof_anim", true);
    } else {
      this.scene.anims.create({
        key: `poof_anim`,
        frames: this.scene.anims.generateFrameNumbers("poof", {
          start: 0,
          end: 8,
        }),
        repeat: 0,
        frameRate: 10,
      });

      poof.play(`poof_anim`, true);
    }

    // Listen for the animation complete event
    poof.on("animationcomplete", function (animation: { key: string }) {
      if (animation.key === "poof_anim" && container.active) {
        container.destroy();
      }
    });
  }

  public showSmoke() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const container = this;

    if (container.destroyed || !container.scene) {
      return;
    }

    if (container.scene.textures.exists("smoke")) {
      const poof = this.scene.add.sprite(0, 4, "smoke").setOrigin(0.5);
      this.add(poof);
      this.bringToTop(poof);

      this.scene.anims.create({
        key: `smoke_anim`,
        frames: this.scene.anims.generateFrameNumbers("smoke", {
          start: 0,
          end: 20,
        }),
        repeat: -1,
        frameRate: 10,
      });

      poof.play(`smoke_anim`, true);

      // Listen for the animation complete loop event
      poof.on("animationrepeat", function (animation: { key: string }) {
        if (animation.key === "smoke_anim" && container.ready && poof.active) {
          // This block will execute every time the animation loop completes
          poof.destroy();
        }
      });
    }
  }

  public addOnClick(onClick: () => void) {
    this.setInteractive({ cursor: "pointer" }).on(
      "pointerdown",
      (p: Phaser.Input.Pointer) => {
        if (p.downElement.nodeName === "CANVAS") {
          onClick();
        }
      },
    );
  }
}
