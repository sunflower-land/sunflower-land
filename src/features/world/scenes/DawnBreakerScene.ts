import { RoomId } from "../roomMachine";
import { interactableModalManager } from "../ui/InteractableModals";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [
  {
    npc: "bella",
    x: 370,
    y: 370,
  },
  {
    npc: "sofia",
    x: 245,
    y: 150,
  },
  {
    npc: "marcus",
    x: 450,
    y: 290,
  },
];

export class DawnBreakerScene extends BaseScene {
  roomId: RoomId = "dawn_breaker";

  constructor() {
    super("dawn_breaker");
  }

  async create() {
    this.map = this.make.tilemap({
      key: "dawn-breaker",
    });

    super.create();

    const sprite = this.add.sprite(125, 261, "homeless_man");
    this.anims.create({
      key: "homeless_animation",
      frames: this.anims.generateFrameNumbers("homeless_man", {
        start: 0,
        end: 11,
      }),
      repeat: -1,
      frameRate: 10,
    });
    sprite.play("homeless_animation", true);

    sprite.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      interactableModalManager.open("homeless_man");
    });
    this.initialiseNPCs(BUMPKINS);

    const camera = this.cameras.main;
  }
}
