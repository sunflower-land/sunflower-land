import { SQUARE_WIDTH } from "features/game/lib/constants";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [
  {
    x: 400,
    y: 400,
    npc: "adam",
  },
  {
    x: 350,
    y: 250,
    npc: "boujee",
  },
  {
    x: 665,
    y: 110,
    npc: "billy",
  },
  {
    x: 195,
    y: 160,
    npc: "bobby",
  },
  {
    x: 380,
    y: 130,
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
  },
  {
    x: 610,
    y: 380,
    npc: "dulce",
  },
];
export class PhaserScene extends BaseScene {
  constructor() {
    super("plaza");
  }

  async create() {
    this.map = this.make.tilemap({
      key: "main-map",
    });

    super.create();

    // this.initialiseNPCs(BUMPKINS);

    const camera = this.cameras.main;

    camera.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);
    camera.setZoom(4);

    this.physics.world.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);
  }
}
