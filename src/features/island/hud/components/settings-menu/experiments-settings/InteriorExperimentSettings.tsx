import Switch from "components/ui/Switch";
import { Context as GameContext } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { ContentComponentProps } from "../types";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useVisiting } from "lib/utils/visitUtils";
import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

const _gameState = (state: MachineState) => state.context.state;

export const InteriorExperimentSettings: React.FC<
  ContentComponentProps
> = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(GameContext);
  const { isVisiting } = useVisiting();
  const gameState = useSelector(gameService, _gameState);

  const enabled = !!gameState.settings.interiorsEnabled;

  const onToggle = () => {
    gameService.send({
      type: "interiors.enabled",
      enabled: !enabled,
    });
  };

  return (
    <div className="flex flex-col gap-3 m-1 min-h-[200px] content-start">
      <p className="text-sm text-start opacity-90">
        {t("gameOptions.experiments.interiorsDescription")}
      </p>
      <div className="rounded-md border-2 border-amber-800/70 bg-stone-950/35 p-3 space-y-3">
        <p className="text-xxs text-start leading-snug text-amber-100/95 italic">
          {t("gameOptions.experiments.interiorsDisclaimer")}
        </p>
        <Switch
          checked={enabled}
          onChange={onToggle}
          disabled={isVisiting}
          label={t("gameOptions.experiments.interiorsToggle")}
        />
      </div>
    </div>
  );
};
