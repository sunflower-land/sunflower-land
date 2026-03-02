import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import React, { useContext, useState } from "react";

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
  const createdAt = useNow();

  const { t } = useAppTranslation();

  const { history, week, prize } = getFactionPrize({
    game: gameState.context.state,
  });
  const [reward] = useState(prize);

  if (!reward) {
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
    gameService.send({ type: "faction.prizeClaimed", week });

    onClose();
  };

  return (
    <Panel>
      <ClaimReward
        reward={{
          id: "faction-prize",
          wearables: {},
          createdAt,
          message: `Woohoo, you have received a prize for your efforts in the faction. Your rank: ${
            history[week as string]?.results?.rank
          }`,
          ...reward,
        }}
        onClaim={claim}
        onClose={onClose}
      />
    </Panel>
  );
};
