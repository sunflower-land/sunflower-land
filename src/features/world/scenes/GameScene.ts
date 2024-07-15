import { Trees } from "../containers/Trees";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("game");
  }

  create() {
    new Trees(this);
  }
}
