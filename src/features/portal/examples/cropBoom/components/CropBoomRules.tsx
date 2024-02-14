import React from "react";

import tutorial from "features/portal/examples/cropBoom/assets/crop_boom-tutorial.png";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { acknowledgeCropBoomRules } from "../lib/portalMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onAcknowledged: () => void;
}
export const CropBoomRules: React.FC<Props> = ({ onAcknowledged }) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <p className="text-sm mb-2">
          {t("crop.boom.welcome")}
          {"!"}
          </p>
        <img src={tutorial} className="w-full mx-auto rounded-lg mb-2" />
        <div className="flex mb-2">
          <div className="w-12 flex justify-center">
            <img
              src={ITEM_DETAILS["Arcade Token"].image}
              className="h-6 mr-2 object-contain"
            />
          </div>
          <p className="text-xs  flex-1">
            {t("crop.boom.reachOtherSide")}
            {"."}
          </p>
        </div>
        <div className="flex mb-2">
          <div className="w-12 flex justify-center">
            <img
              src={SUNNYSIDE.icons.death}
              className="h-6 mr-2 object-contain"
            />
          </div>
          <p className="text-xs  flex-1">
            {t("crop.boom.bewareExplodingCrops")}
            {"."}
          </p>
        </div>

        <div className="flex mb-2">
          <div className="w-12 flex justify-center">
            <img
              src={SUNNYSIDE.icons.stopwatch}
              className="h-6 mr-2 object-contain"
            />
          </div>
          <p className="text-xs flex-1">
            {t("crop.boom.newPuzzleDaily")}
            {"."}
          </p>
        </div>
      </div>
      <Button
        className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
        onClick={() => {
          acknowledgeCropBoomRules();
          onAcknowledged();
        }}
      >
        {t("ok")}
      </Button>
    </>
  );
};
