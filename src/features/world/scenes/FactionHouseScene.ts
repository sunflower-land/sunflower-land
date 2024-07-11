import { BaseScene } from "./BaseScene";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import { getFactionPrize } from "../ui/factions/weeklyPrize/FactionWeeklyPrize";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { getFactionWeek } from "features/game/lib/factions";
import { CollectivePet, FactionName } from "features/game/types/game";
import {
  FACTION_PET_REFRESH_INTERVAL,
  PET_SLEEP_DURATION,
} from "../ui/factions/FactionPetPanel";
import { getFactionPetUpdate } from "../ui/factions/actions/getFactionPetUpdate";
import { hasReadFactionNotice } from "../ui/factions/FactionNoticeboard";
import { PetStateSprite } from "./SunflorianHouseScene";
import { npcModalManager } from "../ui/NPCModals";
import { EventObject } from "xstate";

type FactionPetStateCoords = Record<
  FactionName,
  Record<PetStateSprite, Coordinates>
>;

const PROGRESS_BAR_COORDS: Record<FactionName, Coordinates> = {
  nightshades: {
    x: 233,
    y: 312,
  },
  sunflorians: {
    x: 233,
    y: 248,
  },
  bumpkins: {
    x: 233,
    y: 312,
  },
  goblins: {
    x: 233,
    y: 264,
  },
};

export const PET_STATE_COORDS: FactionPetStateCoords = {
  sunflorians: {
    pet_hungry: {
      x: 243,
      y: 220,
    },
    pet_sleeping: {
      x: 243,
      y: 229,
    },
    pet_happy: {
      x: 243,
      y: 220,
    },
  },
  nightshades: {
    pet_hungry: {
      x: 241,
      y: 284,
    },
    pet_sleeping: {
      x: 241,
      y: 284,
    },
    pet_happy: {
      x: 241,
      y: 284,
    },
  },
  bumpkins: {
    pet_hungry: {
      x: 241,
      y: 286,
    },
    pet_sleeping: {
      x: 239,
      y: 289,
    },
    pet_happy: {
      x: 239,
      y: 283,
    },
  },
  goblins: {
    pet_hungry: {
      x: 242,
      y: 237,
    },
    pet_sleeping: {
      x: 242,
      y: 237,
    },
    pet_happy: {
      x: 242,
      y: 237,
    },
  },
};

export abstract class FactionHouseScene extends BaseScene {
  public collectivePet: CollectivePet | undefined;
  private fetchInterval: NodeJS.Timeout | null = null;
  private _petState: PetStateSprite = "pet_hungry";
  public pet: Phaser.GameObjects.Sprite | undefined;
  public factionName: FactionName | undefined;
  public progressBarBackground: Phaser.GameObjects.Graphics | undefined;
  public progressBar: Phaser.GameObjects.Graphics | undefined;
  private _progress = 0;
  public boostIcon: Phaser.GameObjects.Image | undefined;

  preload() {
    super.preload();

    this.load.image("basic_chest", "world/basic_chest.png");
    this.load.image("question_disc", "world/question_disc.png");
    this.load.image("empty_progress_bar", "world/empty_bar.png");
    this.load.image("boost_icon", "world/lightning.png");

    const week = getFactionWeek({ date: new Date() });
    const faction = this.gameService.state.context.state.faction;
    this.factionName = faction?.name;

    if (faction) {
      this.collectivePet = faction.history[week].collectivePet;
      this.petState = this.getPetState();

      this.progress = this.calculatePetProgress();
    }
  }

  calculatePetProgress() {
    if (!this.collectivePet) return 0;

    const { totalXP, goalXP } = this.collectivePet;

    return Math.min(totalXP, goalXP) / goalXP;
  }

  setUpPet() {
    if (!this.factionName) return;

    this.pet = this.add.sprite(
      PET_STATE_COORDS[this.factionName][this.petState].x,
      PET_STATE_COORDS[this.factionName][this.petState].y,
      this.petState,
    );
    this.pet
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", (p: Phaser.Input.Pointer) => {
        if (p.downElement.nodeName === "CANVAS") {
          npcModalManager.open("pet");
        }
      });

    this.add
      .sprite(
        PROGRESS_BAR_COORDS[this.factionName].x + 7,
        PROGRESS_BAR_COORDS[this.factionName].y + 2,
        "empty_progress_bar",
      )
      .setDisplaySize(18, 7)
      .setDepth(2);
    this.progressBarBackground = this.add.graphics().setDepth(0);
    this.progressBar = this.add.graphics().setDepth(1);

    this.progressBarBackground.fillStyle(0x193c3e, 1);
    this.progressBarBackground.fillRect(
      PROGRESS_BAR_COORDS[this.factionName].x,
      PROGRESS_BAR_COORDS[this.factionName].y,
      14,
      4,
    );

    this.progressBar.fillStyle(0x63c74d, 1);
    this.progressBar.fillRect(
      PROGRESS_BAR_COORDS[this.factionName].x,
      PROGRESS_BAR_COORDS[this.factionName].y,
      14 * this.progress,
      4,
    );

    const showBoost = (this.collectivePet?.streak ?? 0) >= 3;

    this.boostIcon = this.add
      .image(
        PROGRESS_BAR_COORDS[this.factionName].x + 21,
        PROGRESS_BAR_COORDS[this.factionName].y + 1,
        "boost_icon",
      )
      .setScale(0.9)
      .setVisible(showBoost);
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

    if (!data) return;

    this.collectivePet = data;
    this.petState = this.getPetState();
    this.progress = this.calculatePetProgress();
    this.boostIcon?.setVisible((data.streak ?? 0) >= 3);
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

  set petState(newValue: PetStateSprite) {
    this._petState = newValue;
    this.onPetStateChange(newValue); // Call the function when value changes
  }

  get petState() {
    return this._petState;
  }

  set progress(newValue: number) {
    this._progress = Math.min(newValue, 100);
    this.onProgressChange();
  }

  get progress() {
    return this._progress;
  }

  onProgressChange() {
    this.progressBar?.clear();

    this.progressBar?.fillStyle(0x63c74d, 1);
    this.progressBar?.fillRect(
      PROGRESS_BAR_COORDS[this.factionName as FactionName].x,
      PROGRESS_BAR_COORDS[this.factionName as FactionName].y,
      14 * this.progress,
      4,
    );
  }
  onPetStateChange(newValue: PetStateSprite) {
    if (!this.pet || !this.factionName) return;

    this.pet?.setTexture(newValue);
    this.pet?.setPosition(
      PET_STATE_COORDS[this.factionName][newValue].x,
      PET_STATE_COORDS[this.factionName][newValue].y,
    );
  }

  getPetState() {
    const week = getFactionWeek({ date: new Date() });
    const beginningOfWeek = new Date(week).getTime();
    const firstWeek = "2024-07-08";

    if (!this.collectivePet) return "pet_hungry";

    if (
      this.collectivePet.streak === 0 &&
      week !== firstWeek &&
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

      const listener = (e: EventObject) => {
        if (e.type === "faction.prizeClaimed") {
          basicChest.destroy();
        }
      };

      this.gameService.onEvent(listener);

      this.events.on("shutdown", () => {
        this.gameService.off(listener);
      });
    }
  }

  setupNotice({ x, y }: { x: number; y: number }) {
    if (!hasReadFactionNotice()) {
      this.add.image(x, y, "question_disc").setDepth(1000000);
    }
  }
}
