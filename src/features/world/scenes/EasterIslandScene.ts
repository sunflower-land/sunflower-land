import mapJSON from "assets/map/easter_island.json";
import tilesetConfig from "assets/map/easter_island_tileset.json";
import { SceneId } from "../mmoMachine";
import { BaseScene } from "./BaseScene";
import { interactableModalManager } from "../ui/InteractableModals";
import { Label } from "../containers/Label";
import { translate } from "lib/i18n/translate";

export class EasterIslandScene extends BaseScene {
  sceneId: SceneId = "easter_island";

  constructor() {
    super({
      name: "easter_island",
      map: {
        json: mapJSON,
        imageKey: "easter_island_tileset",
        tilesetUrl: "Easter Island Tileset",
        defaultTilesetConfig: tilesetConfig,
      },
    });
  }

  preload() {
    super.preload();

    this.load.spritesheet(
      "donate_easter_npc",
      `world/event_island_assets/pablo.png`,
      {
        frameWidth: 16,
        frameHeight: 20,
      },
    );

    this.load.spritesheet(
      "easter_door",
      `world/event_island_assets/easter_door.png`,
      {
        frameWidth: 48,
        frameHeight: 48,
      },
    );

    this.load.spritesheet(
      "easter_portal_entrance",
      `world/event_island_assets/easter_warp.png`,
      {
        frameWidth: 30,
        frameHeight: 30,
      },
    );

    this.load.spritesheet(
      "giant_egg",
      `world/event_island_assets/giant_egg.png`,
      {
        frameWidth: 52,
        frameHeight: 64,
      },
    );

    this.load.image(
      "easter_store",
      `world/event_island_assets/easter_store.png`,
    );

    this.load.image("shop_icon", "world/shop_disc.png");
  }
  async create() {
    this.map = this.make.tilemap({
      key: "easter_island",
    });
    super.create();

    const easter_portal_entrance = this.add.sprite(
      440,
      245,
      "easter_portal_entrance",
    );
    this.anims.create({
      key: "easter_portal_entrance_animation",
      frames: this.anims.generateFrameNumbers("easter_portal_entrance", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 8,
    });
    easter_portal_entrance.play("easter_portal_entrance_animation", true);

    easter_portal_entrance
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(easter_portal_entrance, 40)) {
          interactableModalManager.open("easter-eggstravaganza");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });
    const portalLabel = new Label(this, "PLAY");
    this.add.existing(portalLabel);
    portalLabel.setPosition(440, 245 - 20);
    portalLabel.setDepth(10000);

    this.physics.world.enable(easter_portal_entrance);
    this.colliders?.add(easter_portal_entrance);
    (easter_portal_entrance.body as Phaser.Physics.Arcade.Body)
      .setSize(32, 32)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    const donate_easter_npc = this.add.sprite(350, 230, "donate_easter_npc");
    this.anims.create({
      key: "donate_easter_npc_animation",
      frames: this.anims.generateFrameNumbers("donate_easter_npc", {
        start: 0,
        end: 11,
      }),
      repeat: -1,
      frameRate: 8,
    });
    donate_easter_npc.play("donate_easter_npc_animation", true);

    donate_easter_npc
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(donate_easter_npc, 75)) {
          interactableModalManager.open("donations");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });
    const label = new Label(this, "DONATE");
    this.add.existing(label);
    label.setPosition(350, 230 - 13);
    label.setDepth(10000);

    const giant_egg = this.add.sprite(300, 83, "giant_egg");
    this.anims.create({
      key: "giant_egg_animation",
      frames: this.anims.generateFrameNumbers("giant_egg", {
        start: 0,
        end: 35,
      }),
      repeat: -1,
      frameRate: 10,
    });
    giant_egg.play("giant_egg_animation", true);

    const easter_door = this.add.sprite(480, 115, "easter_door");
    this.anims.create({
      key: "easter_door_animation",
      frames: this.anims.generateFrameNumbers("easter_door", {
        start: 0,
        end: 12,
      }),
      repeat: -1,
      frameRate: 10,
    });
    easter_door.play("easter_door_animation", true);

    const easter_store = this.add.sprite(370, 133, "easter_store");
    easter_store.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(easter_store, 75)) {
        interactableModalManager.open("event_shop");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });
    this.add.image(370, 115, "shop_icon").setDepth(1000000);
  }
}
