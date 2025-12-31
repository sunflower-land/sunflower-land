import React from "react";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import powerup from "assets/icons/level_up.png";
import { CROP_LIFECYCLE } from "../plots/lib/plant";
import { ITEM_DETAILS } from "features/game/types/images";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/decorations";
import { FISH, FishingBait } from "features/game/types/fishing";
import { SEASON_ICONS } from "../buildings/components/building/market/SeasonalSeeds";
import { TemperateSeasonName } from "features/game/types/game";
import { useGame } from "features/game/GameProvider";

interface Props {
  onClose: () => void;
}
interface GuideItem {
  icon: string;
  content: string;
}

const FishingGuideItem: React.FC<{ icon: string; content: string }> = ({
  icon,
  content,
}) => {
  return (
    <div className="flex items-start space-x-2">
      <div className="flex-shrink-0 w-5 h-5 pt-0.5">
        <img
          src={icon}
          className="w-full h-full object-contain object-center"
        />
      </div>
      <p className="text-xs">{content}</p>
    </div>
  );
};

const SEASON_ORDER: TemperateSeasonName[] = [
  "spring",
  "summer",
  "autumn",
  "winter",
];

const BAIT_ORDER: FishingBait[] = [
  "Earthworm",
  "Grub",
  "Red Wiggler",
  "Fishing Lure",
  "Fish Flake",
  "Fish Stick",
  "Fish Oil",
  "Crab Stick",
];

const FishingRow: React.FC<{
  fish: keyof typeof FISH;
  hasCaught: boolean;
  alternateBg?: boolean;
}> = ({ fish, hasCaught, alternateBg }) => {
  const details = FISH[fish];

  const seasonSet = new Set(details.seasons);

  const baits = BAIT_ORDER.filter((bait) => details.baits.includes(bait));
  const primaryBait = baits[0];

  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_108px_28px] items-center gap-x-2 p-1 ${
        alternateBg ? "bg-[#ead4aa] rounded-md" : ""
      }`}
    >
      <div className="flex items-center min-w-0">
        <img
          src={ITEM_DETAILS[fish].image}
          className="w-6 h-auto mr-2 flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-xs truncate">{fish}</p>
          {hasCaught && details.likes.length > 0 && (
            <div className="flex items-center gap-x-0.5 mt-0.5">
              {details.likes.map((like) => (
                <img
                  key={`${fish}-${like}`}
                  src={ITEM_DETAILS[like].image}
                  className="h-4"
                  title={like}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-x-1 justify-items-center">
        {SEASON_ORDER.map((season) =>
          seasonSet.has(season) ? (
            <img
              key={`${fish}-${season}`}
              src={SEASON_ICONS[season]}
              className="w-6"
            />
          ) : (
            <div key={`${fish}-${season}`} className="w-6 h-6" />
          ),
        )}
      </div>

      <div className="flex items-center justify-end">
        {!!primaryBait && (
          <img
            src={ITEM_DETAILS[primaryBait].image}
            className="w-4"
            title={primaryBait}
          />
        )}
      </div>
    </div>
  );
};

export const FishingGuide: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { gameState } = useGame();
  const farmActivity = gameState.context.state.farmActivity ?? {};
  const basicGuide: GuideItem[] = [
    {
      icon: SUNNYSIDE.tools.fishing_rod,
      content: translate("fishingGuide.catch.rod"),
    },
    {
      icon: ITEM_DETAILS["Red Wiggler"].image,
      content: translate("fishingGuide.bait.earn"),
    },
    {
      icon: powerup,
      content: translate("fishingGuide.eat.fish"),
    },
  ];

  const advancedGuide: GuideItem[] = [
    {
      icon: SUNNYSIDE.icons.search,
      content: translate("fishingGuide.discover.fish"),
    },
    {
      icon: SUNNYSIDE.icons.stopwatch,
      content: translate("fishingGuide.condition"),
    },
    {
      icon: CROP_LIFECYCLE["Basic Biome"].Carrot.crop,
      content: translate("fishingGuide.bait.chum"),
    },
    {
      icon: SUNNYSIDE.icons.stressed,
      content: translate("fishingGuide.legendery.fish"),
    },
  ];

  const fishList = getKeys(FISH)
    .filter(
      (fish) =>
        FISH[fish].type !== "chapter" && FISH[fish].type !== "marine marvel",
    )
    .sort((a, b) => {
      const order: Record<string, number> = {
        basic: 0,
        advanced: 1,
        expert: 2,
        "marine marvel": 3,
        chapter: 4,
      };

      const aType = order[FISH[a].type] ?? 999;
      const bType = order[FISH[b].type] ?? 999;
      if (aType !== bType) return aType - bType;

      return a.localeCompare(b);
    });

  return (
    <div
      style={{ maxHeight: "320px" }}
      className="overflow-y-auto scrollable flex flex-wrap pt-1.5 pr-0.5"
    >
      <div className="flex flex-col gap-y-3 p-2">
        <img
          src={SUNNYSIDE.tutorial.fishingTutorial}
          className="w-full rounded-lg"
        />

        {basicGuide.map((item, i) => (
          <FishingGuideItem key={i} icon={item.icon} content={item.content} />
        ))}

        <img
          src={SUNNYSIDE.tutorial.fishingCodex}
          className="w-full rounded-lg"
        />

        {advancedGuide.map((item, i) => (
          <FishingGuideItem key={i} icon={item.icon} content={item.content} />
        ))}

        <div className="mt-1">
          <Label type="default">{t("fish")}</Label>
          <div className="mt-1 space-y-1">
            {fishList.map((fish, index) => (
              <FishingRow
                key={fish}
                fish={fish}
                hasCaught={(farmActivity[`${fish} Caught`] ?? 0) > 0}
                alternateBg={index % 2 === 1}
              />
            ))}
          </div>
        </div>

        <Button onClick={onClose} className="mt-2">
          {t("gotIt")}
        </Button>
      </div>
    </div>
  );
};
