import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "@xstate/react";
import useSWR from "swr";
import classNames from "classnames";

import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { LastUpdatedAt } from "components/LastUpdatedAt";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSafeAreaPaddingTop } from "lib/utils/hooks/useSafeAreaPaddingTop";
import { useNow } from "lib/utils/hooks/useNow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import * as AuthProvider from "features/auth/lib/Provider";
import type { AuthMachineState } from "features/auth/lib/authMachine";
import { playerModalManager } from "features/social/lib/playerModalManager";
import {
  STATS_LEADERBOARD_NAMES,
  getLatestStatsLeaderboardDate,
  getStatsLeaderboards,
  shiftUTCDateString,
} from "features/game/expansion/components/leaderboard/actions/statsLeaderboard";
import { HallOfFameBoard } from "./components/HallOfFameBoard";

import { SUNNYSIDE } from "assets/sunnyside";
import calendarIcon from "assets/icons/calendar.webp";
import arrowPreviousIcon from "assets/icons/arrow_previous.png";
import arrowNextIcon from "assets/icons/arrow_next.png";

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

/** Where the Hall of Fame was opened from, so closing puts the player back. */
export type HallOfFameNavigationState = {
  returnTo?: string;
};

const HEADER_HEIGHT = 70;

/**
 * Full screen Hall of Fame at /world/hall-of-fame, opened from the Kingdom
 * noticeboard. One panel per stats board, all six loaded in a single request.
 *
 * The world scene keeps running behind this route, so closing simply navigates
 * back to the scene the player was standing in.
 */
export const HallOfFame: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { authService } = useContext(AuthProvider.Context);
  const token = useSelector(authService, _token);

  const safeAreaPaddingTop = useSafeAreaPaddingTop(50);

  // Ticking the clock keeps render pure and rolls the boards over for a page
  // left open across UTC midnight. A minute is plenty for a daily boundary.
  const now = useNow({ live: true, intervalMs: 60 * 1000 });

  // The API refuses today, so the newest board we can ask for is yesterday's.
  const latestDate = getLatestStatsLeaderboardDate(now);
  const [date, setDate] = useState(latestDate);
  const isLatest = date === latestDate;

  const { data, error, isLoading } = useSWR(
    ["/data?type=statsLeaderboard", token, date],
    () => getStatsLeaderboards({ token, date }),
    {
      // Nothing changes until reportDate rolls over at 00:00 UTC.
      dedupingInterval: 60 * 60 * 1000,
      revalidateOnFocus: false,
    },
  );

  const handleClose = useCallback(() => {
    const { returnTo } =
      (location.state as HallOfFameNavigationState | null) ?? {};

    navigate(returnTo ?? "/world/kingdom", { replace: true });
  }, [location.state, navigate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      // A player modal opens above this page and closes itself on Escape. It is
      // asked live rather than through render state, so the answer holds
      // whichever of the two listeners the keypress reaches first.
      if (playerModalManager.isBlockingEscape()) return;

      handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div
      className="bg-[#181425] w-full h-full safe-area-inset-bottom"
      style={{ paddingTop: safeAreaPaddingTop }}
    >
      <OuterPanel className="h-full">
        <div
          className="relative flex w-full pr-10 items-center mr-auto mb-0.5"
          style={{ height: `${HEADER_HEIGHT}px` }}
        >
          <div
            className="absolute inset-0 w-full h-full -z-0 rounded-sm"
            // Repeating pixel art image background
            style={{
              backgroundImage: `url(${SUNNYSIDE.decorations.ocean})`,
              backgroundRepeat: "repeat",
              imageRendering: "pixelated",
              backgroundSize: `${64 * PIXEL_SCALE}px`,
              backgroundPosition: "top left",
            }}
          />
          <div className="absolute inset-0 w-full h-full bg-black opacity-35 -z-0 rounded-sm" />

          <div className="z-10 pl-4">
            <p className="text-lg text-white text-shadow">
              {t("statsLeaderboard.pageTitle")}
            </p>
            <p className="text-xxs sm:text-xs text-white text-shadow">
              {t("statsLeaderboard.pageDescription")}
            </p>
          </div>

          <img
            src={SUNNYSIDE.icons.close}
            className="flex-none cursor-pointer absolute right-2 z-10"
            onClick={handleClose}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              height: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>

        <div
          className="overflow-y-auto scrollable"
          style={{ height: `calc(100% - ${HEADER_HEIGHT}px)` }}
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between p-1">
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
              <div className="flex flex-col sm:items-end font-secondary text-xxs">
                <p>
                  {t("statsLeaderboard.scanned", {
                    scanned: data.scanned.toLocaleString(),
                  })}
                </p>
                <p>
                  <LastUpdatedAt lastUpdated={data.lastUpdated} />
                </p>
              </div>
            )}
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
            <div className="flex flex-wrap">
              {STATS_LEADERBOARD_NAMES.map((name) => (
                <div
                  key={name}
                  className="w-full sm:w-1/2 md:w-1/3 xl:w-1/5 p-0.5"
                >
                  <HallOfFameBoard
                    name={name}
                    players={data.boards[name]?.players ?? []}
                    onPlayerClick={(player) => playerModalManager.open(player)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </OuterPanel>
    </div>
  );
};
