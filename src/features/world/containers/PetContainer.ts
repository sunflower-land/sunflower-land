import { PetNFTType } from "features/game/types/pets";
import { SpeechBubble } from "./SpeechBubble";
import { petImageDomain } from "features/island/pets/lib/petShared";

const LOVE_AURA_KEY = "love_aura";
const LOVE_AURA_ANIM_KEY = "love_aura_pat";
/** Total pat effect duration (fade in + visible loop + fade out). */
const PAT_EFFECT_TOTAL_MS = 3000;
const PAT_FADE_IN_MS = 250;
const PAT_FADE_OUT_MS = 250;
/** Local Y below pet sprite center (44×44 frame, scale 0.75) — sits at feet. */
const PAT_AURA_LOCAL_Y = 0;
const PAT_AURA_SCALE = 1.5;

export class PetContainer extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;
  private petId: number;
  private petType: PetNFTType;
  public speech: SpeechBubble | undefined;
  private patAura?: Phaser.GameObjects.Sprite;
  private patAuraTweens: Phaser.Tweens.Tween[] = [];
  private patAuraFadeOutTimer?: Phaser.Time.TimerEvent;

  private static SPEECH_BY_TYPE: Partial<Record<PetNFTType, string[]>> = {
    Dragon: ["Roaaar!", "Grrrr!", "Ssshh!"],
    Phoenix: ["Caw!", "Shriek!", "Fwoosh!"],
    Griffin: ["Screech!", "Caw!", "Ruffle!"],
    Ram: ["Baa!", "Maa!", "Snort!"],
    Warthog: ["Oink!", "Grunt!", "Snort!"],
    Wolf: ["Awooo!", "Grrr!", "Yip!"],
    Bear: ["Grrr!", "Rawr!", "Sniff!"],
  };

  private getRandomSpeech(): string {
    const speech = PetContainer.SPEECH_BY_TYPE[this.petType] ?? [
      "Chirp!",
      "Squeak!",
      "Growl!",
      "Purr!",
    ];
    const idx = Math.floor(Math.random() * speech.length);
    return speech[idx];
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    petId: number,
    petType: PetNFTType,
  ) {
    super(scene, x, y);
    this.petId = petId;
    this.petType = petType;

    const spritesheetKey = `pet_${petId}`;
    const spritesheetUrl = `https://${petImageDomain}.sunflower-land.com/sheets/${petId}.webp`;

    if (scene.textures.exists(spritesheetKey)) {
      this.createSprite(scene, spritesheetKey);
    } else {
      scene.load.spritesheet(spritesheetKey, spritesheetUrl, {
        frameWidth: 44,
        frameHeight: 44,
      });

      scene.load.once(`filecomplete-spritesheet-${spritesheetKey}`, () => {
        this.createSprite(scene, spritesheetKey);
      });

      scene.load.start();
    }

    scene.add.existing(this);
    this.setVisible(true);
    this.setActive(true);
  }

  private createSprite(scene: Phaser.Scene, spritesheetKey: string) {
    if (this.sprite) return;

    this.sprite = scene.add.sprite(0, 0, spritesheetKey);
    this.add(this.sprite);

    this.sprite?.setScale(0.75);
    this.sprite?.setVisible(true);
    this.sprite?.setActive(true);

    if (!scene.anims.exists(`${spritesheetKey}-idle`)) {
      scene.anims.create({
        key: `${spritesheetKey}-idle`,
        frames: scene.anims.generateFrameNumbers(spritesheetKey, {
          start: 0,
          end: 8,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(`${spritesheetKey}-walking`)) {
      scene.anims.create({
        key: `${spritesheetKey}-walking`,
        frames: scene.anims.generateFrameNumbers(spritesheetKey, {
          start: 18,
          end: 25,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    this.sprite?.play(`${spritesheetKey}-idle`, true);

    this.sprite?.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      this.playPatEffect();
      this.speak(this.getRandomSpeech());
    });
  }

  private static ensureLoveAuraAnim(scene: Phaser.Scene) {
    if (scene.anims.exists(LOVE_AURA_ANIM_KEY)) return;

    // Strip is 160×19 → eight 20×19 frames (indices 0–7).
    scene.anims.create({
      key: LOVE_AURA_ANIM_KEY,
      frames: scene.anims.generateFrameNumbers(LOVE_AURA_KEY, {
        start: 0,
        end: 7,
      }),
      frameRate: 12,
      repeat: -1,
    });
  }

  private clearPatEffect() {
    this.patAuraFadeOutTimer?.remove(false);
    this.patAuraFadeOutTimer = undefined;
    this.patAuraTweens.forEach((tween) => tween.stop());
    this.patAuraTweens = [];
    if (this.patAura?.active) {
      this.patAura.destroy();
    }
    this.patAura = undefined;
  }

  /**
   * “Pat” feedback: love aura spritesheet at the pet’s feet (drawn in front of the pet), ~3s with fade in/out.
   * Retapping restarts the effect.
   */
  private playPatEffect() {
    if (!this.scene.textures.exists(LOVE_AURA_KEY)) return;

    this.clearPatEffect();
    PetContainer.ensureLoveAuraAnim(this.scene);

    const aura = this.scene.add.sprite(0, PAT_AURA_LOCAL_Y, LOVE_AURA_KEY, 0);
    aura.setScale(PAT_AURA_SCALE);
    this.add(aura);
    aura.setAlpha(0);
    aura.play(LOVE_AURA_ANIM_KEY);
    this.patAura = aura;

    const fadeIn = this.scene.tweens.add({
      targets: aura,
      alpha: 1,
      duration: PAT_FADE_IN_MS,
      ease: "Sine.easeIn",
    });
    this.patAuraTweens.push(fadeIn);

    const fadeOutStartAt = PAT_EFFECT_TOTAL_MS - PAT_FADE_OUT_MS;

    this.patAuraFadeOutTimer = this.scene.time.delayedCall(
      fadeOutStartAt,
      () => {
        const fadeOut = this.scene.tweens.add({
          targets: aura,
          alpha: 0,
          duration: PAT_FADE_OUT_MS,
          ease: "Sine.easeOut",
          onComplete: () => {
            if (aura.active) {
              aura.destroy();
            }
            if (this.patAura === aura) {
              this.patAura = undefined;
            }
          },
        });
        this.patAuraTweens.push(fadeOut);
      },
    );
  }

  override destroy(fromScene?: boolean): void {
    this.clearPatEffect();
    super.destroy(fromScene);
  }

  public speak(text: string) {
    if (this.speech?.active) {
      this.speech.destroy();
    }

    this.speech = new SpeechBubble(
      this.scene,
      text,
      this.sprite?.scaleX === 1 ? "right" : "left",
    );
    this.add(this.speech);

    // Auto-destroy speech bubble after 3 seconds
    this.scene.time.delayedCall(3000, () => {
      this.stopSpeaking();
    });
  }

  public stopSpeaking() {
    if (this.speech?.active) {
      this.speech?.destroy();
    }
    this.speech = undefined;
  }

  public faceRight() {
    this.sprite?.setFlipX(true);
  }

  public faceLeft() {
    this.sprite?.setFlipX(false);
  }

  public idle() {
    const textureKey = `pet_${this.petId}`;
    this.sprite?.play(`${textureKey}-idle`, true);
  }

  public walk() {
    const textureKey = `pet_${this.petId}`;
    this.sprite?.play(`${textureKey}-walking`, true);
  }
}
