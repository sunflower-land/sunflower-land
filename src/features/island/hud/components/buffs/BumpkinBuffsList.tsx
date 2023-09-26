import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  BUMPKIN_SKILL_TREE,
  BumpkinSkillName,
} from "features/game/types/bumpkinSkills";
import { Bumpkin } from "features/game/types/game";
import { setImageWidth } from "lib/images";
import React from "react";

export const BumpkinBuffsList: React.FC<{ bumpkin: Bumpkin }> = ({
  bumpkin,
}) => {
  const SKILLS: BumpkinSkillName[] = Object.keys(BUMPKIN_SKILL_TREE).map(
    (skill) => skill as BumpkinSkillName
  );

  const skills = SKILLS.map((skill, i) => {
    if (!bumpkin.skills[skill]) {
      return null;
    }

    return (
      <OuterPanel
        key={`skill-buff-${i}`}
        className="flex flex-nowrap align-items-center h-28"
      >
        <div>
          <img
            src={BUMPKIN_SKILL_TREE[skill].image}
            style={{ opacity: 0, marginRight: `${PIXEL_SCALE * 4}px` }}
            className="float-left ml-5"
            onLoad={(e) => setImageWidth(e.currentTarget)}
          />
        </div>

        <div className="pl-4 pr-10">
          <div className="text-sm">{skill}</div>

          <Label type="info">{BUMPKIN_SKILL_TREE[skill].boosts}</Label>
        </div>
      </OuterPanel>
    );
  }).filter(Boolean);

  const totalBuffs = [...skills];
  if (totalBuffs.length === 0) {
    return (
      <div className="flex flex-col justify-evenly items-center p-2">
        <img
          src={SUNNYSIDE.npcs.bumpkin}
          alt="No Skills"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
        <span className="text-xs text-center mt-2">Bumpkin has no skills!</span>
      </div>
    );
  }

  return (
    <div className="h-80 scrollable overflow-y-auto">
      <div className="grid grid-cols-2 gap-1">{totalBuffs}</div>
    </div>
  );
};
