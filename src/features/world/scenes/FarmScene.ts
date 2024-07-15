import { MachineInterpreter } from "features/game/lib/gameMachine";
import { getKeys } from "features/game/types/decorations";
import { CropContainer } from "../containers/CropContainer";
import { FarmerContainer } from "../containers/FarmerContainer";
import { MovementComponent } from "../components/MovementComponent";
import { DraggableComponent } from "../components/DraggableComponent";
import { BumpkinContainer } from "../containers/BumpkinContainer";

function queueSystem({
  scene,
  components,
  gameService,
}: {
  scene: Phaser.Scene;
  components: FarmerContainer[];
  gameService: MachineInterpreter;
}) {
  const queue = gameService.state.context.queue;

  let next = queue[0];

  if (!next) {
    return;
  }

  // Move containers towards queue item
  components.forEach((component) => {
    component.x = Phaser.Math.Linear(component.x, next.x, 0.05);
    component.y = Phaser.Math.Linear(component.y, next.y, 0.05);

    // Trigger action on arrival?
    const distance = Phaser.Math.Distance.BetweenPoints(next, component);
    if (distance < 2) {
      component.perform({ action: next });
    }
  });
}

function dragSystem({
  scene,
  components,
}: {
  scene: Phaser.Scene;
  components: DraggableComponent[];
}) {
  // TODO - if not in landscape, return

  components.forEach((component) => {
    // Find where each Bumpkin should be going
    component.container.x = component.x;
    component.container.y = component.y;
  });
}

export class FarmScene extends Phaser.Scene {
  sceneId = "farm";

  crops = new Map<string, CropContainer>();
  farmers = new Map<string, FarmerContainer>();

  constructor() {
    super("farm");
  }

  async create() {
    this.initialiseCamera();
    this.render();

    this.input.on(
      "pointerdown",
      (pointer: Phaser.Input.Pointer) => {
        console.log(pointer.x);
        this.gameService.send("QUEUE", {
          x: pointer.worldX,
          y: pointer.worldY,
        });
      },
      this,
    );
  }

  public get gameState() {
    return this.gameService.state.context.state;
  }

  public get id() {
    return this.registry.get("id") as number;
  }

  public get gameService() {
    return this.registry.get("gameService") as MachineInterpreter;
  }

  public initialiseCamera() {
    const camera = this.cameras.main;

    camera.setZoom(4);

    // // Center it on canvas
    // const offsetX = window.innerWidth / 2;
    // const offsetY = window.innerHeight / 2;
    // camera.setPosition(offsetX, offsetY);

    camera.fadeIn();
  }

  async render() {
    const crops = this.gameState.crops;
    getKeys(crops).forEach((cropId) => {
      if (!this.crops.has(cropId)) {
        const crop = new CropContainer({
          scene: this,
          id: cropId,
          gameService: this.gameService,
        });

        this.crops.set(cropId, crop);
      }
    });

    const bumpkin = new FarmerContainer({
      scene: this,
      gameService: this.gameService,
      id: "N/A",
    });
    this.farmers.set("N/A", bumpkin);
  }

  listen() {
    // Add and remove objects from the game scene
  }

  update() {
    // Grab all components (from some entity registry)
    // Call update on everything from here

    // Update the crops
    this.crops.forEach((crop) => {
      crop.update();
    });

    let dragComponents: DraggableComponent[] = [];
    this.crops.forEach((crop) => {
      dragComponents.push(crop.draggable);
    });

    dragSystem({ scene: this, components: dragComponents });

    let bumpkinComponents: FarmerContainer[] = [];
    this.farmers.forEach((farmer) => {
      bumpkinComponents.push(farmer);
    });

    queueSystem({
      scene: this,
      components: bumpkinComponents,
      gameService: this.gameService,
    });
  }
}
