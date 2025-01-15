import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
import { ChoreV2 } from "features/helios/components/hayseedHank/components/ChoreV2";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import { secondsToString } from "lib/utils/time";
import React, { useContext } from "react";

import lock from "assets/icons/lock.png";
import { KingdomChores } from "features/world/ui/factions/chores/KingdomChoresCodex";

const _kingdomChores = (state: MachineState) =>
  state.context.state.kingdomChores;

interface Props {
  farmId: number;
}

export const Chores: React.FC<Props> = ({ farmId }) => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const { ticketTasksAreFrozen, ticketTasksAreClosing, tasksCloseAt } =
    getSeasonChangeover({
      id: farmId,
    });

  const kingdomChores = useSelector(gameService, _kingdomChores);
  const joinedFaction = gameService.state.context.state.faction;

  return (
    <div className="scrollable overflow-y-auto max-h-[100%] overflow-x-hidden">
      {!ticketTasksAreFrozen && (
        <InnerPanel className="mb-1 w-full">
          <div className="p-1 text-xs">
            <div className="flex justify-between items-center gap-1">
              <Label type="default">{t("chores.hank")}</Label>
              {ticketTasksAreClosing ? (
                <Label type="danger" icon={lock} className="mt-1">
                  {`${secondsToString((tasksCloseAt - Date.now()) / 1000, {
                    length: "medium",
                  })} left`}
                </Label>
              ) : (
                <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                  {t("hayseedHankv2.newChoresAvailable", {
                    timeLeft: secondsToString(secondsTillReset(), {
                      length: "medium",
                      removeTrailingZeros: true,
                    }),
                  })}
                </Label>
              )}
            </div>
            <div className="my-1 space-y-1">
              <span className="w-fit">{t("chores.hank.intro")}</span>
            </div>
          </div>
        </InnerPanel>
      )}
      <ChoreV2 isReadOnly isCodex />
      {!!joinedFaction && kingdomChores && <KingdomChores />}
    </div>
  );
};
