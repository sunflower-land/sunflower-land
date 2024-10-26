import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";

interface Props {
  message?: string;
}
export const Forbidden: React.FC<Props> = ({ message }) => {
  const { authService } = useContext(Auth.Context);
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col items-center text-center p-2">
      <span>
        {t("forbidden")}
        {"!"}
      </span>
      <img
        src={SUNNYSIDE.npcs.suspiciousGoblin}
        alt="Warning"
        className="w-16 m-2"
      />
      <span className="text-xs mt-2 mb-2">
        {t("error.forbidden.goblinVillage")}
      </span>
      <Label type="danger" icon={SUNNYSIDE.icons.lock}>
        <span className="text-xs">{message}</span>
      </Label>
    </div>
  );
};
