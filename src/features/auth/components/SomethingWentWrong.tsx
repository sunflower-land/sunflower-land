import React, { useContext, useEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { CONFIG } from "lib/config";
import { createErrorLogger, isNetworkError } from "lib/errorLogger";
import { ERRORS } from "lib/errors";
import { ConnectionError } from "./ConnectionError";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SystemMessageWidget } from "features/announcements/SystemMessageWidget";
import { useNow } from "lib/utils/hooks/useNow";

function getFirstTsFileName(stackTrace: string) {
  try {
    const lines = stackTrace.split("\n");
    const tsFileRegex = /(\b\S+\.ts\S+)/;

    for (const line of lines) {
      const match = line.match(tsFileRegex);
      if (match) {
        try {
          // Extract and return only the filename portion
          const url = new URL(match[1]);
          return url.pathname.split("/").pop();
        } catch (e) {
          // Handle cases where URL parsing fails
          return match[1].split("/").pop();
        }
      }
    }
  } catch (e) {
    // Handle any unexpected errors
    // eslint-disable-next-line no-console
    console.error("Error processing stack trace:", e);
  }

  return null; // Return null if no .ts* file is found
}

interface BoundaryErrorProps {
  farmId?: number;
  error?: string;
  stack?: string;
  transactionId?: string;
  /** errorId the API returned for the failed request, if any. */
  errorId?: string;
  /** Failed endpoint, e.g. "GET /marketplace". */
  endpoint?: string;
  /** HTTP status of the failed request. */
  status?: number;
  /** Extra context from the failed request (filters, signer state, …). */
  meta?: Record<string, unknown>;
  onAcknowledge?: () => void;
}

/*
 * This component should not hook into the state machines. It is used
 * to display errors that may occur outside of the state machines.
 */
export const BoundaryError: React.FC<BoundaryErrorProps> = ({
  farmId,
  error,
  transactionId,
  errorId,
  endpoint,
  status,
  meta,
  onAcknowledge,
  stack,
}) => {
  const [showGetHelp, setShowGetHelp] = useState(false);
  const now = useNow();
  const [date] = useState(new Date(now).toISOString());
  const { t } = useAppTranslation();

  useEffect(() => {
    // Known backend rejections and network failures are filtered inside the logger.
    const errorLogger = createErrorLogger("react_error_modal", farmId ?? 0);
    errorLogger({
      error,
      transactionId,
      errorId,
      endpoint,
      status,
      stack,
      meta: { date, ...meta },
    });
  }, []);

  // "Failed to fetch" & friends: the request never reached the server. Tell
  // the player it's their connection rather than "something went wrong".
  if (isNetworkError(error)) {
    return (
      <ConnectionError
        farmId={farmId}
        error={error}
        transactionId={transactionId}
        onAcknowledge={onAcknowledge}
      />
    );
  }

  // A 401 on a read: the JWT expired while the tab sat open, or the player
  // signed out elsewhere. "Something went wrong" is misleading — and the
  // logger deliberately doesn't report these, so the modal has to say it.
  if (error === ERRORS.UNAUTHORIZED) {
    return (
      <>
        <div className="p-2 py-1 space-y-2 mb-2">
          <h1 className="text-base text-center">{t("session.expired")}</h1>
          <p className="text-xs">{t("statements.session.expired")}</p>
        </div>
        {onAcknowledge && (
          <Button onClick={onAcknowledge}>{t("refresh")}</Button>
        )}
      </>
    );
  }

  if (error?.includes("Returned values aren't valid")) {
    return (
      <>
        <div className="p-2 py-1 space-y-2 mb-2">
          <h1 className="text-base text-center">{t("error.ClientRPC")}</h1>
          <p>{t("error.polygonRPC")}</p>
        </div>
        {onAcknowledge && (
          <Button onClick={onAcknowledge}>{t("refresh")}</Button>
        )}
      </>
    );
  }

  const handleAskOnDiscord = () => {
    window.open(
      "https://discord.gg/sunflowerland",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const tsFileName = stack ? getFirstTsFileName(stack) : null;

  return showGetHelp ? (
    <div className="relative">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        className="h-6 mr-2 cursor-pointer absolute top-1 left-1"
        onClick={() => setShowGetHelp(false)}
      />
      <div className="p-2 py-1 space-y-2 mb-2">
        <h1 className="text-base text-center">{t("error.getHelp")}</h1>
        <p>{t("error.connection.three")}</p>
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
          {endpoint && (
            <p className="select-all">
              {endpoint}
              {status ? ` (${status})` : ""}
            </p>
          )}
          <p className="select-all">
            {t("date")}
            {": "}
            {date}
          </p>
          {transactionId && (
            <p>
              <span className="select-all">
                {t("transaction.id")} {transactionId}
              </span>
            </p>
          )}
          {tsFileName && (
            <p>
              {t("error.file")}
              {": "}
              {tsFileName}
            </p>
          )}
          <p>
            {t("version")}
            {": "}
            {CONFIG.RELEASE_VERSION}
          </p>
        </div>
      </div>
      <Button onClick={handleAskOnDiscord}>{t("error.askOnDiscord")}</Button>
    </div>
  ) : (
    <>
      <div className="p-2 py-1 space-y-2 mb-2">
        <h1 className="mb-1 text-base text-center">{t("error.wentWrong")}</h1>
        <p>{t("error.connection.one")}</p>

        <div className="flex flex-col w-full mb-2 text-xs overflow-hidden space-y-1 ">
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
          <p className="select-all">
            {t("date")}
            {": "}
            {date}
          </p>
          {transactionId && (
            <p>
              <span className="select-all">
                {t("transaction.id")} {transactionId}
              </span>
            </p>
          )}
          {tsFileName && (
            <p>
              {t("error.file")}
              {": "}
              {tsFileName}
            </p>
          )}
          <p>
            {t("version")}
            {": "}
            {CONFIG.RELEASE_VERSION}
          </p>
        </div>
        <p
          onClick={() => setShowGetHelp(true)}
          className="underline text-xs cursor-pointer"
        >
          {t("error.connection.two")}
        </p>
      </div>
      {onAcknowledge && <Button onClick={onAcknowledge}>{t("refresh")}</Button>}

      <SystemMessageWidget />
    </>
  );
};

export const SomethingWentWrong: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);

  // If we get a connecting error before the game has loaded then try to connect again via the authService
  const service = gameService ?? authService;
  const id = service.state?.context?.farmId;

  const [
    {
      context: { transactionId, errorCode },
    },
  ] = useActor(service);

  const onAcknowledge = () => {
    window.history.pushState({}, "", window.location.pathname);
    service.send("REFRESH");
  };

  return (
    <BoundaryError
      farmId={id}
      transactionId={transactionId}
      error={errorCode}
      onAcknowledge={onAcknowledge}
    />
  );
};
