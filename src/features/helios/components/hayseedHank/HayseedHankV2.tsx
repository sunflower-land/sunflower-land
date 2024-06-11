import React, { useContext, useState } from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES, acknowledgedNPCs, acknowledgeNPC } from "lib/npcs";
import { ChoreV2 } from "./components/ChoreV2";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { getSeasonalTicket } from "features/game/types/seasons";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import { SquareIcon } from "components/ui/SquareIcon";
import { InnerPanel, OuterPanel } from "components/ui/Panel";

// UTC
export function secondsTillReset() {
  const currentTime = Date.now();

  // Calculate the time until the next day in milliseconds
  const nextDay = new Date(currentTime);
  nextDay.setUTCHours(24, 0, 0, 0);
  const timeUntilNextDay = nextDay.getTime() - currentTime;

  // Convert milliseconds to seconds
  const secondsUntilNextDay = Math.floor(timeUntilNextDay / 1000);

  return secondsUntilNextDay;
}

interface Props {
  onClose: () => void;
}

const _farmId = (state: MachineState) => state.context.farmId;

export const HayseedHankV2: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [introDone, setIntroDone] = useState(!!acknowledgedNPCs()["hank"]);
  const farmId = useSelector(gameService, _farmId);
  const { ticketTasksAreFrozen } = getSeasonChangeover({
    id: farmId,
  });

  if (!introDone) {
    return (
      <SpeakingModal
        bumpkinParts={NPC_WEARABLES["hank"]}
        message={[
          {
            text: translate("hayseedHankv2.greeting"),
          },
          {
            text: translate("hayseedHankv2.dialog2", {
              seasonalTicket: getSeasonalTicket(),
            }),
            actions: [
              {
                text: translate("hayseedHankv2.action"),
                cb: () => {
                  setIntroDone(true);
                  acknowledgeNPC("hank");
                },
              },
            ],
          },
        ]}
        onClose={onClose}
      />
    );
  }

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.hank}
      onClose={onClose}
      container={OuterPanel}
    >
      <div className="px-1.5 mb-2 flex w-full h-8 items-center">
        <p>{t("hayseedHankv2.title")}</p>
      </div>
      <div
        className="scrollable overflow-y-auto overflow-x-hidden pr-1"
        style={{ maxHeight: "350px" }}
      >
        <InnerPanel className="mb-1">
          <div className="divide-brown-600">
            {ticketTasksAreFrozen && (
              <div
                style={{
                  minHeight: "65px",
                }}
                className="px-1.5 mb-2"
              >
                <InlineDialogue
                  trail={25}
                  // key={(game.npcs?.[name]?.friendship?.points ?? 0).toString()}
                  message={`Well shucks, looks like we're all caught up for today. Take yourself a little breather and enjoy the rest of the day!`}
                />
              </div>
            )}
            {!ticketTasksAreFrozen && (
              <div className="space-y-1 mb-2">
                <div className="flex items-center space-x-1 px-1.5">
                  <SquareIcon
                    icon={SUNNYSIDE.icons.timer}
                    width={5}
                    className="mt-0.5"
                  />
                  <span className="text-xs">{`${t(
                    "hayseedHankv2.newChoresAvailable"
                  )} ${secondsToString(secondsTillReset(), {
                    length: "full",
                  })}`}</span>
                </div>
                <div className="flex items-center space-x-1 px-1.5">
                  <SquareIcon
                    icon={SUNNYSIDE.icons.heart}
                    width={5}
                    className="mt-0.5"
                  />
                  <span className="text-xs">
                    {t("hayseedHankv2.skipChores")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </InnerPanel>
        <ChoreV2 />
      </div>
    </CloseButtonPanel>
  );
};
