import React, { useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  farmId?: number;
  /** Raw browser message, e.g. "Failed to fetch" — shown in the details */
  error?: string;
  transactionId?: string;
  onAcknowledge?: () => void;
}

const useIsOnline = () => {
  const [online, setOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return online;
};

/**
 * Shown instead of the generic "Something went wrong" modal when a request
 * failed at the network level (see lib/errorLogger isNetworkError). Nothing
 * here is reported to the support tool — it's the player's connection.
 */
export const ConnectionError: React.FC<Props> = ({
  farmId,
  error,
  transactionId,
  onAcknowledge,
}) => {
  const { t } = useAppTranslation();
  const online = useIsOnline();

  return (
    <>
      <div className="p-2 py-1 space-y-2 mb-2">
        <h1 className="mb-1 text-base text-center">
          {online ? t("error.connection.title") : t("error.offline.title")}
        </h1>

        <Label type={online ? "warning" : "danger"}>
          {online ? t("error.connection.status") : t("error.offline.status")}
        </Label>

        <p>
          {online
            ? t("error.connection.description")
            : t("error.offline.description")}
        </p>

        <div className="flex flex-col w-full mb-2 text-xs overflow-hidden space-y-1">
          {farmId && (
            <p className="select-all">
              {t("farm")}
              {": "}
              {farmId}
            </p>
          )}
          {error && (
            <p className="select-all">
              {t("error")}
              {": "}
              {error}
            </p>
          )}
          {transactionId && (
            <p className="select-all">
              {t("transaction.id")} {transactionId}
            </p>
          )}
          <p>
            {t("version")}
            {": "}
            {CONFIG.RELEASE_VERSION}
          </p>
        </div>
      </div>
      {onAcknowledge && (
        <Button onClick={onAcknowledge}>{t("error.connection.retry")}</Button>
      )}
    </>
  );
};
