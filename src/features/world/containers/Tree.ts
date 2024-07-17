import { MachineInterpreter } from "features/game/lib/gameMachine";
import { Tree } from "features/game/types/game";
import { GameObjects } from "phaser";

export class TreeSprite extends GameObjects.Sprite {
  constructor(scene: Phaser.Scene, tree: Tree) {
    super(
      scene,
      0,
      0,
      tree.wood.choppedAt > Date.now() - 10000 ? "tree-stump" : "tree",
    );
  }
}

export class TreeContainer extends GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    gameService: MachineInterpreter,
    id: string,
    tree: Tree,
  ) {
    super(
      scene,
      window.innerWidth / 2 - tree.x * 5,
      window.innerHeight / 2 - tree.y * 5,
    );

    const sprite = new TreeSprite(scene, tree).setInteractive();
    this.add(sprite);

    sprite.on("pointerdown", () =>
      gameService.send("timber.chopped", {
        index: id,
        item: "Axe",
      }),
    );
  }
}
