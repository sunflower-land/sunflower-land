import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { getSeasonalTicket } from "features/game/types/seasons";
import { ITEM_DETAILS } from "../types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import lock from "assets/skills/lock.png";

interface VIPAccessProps {
  isVIP: boolean;
  onUpgrade: () => void;
}

export const VIPAccess: React.FC<VIPAccessProps> = ({ onUpgrade, isVIP }) => {
  const { t } = useAppTranslation();

  return isVIP ? (
    <Label type="success" icon={SUNNYSIDE.icons.confirm}>
      {t("vipAccess")}
    </Label>
  ) : (
    <Label
      type="warning"
      icon={lock}
      secondaryIcon={ITEM_DETAILS[getSeasonalTicket()].image}
      onClick={onUpgrade}
    >
      {t("goblinTrade.vipRequired")}
    </Label>
  );
};
