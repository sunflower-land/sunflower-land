import React, { useState } from "react";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export type JiggerStatus = "VERIFY" | "PENDING" | "REJECTED";
interface Props {
  verificationUrl: string;
  status: JiggerStatus;
  onClose: () => void;
}

export const Jigger: React.FC<Props> = ({
  verificationUrl,
  status,
  onClose,
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const { t } = useAppTranslation();
  if (showWarning) {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-center">{t("proof.of.humanity")}</span>
        <img src={SUNNYSIDE.icons.expression_alerted} className="w-6 mt-2" />
        <span className="text-sm mt-2 mb-2">
          {t("statements.jigger.one")}
        </span>

        <div className="flex w-full">
          <Button
            onClick={() => {
              window.location.href = verificationUrl as string;
            }}
          >
            {t("continue")}
          </Button>
        </div>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-center">{t("uhOh")}</span>
        <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
        <span className="text-sm mt-2 mb-2">
          {t("statements.jigger.two")}
        </span>
        <span className="text-sm mt-2 mb-2">
          {t("statements.jigger.three")}
        </span>
        <span className="text-sm mt-2 mb-2">
          {t("statements.jigger.four")}
        </span>
        <div className="flex w-full">
          <Button className="mr-2" onClick={onClose}>
            {t("close")}
          </Button>
        </div>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-center">{t("uhOh")}</span>
        <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
        <span className="text-sm mt-2 mb-2">
          {t("statements.jigger.five")}
        </span>
        <span className="text-sm mt-2 mb-2">
          {t("statements.jigger.three")}
        </span>
        <span className="text-sm mt-2 mb-2">{t("statements.patience")}</span>
        <div className="flex w-full">
          <Button className="mr-2" onClick={onClose}>
            {t("close")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center">{t("uhOh")}</span>
      <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
      <span className="text-sm mt-2 mb-2">
        {t("statements.jigger.six")}
      </span>
      <span className="text-sm mt-2 mb-2">
        {t("statements.jigger.seven")}
      </span>
      <div className="flex w-full">
        <Button className="mr-2" onClick={onClose}>
          {t("close")}
        </Button>
        <Button onClick={() => setShowWarning(true)}>{t("verify")}</Button>
      </div>
    </div>
  );
};
