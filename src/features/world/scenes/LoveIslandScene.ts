import loveIslandJSON from "assets/map/love_island.json";
import seasonal_tileset from "assets/map/seasonal_tileset.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { translate } from "lib/i18n/translate";
import { interactableModalManager } from "../ui/InteractableModals";
import { getKeys } from "features/game/types/decorations";

const BUMPKINS: NPCBumpkin[] = [];

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

  constructor() {
    super({
      name: "love_island",
      map: {
        json: loveIslandJSON,
        imageKey: "seasonal-tileset",
        defaultTilesetConfig: seasonal_tileset,
      },
    });
  }

  preload() {
    super.preload();
    this.load.image("shop_icon", "world/shop_disc.png");
    this.load.image("giant_flower_petal", "world/giant_flower_petal.webp");
  }

  async create() {
    this.map = this.make.tilemap({
      key: "love_island",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    const shop = this.add.sprite(270, 140, "shop_icon");

    // On click open shop
    shop.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(shop, 75)) {
        interactableModalManager.open("floating_island_shop");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    this.leftPetal = this.add.sprite(220, 140, "giant_flower_petal");
    this.rightPetal = this.add.sprite(320, 140, "giant_flower_petal");
    this.rightPetal.setRotation(Math.PI);
    this.topPetal = this.add.sprite(270, 90, "giant_flower_petal");
    this.topPetal.setRotation(Math.PI / 2);
    this.bottomPetal = this.add.sprite(270, 190, "giant_flower_petal");
    this.bottomPetal.setRotation((Math.PI * 3) / 2);
  }

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
      console.log({ petal, state: petals[petal], left: flower.leftPetal });
      if (petals[petal] === "active") {
        // Set slight white tint
        this[petal]?.setTint(0xcccccc);
      }

      if (petals[petal] === "inactive") {
        // Set no tint
        this[petal]?.setTint(0xffffff);
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

    // if (flower.rightPetalActive) {
    //   this.rightPetal?.setTint(0xff0000);
    // } else {
    //   this.rightPetal?.setTint(0xffffff);
    // }

    // if (flower.topPetalActive) {
    //   this.topPetal?.setTint(0xff0000);
    // } else {
    //   this.topPetal?.setTint(0xffffff);
    // }

    // if (flower.bottomPetalActive) {
    //   this.bottomPetal?.setTint(0xff0000);
    // } else {
    //   this.bottomPetal?.setTint(0xffffff);
    // }
  }
  update() {
    super.update();

    this.updateFlower();
  }
}
