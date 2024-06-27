import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { getKeys } from "features/game/types/craftables";
<<<<<<< HEAD
import { GameState } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useRef } from "react";

export function getFactionPrize({ game }: { game: GameState }) {
  const history = game.faction?.history ?? {};

  const week = getKeys(history).find(
    (weekKey) =>
      history[weekKey].results?.reward && !history[weekKey].results?.claimedAt,
  );

  const prize = history[week as string]?.results?.reward;

  return { history, week, prize };
}
=======
import { FactionPrize } from "features/game/types/game";
import React, { useContext, useState } from "react";
>>>>>>> 82e84a363 (Faction prize setup)

interface Props {
  onClose: () => void;
}
export const FactionWeeklyPrize: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
<<<<<<< HEAD
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const { history, week, prize } = getFactionPrize({
    game: gameState.context.state,
  });

  // We store as a ref to avoid re-renders when claiming
  const reward = useRef(prize);

  if (!reward.current) {
=======
  const [gameState, send] = useActor(gameService);

  const [reward, setReward] = useState<FactionPrize>();

  const history = gameState.context.state.faction?.history ?? {};
  const week = getKeys(history).find(
    (weekKey) => history[weekKey].results?.reward
  );
  const prize = history[week as string]?.results?.reward;

  if (!prize) {
>>>>>>> 82e84a363 (Faction prize setup)
    return (
      <Panel>
        <div className="p-2">
          <Label type="danger" className="mb-2">
<<<<<<< HEAD
            {t("faction.noPrizeFound")}
          </Label>
          <span className="text-sm mb-2">{t("faction.noPrizeFound")}</span>
        </div>
        <Button onClick={onClose}>{t("close")}</Button>
=======
            No prize found
          </Label>
          <span className="text-sm mb-2">
            Are you a faction spy? Something suspicious is going on.
          </span>
        </div>
        <Button onClick={onClose}>Close</Button>
>>>>>>> 82e84a363 (Faction prize setup)
      </Panel>
    );
  }

  const claim = () => {
    gameService.send("faction.prizeClaimed", {
      week,
    });
<<<<<<< HEAD

    onClose();
  };

  return (
    <Panel>
      <ClaimReward
        reward={{
          id: "faction-prize",
          createdAt: Date.now(),
          wearables: {},
          message: `Woohoo, you have received a prize for your efforts in the faction. Your rank: ${
            history[week as string]?.results?.rank
          }`,
          ...reward.current,
        }}
        onClaim={claim}
        onClose={onClose}
      />
=======
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
>>>>>>> 82e84a363 (Faction prize setup)
    </Panel>
  );
};
