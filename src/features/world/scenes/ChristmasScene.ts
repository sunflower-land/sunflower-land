import mapJson from "assets/map/christmas.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Label } from "../containers/Label";
import { interactableModalManager } from "../ui/InteractableModals";
import { AudioController } from "../lib/AudioController";
import { Candy } from "../containers/Candy";
import { MachineInterpreter } from "features/game/lib/gameMachine";
import {
  DAILY_CANDY,
  getDayOfChristmas,
} from "features/game/events/landExpansion/collectCandy";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { SOUNDS } from "assets/sound-effects/soundEffects";

const CANDY_POSITIONS = [
  {
    x: 160,
    y: 64,
  },
  {
    x: 64,
    y: 80,
  },
  {
    x: 208,
    y: 96,
  },
  {
    x: 592,
    y: 128,
  },
  {
    x: 672,
    y: 144,
  },
  {
    x: 768,
    y: 144,
  },
  {
    x: 288,
    y: 160,
  },
  {
    x: 480,
    y: 160,
  },
  {
    x: 192,
    y: 176,
  },
  {
    x: 320,
    y: 192,
  },
  {
    x: 432,
    y: 192,
  },
  {
    x: 48,
    y: 240,
  },
  {
    x: 672,
    y: 240,
  },
  {
    x: 832,
    y: 256,
  },
  {
    x: 704,
    y: 288,
  },
  {
    x: 144,
    y: 304,
  },
  {
    x: 304,
    y: 304,
  },
  {
    x: 512,
    y: 304,
  },
  {
    x: 240,
    y: 320,
  },
  {
    x: 608,
    y: 320,
  },
  {
    x: 752,
    y: 336,
  },
  {
    x: 64,
    y: 384,
  },
  {
    x: 112,
    y: 432,
  },
  {
    x: 256,
    y: 448,
  },
];

const SHUFFLED_CANDY_POSITIONS = CANDY_POSITIONS.sort(
  () => 0.5 - Math.random()
);

export const PLAZA_BUMPKINS: NPCBumpkin[] = [
  {
    npc: "elf",
    x: 195,
    y: 156,
  },
  {
    x: 442,
    y: 163,
    npc: "mayor",
    direction: "left",
  },
  {
    x: 418,
    y: 330,
    npc: "santa",
  },
  {
    x: 600,
    y: 352,
    npc: "pumpkin' pete",
  },
  {
    x: 815,
    y: 213,
    npc: "frankie",
    direction: "left",
  },
  {
    x: 316,
    y: 245,
    npc: "stella",
  },
  {
    x: 631,
    y: 98,
    npc: "timmy",
  },
  {
    x: 307,
    y: 72,
    npc: "raven",
    direction: "left",
  },
  {
    x: 367,
    y: 120,
    npc: "blacksmith",
  },
  {
    x: 760,
    y: 390,
    npc: "grimbly",
  },
  {
    x: 810,
    y: 380,
    npc: "grimtooth",
    direction: "left",
  },
  // {
  //   x: 120,
  //   y: 170,
  //   npc: "gabi",
  // },
  {
    x: 480,
    y: 140,
    npc: "cornwell",
  },
  {
    x: 795,
    y: 118,
    npc: "bert",
    direction: "left",
  },
  {
    x: 534,
    y: 88,
    npc: "betty",
    direction: "left",
  },
  {
    x: 729,
    y: 270,
    npc: "grubnuk",
    direction: "left",
  },
  {
    x: 834,
    y: 335,
    npc: "luna",
    direction: "left",
  },
  {
    x: 90,
    y: 70,
    npc: "tywin",
  },
  {
    x: 505,
    y: 352,
    npc: "birdie",
    direction: "left",
  },
  {
    x: 208,
    y: 402,
    npc: "billy",
  },
  {
    x: 224,
    y: 293,
    npc: "hank",
  },
];

export class ChristmasScene extends BaseScene {
  sceneId: SceneId = "plaza";

  constructor() {
    super({
      name: "plaza",
      map: {
        json: mapJson,
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  public get gameService() {
    return this.registry.get("gameService") as MachineInterpreter;
  }

  preload() {
    this.load.audio("chime", SOUNDS.notifications.chime);

    this.load.image("candy", "world/candy.png");

    this.load.spritesheet("plaza_bud", "world/plaza_bud.png", {
      frameWidth: 15,
      frameHeight: 18,
    });

    this.load.spritesheet("plaza_bud_2", "world/plaza_bud_2.png", {
      frameWidth: 15,
      frameHeight: 18,
    });

    this.load.spritesheet("plaza_bud_3", "world/plaza_bud_3.png", {
      frameWidth: 15,
      frameHeight: 18,
    });

    this.load.spritesheet("turtle_bud", "world/turtle.png", {
      frameWidth: 15,
      frameHeight: 17,
    });

    this.load.spritesheet("orange_bud", "world/orange_bud.png", {
      frameWidth: 15,
      frameHeight: 16,
    });

    this.load.spritesheet("snow_horn_bud", "world/snow_horn_bud.png", {
      frameWidth: 15,
      frameHeight: 14,
    });

    this.load.spritesheet("snow_bud", "world/snow_mushroom.png", {
      frameWidth: 15,
      frameHeight: 15,
    });

    this.load.spritesheet("fat_chicken", "world/fat_chicken.png", {
      frameWidth: 17,
      frameHeight: 21,
    });

    this.load.image("chest", "world/rare_chest.png");

    super.preload();

    // Ambience SFX
    if (!this.sound.get("nature_1")) {
      const nature1 = this.sound.add("nature_1");
      nature1.play({ loop: true, volume: 0.01 });
    }

    // Boat SFX
    if (!this.sound.get("boat")) {
      const boatSound = this.sound.add("boat");
      boatSound.play({ loop: true, volume: 0, rate: 0.6 });

      this.soundEffects.push(
        new AudioController({
          sound: boatSound,
          distanceThreshold: 130,
          coordinates: { x: 352, y: 462 },
          maxVolume: 0.2,
        })
      );
    }

    // Shut down the sound when the scene changes
    this.events.once("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "main-map",
    });

    super.create();

    this.initialiseNPCs(PLAZA_BUMPKINS);

    const { dayOfChristmas } = getDayOfChristmas(this.gameState);

    const candyCollected =
      this.gameState.christmas?.day[dayOfChristmas]?.candy ?? 0;

    const remaining = DAILY_CANDY - candyCollected;

    const candyPositions = SHUFFLED_CANDY_POSITIONS.slice(0, remaining);

    candyPositions.forEach(({ x, y }) => {
      const candy = new Candy({ x, y, scene: this });
      candy.setDepth(1000000);
      this.physics.world.enable(candy);

      const candyGroup = this.add.group();
      candyGroup.add(candy);
      this.physics.add.collider(
        this.currentPlayer as BumpkinContainer,
        candy,
        (obj1, obj2) => {
          candy.sprite?.destroy();
          candy.destroy();

          const { dayOfChristmas } = getDayOfChristmas(
            this.gameService.state.context.state
          );

          const candyCollected =
            this.gameService.state.context.state.christmas?.day[dayOfChristmas]
              ?.candy ?? 0;

          const remaining = DAILY_CANDY - candyCollected;

          // Open reward window
          if (remaining === 1) {
            interactableModalManager.open("christmas_reward");
          } else {
            // Otherwise collect straight away
            this.gameService.send("candy.collected");
            this.gameService.send("SAVE");
          }

          const chime = this.sound.add("chime");
          chime.play({ loop: false, volume: 0.1 });
        }
      );
    });

    const auctionLabel = new Label(this, "AUCTIONS", "brown");
    auctionLabel.setPosition(601, 260);
    auctionLabel.setDepth(10000000);
    this.add.existing(auctionLabel);

    const clubHouseLabel = new Label(this, "CLUBHOUSE", "brown");
    clubHouseLabel.setPosition(152, 262);
    clubHouseLabel.setDepth(10000000);
    this.add.existing(clubHouseLabel);

    // Plaza Bud
    const fatChicken = this.add.sprite(106, 352, "fat_chicken");
    this.anims.create({
      key: "fat_chicken_animation",
      frames: this.anims.generateFrameNumbers("fat_chicken", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    fatChicken.play("fat_chicken_animation", true);
    fatChicken.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      interactableModalManager.open("fat_chicken");
    });

    // Plaza Bud
    const bud = this.add.sprite(500, 420, "plaza_bud");
    this.anims.create({
      key: "plaza_bud_animation",
      frames: this.anims.generateFrameNumbers("plaza_bud", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    bud
      .play("plaza_bud_animation", true)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        interactableModalManager.open("bud");
      });

    // Plaza Bud
    const bud2 = this.add.sprite(601, 200, "plaza_bud_2");
    this.anims.create({
      key: "plaza_bud_animation_2",
      frames: this.anims.generateFrameNumbers("plaza_bud_2", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    bud2
      .play("plaza_bud_animation_2", true)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        interactableModalManager.open("bud");
      });
    bud2.setDepth(100000000000);

    const bud3 = this.add.sprite(176, 290, "plaza_bud_3");
    this.anims.create({
      key: "plaza_bud_animation_3",
      frames: this.anims.generateFrameNumbers("plaza_bud_3", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    bud3
      .play("plaza_bud_animation_3", true)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        interactableModalManager.open("bud");
      });

    const turtle = this.add.sprite(119, 293, "turtle_bud");
    turtle.setScale(-1, 1);
    this.anims.create({
      key: "turtle_bud_anim",
      frames: this.anims.generateFrameNumbers("turtle_bud", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    turtle
      .play("turtle_bud_anim", true)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        interactableModalManager.open("bud");
      });

    const snowHornBud = this.add.sprite(128, 235, "snow_horn_bud");
    snowHornBud.setScale(-1, 1);
    this.anims.create({
      key: "snow_horn_bud_anim",
      frames: this.anims.generateFrameNumbers("snow_horn_bud", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    snowHornBud.setVisible(false).play("snow_horn_bud_anim", true);

    const orangeBud = this.add.sprite(176, 235, "orange_bud");
    orangeBud.setScale(-1, 1);
    this.anims.create({
      key: "orange_bud_anim",
      frames: this.anims.generateFrameNumbers("orange_bud", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    orangeBud.setVisible(false).play("orange_bud_anim", true);

    const chest = this.add
      .sprite(152, 230, "chest")
      .setVisible(false)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        interactableModalManager.open("clubhouse_reward");
      });

    const door = this.colliders
      ?.getChildren()
      .find((object) => object.data?.list?.id === "clubhouse_door");

    // TODO
    const canAccess = Object.keys(this.gameState.buds ?? {}).length > 0;

    if (door && canAccess) {
      this.physics.world.disable(door);
    }

    // Opening and closing clubhouse door
    this.onCollision["clubhouse_door"] = async (obj1, obj2) => {
      if (!canAccess) {
        interactableModalManager.open("guild_house");
        return;
      }

      const wasOpen = chest.visible;
      const isOpen = (obj1 as any).y > (obj2 as any).y;

      this.layers["Club House Roof"].setVisible(isOpen);
      this.layers["Club House Base"].setVisible(isOpen);
      this.layers["Club House Door"].setVisible(isOpen);
      clubHouseLabel.setVisible(isOpen);

      snowHornBud.setVisible(!isOpen);
      orangeBud.setVisible(!isOpen);
      chest.setVisible(!isOpen);

      if (wasOpen === isOpen) {
        this.mmoService?.state.context.server?.send(0, {
          action: "open_clubhouse",
        });
      }

      return;
    };

    const server = this.mmoService?.state.context.server;
    if (!server) return;

    server.state.actions.onAdd(async (action) => {
      if (
        action.event === "open_clubhouse" &&
        !!this.layers["Club House Door"].visible
      ) {
        this.layers["Club House Door"].setVisible(false);

        await new Promise((res) => setTimeout(res, 1000));

        this.layers["Club House Door"].setVisible(true);
      }
    });
  }
}
