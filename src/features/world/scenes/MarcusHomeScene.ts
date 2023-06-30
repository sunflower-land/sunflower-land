import { SUNNYSIDE } from "assets/sunnyside";
import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class MarcusHomeScene extends BaseScene {
  roomId: RoomId = "marcus_home";

  constructor() {
    super("marcus_home", "wood_footstep");
  }

  preload() {
    super.preload();

    this.load.image("alert", SUNNYSIDE.icons.expression_alerted);

    // SFX
    const door = this.sound.add("door_open");
    door.play({ volume: 0.1 });

    // Shut down the sound when the scene changes
    this.events.on("shutdown", () => {
      door.play({ volume: 0.1 });
      if (door.isPaused) {
        this.sound.getAllPlaying().forEach((sound) => {
          sound.destroy();
        });
      }
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "marcus-home",
    });

    super.create();

    this.add.sprite(56.5, 15.5, "alert");

    this.initialiseNPCs(BUMPKINS);

    // SFX
    this.sound.get("wood_footstep").manager.volume = 1;
  }
}
