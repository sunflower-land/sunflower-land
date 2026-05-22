import { GameState, Skills } from "features/game/types/game";
import { populateSaltFarm } from "features/game/types/salt";
import { produce } from "immer";
import {
  getPointsRemoved,
  sanitizeSkillSelection,
  validateSkillSelection,
} from "./choseSkill";
import { chargeSkillEdit, PaymentType } from "./resetSkills";

export type UpdateSkillsAction = {
  type: "skills.updated";
  skills: Skills;
  paymentType: PaymentType;
};

type Options = {
  state: GameState;
  action: UpdateSkillsAction;
  createdAt?: number;
};

export function updateSkills({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    if (!stateCopy.bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const skills = sanitizeSkillSelection(action.skills);

    validateSkillSelection({
      state: stateCopy,
      skills,
    });

    const currentKeys = Object.keys(stateCopy.bumpkin.skills)
      .filter((key) => !!stateCopy.bumpkin?.skills[key as keyof Skills])
      .sort();
    const newKeys = Object.keys(skills).sort();
    if (
      currentKeys.length === newKeys.length &&
      currentKeys.every((key, index) => key === newKeys[index])
    ) {
      throw new Error("No skill changes to apply");
    }

    chargeSkillEdit({
      game: stateCopy,
      paymentType: action.paymentType,
      pointsRemoved: getPointsRemoved(stateCopy.bumpkin.skills, skills),
      createdAt,
    });

    stateCopy.bumpkin.skills = skills;

    populateSaltFarm({
      gameBefore: state,
      gameAfter: stateCopy,
      now: createdAt,
    });

    return stateCopy;
  });
}
