import React, { useContext } from "react";

import superTotem from "assets/sfts/super_totem.webp";
import fastForward from "assets/icons/fast_forward.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "assets/sunnyside";
import { ProgressBar } from "components/ui/ProgressBar";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  SFTDetailPopoverBuffs,
  SFTDetailPopoverInnerPanel,
  SFTDetailPopoverLabel,
} from "components/ui/SFTDetailPopover";
import { secondsToString } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { useCountdown } from "lib/utils/hooks/useCountdown";

export const SuperTotem: React.FC<CollectibleProps> = ({
  createdAt,
  id,
  location,
}) => {
  const { t } = useAppTranslation();
  const { gameService, showTimers } = useContext(Context);

  const expiresAt = createdAt + 7 * 24 * 60 * 60 * 1000;
  const { totalSeconds: secondsToExpire } = useCountdown(expiresAt);
  const hasExpired = secondsToExpire <= 0;
  const percentage = 100 - (secondsToExpire / (7 * 24 * 60 * 60)) * 100;

  const handleRemove = () => {
    gameService.send({
      type: "collectible.burned",
      name: "Super Totem",
      location,
      id,
    });
  };

  if (hasExpired) {
    return (
      <div onClick={handleRemove}>
        {showTimers && (
          <div className="absolute bottom-0 left-0">
            <ProgressBar
              seconds={secondsToExpire}
              formatLength="medium"
              type="error"
              percentage={percentage}
            />
          </div>
        )}
        <img
          className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
          src={SUNNYSIDE.icons.dig_icon}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            right: `${PIXEL_SCALE * -8}px`,
            top: `${PIXEL_SCALE * -8}px`,
          }}
        />

        <img
          src={superTotem}
          style={{
            width: `${PIXEL_SCALE * 20}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute cursor-pointer"
          alt="Super Totem"
        />
      </div>
    );
  }
  return (
    <Popover>
      <PopoverButton as="div">
        {showTimers && (
          <div className="absolute bottom-0 left-0">
            <ProgressBar
              seconds={secondsToExpire}
              formatLength="medium"
              type={"buff"}
              percentage={percentage}
            />
          </div>
        )}

        <img
          src={superTotem}
          style={{
            width: `${PIXEL_SCALE * 20}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute cursor-pointer"
          alt="Super Totem"
        />
        <img
          src={fastForward}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            top: `${PIXEL_SCALE * -5}px`,
            left: `${PIXEL_SCALE * 3}px`,
          }}
          className="absolute pointer-events-none animate-pulse"
        />
      </PopoverButton>

      <PopoverPanel anchor={{ to: "left start" }} className="flex">
        <SFTDetailPopoverInnerPanel>
          <SFTDetailPopoverLabel name={"Super Totem"} />
          <Label type="info" className="mt-2 mb-2">
            <span className="text-xs">
              {t("time.remaining", {
                time: secondsToString(secondsToExpire, {
                  length: "medium",
                  isShortFormat: true,
                  removeTrailingZeros: true,
                }),
              })}
            </span>
          </Label>
          <SFTDetailPopoverBuffs name={"Super Totem"} />
        </SFTDetailPopoverInnerPanel>
      </PopoverPanel>
    </Popover>
  );
};
