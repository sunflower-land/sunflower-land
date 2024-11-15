import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Label } from "../containers/Label";
import { interactableModalManager } from "../ui/InteractableModals";

import { PlaceableContainer } from "../containers/PlaceableContainer";
import { budImageDomain } from "features/island/collectibles/components/Bud";
import { SOUNDS } from "assets/sound-effects/soundEffects";
import { NPCName } from "lib/npcs";
import { FactionName } from "features/game/types/game";
import { translate } from "lib/i18n/translate";
import { getBumpkinHoliday } from "lib/utils/getSeasonWeek";

// Maps
import bull_run_plaza from "assets/map/bull_run_plaza.json";

export type FactionNPC = {
  npc: NPCName;
  x: number;
  y: number;
  direction?: "left" | "right";
  faction: Omit<FactionName, "nightshades">;
};

export const PLAZA_BUMPKINS: NPCBumpkin[] = [
  {
    x: 207,
    y: 379,
    npc: "peggy",
  },
  {
    x: 640,
    y: 227,
    direction: "left",
    npc: "hammerin harry",
  },

  {
    x: 815,
    y: 213,
    npc: "poppy",
    direction: "left",
  },
  {
    x: 321,
    y: 259,
    npc: "stella",
  },

  {
    x: 367,
    y: 120,
    npc: "blacksmith",
  },
  {
    x: 760,
    y: 390,
    npc: "grimbly",
  },
  {
    x: 810,
    y: 380,
    npc: "grimtooth",
    direction: "left",
  },

  {
    x: 534,
    y: 88,
    npc: "betty",
    direction: "left",
  },

  {
    x: 506,
    y: 250,
    npc: "birdie",
    direction: "left",
  },

  ...(Date.now() < new Date("2024-11-01T00:00:00").getTime()
    ? [
        {
          x: 214,
          y: 295,
          npc: "hank" as NPCName,
        },
      ]
    : []),
  {
    x: 442,
    y: 173,
    npc: "mayor",
    direction: "left",
  },
];

export class PlazaScene extends BaseScene {
  sceneId: SceneId = "plaza";

  placeables: {
    [sessionId: string]: PlaceableContainer;
  } = {};

  public arrows: Phaser.GameObjects.Sprite | undefined;

  constructor() {
    super({
      name: "plaza",
      map: {
        json: bull_run_plaza,
        imageKey: "tileset",
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    this.load.audio("chime", SOUNDS.notifications.chime);

    this.load.image("vip_gift", "world/vip_gift.png");
    this.load.image("rabbit_1", "world/rabbit_1.png");
    this.load.image("rabbit_2", "world/rabbit_2.png");
    this.load.image("rabbit_3", "world/rabbit_3.png");
    this.load.image("rabbit_4", "world/rabbit_4.png");
    this.load.image("rabbit_5", "world/rabbit_5.png");
    this.load.image("rabbit_6", "world/rabbit_6.png");

    this.load.image("page", "world/page.png");
    this.load.image("arrows_to_move", "world/arrows_to_move.png");

    this.load.image("shop_icon", "world/shop_disc.png");
    this.load.image("trade_icon", "world/trade_icon.png");

    this.load.spritesheet("plaza_bud", "world/plaza_bud.png", {
      frameWidth: 15,
      frameHeight: 18,
    });

    this.load.spritesheet("plaza_bud_2", "world/plaza_bud_2.png", {
      frameWidth: 15,
      frameHeight: 18,
    });

    this.load.spritesheet("plaza_bud_3", "world/plaza_bud_3.png", {
      frameWidth: 15,
      frameHeight: 18,
    });

    this.load.spritesheet("turtle_bud", "world/turtle.png", {
      frameWidth: 15,
      frameHeight: 17,
    });

    this.load.spritesheet("snow_horn_bud", "world/snow_horn_bud.png", {
      frameWidth: 15,
      frameHeight: 14,
    });

    this.load.spritesheet("snow_bud", "world/snow_mushroom.png", {
      frameWidth: 15,
      frameHeight: 15,
    });

    this.load.spritesheet("fat_chicken", "world/fat_chicken.png", {
      frameWidth: 17,
      frameHeight: 21,
    });

    this.load.spritesheet("mecha_bull", "world/mecha_bull.webp", {
      frameWidth: 35,
      frameHeight: 31,
    });

    this.load.image("chest", "world/rare_chest.png");
    this.load.image("trading_board", "world/trading_board.png");

    this.load.image("basic_chest", "world/basic_chest.png");
    this.load.image("luxury_chest", "world/luxury_chest.png");
    this.load.image("locked_disc", "world/locked_disc.png");
    this.load.image("key_disc", "world/key_disc.png");
    this.load.image("luxury_key_disc", "world/luxury_key_disc.png");

    // Stella Megastore items
    this.load.image("tomato_bombard", "world/tomato_bombard.gif");

    this.load.image("explorer_hat", "world/explorer_hat.png");
    this.load.image("cowboy_hat", "world/cowboy_hat.png");

    this.load.image("pharaoh_banner", "world/pharaohs_treasure_banner.webp");
    this.load.image("bull_run_banner", "world/bull_run_banner.webp");

    this.load.spritesheet("glint", "world/glint.png", {
      frameWidth: 7,
      frameHeight: 7,
    });

    super.preload();

    // Ambience SFX
    if (!this.sound.get("nature_1")) {
      const nature1 = this.sound.add("nature_1");
      nature1.play({ loop: true, volume: 0.01 });
    }

    // Shut down the sound when the scene changes
    this.events.once("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
    });
  }

  updateColyseus(faction: string) {
    this.mmoService?.state.context.server?.send("player:faction:update", {
      faction,
    });
  }

  async create() {
    super.create();

    const tradingBoard = this.add.sprite(725, 260, "trading_board");
    tradingBoard.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(tradingBoard, 75)) {
        interactableModalManager.open("trading_board");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    const tradingBoardIcon = this.add.sprite(745, 240, "trade_icon");
    tradingBoardIcon
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(tradingBoardIcon, 75)) {
          interactableModalManager.open("trading_board");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });
    tradingBoardIcon.setDepth(1000000);

    let bumpkins = PLAZA_BUMPKINS;

    const { holiday } = getBumpkinHoliday({});
    const isHoliday = holiday === new Date().toISOString().split("T")[0];

    if (!isHoliday) {
      bumpkins = [
        ...bumpkins,
        {
          x: 371,
          y: 420,
          npc: "pumpkin' pete",
        },
        {
          x: 795,
          y: 118,
          npc: "bert",
          direction: "left",
        },
        {
          x: 631,
          y: 98,
          npc: "timmy",
        },
        {
          x: 307,
          y: 72,
          npc: "raven",
          direction: "left",
        },

        {
          x: 480,
          y: 140,
          npc: "cornwell",
        },
        {
          x: 90,
          y: 70,
          npc: "tywin",
        },
      ];
    } else {
      bumpkins = [
        ...bumpkins,
        {
          x: 555,
          y: 252,
          npc: "pumpkin' pete",
          hideLabel: true,
        },
        {
          x: 575,
          y: 252,
          npc: "tywin",
          direction: "left",
          hideLabel: true,
        },
        {
          x: 640,
          y: 250,
          npc: "cornwell",
          direction: "left",
          hideLabel: true,
        },

        {
          x: 620,
          y: 245,
          npc: "bert",
          hideLabel: true,
        },
        {
          x: 584,
          y: 230,
          npc: "timmy",
          hideLabel: true,
        },
        {
          x: 307,
          y: 72,
          npc: "raven",
          direction: "left",
        },
      ];
    }
    this.initialiseNPCs(bumpkins);

    if (!this.joystick && !localStorage.getItem("mmo_introduction.read")) {
      this.arrows = this.add
        .sprite(
          (this.currentPlayer?.x ?? 0) + 2,
          (this.currentPlayer?.y ?? 0) - 4,
          "arrows_to_move",
        )
        .setDepth(1000000000000);
    }

    const vipGift = this.add.sprite(379, 240, "vip_gift");
    vipGift.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      interactableModalManager.open("vip_chest");
    });

    if (this.gameState.inventory["Treasure Key"]) {
      this.add.sprite(106, 140, "key_disc").setDepth(1000000000);
    } else {
      this.add.sprite(106, 140, "locked_disc").setDepth(1000000000);
    }

    if (this.gameState.inventory["Beta Pass"]) {
      // Add an invisible clickable square at x and y coords
      const clickableSquare = this.add.rectangle(775, 248, 16, 16, 0, 0);
      clickableSquare
        .setInteractive({ cursor: "pointer" })
        .on("pointerdown", () => {
          interactableModalManager.open("flower_bounties");
        });
    }

    // Sprites
    const basicChest = this.add.sprite(106, 160, "basic_chest");
    this.physics.world.enable(basicChest);
    this.colliders?.add(basicChest);
    this.triggerColliders?.add(basicChest);
    (basicChest.body as Phaser.Physics.Arcade.Body)
      .setSize(17, 20)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);
    basicChest.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(basicChest, 75)) {
        interactableModalManager.open("basic_chest");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    const luxuryChest = this.add.sprite(825, 70, "luxury_chest");
    this.physics.world.enable(luxuryChest);
    this.colliders?.add(luxuryChest);
    this.triggerColliders?.add(luxuryChest);
    (luxuryChest.body as Phaser.Physics.Arcade.Body)
      .setSize(17, 20)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);
    luxuryChest.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(luxuryChest, 75)) {
        interactableModalManager.open("luxury_chest");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    this.add.sprite(321.5, 230, "shop_icon");

    if (this.gameState.inventory["Luxury Key"]) {
      this.add.sprite(825, 50, "luxury_key_disc").setDepth(1000000000);
    } else {
      this.add.sprite(825, 50, "locked_disc").setDepth(1000000000);
    }

    const clubHouseLabel = new Label(this, "CLUBHOUSE", "brown");
    clubHouseLabel.setPosition(152, 262);
    clubHouseLabel.setDepth(10000000);
    this.add.existing(clubHouseLabel);

    // Plaza Bud
    const fatChicken = this.add.sprite(106, 352, "fat_chicken");
    this.anims.create({
      key: "fat_chicken_animation",
      frames: this.anims.generateFrameNumbers("fat_chicken", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    fatChicken.play("fat_chicken_animation", true);
    fatChicken.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(fatChicken, 75)) {
        interactableModalManager.open("fat_chicken");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    // Plaza Bud
    const bud = this.add.sprite(500, 420, "plaza_bud");
    this.anims.create({
      key: "plaza_bud_animation",
      frames: this.anims.generateFrameNumbers("plaza_bud", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    bud
      .play("plaza_bud_animation", true)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(bud, 75)) {
          interactableModalManager.open("bud");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    // Banner
    const banner = "bull_run_banner";
    this.add.image(400, 225, banner).setDepth(100000000000);
    this.add.image(464, 225, banner).setDepth(100000000000);
    this.add.image(480, 386, banner).setDepth(100000000000);
    this.add.sprite(385, 386, banner).setDepth(100000000000);

    const bud3 = this.add.sprite(176, 290, "plaza_bud_3");
    this.anims.create({
      key: "plaza_bud_animation_3",
      frames: this.anims.generateFrameNumbers("plaza_bud_3", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    bud3
      .play("plaza_bud_animation_3", true)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(bud3, 75)) {
          interactableModalManager.open("bud");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    const turtle = this.add.sprite(119, 293, "turtle_bud");
    turtle.setScale(-1, 1);
    this.anims.create({
      key: "turtle_bud_anim",
      frames: this.anims.generateFrameNumbers("turtle_bud", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    turtle
      .play("turtle_bud_anim", true)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(turtle, 75)) {
          interactableModalManager.open("bud");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    const snowHornBud = this.add.sprite(128, 235, "snow_horn_bud");
    snowHornBud.setScale(-1, 1);
    this.anims.create({
      key: "snow_horn_bud_anim",
      frames: this.anims.generateFrameNumbers("snow_horn_bud", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    snowHornBud.setVisible(false).play("snow_horn_bud_anim", true);

    const chest = this.add
      .sprite(152, 230, "chest")
      .setVisible(false)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(chest, 75)) {
          interactableModalManager.open("clubhouse_reward");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    const mechaBull = this.add.sprite(248, 244, "mecha_bull");
    this.anims.create({
      key: "mech_bull_anim",
      frames: this.anims.generateFrameNumbers("mecha_bull", {
        start: 0,
        end: 7,
      }),
      repeat: -1,
      frameRate: 10,
    });
    mechaBull.play("mech_bull_anim", true);

    const featuredHat = "cowboy_hat";
    this.add.image(288.5, 248, featuredHat);

    if (this.textures.exists("sparkle")) {
      const sparkle = this.add.sprite(564, 191, "sparkle");
      sparkle.setDepth(1000000);

      this.anims.create({
        key: `sparkel_anim`,
        frames: this.anims.generateFrameNumbers("sparkle", {
          start: 0,
          end: 6,
        }),
        repeat: -1,
        frameRate: 6,
      });

      const sparkle2 = this.add.sprite(585, 205, "sparkle");
      sparkle2.setDepth(1000000);

      const sparkle3 = this.add.sprite(598, 181, "sparkle");
      sparkle3.setDepth(1000000);

      const sparkle4 = this.add.sprite(615, 205, "sparkle");
      sparkle4.setDepth(1000000);

      const sparkle5 = this.add.sprite(639, 181, "sparkle");
      sparkle5.setDepth(1000000);

      sparkle.play(`sparkel_anim`, true);
      sparkle2.play(`sparkel_anim`, true);
      sparkle3.play(`sparkel_anim`, true);
      sparkle4.play(`sparkel_anim`, true);
      sparkle5.play(`sparkel_anim`, true);
    }

    const door = this.colliders
      ?.getChildren()
      .find((object) => object.data?.list?.id === "clubhouse_door");

    // TODO
    const canAccess = Object.keys(this.gameState.buds ?? {}).length > 0;

    if (door && canAccess) {
      this.physics.world.disable(door);
    }

    // Opening and closing clubhouse door
    this.onCollision["clubhouse_door"] = async (obj1, obj2) => {
      if (!canAccess) {
        interactableModalManager.open("guild_house");
        return;
      }

      const wasOpen = chest.visible;
      const isOpen = (obj1 as any).y > (obj2 as any).y;

      this.layers["Club House Roof"].setVisible(isOpen);
      this.layers["Club House Base"].setVisible(isOpen);
      this.layers["Club House Door"].setVisible(isOpen);
      clubHouseLabel.setVisible(isOpen);

      snowHornBud.setVisible(!isOpen);
      chest.setVisible(!isOpen);

      if (wasOpen === isOpen) {
        this.mmoService?.state.context.server?.send("map:clubhouse:open", {
          action: "open_clubhouse",
        });
      }

      return;
    };

    const server = this.mmoService?.state.context.server;
    if (!server) return;

    /* server.state.actions.onAdd(async (action) => {
      if (
        action.event === "open_clubhouse" &&
        !!this.layers["Club House Door"].visible
      ) {
        this.layers["Club House Door"].setVisible(false);

        await new Promise((res) => setTimeout(res, 1000));

        this.layers["Club House Door"].setVisible(true);
      }
    }); */
  }

  syncPlaceables() {
    const server = this.mmoServer;
    if (!server) return;

    // Destroy any dereferenced placeables
    Object.keys(this.placeables).forEach((sessionId) => {
      const hasLeft =
        !server.state.buds.get(sessionId) ||
        server.state.buds.get(sessionId)?.sceneId !== this.scene.key;

      const isInactive = !this.placeables[sessionId]?.active;

      if (hasLeft || isInactive) {
        this.placeables[sessionId]?.disappear();
        delete this.placeables[sessionId];
      }
    });

    // Create new placeables
    server.state.buds?.forEach((bud, sessionId) => {
      if (bud.sceneId !== this.scene.key) return;

      if (!this.placeables[sessionId]) {
        this.placeables[sessionId] = new PlaceableContainer({
          sprite: `https://${budImageDomain}.sunflower-land.com/sheets/idle/${bud.budId}.webp`,
          x: bud.x,
          y: bud.y,
          scene: this,
        });
      }
    });
  }

  public update() {
    super.update();
    this.syncPlaceables();

    if (this.movementAngle && this.arrows) {
      this.arrows.setVisible(false);
    }
  }
}
