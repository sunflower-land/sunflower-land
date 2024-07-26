import { MachineInterpreter } from "features/game/lib/gameMachine";
import { getKeys } from "features/game/types/decorations";
import { CropContainer } from "../containers/CropContainer";
import { FarmerContainer } from "../containers/FarmerContainer";
import { MovementComponent } from "../components/MovementComponent";
import { DraggableComponent } from "../components/DraggableComponent";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { GameContext } from "features/game/GameProvider";
import { TreeContainer } from "../containers/TreeContainer";

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
    if (component.state === "performing" || component.state === "waiting") {
      return;
    }

    // Calculate the direction vector
    const direction = new Phaser.Math.Vector2(
      next.x - component.x,
      next.y - component.y,
    );

    // Normalize the direction vector (to make its length 1)
    direction.normalize();

    // Move component along the direction vector with a fixed speed
    const speed = 1; // Adjust the speed as needed
    component.x += direction.x * speed;
    component.y += direction.y * speed;

    if (component.x > next.x) {
      component.sprite.sprite?.setScale(-1, 1);
    } else if (component.x < next.x) {
      component.sprite.sprite?.setScale(1, 1);
    }

    component.walk();

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
  trees = new Map<string, TreeContainer>();
  farmers = new Map<string, FarmerContainer>();

  context: GameContext;

  constructor({ context }: { context: GameContext }) {
    super("farm");
    this.context = context;
  }

  preload() {
    this.load.image("shadow", "world/shadow.png");
    this.load.image("background", "world/3x3_bg.png");
  }

  async create() {
    this.initialiseCamera();
    this.render();

    // Create the tileSprite to fill the entire screen
    const background = this.add
      .tileSprite(
        0, // x position
        0, // y position
        this.scale.width, // width of the tile sprite
        this.scale.height, // height of the tile sprite
        "background", // key of the image to use
      )
      .setDepth(-1);

    // Set the origin to the top-left corner
    background.setOrigin(0, 0);

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
    return this.gameService.state.context.farmId;
  }

  public get gameService() {
    return this.context.gameService;
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

    const trees = this.gameState.trees;
    getKeys(trees).forEach((treeId) => {
      if (!this.trees.has(treeId)) {
        const tree = new TreeContainer({
          scene: this,
          id: treeId,
          context: this.context,
        });

        this.trees.set(treeId, tree);
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

    // Update the trees
    this.trees.forEach((tree) => {
      tree.update();
    });

    let dragComponents: DraggableComponent[] = [];
    this.crops.forEach((crop) => {
      dragComponents.push(crop.draggable);
    });

    // Pause dragging for testing
    // dragSystem({ scene: this, components: dragComponents });

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
