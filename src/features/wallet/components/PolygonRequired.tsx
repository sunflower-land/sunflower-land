import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { WalletContext } from "../WalletProvider";

export const PolygonRequired: React.FC = () => {
  const { t } = useAppTranslation();
  const { walletService } = useContext(WalletContext);

  const switchToPolygon = () => {
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
          Polygon Required
        </Label>
        <div className="flex flex-col gap-2">
          <p className="text-xs">
            This interaction requires a connection to the Polygon network.
          </p>

          <div className="flex gap-2">
            <img
              src={SUNNYSIDE.icons.roninIcon}
              style={{ width: `${PIXEL_SCALE * 8}px`, display: "inline" }}
            />
            <p className="text-xs">
              Ronin support will be available for this interaction in April
              2025.
            </p>
          </div>
          <p className="text-xs">
            Switch to Polygon to continue. This may require POL on the Polygon
            Network.
          </p>
        </div>
      </div>
      <div className="flex justify-evenly space-x-1">
        <Button onClick={switchToPolygon} className="py-2 text-sm relative">
          <div className="text-center whitespace-nowrap">
            {t("statements.switchToPolygon")}
          </div>
        </Button>
      </div>
    </>
  );
};
