import { v4 as uuidv4 } from "uuid";
import { MachineInterpreter } from "features/game/lib/gameMachine";
import { SpriteComponent } from "../components/SpriteComponent";
import { CROP_LIFECYCLE, getCropStages } from "features/island/plots/lib/plant";
import { SQUARE_WIDTH, TREE_RECOVERY_TIME } from "features/game/lib/constants";
import { ClickableComponent } from "../components/ClickableComponent";
import { YieldContainer } from "./YieldContainer";
import {
  isReadyToHarvest,
  LandExpansionHarvestAction,
} from "features/game/events/landExpansion/harvest";
import { DraggableComponent } from "../components/DraggableComponent";
import { ProgressBarContainer } from "./ProgressBarContainer";
import { LandExpansionPlantAction } from "features/game/events/landExpansion/plant";
import { CROPS } from "features/game/types/crops";
import { InventoryItemName } from "features/game/types/game";
import { LifecycleComponent } from "../components/LifecycleComponent";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { LandExpansionChopAction } from "features/game/events/landExpansion/chop";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { HasTool } from "features/game/expansion/components/resources/tree/Tree";
import { GameContext } from "features/game/GameProvider";
import { AnimatedComponent } from "react-spring";

export class TreeContainer extends Phaser.GameObjects.Container {
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
    super(
      scene,
      window.innerWidth / 2 + tree.x * SQUARE_WIDTH,
      window.innerHeight / 2 - tree.y * SQUARE_WIDTH,
    );
    this.context = context;
    this.id = id;

    // Set for click handler size and collision
    this.setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.yield = new YieldContainer({
      container: this,
      key: "tree-yield",
      sprite: ITEM_DETAILS.Wood.image,
      scene,
    });

    this.resource = new LifecycleComponent({
      container: this,
      stages: [
        {
          sprite: "world/resources/tree_growth_1.png",
          progress: 0,
        },
        {
          sprite: "world/resources/tree_growth_2.png",
          progress: 0.25,
        },
        {
          sprite: "world/resources/tree_growth_3.png",
          progress: 0.75,
        },
        {
          sprite: "world/resources/tree_ready.png",
          progress: 1,
          animation: {
            width: 64,
            height: 48,
            frames: 7,
            repeat: false,
          },
        },
      ],
      key: "tree-lifecycle",
      scene: this.scene,
      startAt: this.tree.wood.choppedAt,
      endAt: this.readyAt,
      y: -6,
    });

    console.log("Tree setup");

    // this.moveAbove(this.yield.sprite.sprite, this.sprite.sprite);

    this.clickable = new ClickableComponent({
      container: this,
      onClick: this.onClick.bind(this),
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

  private get tree() {
    return this.gameService.state.context.state.trees[this.id];
  }

  private get readyAt() {
    return this.tree.wood.choppedAt + TREE_RECOVERY_TIME * 1000;
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
        event.type === "timber.chopped" &&
        (event as LandExpansionChopAction).index === this.id
      ) {
        this.chopped();
      }
    });

    // Some generic update listener
  }

  // TODO move side effects (e.g open tutorial modals, analytics etc out of here)
  onClick() {
    // Check if ready

    const hasTool = HasTool(this.gameState.inventory, this.gameState);
    if (!hasTool) return;

    if (!isCollectibleBuilt({ name: "Foreman Beaver", game: this.gameState }))
      this.context.shortcutItem("Axe");

    // increase touch count if there is a reward
    if (this.tree.wood.reward) {
      // Open wood reward
      return;
    }

    // can collect resources otherwise
    this.gameService.send("QUEUE", {
      action: {
        type: "timber.chopped",
        index: this.id,
      },
      x: this.x,
      y: this.y,
    });
  }

  async act() {
    this.resource.sprite.startAnimation();

    this.resource.sprite.sprite.on(`animationcomplete-tree-animation`, () => {
      try {
        this.gameService.send("timber.chopped", {
          id: this.id,
        });
      } catch {
        console.log("Failed to send event");
      } finally {
      }
    });
  }

  chopped() {
    // TODO Play Audio

    // Show Yield
    this.yield.show(1);

    this.renderStump();
  }

  renderStump() {
    this.progressBar = new ProgressBarContainer({
      container: this,
      scene: this.scene,
      startAt: this.tree.wood.choppedAt,
      endAt: this.readyAt,
    });

    this.resource.startAt = this.tree.wood.choppedAt;
    this.resource.endAt = this.readyAt;
    this.resource.update();
  }

  update() {
    this.resource?.update();
    this.progressBar?.update();
  }
}
