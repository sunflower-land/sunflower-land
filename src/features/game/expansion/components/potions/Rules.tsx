import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { FeedbackIcons } from "./lib/types";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onDone: () => void;
}

export const Rules: React.FC<Props> = ({ onDone }) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2 pt-0 flex flex-col h-full mt-2">
        <div className="text-[16px] leading-4 space-y-2 mb-3 -mt-2">
          <p>{t("rules.gameStart")}</p>
          <p>{t("statements.potionRule.one")}</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>{t("statements.potionRule.two")}</li>
            <li>{t("statements.potionRule.three")}</li>
            <li>{t("rules.chaosPotionRule")}</li>
            <li>{t("statements.potionRule.four")}</li>
          </ol>
        </div>
        <InnerPanel className="text-xxs space-y-1 p-1 mt-1">
          <p className="mb-2">
            {t("pay.attention.feedback")}
            {":"}
          </p>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["correct"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>{t("statements.potionRule.five")}</span>
          </div>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["almost"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>{t("statements.potionRule.six")}</span>
          </div>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["incorrect"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>{t("statements.potionRule.seven")}</span>
          </div>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["bomb"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>{t("introPage.chaosPotion")}</span>
          </div>
        </InnerPanel>
      </div>
      <Button onClick={onDone}>{t("gotIt")}</Button>
    </>
  );
};
