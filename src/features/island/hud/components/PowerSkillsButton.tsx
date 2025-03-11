import React, { useState, useContext } from "react";
import lightning from "assets/icons/lightning.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { PowerSkills } from "./PowerSkills";
import { Context } from "features/game/GameProvider";
import {
  BumpkinSkillRevamp,
  getPowerSkills,
} from "features/game/types/bumpkinSkills";
import { BumpkinRevampSkillName } from "features/game/types/bumpkinSkills";
import { useSelector } from "@xstate/react";
import { RoundButton } from "components/ui/RoundButton";

export const PowerSkillsButton: React.FC = () => {
  const [show, setShow] = useState(false);
  const { gameService } = useContext(Context);
  const bumpkin = useSelector(
    gameService,
    (state) => state.context.state.bumpkin,
  );
  const { skills, previousPowerUseAt } = bumpkin;

  const powerSkills = getPowerSkills();
  const powerSkillsUnlocked = powerSkills.filter(
    (skill) => !!skills[skill.name as BumpkinRevampSkillName],
  );

  const powerSkillsReady = powerSkillsUnlocked
    .filter((skill: BumpkinSkillRevamp) => {
      const fertiliserSkill: BumpkinRevampSkillName[] = [
        "Sprout Surge",
        "Root Rocket",
        "Blend-tastic",
      ];
      return !fertiliserSkill.includes(skill.name as BumpkinRevampSkillName);
    })
    .some((skill: BumpkinSkillRevamp) => {
      const nextSkillUse =
        (previousPowerUseAt?.[skill.name as BumpkinRevampSkillName] ?? 0) +
        (skill.requirements.cooldown ?? 0);
      return nextSkillUse < Date.now();
    });

  return (
    <>
      <RoundButton onClick={() => setShow(true)}>
        <img
          src={lightning}
          className="absolute group-active:translate-y-[2px]"
          style={{
            top: `${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 7}px`,
            width: `${PIXEL_SCALE * 8}px`,
          }}
        />
        {powerSkillsReady && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="absolute animate-pulsate"
            style={{
              width: `${PIXEL_SCALE * 4}px`,
              top: `-${PIXEL_SCALE * 2}px`,
              right: `-${PIXEL_SCALE * 2}px`,
            }}
          />
        )}
      </RoundButton>
      <PowerSkills show={show} onHide={() => setShow(false)} />
    </>
  );
};
