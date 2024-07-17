import { SUNNYSIDE } from "assets/sunnyside";
import { Trees } from "../containers/Trees";
import { MachineInterpreter } from "features/game/lib/gameMachine";

export class GameScene extends Phaser.Scene {
  private trees?: Trees;

  constructor() {
    super("game");
  }

  preload() {
    this.load.image("tree", SUNNYSIDE.resource.tree);
    this.load.image("tree-stump", SUNNYSIDE.resource.stump);
  }

  create() {
    const gameService = this.registry.get("gameService") as MachineInterpreter;
    this.trees = new Trees(this, gameService);
  }
}
