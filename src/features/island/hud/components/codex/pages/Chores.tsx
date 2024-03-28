import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
import { ChoreV2 } from "features/helios/components/hayseedHank/components/ChoreV2";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";
import React from "react";

export const Chores: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="p-1">
        <Label type="default">{t("chores")}</Label>
        <p className="mb-2 ml-1 text-xs"></p>
        <div className="p-1 mb-2">
          <div className="flex items-center mb-1">
            <div className="w-6">
              <img src={SUNNYSIDE.icons.heart} className="h-4 mx-auto" />
            </div>
            <span className="text-xs">{t("chores.intro")}</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-6">
              <img src={SUNNYSIDE.icons.timer} className="h-4 mx-auto" />
            </div>
            <span className="text-xs">{`${t(
              "hayseedHankv2.newChoresAvailable"
            )} ${secondsToString(secondsTillReset(), {
              length: "full",
            })}.`}</span>
          </div>
          <div className="flex items-center ">
            <div className="w-6">
              <img src={SUNNYSIDE.icons.heart} className="h-4 mx-auto" />
            </div>
            <span className="text-xs">{t("hayseedHankv2.skipChores")}</span>
          </div>
        </div>
      </div>
      <ChoreV2 isReadOnly />
    </>
  );
};
