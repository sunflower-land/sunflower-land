import React, { useContext } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { secondsToString } from "lib/utils/time";
import coins from "assets/icons/coins.webp";
import { Label } from "components/ui/Label";
import { PortalMachineState } from "../../lib/halloweenMachine";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";

const _dailyHighscore = (state: PortalMachineState) => {
  const dateKey = new Date().toISOString().slice(0, 10);
  const minigame = state.context.state?.minigames.games["halloween"];
  const history = minigame?.history ?? {};

  return history[dateKey]?.highscore ?? 0;
};
const _prize = (state: PortalMachineState) => {
  return state.context.state?.minigames.prizes["halloween"];
};

export const HalloweenPrize: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const { t } = useAppTranslation();

  const prize = useSelector(
    portalService,
    _prize,
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next),
  );
  const dailyHighscore = useSelector(portalService, _dailyHighscore);

  if (!prize) {
    return (
      <OuterPanel>
        <div className="px-1">
          <Label type="danger" icon={SUNNYSIDE.icons.sad}>
            {t("halloween.noPrizesAvailable")}
          </Label>
        </div>
      </OuterPanel>
    );
  }

  const isComplete = dailyHighscore > prize.score;
  const secondsLeft = (prize.endAt - Date.now()) / 1000;

  return (
    <OuterPanel>
      <div className="px-1">
        <span className="text-xs mb-2">
          {t("halloween.portal.missionObjectives", {
            targetScore: secondsToString(prize.score, {
              length: "full",
            }),
          })}
        </span>
        <div className="flex justify-between mt-2 flex-wrap">
          {isComplete ? (
            <Label type="success" icon={SUNNYSIDE.icons.confirm}>
              {t("halloween.completed")}
            </Label>
          ) : (
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {secondsToString(secondsLeft, { length: "medium" })}
            </Label>
          )}
          <div className="flex items-center space-x-2">
            {!!prize.coins && (
              <Label icon={coins} type="warning">
                {prize.coins}
              </Label>
            )}
          </div>
        </div>
      </div>
    </OuterPanel>
  );
};
