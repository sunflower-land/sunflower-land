import mapJSON from "assets/map/colors_island_2026.json";
import type { SceneId } from "../mmoMachine";
import { BaseScene } from "./BaseScene";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import { Label } from "../containers/Label";

export class ColorsIsland2026Scene extends BaseScene {
  sceneId: SceneId = "colors_island_2026";

  constructor() {
    super({
      name: "colors_island_2026",
      map: {
        json: mapJSON,
        imageKey: "colors_island_2026_tileset",
      },
    });
  }

  preload() {
    super.preload();

    this.load.spritesheet(
      "event_shop",
      `world/colors_island_2026_assets/shop.png`,
      {
        frameWidth: 80,
        frameHeight: 80,
      },
    );

    this.load.spritesheet(
      "portal_entrance",
      `world/colors_island_2026_assets/portal_entrance.png`,
      {
        frameWidth: 30,
        frameHeight: 30,
      },
    );

    this.load.image(
      "board",
      `world/colors_island_2026_assets/event_info_board.png`,
    );

    this.load.image("board_icon", "world/question_disc.png");

    this.load.image("shop_icon", "world/shop_disc.png");
  }

  async create() {
    this.map = this.make.tilemap({ key: "colors_island_2026" });
    super.create();

    const portal_entrance = this.add.sprite(430, 190, "portal_entrance");
    this.anims.create({
      key: "portal_entrance_animation",
      frames: this.anims.generateFrameNumbers("portal_entrance", {
        start: 0,
        end: 41,
      }),
      repeat: -1,
      frameRate: 7,
    });
    portal_entrance.play("portal_entrance_animation", true);
    this.physics.world.enable(portal_entrance);
    this.colliders?.add(portal_entrance);
    (portal_entrance.body as Phaser.Physics.Arcade.Body)
      .setSize(30, 30)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    portal_entrance
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(portal_entrance, 100)) {
          interactableModalManager.open("colors_2026");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    const portalLabel = new Label(this, "PLAY");
    this.add.existing(portalLabel);
    portalLabel.setPosition(430, 170);
    portalLabel.setDepth(10000);

    const event_shop = this.add.sprite(624, 245, "event_shop");
    this.anims.create({
      key: "event_shop_animation",
      frames: this.anims.generateFrameNumbers("event_shop", {
        start: 0,
        end: 16,
      }),
      repeat: -1,
      frameRate: 7,
    });
    event_shop.play("event_shop_animation", true);
    this.physics.world.enable(event_shop);
    this.colliders?.add(event_shop);
    (event_shop.body as Phaser.Physics.Arcade.Body)
      .setSize(80, 80)
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
    shopLabel.setPosition(624, 240 - 20);
    shopLabel.setDepth(10000);

    const noticeboard = this.add.sprite(180, 292, "board");
    this.add.image(180, 270, "board_icon").setDepth(1000000);

    noticeboard.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(noticeboard, 75)) {
        interactableModalManager.open("event_noticeboard");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });
  }
}
