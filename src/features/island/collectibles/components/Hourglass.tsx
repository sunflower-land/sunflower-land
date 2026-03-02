import React, { useContext } from "react";

import gourmetHourglassFull from "assets/factions/boosts/cooking_boost_full.webp";
import gourmetHourglassHalf from "assets/factions/boosts/cooking_boost_half.webp";
import gourmetHourglassDone from "assets/factions/boosts/cooking_boost_done.webp";
import harvestHourglassFull from "assets/factions/boosts/crop_boost_full.webp";
import harvestHourglassHalf from "assets/factions/boosts/crop_boost_half.webp";
import harvestHourglassDone from "assets/factions/boosts/crop_boost_done.webp";
import timberHourglassFull from "assets/factions/boosts/wood_boost_full.webp";
import timberHourglassHalf from "assets/factions/boosts/wood_boost_half.webp";
import timberHourglassDone from "assets/factions/boosts/wood_boost_done.webp";
import oreHourglassFull from "assets/factions/boosts/mineral_boost_full.webp";
import oreHourglassHalf from "assets/factions/boosts/mineral_boost_half.webp";
import oreHourglassDone from "assets/factions/boosts/mineral_boost_done.webp";
import orchardHourglassFull from "assets/factions/boosts/fruit_boost_full.webp";
import orchardHourglassHalf from "assets/factions/boosts/fruit_boost_half.webp";
import orchardHourglassDone from "assets/factions/boosts/fruit_boost_done.webp";
import blossomHourglassFull from "assets/factions/boosts/flower_boost_full.webp";
import blossomHourglassHalf from "assets/factions/boosts/flower_boost_half.webp";
import blossomHourglassDone from "assets/factions/boosts/flower_boost_done.webp";
import fisherHourglassFull from "assets/factions/boosts/fish_boost_full.webp";
import fisherHourglassHalf from "assets/factions/boosts/fish_boost_half.webp";
import fisherHourglassDone from "assets/factions/boosts/fish_boost_done.webp";
import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "assets/sunnyside";
import { ProgressBar } from "components/ui/ProgressBar";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { secondsToString } from "lib/utils/time";
import { MachineState } from "features/game/lib/gameMachine";
import {
  SFTDetailPopoverBuffs,
  SFTDetailPopoverLabel,
  SFTDetailPopoverInnerPanel,
} from "components/ui/SFTDetailPopover";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import classNames from "classnames";
import { useCountdown } from "lib/utils/hooks/useCountdown";

export type HourglassType =
  | "Gourmet Hourglass"
  | "Harvest Hourglass"
  | "Timber Hourglass"
  | "Orchard Hourglass"
  | "Blossom Hourglass"
  | "Fisher's Hourglass"
  | "Ore Hourglass";

type HourglassDetail = {
  fullImage: string;
  halfImage: string;
  doneImage: string;
  boostMillis: number;
};

const HOURGLASS_DETAILS: Record<HourglassType, HourglassDetail> = {
  "Gourmet Hourglass": {
    fullImage: gourmetHourglassFull,
    halfImage: gourmetHourglassHalf,
    doneImage: gourmetHourglassDone,
    boostMillis: 4 * 60 * 60 * 1000,
  },
  "Harvest Hourglass": {
    fullImage: harvestHourglassFull,
    halfImage: harvestHourglassHalf,
    doneImage: harvestHourglassDone,
    boostMillis: 6 * 60 * 60 * 1000,
  },
  "Timber Hourglass": {
    fullImage: timberHourglassFull,
    halfImage: timberHourglassHalf,
    doneImage: timberHourglassDone,
    boostMillis: 4 * 60 * 60 * 1000,
  },
  "Orchard Hourglass": {
    fullImage: orchardHourglassFull,
    halfImage: orchardHourglassHalf,
    doneImage: orchardHourglassDone,
    boostMillis: 6 * 60 * 60 * 1000,
  },
  "Blossom Hourglass": {
    fullImage: blossomHourglassFull,
    halfImage: blossomHourglassHalf,
    doneImage: blossomHourglassDone,
    boostMillis: 4 * 60 * 60 * 1000,
  },
  "Fisher's Hourglass": {
    fullImage: fisherHourglassFull,
    halfImage: fisherHourglassHalf,
    doneImage: fisherHourglassDone,
    boostMillis: 4 * 60 * 60 * 1000,
  },
  "Ore Hourglass": {
    fullImage: oreHourglassFull,
    halfImage: oreHourglassHalf,
    doneImage: oreHourglassDone,
    boostMillis: 3 * 60 * 60 * 1000,
  },
};

interface HourglassProps extends CollectibleProps {
  hourglass: HourglassType;
}

const _state = (state: MachineState) => state.context.state;

export const Hourglass: React.FC<HourglassProps> = ({
  createdAt,
  id,
  location,
  hourglass,
}) => {
  const { gameService, showTimers } = useContext(Context);
  const { t } = useAppTranslation();

  const expiresAt = createdAt + HOURGLASS_DETAILS[hourglass].boostMillis;
  const { totalSeconds: secondsToExpire } = useCountdown(expiresAt);
  const durationSeconds = HOURGLASS_DETAILS[hourglass].boostMillis / 1000;
  const percentage = 100 - (secondsToExpire / durationSeconds) * 100;
  const hasExpired = secondsToExpire <= 0;

  const getHourglassImage = () => {
    if (hasExpired) {
      return HOURGLASS_DETAILS[hourglass].doneImage;
    }

    if (secondsToExpire < durationSeconds / 2) {
      return HOURGLASS_DETAILS[hourglass].halfImage;
    }

    return HOURGLASS_DETAILS[hourglass].fullImage;
  };

  const handleRemove = () => {
    gameService.send({
      type: "collectible.burned",
      name: hourglass,
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
          className={classNames(
            "absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate",
          )}
          src={SUNNYSIDE.icons.dig_icon}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            right: `${PIXEL_SCALE * -8}px`,
            top: `${PIXEL_SCALE * -8}px`,
          }}
        />
        <img
          src={shadow}
          alt="shadow"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
            bottom: `-${PIXEL_SCALE * 1.6}px`,
          }}
          className="absolute cursor-pointer left-1/2 -translate-x-1/2 hover:img-highlight"
        />
        <img
          src={getHourglassImage()}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute cursor-pointer left-1/2 -translate-x-1/2 hover:img-highlight"
          alt={hourglass}
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
              type="buff"
              percentage={percentage}
            />
          </div>
        )}

        <img
          src={shadow}
          alt="shadow"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
            bottom: `-${PIXEL_SCALE * 1.6}px`,
          }}
          className="absolute cursor-pointer left-1/2 -translate-x-1/2 hover:img-highlight"
        />
        <img
          src={getHourglassImage()}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute cursor-pointer left-1/2 -translate-x-1/2 hover:img-highlight"
          alt={hourglass}
        />
      </PopoverButton>

      <PopoverPanel anchor={{ to: "left" }} className="flex">
        <SFTDetailPopoverInnerPanel>
          <SFTDetailPopoverLabel name={hourglass} />
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
          <SFTDetailPopoverBuffs name={hourglass} />
        </SFTDetailPopoverInnerPanel>
      </PopoverPanel>
    </Popover>
  );
};
