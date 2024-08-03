import {
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  XIcon,
} from "react-share";

import React from "react";
import { Button } from "components/ui/Button";
import { Equipped } from "features/game/types/bumpkin";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { CROPS } from "features/game/types/crops";
import { BUILDINGS } from "features/game/types/buildings";
import { ITEM_DETAILS } from "features/game/types/images";
import worldIcon from "assets/icons/world_small.png";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { translate } from "lib/i18n/translate";
import {
  EXPANSION_REQUIREMENTS,
  Land,
} from "features/game/expansion/lib/expansionRequirements";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const BONUS_UNLOCKS: Record<number, { text: string; icon: string }[]> = {
  2: [
    {
      text: "Crops",
      icon: SUNNYSIDE.tools.shovel,
    },
    {
      text: "Sunflower",
      icon: CROP_LIFECYCLE.Sunflower.crop,
    },
    {
      text: "Potato",
      icon: CROP_LIFECYCLE.Potato.crop,
    },
  ],
  3: [
    {
      text: "Travel",
      icon: worldIcon,
    },
  ],
  5: [
    {
      text: "Fishing",
      icon: SUNNYSIDE.tools.fishing_rod,
    },
  ],
  10: [
    {
      text: "Trading",
      icon: SUNNYSIDE.icons.player,
    },
  ],
};

function generateUnlockLabels(): Record<
  number,
  { text: string; icon: string }[]
> {
  const levels = getKeys(LEVEL_EXPERIENCE);

  const unlocks = levels.reduce(
    (acc, id) => {
      const level = Number(id);
      const crops = getKeys(CROPS)
        .filter((name) => CROPS[name].bumpkinLevel === level)
        .map((name) => ({ text: name, icon: ITEM_DETAILS[name].image }));

      const buildings = getKeys(BUILDINGS)
        .filter((name) =>
          BUILDINGS[name].find(
            (b) =>
              EXPANSION_REQUIREMENTS[b.unlocksAtLevel as Land]?.bumpkinLevel ===
              level,
          ),
        )
        .map((name) => ({ text: name, icon: ITEM_DETAILS[name].image }));

      const bonus = BONUS_UNLOCKS[level] ?? [];

      return {
        ...acc,
        [level]: [...bonus, ...crops, ...buildings],
      };
    },
    {} as Record<number, { text: string; icon: string }[]>,
  );

  return unlocks;
}

const LEVEL_UP_UNLOCKS = generateUnlockLabels();

const LEVEL_UP_MESSAGES: Record<number, string> = {
  2: translate("levelUp.2"),
  3: translate("levelUp.3"),
  4: translate("levelUp.4"),
  5: translate("levelUp.5"),
  6: translate("levelUp.6"),
  7: translate("levelUp.7"),
  8: translate("levelUp.8"),
  9: translate("levelUp.9"),
  10: translate("levelUp.10"),
  11: translate("levelUp.11"),
  12: translate("levelUp.12"),
  13: translate("levelUp.13"),
  14: translate("levelUp.14"),
  15: translate("levelUp.15"),
  16: translate("levelUp.16"),
  17: translate("levelUp.17"),
  18: translate("levelUp.18"),
  19: translate("levelUp.19"),
  20: translate("levelUp.20"),
  21: translate("levelUp.21"),
  22: translate("levelUp.22"),
  23: translate("levelUp.23"),
  24: translate("levelUp.24"),
  25: translate("levelUp.25"),
  26: translate("levelUp.26"),
  27: translate("levelUp.27"),
  28: translate("levelUp.28"),
  29: translate("levelUp.29"),
  30: translate("levelUp.30"),
  31: translate("levelUp.31"),
  32: translate("levelUp.32"),
  33: translate("levelUp.33"),
  34: translate("levelUp.34"),
  35: translate("levelUp.35"),
  36: translate("levelUp.36"),
  37: translate("levelUp.37"),
  38: translate("levelUp.38"),
  39: translate("levelUp.39"),
  40: translate("levelUp.40"),
  41: translate("levelUp.41"),
  42: translate("levelUp.42"),
  43: translate("levelUp.43"),
  44: translate("levelUp.44"),
  45: translate("levelUp.45"),
  46: translate("levelUp.46"),
  47: translate("levelUp.47"),
  48: translate("levelUp.48"),
  49: translate("levelUp.49"),
  50: translate("levelUp.50"),
  51: translate("levelUp.51"),
  52: translate("levelUp.52"),
  53: translate("levelUp.53"),
  54: translate("levelUp.54"),
  55: translate("levelUp.55"),
  56: translate("levelUp.56"),
  57: translate("levelUp.57"),
  58: translate("levelUp.58"),
  59: translate("levelUp.59"),
  60: translate("levelUp.60"),
};

interface Props {
  level: number;
  onClose: () => void;
  wearables: Equipped;
}
export const LevelUp: React.FC<Props> = ({ level, onClose, wearables }) => {
  const { t } = useAppTranslation();
  const shareMessage = `Just reached level ${level} in Sunflower Land! So proud of my progress in this game. 🌻🚀 \n\n https://www.sunflower-land.com \n\n #SunflowerLand #LevelUp`;

  const clicked = (method: "Reddit" | "Twitter" | "Telegram" | "Facebook") => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?sjid=18434190870996612736-AP&client_type=gtag#share
    onboardingAnalytics.logEvent("share", {
      method,
      content_type: "text",
      item_id: "level_up",
    });
  };

  const unlocks = LEVEL_UP_UNLOCKS[level] ?? [];

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm my-1 text-center">
        {LEVEL_UP_MESSAGES[level] ?? "Wow, I am lost for words!"}
      </p>
      {unlocks.length > 0 && (
        <div className="mt-2">
          <p className="text-xxs text-center">{t("unlocked")}</p>
          <div className="flex flex-wrap justify-center items-center mt-2 space-x-3">
            {unlocks.map((unlock) => (
              <Label
                key={unlock.text}
                className="mb-2"
                type="default"
                icon={unlock.icon}
              >
                {unlock.text}
              </Label>
            ))}
          </div>
        </div>
      )}
      {level >= 6 && (
        <>
          <div className="flex mb-1 underline">
            <p className="text-xxs">{t("share")}</p>
          </div>
          <div className="flex">
            <TwitterShareButton
              url={" "}
              title={shareMessage}
              className="mr-1"
              onClick={() => clicked("Twitter")}
            >
              <XIcon size={40} round />
            </TwitterShareButton>
            <TelegramShareButton
              url={" "}
              title={shareMessage}
              className="mr-1"
              onClick={() => clicked("Telegram")}
            >
              <TelegramIcon size={40} round />
            </TelegramShareButton>
            <FacebookShareButton
              url={"sunflower-land.com"}
              className="mr-1"
              onClick={() => clicked("Facebook")}
            >
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            <RedditShareButton
              url={" "}
              title={shareMessage}
              onClick={() => clicked("Reddit")}
            >
              <RedditIcon size={40} round />
            </RedditShareButton>
          </div>
        </>
      )}
      <Button className="mt-2" onClick={onClose}>
        {t("ok")}
      </Button>
    </div>
  );
};
