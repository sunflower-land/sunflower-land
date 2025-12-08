import seasonal_kingdom from "assets/map/seasonal_kingdom.json";
import seasonal_tileset from "assets/map/seasonal_tileset.json";

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
import { FactionName, TemperateSeasonName } from "features/game/types/game";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { getKeys } from "features/game/types/decorations";
import { JoinFactionAction } from "features/game/events/landExpansion/joinFaction";
import {
  getFactionScores,
  getPreviousWeek,
  secondsTillWeekReset,
} from "features/game/lib/factions";
import { hasReadKingdomNotice } from "../ui/kingdom/KingdomNoticeboard";
import { EventObject } from "xstate";
import { capitalize } from "lib/utils/capitalize";
import { Label } from "../containers/Label";

const GUARDIAN_MAP: Record<TemperateSeasonName, string> = {
  autumn: "autumn_guardian",
  spring: "spring_guardian",
  summer: "summer_guardian",
  winter: "winter_guardian",
};

export const KINGDOM_NPCS: NPCBumpkin[] = [
  { x: 305, y: 500, npc: "billy", direction: "left" },
  { x: 112, y: 181, npc: "jester" },
  { x: 263, y: 105, npc: "victoria", direction: "left" },
  { x: 353, y: 737, npc: "gambit", direction: "left" },
  { x: 110, y: 800, npc: "graxle" },
  { x: 400, y: 452, npc: "barlow", direction: "left" },
  { x: 370, y: 630, npc: "reginald", direction: "left" },
  { x: 100, y: 440, npc: "nyx" },
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
  bumpkins: "bumpkin_champions",
};

export class KingdomScene extends BaseScene {
  sceneId: SceneId = "kingdom";

  constructor() {
    super({
      name: "kingdom",
      map: {
        json: seasonal_kingdom,
        imageKey: "seasonal-tileset",
        defaultTilesetConfig: seasonal_tileset,
      },
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

    this.load.spritesheet(
      "portal_crops_and_chickens",
      "world/portal_well_crops_and_chickens_sheet.png",
      { frameWidth: 20, frameHeight: 25 },
    );

    this.load.spritesheet("portal_halloween", "world/portal_halloween.png", {
      frameWidth: 23,
      frameHeight: 32,
    });

    const guardian = GUARDIAN_MAP[this.gameState.season.season];
    this.load.image("guardian", `world/${guardian}.webp`);

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
    this.map = this.make.tilemap({ key: "kingdom" });

    super.create();

    this.initialiseNPCs(KINGDOM_NPCS);
    this.addShopDisplayItems();

    const season = this.gameState.season.season;

    // List of all seasonal elements
    const seasonElements = [
      "Water",
      "Ground",
      "Flowers & Grass",
      "Paths",
      "Paths Layer 2",
      "Decoration Base",
      "Decoration Base 2",
      "Decoration Base 3",
      "Decorations Layer 2",
      "Decorations Layer 3",
      "Building Base",
      "Building Base 2",
      "Building Base Decorations",
      "Building Layer 2",
      "Building Layer 3",
      "Building Layer 4",
      "Building Decorations Layer 2",
      "Building Decorations Layer 3",
    ];
    const seasons = ["Spring", "Summer", "Autumn", "Winter"];

    const topElements = [
      "Decorations Layer 2",
      "Decorations Layer 3",
      "Building Layer 2",
      "Building Layer 3",
      "Building Layer 4",
      "Building Decorations Layer 2",
      "Building Decorations Layer 3",
    ];

    const topElementsSet = new Set(topElements);

    // Filter all seasonal layers that are not used for the active season
    seasons
      .filter((seasonName) => seasonName !== capitalize(season)) // Skip the active season
      .forEach((seasonName) => {
        seasonElements.forEach((element) => {
          const layerName = `${element}/${seasonName} ${element}`;
          const layer = this.layers[layerName];

          if (!layer) return; // Skip undefined layers

          layer.setVisible(false); // Hide inactive season layer

          // Set depth for elements that should be drawn on top
          if (topElementsSet.has(element)) {
            const activeLayerName = `${element}/${capitalize(season)} ${element}`;
            this.layers[activeLayerName]?.setDepth(1000000);
          }
        });
      });

    const portal = this.add.sprite(285, 515, "portal");
    this.anims.create({
      key: "portal_anim",
      frames: this.anims.generateFrameNumbers("portal", { start: 0, end: 8 }),
      repeat: -1,
      frameRate: 10,
    });
    portal.play("portal_anim", true);
    portal.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(portal, 40)) {
        interactableModalManager.open("portal_chooser");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    const board1 = this.add.sprite(328, 620, "sunflorian_board");

    board1
      .setDepth(1000000)
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
      .setDepth(1000000)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        npcModalManager.open("barlow");
      });

    const board4 = this.add.sprite(148, 760, "goblin_board");

    board4
      .setDepth(1000000)
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

    const faction = this.gameService.getSnapshot().context.state.faction?.name;
    getKeys(DOORS).forEach((key) => {
      if (faction === key) return;

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

    this.setChampions();

    // After 30 seconds of new week, show the new throne!
    const secondsTillReset = secondsTillWeekReset() + 30;
    setTimeout(() => {
      this.setChampions();
    }, secondsTillReset * 1000);

    if (!hasReadKingdomNotice()) {
      this.add.image(280, 720, "question_disc").setDepth(1000000);
    }

    // Ambience SFX
    if (!this.sound.get("royal_farms")) {
      const nature1 = this.sound.add("royal_farms");
      nature1.play({ loop: true, volume: 0.3 });
    }

    const guardian = this.add.sprite(192, 324, "guardian");
    guardian.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(guardian, 40)) {
        interactableModalManager.open("guardian");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    const guardianLabel = new Label(this, "TRIBUTE", "grey");
    guardianLabel.setPosition(192, 294);
    guardianLabel.setDepth(10000000);
    this.add.existing(guardianLabel);

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
      farmId: Number(this.gameService.getSnapshot().context.farmId),
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
