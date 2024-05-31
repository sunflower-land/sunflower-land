import mapJSON from "assets/map/kingdom.json";

import { SceneId } from "../mmoMachine";
import { BaseScene } from "./BaseScene";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { FactionName } from "features/game/types/game";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { interactableModalManager } from "../ui/InteractableModals";

export type FactionNPC = {
  npc: NPCName;
  x: number;
  y: number;
  direction?: "left" | "right";
  faction: Omit<FactionName, "nightshades">;
};

export const KINGDOM_NPCS: FactionNPC[] = [
  {
    x: 110,
    y: 800,
    npc: "goblins recruiter",
    faction: "goblins",
  },
  {
    x: 350,
    y: 460,
    npc: "bumpkins recruiter",
    faction: "bumpkins",
    direction: "left",
  },

  {
    x: 360,
    y: 630,
    npc: "sunflorians recruiter",
    direction: "left",
    faction: "sunflorians",
  },
  {
    x: 135,
    y: 440,
    npc: "nightshades recruiter",
    faction: "nightshades",
  },
];

export class KingdomScene extends BaseScene {
  sceneId: SceneId = "kingdom";

  private bumpkinsRecruiterFactionNPC: BumpkinContainer | undefined;
  private goblinsRecruiterFactionNPC: BumpkinContainer | undefined;
  private nightshadesRecruiterFactionNPC: BumpkinContainer | undefined;
  private sunfloriansRecruiterFactionNPC: BumpkinContainer | undefined;
  private chosenFaction: FactionName | undefined;

  constructor() {
    super({
      name: "kingdom",
      map: { json: mapJSON },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();
  }

  setUpKingdomNPCS() {
    KINGDOM_NPCS.forEach(({ npc, x, y, direction = "right", faction }) => {
      const container = new BumpkinContainer({
        scene: this,
        x,
        y,
        clothing: {
          ...NPC_WEARABLES[npc],
          updatedAt: 0,
        },
        direction,
      });

      container.setDepth(y);
      (container.body as Phaser.Physics.Arcade.Body)
        .setSize(16, 20)
        .setOffset(0, 0)
        .setImmovable(true)
        .setCollideWorldBounds(true);

      this.physics.world.enable(container);
      this.colliders?.add(container);
      this.triggerColliders?.add(container);

      switch (faction) {
        case "bumpkins":
          this.bumpkinsRecruiterFactionNPC = container;
          break;
        case "goblins":
          this.goblinsRecruiterFactionNPC = container;
          break;
        case "sunflorians":
          this.sunfloriansRecruiterFactionNPC = container;
          break;
        case "nightshades":
          this.nightshadesRecruiterFactionNPC = container;
          break;
      }
    });
  }

  makeAllFactionRecruiterNPCsInteractive() {
    this.bumpkinsRecruiterFactionNPC?.addOnClick(() =>
      interactableModalManager.open("join_bumpkins")
    );
    this.goblinsRecruiterFactionNPC?.addOnClick(() =>
      interactableModalManager.open("join_goblins")
    );
    this.sunfloriansRecruiterFactionNPC?.addOnClick(() =>
      interactableModalManager.open("join_sunflorians")
    );
    this.nightshadesRecruiterFactionNPC?.addOnClick(() =>
      interactableModalManager.open("join_nightshades")
    );
  }

  makeChosenFactionRecruiterNPCInteractive(chosenFaction: string) {
    switch (chosenFaction) {
      case "bumpkins":
        this.bumpkinsRecruiterFactionNPC?.addOnClick(() =>
          interactableModalManager.open("bumpkins_faction")
        );

        break;
      case "goblins":
        this.goblinsRecruiterFactionNPC?.addOnClick(() =>
          interactableModalManager.open("goblins_faction")
        );
        break;
      case "sunflorians":
        this.sunfloriansRecruiterFactionNPC?.addOnClick(() =>
          interactableModalManager.open("sunflorians_faction")
        );
        break;
      case "nightshades":
        this.sunfloriansRecruiterFactionNPC?.addOnClick(() =>
          interactableModalManager.open("nightshades_faction")
        );
        break;
    }
  }

  create() {
    super.create();
    this.map = this.make.tilemap({
      key: "kingdom",
    });

    this.setUpKingdomNPCS();

    if (this.chosenFaction) {
      this.makeChosenFactionRecruiterNPCInteractive(this.chosenFaction);
    } else {
      this.makeAllFactionRecruiterNPCsInteractive();
    }
  }
}
