import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { millisecondsToString } from "lib/utils/time";
import { useNow } from "lib/utils/hooks/useNow";
import * as Auth from "features/auth/lib/Provider";
import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { Loading } from "features/auth/components";
import { InnerPanel } from "components/ui/Panel";
import { GameState } from "features/game/types/game";

export const STREAM_REWARD_COOLDOWN = 1000 * 60 * 5;

interface RewardHeaderProps {
  timeToNextClaim: number;
  dailyCount: number | undefined;
  hasReachedLimit: boolean;
}

const RewardHeader: React.FC<RewardHeaderProps> = ({
  timeToNextClaim,
  dailyCount = 0,
  hasReachedLimit,
}) => {
  const { t } = useAppTranslation();
  const time = millisecondsToString(timeToNextClaim, { length: "short" });

  return (
    <div className="gap-1">
      <div className="flex justify-between items-center px-1 mb-1">
        <Label type="success" icon={ITEM_DETAILS["Love Charm"].image}>
          {t("streams.title")}
        </Label>
        <Label
          type={hasReachedLimit ? "danger" : "info"}
          icon={ITEM_DETAILS["Basic Love Box"].image}
        >
          {t("streams.boxesClaimed", { count: dailyCount })}
        </Label>
      </div>
      {timeToNextClaim > 0 && (
        <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
          {t("streams.timeToNextClaim", { time })}
        </Label>
      )}
    </div>
  );
};

const DEFAULT_STREAMER_HAT: GameState["pumpkinPlaza"]["streamerHat"] = {
  openedAt: 0,
  dailyCount: 0,
};

export const StreamReward: React.FC<{ streamerId: number }> = ({
  streamerId,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { authService } = useContext(Auth.Context);

  const { openedAt: streamHatLastClaimed, dailyCount } = useSelector(
    gameService,
    (state) =>
      state.context.state.pumpkinPlaza.streamerHat ?? DEFAULT_STREAMER_HAT,
  );

  const { isClaiming, isSuccess, isFailed, errorCode } = useSelector(
    gameService,
    (state) => ({
      isClaiming: state.matches("claimingStreamReward"),
      isSuccess: state.matches("claimingStreamRewardSuccess"),
      isFailed: state.matches("claimingStreamRewardFailed"),
      errorCode: state.context.errorCode,
    }),
  );

  const now = useNow({
    live: true,
    intervalMs: 60000,
  });

  const timeToNextClaim =
    streamHatLastClaimed === 0
      ? 0
      : Math.max(0, STREAM_REWARD_COOLDOWN - (now - streamHatLastClaimed));

  // Check if it's a new day compared to when the last claim was made
  const startOfCurrentDay = new Date(now);
  startOfCurrentDay.setUTCHours(0, 0, 0, 0);
  const currentDayStart = startOfCurrentDay.getTime();

  const startOfLastClaimDay = new Date(streamHatLastClaimed);
  startOfLastClaimDay.setUTCHours(0, 0, 0, 0);
  const lastClaimDayStart = startOfLastClaimDay.getTime();

  const isNewDay = currentDayStart !== lastClaimDayStart;

  // Only check the limit if it's not a new day (count resets on new day)
  const hasReachedLimit = !isNewDay && (dailyCount ?? 0) >= 10;

  const claimReward = () => {
    gameService.send("streamReward.claimed", {
      effect: { type: "streamReward.claimed", streamerId },
      authToken: authService.getSnapshot().context.user.rawToken as string,
    });
  };

  const acknowledge = () => gameService.send({ type: "CONTINUE" });

  const rewardHeaderProps: RewardHeaderProps = {
    timeToNextClaim,
    dailyCount: isNewDay ? 0 : dailyCount,
    hasReachedLimit,
  };

  if (isClaiming) {
    return (
      <InnerPanel>
        <div className="ml-1 mb-2">
          <RewardHeader {...rewardHeaderProps} />
          <Loading text={t("claiming")} />
        </div>
      </InnerPanel>
    );
  }

  if (isSuccess) {
    return (
      <InnerPanel>
        <div className="ml-1 mb-2">
          <RewardHeader {...rewardHeaderProps} />
          <p className="text-sm">{t("streams.message.streamer.claimed")}</p>
        </div>
        <Button onClick={acknowledge}>{t("continue")}</Button>
      </InnerPanel>
    );
  }

  if (isFailed && errorCode) {
    return (
      <InnerPanel>
        <div className="ml-1 mb-2">
          <ErrorMessage errorCode={errorCode} />
        </div>
      </InnerPanel>
    );
  }

  return (
    <InnerPanel>
      <div className="ml-1 mb-2">
        <RewardHeader {...rewardHeaderProps} />
        <p className="text-sm">{t("streams.message.streamer")}</p>
      </div>
      <Button
        onClick={claimReward}
        disabled={timeToNextClaim > 0 || hasReachedLimit}
      >
        {timeToNextClaim > 0 ? t("claimed") : t("claim")}
      </Button>
    </InnerPanel>
  );
};
