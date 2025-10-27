import mapJSON from "assets/map/halloween_island.json";
import { SceneId } from "../mmoMachine";
import { BaseScene } from "./BaseScene";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import { Label } from "../containers/Label";

export class HalloweenIslandScene extends BaseScene {
  sceneId: SceneId = "halloween_island";

  constructor() {
    super({
      name: "halloween_island",
      map: {
        json: mapJSON,
        imageKey: "halloween_island_tileset",
      },
    });
  }

  preload() {
    super.preload();

    this.load.spritesheet(
      "event_shop",
      `world/halloween_island_assets/event_shop_spritesheet.png`,
      {
        frameWidth: 74,
        frameHeight: 91,
      },
    );

    this.load.spritesheet(
      "island_warp",
      `world/halloween_island_assets/halloween_warp_spritesheet.png`,
      {
        frameWidth: 47,
        frameHeight: 47,
      },
    );

    this.load.image(
      "portal_entrance",
      `world/halloween_island_assets/dungeon_portal_gate.png`,
    );

    this.load.image(
      "board",
      `world/halloween_island_assets/halloween_info_board.png`,
    );

    this.load.image("board_icon", "world/question_disc.png");

    this.load.image("shop_icon", "world/shop_disc.png");
  }
  async create() {
    this.map = this.make.tilemap({ key: "halloween_island" });
    super.create();

    const portal_entrance = this.add.sprite(327, 110, "portal_entrance");

    portal_entrance
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(portal_entrance, 100)) {
          interactableModalManager.open("halloween");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    const portalLabel = new Label(this, "PLAY");
    this.add.existing(portalLabel);
    portalLabel.setPosition(327, 115 - 20);
    portalLabel.setDepth(10000);

    const event_shop = this.add.sprite(640, 320, "event_shop");
    this.anims.create({
      key: "event_shop_animation",
      frames: this.anims.generateFrameNumbers("event_shop", {
        start: 0,
        end: 19,
      }),
      repeat: -1,
      frameRate: 8,
    });
    event_shop.play("event_shop_animation", true);
    this.physics.world.enable(event_shop);
    this.colliders?.add(event_shop);
    (event_shop.body as Phaser.Physics.Arcade.Body)
      .setSize(74, 91)
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
    shopLabel.setPosition(640, 270);
    shopLabel.setDepth(10000);

    const island_warp = this.add.sprite(615, 164, "island_warp");
    this.anims.create({
      key: "island_warp_animation",
      frames: this.anims.generateFrameNumbers("island_warp", {
        start: 0,
        end: 11,
      }),
      repeat: -1,
      frameRate: 8,
    });
    island_warp.play("island_warp_animation", true);

    island_warp.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(island_warp, 75)) {
        interactableModalManager.open("world_map");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    const noticeboard = this.add.image(576, 245, "board");
    this.add.image(576, 230, "board_icon").setDepth(1000000);

    noticeboard.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(noticeboard, 75)) {
        interactableModalManager.open("event_noticeboard");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });
  }
}
