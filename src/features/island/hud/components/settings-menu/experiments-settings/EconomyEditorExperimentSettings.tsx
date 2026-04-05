import { Button } from "components/ui/Button";
import Switch from "components/ui/Switch";
import { Context as GameContext } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { ContentComponentProps } from "../GameOptions";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useVisiting } from "lib/utils/visitUtils";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "@xstate/react";

const _gameState = (state: MachineState) => state.context.state;

export const EconomyEditorExperimentSettings: React.FC<
  ContentComponentProps
> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { gameService, setFromRoute } = useContext(GameContext);
  const { isVisiting } = useVisiting();
  const navigate = useNavigate();
  const gameState = useSelector(gameService, _gameState);

  const enabled = !!gameState.settings.economiesEnabled;

  const onToggle = () => {
    gameService.send({
      type: "economies.enabled",
      enabled: !enabled,
    });
  };

  const handleOpenEconomyEditor = () => {
    onClose();
    setFromRoute(window.location.hash.replace("#", "") || "/");
    navigate("/economy-editor");
  };

  return (
    <div className="flex flex-col gap-3 m-1 min-h-[200px] content-start">
      <p className="text-sm text-start opacity-90">
        {t("gameOptions.generalSettings.playerEconomiesDescription")}
      </p>
      <div className="rounded-md border-2 border-amber-800/70 bg-stone-950/35 p-3 space-y-3">
        <p className="text-xxs text-start leading-snug text-amber-100/95 italic">
          {t("gameOptions.experiments.economyEditorDisclaimer")}
        </p>
        <Switch
          checked={enabled}
          onChange={onToggle}
          disabled={isVisiting}
          label={t("gameOptions.generalSettings.playerEconomiesToggle")}
        />
      </div>
      {enabled ? (
        <Button className="self-start" onClick={handleOpenEconomyEditor}>
          <span>{t("gameOptions.experiments.openEconomyEditor")}</span>
        </Button>
      ) : null}
    </div>
  );
};
