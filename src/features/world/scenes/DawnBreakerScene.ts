import dawnBreakerJSON from "assets/map/dawn_breaker.json";

import { DawnFlower } from "../containers/DawnFlower";
import { Label } from "../containers/Label";
import { SceneId } from "../mmoMachine";
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
  sceneId: SceneId = "dawn_breaker";

  constructor() {
    super({
      name: "dawn_breaker",
      map: { json: dawnBreakerJSON },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    this.load.image("dawn_flower", "world/dawn_flower.png");
    this.load.image("dawn_flower_sprout", CROP_LIFECYCLE.Sunflower.seedling);
    this.load.image("dawn_flower_growing", CROP_LIFECYCLE.Sunflower.almost);

    this.load.image("water", SUNNYSIDE.icons.water);

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

    this.load.spritesheet("bumpkin_roaster_1", "world/roasting_bumpkin_1.png", {
      frameWidth: 21,
      frameHeight: 21,
    });

    this.load.spritesheet("bumpkin_roaster_2", "world/roasting_bumpkin_2.png", {
      frameWidth: 20,
      frameHeight: 19,
    });

    this.load.spritesheet("dawn_flag", "world/dawn_flag.png", {
      frameWidth: 16,
      frameHeight: 20,
    });

    this.load.spritesheet("dragonfly", "world/dragonfly_1.png", {
      frameWidth: 13,
      frameHeight: 4,
    });

    this.load.spritesheet("dragonfly_2", "world/dragonfly_2.png", {
      frameWidth: 13,
      frameHeight: 4,
    });

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
      const boatSound = this.sound.add("boat") as Sound;
      boatSound.play({ loop: true, volume: 0, rate: 0.6 });

      this.soundEffects.push(
        new AudioController({
          sound: boatSound,
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

    const flag = this.add.sprite(260, 435, "dawn_flag");
    this.anims.create({
      key: "dawn_flag_animation",
      frames: this.anims.generateFrameNumbers("dawn_flag", {
        start: 0,
        end: 10,
      }),
      repeat: -1,
      frameRate: 10,
    });
    flag.play("dawn_flag_animation", true);
    flag.setDepth(100000);

    const roaster = this.add.sprite(329, 445, "bumpkin_roaster_1");
    this.anims.create({
      key: "bumpkin_roaster_animation",
      frames: this.anims.generateFrameNumbers("bumpkin_roaster_1", {
        start: 0,
        end: 18,
      }),
      repeat: -1,
      frameRate: 10,
    });
    roaster.play("bumpkin_roaster_animation", true);
    roaster.setDepth(100000);

    const roaster2 = this.add.sprite(374, 442, "bumpkin_roaster_2");
    this.anims.create({
      key: "bumpkin_roaster_animation_2",
      frames: this.anims.generateFrameNumbers("bumpkin_roaster_2", {
        start: 0,
        end: 18,
      }),
      repeat: -1,
      frameRate: 10,
    });
    roaster2.play("bumpkin_roaster_animation_2", true);
    roaster2.setDepth(100000);

    const dragonfly = this.add.sprite(430, 475, "dragonfly");
    this.anims.create({
      key: "dragonfly_animation",
      frames: this.anims.generateFrameNumbers("dragonfly", {
        start: 0,
        end: 2,
      }),
      repeat: -1,
      frameRate: 10,
    });
    dragonfly.play("dragonfly_animation", true);
    dragonfly.setDepth(100000);

    const dragonfly2 = this.add.sprite(32, 220, "dragonfly_2");
    this.anims.create({
      key: "dragonfly_2_animation",
      frames: this.anims.generateFrameNumbers("dragonfly_2", {
        start: 0,
        end: 2,
      }),
      repeat: -1,
      frameRate: 10,
    });
    dragonfly2.play("dragonfly_2_animation", true);
    dragonfly2.setDepth(100000);

    this.initialiseNPCs(BUMPKINS);

    const dawnFlower =
      this.gameService.state.context.state.dawnBreaker?.dawnFlower;
    const stage = dawnFlower?.tendedCount ?? 0;

    const isReady =
      Date.now() - (dawnFlower?.tendedAt ?? 0) > 24 * 60 * 60 * 1000;

    const flower = new DawnFlower(this, 280, 143.5, stage, isReady, () =>
      npcModalManager.open("sofia")
    );

    this.gameService.onEvent((event) => {
      if (event.type === "dawnFlower.tended") {
        console.log("UPDATE!");
        flower.update(
          this.gameService.state.context.state.dawnBreaker?.dawnFlower
            ?.tendedCount ?? 0,
          false
        );
      }
    });
  }
}
