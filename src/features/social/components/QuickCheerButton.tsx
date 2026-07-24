import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useVisiting } from "lib/utils/visitUtils";

import cheerIcon from "assets/icons/cheer.webp";

const _farmId = (state: MachineState) => state.context.farmId;

const _hasCheersAvailable = (state: MachineState) =>
  (
    (state.context.visitorState ?? state.context.state).inventory["Cheer"] ??
    new Decimal(0)
  ).gt(0);

const _hasCheeredToday = (farmId: number) => (state: MachineState) => {
  const today = new Date().toISOString().split("T")[0];
  const { cheersGiven } = (state.context.visitorState ?? state.context.state)
    .socialFarming;

  return cheersGiven.date === today && cheersGiven.farms.includes(farmId);
};

const _isCheering = (state: MachineState) =>
  state.matches("cheeringFarm") || state.matches("cheeringFarmVisiting");

interface Props {
  farmId: number;
  className?: string;
}

/**
 * One tap cheer for the author of a showcased tweet or farm design. Unlike the
 * player modal there is no confirmation step - being quick is the whole point.
 * Renders nothing on your own posts.
 */
export const QuickCheerButton: React.FC<Props> = ({ farmId, className }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const { visitedFarmId } = useVisiting();

  const loggedInFarmId = useSelector(gameService, _farmId);
  const hasCheersAvailable = useSelector(gameService, _hasCheersAvailable);
  const hasCheeredToday = useSelector(gameService, _hasCheeredToday(farmId));
  const isCheering = useSelector(gameService, _isCheering);

  if (farmId === loggedInFarmId) return null;

  const cheer = () =>
    gameService.send("farm.cheered", {
      effect: {
        type: "farm.cheered",
        cheeredFarmId: farmId,
        visitedFarmId,
      },
    });

  return (
    <Button
      className={className ?? "w-fit h-9 px-2"}
      onClick={cheer}
      disabled={hasCheeredToday || isCheering || !hasCheersAvailable}
    >
      <div className="flex items-center justify-center gap-1">
        <img src={cheerIcon} className="w-4 h-4" />
        <span className="text-xs">
          {hasCheeredToday ? t("cheering.farm.success") : t("cheer")}
        </span>
      </div>
    </Button>
  );
};
