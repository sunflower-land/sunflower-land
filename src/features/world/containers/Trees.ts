import { MachineInterpreter } from "features/game/lib/gameMachine";
import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import { GameObjects } from "phaser";
import { createSelector } from "reselect";
import { TreeContainer } from "./Tree";

export class Trees extends GameObjects.Group {
  constructor(scene: Phaser.Scene, gameService: MachineInterpreter) {
    super(scene);

    const selector = createSelector(
      [(state: GameState) => state.trees],
      (trees) => {
        this.clear(true, true);

        getKeys(trees).forEach((key) => {
          this.add(
            this.scene.add.existing(
              new TreeContainer(scene, gameService, key, trees[key]),
            ),
          );
        });
      },
    );

    gameService.subscribe(({ context }) => selector(context.state));
  }
}
