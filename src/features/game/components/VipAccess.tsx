import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label, LabelType } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import vipIcon from "assets/icons/vip.webp";

interface VIPAccessProps {
  isVIP: boolean;
  onUpgrade: () => void;
  text?: string;
  labelType?: LabelType;
}

export const VIPAccess: React.FC<VIPAccessProps> = ({
  onUpgrade,
  isVIP,
  text,
  labelType,
}) => {
  const { t } = useAppTranslation();

  return isVIP ? (
    <Label
      className="mb-1 whitespace-nowrap"
      icon={vipIcon}
      type="success"
      secondaryIcon={SUNNYSIDE.icons.confirm}
    >
      {t("vipAccess")}
    </Label>
  ) : (
    <Label
      type={labelType ?? "warning"}
      icon={vipIcon}
      secondaryIcon={SUNNYSIDE.ui.add_button}
      onClick={onUpgrade}
      className="mb-1 whitespace-nowrap"
    >
      {text ?? t("goblinTrade.vipRequired")}
    </Label>
  );
};
