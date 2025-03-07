import debounce from "lodash.debounce";
import { SpeechBubble } from "./SpeechBubble";
import { Label } from "./Label";
import { SQUARE_WIDTH } from "features/game/lib/constants";

export class DogContainer extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;
  public shadow: Phaser.GameObjects.Sprite | undefined;
  private dogNumber: 1 | 2;
  public speech: SpeechBubble | undefined;
  public label: Label | undefined;

  private readonly dogMessages = [
    "Woof!",
    "Ruff!",
    "Arf!",
    "Yip!",
    "Bark!",
    "Awoooo!",
    "Yap!",
    "Grrrr...",
    "Woof woof!",
  ];

  destroySpeechBubble = debounce(() => {
    this.stopSpeaking();
  }, 5000);

  public stopSpeaking() {
    if (this.speech?.active) {
      this.speech?.destroy();
    }
    this.speech = undefined;

    this.destroySpeechBubble.cancel();
    this.label?.setVisible(true);
  }

  public speak(text: string) {
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

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    dogNumber: 1 | 2,
    onPatted: () => void,
  ) {
    super(scene, x, y);
    this.dogNumber = dogNumber;

    this.shadow = this.scene.add
      .sprite(4, 8, "shadow")
      .setSize(SQUARE_WIDTH, SQUARE_WIDTH);
    this.add(this.shadow).moveTo(this.shadow, 0);

    this.sprite = this.scene.add.sprite(0, 0, `dog_${this.dogNumber}`);
    this.add(this.sprite);

    scene.add.existing(this);

    // Make sprite interactive and handle clicks
    this.sprite?.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      // Show random message
      this.speak(
        this.dogMessages[Math.floor(Math.random() * this.dogMessages.length)],
      );

      // Emit reaction event to scene
      onPatted();
    });

    // Walking animation
    this.sprite?.anims.create({
      key: `dog_${this.dogNumber}-walking`,
      frames: this.sprite?.anims.generateFrameNumbers(`dog_${this.dogNumber}`, {
        start: 0,
        end: 6,
      }),
      frameRate: 1000 / 70,
      repeat: -1,
    });

    // Idle animation
    this.sprite?.anims.create({
      key: `dog_${this.dogNumber}-idle`,
      frames: this.sprite?.anims.generateFrameNumbers(`dog_${this.dogNumber}`, {
        start: 6,
        end: 9,
      }),
      frameRate: 1000 / 280,
      repeat: -1,
    });
  }

  public walk() {
    this.sprite?.play(`dog_${this.dogNumber}-walking`, true);
  }

  public idle() {
    this.sprite?.play(`dog_${this.dogNumber}-idle`, true);
  }

  public faceRight() {
    this.sprite?.setFlipX(false);
    this.shadow?.setX(-2);
  }

  public faceLeft() {
    this.sprite?.setFlipX(true);
    this.shadow?.setX(2);
  }
}
