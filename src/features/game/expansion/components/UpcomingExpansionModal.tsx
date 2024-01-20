import React from "react";
import { Bumpkin, GameState } from "features/game/types/game";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { craftingRequirementsMet } from "features/game/lib/craftingRequirement";
import { ExpansionRequirements } from "components/ui/layouts/ExpansionRequirements";
import { expansionRequirements } from "features/game/events/landExpansion/revealLand";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  gameState: GameState;
  onClose: () => void;
  onExpand: () => void;
}

export const UpcomingExpansionModal: React.FC<Props> = ({
  gameState,
  onClose,
  onExpand,
}) => {
  const { t } = useAppTranslation();
  // cannot expand if there is no next expansion
  if (gameState.expansionRequirements === undefined) {
    return (
      <div>
        <div className="flex items-start">
          <span className="m-2">{t("landscape.expansion.two")}</span>
        </div>
        <div className="flex justify-center w-1/2 mb-2">
          <img
            src={SUNNYSIDE.npcs.moonseeker_walk}
            className="running"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
            }}
          />
        </div>
        <Button onClick={onClose}>{t("back")}</Button>
      </div>
    );
  }

  const canExpand = craftingRequirementsMet(
    gameState,
    gameState.expansionRequirements
  );

  return (
    <ExpansionRequirements
      inventory={gameState.inventory}
      bumpkin={gameState.bumpkin as Bumpkin}
      details={{
        description: translate("landscape.expansion.one"),
      }}
      requirements={expansionRequirements({
        level: (gameState.inventory["Basic Land"]?.toNumber() ?? 0) + 1,
        game: gameState,
      })}
      actionView={
        <Button onClick={onExpand} disabled={!canExpand}>
          {t("expand")}
        </Button>
      }
    />
  );
};
