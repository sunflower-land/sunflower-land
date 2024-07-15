import {
  BumpkinAction,
  MachineInterpreter,
} from "features/game/lib/gameMachine";
import { SpriteComponent } from "../components/SpriteComponent";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { ClickableComponent } from "../components/ClickableComponent";

import { SUNNYSIDE } from "assets/sunnyside";
import { AnimatedComponent } from "../components/AnimatedComponent";
import { getAnimationUrl } from "../lib/animations";
import { NPC_WEARABLES } from "lib/npcs";

export class FarmerContainer extends Phaser.GameObjects.Container {
  gameService: MachineInterpreter;
  sprite: AnimatedComponent;
  clickable: ClickableComponent;

  constructor({
    scene,
    id,
    gameService,
  }: {
    scene: Phaser.Scene;
    id: string;
    gameService: MachineInterpreter;
  }) {
    super(
      scene,
      window.innerWidth / 2 + 3 * SQUARE_WIDTH,
      window.innerHeight / 2 + 3 * SQUARE_WIDTH,
    );
    this.gameService = gameService;

    // Set for click handler size and collision
    this.setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    const url = getAnimationUrl(NPC_WEARABLES["pumpkin' pete"], "idle");
    console.log({ url });
    this.sprite = new AnimatedComponent({
      container: this,
      sprite: url,
      key: "idle",
      scene,
      width: 96,
      height: 64,
      frames: 10,
    });

    this.clickable = new ClickableComponent({
      container: this,
      onClick: this.onClick.bind(this),
    });

    scene.add.existing(this);
  }

  // TODO move side effects (e.g open tutorial modals, analytics etc out of here)
  onClick() {
    // Queue them up
  }

  perform({ action }: { action: BumpkinAction }) {
    this.gameService.send("POP_QUEUE");

    const { event } = action;

    // Just a movement
    if (!event) {
      return;
    }

    const { type, ...args } = event;

    // TODO - animation trigger
    console.log({ event });

    try {
      this.gameService.send(type, args);
    } catch {
      console.log("Failed to send event");
    }
  }

  update() {}
}
