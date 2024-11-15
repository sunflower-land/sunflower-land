import React, { useContext } from "react";
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
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import classNames from "classnames";
import { SeasonalMutants } from "../components/SeasonalMutants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SeasonalStore } from "features/world/ui/megastore/SeasonalStore";
import { ITEM_DETAILS } from "features/game/types/images";

const SEASON_GRAPHICS: Record<SeasonName, string> = {
  "Solar Flare": "?",
  "Dawn Breaker": "?",
  "Witches' Eve": "?",
  "Catch the Kraken": "?",
  "Spring Blossom": "?",
  "Clash of Factions": "?",
  "Pharaoh's Treasure": SUNNYSIDE.announcement.desertSeason,
  "Bull Run": SUNNYSIDE.announcement.bullRunSeason,
};

interface Props {
  id: string;
  isLoading: boolean;
  data: TicketLeaderboard | null;
  season: SeasonName;
}

export const Season: React.FC<Props> = ({ id, isLoading, data, season }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const { state, farmId } = gameState.context;
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
            backgroundImage: `url(${SEASON_GRAPHICS[season]})`,
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
                text: t("season.codex.howToEarn.two"),
                icon: chores,
              },
              {
                text: t("season.codex.howToEarn.three"),
                icon: ITEM_DETAILS["White Pansy"].image,
              },
            ]}
          />
        </div>
      </InnerPanel>
      <InnerPanel className="mb-1">
        <SeasonalStore readonly />
      </InnerPanel>
      <SeasonalAuctions gameState={state} farmId={farmId} season={season} />
      <SeasonalMutants season={season} />
      <InnerPanel className="mb-1">
        <TicketsLeaderboard id={id} isLoading={isLoading} data={data} />
      </InnerPanel>
    </div>
  );
};
