import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { WalletContext } from "../WalletProvider";
import classNames from "classnames";
import { pixelGrayBorderStyle } from "features/game/lib/style";
import { useGame } from "features/game/GameProvider";
import { isRonin } from "../lib/ronin";
import { CONFIG } from "lib/config";

export const PolygonRequired: React.FC<{
  canContinue: boolean;
}> = ({ canContinue }) => {
  const { t } = useAppTranslation();
  const { walletService } = useContext(WalletContext);

  const doContinue = () => {
    walletService.send({
      type: "SWITCH_NETWORK",
      chainId: CONFIG.POLYGON_CHAIN_ID as 137 | 80002,
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

          {/* <div className="flex gap-2">
            <img
              src={SUNNYSIDE.icons.roninIcon}
              style={{ width: `${PIXEL_SCALE * 8}px`, display: "inline" }}
            />
            <p className="text-xs">{t("polygon.roninDescription")}</p>
          </div> */}
          {canContinue && (
            <p className="text-xs">{t("polygon.continueDescription")}</p>
          )}
          {!canContinue && (
            <p className="text-xs">{t("polygon.cantContinueDescription")}</p>
          )}
        </div>
      </div>
      <div className="flex justify-evenly space-x-1">
        <Button onClick={doContinue} className="text-sm relative">
          <div className="text-center whitespace-nowrap">
            {canContinue ? t("statements.switchToPolygon") : t("back")}
          </div>
        </Button>
      </div>
    </>
  );
};

export const RoninSupportWidget: React.FC = () => {
  const [showMessage, setShowMessage] = useState(true);

  const { gameState } = useGame();
  const { t } = useAppTranslation();

  const isRoninUser = isRonin({ game: gameState.context.state });

  if (!isRoninUser || !showMessage) {
    return null;
  }

  return (
    <div
      className={classNames(
        `w-full justify-center items-center flex  text-xs p-1 pr-4 mt-1 relative`,
      )}
      style={{
        background: "#c0cbdc",
        color: "#181425",
        ...pixelGrayBorderStyle,
      }}
    >
      <img src={SUNNYSIDE.icons.heart} className="w-8 mr-2" />
      <p className="text-xs flex-1">{t("ronin.comingSoon")}</p>
      <img
        src={SUNNYSIDE.icons.close}
        className="absolute right-2 top-1 w-5 cursor-pointer"
        onClick={() => setShowMessage(false)}
      />
    </div>
  );
};
