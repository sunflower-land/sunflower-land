import React, { useContext, useState } from "react";

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
import { ITEM_DETAILS } from "features/game/types/images";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { PetShrineName } from "features/game/types/pets";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { useCountdown } from "lib/utils/hooks/useCountdown";

const PET_SHRINE_DIMENSIONS: Record<
  PetShrineName,
  {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    width?: number;
    height?: number;
  }
> = {
  "Fox Shrine": { width: 18, left: -0.5 },
  "Hound Shrine": { width: 17, left: -0.25 },
  "Boar Shrine": { width: 17, left: -0.25 },
  "Sparrow Shrine": { width: 18, left: -0.5 },
  "Toucan Shrine": { width: 19, left: -0.5 },
  "Collie Shrine": { width: 19, left: -0.5 },
  "Badger Shrine": { width: 18, left: -0.5 },
  "Stag Shrine": { width: 27, left: -2.5 },
  "Mole Shrine": { width: 19, left: -0.5 },
  "Bear Shrine": { width: 18, left: -0.5 },
  "Tortoise Shrine": { width: 18, left: -0.5 },
  "Moth Shrine": { width: 21, left: -1.5 },
  "Bantam Shrine": { width: 18, left: -0.5 },

  // Sprites not out yet
  "Trading Shrine": { width: 22, left: -1.5 },
  "Legendary Shrine": { width: 32, left: 0 },
};

const PET_SHRINE_DIMENSIONS_STYLES = getObjectEntries(
  PET_SHRINE_DIMENSIONS,
).reduce<Record<PetShrineName, React.CSSProperties>>(
  (acc, [pet, styles]) => {
    acc[pet] = {
      left: styles.left ? `${PIXEL_SCALE * styles.left}px` : undefined,
      right: styles.right ? `${PIXEL_SCALE * styles.right}px` : undefined,
      top: styles.top ? `${PIXEL_SCALE * styles.top}px` : undefined,
      bottom: styles.bottom ? `${PIXEL_SCALE * styles.bottom}px` : undefined,
      width: styles.width ? `${PIXEL_SCALE * styles.width}px` : undefined,
      height: styles.height ? `${PIXEL_SCALE * styles.height}px` : undefined,
    };
    return acc;
  },
  { ...PET_SHRINE_DIMENSIONS },
);

export const PetShrine: React.FC<
  CollectibleProps & { name: PetShrineName }
> = ({ createdAt, id, location, name }) => {
  const { t } = useAppTranslation();
  const { gameService, showTimers } = useContext(Context);

  const [, setRender] = useState(0);
  const expiresAt = createdAt + (EXPIRY_COOLDOWNS[name] ?? 0);
  const { totalSeconds: secondsToExpire } = useCountdown(expiresAt);
  const durationSeconds = EXPIRY_COOLDOWNS[name] ?? 0;
  const percentage = 100 - (secondsToExpire / durationSeconds) * 100;
  const hasExpired = secondsToExpire <= 0;

  const handleRemove = () => {
    gameService.send("collectible.burned", {
      name,
      location,
      id,
    });
  };

  if (hasExpired) {
    return (
      <div
        onClick={handleRemove}
        className="absolute"
        style={{ ...PET_SHRINE_DIMENSIONS_STYLES[name], bottom: 0 }}
      >
        {showTimers && (
          <div
            className="absolute left-1/2"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              transform: "translateX(-50%)",
            }}
          >
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
          src={ITEM_DETAILS[name].image}
          style={{ ...PET_SHRINE_DIMENSIONS_STYLES[name], bottom: 0 }}
          className="absolute cursor-pointer"
          alt={name}
        />
      </div>
    );
  }

  return (
    <Popover>
      <PopoverButton as="div">
        <div
          className="absolute"
          style={{ ...PET_SHRINE_DIMENSIONS_STYLES[name], bottom: 0 }}
        >
          {showTimers && (
            <div
              className="absolute left-1/2"
              style={{
                width: `${PIXEL_SCALE * 15}px`,
                transform: "translateX(-50%)",
              }}
            >
              <ProgressBar
                seconds={secondsToExpire}
                formatLength="medium"
                type={"buff"}
                percentage={percentage}
              />
            </div>
          )}

          <img
            src={ITEM_DETAILS[name].image}
            style={{ ...PET_SHRINE_DIMENSIONS_STYLES[name], bottom: 0 }}
            className="absolute cursor-pointer"
            alt={name}
          />
        </div>
      </PopoverButton>

      <PopoverPanel anchor={{ to: "left start" }} className="flex">
        <SFTDetailPopoverInnerPanel>
          <SFTDetailPopoverLabel name={name} />
          <Label
            type="info"
            icon={SUNNYSIDE.icons.stopwatch}
            className="mt-2 mb-2"
          >
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
          <SFTDetailPopoverBuffs name={name} />
        </SFTDetailPopoverInnerPanel>
      </PopoverPanel>
    </Popover>
  );
};
