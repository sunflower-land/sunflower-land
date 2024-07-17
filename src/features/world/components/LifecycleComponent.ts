import { LifecycleStage } from "features/island/plots/lib/plant";
import { SpriteComponent } from "./SpriteComponent";

function getStage({
  startAt,
  endAt,
  stages,
}: {
  startAt: number;
  endAt: number;
  stages: LifecycleStage[];
}) {
  const total = endAt - startAt;
  const progress = Date.now() - startAt;
  const percentage = Math.min(progress / total, 1);

  const stage = [...stages].reverse().find((s) => percentage >= s.progress);

  return stage ?? stages[0];
}

export class LifecycleComponent {
  container: Phaser.GameObjects.Container;
  sprite: SpriteComponent;
  stages: LifecycleStage[];
  scene: Phaser.Scene;
  startAt: number;
  endAt: number;
  key: string;

  constructor({
    container,
    scene,
    stages,
    key,
    startAt,
    endAt,
    x,
    y,
  }: {
    container: Phaser.GameObjects.Container;
    key: string;
    scene: Phaser.Scene;
    stages: LifecycleStage[];
    startAt: number;
    endAt: number;
    y?: number;
    x?: number;
  }) {
    this.container = container;
    this.scene = scene;
    this.key = key;
    this.stages = stages;
    this.startAt = startAt;
    this.endAt = endAt;

    const stage = getStage({
      startAt,
      endAt,
      stages,
    });

    console.log({ stage, startAt, endAt });
    // TODO - load all images

    this.sprite = new SpriteComponent({
      container: this.container,
      key: `${key}-lifecycle-${stage.progress}`,
      sprite: stage.sprite,
      scene,
      x,
      y,
      animation: stage.animation,
    });
  }

  get stage() {
    const total = this.endAt - this.startAt;
    const progress = Date.now() - this.startAt;
    const percentage = progress / total;

    const stage = this.stages.find((s) => progress >= percentage);

    return stage;
  }

  destroy() {
    this.sprite.destroy();
  }

  update() {
    const stage = getStage({
      startAt: this.startAt,
      endAt: this.endAt,
      stages: this.stages,
    });

    // console.log(JSON.stringify(stage));

    this.sprite.key = `${this.key}-lifecycle-${stage.progress}`;
    this.sprite.url = stage.sprite;
    this.sprite.animation = stage.animation;
    this.sprite.update();
  }
}
