import React, { useContext } from "react";
import { TicketsLeaderboard } from "./TicketsLeaderboard";
import { TicketLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { InnerPanel } from "components/ui/Panel";
import {
  getCurrentSeason,
  getSeasonalTicket,
  secondsLeftInSeason,
} from "features/game/types/seasons";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";

import factions from "assets/icons/factions.webp";
import chores from "assets/icons/chores.webp";
import { SeasonalAuctions } from "../components/SeasonalAuctions";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import classNames from "classnames";
import { SeasonalMutants } from "../components/SeasonalMutants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MegaStoreMonthly } from "features/world/ui/megastore/MegaStoreMonthly";
import { MegaStoreSeasonal } from "features/world/ui/megastore/MegaStoreSeasonal";

interface Props {
  id: string;
  isLoading: boolean;
  data: TicketLeaderboard | null;
}

export const Season: React.FC<Props> = ({ id, isLoading, data }) => {
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
              {getCurrentSeason()}
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
            {t("season.codex.intro", { ticket: getSeasonalTicket() })}
          </p>
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div
          style={{
            backgroundImage: `url(${SUNNYSIDE.announcement.desertSeason})`,
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
              {t("season.codex.howToEarn", { ticket: getSeasonalTicket() })}
            </Label>
          </div>
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
                icon: factions,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <MegaStoreMonthly readonly />
      </InnerPanel>

      <InnerPanel className="mb-1">
        <MegaStoreSeasonal readonly />
      </InnerPanel>

      <SeasonalAuctions gameState={state} farmId={farmId} />

      <SeasonalMutants />

      <InnerPanel className="mb-1">
        <TicketsLeaderboard id={id} isLoading={isLoading} data={data} />
      </InnerPanel>
    </div>
  );
};
