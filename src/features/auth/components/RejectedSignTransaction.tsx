import React from "react";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onTryAgain: () => void;
}

export const RejectedSignTransaction: React.FC<Props> = ({ onTryAgain }) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="flex flex-col items-center p-2">
        <div className="flex mb-3 items-center">
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            alt="Warning"
            className="w-3 mr-3"
          />
        </div>
        <p className="mb-3 text-center">{t("transaction.rejected")}</p>

        <p className="mb-4 text-xs">
          {t("transaction.message0")}{" "}
          <a
            className="underline"
            href="https://docs.sunflower-land.com/support/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("rules.termsOfService")}
          </a>
          {"."}
        </p>
        <p className="mb-4 text-xs">{t("transaction.noFee")}</p>
      </div>
      <Button onClick={onTryAgain}>{t("try.again")}</Button>
    </>
  );
};
