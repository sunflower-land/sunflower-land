import mapJson from "assets/map/plaza.json";
import type { SceneId } from "features/world/mmoMachine";
import { BaseScene, type NPCBumpkin } from "features/world/scenes/BaseScene";
import type { MachineInterpreter } from "./lib/portalMachine";

export const NPCS: NPCBumpkin[] = [
  {
    x: 380,
    y: 400,
    // View NPCModals.tsx for implementation of pop up modal
    npc: "portaller",
  },
];

export class PortalExampleScene extends BaseScene {
  sceneId: SceneId = "portal_example";

  constructor() {
    super({
      name: "portal_example",
      map: {
        json: mapJson,
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();
  }

  async create() {
    this.map = this.make.tilemap({
      key: "festival_of_colors",
    });

    super.create();

    this.initialiseNPCs(NPCS);
  }

  public get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }
}
