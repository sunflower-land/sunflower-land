import {
  BumpkinAction,
  MachineInterpreter,
} from "features/game/lib/gameMachine";
import { AnimatedSprite, SpriteComponent } from "../components/SpriteComponent";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { ClickableComponent } from "../components/ClickableComponent";

import { SUNNYSIDE } from "assets/sunnyside";
import { NPC_WEARABLES } from "lib/npcs";
import { GameEventName, PlayingEvent } from "features/game/events";
import { ANIMATION, getAnimationUrl } from "../lib/animations";

type PlayEvent = GameEventName<PlayingEvent>;
const EVENT_ANIMATIONS: Partial<Record<PlayEvent, keyof typeof ANIMATION>> = {
  "crop.harvested": "dig",
  "timber.chopped": "axe",
};

export class FarmerContainer extends Phaser.GameObjects.Container {
  gameService: MachineInterpreter;
  sprite: SpriteComponent;
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
    this.sprite = new SpriteComponent({
      container: this,
      sprite: url,
      key: "idle",
      scene,
      animation: {
        width: 96,
        height: 64,
        frames: 10,
        repeat: true,
      },
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

  walk() {
    this.sprite.url = getAnimationUrl(
      NPC_WEARABLES["pumpkin' pete"],
      "walking",
    );
    this.sprite.key = "walking"; // TODO - custom for each npc
    this.sprite.update();
  }

  idle() {
    this.sprite.url = getAnimationUrl(NPC_WEARABLES["pumpkin' pete"], "idle");
    this.sprite.key = "idle"; // TODO - custom for each npc
    this.sprite.update();
  }

  async perform({ action }: { action: BumpkinAction }) {
    const { event } = action;

    this.gameService.send("POP_QUEUE");

    // Just a movement
    if (!event) {
      return;
    }

    const { type, ...args } = event;

    // TODO - animation trigger
    const animation = EVENT_ANIMATIONS[type] ?? "doing";
    this.sprite.url = getAnimationUrl(
      NPC_WEARABLES["pumpkin' pete"],
      animation,
    );
    (this.sprite.animation as AnimatedSprite).repeat = false;
    this.sprite.key = animation; // TODO - custom for each npc
    this.sprite.update();

    console.log({ stopOn: `animationcomplete-${animation}-animation` });
    // After one loop, return to walking
    this.sprite.sprite?.on(`animationcomplete-${animation}-animation`, () => {
      try {
        this.gameService.send(type, args);

        // TODO - fire off action on component
      } catch {
        console.log("Failed to send event");
      } finally {
        this.idle();
      }
    });
  }

  update() {}
}
