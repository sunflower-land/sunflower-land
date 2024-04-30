import { useSelector } from "@xstate/react";
import React, { useContext, useEffect } from "react";

import { Context } from "features/game/GameProvider";

import { getKeys } from "features/game/types/craftables";
import { DailyChore } from "./DailyChore";
import { acknowledgeChores } from "../lib/chores";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";

import factions from "assets/icons/factions.webp";
import { hasFeatureAccess } from "lib/flags";
import { GameState } from "features/game/types/game";

interface Props {
  /** Is used to identify whether the chores are displayed in the codex or not. The codex requires smaller text sizes. */
  isCodex?: boolean;
  isReadOnly?: boolean;
}

const _chores = (state: MachineState) => state.context.state.chores;
const _faction = (state: MachineState) => state.context.state.faction;

export const ChoreV2: React.FC<Props> = ({
  isReadOnly = false,
  isCodex = false,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const chores = useSelector(gameService, _chores);
  const faction = useSelector(gameService, _faction);

  useEffect(() => {
    chores && acknowledgeChores(chores);
  }, [chores]);

  if (!chores) {
    return (
      <div className="p-2 text-sm">
        <p>{t("chores.noChore")}</p>
      </div>
    );
  }

  const {
    ticketTasksAreClosing,
    tasksStartAt,
    tasksCloseAt,
    ticketTasksAreFrozen,
  } = getSeasonChangeover({ id: gameService.state.context.farmId });
  return (
    <>
      {
        // Give 24 hours heads up before tasks close
        ticketTasksAreClosing && (
          <div className="flex flex-col mx-1.5 space-y-2 my-1">
            <p className="text-xxs">{t("chores.newSeason")}</p>
            <Label type="info" className="ml-0.5" icon={SUNNYSIDE.icons.timer}>
              {secondsToString((tasksCloseAt - Date.now()) / 1000, {
                length: "full",
              })}
            </Label>
          </div>
        )
      }
      {ticketTasksAreFrozen && (
        <div className="flex flex-col mx-1.5 space-y-2 my-1">
          <p className="text-xxs">{t("chores.choresFrozen")}</p>
          <Label
            type="danger"
            className="ml-0.5"
            icon={SUNNYSIDE.icons.stopwatch}
          >
            {secondsToString((tasksStartAt - Date.now()) / 1000, {
              length: "full",
            })}
          </Label>
        </div>
      )}
      {!ticketTasksAreFrozen && (
        <div className="flex flex-col space-y-1">
          {hasFeatureAccess({} as GameState, "FACTIONS") && !faction && (
            <div className="p-0.2 bg-brown-300 sticky z-10 -top-1">
              <Label type="danger" className="ml-3 my-1" icon={factions}>
                {t("faction.points.pledge.warning")}
              </Label>
            </div>
          )}
          {getKeys(chores.chores).map((choreId, index) => {
            const chore = chores.chores[choreId];

            // Use createdAt key, so a skip will render a new chore
            return (
              <DailyChore
                chore={chore}
                id={choreId}
                key={chore.createdAt + index}
                isReadOnly={isReadOnly}
                isCodex={isCodex}
              />
            );
          })}
        </div>
      )}
    </>
  );
};
