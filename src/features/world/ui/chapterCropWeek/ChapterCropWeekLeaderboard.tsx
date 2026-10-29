import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import useSWR from "swr";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { LastUpdatedAt } from "components/LastUpdatedAt";
import { useNow } from "lib/utils/hooks/useNow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";
import * as AuthProvider from "features/auth/lib/Provider";
import type { AuthMachineState } from "features/auth/lib/authMachine";
import { Context as GameContext } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { playerModalManager } from "features/social/lib/playerModalManager";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  CHAPTER_CROP_WEEK,
  CHAPTER_CROP_WEEK_RECIPE,
} from "features/game/types/chapterCropWeek";
import { getChapterRecipeLeaderboard } from "features/game/expansion/components/leaderboard/actions/chapterRecipeLeaderboard";
import { HallOfFameRow } from "features/hallOfFame/components/HallOfFameBoard";

import { SUNNYSIDE } from "assets/sunnyside";

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;
const _farmId = (state: MachineState) => state.context.farmId;

/**
 * Chapter Crop Week cooking leaderboard, opened from the Plaza noticeboard
 * beside the spawn statue: the top 100 players by event-recipe cooks, with the
 * viewing player's own row highlighted when they are on it.
 */
export const ChapterCropWeekLeaderboard: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { t } = useAppTranslation();
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(GameContext);
  const token = useSelector(authService, _token);
  const farmId = useSelector(gameService, _farmId);

  const now = useNow({
    live: true,
    autoEndAt: CHAPTER_CROP_WEEK.endDate.getTime(),
  });
  const secondsLeft = Math.max(
    0,
    (CHAPTER_CROP_WEEK.endDate.getTime() - now) / 1000,
  );

  const { data, error, isLoading } = useSWR(
    ["/data?type=chapterRecipeLeaderboard", token],
    () => getChapterRecipeLeaderboard({ token }),
    {
      // The API only rebuilds the served board every 5 minutes.
      dedupingInterval: 5 * 60 * 1000,
      revalidateOnFocus: false,
    },
  );

  const recipe = ITEM_DETAILS[CHAPTER_CROP_WEEK_RECIPE];
  const recipeName = recipe.translatedName ?? CHAPTER_CROP_WEEK_RECIPE;
  const ownEntry = data?.players.find((player) => player.farmId === farmId);

  return (
    <CloseButtonPanel
      onClose={onClose}
      title={t("chapterCropWeek.leaderboard.title")}
    >
      <div className="flex flex-col gap-1 p-1">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <Label type="default" icon={recipe.image}>
            {recipeName}
          </Label>
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            {`${secondsToString(secondsLeft, { length: "short" })} ${t("time.left")}`}
          </Label>
        </div>
        <p className="text-xxs italic">
          {t("chapterCropWeek.leaderboard.description", { recipe: recipeName })}
        </p>

        {isLoading && <Loading />}

        {!isLoading && error && (
          <Label type="danger">{t("leaderboard.error")}</Label>
        )}

        {!isLoading && !error && !data && (
          <Label type="warning">
            {t("chapterCropWeek.leaderboard.notPublished")}
          </Label>
        )}

        {!isLoading && !error && !!data && (
          <>
            {ownEntry ? (
              <Label type="success" icon={SUNNYSIDE.icons.player}>
                {t("chapterCropWeek.leaderboard.yourRank", {
                  rank: ownEntry.rank,
                  count: ownEntry.count.toLocaleString(),
                })}
              </Label>
            ) : (
              <p className="text-xxs">
                {t("chapterCropWeek.leaderboard.unranked", {
                  recipe: recipeName,
                })}
              </p>
            )}

            {data.players.length === 0 ? (
              <p className="text-xxs">{t("statsLeaderboard.empty")}</p>
            ) : (
              <div className="max-h-[50vh] overflow-y-auto scrollable">
                {data.players.map((player) => (
                  <HallOfFameRow
                    key={`${player.rank}-${player.farmId}`}
                    player={player}
                    highlight={player.farmId === farmId}
                    onClick={(clicked) => playerModalManager.open(clicked)}
                  />
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-between font-secondary text-xxs">
              <span>{t("chapterCropWeek.leaderboard.rankingUpdated")}</span>
              <span>
                <LastUpdatedAt lastUpdated={data.dumpUpdatedAt} />
              </span>
            </div>
          </>
        )}
      </div>
    </CloseButtonPanel>
  );
};
