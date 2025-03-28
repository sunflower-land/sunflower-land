import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { millisecondsToString } from "lib/utils/time";
import * as Auth from "features/auth/lib/Provider";
import React, { useContext, useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { Loading } from "features/auth/components";

export const STREAM_REWARD_COOLDOWN = 1000 * 60 * 5;

const RewardHeader: React.FC<{ timeToNextClaim: number }> = ({
  timeToNextClaim,
}) => (
  <div className="flex justify-between items-center px-1 mb-2">
    <Label type="success" icon={ITEM_DETAILS["Love Charm"].image}>
      {`Stream Reward`}
    </Label>
    {timeToNextClaim > 0 && (
      <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
        {`Time to next claim - ${millisecondsToString(timeToNextClaim, {
          length: "short",
        })}`}
      </Label>
    )}
  </div>
);

export const StreamReward: React.FC<{ streamerId: number }> = ({
  streamerId,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { authService } = useContext(Auth.Context);

  const streamHatLastClaimed = useSelector(
    gameService,
    (state) => state.context.state.pumpkinPlaza.streamerHat?.openedAt ?? 0,
  );
  const gameState = useSelector(gameService, (state) => ({
    isClaiming: state.matches("claimingStreamReward"),
    isSuccess: state.matches("claimingStreamRewardSuccess"),
    isFailed: state.matches("claimingStreamRewardFailed"),
    errorCode: state.context.errorCode,
  }));

  const [timeToNextClaim, setTimeToNextClaim] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const timeSinceLastClaim = Date.now() - streamHatLastClaimed;
      setTimeToNextClaim(
        Math.max(0, STREAM_REWARD_COOLDOWN - timeSinceLastClaim),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [streamHatLastClaimed]);

  const claimReward = () => {
    gameService.send("streamReward.claimed", {
      effect: { type: "streamReward.claimed", streamerId },
      authToken: authService.state.context.user.rawToken as string,
    });
  };

  const acknowledge = () => gameService.send("CONTINUE");

  if (gameState.isClaiming) {
    return (
      <div className="ml-1 mb-2">
        <RewardHeader timeToNextClaim={timeToNextClaim} />
        <Loading text={t("claiming")} />
      </div>
    );
  }

  if (gameState.isSuccess) {
    return (
      <div>
        <div className="ml-1 mb-2">
          <RewardHeader timeToNextClaim={timeToNextClaim} />
          <p className="text-sm">{`You have successfully claimed 5 Love Charms!`}</p>
        </div>
        <Button onClick={acknowledge}>{t("continue")}</Button>
      </div>
    );
  }

  if (gameState.isFailed) {
    return <ErrorMessage errorCode={gameState.errorCode as ErrorCode} />;
  }

  return (
    <div>
      <div className="ml-1 mb-2">
        <RewardHeader timeToNextClaim={timeToNextClaim} />
        <p className="text-sm">{`You have found a streamer! Claim 5 Love Charms every 5 minutes.`}</p>
      </div>
      <Button onClick={claimReward} disabled={timeToNextClaim > 0}>
        {timeToNextClaim > 0 ? t("claimed") : t("claim")}
      </Button>
    </div>
  );
};
