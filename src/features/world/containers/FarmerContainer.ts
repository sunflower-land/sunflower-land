import {
  BumpkinAction,
  MachineInterpreter,
} from "features/game/lib/gameMachine";
import {
  AnimatedSprite,
  PHASER_GRID_WIDTH,
  SpriteComponent,
} from "../components/SpriteComponent";
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

const EVENT_ANIMATION_HIT_FRAMES: Partial<Record<PlayEvent, number>> = {
  "crop.harvested": 6,
  "timber.chopped": 6,
  "seed.planted": 4,
};

export class FarmerContainer extends Phaser.GameObjects.Container {
  gameService: MachineInterpreter;
  character: SpriteComponent;
  shadow: SpriteComponent;
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
    super(scene, 0, 0);
    this.gameService = gameService;

    // Set for click handler size and collision
    this.setSize(PHASER_GRID_WIDTH, PHASER_GRID_WIDTH);

    const url = getAnimationUrl(NPC_WEARABLES["pumpkin' pete"], "axe");
    console.log({ url });

    this.shadow = new SpriteComponent({
      container: this,
      sprite: "world/shadow.png",
      key: "shadow",
      scene,
      y: 6,
    });

    this.character = new SpriteComponent({
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

    this.bringToTop(this.character.sprite);

    this.clickable = new ClickableComponent({
      container: this,
      onClick: this.onClick.bind(this),
      scene: this.scene,
    });

    scene.add.existing(this);
  }

  // TODO move side effects (e.g open tutorial modals, analytics etc out of here)
  onClick() {
    // Queue them up
  }

  walk() {
    this.character.url = getAnimationUrl(
      NPC_WEARABLES["pumpkin' pete"],
      "walking",
    );
    this.character.key = "walking"; // TODO - custom for each npc
    this.character.update();
    this.state = "moving";
  }

  idle() {
    this.character.url = getAnimationUrl(
      NPC_WEARABLES["pumpkin' pete"],
      "idle",
    );
    this.character.key = "idle"; // TODO - custom for each npc
    this.character.update();
    this.state = "idle";
  }

  state: "performing" | "idle" | "moving" | "waiting" = "idle";

  async perform({ action }: { action: BumpkinAction }) {
    console.log("TOP PERFORM");
    this.idle();

    const { event } = action;

    // Just a movement
    if (!event) {
      this.gameService.send("PERFORM_QUEUE_ACTION", {
        action: action.event,
        x: action.x,
        y: action.y,
      });

      return;
    }

    this.state = "performing";

    console.log("PROCESS IT");
    const { type, ...args } = event;

    // TODO - animation trigger
    const animation = EVENT_ANIMATIONS[type] ?? "doing";
    this.character.url = getAnimationUrl(
      NPC_WEARABLES["pumpkin' pete"],
      animation,
    );
    (this.character.animation as AnimatedSprite).repeat = false;
    this.character.key = animation; // TODO - custom for each npc
    this.character.update();

    // Get element and perform action on it - await for it to finish.

    const farmScene = this.scene as FarmScene;
    const farmer = this;

    console.log({ stopOn: `animationcomplete-${animation}-animation` });

    const hitAtFrame = EVENT_ANIMATION_HIT_FRAMES[type];

    // How do I send an event to the resource to be collected?

    const onUpdate = function (a: { key: string }, frame: { index: number }) {
      if (a.key === `${animation}-animation` && frame.index === hitAtFrame) {
        farmScene.gameService.send("PERFORM_QUEUE_ACTION", {
          action: action.event,
          x: action.x,
          y: action.y,
        });

        // TODO - how to know when to keep moving?

        farmer.character.sprite?.off("animationupdate", onUpdate);
      }
    };

    const onComplete = function () {
      farmer.idle();
      farmer.state = "waiting"; // TODO

      // TODO - when should they be allowed to move again?
      setTimeout(() => {
        farmer.idle();
      }, 1000);

      farmer.character.sprite?.off("animationcomplete", onComplete);
    };

    this.character.sprite?.on("animationupdate", onUpdate);
    this.character.sprite?.on("animationcomplete", onComplete);
  }

  update() {}
}
