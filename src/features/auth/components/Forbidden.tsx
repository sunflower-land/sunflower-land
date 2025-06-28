import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}
export const Forbidden: React.FC<Props> = ({ onClose }) => {
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
      <Button className="mt-2" onClick={onClose}>
        {t("back")}
      </Button>
    </div>
  );
};
