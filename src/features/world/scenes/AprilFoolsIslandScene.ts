import mapJSON from "assets/map/april_fools_island.json";
import { SceneId } from "../mmoMachine";
import { BaseScene } from "./BaseScene";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import { Label } from "../containers/Label";

export class AprilFoolsIslandScene extends BaseScene {
  sceneId: SceneId = "april_fools_island";

  constructor() {
    super({
      name: "april_fools_island",
      map: {
        json: mapJSON,
        imageKey: "april_fools_island_tileset",
      },
    });
  }

  preload() {
    super.preload();

    this.load.spritesheet(
      "event_shop",
      `world/april_fools_island_assets/shop.png`,
      {
        frameWidth: 48,
        frameHeight: 32,
      },
    );

    this.load.spritesheet(
      "portal_entrance",
      `world/april_fools_island_assets/portal_entrance.png`,
      {
        frameWidth: 96,
        frameHeight: 64,
      },
    );

    this.load.spritesheet(
      "teeth",
      `world/april_fools_island_assets/teeth_toy.png`,
      {
        frameWidth: 32,
        frameHeight: 20,
      },
    );

    this.load.image(
      "board",
      `world/april_fools_island_assets/event_info_board.png`,
    );

    this.load.image("board_icon", "world/question_disc.png");

    this.load.image("shop_icon", "world/shop_disc.png");
  }

  async create() {
    this.map = this.make.tilemap({ key: "april_fools_island" });
    super.create();

    const portal_entrance = this.add.sprite(250, 65, "portal_entrance");
    this.anims.create({
      key: "portal_entrance_animation",
      frames: this.anims.generateFrameNumbers("portal_entrance", {
        start: 0,
        end: 12,
      }),
      repeat: -1,
      frameRate: 5,
    });
    portal_entrance.play("portal_entrance_animation", true);
    this.physics.world.enable(portal_entrance);
    this.colliders?.add(portal_entrance);
    (portal_entrance.body as Phaser.Physics.Arcade.Body)
      .setSize(96, 64)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    portal_entrance
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(portal_entrance, 100)) {
          interactableModalManager.open("april_fools");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    const portalLabel = new Label(this, "PLAY");
    this.add.existing(portalLabel);
    portalLabel.setPosition(250, 60);
    portalLabel.setDepth(10000);

    const event_shop = this.add.sprite(390, 180, "event_shop");
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
      .setSize(48, 32)
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
    shopLabel.setPosition(390, 180 - 30);
    shopLabel.setDepth(10000);

    const noticeboard = this.add.sprite(220, 220, "board");
    this.add.image(220, 200, "board_icon").setDepth(1000000);

    noticeboard.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(noticeboard, 75)) {
        interactableModalManager.open("event_noticeboard");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    const teeth = this.add.sprite(330, 140, "teeth");
    this.anims.create({
      key: "teeth_animation",
      frames: this.anims.generateFrameNumbers("teeth", {
        start: 0,
        end: 12,
      }),
      repeat: -1,
      frameRate: 10,
    });
    teeth.play("teeth_animation", true);
  }
}
