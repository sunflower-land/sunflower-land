import { PetNFTType } from "features/game/types/pets";
import { SpeechBubble } from "./SpeechBubble";
import { petImageDomain } from "features/island/pets/lib/petShared";

export class PetContainer extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;
  private petId: number;
  private petType: PetNFTType;
  public speech: SpeechBubble | undefined;

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

    scene.load.spritesheet(
      `pet_${petId}`,
      `https://${petImageDomain}.sunflower-land.com/sheets/${petId}.webp`,
      {
        frameWidth: 44,
        frameHeight: 44,
      },
    );

    scene.load.once(`filecomplete-spritesheet-pet_${petId}`, () => {
      this.sprite = this.scene.add.sprite(0, 0, `pet_${petId}`);
      this.add(this.sprite);

      this.sprite?.setScale(0.75);

      this.sprite?.anims.create({
        key: `pet_${petId}-idle`,
        frames: this.sprite.anims.generateFrameNumbers(`pet_${petId}`, {
          start: 0,
          end: 8,
        }),
        frameRate: 8,
        repeat: -1,
      });

      this.sprite?.anims.create({
        key: `pet_${petId}-walking`,
        frames: this.sprite.anims.generateFrameNumbers(`pet_${petId}`, {
          start: 18,
          end: 25,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.sprite?.play(`pet_${petId}-idle`, true);

      this.sprite
        ?.setInteractive({ cursor: "pointer" })
        .on("pointerdown", () => {
          this.speak(this.getRandomSpeech());
        });
    });

    scene.load.start();
    scene.add.existing(this);
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
    this.sprite?.play(`pet_${this.petId}-idle`, true);
  }

  public walk() {
    this.sprite?.play(`pet_${this.petId}-walking`, true);
  }
}
