import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { npcModalManager } from "./NPCModals";
import { BumpkinContainer } from "./BumpkinContainer";
import { BaseScene } from "./BaseScene";

export class PhaserScene extends BaseScene {
  constructor() {
    super("plaza");
  }

  async create() {
    this.map = this.make.tilemap({
      key: "main-map",
    });

    super.create();

    this.betty = new BumpkinContainer(
      this,
      400,
      400,
      {
        ...INITIAL_BUMPKIN,
        id: 44444,
        equipped: {
          ...INITIAL_BUMPKIN.equipped,
          hair: "Rancher Hair",
        },
      },
      () => npcModalManager.open("betty")
    );
    this.betty.body.width = 16;
    this.betty.body.height = 20;
    this.betty.body.setOffset(0, 0);
    this.physics.world.enable(this.betty);
    this.betty.body.setImmovable(true);

    this.betty.body.setCollideWorldBounds(true);

    await new Promise((r) => setTimeout(r, 3000));

    this.scene.launch("auction_house", {});
  }
}
