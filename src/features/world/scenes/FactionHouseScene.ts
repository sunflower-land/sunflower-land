import { BaseScene } from "./BaseScene";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import { getFactionPrize } from "../ui/factions/weeklyPrize/FactionWeeklyPrize";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

export abstract class FactionHouseScene extends BaseScene {
  preload() {
    super.preload();

    this.load.image("basic_chest", "world/basic_chest.png");
  }

  setupPrize({ x, y }: Coordinates) {
    const { prize } = getFactionPrize({ game: this.gameState });

    if (prize) {
      const basicChest = this.add.sprite(x, y, "basic_chest");
      basicChest
        .setDepth(100000)
        .setInteractive({ cursor: "pointer" })
        .on("pointerdown", () => {
          if (this.checkDistanceToSprite(basicChest, 75)) {
            interactableModalManager.open("weekly_faction_prize");
          } else {
            this.currentPlayer?.speak(translate("base.iam.far.away"));
          }
        });
      this.physics.add.existing(basicChest);

      (basicChest.body as Phaser.Physics.Arcade.Body)
        .setSize(16, 24)
        .setOffset(0, 6)
        .setImmovable(true)
        .setCollideWorldBounds(true);
      this.colliders?.add(basicChest);
      this.physics.world.enable(basicChest);

      this.gameService.onEvent((e) => {
        if (e.type === "faction.prizeClaimed") {
          basicChest.destroy();
        }
      });
    }
  }
}
