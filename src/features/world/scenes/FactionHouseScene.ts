import { BaseScene } from "./BaseScene";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import { getFactionPrize } from "../ui/factions/weeklyPrize/FactionWeeklyPrize";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { getFactionWeek } from "features/game/lib/factions";
import { CollectivePet } from "features/game/types/game";
import {
  FACTION_PET_REFRESH_INTERVAL,
  PET_SLEEP_DURATION,
} from "../ui/factions/FactionPetPanel";
import { getFactionPetUpdate } from "../ui/factions/actions/getFactionPetUpdate";
import { hasReadFactionNotice } from "../ui/factions/FactionNoticeboard";

export abstract class FactionHouseScene extends BaseScene {
  public collectivePet: CollectivePet | undefined;
  private fetchInterval: NodeJS.Timeout | null = null;

  preload() {
    super.preload();

    this.load.image("basic_chest", "world/basic_chest.png");
    this.load.image("question_disc", "world/question_disc.png");
    this.makeFetchRequest();
  }

  create() {
    super.create();
    this.fetchInterval = setInterval(
      () => this.makeFetchRequest(),
      FACTION_PET_REFRESH_INTERVAL,
    );
  }

  async makeFetchRequest() {
    const { farmId } = this.gameService.state.context;
    const data = await getFactionPetUpdate({ farmId });

    this.collectivePet = data;
  }

  shutdown() {
    if (this.fetchInterval) {
      clearInterval(this.fetchInterval);
    }
  }

  destroy() {
    if (this.fetchInterval) {
      clearInterval(this.fetchInterval);
    }
  }

  getPetState() {
    const week = getFactionWeek({ date: new Date() });
    const beginningOfWeek = new Date(week).getTime();
    const firstWeek = "2024-07-08";

    if (!this.collectivePet || week === firstWeek) return "pet_hungry";

    if (
      this.collectivePet.streak === 0 &&
      Date.now() < beginningOfWeek + PET_SLEEP_DURATION
    ) {
      return "pet_sleeping";
    }

    if (this.collectivePet.goalReached) return "pet_happy";

    return "pet_hungry";
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

  setupNotice({ x, y }: { x: number; y: number }) {
    if (!hasReadFactionNotice()) {
      this.add.image(x, y, "question_disc").setDepth(1000000);
    }
  }
}
