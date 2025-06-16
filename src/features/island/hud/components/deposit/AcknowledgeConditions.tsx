import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { useTranslation } from "react-i18next";
import flowerIcon from "assets/icons/flower_token.webp";
import { ButtonPanel } from "components/ui/Panel";

export const AcknowledgeConditions: React.FC<{
  depositAddress?: string;
  setAcknowledged: (acknowledged: boolean) => void;
}> = ({ depositAddress, setAcknowledged }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex mb-2 flex-col p-2 pt-0 mt-1 text-xxs sm:text-xs">
        <div className="w-full flex gap-1 h-8">
          <div className="w-6 flex items-center justify-center">
            <img
              src={SUNNYSIDE.icons.expression_alerted}
              className="object-contain h-5"
            />
          </div>
          <div className="w-[90%] flex items-center">
            <span>{t("deposit.flower.onlyDeposit")}</span>
          </div>
        </div>
        <div className="w-full flex gap-1 h-8">
          <div className="w-6 flex items-center justify-center">
            <img src={flowerIcon} className="object-contain w-5" />
          </div>
          <div className="w-[90%] flex items-center">
            <span>{t("deposit.flower.minimumDeposit")}</span>
          </div>
        </div>
        <div className="w-full flex gap-1 h-8">
          <div className="w-6 flex items-center justify-center">
            <img
              src={SUNNYSIDE.icons.stopwatch}
              className="object-contain w-5"
            />
          </div>
          <div className="w-[90%] flex items-center">
            <span>{t("deposit.flower.processingTimes")}</span>
          </div>
        </div>
      </div>

      <ButtonPanel
        disabled={!depositAddress}
        className="w-full text-center"
        onClick={() => setAcknowledged(true)}
      >
        <div className="mb-1">
          {!depositAddress
            ? t("deposit.flower.loading")
            : t("deposit.flower.iUnderstand")}
        </div>
      </ButtonPanel>
    </>
  );
};
