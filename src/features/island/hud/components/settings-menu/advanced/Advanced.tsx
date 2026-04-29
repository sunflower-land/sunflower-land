import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Context as GameContext } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { ContentComponentProps } from "../GameOptions";
import lockIcon from "assets/icons/lock.png";

const _canRefresh = (state: MachineState) => !state.context.state.transaction;
const _hideRefresh = (state: MachineState) => !state.context.nftId;

export const Advanced: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
  onClose,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(GameContext);

  const canRefresh = useSelector(gameService, _canRefresh);
  const hideRefresh = useSelector(gameService, _hideRefresh);

  const refreshSession = () => {
    gameService.send("RESET");
    onClose();
  };

  return (
    <div className="flex flex-col gap-1">
      <Button onClick={() => onSubMenuClick("blockchain")}>
        <span>{t("gameOptions.blockchainSettings")}</span>
      </Button>
      <Button onClick={() => onSubMenuClick("amoy")}>
        <span>{t("gameOptions.developerOptions")}</span>
      </Button>
      {!hideRefresh && (
        <Button
          onClick={refreshSession}
          disabled={!canRefresh}
          className="relative"
        >
          {t("gameOptions.blockchainSettings.refreshChain")}
          {!canRefresh && (
            <img src={lockIcon} className="absolute right-1 top-0.5 h-7" />
          )}
        </Button>
      )}
    </div>
  );
};
