import React from "react";
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

import { Equipped } from "features/game/types/bumpkin";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { BUILDINGS } from "features/game/types/buildings";
import { ITEM_DETAILS } from "features/game/types/images";
import worldIcon from "assets/icons/world_small.png";
import { translate } from "lib/i18n/translate";
import {
  EXPANSION_REQUIREMENTS,
  Land,
} from "features/game/expansion/lib/expansionRequirements";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SEEDS } from "features/game/types/seeds";
import { SpeakingText } from "features/game/components/SpeakingModal";
import confetti from "canvas-confetti";

const BONUS_UNLOCKS: Record<number, { text: string; icon: string }[]> = {
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
  const seeds = SEEDS();

  const unlocks = levels.reduce(
    (acc, id) => {
      const level = Number(id);
      const crops = getKeys(seeds)
        .filter((seedName) => seeds[seedName].bumpkinLevel === level)
        .map((seedName) => {
          const name = seeds[seedName].yield ?? seedName;
          return {
            text: name,
            icon: ITEM_DETAILS[name].image,
          };
        });

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
    onboardingAnalytics.logEvent("share", {
      method,
      content_type: "text",
      item_id: "level_up",
    });
  };

  const unlocks = LEVEL_UP_UNLOCKS[level] ?? [];
  const recipeUnlocked = { name: "Green Bed", description: "Sleep well" }; // Example recipe, replace with actual data

  const pages = [
    // Level up message with imagery
    {
      text: LEVEL_UP_MESSAGES[level] ?? "Wow, I am lost for words!",
      jsx: (
        <div className="flex flex-col items-center p-2">
          <img
            src={SUNNYSIDE.icons.arrow_up}
            alt="Level Up"
            className="w-20 h-20 mb-2"
          />
          <Label type="success" className="text-center mb-2">
            {t("levelUp.congratulations", { level })}
          </Label>
          <p className="text-sm text-center">You have 2 unlocks!</p>
        </div>
      ),
      onShow: () => confetti(),
    },
    // Unlocked items
    ...unlocks.map((unlock) => ({
      text: "New Item",
      jsx: (
        <div className="flex flex-col items-center p-2">
          <Label type="warning" icon={SUNNYSIDE.icons.search}>
            {t("new.species")}
          </Label>
          <span className="text-sm mb-2">{unlock.text}</span>
          <img src={unlock.icon} className="h-12 mb-2" />
          <span className="text-xs text-center mb-2">{unlock.text}</span>
        </div>
      ),
      onShow: () => confetti(),
    })),
    // Recipe unlocked
    {
      text: "Recipe Unlocked",
      jsx: (
        <div className="flex flex-col items-center p-2">
          <Label type="warning" icon={SUNNYSIDE.icons.search}>
            Recipe Unlocked
          </Label>
          <span className="text-sm mb-2">{recipeUnlocked.name}</span>
          <span className="text-xs text-center mb-2">
            {recipeUnlocked.description}
          </span>
        </div>
      ),
      onShow: () => confetti(),
    },
    // Summary with share buttons
    {
      text: "Level Up Summary",
      jsx: (
        <div className="p-2">
          <p className="text-sm mb-2 text-center">
            {t("levelUp.summary", { level })}
          </p>
          <div className="flex flex-wrap justify-center mb-2">
            {unlocks.map((unlock, index) => (
              <div key={index} className="flex flex-col items-center m-1">
                <img src={unlock.icon} className="h-6 mb-1" />
                <span className="text-xs text-center">{unlock.text}</span>
              </div>
            ))}
            {recipeUnlocked && (
              <div className="flex flex-col items-center m-1">
                <img src={SUNNYSIDE.icons.hammer} className="h-6 mb-1" />
                <span className="text-xs text-center">
                  {recipeUnlocked.name}
                </span>
              </div>
            )}
          </div>
          {level >= 6 && (
            <>
              <div className="flex justify-center mb-1 underline">
                <p className="text-xxs">{t("share")}</p>
              </div>
              <div className="flex justify-center">
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
        </div>
      ),
    },
  ];

  return <SpeakingText onClose={onClose} message={pages} />;
};
