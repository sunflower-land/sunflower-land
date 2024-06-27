import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { getKeys } from "features/game/types/craftables";
import { FactionPrize } from "features/game/types/game";
import React, { useContext, useState } from "react";

interface Props {
  onClose: () => void;
}
export const FactionWeeklyPrize: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState, send] = useActor(gameService);

  const [reward, setReward] = useState<FactionPrize>();

  const history = gameState.context.state.faction?.history ?? {};
  const week = getKeys(history).find(
    (weekKey) => history[weekKey].results?.reward
  );
  const prize = history[week as string]?.results?.reward;

  if (!prize) {
    return (
      <Panel>
        <div className="p-2">
          <Label type="danger" className="mb-2">
            No prize found
          </Label>
          <span className="text-sm mb-2">
            Are you a faction spy? Something suspicious is going on.
          </span>
        </div>
        <Button onClick={onClose}>Close</Button>
      </Panel>
    );
  }

  const claim = () => {
    gameService.send("faction.prizeClaimed", {
      week,
    });
  };

  if (reward) {
    return (
      <Panel>
        <ClaimReward
          reward={{
            id: "faction-prize",
            createdAt: Date.now(),
            wearables: {},
            ...reward,
          }}
          onClaim={claim}
          onClose={onClose}
        />
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="p-2">
        <Label type="success">Congratulations</Label>
        <span className="text-sm mb-2">
          You have received a prize for your efforts in the faction.
        </span>
      </div>
      <Button onClick={() => setReward(prize)}>Continue</Button>
    </Panel>
  );
};
