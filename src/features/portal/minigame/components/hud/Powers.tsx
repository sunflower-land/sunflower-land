import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { PortalMachineState } from "../../lib/Machine";
import { Box } from "components/ui/Box";
import { SUNNYSIDE } from "assets/sunnyside";
import { POWER_UNLOCK_THRESHOLDS } from "../../Constants";
import { EventBus } from "../../lib/EventBus";
import { Label } from "components/ui/Label";

import cannonIcon from "public/world/portal/images/cannon_icon.png";
import shieldIcon from "public/world/portal/images/prevents_complete_visibility_icon.webp";
import honeyIcon from "public/world/portal/images/honey_icon.png";
import riceBunIcon from "public/world/portal/images/rice_bun.png";

const _riceBunsCollected = (state: PortalMachineState) => state.context.riceBunsCollected;

export const Powers: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const riceBunsCollected = useSelector(portalService, _riceBunsCollected);

  // Power status
  const isCannonPowerUnlocked = riceBunsCollected >= POWER_UNLOCK_THRESHOLDS.CANNON;
  const isShieldPowerUnlocked = riceBunsCollected >= POWER_UNLOCK_THRESHOLDS.SHIELD;
  const isHoneyPowerUnlocked = riceBunsCollected >= POWER_UNLOCK_THRESHOLDS.HONEY;

  const isChargingCannon = !isCannonPowerUnlocked;
  const isChargingShield = riceBunsCollected >= POWER_UNLOCK_THRESHOLDS.CANNON && !isShieldPowerUnlocked;
  const isChargingHoney = riceBunsCollected >= POWER_UNLOCK_THRESHOLDS.SHIELD && !isHoneyPowerUnlocked;
  const isChargingExplosive = riceBunsCollected >= POWER_UNLOCK_THRESHOLDS.HONEY;

  // Active progress calculation
  const getProgress = (min: number, max: number, count = riceBunsCollected) => {
    if (count < min) return 0;
    if (count >= max) return 100;
    return ((count - min) / (max - min)) * 100;
  };

  const cannonProgress = getProgress(0, POWER_UNLOCK_THRESHOLDS.CANNON);
  const shieldProgress = getProgress(POWER_UNLOCK_THRESHOLDS.CANNON, POWER_UNLOCK_THRESHOLDS.SHIELD);
  const honeyProgress = getProgress(POWER_UNLOCK_THRESHOLDS.SHIELD, POWER_UNLOCK_THRESHOLDS.HONEY);

  const explosiveEffectiveBuns = Math.min(riceBunsCollected, POWER_UNLOCK_THRESHOLDS.EXPLOSIVE - 1);
  const explosiveProgress = getProgress(POWER_UNLOCK_THRESHOLDS.HONEY, POWER_UNLOCK_THRESHOLDS.EXPLOSIVE, explosiveEffectiveBuns);

  return (
    <div className="flex flex-col absolute items-center right-0 p-2">
      <Label type="info" icon={riceBunIcon}>Powers</Label>
      <Box
        progress={isChargingExplosive ? {
          percentage: explosiveProgress,
          type: "buff",
        } : undefined}
        overlayIcon={
          <div className="bg-[#b96f50] w-full h-full flex items-center justify-center">
            <img src={SUNNYSIDE.icons.lock} className="w-[70%]" />
          </div>
        }
        showOverlay
      />
      <Box
        onClick={isHoneyPowerUnlocked
          ? () => {
            EventBus.emit("throw-honey");
          }
          : undefined}
        image={honeyIcon}
        progress={isChargingHoney ? {
          percentage: honeyProgress,
          type: "buff",
        } : undefined}
        overlayIcon={!isHoneyPowerUnlocked ?
          <div className="bg-[#b96f50] w-full h-full flex items-center justify-center">
            <img src={SUNNYSIDE.icons.lock} className="w-[70%]" />
          </div>
          : undefined}
        showOverlay={!isHoneyPowerUnlocked}
      />
      <Box
        onClick={isShieldPowerUnlocked
          ? () => {
            EventBus.emit("simulate-lag");
          }
          : undefined}
        image={shieldIcon}
        progress={isChargingShield ? {
          percentage: shieldProgress,
          type: "buff",
        } : undefined}
        overlayIcon={!isShieldPowerUnlocked ?
          <div className="bg-[#b96f50] w-full h-full flex items-center justify-center">
            <img src={SUNNYSIDE.icons.lock} className="w-[70%]" />
          </div>
          : undefined}
        showOverlay={!isShieldPowerUnlocked}
      />
      <Box
        image={cannonIcon}
        progress={isChargingCannon ? {
          percentage: cannonProgress,
          type: "buff",
        } : undefined}
        overlayIcon={!isCannonPowerUnlocked ?
          <div className="bg-[#b96f50] w-full h-full flex items-center justify-center">
            <img src={SUNNYSIDE.icons.lock} className="w-[70%]" />
          </div>
          : undefined}
        showOverlay={!isCannonPowerUnlocked}
      />
    </div>
  );
};
