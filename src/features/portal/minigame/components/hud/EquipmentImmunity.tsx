import React from "react";
import { getWearableImage } from "features/game/lib/getWearableImage";
import { Box } from "components/ui/Box";
import { STATIC_OFFLINE_FARM } from "features/game/lib/landDataStatic";
import { VISIBLE_AURA, WINGS_IMMUNITY } from "../../Constants";

export const Equipment_Immunity: React.FC = () => {
  const { aura: equippedAura, wings: equippedWing } =
    STATIC_OFFLINE_FARM.bumpkin.equipped;

  const aura =
    equippedAura && VISIBLE_AURA.includes(equippedAura)
      ? equippedAura
      : undefined;
  const wings =
    equippedWing && WINGS_IMMUNITY.includes(equippedWing) ? equippedWing : undefined;

  if (!aura && !wings) return null;

  return (
    <div className="relative flex flex-col items-end gap-3">
      {aura && <Box image={getWearableImage(aura)} className="h-10" />}
      {wings && <Box image={getWearableImage(wings)} className="h-10" />}
    </div>
  );
};
