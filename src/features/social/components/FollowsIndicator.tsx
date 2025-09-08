import React from "react";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { useTranslation } from "react-i18next";
import {
  BumpkinBody,
  BumpkinHair,
  BumpkinBackground,
  BumpkinShoe,
  BumpkinTool,
  BumpkinShirt,
  BumpkinPant,
} from "features/game/types/bumpkin";

interface FollowsIndicatorProps {
  count: number;
  onClick: () => void;
  type: "followers" | "following";
  className?: string;
  showSingleBumpkin?: boolean;
}

export const FollowsIndicator: React.FC<FollowsIndicatorProps> = ({
  count,
  onClick,
  type,
  className = "",
  showSingleBumpkin = false,
}) => {
  const { t } = useTranslation();

  // Default NPC parts for the indicator icons
  const defaultNPCParts = {
    body: "Light Brown Farmer Potion" as BumpkinBody,
    pants: "Angler Waders" as BumpkinPant,
    hair: "Buzz Cut" as BumpkinHair,
    shirt: "Chic Gala Blouse" as BumpkinShirt,
    tool: "Farmer Pitchfork" as BumpkinTool,
    background: "Farm Background" as BumpkinBackground,
    shoes: "Black Farmer Boots" as BumpkinShoe,
  };

  const secondNPCParts = {
    body: "Light Brown Farmer Potion" as BumpkinBody,
    pants: "Grape Pants" as BumpkinPant,
    hair: "Ash Ponytail" as BumpkinHair,
    shirt: "Tiki Armor" as BumpkinShirt,
    tool: "Axe" as BumpkinTool,
    background: "Farm Background" as BumpkinBackground,
    shoes: "Crimstone Boots" as BumpkinShoe,
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span
        className="text-xs underline cursor-pointer whitespace-nowrap"
        onClick={onClick}
      >
        {t(`playerModal.${type}`, { count })}
      </span>
      <div className="relative w-10 h-6">
        <div className="absolute">
          <NPCIcon width={24} parts={defaultNPCParts} />
        </div>
        {!showSingleBumpkin && (
          <div className="absolute left-3.5">
            <NPCIcon width={24} parts={secondNPCParts} />
          </div>
        )}
      </div>
    </div>
  );
};
