import mapJSON from "assets/map/beach.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { SUNNYSIDE } from "assets/sunnyside";
import { FishermanContainer } from "../containers/FishermanContainer";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import { InventoryItemName } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { gameAnalytics } from "lib/gameAnalytics";
import {
  BeachBountyTreasure,
  SELLABLE_TREASURE,
} from "features/game/types/treasure";
import { getUTCDateString } from "lib/utils/time";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { getKeys } from "features/game/types/decorations";
import { isCollectibleActive } from "features/game/lib/collectibleBuilt";

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
  hoverBox: Phaser.GameObjects.Image | undefined;
  confirmBox: Phaser.GameObjects.Image | undefined;
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
  isPlayerTweening = false;
  isFetching = false;

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

    if (
      hasFeatureAccess(this.gameService.state.context.state, "TEST_DIGGING")
    ) {
      this.setUpDigSite();
      this.setUpDiggingTestControls();

      // this.startDig();
    }
  }

  // 1. Set up the dig site
  public setUpDigSite = () => {
    // set up visual grid overlay
    this.add
      .grid(
        this.gridX,
        this.gridY,
        SITE_COLS * this.cellWidth,
        SITE_ROWS * this.cellHeight,
        this.cellWidth,
        this.cellHeight,
      )
      .setOrigin(0);

    // set up cells
    for (let col = 0; col < SITE_COLS; col++) {
      for (let row = 0; row < SITE_ROWS; row++) {
        const rectX = this.gridX + col * this.cellWidth;
        const rectY = this.gridY + row * this.cellHeight;

        // Remove interactive while revealing??
        this.add
          .rectangle(rectX, rectY, this.cellWidth, this.cellHeight, 0xfff, 0)
          .setStrokeStyle(1, 0xe3d672)
          .setOrigin(0)
          .setInteractive({ cursor: "pointer" })
          .on("pointerdown", () =>
            this.handlePointerDown({ rectX, rectY, row, col }),
          )
          .on("pointerover", () =>
            this.handlePointerOver({ rectX, rectY, row, col }),
          )
          .on("pointerout", () => this.handlePointOut());
      }
    }

    this.populateDugItems();
    // Add the hover and selected select boxes
    this.hoverBox = this.add
      .image(0, 0, "shovel_select")
      .setOrigin(0)
      .setDisplaySize(16, 16)
      .setVisible(false);

    this.confirmBox = this.add
      .image(0, 0, "confirm_select")
      .setOrigin(0)
      .setDisplaySize(16, 16)
      .setVisible(false);

    // Add a digging sound effect

    // Allow click through of bumpkin
    const player = this.currentPlayer as BumpkinContainer;

    player.on("pointerover", () => {
      this.handlePointerOver({ rectX: player.x, rectY: player.y });
    });
  };

  public populateDugItems = () => {
    const { grid: revealed } =
      this.gameService.state.context.state.desert.digging;

    revealed.forEach((hole) => {
      const { x, y, items } = hole;

      const offsetX = x * this.cellWidth + this.gridX + this.cellWidth / 2;
      const offsetY = y * this.cellHeight + this.gridY + this.cellHeight / 2;

      const foundItem = getKeys(items)[0];
      const name = foundItem === "Sunflower" ? "nothing" : foundItem;
      const key = convertToSnakeCase(name);

      this.add.image(offsetX, offsetY, key).setScale(0.8);
    });
  };

  public moveBumpkinToDigLocation = (
    digX: number,
    digY: number,
    onComplete: () => void,
  ) => {
    if (!this.currentPlayer) return;

    const xDiff = this.currentPlayer.x - digX;
    const yDiff = this.currentPlayer.y - digY;
    const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    const speed = 50;

    const duration = (distance / speed) * 1000;

    if (xDiff > 0) {
      this.currentPlayer.faceLeft();
    } else {
      this.currentPlayer.faceRight();
    }

    let xPosition = digX;

    const diggingOffsetX = 7;
    const diggingOffsetY = 3;

    if (this.currentPlayer.x <= digX) {
      xPosition = digX - this.cellWidth + diggingOffsetX;
    } else {
      xPosition = digX + this.cellWidth + diggingOffsetX;
    }

    this.tweens.add({
      targets: this.currentPlayer,
      x: xPosition,
      y: digY + diggingOffsetY,
      duration,
      ease: "Linear",
      onStart: () => {
        this.isPlayerTweening = true;
        this.currentPlayer?.walk();
      },
      onUpdate() {
        this.currentPlayer?.walk();
      },
      onComplete: () => {
        this.isPlayerTweening = false;
        // this.currentPlayer?.dig(() => console.log("DIG COMPLETE"));
        onComplete();
      },
    });
  };

  public disableControls() {
    if (this.input.keyboard) {
      this.input.keyboard.enabled = false;
    }

    if (this.joystick) {
      this.joystick.enable = false;
    }
  }

  public enableControls() {
    if (this.input.keyboard) {
      this.input.keyboard.enabled = true;
    }

    if (this.joystick) {
      this.joystick.enable = true;
    }
  }

  public handlePointerOver = ({
    rectX,
    rectY,
    row,
    col,
  }: {
    rectX: number;
    rectY: number;
    row?: number;
    col?: number;
  }) => {
    let hasDugHere = false;

    if (row && col) {
      hasDugHere =
        this.gameService.state.context.state.desert.digging.grid.some(
          (hole) => hole.x === col && hole.y === row,
        );
    }

    if (
      !this.currentPlayer ||
      this.gameService.state.matches("revealing") ||
      this.isPlayerTweening ||
      hasDugHere
    ) {
      return;
    }

    this.hoverBox?.setDepth(this.currentPlayer.y - this.cellHeight);
    this.confirmBox?.setDepth(this.currentPlayer.y - this.cellHeight);

    const selectedBox = this.confirmBox as Phaser.GameObjects.Image;

    if (rectX === selectedBox.x && rectY === selectedBox.y) {
      this.hoverBox?.setVisible(false);
      return;
    }

    this.hoverBox?.setOrigin(0).setPosition(rectX, rectY).setVisible(true);
  };

  public handlePointerDown = ({
    rectX,
    rectY,
    row,
    col,
  }: {
    rectX: number;
    rectY: number;
    row: number;
    col: number;
  }) => {
    const hasDugHere =
      this.gameService.state.context.state.desert.digging.grid.some(
        (hole) => hole.y === row && hole.x === col,
      );
    if (
      !this.hasDigsLeft ||
      this.isPlayerTweening ||
      this.gameService.state.matches("revealing") ||
      hasDugHere
    ) {
      return;
    }

    if (this.gameService.state.context.state.desert.digging.grid.length === 0) {
      this.confirmBox?.setVisible(true);
    }

    // check if this rectangle is currently the selected one
    if (
      this.confirmBox?.x === rectX &&
      this.confirmBox?.y === rectY &&
      !hasDugHere
    ) {
      // remove selected box
      this.confirmBox?.setVisible(false);
      // move player to dig spot
      this.moveBumpkinToDigLocation(rectX, rectY, () => this.dig(row, col));
    } else {
      // set selected box
      this.confirmBox?.setPosition(rectX, rectY).setVisible(true);
      // remove hover box
      this.hoverBox?.setVisible(false);
    }
  };

  public handlePointOut = () => {
    this.hoverBox?.setVisible(false);
  };

  public setUpDiggingTestControls = () => {
    this.confirmBox = this.add
      .image(0, 0, "confirm_select")
      .setOrigin(0)
      .setDisplaySize(16, 16)
      .setVisible(false);

    this.hoverBox = this.add
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

  get hasDigsLeft() {
    let allowedDigs = TOTAL_DIGS;

    if (
      isCollectibleActive({
        name: "Heart of Davy Jones",
        game: this.gameService.state.context.state,
      })
    ) {
      allowedDigs += 20;
    }

    const totalHolesDug =
      this.gameService.state.context.state.desert.digging.grid.length ?? 0;

    return totalHolesDug < allowedDigs;
  }

  public hideRestartButton = () => {
    this.restartButton?.setVisible(false);
    this.restartText?.setVisible(false);
  };

  public showRestartButton = () => {
    this.restartButton?.setVisible(true);
    this.restartText?.setVisible(true);
  };

  public dig = async (row: number, col: number) => {
    // Send off reveal game event
    this.gameService.send("REVEAL", {
      event: {
        type: "desert.dug",
        x: col,
        y: row,
        createdAt: new Date(),
      },
    });

    // const selectedPosition = this.confirmBox?.getBounds();

    // if (!selectedPosition) {
    //   return;
    // }

    // let key = "nothing";

    // if (item) {
    //   key = convertToSnakeCase(item);
    //   this.treasuresFound.push(item);
    // }

    // // Centre in the square
    // const offsetX = x + this.cellWidth / 2;
    // const offsetY = y + this.cellHeight / 2;

    // const image = this.add.image(offsetX, offsetY, key).setScale(0.8);
    // this.treasureContainer?.add(image);
  };

  public endDigging = () => {
    this.showRestartButton();
    this.recordDigAnalytics();
    this.confirmBox?.setVisible(false);
    this.hoverBox?.setVisible(false);
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
    this.mmoServer?.state.players.forEach((player, sessionId) => {
      if (this.isPlayerInDigArea(player.x, player.y)) {
        this.playerEntities[sessionId]?.teleport(256, 159);
      }
    });
  }

  public isPlayerInDigArea = (playerX: number, playerY: number) => {
    const gridRect = new Phaser.Geom.Rectangle(
      this.gridX,
      this.gridY,
      this.cellWidth * SITE_COLS,
      this.cellHeight * SITE_ROWS,
    );

    return (
      playerX > gridRect.x &&
      playerX < gridRect.right &&
      playerY > gridRect.y &&
      playerY < gridRect.bottom
    );
  };

  public updatePlayer() {
    // Don't allow movement while digging
    if (!this.currentPlayer) return;

    // Allow mouse events to pass through the player
    this.currentPlayer.disableInteractive();

    this.currentPlayer?.setDepth(this.currentPlayer.y);

    // If there is key movement for the player then play walking animation
    // joystick is active if force is greater than zero
    this.movementAngle = this.joystick?.force
      ? this.joystick?.angle
      : undefined;

    // use keyboard control if joystick is not active
    if (this.movementAngle === undefined) {
      if (document.activeElement?.tagName === "INPUT") return;

      const left =
        (this.cursorKeys?.left.isDown || this.cursorKeys?.a?.isDown) ?? false;
      const right =
        (this.cursorKeys?.right.isDown || this.cursorKeys?.d?.isDown) ?? false;
      const up =
        (this.cursorKeys?.up.isDown || this.cursorKeys?.w?.isDown) ?? false;
      const down =
        (this.cursorKeys?.down.isDown || this.cursorKeys?.s?.isDown) ?? false;

      this.movementAngle = this.keysToAngle(left, right, up, down);
    }

    // change player direction if angle is changed from left to right or vise versa
    if (
      this.movementAngle !== undefined &&
      Math.abs(this.movementAngle) !== 90
    ) {
      this.isFacingLeft = Math.abs(this.movementAngle) > 90;
      this.isFacingLeft
        ? this.currentPlayer.faceLeft()
        : this.currentPlayer.faceRight();
    }

    // set player velocity
    const currentPlayerBody = this.currentPlayer
      .body as Phaser.Physics.Arcade.Body;
    if (this.movementAngle !== undefined) {
      currentPlayerBody.setVelocity(
        this.walkingSpeed * Math.cos((this.movementAngle * Math.PI) / 180),
        this.walkingSpeed * Math.sin((this.movementAngle * Math.PI) / 180),
      );
    } else {
      currentPlayerBody.setVelocity(0, 0);
    }

    const isMoving =
      this.movementAngle !== undefined && this.walkingSpeed !== 0;

    if (this.soundEffects) {
      this.soundEffects.forEach((audio) =>
        audio.setVolumeAndPan(
          this.currentPlayer?.x ?? 0,
          this.currentPlayer?.y ?? 0,
        ),
      );
    } else {
      // eslint-disable-next-line no-console
      console.error("audioController is undefined");
    }

    if (this.walkAudioController) {
      this.walkAudioController.handleWalkSound(
        isMoving || this.isPlayerTweening,
      );
    } else {
      // eslint-disable-next-line no-console
      console.error("walkAudioController is undefined");
    }

    if (isMoving) {
      this.currentPlayer.walk();
      return;
    }

    // Set player to digging while we are revealing the reward
    if (this.gameService.state.matches("revealing")) {
      this.disableControls();
      this.currentPlayer.dig();
    }

    if (this.gameService.state.matches("revealed")) {
      this.enableControls();
      this.currentPlayer.sprite?.anims?.stopAfterRepeat(0).emit("DIG_COMPLETE");

      // Ideally should be done at the end of the animation
      // Potentially have animation of the item??
      this.populateDugItems();

      // Move out of revealed state
      this.gameService.send("CONTINUE");
    }

    const animPlaying = this.currentPlayer.sprite?.anims?.isPlaying;

    if (!animPlaying) {
      // If there is no animation playing for the player then play the idle animation
      this.currentPlayer.idle();
    }
  }

  public update() {
    if (!this.currentPlayer) return;

    if (this.isPlayerInDigArea(this.currentPlayer.x, this.currentPlayer.y)) {
      this.updatePlayer();
      this.updateOtherPlayers();
      this.handleNameTagVisibility();
      this.handleOtherDiggersPositions();
    } else {
      super.update();
    }
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
