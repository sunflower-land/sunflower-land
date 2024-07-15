import { MachineInterpreter } from "features/game/lib/gameMachine";
import { getKeys } from "features/game/types/decorations";
import { GameEntity, LifecycleComponent } from "../components/GameEntity";
import { CropContainer } from "../containers/CropContainer";

export class FarmScene extends Phaser.Scene {
  sceneId = "farm";

  crops = new Map<string, CropContainer>();

  constructor() {
    super("farm");
  }

  async create() {
    this.initialiseCamera();
    this.render();
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
  }

  listen() {
    // Add and remove objects from the game scene
  }

  update() {
    // Grab all components (from some entity registry)
    // Call update on everything from here
  }
}
