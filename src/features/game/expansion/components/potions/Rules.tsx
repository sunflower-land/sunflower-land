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
    // Translation needed for lines 19-21, 29, 39, 49, 59, 69, 75
    <>
      <div className="p-2 pt-0 flex flex-col h-full mt-2">
        <div className="text-[16px] leading-4 space-y-2 mb-3 -mt-2">
          <p>
            {`At the beginning of the game, the plant will randomly pick a
            combination of 4 potions and 1 "chaos" potion. The combination can be all different or all the
            same.`}
          </p>
          <p>{t("statements.potionRule.one")}</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>{t("statements.potionRule.two")}</li>
            <li>{t("statements.potionRule.three")}</li>
            <li>{`If you add the "chaos" potion your score for that attempt will be 0.`}</li>
            <li>{t("statements.potionRule.four")}</li>
          </ol>
        </div>
        <InnerPanel className="text-xxs space-y-1 p-1 mt-1">
          <p className="mb-2">{`Pay attention to the feedback icons:`}</p>
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
            <span>{`Beware the "chaos" potion, it shakes things up!`}</span>
          </div>
        </InnerPanel>
      </div>
      <Button onClick={onDone}>{t("gotIt")}</Button>
    </>
  );
};
