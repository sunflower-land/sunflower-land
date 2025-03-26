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
  const claiming = useSelector(gameService, (state) =>
    state.matches("claimingStreamReward"),
  );
  const [timeToNextClaim, setTimeToNextClaim] = useState(0);
  const hasOpened = timeToNextClaim > 0;

  useEffect(() => {
    const updateTime = () => {
      const timeSinceLastClaim = Date.now() - streamHatLastClaimed;
      const nextClaim = 1000 * 60 * 5 - timeSinceLastClaim;
      setTimeToNextClaim(Math.max(0, nextClaim));
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [streamHatLastClaimed]);

  const claimReward = () => {
    gameService.send("streamReward.claimed", {
      effect: { type: "streamReward.claimed", streamerId },
      authToken: authService.state.context.user.rawToken as string,
    });
  };

  return (
    <div>
      <div className="ml-1 mb-2">
        <div className="flex justify-between items-center px-1 mb-2">
          <Label type="success" icon={ITEM_DETAILS["Love Charm"].image}>
            {`Stream Reward`}
          </Label>
          {hasOpened && (
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {`Time to next claim - ${millisecondsToString(timeToNextClaim, {
                length: "short",
              })}`}
            </Label>
          )}
        </div>
        <p className="text-sm">{`You have found a streamer! Claim 5 Love Charms every 5 minutes.`}</p>
      </div>
      <Button onClick={claimReward} disabled={hasOpened || claiming}>
        {claiming ? t("claiming") : hasOpened ? t("claimed") : t("claim")}
      </Button>
    </div>
  );
};
