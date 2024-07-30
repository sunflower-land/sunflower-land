import React, { useContext, useEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { CONFIG } from "lib/config";
import { createErrorLogger } from "lib/errorLogger";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
  const [date] = useState(new Date().toISOString());
  const [showStackTrace, setShowStackTrace] = useState(false);
  const { t } = useAppTranslation();

  useEffect(() => {
    const errorLogger = createErrorLogger("react_error_modal", farmId ?? 0);
    errorLogger({ error, transactionId, stack, date });
  }, []);

  if (error?.includes("Returned values aren't valid")) {
    return (
      <>
        <div className="p-2">
          <h1 className="mb-1 text-lg text-center">{t("error.ClientRPC")}</h1>
          <div className="w-full mb-1 flex justify-center">
            <img src={SUNNYSIDE.npcs.humanDeath} className="h-20" />
          </div>
          <div className="space-y-3 text-sm mb-3">
            <p>{t("error.polygonRPC")}</p>
          </div>
        </div>
        {onAcknowledge && (
          <Button onClick={onAcknowledge}>{t("refresh")}</Button>
        )}
      </>
    );
  }

  return (
    <>
      <div className="p-2">
        <h1 className="mb-1 text-lg text-center">{t("error.wentWrong")}</h1>
        <div className="w-full mb-1 flex justify-center">
          <img src={SUNNYSIDE.npcs.humanDeath} className="h-20" />
        </div>
        <div className="space-y-3 text-sm mb-3">
          <p>{t("error.connection.one")}</p>
          <p>{t("error.connection.two")}</p>
          <p>{t("error.connection.three")}</p>
          <p>
            {t("error.connection.four")}{" "}
            <a
              className="underline"
              href="https://sunflowerland.freshdesk.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("somethingWentWrong.supportTeam")}{" "}
            </a>
            {t("somethingWentWrong.jumpingOver")}{" "}
            <a
              className="underline"
              target="_blank"
              href="https://discord.gg/sunflowerland"
              rel="noreferrer"
            >
              {"discord"}
            </a>{" "}
            {t("somethingWentWrong.askingCommunity")}
          </p>
        </div>
        <div className="flex flex-col w-full text-left mb-2 text-xs overflow-hidden">
          {farmId && (
            <p className="leading-3">
              {t("farm")}
              {": "}
              {farmId}
            </p>
          )}
          {error && (
            <p className="leading-3 whitespace-nowrap">
              {t("error")}
              {": "}
              {error}
            </p>
          )}
          {transactionId && (
            <p className="leading-3">
              {t("transaction.id")} {transactionId}
            </p>
          )}
          <p className="leading-3">
            {t("date")}
            {": "}
            {date}
          </p>
          <p className="leading-3 font-secondary">
            {t("version")}
            {": "}
            {CONFIG.RELEASE_VERSION}
          </p>
          {stack && showStackTrace && (
            <>
              <p className="leading-3">{t("details")}</p>
              <pre className="leading-3 whitespace-pre-wrap text-[10px]">{`${stack}`}</pre>
            </>
          )}
        </div>
      </div>
      {stack && !showStackTrace && (
        <Button onClick={() => setShowStackTrace(true)}>
          {t("error.diagnostic.info")}
        </Button>
      )}
      {onAcknowledge && <Button onClick={onAcknowledge}>{t("refresh")}</Button>}
    </>
  );
};

export const SomethingWentWrong: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);

  // If we get a connecting error before the game has loaded then try to connect again via the authService
  const service = gameService ?? authService;
  const id = service.state.context?.farmId;

  const [
    {
      context: { transactionId, errorCode },
    },
  ] = useActor(service);

  const onAcknowledge = () => {
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
