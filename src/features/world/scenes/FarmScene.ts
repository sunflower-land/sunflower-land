import { MachineInterpreter } from "features/game/lib/gameMachine";
import { getKeys } from "features/game/types/decorations";
import { CropContainer } from "../containers/CropContainer";
import { FarmerContainer } from "../containers/FarmerContainer";
import { DraggableComponent } from "../components/DraggableComponent";
import { GameContext } from "features/game/GameProvider";
import { TreeContainer } from "../containers/TreeContainer";
import {
  PHASER_GRID_WIDTH,
  PHASER_SCALE,
  SpriteComponent,
} from "../components/SpriteComponent";

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
    const speed = 2 * PHASER_SCALE; // Adjust the speed as needed
    component.x += direction.x * speed;
    component.y += direction.y * speed;

    if (component.x > next.x) {
      component.character.sprite?.setScale(PHASER_SCALE * -1, PHASER_SCALE);
    } else if (component.x < next.x) {
      component.character.sprite?.setScale(PHASER_SCALE, PHASER_SCALE);
    }

    component.walk();

    // Trigger action on arrival?
    const distance = Phaser.Math.Distance.BetweenPoints(next, component);
    if (distance < 2 * PHASER_SCALE) {
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

  background?: Phaser.GameObjects.Container;

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
    this.load.image("background", "world/poc_bg.png");
  }

  async create() {
    this.initialiseCamera();

    new SpriteComponent({
      key: "background",
      sprite: "world/poc_bg.png",
      scene: this,
    });

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

    // Draw coordinates on each x y square
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        this.add
          .text(x * PHASER_GRID_WIDTH, y * PHASER_GRID_WIDTH, `${x},${y}`, {
            color: "red",
          })
          .setOrigin(0, 0);
      }
    }
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
