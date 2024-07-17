import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import vipIcon from "assets/icons/vip.webp";

interface VIPAccessProps {
  isVIP: boolean;
  onUpgrade: () => void;
  text?: string;
}

export const VIPAccess: React.FC<VIPAccessProps> = ({
  onUpgrade,
  isVIP,
  text,
}) => {
  const { t } = useAppTranslation();

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
      {text ?? t("goblinTrade.vipRequired")}
    </Label>
  );
};
