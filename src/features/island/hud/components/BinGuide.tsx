import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { TRASH_BIN_DAILY_LIMIT } from "features/game/events/landExpansion/collectClutter";
import { useGame } from "features/game/GameProvider";
import { getTrashBinItems } from "features/island/clutter/Clutter";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsTillReset, secondsToString } from "lib/utils/time";
import React, { useState } from "react";

interface BinGuideProps {
  onClose: () => void;
}
export const BinGuide: React.FC<BinGuideProps> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const { gameState } = useGame();
  const trashBinItems = getTrashBinItems(gameState);

  const [showBurnModal, setShowBurnModal] = useState(false);

  if (showBurnModal) {
    return (
      <>
        <div className="p-1">
          <Label type="info" className="mb-2">
            {t("coming.soon")}
          </Label>
          <p className="text-sm">
            {t("visitorGuide.binGuide.burn.description")}
          </p>
        </div>

        <div className="flex">
          <Button onClick={() => setShowBurnModal(false)}>{t("ok")}</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-1">
        <div className="flex items-center justify-between">
          <Label type="default">{t("visitorGuide.binGuide")}</Label>
          <Label
            type={trashBinItems >= TRASH_BIN_DAILY_LIMIT ? "danger" : "formula"}
          >{`${trashBinItems}/${TRASH_BIN_DAILY_LIMIT}`}</Label>
        </div>
        <p className="text-sm my-1">{t("visitorGuide.binGuide.description")}</p>

        <div className="flex items-center">
          <img src={SUNNYSIDE.icons.stopwatch} className="h-6 mr-2" />
          <p className="text-xs my-2">
            {t("visitorGuide.binGuide.reset", {
              time: secondsToString(secondsTillReset(), { length: "short" }),
            })}
          </p>
        </div>
      </div>
      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          {t("close")}
        </Button>
        <Button onClick={() => setShowBurnModal(true)}>
          {t("visitorGuide.binGuide.burn")}
        </Button>
      </div>
    </>
  );
};
