import React, { useState } from "react";
import useSWR from "swr";
import classNames from "classnames";

import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import { useAuth } from "features/auth/lib/Provider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { LastUpdatedAt } from "components/LastUpdatedAt";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { toOrdinalSuffix } from "features/retreat/components/auctioneer/AuctionLeaderboardTable";
import { getAscensionDisplayText } from "features/game/lib/level";
import {
  playerModalManager,
  type PlayerModalPlayer,
} from "features/social/lib/playerModalManager";
import {
  STATS_LEADERBOARD_NAMES,
  getLatestStatsLeaderboardDate,
  getStatsLeaderboards,
  shiftUTCDateString,
  type StatsLeaderboardName,
  type StatsLeaderboardPlayer,
} from "features/game/expansion/components/leaderboard/actions/statsLeaderboard";
import type { ContentComponentProps } from "../types";

import { SUNNYSIDE } from "assets/sunnyside";
import coinsIcon from "assets/icons/coins.webp";
import xpIcon from "assets/icons/xp.png";
import chickenIcon from "assets/icons/chook.webp";
import deliveryIcon from "assets/icons/delivery.webp";
import calendarIcon from "assets/icons/calendar.webp";
import arrowPreviousIcon from "assets/icons/arrow_previous.png";
import arrowNextIcon from "assets/icons/arrow_next.png";

const BOARD_ICONS: Record<StatsLeaderboardName, string> = {
  coins: coinsIcon,
  experience: xpIcon,
  cropsHarvested: SUNNYSIDE.icons.plant,
  fishCaught: SUNNYSIDE.icons.fish,
  animalsFed: chickenIcon,
  deliveries: deliveryIcon,
};

export const StatsLeaderboardExperimentSettings: React.FC<
  ContentComponentProps
> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { authState } = useAuth();
  const token = authState.context.user.rawToken as string;

  // The API refuses today, so the newest board we can ask for is yesterday's.
  const latestDate = getLatestStatsLeaderboardDate();
  const [date, setDate] = useState(latestDate);
  const [board, setBoard] = useState<StatsLeaderboardName>("coins");

  const { data, error, isLoading } = useSWR(
    ["/data?type=statsLeaderboard", token, date],
    () => getStatsLeaderboards({ token, date }),
    {
      // Nothing changes until reportDate rolls over at 00:00 UTC.
      dedupingInterval: 60 * 60 * 1000,
      revalidateOnFocus: false,
    },
  );

  const isLatest = date === latestDate;

  return (
    <div className="flex flex-col gap-1 min-h-[240px]">
      <p className="text-xs px-1">
        {t("gameOptions.experiments.statsLeaderboardDescription")}
      </p>

      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between px-1">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <img
            src={arrowPreviousIcon}
            alt={t("statsLeaderboard.previousDay")}
            className="h-6 cursor-pointer hover:img-highlight"
            onClick={() => setDate(shiftUTCDateString(date, -1))}
          />
          <Label type="default" icon={calendarIcon}>
            {data?.reportDate ?? date}
          </Label>
          <img
            src={arrowNextIcon}
            alt={t("statsLeaderboard.nextDay")}
            className={classNames("h-6", {
              "cursor-pointer hover:img-highlight": !isLatest,
              // Today is never published, so yesterday is as far forward as we go.
              "opacity-40 pointer-events-none": isLatest,
            })}
            onClick={() => {
              if (!isLatest) setDate(shiftUTCDateString(date, 1));
            }}
          />
        </div>
        {!!data && (
          <p className="font-secondary text-xxs">
            <LastUpdatedAt lastUpdated={data.lastUpdated} />
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {STATS_LEADERBOARD_NAMES.map((name) => (
          <ButtonPanel
            key={name}
            selected={board === name}
            onClick={() => setBoard(name)}
            className="flex items-center gap-1 grow basis-[30%]"
          >
            <img src={BOARD_ICONS[name]} className="h-4" />
            <span className="text-xxs">
              {t(`statsLeaderboard.board.${name}`)}
            </span>
          </ButtonPanel>
        ))}
      </div>

      {isLoading && <Loading />}

      {!isLoading && error && (
        <div className="p-1">
          <Label type="danger">{t("leaderboard.error")}</Label>
        </div>
      )}

      {!isLoading && !error && !data && (
        <div className="p-1">
          <Label type="warning">{t("statsLeaderboard.notPublished")}</Label>
        </div>
      )}

      {!isLoading && !error && !!data && (
        <>
          <p className="text-xxs italic px-1">
            {t(`statsLeaderboard.description.${board}`)}
          </p>
          <StatsLeaderboardTable
            players={data.boards[board]?.players ?? []}
            onPlayerClick={(player) => {
              // Close settings first so the player modal isn't stacked behind it.
              onClose();
              playerModalManager.open(player);
            }}
          />
          <p className="text-xxs italic px-1">
            {t("statsLeaderboard.scanned", {
              scanned: data.scanned.toLocaleString(),
            })}
          </p>
        </>
      )}
    </div>
  );
};

const StatsLeaderboardTable: React.FC<{
  players: StatsLeaderboardPlayer[];
  onPlayerClick: (player: PlayerModalPlayer) => void;
}> = ({ players, onPlayerClick }) => {
  const { t } = useAppTranslation();

  if (players.length === 0) {
    return (
      <div className="p-1">
        <Label type="default">{t("statsLeaderboard.empty")}</Label>
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-y-auto scrollable">
      <table className="w-full text-xs table-fixed border-collapse">
        <thead>
          <tr>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/6">
              <p>{t("rank")}</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <p>{t("player")}</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/3">
              <p>{t("total")}</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map(
            ({ rank, farmId, username, bumpkin, level, ascension, count }) => (
              <tr
                key={`${rank}-${farmId}`}
                className={classNames("relative", {
                  "bg-[#ead4aa]": rank % 2 === 1,
                  // A deleted farm has no wearables — nothing to open.
                  "cursor-pointer": !!bumpkin,
                })}
                onClick={() => {
                  if (bumpkin) {
                    onPlayerClick({ farmId, username, clothing: bumpkin });
                  }
                }}
              >
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-1/6"
                >
                  {toOrdinalSuffix(rank)}
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 text-left pl-8 relative truncate"
                >
                  {bumpkin && (
                    <div
                      className="absolute"
                      style={{ left: "4px", top: "1px" }}
                    >
                      <NPCIcon width={24} parts={bumpkin} />
                    </div>
                  )}
                  {`${username} - ${getAscensionDisplayText({
                    ascension: { ascension, level },
                    length: "short",
                  })}`}
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-1/3"
                >
                  {count.toLocaleString()}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};
