import React, { useState } from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES, acknowedlgedNPCs, acknowledgeNPC } from "lib/npcs";
import { ChoreV2 } from "./components/ChoreV2";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { getSeasonalTicket } from "features/game/types/seasons";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
export const HayseedHankV2: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const [introDone, setIntroDone] = useState(!!acknowedlgedNPCs()["hank"]);

  const close = () => {
    onClose();
  };

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
              seasonalTicket: getSeasonalTicket,
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
      title={t("hayseedHankv2.title")}
      bumpkinParts={NPC_WEARABLES.hank}
      onClose={close}
    >
      <div
        style={{ maxHeight: "300px" }}
        className="overflow-y-auto pr-1  divide-brown-600 scrollable"
      >
        <div className="p-1 mb-2">
          <div className="flex items-center mb-1">
            <div className="w-6">
              <img src={SUNNYSIDE.icons.timer} className="h-4 mx-auto" />
            </div>
            <span className="text-xs">{`${t(
              "hayseedHankv2.newChoresAvailable"
            )} ${secondsToString(secondsTillReset(), {
              length: "full",
            })}`}</span>
          </div>
          <div className="flex items-center ">
            <div className="w-6">
              <img src={SUNNYSIDE.icons.heart} className="h-4 mx-auto" />
            </div>
            <span className="text-xs">{t("hayseedHankv2.skipChores")}</span>
          </div>
        </div>

        <ChoreV2 />
      </div>

      {/* {!(isSaving && isSkipping) && !!chore && Content()} */}
    </CloseButtonPanel>
  );
};
