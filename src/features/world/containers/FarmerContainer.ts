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
import { FarmScene } from "../scenes/FarmScene";
import { LandExpansionChopAction } from "features/game/events/landExpansion/chop";

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
    scene: FarmScene;
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
        play: true,
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
    this.state = "moving";
  }

  idle() {
    this.sprite.url = getAnimationUrl(NPC_WEARABLES["pumpkin' pete"], "idle");
    this.sprite.key = "idle"; // TODO - custom for each npc
    this.sprite.update();
    this.state = "idle";
  }

  state: "performing" | "idle" | "moving" = "idle";

  async perform({ action }: { action: BumpkinAction }) {
    this.gameService.send("POP_QUEUE");

    this.idle();

    const { event } = action;

    // Just a movement
    if (!event) {
      return;
    }

    this.state = "performing";

    console.log("PROCESS IT");
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

    // Get element and perform action on it - await for it to finish.

    const farmScene = this.scene as FarmScene;
    const farmer = this;

    console.log({ stopOn: `animationcomplete-${animation}-animation` });

    const onUpdate = function (a: { key: string }, frame: { index: number }) {
      if (a.key === `${animation}-animation` && frame.index === 6) {
        if (type === "timber.chopped") {
          const tree = farmScene.trees.get(
            (args as LandExpansionChopAction).index,
          );
          tree?.chop();

          farmer.sprite.sprite?.off("animationupdate", onUpdate);
        }
      }
    };

    const onComplete = function () {
      farmer.idle();

      farmer.sprite.sprite?.off("animationcomplete", onComplete);
    };

    this.sprite.sprite?.on("animationupdate", onUpdate);
    this.sprite.sprite?.on("animationcomplete", onComplete);
  }

  update() {}
}
