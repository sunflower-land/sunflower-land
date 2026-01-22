import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const CrustaceanGuide = () => {
  const { t } = useAppTranslation();
  return (
    <div className="p-2">
      {SUNNYSIDE.tutorial.fishingTutorial && (
        <img
          src={SUNNYSIDE.tutorial.fishingTutorial}
          className="w-full mx-auto rounded-lg mb-2"
        />
      )}
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
    </div>
  );
};
