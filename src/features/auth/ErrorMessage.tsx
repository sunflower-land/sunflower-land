import React, { useContext, useEffect } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";

import { Beta } from "./components/Beta";
import { SomethingWentWrong } from "./components/SomethingWentWrong";
import { DuplicateUser } from "./components/DuplicateUser";
import { Congestion } from "./components/Congestion";
import { SessionExpired } from "./components/SessionExpired";
import { ErrorCode, ERRORS } from "lib/errors";
import { TooManyRequests } from "./components/TooManyRequests";
import { Maintenance } from "./components/Maintenance";
import { MultipleDevices } from "./components/MultipleDevices";
import { Blocked } from "./components/Blocked";
import { ClockIssue } from "features/game/components/ClockIssue";
import { SFLExceeded } from "features/game/components/SFLExceeded";
import { NotOnDiscordServer } from "./components/NotOnDiscordServer";
import { TooManyFarms } from "./components/TooManyFarms";

interface Props {
  errorCode: ErrorCode;
}
export const ErrorMessage: React.FC<Props> = ({ errorCode }) => {
  const { authService } = useContext(Auth.Context);
  const [_, send] = useActor(authService);

  useEffect(() => {
    const body = document.querySelector("body");

    if (body) {
      body.style.pointerEvents = "none";
    }

    return () => {
      if (body) {
        body.style.pointerEvents = "initial";
      }
    };
  }, []);

  if (errorCode === ERRORS.NO_FARM) {
    return <Beta />;
  }

  if (errorCode === ERRORS.BLOCKED) {
    return <Blocked />;
  }

  if (errorCode === ERRORS.DISCORD_USER_EXISTS) {
    return <DuplicateUser />;
  }

  if (errorCode === ERRORS.DISCORD_NOT_ON_SERVER) {
    return <NotOnDiscordServer />;
  }

  if (errorCode === ERRORS.NETWORK_CONGESTED) {
    return <Congestion />;
  }

  if (errorCode === ERRORS.SESSION_EXPIRED) {
    return <SessionExpired />;
  }

  if (errorCode === ERRORS.TOO_MANY_REQUESTS) {
    return <TooManyRequests />;
  }

  if (errorCode === ERRORS.MAINTENANCE) {
    return <Maintenance />;
  }

  if (errorCode === ERRORS.MULTIPLE_DEVICES_OPEN) {
    return <MultipleDevices />;
  }

  if (errorCode === ERRORS.AUTOSAVE_CLOCK_ERROR) {
    return <ClockIssue />;
  }

  if (errorCode === ERRORS.SYNC_DAILY_SFL_MINT_EXCEEDED) {
    return <SFLExceeded />;
  }

  if (
    errorCode === ERRORS.SIGN_UP_TOO_MANY_FARMS ||
    errorCode === ERRORS.CLAIM_FARM_TOO_MANY_FARMS
  ) {
    return <TooManyFarms />;
  }

  return <SomethingWentWrong />;
};
