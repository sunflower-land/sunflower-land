import mapJSON from "assets/map/beach.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { SUNNYSIDE } from "assets/sunnyside";
import { FishermanContainer } from "../containers/FishermanContainer";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import { createGrid } from "../ui/beach/DiggingMinigame";
import { InventoryItemName } from "features/game/types/game";

const convertToSnakeCase = (str: string) => {
  return str.replace(" ", "_").toLowerCase();
};

const BUMPKINS: NPCBumpkin[] = [
  {
    npc: "finn",
    x: 94,
    y: 518,
  },
  {
    npc: "finley",
    x: 122,
    y: 390,
    direction: "left",
  },
  {
    npc: "tango",
    x: 416,
    y: 321,
  },
  {
    npc: "goldtooth",
    x: 304,
    y: 255,
  },
  {
    npc: "corale",
    x: 135,
    y: 670,
  },
  {
    x: 338,
    y: 407,
    npc: "miranda",
  },
];

export class BeachScene extends BaseScene {
  sceneId: SceneId = "beach";
  archeologicalData: (InventoryItemName | undefined)[][] = [];
  hoverSelectBox: Phaser.GameObjects.Image | undefined;
  selectedSelectBox: Phaser.GameObjects.Image | undefined;
  digsRemaining = 3;
  digsRemainingLabel: Phaser.GameObjects.Text | undefined;
  dugCoords: string[] = [];
  treasureContainer: Phaser.GameObjects.Container | undefined;

  constructor() {
    super({ name: "beach", map: { json: mapJSON } });
  }

  preload() {
    super.preload();

    this.load.image("heart", SUNNYSIDE.icons.heart);

    this.load.image("wooden_chest", "world/wooden_chest.png");
    this.load.image("locked_disc", "world/locked_disc.png");
    this.load.image("rare_key_disc", "world/rare_key_disc.png");

    this.load.spritesheet("beach_bud", "world/turtle.png", {
      frameWidth: 15,
      frameHeight: 17,
    });

    this.load.spritesheet("beach_bud_2", "world/beach_bud_2.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("beach_bud_3", "world/beach_bud_3.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("bird", SUNNYSIDE.animals.bird, {
      frameWidth: 16,
      frameHeight: 17,
    });

    this.load.spritesheet("blinking", SUNNYSIDE.vfx.blinking, {
      frameWidth: 16,
      frameHeight: 16,
    });

    // "misty" NPC fisher
    this.load.spritesheet("fisher", SUNNYSIDE.npcs.fishing_sheet, {
      frameWidth: 58,
      frameHeight: 50,
    });

    // fishing weather icons
    this.load.image("fish_frenzy", "world/lightning.png");
    this.load.image("full_moon", "world/full_moon.png");
    // Treasures
    this.load.image("sea_cucumber", "world/sea_cucumber.webp");
    this.load.image("starfish", "world/starfish.webp");
    this.load.image("coral", "world/coral.webp");
    this.load.image("pearl", "world/pearl.webp");
    this.load.image("pirate_bounty", "world/bounty.webp");
    this.load.image("seaweed", "world/seaweed.webp");
    this.load.image("pipi", "world/pipi.webp");
    this.load.image("crab", "world/crab.webp");
    this.load.image("nothing", SUNNYSIDE.icons.close);

    this.load.image("select_box", "world/select_box.png");
    this.load.image("shovel_select", "world/shovel_select.webp");
    this.load.image("drill_select", "world/drill_select.webp");
    this.load.image("confirm_select", "world/confirm_select.webp");
    this.load.image("button", "world/button.webp");
  }

  async create() {
    this.map = this.make.tilemap({
      key: "beach",
    });
    super.create();

    this.initialiseNPCs(BUMPKINS);

    const fisher = new FishermanContainer({
      x: 322,
      y: 711,
      scene: this,
      weather: this.gameState.fishing.weather,
    });
    fisher.setDepth(100000000);
    this.physics.world.enable(fisher);
    this.colliders?.add(fisher);
    this.triggerColliders?.add(fisher);
    (fisher.body as Phaser.Physics.Arcade.Body)
      .setSize(12, 16)
      .setOffset(12, 11)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    const turtle = this.add.sprite(328, 515, "beach_bud");
    turtle.setScale(-1, 1);
    this.anims.create({
      key: "turtle_bud_anim",
      frames: this.anims.generateFrameNumbers("beach_bud", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    turtle.play("turtle_bud_anim", true);

    const beachBud2 = this.add.sprite(268, 317, "beach_bud_2");
    // turtle.setScale(-1, 1);
    this.anims.create({
      key: "beach_bud_2_anim",
      frames: this.anims.generateFrameNumbers("beach_bud_2", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    beachBud2.play("beach_bud_2_anim", true);

    const beachBud3 = this.add.sprite(420, 572, "beach_bud_3");
    this.anims.create({
      key: "beach_bud_3_anim",
      frames: this.anims.generateFrameNumbers("beach_bud_3", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    beachBud3.play("beach_bud_3_anim", true);

    const blinking = this.add.sprite(319, 36, "blinking");
    this.anims.create({
      key: "blinking_anim",
      frames: this.anims.generateFrameNumbers("blinking", {
        start: 0,
        end: 12,
      }),
      repeat: -1,
      frameRate: 5,
    });
    blinking.play("blinking_anim", true);

    const bird = this.add.sprite(318, 460, "bird");
    bird.setDepth(1000000000);
    this.anims.create({
      key: "bird_anim",
      frames: this.anims.generateFrameNumbers("bird", {
        start: 0,
        end: 4,
      }),
      repeat: -1,
      frameRate: 5,
    });
    bird.play("bird_anim", true);

    if (this.gameState.inventory["Rare Key"]) {
      this.add.sprite(320, 580, "rare_key_disc").setDepth(1000000000);
    } else {
      this.add.sprite(320, 580, "locked_disc").setDepth(1000000000);
    }

    const chest = this.add.sprite(320, 600, "wooden_chest");
    chest.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(chest, 75)) {
        interactableModalManager.open("rare_chest");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    this.setUpDiggingTestControls();
    this.startDig();
  }

  public setUpDiggingTestControls = () => {
    // Enter button
    this.add
      .image(305, 288, "button")
      .setDisplaySize(28, 14)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        this.currentPlayer?.teleport(200, 144);
      });

    this.add
      .text(305, 287, "Test dig", {
        fontSize: "4px",
        fontFamily: "monospace",
        padding: { x: 0, y: 2 },
        resolution: 4,
        color: "black",
      })
      .setOrigin(0.5, 0.5);

    // Exit button
    this.add
      .image(305, 220, "button")
      .setDisplaySize(28, 14)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        this.currentPlayer?.teleport(303, 313);
      });

    this.add
      .text(305, 219, "Go back", {
        fontSize: "4px",
        fontFamily: "monospace",
        padding: { x: 0, y: 2 },
        resolution: 4,
        color: "black",
      })
      .setOrigin(0.5, 0.5);
  };

  public moveBumpkinToDigLocation = (
    digX: number,
    digY: number,
    onComplete: () => void,
  ) => {
    if (!this.currentPlayer) return;

    this.currentPlayer.walk();

    const xDiff = this.currentPlayer.x - digX;
    const yDiff = this.currentPlayer.y - digY;
    const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    const speed = 50;

    const duration = (distance / speed) * 1000;

    if (digX < this.currentPlayer.x || digY < this.currentPlayer.y) {
      this.currentPlayer.faceLeft();
    } else {
      this.currentPlayer.faceRight();
    }

    this.tweens.add({
      targets: this.currentPlayer,
      x: digX,
      y: digY - 16,
      duration,
      ease: "Linear",
      onStart: () => {
        this.currentPlayer?.walk();
      },
      onComplete: () => {
        this.currentPlayer?.idle();
        onComplete();
      },
    });
  };

  public startDig = () => {
    this.treasureContainer?.destroy();
    this.digsRemainingLabel?.destroy();
    this.dugCoords = [];
    this.digsRemaining = 3;
    this.treasureContainer = this.add.container(0, 0);
    this.archeologicalData = createGrid();

    this.digsRemainingLabel = this.add.text(
      108,
      66,
      `Digs remaining: ${this.digsRemaining}`,
      {
        fontSize: "8px",
        fontFamily: "monospace",
        padding: { x: 0, y: 2 },
        resolution: 4,
        color: "black",
      },
    );

    const startX = 88;
    const startY = 88;
    const width = 16;
    const height = 16;

    this.selectedSelectBox = this.add
      .image(0, 0, "confirm_select")
      .setDisplaySize(16, 16)
      .setDepth(100000000)
      .setVisible(false);

    this.hoverSelectBox = this.add
      .image(0, 0, "shovel_select")
      .setDisplaySize(16, 16)
      .setDepth(100000000)
      .setVisible(false);

    this.archeologicalData.forEach((row, i) => {
      row.forEach((item, j) => {
        const rectX = startX + i * width;
        const rectY = startY + j * height;

        const square = this.add
          .rectangle(rectX, rectY, width, height, 0x000000, 0.5)
          .setInteractive({ cursor: "pointer" })
          .on("pointerdown", () => {
            if (
              this.dugCoords.includes(`${i}-${j}`) ||
              this.digsRemaining === 0
            ) {
              return;
            }

            if (this.dugCoords.length === 0) {
              this.selectedSelectBox?.setVisible(true);
            }

            // check if this rectangle is currently the selected one
            if (
              this.selectedSelectBox?.x === rectX &&
              this.selectedSelectBox?.y === rectY &&
              !this.dugCoords.includes(`${i}-${j}`)
            ) {
              // remove selected box
              this.selectedSelectBox?.setVisible(false);
              // move player to dig spot
              this.moveBumpkinToDigLocation(rectX, rectY, () => {
                this.dig(rectX, rectY);
                this.dugCoords.push(`${i}-${j}`);
              });
            } else {
              // set selected box
              this.selectedSelectBox
                ?.setPosition(rectX, rectY)
                .setVisible(true);
              // remove hover box
              this.hoverSelectBox?.setVisible(false);
            }
          })
          .on("pointerover", () => {
            const selectedPosition = this.selectedSelectBox?.getBounds();

            if (
              selectedPosition?.contains(rectX, rectY) &&
              this.dugCoords.length
            ) {
              return;
            }
            this.hoverSelectBox?.setPosition(rectX, rectY).setVisible(true);
          })
          .on("pointerout", () => {
            this.hoverSelectBox?.setVisible(false);
          });

        this.treasureContainer?.add(square);
      });
    });
  };

  public dig = (x: number, y: number, item?: InventoryItemName) => {
    const selectedPosition = this.selectedSelectBox?.getBounds();

    if (!selectedPosition) {
      return;
    }

    let key = "nothing";

    if (item) {
      key = convertToSnakeCase(item);
    }

    const image = this.add.image(x, y, key).setScale(0.8);
    this.treasureContainer?.add(image);

    this.digsRemaining -= 1;

    if (this.digsRemaining <= 0) {
      this.endDigging();
    } else {
      this.digsRemainingLabel?.setText(`Digs remaining: ${this.digsRemaining}`);
    }
  };

  public endDigging = () => {
    this.selectedSelectBox?.destroy();
    this.hoverSelectBox?.destroy();
    this.digsRemainingLabel?.setText("No digs remaining");

    this.add
      .image(210, 72, "button")
      .setDisplaySize(28, 14)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        this.startDig();
      });
    this.add
      .text(210, 71, "Restart", {
        fontSize: "4px",
        fontFamily: "monospace",
        padding: { x: 0, y: 2 },
        resolution: 4,
        color: "black",
      })
      .setOrigin(0.5, 0.5);
  };
}

// PubSub.ts

type Callback = (...args: any[]) => void;

class BeachPubSub {
  private events: Record<string, Callback[]> = {};

  subscribe(event: string, callback: Callback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  publish(event: string, ...args: any[]): void {
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        callback(...args);
      });
    }
  }

  unsubscribe(event: string, callback: Callback): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }
}

export const beachEvents = new BeachPubSub();
