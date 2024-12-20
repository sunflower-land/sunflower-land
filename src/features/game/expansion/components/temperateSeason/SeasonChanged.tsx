import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import { InnerPanel, OuterPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";

import winterBanner from "assets/temperate_seasons/winter_banner.webp";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  InventoryItemName,
  TemperateSeasonName,
} from "features/game/types/game";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import {
  getHasReadTemperateSeasonTutorial,
  setHasReadTemperateSeasonTutorial,
  setLastTemperateSeasonStartedAt,
} from "features/game/lib/temperateSeason";
import { SeasonsIntroduction } from "./SeasonsIntroduction";
import { useTranslation } from "react-i18next";

const SEASON_DETAILS: Record<
  TemperateSeasonName,
  {
    icon: string;
    inSeason: InventoryItemName[];
  }
> = {
  spring: {
    icon: SUNNYSIDE.resource.tree_stump,
    inSeason: [
      "Sunflower",
      // "Rhubarb",
      "Carrot",
      "Cabbage",
      "Beetroot",
      "Parsnip",
      "Corn",
      "Radish",
      "Wheat",
      "Barley",
    ],
  },
  summer: {
    icon: SUNNYSIDE.resource.tree_stump,
    inSeason: [
      "Sunflower",
      "Potato",
      // "Zucchini",
      "Soybean",
      // "Hot Pepper",
      // "Coffee",
      "Eggplant",
      "Corn",
      "Radish",
      "Wheat",
    ],
  },
  autumn: {
    previousSeason: "summer",
    icon: SUNNYSIDE.resource.tree_stump,
    inSeason: [
      "Sunflower",
      "Potato",
      "Pumpkin",
      "Carrot",
      // "Broccoli",
      "Beetroot",
      "Eggplant",
      "Wheat",
      // "Artichoke",
      "Barley",
    ],
  },
  winter: {
    icon: SUNNYSIDE.resource.tree_stump,
    inSeason: [
      "Sunflower",
      "Potato",
      // "Yam",
      "Cabbage",
      "Beetroot",
      "Cauliflower",
      "Parsnip",
      // "Onion",
      // "Turnip",
      "Wheat",
      "Kale",
    ],
  },
};

const DUMMY_WEEK_DATA = [
  { day: "Monday", icon: SUNNYSIDE.icons.plant },
  { day: "Tuesday", icon: SUNNYSIDE.icons.water },
  { day: "Wednesday", icon: SUNNYSIDE.icons.plant },
  { day: "Thursday", icon: SUNNYSIDE.icons.water },
  { day: "Friday", icon: SUNNYSIDE.icons.plant },
  { day: "Saturday", icon: SUNNYSIDE.icons.water },
  { day: "Sunday", icon: SUNNYSIDE.icons.plant },
];

const SeasonWeek = () => {
  const today = new Date().getUTCDay();

  return (
    <div className="grid grid-cols-7 gap-1">
      {DUMMY_WEEK_DATA.map((data, index) => {
        const Panel = index < today ? InnerPanel : OuterPanel;
        return (
          <Panel
            key={data.day}
            className="h-12 relative flex items-center justify-center"
          >
            {data.icon && <img src={data.icon} className="absolute w-6 h-6" />}
            <span className="absolute top-0 right-0 text-xxs">
              {data.day[0]}
            </span>
          </Panel>
        );
      })}
    </div>
  );
};

const _season = (state: MachineState) => state.context.state.season;

const SeasonChangedContent = () => {
  const { gameService } = useContext(Context);
  const [hasReadTutorial, setHasReadTutorial] = useState(
    getHasReadTemperateSeasonTutorial(),
  );

  const { t } = useTranslation();

  const season = useSelector(gameService, _season);

  const seasonDetails = SEASON_DETAILS[season.season];

  const acknowledgeTutorial = () => {
    setHasReadTemperateSeasonTutorial();
    setHasReadTutorial(true);
  };

  const acknowledgeSeason = () => {
    setLastTemperateSeasonStartedAt(season.startedAt);
    gameService.send("ACKNOWLEDGE");
  };

  if (!hasReadTutorial) {
    return <SeasonsIntroduction onClose={acknowledgeTutorial} />;
  }

  return (
    <Panel>
      <div className="flex flex-col gap-1">
        <div className="relative w-full">
          <div className="flex justify-between absolute w-full p-1 pr-0">
            <Label
              type="default"
              icon={seasonDetails.icon}
              className="capitalize"
            >
              {season.season}
            </Label>
            <Label type="warning">{t("temperateSeason.newSeason")}</Label>
          </div>
        </div>
        <img
          src={winterBanner}
          className="w-full h-24 object-cover rounded-t-md"
          alt="Season banner"
        />

        <Label type="default" className="capitalize">
          {t("temperateSeason.seasonDetails")}
        </Label>
        <SeasonWeek />

        <div className="flex flex-col gap-1 mt-3">
          <Label type="default">{t("temperateSeason.seasonalCrops")}</Label>
          <div className="flex items-center gap-1">
            {seasonDetails.inSeason.map((item) => (
              <img key={item} src={ITEM_DETAILS[item].image} className="w-6" />
            ))}
          </div>
        </div>

        <Button className="mt-1 capitalize" onClick={acknowledgeSeason}>
          {t("temperateSeason.enterSeason", { season: season.season })}
        </Button>
      </div>
    </Panel>
  );
};

export const SeasonChanged: React.FC = () => {
  return (
    <Modal show>
      <SeasonChangedContent />
    </Modal>
  );
};
