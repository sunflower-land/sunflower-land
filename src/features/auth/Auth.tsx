import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import Modal from "react-bootstrap/esm/Modal";

import logo from "assets/brand/logo_with_sunflower.webp";

import * as AuthProvider from "features/auth/lib/Provider";

import { ErrorMessage } from "./ErrorMessage";
import { Panel } from "components/ui/Panel";
import {
  NoFarm,
  CreatingFarm,
  Loading,
  StartFarm,
  VisitFarm,
  CreateFarm,
} from "./components";

import { Signing } from "./components/Signing";
import { ErrorCode } from "lib/errors";
import { SupplyReached } from "./components/SupplyReached";
import { Countdown } from "./components/Countdown";
import { Blacklisted } from "features/game/components/Blacklisted";
import { Connect } from "./components/Connect";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ConnectedToWallet } from "./components/ConnectedToWallet";

export const Auth: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const connecting =
    authState.matches("reconnecting") ||
    authState.matches("connectingToMetamask") ||
    authState.matches("connectingToWalletConnect") ||
    authState.matches("connectingToSequence") ||
    authState.matches("setupContracts");

  return (
    <Modal
      centered
      show={
        !authState.matches({ connected: "authorised" }) &&
        !authState.matches({ connected: "visitingContributor" }) &&
        !authState.matches("visiting")
      }
      backdrop={false}
    >
      <div className="relative flex items-center justify-center mb-6 -mt-44 w-full max-w-xl">
        <img
          id="logo"
          src={logo}
          className="w-[90%]"
          style={{
            width: `${PIXEL_SCALE * 126}px`,
          }}
        />
      </div>
      <Panel className="pb-1">
        {(authState.matches({ connected: "loadingFarm" }) ||
          authState.matches("checkFarm") ||
          authState.matches("initialising") ||
          authState.matches({ connected: "checkingSupply" }) ||
          authState.matches({ connected: "checkingAccess" })) && <Loading />}
        {authState.matches("idle") && <Connect />}
        {connecting && <Loading text="Connecting" />}
        {authState.matches("connectedToWallet") && <ConnectedToWallet />}
        {authState.matches("signing") && <Signing />}
        {authState.matches({ connected: "noFarmLoaded" }) && <NoFarm />}
        {authState.matches({ connected: "supplyReached" }) && <SupplyReached />}
        {authState.matches("oauthorising") && <Loading />}
        {authState.matches({ connected: "donating" }) && <CreateFarm />}
        {authState.matches({ connected: "countdown" }) && <Countdown />}
        {authState.matches({ connected: "creatingFarm" }) && <CreatingFarm />}
        {authState.matches({ connected: "readyToStart" }) && <StartFarm />}
        {(authState.matches({ connected: "blacklisted" }) ||
          authState.matches("blacklisted")) && (
          <Blacklisted
            verificationUrl={authState.context.verificationUrl}
            blacklistStatus={authState.context.blacklistStatus}
          />
        )}
        {authState.matches("exploring") && <VisitFarm />}
        {authState.matches("unauthorised") && (
          <ErrorMessage errorCode={authState.context.errorCode as ErrorCode} />
        )}
      </Panel>
    </Modal>
  );
};
