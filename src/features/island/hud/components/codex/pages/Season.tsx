import React from "react";
import { TicketsLeaderboard } from "./TicketsLeaderboard";
import { TicketLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { InnerPanel } from "components/ui/Panel";
import {
  SEASON_TICKET_NAME,
  SeasonName,
  secondsLeftInSeason,
} from "features/game/types/seasons";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";

import chores from "assets/icons/chores.webp";
import lock from "assets/icons/lock.png";

import { SeasonalAuctions } from "../components/SeasonalAuctions";
import classNames from "classnames";
import { SeasonalMutants } from "../components/SeasonalMutants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SeasonalStore } from "features/world/ui/megastore/SeasonalStore";
import { ITEM_DETAILS } from "features/game/types/images";
import { FlowerBountiesModal } from "features/world/ui/flowerShop/FlowerBounties";
import { BertObsession } from "features/world/ui/npcs/Bert";
import { GameState } from "features/game/types/game";

const CHAPTER_GRAPHICS: Record<SeasonName, string> = {
  "Solar Flare": "?",
  "Dawn Breaker": "?",
  "Witches' Eve": "?",
  "Catch the Kraken": "?",
  "Spring Blossom": "?",
  "Clash of Factions": "?",
  "Pharaoh's Treasure": SUNNYSIDE.announcement.desertSeason,
  "Bull Run": SUNNYSIDE.announcement.bullRunSeason,
  "Winds of Change": SUNNYSIDE.announcement.windsOfChangeSeason,
};

const CHORES_DELIVERIES_START_DATE: Record<SeasonName, string> = {
  "Solar Flare": "?",
  "Dawn Breaker": "?",
  "Witches' Eve": "?",
  "Catch the Kraken": "?",
  "Spring Blossom": "?",
  "Clash of Factions": "?",
  "Pharaoh's Treasure": "?",
  "Bull Run": "Nov 11th",
  "Winds of Change": "Feb 10th",
};

interface Props {
  id: string;
  isLoading: boolean;
  data: TicketLeaderboard | null;
  season: SeasonName;
  state: GameState;
  farmId: number;
}

export const Season: React.FC<Props> = ({
  id,
  isLoading,
  data,
  season,
  state,
  farmId,
}) => {
  const { t } = useAppTranslation();
  const { bertObsession: currentObsession, npcs, inventory, wardrobe } = state;
  return (
    <div
      className={classNames(
        "flex flex-col h-full overflow-hidden overflow-y-auto scrollable",
      )}
    >
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between mb-1 flex-wrap">
            <Label className="-ml-1 mb-1" type="default">
              {season}
            </Label>
            <Label
              type="info"
              className="mb-1"
              icon={SUNNYSIDE.icons.stopwatch}
            >
              {`${secondsToString(secondsLeftInSeason(), { length: "short" })} left`}
            </Label>
          </div>
          <p className="text-xs">
            {t("season.codex.intro", { ticket: SEASON_TICKET_NAME[season] })}
          </p>
        </div>
      </InnerPanel>
      <InnerPanel className="mb-1">
        <div
          style={{
            backgroundImage: `url(${CHAPTER_GRAPHICS[season]})`,
            imageRendering: "pixelated",
            height: "125px",
            backgroundSize: "600px",
            backgroundPosition: "center",
            margin: "-3px",
          }}
        ></div>
      </InnerPanel>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between mb-2">
            <Label className="-ml-1" type="default">
              {t("season.codex.howToEarn", {
                ticket: SEASON_TICKET_NAME[season],
              })}
            </Label>

            {Date.now() < new Date("2024-11-06").getTime() && (
              <Label icon={lock} type="danger">
                {t("coming.soon")}
              </Label>
            )}
          </div>
          {Date.now() < new Date("2024-11-06").getTime() && (
            <div className="mb-2">
              <span className="text-xs">
                {t("season.codex.howToEarn.comingSoon")}
              </span>
            </div>
          )}
          <NoticeboardItems
            iconWidth={8}
            items={[
              {
                text: t("season.codex.howToEarn.one"),
                icon: SUNNYSIDE.icons.player,
              },
              {
                text: t("season.codex.howToEarn.two", {
                  date: CHORES_DELIVERIES_START_DATE[season],
                }),
                icon: chores,
              },
              {
                text: t("season.codex.howToEarn.three", {
                  date: CHORES_DELIVERIES_START_DATE[season],
                }),
                icon: ITEM_DETAILS["White Pansy"].image,
              },
            ]}
          />
        </div>
      </InnerPanel>
      <InnerPanel className="mb-1">
        <FlowerBountiesModal readonly state={state} />
      </InnerPanel>
      <InnerPanel className="mb-1">
        <BertObsession
          readonly
          currentObsession={currentObsession}
          npcs={npcs}
          inventory={inventory}
          wardrobe={wardrobe}
        />
      </InnerPanel>
      <InnerPanel className="mb-1">
        <SeasonalStore readonly state={state} />
      </InnerPanel>
      <SeasonalAuctions gameState={state} farmId={farmId} season={season} />
      <SeasonalMutants season={season} />
      <InnerPanel className="mb-1">
        <TicketsLeaderboard id={id} isLoading={isLoading} data={data} />
      </InnerPanel>
    </div>
  );
};
