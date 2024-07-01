import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
import { ChoreV2 } from "features/helios/components/hayseedHank/components/ChoreV2";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import { secondsToString } from "lib/utils/time";
import React from "react";

interface Props {
  farmId: number;
}

export const Chores: React.FC<Props> = ({ farmId }) => {
  const { t } = useAppTranslation();

  const { ticketTasksAreFrozen } = getSeasonChangeover({
    id: farmId,
  });

  return (
    <div className="scrollable overflow-y-auto max-h-[100%] overflow-x-hidden">
      <InnerPanel className="mb-1">
        {!ticketTasksAreFrozen && (
          <div className="p-1 text-xs">
            <div className="flex justify-between items-center">
              <Label type="default">{t("chores")}</Label>
              <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                {`${t("hayseedHankv2.newChoresAvailable")} ${secondsToString(
                  secondsTillReset(),
                  {
                    length: "short",
                  },
                )}`}
              </Label>
            </div>
            <div className="my-1 space-y-1">
              <span className="w-fit">{t("chores.intro")}</span>
            </div>
          </div>
        )}
      </InnerPanel>
      <ChoreV2 isReadOnly isCodex />
    </div>
  );
};
