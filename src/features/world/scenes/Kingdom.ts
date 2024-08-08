import mapJSON from "assets/map/kingdom.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import {
  KingdomLeaderboard,
  fetchLeaderboardData,
  getChampionsLeaderboard,
} from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import { SOUNDS } from "assets/sound-effects/soundEffects";

import { npcModalManager } from "../ui/NPCModals";
import { FactionName } from "features/game/types/game";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { getKeys } from "features/game/types/decorations";
import { JoinFactionAction } from "features/game/events/landExpansion/joinFaction";
import { hasFeatureAccess } from "lib/flags";
import {
  getFactionScores,
  getPreviousWeek,
  secondsTillWeekReset,
} from "features/game/lib/factions";
import { hasReadKingdomNotice } from "../ui/kingdom/KingdomNoticeboard";
import { EventObject } from "xstate";
import { hasReadCropsAndChickensNotice } from "../ui/portals/CropsAndChickens";

export const KINGDOM_NPCS: NPCBumpkin[] = [
  {
    x: 305,
    y: 500,
    npc: "billy",
    direction: "left",
  },
  {
    x: 112,
    y: 181,
    npc: "jester",
  },
  {
    x: 263,
    y: 105,
    npc: "victoria",
    direction: "left",
  },
  {
    x: 353,
    y: 737,
    npc: "gambit",
    direction: "left",
  },
  {
    x: 110,
    y: 800,
    npc: "graxle",
  },
  {
    x: 400,
    y: 452,
    npc: "barlow",
    direction: "left",
  },
  {
    x: 370,
    y: 630,
    npc: "reginald",
    direction: "left",
  },
  {
    x: 100,
    y: 440,
    npc: "nyx",
  },
  { npc: "eldric", x: 129, y: 562 },
];

const DOORS: Record<FactionName, Coordinates & { door: string }> = {
  goblins: { x: 120, y: 760, door: "green_door" },
  sunflorians: { x: 21 * 16 + 8, y: 38 * 16 + 8, door: "orange_door" },
  nightshades: { x: 7 * 16 + 8, y: 26 * 16 + 8, door: "red_door" },
  bumpkins: { x: 23 * 16 + 8, y: 27 * 16 + 8, door: "red_door" },
};

const THRONES: Record<FactionName, string> = {
  goblins: "goblin_champions",
  sunflorians: "sunflorian_champions",
  nightshades: "nightshade_champions",
  bumpkins: "sunflorian_champions",
};

export class KingdomScene extends BaseScene {
  sceneId: SceneId = "kingdom";

  constructor() {
    super({
      name: "kingdom",
      map: { json: mapJSON },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    this.load.audio("royal_farms", SOUNDS.songs.royal_farms);

    // Preload the leaderboard data (async).
    // This is used by the faction spruikers when claiming emblems.
    fetchLeaderboardData(this.id);

    this.load.image("question_disc", "world/question_disc.png");
    this.load.image("box_blockade", "world/box_blockade.png");

    this.load.spritesheet("portal", "world/portal_well_sheet.png", {
      frameWidth: 20,
      frameHeight: 25,
    });

    this.load.spritesheet("castle_bud_1", "world/castle_bud_1.webp", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("castle_bud_2", "world/castle_bud_2.webp", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("castle_bud_3", "world/castle_bud_3.webp", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.image("goblin_board", "world/goblin_board.png");
    this.load.image("bumpkin_board", "world/bumpkin_board.png");
    this.load.image("sunflorian_board", "world/sunflorian_board.png");
    this.load.image("nightshade_board", "world/nightshade_board.png");
    this.load.image("goblin_throne", "world/goblin_throne.png");
    this.load.image("knights_gambit", "world/knights_gambit.png");
    this.load.image("sunflorian_helmet", "world/sunflorian_helmet.png");
    this.load.image("shop_icon", "world/shop_disc.png");
    getKeys(DOORS).forEach((key) => {
      this.load.image(DOORS[key].door, `world/${DOORS[key].door}.png`);
    });

    this.load.image("empty_champions", "world/empty_champions.png");
    getKeys(THRONES).forEach((key) => {
      this.load.image(THRONES[key], `world/${THRONES[key]}.png`);
    });
  }

  addShopDisplayItems() {
    this.add.image(40, 562, "goblin_throne");
    this.add.image(96, 553, "knights_gambit");
    this.add.image(161, 554, "sunflorian_helmet");
    this.add.image(129, 532, "shop_icon").setDepth(1000000);
  }

  create() {
    super.create();
    this.map = this.make.tilemap({
      key: "kingdom",
    });

    this.initialiseNPCs(KINGDOM_NPCS);
    this.addShopDisplayItems();

    this.onCollision["faction_door"] = async (obj1, obj2) => {
      interactableModalManager.open("faction_launch");
    };

    const chickenRescuePortal = this.add.sprite(285, 515, "portal");
    this.anims.create({
      key: "portal_anim",
      frames: this.anims.generateFrameNumbers("portal", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    chickenRescuePortal.play("portal_anim", true);
    chickenRescuePortal
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(chickenRescuePortal, 40)) {
          interactableModalManager.open("chicken_rescue");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    if (hasFeatureAccess(this.gameState, "CROPS_AND_CHICKENS")) {
      if (!hasReadCropsAndChickensNotice()) {
        const cropsAndChickensPortalNotice = this.add
          .image(400, 732, "question_disc")
          .setDepth(1000000);
        cropsAndChickensPortalNotice
          .setInteractive({ cursor: "pointer" })
          .on("pointerdown", () => {
            if (this.checkDistanceToSprite(cropsAndChickensPortalNotice, 40)) {
              interactableModalManager.open("crops_and_chickens");
            } else {
              this.currentPlayer?.speak(translate("base.iam.far.away"));
            }
          });
      }

      const cropsAndChickensPortal = this.add.sprite(400, 752, "portal");
      cropsAndChickensPortal.play("portal_anim", true);
      cropsAndChickensPortal
        .setInteractive({ cursor: "pointer" })
        .on("pointerdown", () => {
          if (this.checkDistanceToSprite(cropsAndChickensPortal, 40)) {
            interactableModalManager.open("crops_and_chickens");
          } else {
            this.currentPlayer?.speak(translate("base.iam.far.away"));
          }
        });

      this.physics.world.enable(cropsAndChickensPortal);
      this.colliders?.add(cropsAndChickensPortal);
      (cropsAndChickensPortal.body as Phaser.Physics.Arcade.Body)
        .setSize(32, 32)
        .setOffset(0, 0)
        .setImmovable(true)
        .setCollideWorldBounds(true);
    }

    const board1 = this.add.sprite(328, 620, "sunflorian_board");

    board1
      .setDepth(622)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        npcModalManager.open("reginald");
      });

    const board2 = this.add.sprite(142, 420, "nightshade_board");

    board2
      .setDepth(1000000)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        npcModalManager.open("nyx");
      });

    const board3 = this.add.sprite(315, 425, "bumpkin_board");

    board3
      .setDepth(444)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        npcModalManager.open("barlow");
      });

    const board4 = this.add.sprite(148, 760, "goblin_board");

    board4
      .setDepth(763)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        npcModalManager.open("graxle");
      });

    const bud1 = this.add.sprite(285, 857, "castle_bud_1");
    this.anims.create({
      key: "castle_bud_1_anim",
      frames: this.anims.generateFrameNumbers("castle_bud_1", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    bud1.play("castle_bud_1_anim", true);

    const bud2 = this.add.sprite(314, 284, "castle_bud_2");
    this.anims.create({
      key: "castle_bud_2_anim",
      frames: this.anims.generateFrameNumbers("castle_bud_2", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    bud2.play("castle_bud_2_anim", true);

    const bud3 = this.add.sprite(162, 284, "castle_bud_3");
    this.anims.create({
      key: "castle_bud_3_anim",
      frames: this.anims.generateFrameNumbers("castle_bud_3", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    bud3.setScale(-1, 1).play("castle_bud_3_anim", true);

    const faction = this.gameService.state.context.state.faction?.name;
    getKeys(DOORS).forEach((key) => {
      if (faction === key && hasFeatureAccess(this.gameState, "FACTION_HOUSE"))
        return;

      const door = this.add.image(DOORS[key].x, DOORS[key].y, DOORS[key].door);
      this.physics.add.existing(door);
      (door.body as Phaser.Physics.Arcade.Body)
        .setSize(16, 16)
        .setImmovable(true)
        .setCollideWorldBounds(true);
      this.colliders?.add(door);
      this.physics.world.enable(door);

      const listener = (e: EventObject) => {
        if (
          e.type === "faction.joined" &&
          (e as JoinFactionAction).faction === key &&
          door.active
        ) {
          door.destroy();
        }
      };

      this.gameService.onEvent(listener);

      this.events.on("shutdown", () => {
        this.gameService.off(listener);
      });
    });

    if (hasFeatureAccess(this.gameState, "CHAMPIONS")) {
      this.setChampions();

      // After 30 seconds of new week, show the new throne!
      const secondsTillReset = secondsTillWeekReset() + 30;
      setTimeout(() => {
        this.setChampions();
      }, secondsTillReset * 1000);
    }

    if (!hasReadKingdomNotice()) {
      this.add.image(280, 720, "question_disc").setDepth(1000000);
    }

    // Ambience SFX
    if (!this.sound.get("royal_farms")) {
      const nature1 = this.sound.add("royal_farms");
      nature1.play({ loop: true, volume: 0.3 });
    }

    // Shut down the sound when the scene changes
    this.events.once("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
    });
  }

  public champions: Phaser.GameObjects.Sprite | undefined;

  async setChampions() {
    if (this.champions?.active) {
      this.champions.destroy();
      this.showPoof();
      this.champions = undefined;
    }

    this.champions = this.add.sprite(240, 646, "empty_champions");
    this.physics.add.existing(this.champions);
    (this.champions.body as Phaser.Physics.Arcade.Body)
      .setSize(51, 38)
      .setImmovable(true)
      .setCollideWorldBounds(true);
    this.colliders?.add(this.champions);
    this.physics.world.enable(this.champions);
    this.champions
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        interactableModalManager.open("champions");
      });

    const leaderboard = await getChampionsLeaderboard<KingdomLeaderboard>({
      farmId: Number(this.gameService.state.context.farmId),
      date: getPreviousWeek(),
    });

    if (!leaderboard || leaderboard.status === "pending") {
      return;
    }

    const { winner } = getFactionScores({ leaderboard });

    if (!winner) return;

    if (this.champions.active) {
      this.champions.destroy();
    }
    this.champions = undefined;

    const throne = THRONES[winner];

    if (!this.textures.exists(throne)) {
      return;
    }

    this.champions = this.add.sprite(240, 646, throne);

    this.physics.add.existing(this.champions);
    (this.champions.body as Phaser.Physics.Arcade.Body)
      .setSize(51, 38)
      .setImmovable(true)
      .setCollideWorldBounds(true);
    this.colliders?.add(this.champions);
    this.physics.world.enable(this.champions);

    this.champions
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        interactableModalManager.open("champions");
      });

    this.showPoof();
  }

  showPoof() {
    const poof = this.add.sprite(240, 646, "poof").setDepth(1000000);

    this.anims.create({
      key: `poof_anim`,
      frames: this.anims.generateFrameNumbers("poof", {
        start: 0,
        // TODO - buds with longer animation frames?
        end: 8,
      }),
      repeat: 0,
      frameRate: 10,
    });

    poof.play(`poof_anim`, true);

    // Listen for the animation complete event
    poof.on("animationcomplete", function (animation: { key: string }) {
      if (animation.key === "poof_anim" && poof.active) {
        // Animation 'poof_anim' has completed, destroy the sprite
        poof.destroy();
      }
    });
  }
}
