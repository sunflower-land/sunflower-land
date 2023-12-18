import PubSub from "pubsub-js";

import { SQUARE_WIDTH } from "features/game/lib/constants";

import { Player } from "../types/Room";
import { SUNNYSIDE } from "assets/sunnyside";
import { MachineInterpreter } from "features/game/lib/gameMachine";

export class FishermanContainer extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;
  public alert: Phaser.GameObjects.Sprite | undefined;

  private fishingState: "idle" | "casting" | "waiting" | "reeling" | "caught" =
    "idle";

  constructor({ scene, x, y }: { scene: Phaser.Scene; x: number; y: number }) {
    super(scene, x, y);
    this.scene = scene;
    scene.physics.add.existing(this);

    this.setSize(58, 50);

    const spriteLoader = scene.load.spritesheet(
      "fisherman",
      SUNNYSIDE.npcs.fishing_sheet,
      {
        frameWidth: 58,
        frameHeight: 50,
      }
    );

    spriteLoader.addListener(Phaser.Loader.Events.COMPLETE, () => {
      const idle = scene.add.sprite(0, 0, "fisherman").setOrigin(0.5);
      this.add(idle);
      this.sprite = idle;

      this.fishingState = "idle";

      this.scene.anims.create({
        key: "idle_animation",
        frames: this.scene.anims.generateFrameNumbers("fisherman", {
          start: 0,
          end: 8,
        }),
        repeat: -1,
        frameRate: 10,
      });

      this.scene.anims.create({
        key: "casting_animation",
        frames: this.scene.anims.generateFrameNumbers("fisherman", {
          start: 9,
          end: 23,
        }),
        repeat: 0,
        frameRate: 10,
      });

      this.scene.anims.create({
        key: "waiting_animation",
        frames: this.scene.anims.generateFrameNumbers("fisherman", {
          start: 24,
          end: 32,
        }),
        repeat: -1,
        frameRate: 10,
      });

      this.scene.anims.create({
        key: "reeling_animation",
        frames: this.scene.anims.generateFrameNumbers("fisherman", {
          start: 33,
          end: 44,
        }),
        repeat: -1,
        frameRate: 10,
      });

      this.scene.anims.create({
        key: "caught_animation",
        frames: this.scene.anims.generateFrameNumbers("fisherman", {
          start: 46,
          end: 55,
        }),
        repeat: 0,
        frameRate: 10,
      });

      // Play casting animation once waiting animation finishes
      this.sprite?.on("animationcomplete-caught_animation", () => {
        this.sprite?.play("idle_animation", true);
        this.fishingState = "idle";
      });

      this.sprite?.on("animationcomplete-casting_animation", () => {
        this.sprite?.play("waiting_animation", true);
        this.fishingState = "waiting";
      });

      this.sprite?.play("idle_animation", true);
    });

    this.setInteractive({ cursor: "pointer" }).on(
      "pointerdown",
      (p: Phaser.Input.Pointer) => {
        if (this.fishingState === "idle") {
          if (p.downElement.nodeName === "CANVAS") {
            PubSub.publish("OPEN_BEACH_FISHERMAN");
          }
        }

        if (this.fishingState === "reeling") {
          if (p.downElement.nodeName === "CANVAS") {
            PubSub.publish("BEACH_FISHERMAN_REEL");
            this.fishingState = "caught";

            this.removeAlert();
          }
        }
      }
    );

    PubSub.subscribe("BEACH_FISHERMAN_CAST", (msg, data) => {
      console.log("CAST THAT BAD BOY");
      if (this.sprite) {
        this.fishingState = "casting";
        this.sprite.play("casting_animation", true);
      }
    });

    PubSub.subscribe("BEACH_FISHERMAN_CAUGHT", (msg, data) => {
      console.log("CAUGHT THAT BAD BOY");
      if (this.sprite) {
        this.fishingState = "reeling";
        this.sprite.play("reeling_animation", true);

        console.log("ADD ALERT");
        if (!this.alert) {
          this.alert = this.scene.add.sprite(-11, -23, "alert").setSize(4, 10);
          this.add(this.alert);
        }
      }
    });

    PubSub.subscribe("BEACH_FISHERMAN_REELED", (msg, data) => {
      if (this.sprite) {
        if (this.sprite) {
          this.sprite.play("caught_animation", true);
        }
      }
    });

    this.scene.add.existing(this);
  }

  private removeAlert() {
    console.log({ alertToDestory: this.alert });
    this.alert?.destroy();
    this.alert = undefined;
  }

  public cast() {}
}
