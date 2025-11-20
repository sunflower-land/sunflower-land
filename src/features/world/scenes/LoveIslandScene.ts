import loveIslandJSON from "assets/map/love_island_map.json";
import loveIslandTileset from "assets/map/love_island_tileset.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { translate } from "lib/i18n/translate";
import { interactableModalManager } from "../ui/InteractableModals";
import { getKeys } from "features/game/types/decorations";
import { TemperateSeasonName } from "features/game/types/game";
import { hasReadLoveIslandNotice } from "../ui/loveRewardShop/LoveIslandNoticeboard";

const BUMPKINS: NPCBumpkin[] = [];

const GUARDIAN_MAP: Record<TemperateSeasonName, string> = {
  autumn: "autumn_guardian",
  spring: "spring_guardian",
  summer: "summer_guardian",
  winter: "winter_guardian",
};

export class LoveIslandScene extends BaseScene {
  sceneId: SceneId = "love_island";

  spawn: Coordinates = {
    x: 55,
    y: 157,
  };

  leftPetal: Phaser.GameObjects.Sprite | undefined;
  rightPetal: Phaser.GameObjects.Sprite | undefined;
  topPetal: Phaser.GameObjects.Sprite | undefined;
  bottomPetal: Phaser.GameObjects.Sprite | undefined;

  loveBox: Phaser.GameObjects.Sprite | undefined;

  constructor() {
    super({
      name: "love_island",
      map: {
        json: loveIslandJSON,
        imageKey: "floating-tileset",
        defaultTilesetConfig: loveIslandTileset,
      },
    });
  }

  preload() {
    super.preload();
    this.load.image("shop_icon", "world/shop_disc.png");
    this.load.image("giant_flower_petal", "world/giant_flower_petal.webp");
    this.load.image("love_box", "world/love_box.webp");
    this.load.image("petal_clue", "world/petal_clue.png");
    this.load.spritesheet("portal", "world/love_charm_portal_sheet.png", {
      frameWidth: 20,
      frameHeight: 34,
    });

    const guardian = GUARDIAN_MAP[this.gameState.season.season];

    this.load.image("guardian", `world/${guardian}.webp`);
  }

  async create() {
    this.map = this.make.tilemap({
      key: "love_island",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    const shop = this.add.sprite(900, 490, "shop_icon");
    this.loveBox = this.add.sprite(615, 566, "love_box").setVisible(false);
    this.loveBox.setDepth(10000000);

    this.loveBox.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(this.loveBox!, 150)) {
        interactableModalManager.open("petal_puzzle_prize");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    // On click open shop
    shop.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(shop, 75)) {
        interactableModalManager.open("floating_island_shop");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    const clue = this.add.sprite(651, 671, "petal_clue").setDepth(671);
    clue.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      interactableModalManager.open("petal_clue");
    });

    // this.leftPetal = this.add.sprite(220, 140, "giant_flower_petal");
    this.leftPetal = this.add.sprite(566, 566, "giant_flower_petal");
    // this.rightPetal = this.add.sprite(320, 140, "giant_flower_petal");
    this.rightPetal = this.add.sprite(666, 566, "giant_flower_petal");
    this.rightPetal.setRotation(Math.PI);
    // this.topPetal = this.add.sprite(270, 90, "giant_flower_petal");
    this.topPetal = this.add.sprite(615, 522, "giant_flower_petal");
    this.topPetal.setRotation(Math.PI / 2);
    // this.bottomPetal = this.add.sprite(270, 190, "giant_flower_petal");
    this.bottomPetal = this.add.sprite(615, 612, "giant_flower_petal");
    this.bottomPetal.setRotation((Math.PI * 3) / 2);

    const portal = this.add.sprite(568, 674, "portal");
    this.anims.create({
      key: "portal_anim",
      frames: this.anims.generateFrameNumbers("portal", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 7,
    });
    portal.play("portal_anim", true);
    portal.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(portal, 40)) {
        interactableModalManager.open("flower_exchange");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    const guardian = this.add.sprite(310, 556, "guardian");
    guardian.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(guardian, 40)) {
        interactableModalManager.open("guardian");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    this.setupPopup();
  }

  setupPopup = () => {
    if (!hasReadLoveIslandNotice()) {
      interactableModalManager.open("petal_clue");
    }
  };

  /**
   * Flower Petal Puzzle
   * X amount of players must step on each petal
   * When a petal is stepped on, it turns slightly white (to give them feedback)
   * When perfect number of players on petal, it becomes yellow
   * When too many players on petal, it becomes red
   *
   * When all petals are yellow, the puzzle is marked as solved on the server.
   * Players can then claim flowerPuzzle.solved prize (only once per day)
   * Prize Box disappears after 1 minute.
   */

  updateFlower() {
    const server = this.mmoServer;
    if (!server) return;

    const flower = server.state.giantFlower;

    const petals = {
      leftPetal: flower.leftPetal,
      rightPetal: flower.rightPetal,
      topPetal: flower.topPetal,
      bottomPetal: flower.bottomPetal,
    };

    getKeys(petals).forEach((petal) => {
      // Set no tint
      this[petal]?.setVisible(petals[petal] !== "inactive");

      if (petals[petal] === "active") {
        // Set slight white tint
        this[petal]?.setTint(0xcccccc);
      }

      if (petals[petal] === "solved") {
        // Set yellow tint
        this[petal]?.setTint(0xffff00);
      }

      if (petals[petal] === "overloaded") {
        // Set red tint
        this[petal]?.setTint(0xff0000);
      }
    });
  }

  updatePrize() {
    const server = this.mmoServer;
    if (!server) {
      this.loveBox?.setVisible(false);
      return;
    }

    const flower = server.state.giantFlower;

    const isSolved =
      !!flower.puzzleSolvedAt && flower.puzzleSolvedAt > Date.now() - 10 * 1000;

    this.loveBox?.setVisible(isSolved);
  }

  update() {
    super.update();

    this.updateFlower();
    this.updatePrize();
  }
}
