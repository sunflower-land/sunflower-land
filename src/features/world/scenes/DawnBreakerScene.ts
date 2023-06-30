import { DawnFlower } from "../containers/DawnFlower";
import { Label } from "../containers/Label";
import { RoomId } from "../roomMachine";
import { interactableModalManager } from "../ui/InteractableModals";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { AudioController, Sound } from "../lib/AudioController";

import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";
import { npcModalManager } from "../ui/NPCModals";

const BUMPKINS: NPCBumpkin[] = [
  {
    npc: "bella",
    x: 370,
    y: 370,
  },
  {
    npc: "sofia",
    x: 245,
    y: 150,
  },
  {
    npc: "marcus",
    x: 455,
    y: 290,
  },
];

const fireCoords = { x: 352, y: 435 };
const drummerCoords = { x: 255, y: 365 };
const frogCoords = { x: 335, y: 246 };
const turtleCoords = { x: 555, y: 117 };
const boatCoords = { x: 195, y: 460 };

export class DawnBreakerScene extends BaseScene {
  roomId: RoomId = "dawn_breaker";

  constructor() {
    super("dawn_breaker");
  }

  preload() {
    super.preload();

    this.load.image("dawn_flower", "world/dawn_flower.png");
    this.load.image("dawn_flower_sprout", CROP_LIFECYCLE.Sunflower.seedling);
    this.load.image("dawn_flower_growing", CROP_LIFECYCLE.Sunflower.almost);
    this.load.image("progress_0", SUNNYSIDE.ui.green_bar_0);
    this.load.image("progress_1", SUNNYSIDE.ui.green_bar_1);
    this.load.image("progress_2", SUNNYSIDE.ui.green_bar_2);
    this.load.image("progress_3", SUNNYSIDE.ui.green_bar_3);
    this.load.image("progress_4", SUNNYSIDE.ui.green_bar_4);
    this.load.image("progress_5", SUNNYSIDE.ui.green_bar_5);
    this.load.image("progress_6", SUNNYSIDE.ui.green_bar_6);

    this.load.spritesheet("homeless_man", "world/homeless_man.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("drummer", "world/drummer.png", {
      frameWidth: 30,
      frameHeight: 30,
    });

    this.load.spritesheet("dancing_girl", "world/dancing_girl.png", {
      frameWidth: 19,
      frameHeight: 21,
    });

    this.load.spritesheet("fogueira", "world/fogueira.png", {
      frameWidth: 27,
      frameHeight: 46,
    });

    this.load.spritesheet("turtle", "world/land_turtle.png", {
      frameWidth: 39,
      frameHeight: 23,
    });

    this.load.spritesheet("frog", "world/frog.png", {
      frameWidth: 16,
      frameHeight: 27,
    });

    // Sound Effects
    // Ambience
    if (!this.sound.get("nature_1")) {
      const nature1 = this.sound.add("nature_1") as Sound;
      nature1.play({ loop: true, volume: 0.01 });
    }
    if (!this.sound.get("nature_2")) {
      const nature2 = this.sound.add("nature_2") as Sound;
      nature2.play({ loop: true, volume: 0.01 });
    }

    // Fogueira
    if (!this.sound.get("fire")) {
      const fireSound = this.sound.add("fire") as Sound;
      fireSound.play({ loop: true, volume: 0 });

      this.soundEffects.push(
        new AudioController({
          sound: fireSound,
          distanceThreshold: 100,
          coordinates: fireCoords,
          maxVolume: 0.2,
        })
      );
    }

    // Frog
    if (!this.sound.get("toad")) {
      const frogSound = this.sound.add("toad") as Sound;
      frogSound.play({ loop: true, volume: 0, rate: 1.02, delay: 0.7 });

      this.soundEffects.push(
        new AudioController({
          sound: frogSound,
          distanceThreshold: 60,
          coordinates: frogCoords,
          maxVolume: 0.1,
        })
      );
    }

    // Boat
    if (!this.sound.get("boat")) {
      const boatSopund = this.sound.add("boat") as Sound;
      boatSopund.play({ loop: true, volume: 0, rate: 0.6 });

      this.soundEffects.push(
        new AudioController({
          sound: boatSopund,
          distanceThreshold: 80,
          coordinates: boatCoords,
          maxVolume: 0.2,
        })
      );
    }

    if (!this.sound.get("shoreline")) {
      const shorelineSopund = this.sound.add("shoreline") as Sound;
      shorelineSopund.play({ loop: true, volume: 0 });

      this.soundEffects.push(
        new AudioController({
          sound: shorelineSopund,
          distanceThreshold: 80,
          coordinates: { x: boatCoords.x + 20, y: boatCoords.y },
          maxVolume: 0.1,
        })
      );
    }

    // Music
    if (!this.sound.get("royal_farms")) {
      const music = this.sound.add("royal_farms") as Sound;
      music.play({ loop: true, volume: 0 });
      this.soundEffects.push(
        new AudioController({
          sound: music,
          distanceThreshold: 150,
          coordinates: drummerCoords,
          maxVolume: 1,
        })
      );
    }
    // Shut down all sounds on scene change
    this.events.on("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
      this.soundEffects = [];
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "dawn-breaker",
    });

    super.create();

    // Homeless man
    const sprite = this.add.sprite(125, 261, "homeless_man");
    this.anims.create({
      key: "homeless_animation",
      frames: this.anims.generateFrameNumbers("homeless_man", {
        start: 0,
        end: 11,
      }),
      repeat: -1,
      frameRate: 10,
    });
    sprite.play("homeless_animation", true);
    sprite.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      // play sound
      this.sound.add("howdy");
      this.sound.play("howdy", { volume: 0.5 });
      interactableModalManager.open("homeless_man");
    });

    const label = new Label(this, "DONATIONS");
    this.add.existing(label);
    label.setPosition(125, 241);
    label.setDepth(100000000);

    // Drummer
    const drummer = this.add.sprite(
      drummerCoords.x,
      drummerCoords.y,
      "drummer"
    );
    this.anims.create({
      key: "drummer_animation",
      frames: this.anims.generateFrameNumbers("drummer", {
        start: 0,
        end: 18,
      }),
      repeat: -1,
      frameRate: 13.8,
    });
    drummer.play("drummer_animation", true);

    // Dancing Girl
    const dancing = this.add.sprite(278, 365, "dancing_girl");
    this.anims.create({
      key: "dancing_girl_animation",
      frames: this.anims.generateFrameNumbers("dancing_girl", {
        start: 0,
        end: 18,
      }),
      repeat: -1,
      frameRate: 9.2,
    });
    dancing.play("dancing_girl_animation", true);

    // Fire

    const fire = this.add.sprite(fireCoords.x, fireCoords.y, "fogueira");

    this.anims.create({
      key: "fire_animation",
      frames: this.anims.generateFrameNumbers("fogueira", {
        start: 0,
        end: 11,
      }),
      repeat: -1,
      frameRate: 10,
    });
    fire.play("fire_animation", true);
    fire.setDepth(100000);

    // Turtle
    const turtle = this.add.sprite(turtleCoords.x, turtleCoords.y, "turtle");
    this.anims.create({
      key: "turtle_animation",
      frames: this.anims.generateFrameNumbers("turtle", {
        start: 0,
        end: 4,
      }),
      repeat: -1,
      frameRate: 2,
    });
    turtle.play("turtle_animation", true);

    // Frog
    const frog = this.add.sprite(frogCoords.x, frogCoords.y, "frog");
    this.anims.create({
      key: "frog_animation",
      frames: this.anims.generateFrameNumbers("frog", {
        start: 0,
        end: 21,
      }),
      repeat: -1,
      frameRate: 10,
    });
    frog.play("frog_animation", true);

    this.initialiseNPCs(BUMPKINS);

    const camera = this.cameras.main;

    const stage =
      this.gameService.state.context.state.dawnBreaker?.dawnFlower
        ?.tendedCount ?? 0;
    const flower = new DawnFlower(this, 280, 143.5, stage, () =>
      npcModalManager.open("sofia")
    );

    this.gameService.onEvent((event) => {
      if (event.type === "dawnFlower.tended") {
        console.log("UPDATE!");
        flower.update(
          this.gameService.state.context.state.dawnBreaker?.dawnFlower
            ?.tendedCount ?? 0
        );
      }
    });
  }
}
