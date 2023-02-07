import React from "react";
import {
  Bumpkin,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { SKILL_TREE } from "features/game/types/skills";
import {
  BUMPKIN_SKILL_TREE,
  BumpkinSkillName,
} from "features/game/types/bumpkinSkills";
import { SkillBadge } from "features/bumpkins/components/SkillBadge";

export const SkillBadges: React.FC<{
  inventory: Inventory;
  bumpkin: Bumpkin;
}> = ({ inventory, bumpkin }) => {
  const SKILLS: BumpkinSkillName[] = Object.keys(BUMPKIN_SKILL_TREE).map(
    (skill) => skill as BumpkinSkillName
  );

  const BADGES: InventoryItemName[] = Object.keys(SKILL_TREE).map(
    (badge) => badge as InventoryItemName
  );

  const badges = BADGES.map((badge) => {
    if (inventory[badge]) {
      return <SkillBadge item={badge} />;
    }

    return null;
  }).filter(Boolean);

  const skills = SKILLS.map((skill) => {
    if (bumpkin.skills[skill]) {
      return <SkillBadge skill={skill} />;
    }

    return null;
  }).filter(Boolean);

  const totalSkills = [...badges, ...skills];
  if (totalSkills.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap items-center">{totalSkills}</div>
    </>
  );
};
