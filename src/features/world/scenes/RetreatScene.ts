import mapJSON from "assets/map/retreat.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { CONFIG } from "lib/config";
import { interactableModalManager } from "../ui/InteractableModals";

const BUMPKINS: NPCBumpkin[] = [];

export class RetreatScene extends BaseScene {
  sceneId: SceneId = "retreat";

  constructor() {
    super({
      name: "retreat",
      map: { json: mapJSON, imageKey: "goblin-tileset" },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    // Phaser assets must be served from an URL
    this.load.image(
      "goblin-tileset",
      `${CONFIG.PROTECTED_IMAGE_URL}/world/goblin_map-extruded.png`
    );

    this.load.image("wishing_well", `world/goblin_wishing_well.png`);
    this.load.image("balloon", `world/hot_air_balloon.png`);
    this.load.image("bank", `world/goblin_bank.png`);
    this.load.image("exchange", `world/goblin_exchange.png`);
    this.load.spritesheet("blacksmith", `world/goblin_blacksmith.png`, {
      frameWidth: 121,
      frameHeight: 86,
    });

    this.load.spritesheet("raffle", "world/raffle.webp", {
      frameWidth: 33,
      frameHeight: 28,
    });
    this.load.image("raffle_disc", "world/raffle_disc.png");
    this.load.image("withdraw_disc", "world/withdraw_disc.png");
  }

  create() {
    this.map = this.make.tilemap({
      key: "retreat",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    this.add.sprite(114, 215, "exchange");

    this.add.sprite(422, 84, "withdraw_disc").setDepth(1000000000);

    const bank = this.add.sprite(422, 94, "bank");
    bank.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      interactableModalManager.open("bank");
    });

    this.add.sprite(532, 51, "raffle_disc").setDepth(1000000000);

    const wishingWell = this.add.sprite(532, 71, "wishing_well");
    wishingWell.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      interactableModalManager.open("wishingWell");
    });

    const balloon = this.add.sprite(513, 404, "balloon");

    const blacksmith = this.add.sprite(193, 77, "blacksmith");
    this.anims.create({
      key: "blacksmith_animation",
      frames: this.anims.generateFrameNumbers("blacksmith", {
        start: 0,
        end: 11,
      }),
      repeat: -1,
      frameRate: 10,
    });
    blacksmith.play("blacksmith_animation", true);

    this.add.sprite(256, 186, "raffle_disc").setDepth(1000000000);

    const raffle = this.add.sprite(256, 210, "raffle").setDepth(1000000000000);
    this.anims.create({
      key: "raffle_animation",
      frames: this.anims.generateFrameNumbers("raffle", {
        start: 0,
        end: 7,
      }),
      repeat: -1,
      frameRate: 4,
    });
    raffle.play("raffle_animation", true);

    raffle.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      interactableModalManager.open("raffle");
    });
  }
}
