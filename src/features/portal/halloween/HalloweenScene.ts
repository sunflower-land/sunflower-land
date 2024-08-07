import mapJson from "assets/map/plaza.json";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene, NPCBumpkin } from "features/world/scenes/BaseScene";
import { MachineInterpreter } from "./lib/halloweenMachine";

export const NPCS: NPCBumpkin[] = [
  {
    x: 380,
    y: 400,
    // View NPCModals.tsx for implementation of pop up modal
    npc: "portaller",
  },
];

export class HalloweenScene extends BaseScene {
  sceneId: SceneId = "halloween";

  constructor() {
    super({
      name: "halloween",
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
      key: "halloween",
    });

    super.create();

    this.initialiseNPCs(NPCS);
  }

  public get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }
}
