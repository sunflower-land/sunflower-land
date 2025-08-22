import React from "react";

import potIcon from "assets/icons/pot.png";
import helpIcon from "assets/icons/help.webp";
import helpedIcon from "assets/icons/helped.webp";
import { InfoPopover } from "features/island/common/InfoPopover";
import { useTranslation } from "react-i18next";

type Props = {
  helpedYouToday: boolean;
  helpedThemToday: boolean;
  hasCookingPot: boolean;
  showPopover: boolean;
  onHide: () => void;
};

export const HelpInfoPopover: React.FC<Props> = ({
  showPopover,
  onHide,
  helpedYouToday,
  helpedThemToday,
  hasCookingPot,
}) => {
  const { t } = useTranslation();

  return (
    <InfoPopover
      showPopover={showPopover}
      onHide={onHide}
      className="-bottom-3 sm:bottom-0 left-1/2 transform -translate-x-1/2 z-20 absolute"
    >
      <div className="flex flex-col gap-1">
        {helpedThemToday && (
          <div className="flex items-center gap-1">
            <img src={helpIcon} className="w-4 h-4" />
            <span className="text-xxs">{t("playerModal.youHelpedThem")}</span>
          </div>
        )}
        {helpedYouToday && (
          <div className="flex items-center gap-1">
            <img src={helpedIcon} className="w-4 h-4" />
            <span className="text-xxs">{t("playerModal.theyHelpedYou")}</span>
          </div>
        )}
        {hasCookingPot && (
          <div className="flex items-center gap-1">
            <img src={potIcon} className="w-4 h-4" />
            <span className="text-xxs">
              {t("playerModal.theyHaveACookingPot")}
            </span>
          </div>
        )}
      </div>
    </InfoPopover>
  );
};
