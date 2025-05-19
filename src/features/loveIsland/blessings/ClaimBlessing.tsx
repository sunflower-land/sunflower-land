import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useAuth } from "features/auth/lib/Provider";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { useGame } from "features/game/GameProvider";
import { blessingIsReady } from "features/game/lib/blessings";
import { secondsToString } from "lib/utils/time";
import React from "react";

interface Props {
  onClose: () => void;
}
export const ClaimBlessingReward: React.FC<Props> = ({ onClose }) => {
  const { gameState, gameService } = useGame();
  const { authState } = useAuth();

  const { offered, reward } = gameState.context.state.blessing;
  console.log("RENDRING?");

  const seekBlessing = () => {
    gameService.send("blessing.seeked", {
      effect: {
        type: "blessing.seeked",
      },
      authToken: authState.context.user.rawToken as string,
    });
  };

  const claimBlessing = () => {
    gameService.send("blessing.claimed");
    onClose();
  };

  if (!offered && !reward) {
    return (
      <div>
        <Label type="default" className="mb-1">
          Missing offering
        </Label>
        <p className="text-xs mb-1">Visit the Guardians to make an offering.</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  if (reward) {
    return (
      <ClaimReward
        onClaim={claimBlessing}
        reward={{
          message: "The Gods have blessed your generosity and faith.",
          createdAt: Date.now(),
          id: "guardian-reward",
          items: reward.items ?? {},
          wearables: {},
          sfl: 0,
          coins: reward.coins,
        }}
      />
    );
  }

  const isReady = blessingIsReady({ game: gameState.context.state });

  if (!isReady) {
    const offeredDate = new Date(offered!.offeredAt).toISOString().slice(0, 10);

    const readyIn = Date.now() - new Date(offeredDate).getTime();
    return (
      <div>
        <Label type="default" className="mb-1">
          Pray to the Guardians
        </Label>
        <p className="text-xs mb-2">
          Thank you for your offering devoted one. The guardians smile upon you,
          patience is now key - wait until a new day to receive your blessing.
        </p>
        <p className="text-xs">
          {secondsToString(readyIn / 1000, { length: "medium" })}
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <div>
      <Label type="warning" className="mb-1">
        You have been blessed
      </Label>
      <p className="text-xs">The gods thank the faithful.</p>
      <Button onClick={seekBlessing}>Claim Blessing</Button>
    </div>
  );
};
