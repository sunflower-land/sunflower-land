import { Lifecycle } from "features/island/plots/lib/plant";
import Phaser, { Physics } from "phaser";

export interface IComponent {
  update(): void; // Each component should implement an update method
  init(gameObject: GameEntity): void;
}

// export interface IGameEntity {
//   update(): void;

//   getComponent<T extends IComponent>(
//     componentClass: new (...args: any[]) => T,
//   ): T | undefined;
// }

export class GameEntity extends Phaser.GameObjects.Container {
  private components: IComponent[];

  constructor(scene: Phaser.Scene, ...components: IComponent[]) {
    super(scene);
    this.components = components;
  }

  update() {
    this.components.forEach((component) => component.update());
  }

  getComponent<T extends IComponent>(
    componentClass: new (...args: any[]) => T,
  ): T | undefined {
    return this.components.find((c) => c instanceof componentClass) as T;
  }
}

export type LifecycleProps = {
  lifecycle: Lifecycle;
  startAt: number;
  endAt: number;
};

export class LifecycleComponent implements IComponent {
  data: LifecycleProps;
  gameObject?: GameEntity;

  constructor(data: LifecycleProps) {
    this.data = data;
  }

  init(gameObject: GameEntity) {
    this.gameObject = gameObject;
  }

  update() {
    // Handle player input
    console.log("Updating Player Input");

    // Set the correct image based on the time
  }
}
