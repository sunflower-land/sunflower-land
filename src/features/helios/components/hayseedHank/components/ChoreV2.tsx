import { useActor } from "@xstate/react";
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

interface Props {
  /** Is used to identify whether the chores are displayed in the codex or not. The codex requires smaller text sizes. */
  isCodex?: boolean;
  isReadOnly?: boolean;
}
export const ChoreV2: React.FC<Props> = ({
  isReadOnly = false,
  isCodex = false,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const chores = gameState.context.state.chores;
  const { t } = useAppTranslation();

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

  const { tasksAreClosing, tasksStartAt, tasksCloseAt, tasksAreFrozen } =
    getSeasonChangeover({ id: gameService.state.context.farmId });
  return (
    <>
      {
        // Give 24 hours heads up before tasks close
        tasksAreClosing && (
          <div className="flex flex-col items-center mb-2">
            <p className="text-xs text-center">{t("chores.newSeason")}</p>
            <Label type="info" icon={SUNNYSIDE.icons.timer} className="mt-1">
              {secondsToString((tasksCloseAt - Date.now()) / 1000, {
                length: "full",
              })}
            </Label>
          </div>
        )
      }
      {tasksAreFrozen && (
        <div className="flex flex-col items-center mb-2">
          <p className="text-xs text-center">{t("chores.choresFrozen")}</p>
          <Label
            type="danger"
            icon={SUNNYSIDE.icons.stopwatch}
            className="mt-1"
          >
            {secondsToString((tasksStartAt - Date.now()) / 1000, {
              length: "full",
            })}
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
    </>
  );
};
