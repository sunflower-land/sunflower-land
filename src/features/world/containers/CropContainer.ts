import { v4 as uuidv4 } from "uuid";
import {
  MachineInterpreter,
  PerformQueueEvent,
} from "features/game/lib/gameMachine";
import { SpriteComponent } from "../components/SpriteComponent";
import { CROP_LIFECYCLE, getCropStages } from "features/island/plots/lib/plant";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { ClickableComponent } from "../components/ClickableComponent";
import { YieldContainer } from "./YieldContainer";
import {
  isReadyToHarvest,
  LandExpansionHarvestAction,
} from "features/game/events/landExpansion/harvest";
import { DraggableComponent } from "../components/DraggableComponent";
import { ProgressBarContainer } from "./ProgressBarContainer";
import { LandExpansionPlantAction } from "features/game/events/landExpansion/plant";
import { CROPS, CropSeedName } from "features/game/types/crops";
import { GameState, InventoryItemName } from "features/game/types/game";
import { LifecycleComponent } from "../components/LifecycleComponent";
import { SUNNYSIDE } from "assets/sunnyside";
import { createSelector } from "reselect";
import { isEventType } from "features/game/events";

export class CropContainer extends Phaser.GameObjects.Container {
  gameService: MachineInterpreter;
  id: string;
  sprite: SpriteComponent;
  clickable: ClickableComponent;
  draggable: DraggableComponent;
  yield: YieldContainer;
  progressBar?: ProgressBarContainer;
  lifecycle?: LifecycleComponent;

  name = Math.random().toString();

  constructor({
    scene,
    id,
    gameService,
  }: {
    scene: Phaser.Scene;
    id: string;
    gameService: MachineInterpreter;
  }) {
    const plot = gameService.state.context.state.crops[id];
    super(
      scene,
      window.innerWidth / 2 + plot.x * SQUARE_WIDTH,
      window.innerHeight / 2 + plot.y * SQUARE_WIDTH,
    );
    this.gameService = gameService;
    this.id = id;

    // Set for click handler size and collision
    this.setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.sprite = new SpriteComponent({
      container: this,
      sprite: SUNNYSIDE.resource.plot,
      key: "plot",
      scene,
    });

    this.yield = new YieldContainer({
      container: this,
      key: "sunflower-yield",
      scene,
    });

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

    if (plot.crop) {
      this.render();
    }

    this.listen();

    scene.add.existing(this);
  }

  private get crop() {
    return this.gameService.state.context.state.crops[this.id];
  }

  public get gameState() {
    return this.gameService.state.context.state;
  }

  listen() {
    // Set up listeners on events
    this.gameService.onEvent((event) => {
      if (isEventType("crop.harvested", event) && event.index === this.id) {
        this.harvested();
      }

      if (isEventType("seed.planted", event) && event.index === this.id) {
        this.planted();
      }
    });

    // Listen for queued Bumpkin actions
    this.gameService.onEvent((event) => {
      if (event.type === "PERFORM_QUEUE_ACTION") {
        const { action } = event as PerformQueueEvent;

        if (isEventType("crop.harvested", action) && action.index === this.id) {
          this.harvest();
        }

        if (isEventType("seed.planted", action) && action.index === this.id) {
          this.plant({ seed: action.item as CropSeedName });
        }
      }
    });

    // Some generic update listener
    // Generic update event
    const selector = createSelector(
      [(state: GameState) => state.crops[this.id]],
      (tree) => {
        console.log("Update", { tree });
        this.render();
      },
    );

    this.gameService.subscribe(({ context }) => selector(context.state));

    // TODO - remove listeners
  }

  // TODO move side effects (e.g open tutorial modals, analytics etc out of here)
  onClick() {
    const now = Date.now();

    // TODO get this
    const selected: InventoryItemName = "Sunflower Seed";

    // increase touch count if there is a reward
    const readyToHarvest =
      !!this.crop.crop &&
      isReadyToHarvest(now, this.crop.crop, CROPS()[this.crop.crop.name]);

    if (this.crop.crop?.reward && readyToHarvest) {
      // TODO - Open reward
      return;
    }

    // apply fertilisers
    const fertiliserIsSelected = false;
    if (!readyToHarvest && fertiliserIsSelected) {
      this.gameService.send("QUEUE", {
        action: {
          event: "plot.fertilised",
          plotID: this.id,
        },
      });

      return;
    }

    // plant
    if (!this.crop.crop) {
      this.gameService.send("QUEUE", {
        action: {
          type: "seed.planted",
          index: this.id,
          item: selected,
          cropId: uuidv4().slice(0, 8),
        },
        x: this.x,
        y: this.y,
      });

      return;
    }

    // harvest crop when ready
    if (readyToHarvest) {
      this.gameService.send("QUEUE", {
        action: {
          type: "crop.harvested",
          index: this.id,
        },
        x: this.x,
        y: this.y,
      });
    }
  }

  harvest() {
    this.gameService.send("crop.harvested", {
      index: this.id,
    });
  }

  plant({ seed }: { seed: CropSeedName }) {
    this.gameService.send("seed.planted", {
      index: this.id,
      item: seed,
      cropId: uuidv4().slice(0, 8),
    });
  }

  harvested() {
    console.log("HARVESTED TRIGGER", this.id, this.lifecycle);
    // Play Audio

    // Show Yield
    this.yield.show(1);

    this.clear();
  }

  planted() {
    // No effects?
  }

  clear() {
    this.lifecycle?.destroy();
    this.lifecycle = undefined;
    this.progressBar?.destroy();
    this.progressBar = undefined;
  }

  render() {
    console.log("RENDER CROP", this.id);

    const plot = this.gameService.state.context.state.crops[this.id];
    if (plot.crop) {
      let harvestSeconds = CROPS()[plot.crop.name].harvestSeconds;
      const readyAt = plot.crop.plantedAt + harvestSeconds * 1000;

      console.log({ id: this.id, readyAt: new Date(readyAt) });

      if (!this.lifecycle) {
        this.lifecycle = new LifecycleComponent({
          container: this,
          stages: getCropStages({ name: plot.crop.name }),
          key: "sunflower",
          scene: this.scene,
          startAt: plot.crop.plantedAt,
          endAt: readyAt,
          y: -6,
        });
        this.moveAbove(this.lifecycle.sprite.sprite, this.sprite.sprite);
      }

      if (!this.progressBar) {
        this.progressBar = new ProgressBarContainer({
          container: this,
          scene: this.scene,
          startAt: plot.crop.plantedAt,
          endAt: readyAt,
        });
      }
    } else {
      console.log({ noCrop: this.id });
      this.clear();
    }
  }

  update() {
    this.lifecycle?.update();
    this.progressBar?.update();
  }
}
