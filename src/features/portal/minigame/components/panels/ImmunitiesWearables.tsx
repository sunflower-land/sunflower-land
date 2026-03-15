import React, {useState} from "react";
import { getWearableImage } from "features/game/lib/getWearableImage";
import { STATIC_OFFLINE_FARM } from "features/game/lib/landDataStatic";
import { AURA_IMMUNITY, WINGS_IMMUNITY, SHOES_IMMUNITY, HAT_IMMUNITY } from "../../Constants";
import { ImmunityTooltip } from "./ImmunityTooltip";

export const Immunities_Wearables: React.FC = () => {
  const { aura: equippedAura, wings: equippedWing, shoes: equippedShoe, hat: equippedHat } =
    STATIC_OFFLINE_FARM.bumpkin.equipped;

  const aura = equippedAura && AURA_IMMUNITY.includes(equippedAura) ? equippedAura : undefined;
  const wings = equippedWing && WINGS_IMMUNITY.includes(equippedWing) ? equippedWing : undefined;
  const shoe = equippedShoe && SHOES_IMMUNITY.includes(equippedShoe) ? equippedShoe : undefined;
  const hat = equippedHat && HAT_IMMUNITY.includes(equippedHat) ? equippedHat : undefined;

  if (!aura && !wings && !shoe && !hat) return null;

  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-row mb-5 text-sm">
      {aura && (
        <ImmunityTooltip
          id="aura"
          image={getWearableImage(aura)}
          description={STATIC_OFFLINE_FARM.bumpkin.equipped.aura}
          openId={openId}
          setOpenId={setOpenId}
        />
      )}
      {wings && (
        <ImmunityTooltip
          id="wings"
          image={getWearableImage(wings)}
          description={STATIC_OFFLINE_FARM.bumpkin.equipped.wings}
          openId={openId}
          setOpenId={setOpenId}
        />
      )}
      {shoe && (
        <ImmunityTooltip
          id="shoe"
          image={getWearableImage(shoe)}
          description={STATIC_OFFLINE_FARM.bumpkin.equipped.shoes}
          openId={openId}
          setOpenId={setOpenId}
        />
      )}
      {hat && (
        <ImmunityTooltip
          id="hat"
          image={getWearableImage(hat)}
          description={STATIC_OFFLINE_FARM.bumpkin.equipped.hat}
          openId={openId}
          setOpenId={setOpenId}
        />
      )}
    </div>
  );
};