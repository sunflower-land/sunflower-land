import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CRUSTACEAN_CHUM_AMOUNTS } from "features/game/types/crustaceans";
import { getKeys } from "features/game/types/craftables";
import { Label } from "components/ui/Label";

export const CrustaceanGuide = () => {
  const { t } = useAppTranslation();
  const allChums = getKeys(CRUSTACEAN_CHUM_AMOUNTS);

  return (
    <div className="p-2">
      <div className="flex mb-2">
        <div className="w-12 flex justify-center">
          <img
            src={ITEM_DETAILS["Crab Pot"].image}
            className="h-6 mr-2 object-contain"
          />
        </div>
        <p className="text-xs flex-1">
          {t("guide.crustacean.placeTrap")}
          {"."}
        </p>
      </div>
      <div className="flex mb-2">
        <div className="w-12 flex justify-center">
          <img
            src={SUNNYSIDE.icons.timer}
            className="h-6 mr-2 object-contain"
          />
        </div>
        <p className="text-xs flex-1">
          {t("guide.crustacean.waitTime")}
          {"."}
        </p>
      </div>
      <div className="flex mb-2">
        <div className="w-12 flex justify-center">
          <img
            src={ITEM_DETAILS["Fish Stick"].image}
            className="h-6 mr-2 object-contain"
          />
        </div>
        <p className="text-xs flex-1">
          {t("guide.crustacean.useChum")}
          {"."}
        </p>
      </div>
      <div className="flex mb-2">
        <div className="w-12 flex justify-center">
          <img
            src={SUNNYSIDE.crustaceans.blueCrab}
            className="h-6 mr-2 object-contain"
          />
        </div>
        <p className="text-xs flex-1">
          {t("guide.crustacean.catchCrustaceans")}
          {"."}
        </p>
      </div>
      <div className="flex mb-2">
        <div className="w-12 flex justify-center">
          <img
            src={ITEM_DETAILS["Mariner Pot"].image}
            className="h-6 mr-2 object-contain"
          />
        </div>
        <p className="text-xs flex-1">
          {t("guide.crustacean.differentTraps")}
          {"."}
        </p>
      </div>
      <div className="mt-3 mb-2">
        <Label type="default" className="mb-2">
          {t("guide.crustacean.availableChums")}
        </Label>
        <div className="flex flex-wrap gap-1">
          {allChums.map((chum) => {
            return (
              <Label
                key={chum}
                type="chill"
                className="text-xxs mr-1"
                icon={ITEM_DETAILS[chum].image}
              >
                {`${chum} (${CRUSTACEAN_CHUM_AMOUNTS[chum]})`}
              </Label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
