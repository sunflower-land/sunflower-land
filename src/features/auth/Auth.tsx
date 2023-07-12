import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import Modal from "react-bootstrap/esm/Modal";

import logo from "assets/brand/logo_v2.png";
import sparkle from "assets/fx/sparkle2.gif";

import * as AuthProvider from "features/auth/lib/Provider";

import { Panel } from "components/ui/Panel";
import { CreateFarm } from "./components";

import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { NPC_WEARABLES } from "lib/npcs";
import { getOnboardingComplete } from "./actions/createGuestAccount";

export const Auth: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const loading =
    authState.matches({ connected: "authorised" }) ||
    authState.matches({ connected: "loadingFarm" }) ||
    authState.matches("checkFarm") ||
    authState.matches("initialising") ||
    authState.matches("connectingAsGuest");

  const connecting =
    authState.matches("reconnecting") ||
    authState.matches("connectingToMetamask") ||
    authState.matches("connectingToPhantom") ||
    authState.matches("connectingToWalletConnect") ||
    authState.matches("connectingToSequence") ||
    authState.matches("connectingToOkx") ||
    authState.matches("setupContracts");

  return (
    <Modal
      centered
      show={
        !authState.matches({ connected: "authorised" }) &&
        !authState.matches("visiting")
      }
      backdrop={false}
    >
      <div
        className={classNames(
          "relative flex items-center justify-center mb-4 -mt-44 w-full max-w-xl transition-opacity duration-500 opacity-0",
          {
            "opacity-100":
              authState.matches("welcome") ||
              (authState.matches("signIn") && getOnboardingComplete()),
          }
        )}
      >
        <div className="w-[90%] relative">
          <img
            src={sparkle}
            className="absolute animate-pulse"
            style={{
              width: `${PIXEL_SCALE * 8}px`,
              top: `${PIXEL_SCALE * 0}px`,
              right: `${PIXEL_SCALE * 0}px`,
            }}
          />
          <img id="logo" src={logo} className="w-full" />
        </div>
      </div>
      <Panel
        className="pb-1"
        bumpkinParts={
          authState.matches({ connected: "offer" }) ||
          authState.matches({ connected: "selectPaymentMethod" }) ||
          authState.matches("createWallet") ||
          (authState.matches("signIn") && !getOnboardingComplete()) ||
          authState.matches({ connected: "funding" })
            ? NPC_WEARABLES.jake
            : undefined
        }
      >
        <CreateFarm />
        {/* {loading && <Loading />}
        {authState.matches("welcome") && <Welcome />}
        {authState.matches("createWallet") && <CreateWallet />}
        {authState.matches({ connected: "offer" }) && <Offer />}
        {authState.matches({ connected: "selectPaymentMethod" }) && (
          <SelectPaymentMethod />
        )}
        {authState.matches({ connected: "creatingPokoFarm" }) && (
          <BuyWithPoko />
        )}
        {(authState.matches("idle") || authState.matches("signIn")) && (
          <SignIn />
        )}
        {connecting && <Loading text="Connecting" />}
        {authState.matches("connectedToWallet") && <ConnectedToWallet />}
        {authState.matches("signing") && <Signing />}
        {authState.matches("verifying") && <Verifying />}
        {authState.matches("oauthorising") && <Loading />}
        {authState.matches({ connected: "funding" }) && <CreateFarm />}
        {authState.matches({ connected: "countdown" }) && <Countdown />}
        {authState.matches({ connected: "creatingFarm" }) && <CreatingFarm />}
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
        )} */}
      </Panel>
    </Modal>
  );
};
