import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import lock from "assets/skills/lock.png";
import vipIcon from "assets/icons/vip.webp";
import { hasFeatureAccess } from "lib/flags";
import { TEST_FARM } from "../lib/constants";

interface VIPAccessProps {
  isVIP: boolean;
  onUpgrade: () => void;
}

export const VIPAccess: React.FC<VIPAccessProps> = ({ onUpgrade, isVIP }) => {
  const { t } = useAppTranslation();

  if (!isVIP && !hasFeatureAccess(TEST_FARM, "BANNER_SALES")) {
    return (
      <Label type="warning" icon={vipIcon} secondaryIcon={lock}>
        {/** This string will disappear May 1st */}
        {`VIP Access available May 1st`}
      </Label>
    );
  }

  return isVIP ? (
    <Label
      type="success"
      icon={vipIcon}
      secondaryIcon={SUNNYSIDE.icons.confirm}
      className="whitespace-nowrap"
    >
      {t("vipAccess")}
    </Label>
  ) : (
    <Label
      type="warning"
      icon={vipIcon}
      secondaryIcon={SUNNYSIDE.ui.add_button}
      onClick={onUpgrade}
      className="whitespace-nowrap"
    >
      {t("goblinTrade.vipRequired")}
    </Label>
  );
};
