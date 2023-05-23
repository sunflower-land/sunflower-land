import { INITIAL_BUMPKIN, SQUARE_WIDTH } from "features/game/lib/constants";
import { npcModalManager } from "../ui/NPCModals";
import { BumpkinContainer } from "../containers/BumpkinContainer";
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

    const camera = this.cameras.main;

    camera.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);
    camera.setZoom(4);

    this.physics.world.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);

    // await new Promise((r) => setTimeout(r, 3000));

    // this.roomService.send("CHANGE_ROOM", {
    //   roomId: "auction_house",
    // });
    // this.game.scene.switch("plaza", "auction_house");
  }
}
