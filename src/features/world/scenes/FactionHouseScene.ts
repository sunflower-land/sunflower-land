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

type FactionPetStateCoords = Record<
  FactionName,
  Record<PetStateSprite, Coordinates>
>;

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

  preload() {
    super.preload();

    this.load.image("basic_chest", "world/basic_chest.png");
    this.load.image("question_disc", "world/question_disc.png");

    const week = getFactionWeek({ date: new Date() });
    const faction = this.gameService.state.context.state.faction;
    this.factionName = faction?.name;

    if (faction) {
      this.collectivePet = faction.history[week].collectivePet;
      this.petState = this.getPetState();
    }
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
    this.petState = this.getPetState();
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

  onPetStateChange(newValue: PetStateSprite) {
    if (!this.pet) return;

    this.pet?.setTexture(newValue);
    this.pet?.setPosition(
      PET_STATE_COORDS[this.factionName as FactionName][newValue].x,
      PET_STATE_COORDS[this.factionName as FactionName][newValue].y,
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
