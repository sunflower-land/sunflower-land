import mapJson from "assets/map/plaza.json";
import factionMapJson from "assets/map/plaza_faction_pledge.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Label } from "../containers/Label";
import { interactableModalManager } from "../ui/InteractableModals";
import {
  AudioLocalStorageKeys,
  getCachedAudioSetting,
} from "../../game/lib/audio";
import { PlaceableContainer } from "../containers/PlaceableContainer";
import { budImageDomain } from "features/island/collectibles/components/Bud";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { SOUNDS } from "assets/sound-effects/soundEffects";
import { hasFeatureAccess } from "lib/flags";
import { NPCName } from "lib/npcs";
import { FactionName, GameState } from "features/game/types/game";
import { translate } from "lib/i18n/translate";
import { FACTION_POINT_CUTOFF } from "features/game/events/landExpansion/donateToFaction";

export type FactionNPC = {
  npc: NPCName;
  x: number;
  y: number;
  direction?: "left" | "right";
  faction: Omit<FactionName, "nightshades">;
};

const FACTION_NPCS: FactionNPC[] = [
  {
    x: 32,
    y: 166,
    npc: "lady day",
    faction: "sunflorians",
  },
  {
    x: 32,
    y: 132,
    npc: "robert",
    faction: "bumpkins",
  },
  {
    x: 32,
    y: 96,
    npc: "grommy",
    faction: "goblins",
  },
];

export const PLAZA_BUMPKINS: NPCBumpkin[] = [
  {
    x: 600,
    y: 197,
    npc: "hammerin harry",
  },
  {
    x: 371,
    y: 420,
    npc: "pumpkin' pete",
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
    x: 480,
    y: 140,
    npc: "cornwell",
  },
  {
    x: 795,
    y: 118,
    npc: "bert",
    direction: "left",
  },
  {
    x: 534,
    y: 88,
    npc: "betty",
    direction: "left",
  },
  {
    x: 90,
    y: 70,
    npc: "tywin",
  },
  {
    x: 506,
    y: 250,
    npc: "birdie",
    direction: "left",
  },

  {
    x: 214,
    y: 295,
    npc: "hank",
  },
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

  private bumpkinsBanner: Phaser.GameObjects.Image | undefined;
  private goblinsBanner: Phaser.GameObjects.Image | undefined;
  private nightshadesBanner: Phaser.GameObjects.Image | undefined;
  private sunfloriansBanner: Phaser.GameObjects.Image | undefined;

  private bumpkinsFactionNPC: BumpkinContainer | undefined;
  private goblinsFactionNPC: BumpkinContainer | undefined;
  private nightshadesFactionNPC: Phaser.GameObjects.Sprite | undefined;
  private sunfloriansFactionNPC: BumpkinContainer | undefined;

  private chosenFaction: FactionName | undefined;

  constructor({ gameState }: { gameState: GameState }) {
    const isPreparingKingdom = FACTION_POINT_CUTOFF.getTime() < Date.now();
    super({
      name: "plaza",
      map: {
        json: isPreparingKingdom ? factionMapJson : mapJson,
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
    this.load.image("timer_icon", "world/timer_icon.png");
    this.load.image("trade_icon", "world/trade_icon.png");

    this.load.spritesheet("color_portal", "world/color_portal.webp", {
      frameWidth: 47,
      frameHeight: 47,
    });

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

    this.load.image("chest", "world/rare_chest.png");
    this.load.image("trading_board", "world/trading_board.png");

    this.load.image("basic_chest", "world/basic_chest.png");
    this.load.image("luxury_chest", "world/luxury_chest.png");
    this.load.image("locked_disc", "world/locked_disc.png");
    this.load.image("key_disc", "world/key_disc.png");
    this.load.image("luxury_key_disc", "world/luxury_key_disc.png");

    // Stella Megastore items
    this.load.image("vinny", "world/vinny.webp");
    this.load.image("non_la", "world/non_la.webp");

    this.load.image("banner", "world/clash_of_factions_banner.webp");

    this.load.spritesheet("glint", "world/glint.png", {
      frameWidth: 7,
      frameHeight: 7,
    });

    // Factions
    this.load.image("goblins_banner", "world/goblins_banner.webp");
    this.load.image("bumpkins_banner", "world/bumpkins_banner.webp");
    this.load.image("nightshades_banner", "world/nightshades_banner.webp");
    this.load.image("sunflorians_banner", "world/sunflorians_banner.webp");

    this.load.spritesheet("maximus", "world/maximus.png", {
      frameWidth: 23,
      frameHeight: 26,
    });

    super.preload();

    const audioMuted = getCachedAudioSetting<boolean>(
      AudioLocalStorageKeys.audioMuted,
      false
    );

    if (!audioMuted) {
      // Ambience SFX
      if (!this.sound.get("nature_1")) {
        const nature1 = this.sound.add("nature_1");
        nature1.play({ loop: true, volume: 0.01 });
      }
    }

    // Shut down the sound when the scene changes
    this.events.once("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
    });
  }

  updateColyseus(faction: string) {
    this.mmoService?.state.context.server?.send(0, {
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

    this.initialiseNPCs(PLAZA_BUMPKINS);

    if (!this.joystick && !localStorage.getItem("mmo_introduction.read")) {
      this.arrows = this.add
        .sprite(
          (this.currentPlayer?.x ?? 0) + 2,
          (this.currentPlayer?.y ?? 0) - 4,
          "arrows_to_move"
        )
        .setDepth(1000000000000);
    }

    const vipGift = this.add.sprite(379, 240, "vip_gift");
    vipGift.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      interactableModalManager.open("vip_chest");
    });

    if (this.gameState.inventory["Treasure Key"]) {
      this.add.sprite(112, 140, "key_disc").setDepth(1000000000);
    } else {
      this.add.sprite(112, 140, "locked_disc").setDepth(1000000000);
    }

    // Sprites
    const basicChest = this.add.sprite(112, 160, "basic_chest");
    basicChest.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(basicChest, 75)) {
        interactableModalManager.open("basic_chest");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    const luxuryChest = this.add.sprite(825, 70, "luxury_chest");
    luxuryChest.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(luxuryChest, 75)) {
        interactableModalManager.open("luxury_chest");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    this.add.sprite(321.5, 230, "shop_icon");
    const auctionIcon = this.add.sprite(608, 220, "timer_icon");

    if (this.gameState.inventory["Luxury Key"]) {
      this.add.sprite(825, 50, "luxury_key_disc").setDepth(1000000000);
    } else {
      this.add.sprite(825, 50, "locked_disc").setDepth(1000000000);
    }

    auctionIcon.setDepth(1000000);

    const clubHouseLabel = new Label(this, "CLUBHOUSE", "brown");
    clubHouseLabel.setPosition(152, 262);
    clubHouseLabel.setDepth(10000000);
    this.add.existing(clubHouseLabel);

    // Color Portal
    // Plaza Bud
    const colorPortal = this.add.sprite(150, 150, "color_portal");
    this.anims.create({
      key: "color_portal_anim",
      frames: this.anims.generateFrameNumbers("color_portal", {
        start: 0,
        end: 11,
      }),
      repeat: -1,
      frameRate: 10,
    });

    colorPortal.play("color_portal_anim", true);
    colorPortal.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(colorPortal, 75)) {
        interactableModalManager.open("festival_of_colors");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    if (
      !hasFeatureAccess(this.gameState, "FESTIVAL_OF_COLORS") &&
      Date.now() < new Date("2024-06-30T00:00:00Z").getTime()
    ) {
      this.add.sprite(150, 150, "locked_disc").setDepth(1000000000);
    }

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
    this.add.image(400, 225, "banner").setDepth(100000000000);
    // .setInteractive({ cursor: "pointer" })
    // .on("pointerdown", () => {
    //   interactableModalManager.open("banner");
    // });
    this.add.image(464, 225, "banner").setDepth(100000000000);

    this.add.image(480, 386, "banner").setDepth(100000000000);

    this.add.sprite(385, 386, "banner").setDepth(100000000000);

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

    // Stella Collectible of the Month
    this.add.image(248, 244, "vinny");
    this.add.image(288.5, 248, "non_la");

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
        this.mmoService?.state.context.server?.send(0, {
          action: "open_clubhouse",
        });
      }

      return;
    };

    const server = this.mmoService?.state.context.server;
    if (!server) return;

    server.state.actions.onAdd(async (action) => {
      if (
        action.event === "open_clubhouse" &&
        !!this.layers["Club House Door"].visible
      ) {
        this.layers["Club House Door"].setVisible(false);

        await new Promise((res) => setTimeout(res, 1000));

        this.layers["Club House Door"].setVisible(true);
      }
    });
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
          sprite: `https://${budImageDomain}.sunflower-land.com/sheets/idle/${bud.id}.webp`,
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
