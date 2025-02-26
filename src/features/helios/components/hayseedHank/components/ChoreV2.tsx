import { useSelector } from "@xstate/react";
import React, { useContext, useEffect } from "react";

import { Context } from "features/game/GameProvider";

import { getKeys } from "features/game/types/craftables";
import { DailyChore } from "./DailyChore";
import { acknowledgeChores } from "../lib/chores";
import { getChapterChangeover } from "lib/utils/getChapterWeek";
import { secondsToString } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { InnerPanel } from "components/ui/Panel";
import lock from "assets/icons/lock.png";

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

  const { tasksStartAt, tasksCloseAt, ticketTasksAreFrozen } =
    getChapterChangeover({ id: gameService.state.context.farmId });
  return (
    <>
      {ticketTasksAreFrozen && (
        <InnerPanel className="flex flex-col mb-1">
          <p className="text-xxs">{t("chores.choresFrozen")}</p>
          <Label type="danger" className="ml-0.5" icon={lock}>
            {secondsToString((tasksStartAt - Date.now()) / 1000, {
              length: "full",
            })}
          </Label>
        </InnerPanel>
      )}
      {!ticketTasksAreFrozen && (
        <div className="flex flex-col space-y-1">
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
