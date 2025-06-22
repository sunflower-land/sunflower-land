import mapJSON from "assets/map/colors_island.json";
import tilesetConfig from "assets/map/colors_island_tileset.json";
import { SceneId } from "../mmoMachine";
import { BaseScene } from "./BaseScene";
import { interactableModalManager } from "../ui/InteractableModals";
//import { Label } from "../containers/Label";
import { translate } from "lib/i18n/translate";

export class ColorsIslandScene extends BaseScene {
  sceneId: SceneId = "colors_island";

  constructor() {
    super({
      name: "colors_island",
      map: {
        json: mapJSON,
        imageKey: "colors_island_tileset",
        tilesetUrl: "Colors Island Tileset",
        defaultTilesetConfig: tilesetConfig,
      },
    });
  }

  preload() {
    super.preload();

    this.load.spritesheet(
      "waterfall",
      `world/colors_island_assets/waterfall_spritesheet.png`,
      {
        frameWidth: 159,
        frameHeight: 260,
      },
    );

    this.load.spritesheet(
      "portal_entrance",
      `world/colors_island_assets/portal_spritesheet.png`,
      {
        frameWidth: 30,
        frameHeight: 30,
      },
    );

    this.load.image("colors_shop", `world/colors_island_assets/event_shop.png`);

    this.load.image("board", `world/colors_island_assets/info_board.png`);

    this.load.image("board_icon", "src/assets/icons/info.webp");

    this.load.image("shop_icon", "world/shop_disc.png");
  }
  async create() {
    this.map = this.make.tilemap({
      key: "colors_island",
    });
    super.create();

    const portal_entrance = this.add.sprite(173, 335, "portal_entrance");
    this.anims.create({
      key: "portal_entrance_animation",
      frames: this.anims.generateFrameNumbers("portal_entrance", {
        start: 0,
        end: 9,
      }),
      repeat: -1,
      frameRate: 9,
    });
    portal_entrance.play("portal_entrance_animation", true);

    portal_entrance
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(portal_entrance, 60)) {
          interactableModalManager.open("festival-of-colors-2025");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    this.physics.world.enable(portal_entrance);
    this.colliders?.add(portal_entrance);
    (portal_entrance.body as Phaser.Physics.Arcade.Body)
      .setSize(30, 30)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    const colors_shop = this.add.sprite(298, 123, "colors_shop");
    colors_shop.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(colors_shop, 75)) {
        interactableModalManager.open("event_store");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });
    this.add.image(298, 105, "shop_icon").setDepth(1000000);

    const waterfall = this.add.sprite(458, 341, "waterfall");
    this.anims.create({
      key: "waterfall_animation",
      frames: this.anims.generateFrameNumbers("waterfall", {
        start: 0,
        end: 10,
      }),
      repeat: -1,
      frameRate: 10,
    });
    waterfall.play("waterfall_animation", true);

    const noticeboard = this.add.image(160, 62, "board");
    this.add.image(160, 43, "board_icon").setDepth(1000000);

    noticeboard.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(noticeboard, 75)) {
        interactableModalManager.open("event_noticeboard");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });
  }
}
