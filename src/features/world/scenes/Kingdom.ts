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
    x: 350,
    y: 460,
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
  }

  create() {
    super.create();
    this.map = this.make.tilemap({
      key: "kingdom",
    });

    this.initialiseNPCs(KINGDOM_NPCS);
  }
}
