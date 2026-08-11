import Switch from "components/ui/Switch";
import { Context as GameContext } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { ContentComponentProps } from "../types";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

const _gameState = (state: MachineState) => state.context.state;

export const ToolShopBuyAllExperimentSettings: React.FC<
  ContentComponentProps
> = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(GameContext);
  const gameState = useSelector(gameService, _gameState);

  const enabled = gameState.settings.toolShop?.buyAllEnabled ?? true;

  const onToggle = () => {
    gameService.send({
      type: "toolShop.settingsUpdated",
      settings: {},
      buyAllEnabled: !enabled,
    });
  };

  return (
    <div className="flex flex-col gap-3 m-1 min-h-[200px] content-start">
      <p className="text-sm text-start opacity-90">
        {t("gameOptions.experiments.toolShopBuyAllDescription")}
      </p>
      <div className="rounded-md border-2 border-amber-800/70 bg-stone-950/35 p-3 space-y-3">
        <Switch
          checked={enabled}
          onChange={onToggle}
          label={t("gameOptions.experiments.toolShopBuyAllToggle")}
        />
      </div>
    </div>
  );
};
