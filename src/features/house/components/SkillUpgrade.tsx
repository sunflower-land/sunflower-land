import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import {
  getAvailableUpgrades,
  SkillName,
  SKILL_TREE,
} from "features/game/types/skills";

import plant from "assets/icons/plant.png";
import pickaxe from "assets/tools/stone_pickaxe.png";

import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";

export const SkillUpgrade: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const chooseSkill = (skill: SkillName) => {
    gameService.send("LEVEL_UP", { skill });
  };

  const choices = getAvailableUpgrades(gameState.context.state);
  if (choices.length === 0) {
    return null;
  }

  const firstChoice = SKILL_TREE[choices[0]];
  return (
    <div className="flex flex-col items-center">
      {firstChoice.profession === "farming" && (
        <div className="flex justify-between">
          <img src={plant} alt="farming" className="w-6 h-6 mx-2" />
          <span>
            Level {firstChoice.level} {firstChoice.profession}
          </span>
          <img src={plant} alt="farming" className="w-6 h-6 mx-2" />
        </div>
      )}
      {firstChoice.profession === "gathering" && (
        <div className="flex justify-between">
          <img src={pickaxe} alt="farming" className="w-6 h-6 mx-2" />
          <span>
            Level {firstChoice.level} {firstChoice.profession}
          </span>

          <img src={pickaxe} alt="farming" className="w-6 h-6 mx-2" />
        </div>
      )}

      <span className="text-center text-sm underline">Choose a skill</span>
      {/* TODO - update badge images */}
      <div className="flex w-full mt-3">
        {choices.map((choice) => {
          const details = ITEM_DETAILS[choice];
          const skill = SKILL_TREE[choice];
          return (
            <Button
              key={choice}
              className="flex flex-col items-center mx-2"
              onClick={() => chooseSkill(choice)}
            >
              <span className="text-sm">{choice}</span>
              <img
                className="w-1/3  my-2"
                src={details.image}
                alt="green thumb"
              />
              <ul>
                {skill.perks.map((perk) => (
                  <li key={perk} className="text-xs block">
                    {perk}
                  </li>
                ))}
              </ul>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
