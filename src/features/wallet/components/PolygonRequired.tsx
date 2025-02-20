import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { WalletContext } from "../WalletProvider";

export const PolygonRequired: React.FC<{
  canContinue: boolean;
}> = ({ canContinue }) => {
  const { t } = useAppTranslation();
  const { walletService } = useContext(WalletContext);

  const doContinue = () => {
    walletService.send({
      type: "CONTINUE",
    });
  };

  return (
    <>
      <div className="p-2">
        <Label
          type="formula"
          icon={SUNNYSIDE.icons.polygonIcon}
          className="mb-2"
        >
          {t("polygon.required")}
        </Label>
        <div className="flex flex-col gap-2">
          <p className="text-xs">{t("polygon.requiredDescription")}</p>

          <div className="flex gap-2">
            <img
              src={SUNNYSIDE.icons.roninIcon}
              style={{ width: `${PIXEL_SCALE * 8}px`, display: "inline" }}
            />
            <p className="text-xs">{t("polygon.roninDescription")}</p>
          </div>
          {canContinue && (
            <p className="text-xs">{t("polygon.continueDescription")}</p>
          )}
          {!canContinue && (
            <p className="text-xs">{t("polygon.cantContinueDescription")}</p>
          )}
        </div>
      </div>
      <div className="flex justify-evenly space-x-1">
        <Button onClick={doContinue} className="py-2 text-sm relative">
          <div className="text-center whitespace-nowrap">
            {canContinue ? t("statements.switchToPolygon") : t("back")}
          </div>
        </Button>
      </div>
    </>
  );
};
