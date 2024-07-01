import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { getKeys } from "features/game/types/craftables";
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

interface Props {
  onClose: () => void;
}
export const FactionWeeklyPrize: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const { history, week, prize } = getFactionPrize({
    game: gameState.context.state,
  });

  // We store as a ref to avoid re-renders when claiming
  const reward = useRef(prize);

  if (!reward.current) {
    return (
      <Panel>
        <div className="p-2">
          <Label type="danger" className="mb-2">
            {t("faction.noPrizeFound")}
          </Label>
          <span className="text-sm mb-2">{t("faction.noPrizeFound")}</span>
        </div>
        <Button onClick={onClose}>{t("close")}</Button>
      </Panel>
    );
  }

  const claim = () => {
    gameService.send("faction.prizeClaimed", {
      week,
    });

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
    </Panel>
  );
};
