import mapJSON from "assets/map/holidays_island.json";
import { SceneId } from "../mmoMachine";
import { BaseScene } from "./BaseScene";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import { Label } from "../containers/Label";

export class HolidaysIslandScene extends BaseScene {
  sceneId: SceneId = "holidays_island";

  constructor() {
    super({
      name: "holidays_island",
      map: {
        json: mapJSON,
        imageKey: "holidays_island_tileset",
      },
    });
  }

  preload() {
    super.preload();

    this.load.spritesheet(
      "event_shop",
      `world/holiday_island_assets/event_shop_spritesheet.png`,
      {
        frameWidth: 45,
        frameHeight: 43,
      },
    );

    this.load.spritesheet(
      "bonfire",
      `world/holiday_island_assets/bonfire_spritesheet.png`,
      {
        frameWidth: 60,
        frameHeight: 46,
      },
    );

    this.load.spritesheet(
      "portal_entrance",
      `world/holiday_island_assets/portal_entrance.png`,
      {
        frameWidth: 43,
        frameHeight: 36,
      },
    );

    this.load.spritesheet(
      "board",
      `world/holiday_island_assets/holidays_info_board.png`,
      {
        frameWidth: 20,
        frameHeight: 19,
      },
    );

    this.load.image("board_icon", "world/question_disc.png");

    this.load.image("shop_icon", "world/shop_disc.png");
  }

  async create() {
    this.map = this.make.tilemap({ key: "holidays_island" });
    super.create();

    const portal_entrance = this.add.sprite(160, 140, "portal_entrance");
    this.anims.create({
      key: "portal_entrance_animation",
      frames: this.anims.generateFrameNumbers("portal_entrance", {
        start: 0,
        end: 11,
      }),
      repeat: -1,
      frameRate: 8,
    });
    portal_entrance.play("portal_entrance_animation", true);
    this.physics.world.enable(portal_entrance);
    this.colliders?.add(portal_entrance);
    (portal_entrance.body as Phaser.Physics.Arcade.Body)
      .setSize(43, 80)
      .setOffset(0, -30)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    portal_entrance
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(portal_entrance, 100)) {
          interactableModalManager.open("holiday_puzzle");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    const portalLabel = new Label(this, "PLAY");
    this.add.existing(portalLabel);
    portalLabel.setPosition(165, 140 - 30);
    portalLabel.setDepth(10000);

    const event_shop = this.add.sprite(220, 250, "event_shop");
    this.anims.create({
      key: "event_shop_animation",
      frames: this.anims.generateFrameNumbers("event_shop", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 8,
    });
    event_shop.play("event_shop_animation", true);
    this.physics.world.enable(event_shop);
    this.colliders?.add(event_shop);
    (event_shop.body as Phaser.Physics.Arcade.Body)
      .setSize(45, 43)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);
    event_shop.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(event_shop, 75)) {
        interactableModalManager.open("event_store");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });
    const shopLabel = new Label(this, "SHOP");
    this.add.existing(shopLabel);
    shopLabel.setPosition(218, 250 - 30);
    shopLabel.setDepth(10000);

    const noticeboard = this.add.sprite(285, 275, "board");
    this.anims.create({
      key: "board_animation",
      frames: this.anims.generateFrameNumbers("board", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 8,
    });
    noticeboard.play("board_animation", true);
    this.add.image(285, 255, "board_icon").setDepth(1000000);

    noticeboard.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(noticeboard, 75)) {
        interactableModalManager.open("event_noticeboard");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    const bonfire = this.add.sprite(375, 160, "bonfire");
    this.anims.create({
      key: "bonfire_animation",
      frames: this.anims.generateFrameNumbers("bonfire", {
        start: 0,
        end: 10,
      }),
      repeat: -1,
      frameRate: 8,
    });
    bonfire.play("bonfire_animation", true);
  }
}
