import mapJSON from "assets/map/kingdom.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { fetchLeaderboardData } from "features/game/expansion/components/leaderboard/actions/leaderboard";

export const KINGDOM_NPCS: NPCBumpkin[] = [
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
    x: 413,
    y: 459,
    npc: "barlow",
    direction: "left",
  },
  {
    x: 360,
    y: 630,
    npc: "reginald",
    direction: "left",
  },
  {
    x: 135,
    y: 440,
    npc: "nyx",
  },
];

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

    // Preload the leaderboard data (async).
    // This is used by the faction spruikers when claiming emblems.
    fetchLeaderboardData(this.id);

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
  }

  create() {
    super.create();
    this.map = this.make.tilemap({
      key: "kingdom",
    });

    this.initialiseNPCs(KINGDOM_NPCS);

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
  }
}
