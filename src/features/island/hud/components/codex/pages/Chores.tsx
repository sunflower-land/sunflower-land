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
      <div className="p-1 text-xxs sm:text-xs">
        <Label type="default">{t("chores")}</Label>
        <div className="my-1 space-y-1">
          <div className="flex items-center">
            <div className="w-7">
              <img src={SUNNYSIDE.icons.heart} className="object-fit w-4 h-4" />
            </div>
            <span className="w-fit">{t("chores.intro")}</span>
          </div>
          <div className="flex items-center">
            <div className="w-7">
              <img src={SUNNYSIDE.icons.timer} className="object-fit h-4 " />
            </div>
            <span className="w-fit">{`${t(
              "hayseedHankv2.newChoresAvailable"
            )} ${secondsToString(secondsTillReset(), {
              length: "full",
            })}.`}</span>
          </div>
          <div className="flex items-center">
            <div className="w-7">
              <img src={SUNNYSIDE.icons.heart} className="object-fit w-4 h-4" />
            </div>
            <span className="w-fit">{t("hayseedHankv2.skipChores")}</span>
          </div>
        </div>
      </div>
      <ChoreV2 isReadOnly />
    </>
  );
};
