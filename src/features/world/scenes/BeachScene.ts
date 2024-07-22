import mapJSON from "assets/map/beach.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { SUNNYSIDE } from "assets/sunnyside";
import { FishermanContainer } from "../containers/FishermanContainer";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import { createGrid } from "../ui/beach/DiggingMinigame";
import { InventoryItemName } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { gameAnalytics } from "lib/gameAnalytics";
import {
  BeachBountyTreasure,
  SELLABLE_TREASURE,
} from "features/game/types/treasure";
import { getUTCDateString } from "lib/utils/time";

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
    x: 398,
    y: 140,
  },
  {
    // To remove on digging release
    npc: "GOLDTOOTH",
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

export type DigAnalytics = {
  outputCoins: number;
  percentageFound: number;
};

const TOTAL_DIGS = 25;
const SITE_COLS = 10;
const SITE_ROWS = 8;

export class BeachScene extends BaseScene {
  sceneId: SceneId = "beach";
  archeologicalData: (InventoryItemName | undefined)[][] = [];
  hoverSelectBox: Phaser.GameObjects.Image | undefined;
  selectedSelectBox: Phaser.GameObjects.Image | undefined;
  treasureContainer: Phaser.GameObjects.Container | undefined;
  selectedToolLabel: Phaser.GameObjects.Text | undefined;
  gridX = 80;
  gridY = 80;
  cellWidth = 16;
  cellHeight = 16;
  digsRemaining = TOTAL_DIGS;
  digsRemainingLabel: Phaser.GameObjects.Text | undefined;
  percentageFoundLabel: Phaser.GameObjects.Text | undefined;
  dugCoords: string[] = [];
  treasuresFound: InventoryItemName[] = [];
  digStatistics: DigAnalytics | undefined;
  restartButton: Phaser.GameObjects.Image | undefined;
  restartText: Phaser.GameObjects.Text | undefined;
  totalTreasures = 0;

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
    this.load.image("sea_cucumber", SUNNYSIDE.resource.sea_cucumber);
    this.load.image("starfish", SUNNYSIDE.resource.starfish);
    this.load.image("coral", SUNNYSIDE.resource.coral);
    this.load.image("pearl", "world/pearl.webp");
    this.load.image("pirate_bounty", SUNNYSIDE.resource.pirate_bounty);
    this.load.image("seaweed", "world/seaweed.webp");
    this.load.image("pipi", "world/pipi.webp");
    this.load.image("crab", SUNNYSIDE.resource.crab);
    this.load.image("nothing", SUNNYSIDE.icons.close);

    this.load.image("select_box", "world/select_box.png");
    this.load.image("shovel_select", "world/shovel_select.webp");
    this.load.image("confirm_select", "world/confirm_select.webp");
    this.load.image("button", "world/button.webp");
    this.load.image("shovel", "world/shovel.png");
    this.load.image("treasure_shop", "world/treasure_shop.png");
    this.load.image("shop_icon", "world/shop_disc.png");
  }

  async create() {
    this.map = this.make.tilemap({
      key: "beach",
    });
    super.create();

    const filteredBumpkins = BUMPKINS.filter((bumpkin) => {
      // Show new goldtooth if you're beta tester
      if (bumpkin.npc === "goldtooth") {
        return hasFeatureAccess(
          this.gameService.state.context.state,
          "TEST_DIGGING",
        );
      }
      if (bumpkin.npc === "GOLDTOOTH") {
        return !hasFeatureAccess(
          this.gameService.state.context.state,
          "TEST_DIGGING",
        );
      }
      return true;
    });

    this.initialiseNPCs(filteredBumpkins);

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

    const treasureShop = this.add.sprite(400, 130, "treasure_shop");
    this.physics.world.enable(treasureShop);
    this.colliders?.add(treasureShop);
    this.triggerColliders?.add(treasureShop);
    (treasureShop.body as Phaser.Physics.Arcade.Body)
      .setSize(69, 50)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);
    this.add.sprite(400, 110, "shop_icon");

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

    if (
      hasFeatureAccess(this.gameService.state.context.state, "TEST_DIGGING")
    ) {
      this.setUpDiggingTestControls();
      this.startDig();
    }
  }

  public setUpDiggingTestControls = () => {
    this.selectedSelectBox = this.add
      .image(0, 0, "confirm_select")
      .setOrigin(0)
      .setDisplaySize(16, 16)
      .setVisible(false);

    this.hoverSelectBox = this.add
      .image(0, 0, "shovel_select")
      .setOrigin(0)
      .setDisplaySize(16, 16)
      .setVisible(false);
    // Enter button
    this.add
      .image(305, 288, "button")
      .setDisplaySize(28, 14)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        this.currentPlayer?.teleport(256, 159);
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

    this.restartButton = this.add
      .image(210, 72, "button")
      .setDisplaySize(28, 14)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        this.startDig();
      })
      .setVisible(false);

    this.restartText = this.add
      .text(210, 71, "Restart", {
        fontSize: "4px",
        fontFamily: "monospace",
        padding: { x: 0, y: 2 },
        resolution: 4,
        color: "black",
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false);
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

    // face right if moving right, left if moving left
    if (xDiff > 0) {
      this.currentPlayer.faceLeft();
    } else {
      this.currentPlayer.faceRight();
    }

    const goToX = digX + this.cellWidth / 2;
    // Position above the dig spot
    const goToY = digY + this.cellHeight / 2 - this.cellHeight;

    this.tweens.add({
      targets: this.currentPlayer,
      x: goToX,
      y: goToY,
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

  public handleDigCounts = () => {
    this.digsRemaining -= 1;
    const percentageFound = Math.floor(
      (this.treasuresFound.length / this.totalTreasures) * 100,
    );

    this.percentageFoundLabel?.setText(`Percentage found: ${percentageFound}%`);

    if (this.digsRemaining <= 0) {
      this.endDigging();
    } else {
      this.digsRemainingLabel?.setText(`Digs remaining: ${this.digsRemaining}`);
    }
  };

  public hideRestartButton = () => {
    this.restartButton?.setVisible(false);
    this.restartText?.setVisible(false);
  };

  public showRestartButton = () => {
    this.restartButton?.setVisible(true);
    this.restartText?.setVisible(true);
  };

  public resetDig = () => {
    this.treasureContainer?.destroy();
    this.digsRemainingLabel?.destroy();
    this.percentageFoundLabel?.destroy();
    this.dugCoords = [];
    this.digsRemaining = TOTAL_DIGS;
    this.treasureContainer = this.add.container(0, 0);
    this.archeologicalData = createGrid();
    this.totalTreasures = this.archeologicalData.flat().filter(Boolean).length;
    this.hideRestartButton();

    this.digsRemainingLabel = this.add.text(
      108,
      63,
      `Digs remaining: ${this.digsRemaining}`,
      {
        fontSize: "6px",
        fontFamily: "monospace",
        padding: { x: 0, y: 2 },
        resolution: 4,
        color: "black",
      },
    );
    this.percentageFoundLabel = this.add.text(108, 72, `Percentage found: 0%`, {
      fontSize: "4px",
      fontFamily: "monospace",
      padding: { x: 0, y: 2 },
      resolution: 4,
      color: "black",
    });
  };

  public handlePointerDown = (
    selectedX: number,
    selectedY: number,
    row: number,
    col: number,
  ) => {
    if (this.dugCoords.includes(`${row},${col}`) || this.digsRemaining === 0) {
      return;
    }

    if (this.dugCoords.length === 0) {
      this.selectedSelectBox?.setVisible(true);
    }

    // check if this rectangle is currently the selected one
    if (
      this.selectedSelectBox?.x === selectedX &&
      this.selectedSelectBox?.y === selectedY &&
      !this.dugCoords.includes(`${row},${col}`)
    ) {
      // remove selected box
      this.selectedSelectBox?.setVisible(false);
      // move player to dig spot
      this.moveBumpkinToDigLocation(selectedX, selectedY, () => {
        const item = this.archeologicalData[row][col];

        this.dig(selectedX, selectedY, item);
        this.dugCoords.push(`${row},${col}`);

        this.handleDigCounts();
      });
    } else {
      // set selected box
      this.selectedSelectBox
        ?.setPosition(selectedX, selectedY)
        .setVisible(true);
      // remove hover box
      this.hoverSelectBox?.setVisible(false);
    }
  };

  public handlePointerOver = (rectX: number, rectY: number) => {
    const selectedBox = this.selectedSelectBox as Phaser.GameObjects.Image;

    if (rectX === selectedBox.x && rectY === selectedBox.y) {
      this.hoverSelectBox?.setVisible(false);
      return;
    }

    this.hoverSelectBox
      ?.setOrigin(0)
      .setPosition(rectX, rectY)
      .setVisible(true);
  };

  public handlePointOut = () => {
    this.hoverSelectBox?.setVisible(false);
  };

  public startDig = () => {
    this.resetDig();

    this.archeologicalData.forEach((row, i) => {
      row.forEach((item, j) => {
        const rectX = this.gridX + i * this.cellWidth;
        const rectY = this.gridY + j * this.cellHeight;

        const square = this.add
          .rectangle(rectX, rectY, this.cellWidth, this.cellHeight, 0xfff, 0)
          .setOrigin(0)
          .setInteractive({ cursor: "pointer" })
          .on("pointerdown", () => this.handlePointerDown(rectX, rectY, i, j))
          .on("pointerover", () => this.handlePointerOver(rectX, rectY))
          .on("pointerout", () => this.handlePointOut());

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
      this.treasuresFound.push(item);
    }

    // Centre in the square
    const offsetX = x + this.cellWidth / 2;
    const offsetY = y + this.cellHeight / 2;

    const image = this.add.image(offsetX, offsetY, key).setScale(0.8);
    this.treasureContainer?.add(image);
  };

  public endDigging = () => {
    this.showRestartButton();
    this.recordDigAnalytics();
    this.selectedSelectBox?.setVisible(false);
    this.hoverSelectBox?.setVisible(false);
    this.digsRemainingLabel?.setText("No digs remaining");
  };

  public recordDigAnalytics = () => {
    const day = getUTCDateString();
    const stored = localStorage.getItem("beachDigAttempts");

    let attemptsToday = 0;

    if (stored) {
      attemptsToday = JSON.parse(stored)[day];

      localStorage.setItem(
        "beachDigAttempts",
        JSON.stringify({ ...JSON.parse(stored), [day]: attemptsToday + 1 }),
      );
    } else {
      localStorage.setItem(
        "beachDigAttempts",
        JSON.stringify({ [day]: attemptsToday + 1 }),
      );
    }

    if (attemptsToday + 1 < 4) {
      const totalCoins = this.treasuresFound.reduce((acc, item) => {
        return (acc +=
          SELLABLE_TREASURE[item as BeachBountyTreasure].sellPrice);
      }, 0);

      const percentageFound = Math.floor(
        (this.treasuresFound.length / this.totalTreasures) * 100,
      );

      gameAnalytics.trackBeachDiggingAttempt({
        outputCoins: totalCoins,
        percentageFound,
      });
    }
  };

  public handleNameTagVisibility = () => {
    const currentPlayerBounds = this.currentPlayer?.getBounds();
    const nameTag = this.currentPlayer?.getByName("nameTag");
    const factionTag = this.currentPlayer?.getByName("factionTag");
    // Create a grid for the dig site with a buffer of 1 tile
    const gridRect = new Phaser.Geom.Rectangle(
      this.gridX,
      this.gridY,
      this.cellWidth * SITE_COLS,
      this.cellHeight * SITE_ROWS - (this.currentPlayer?.height ?? 0),
    );

    if (!currentPlayerBounds || !gridRect) return;

    if (Phaser.Geom.Rectangle.Overlaps(currentPlayerBounds, gridRect)) {
      if (nameTag) {
        (nameTag as Phaser.GameObjects.Text).setVisible(false);
      }

      if (factionTag) {
        (factionTag as Phaser.GameObjects.Text).setVisible(false);
      }
    } else {
      if (nameTag) {
        (nameTag as Phaser.GameObjects.Text).setVisible(true);
      }

      if (factionTag) {
        (factionTag as Phaser.GameObjects.Text).setVisible(true);
      }
    }
  };

  public handleOtherDiggersPositions() {
    // If any other players are inside of the dig area, move them to the perimeter
    this.mmoServer.state.players.forEach((player, sessionId) => {
      const gridRect = new Phaser.Geom.Rectangle(
        this.gridX,
        this.gridY,
        this.cellWidth * SITE_COLS,
        this.cellHeight * SITE_ROWS,
      );

      if (
        player.x > gridRect.x &&
        player.x < gridRect.right &&
        player.y > gridRect.y &&
        player.y < gridRect.bottom
      ) {
        this.playerEntities[sessionId]?.teleport(256, 159);
      }
    });
  }

  public update() {
    super.update();

    this.handleNameTagVisibility();
    this.handleOtherDiggersPositions();
  }
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
