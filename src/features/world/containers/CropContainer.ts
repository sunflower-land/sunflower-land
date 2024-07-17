import { v4 as uuidv4 } from "uuid";
import { MachineInterpreter } from "features/game/lib/gameMachine";
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
import { CROPS } from "features/game/types/crops";
import { InventoryItemName } from "features/game/types/game";
import { LifecycleComponent } from "../components/LifecycleComponent";
import { SUNNYSIDE } from "assets/sunnyside";

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
      sprite: CROP_LIFECYCLE.Sunflower.crop,
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
      this.renderCrop();
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
      if (
        event.type === "crop.harvested" &&
        (event as LandExpansionHarvestAction).index === this.id
      ) {
        this.harvested();
      }

      if (
        event.type === "seed.planted" &&
        (event as LandExpansionPlantAction).index === this.id
      ) {
        this.planted();
      }
    });

    // Some generic update listener
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

  harvested() {
    // Play Audio

    // Show Yield
    this.yield.show(1);

    this.lifecycle?.destroy();
    this.lifecycle = undefined;
    this.progressBar?.destroy();
    this.progressBar = undefined;
  }

  planted() {
    this.renderCrop();
  }

  renderCrop() {
    const plot = this.gameService.state.context.state.crops[this.id];
    if (plot.crop) {
      let harvestSeconds = CROPS()[plot.crop.name].harvestSeconds;
      const readyAt = plot.crop.plantedAt + harvestSeconds * 1000;

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

      this.progressBar = new ProgressBarContainer({
        container: this,
        scene: this.scene,
        startAt: plot.crop.plantedAt,
        endAt: readyAt,
      });
    }
  }

  update() {
    this.lifecycle?.update();
    this.progressBar?.update();
  }
}
