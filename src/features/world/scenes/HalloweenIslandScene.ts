import mapJSON from "assets/map/halloween_island.json";
import tilesetConfig from "assets/map/halloween_island_tileset.json";
import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { interactableModalManager } from "../ui/InteractableModals";
import { Label } from "../containers/Label";
import { translate } from "lib/i18n/translate";

const BUMPKINS: NPCBumpkin[] = [
  {
    npc: "luna",
    x: 475,
    y: 75,
    direction: "left",
  },
];

export class HalloweenIslandScene extends BaseScene {
  sceneId: SceneId = "halloween_island";

  constructor() {
    super({
      name: "halloween_island",
      map: {
        json: mapJSON,
        imageKey: "halloween_island_tileset",
        tilesetUrl: "Halloween Island Tileset",
        defaultTilesetConfig: tilesetConfig,
      },
    });
  }

  preload() {
    super.preload();

    this.load.image(
      "halloween_book",
      `world/event_island_assets/halloween_book.png`,
    );

    this.load.image(
      "halloween_leaderboard",
      `world/event_island_assets/halloween_leaderboard.png`,
    );

    this.load.image(
      "halloween_torch",
      `world/event_island_assets/halloween_torch.png`,
    );

    this.load.spritesheet(
      "witch",
      `world/event_island_assets/witch-pot-stir-sprite.png`,
      {
        frameWidth: 36,
        frameHeight: 36,
      },
    );

    this.load.spritesheet(
      "worm",
      `world/event_island_assets/worm-skull-sprite.png`,
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    this.load.spritesheet(
      "skullfloat",
      `world/event_island_assets/skullfloating.png`,
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    this.load.spritesheet(
      "ghost_animated",
      `world/event_island_assets/ghost_animated.png`,
      {
        frameWidth: 20,
        frameHeight: 19,
      },
    );

    this.load.spritesheet(
      "halloweenwarp",
      `world/event_island_assets/halloweenwarpv2.png`,
      {
        frameWidth: 47,
        frameHeight: 47,
      },
    );

    this.load.spritesheet(
      "donate_halloween_npc",
      `world/event_island_assets/donate_halloween_npc.png`,
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );

    this.load.spritesheet(
      "halloween_portal_entrance",
      `world/event_island_assets/halloween_portal_entrance.png`,
      {
        frameWidth: 74,
        frameHeight: 42,
      },
    );

    this.load.spritesheet(
      "halloween_monsters",
      `world/event_island_assets/halloween_monsters.png`,
      {
        frameWidth: 39,
        frameHeight: 30,
      },
    );
  }
  async create() {
    this.map = this.make.tilemap({
      key: "halloween_island",
    });
    super.create();

    this.initialiseNPCs(BUMPKINS);

    const witch = this.add.sprite(363, 777, "witch");
    this.anims.create({
      key: "witch_animation",
      frames: this.anims.generateFrameNumbers("witch", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 9,
    });
    witch.play("witch_animation", true);

    const worm = this.add.sprite(349, 826, "worm");
    this.anims.create({
      key: "worm_animation",
      frames: this.anims.generateFrameNumbers("worm", {
        start: 0,
        end: 4,
      }),
      repeat: -1,
      frameRate: 5,
    });
    worm.play("worm_animation", true);

    const skullfloat = this.add.sprite(249, 1018, "skullfloat");
    this.anims.create({
      key: "skullfloat_animation",
      frames: this.anims.generateFrameNumbers("skullfloat", {
        start: 0,
        end: 4,
      }),
      repeat: -1,
      frameRate: 2,
    });
    skullfloat.play("skullfloat_animation", true);

    const ghost_animated = this.add.sprite(398, 340, "ghost_animated");
    this.anims.create({
      key: "ghost_animated_animation",
      frames: this.anims.generateFrameNumbers("ghost_animated", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 6,
    });
    ghost_animated.play("ghost_animated_animation", true);

    const halloweenwarp = this.add.sprite(309, 1080, "halloweenwarp");
    this.anims.create({
      key: "halloweenwarp_animation",
      frames: this.anims.generateFrameNumbers("halloweenwarp", {
        start: 0,
        end: 11,
      }),
      repeat: -1,
      frameRate: 8,
    });
    halloweenwarp.play("halloweenwarp_animation", true);

    halloweenwarp
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(halloweenwarp, 75)) {
          interactableModalManager.open("world_map");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    const halloween_portal_entrance = this.add.sprite(
      220,
      698,
      "halloween_portal_entrance",
    );
    this.anims.create({
      key: "halloween_portal_entrance_animation",
      frames: this.anims.generateFrameNumbers("halloween_portal_entrance", {
        start: 0,
        end: 40,
      }),
      repeat: -1,
      frameRate: 10,
    });
    halloween_portal_entrance.play("halloween_portal_entrance_animation", true);

    halloween_portal_entrance
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(halloween_portal_entrance, 40)) {
          interactableModalManager.open("halloween");
          //Change to the right portal
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    const halloween_monsters = this.add.sprite(129, 785, "halloween_monsters");
    this.anims.create({
      key: "halloween_monsters_animation",
      frames: this.anims.generateFrameNumbers("halloween_monsters", {
        start: 0,
        end: 17,
      }),
      repeat: -1,
      frameRate: 10,
    });
    halloween_monsters.play("halloween_monsters_animation", true);

    const halloween_book = this.add.image(424, 720, "halloween_book");

    const halloween_torch = this.add.image(227, 885, "halloween_torch");

    const halloween_noticeboard = this.add.image(
      351,
      1031,
      "halloween_leaderboard",
    );

    halloween_noticeboard
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(halloween_noticeboard, 75)) {
          interactableModalManager.open("halloween_noticeboard");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    const donate_halloween_npc = this.add.sprite(
      212,
      817,
      "donate_halloween_npc",
    );
    this.anims.create({
      key: "donate_halloween_npc_animation",
      frames: this.anims.generateFrameNumbers("donate_halloween_npc", {
        start: 0,
        end: 11,
      }),
      repeat: -1,
      frameRate: 12,
    });
    donate_halloween_npc.play("donate_halloween_npc_animation", true);

    donate_halloween_npc
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", (p: Phaser.Input.Pointer) => {
        if (this.checkDistanceToSprite(donate_halloween_npc, 75)) {
          interactableModalManager.open("donations");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });
    const label = new Label(this, "DONATE");
    this.add.existing(label);
    label.setPosition(212, 817 - 15);
    label.setDepth(10000);

    halloween_book
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(halloween_book, 75)) {
          interactableModalManager.open("halloween_book");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    halloween_torch
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(halloween_torch, 75)) {
          interactableModalManager.open("halloween_torch");
          this.physics.world.disable(door!);
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    const door = this.colliders
      ?.getChildren()
      .find((object) => object.data?.list?.id === "forest_door");
  }
}
