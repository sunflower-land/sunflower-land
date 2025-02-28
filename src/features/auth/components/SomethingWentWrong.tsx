import React, { useContext, useEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { CONFIG } from "lib/config";
import { createErrorLogger } from "lib/errorLogger";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
  onAcknowledge,
  stack,
}) => {
  const [showGetHelp, setShowGetHelp] = useState(false);
  const [date] = useState(new Date().toISOString());
  const { t } = useAppTranslation();

  useEffect(() => {
    const errorLogger = createErrorLogger("react_error_modal", farmId ?? 0);
    errorLogger({ error, transactionId, stack, date });
  }, []);

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

  const handleGetSupport = () => {
    window.open(
      "https://sunflower-land.help/",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleAskOnDiscord = () => {
    window.open(
      "https://discord.gg/sunflowerland",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const tsFileName = stack ? getFirstTsFileName(stack) : null;

  const truncateError = (error: string, maxLength: number) => {
    if (error.length > maxLength) {
      return error.substring(0, maxLength) + "...";
    }
    return error;
  };

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
            <p>
              {t("farm")}
              {": "}
              {farmId}
            </p>
          )}
          {error && (
            <p>
              {t("error")}
              {": "}
              {error}
            </p>
          )}
          <p>
            {t("date")}
            {": "}
            {date}
          </p>
          {transactionId && (
            <p>
              {t("transaction.id")} {transactionId}
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
      <div className="flex flex-col space-y-0.5 space-x-0 sm:flex-row sm:space-x-1 sm:space-y-0">
        <Button onClick={handleGetSupport}>{t("error.contactSupport")}</Button>
        <Button onClick={handleAskOnDiscord}>{t("error.askOnDiscord")}</Button>
      </div>
    </div>
  ) : (
    <>
      <div className="p-2 py-1 space-y-2 mb-2">
        <h1 className="mb-1 text-base text-center">{t("error.wentWrong")}</h1>
        <p>{t("error.connection.one")}</p>
        {error && (
          <p className="mb-1 text-xs">
            {t("error")}
            {": "}
            {truncateError(error, 140)}
          </p>
        )}
      </div>
      <div className="flex flex-col space-y-0.5 space-x-0 sm:flex-row sm:space-x-1 sm:space-y-0">
        {onAcknowledge && (
          <Button onClick={onAcknowledge}>{t("try.again")}</Button>
        )}
        <Button onClick={() => setShowGetHelp(true)}>
          {t("error.connection.two")}
        </Button>
      </div>
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
