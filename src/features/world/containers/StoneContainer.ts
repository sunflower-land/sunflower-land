import { PerformQueueEvent } from "features/game/lib/gameMachine";
import {
  SQUARE_WIDTH,
  STONE_RECOVERY_TIME,
  TREE_RECOVERY_TIME,
} from "features/game/lib/constants";
import { ClickableComponent } from "../components/ClickableComponent";
import { YieldContainer } from "./YieldContainer";
import { DraggableComponent } from "../components/DraggableComponent";
import { ProgressBarContainer } from "./ProgressBarContainer";
import { GameState } from "features/game/types/game";
import { LifecycleComponent } from "../components/LifecycleComponent";
import { LandExpansionChopAction } from "features/game/events/landExpansion/chop";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { HasTool } from "features/game/expansion/components/resources/tree/Tree";
import { GameContext } from "features/game/GameProvider";
import { createSelector } from "reselect";
import { isEventType } from "features/game/events";
import { PHASER_GRID_WIDTH, PHASER_SCALE } from "../components/SpriteComponent";

export class StoneContainer extends Phaser.GameObjects.Container {
  context: GameContext;
  id: string;
  resource: LifecycleComponent;
  clickable: ClickableComponent;
  draggable: DraggableComponent;
  yield: YieldContainer;
  progressBar?: ProgressBarContainer;

  name = Math.random().toString();

  constructor({
    scene,
    id,
    context,
  }: {
    scene: Phaser.Scene;
    id: string;
    context: GameContext;
  }) {
    const tree = context.gameService.state.context.state.trees[id];
    super(scene, tree.x * PHASER_GRID_WIDTH, tree.y * PHASER_GRID_WIDTH);
    this.context = context;
    this.id = id;

    // Set for click handler size and collision
    this.setSize(PHASER_GRID_WIDTH * 2, PHASER_GRID_WIDTH * 2);

    this.yield = new YieldContainer({
      container: this,
      key: "stone-yield",
      sprite: {
        sprite: "world/resources/stone_yield.png",
        animation: {
          frames: 13,
          height: 48,
          width: 112,
          play: false,
          repeat: false,
        },
      },
      scene,
    });

    this.resource = new LifecycleComponent({
      container: this,
      stages: [
        {
          sprite: "world/resources/stone_growth_1.png",
          progress: 0,
        },
        {
          sprite: "world/resources/stone_ready.png",
          progress: 1,
          animation: {
            width: 112,
            height: 48,
            frames: 10,
            repeat: false,
            play: false,
          },
        },
      ],
      key: "stone-lifecycle",
      scene: this.scene,
      startAt: this.rock.stone.minedAt,
      endAt: this.readyAt,
      y: 6,
      x: 4,
    });

    // this.moveAbove(this.yield.sprite.sprite, this.sprite.sprite);

    this.clickable = new ClickableComponent({
      container: this,
      onClick: this.onClick.bind(this),
      scene: this.scene,
    });

    this.draggable = new DraggableComponent({
      container: this,
      onDragEnd: () => {
        console.log("On Drag End");
      },
    });

    this.listen();

    scene.add.existing(this);
  }

  private get rock() {
    return this.gameService.state.context.state.stones[this.id];
  }

  private get readyAt() {
    return this.rock.stone.minedAt + STONE_RECOVERY_TIME * 1000;
  }

  private get gameService() {
    return this.context.gameService;
  }
  private get gameState() {
    return this.gameService.state.context.state;
  }

  listen() {
    // Set up listeners on events
    this.gameService.onEvent((event) => {
      if (
        isEventType("stoneRock.mined", event) &&
        event.index.toString() === this.id
      ) {
        this.chopped();
      }
    });

    // Listen for queued Bumpkin actions
    this.gameService.onEvent((event) => {
      if (event.type === "PERFORM_QUEUE_ACTION") {
        const { action } = event as PerformQueueEvent;

        if (
          isEventType("stoneRock.mined", action) &&
          action.index.toString() === this.id
        ) {
          this.chop();
        }
      }
    });

    // Generic update event
    const selector = createSelector(
      [(state: GameState) => state.trees[this.id]],
      (tree) => {
        this.render();
      },
    );

    this.gameService.subscribe(({ context }) => selector(context.state));

    // Some generic update listener
  }

  // TODO move side effects (e.g open tutorial modals, analytics etc out of here)
  onClick() {
    // Check conditions

    // can collect resources otherwise
    this.gameService.send("QUEUE", {
      action: {
        type: "stoneRock.mined",
        index: this.id,
      },
      x: this.x,
      y: this.y,
    });
  }

  async chop() {
    this.resource.sprite.startAnimation();

    console.log("ACTING UP!");

    const onComplete = () => {
      try {
        console.log("MINED");
        this.gameService.send("stoneRock.mined", {
          index: this.id,
          item: "Axe",
        });
      } catch {
        console.log("Failed to send event");
      } finally {
        this.resource.sprite.sprite.off("animationcomplete", onComplete);
      }
    };

    this.resource.sprite.sprite.on("animationcomplete", onComplete);
  }

  chopped() {
    // TODO Play Audio

    // Show Yield
    this.yield.show(1);
  }

  render() {
    this.progressBar = new ProgressBarContainer({
      container: this,
      scene: this.scene,
      startAt: this.rock.stone.minedAt,
      endAt: this.readyAt,
      x: 8,
      y: 26,
    });

    this.resource.startAt = this.rock.stone.minedAt;
    this.resource.endAt = this.readyAt;
    this.resource.update();
  }

  update() {
    this.resource?.update();
    this.progressBar?.update();
  }
}
