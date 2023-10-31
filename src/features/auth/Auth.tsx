import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import Modal from "react-bootstrap/esm/Modal";

import logo from "assets/brand/logo_v2.png";
import halloween from "assets/brand/halloween_logo.png";
import sparkle from "assets/fx/sparkle2.gif";

import * as AuthProvider from "features/auth/lib/Provider";

import { ErrorMessage } from "./ErrorMessage";
import { Panel } from "components/ui/Panel";
import { CreatingFarm, Loading, CreateFarm, VisitFarm } from "./components";

import { Signing } from "./components/Signing";
import { ErrorCode } from "lib/errors";
import { Countdown } from "./components/Countdown";
import { Blacklisted } from "features/game/components/Blacklisted";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ConnectedToWallet } from "./components/ConnectedToWallet";
import { Verifying } from "./components/Verifying";
import { Welcome } from "./components/Welcome";
import { Offer } from "./components/Offer";
import classNames from "classnames";
import { SignIn } from "./components/SignIn";
import { CreateWallet } from "./components/CreateWallet";
import { BuyWithPoko } from "./components/BuyWithPoko";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

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
    authState.matches("connectingToWallet") ||
    authState.matches("setupContracts");

  return (
    <>
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
            "relative flex items-center justify-center mb-4 w-full -mt-12 max-w-xl transition-opacity duration-500 opacity-100"
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
            {Date.now() > new Date("2023-10-26").getTime() &&
            Date.now() < new Date("2023-11-01").getTime() ? (
              <>
                <img id="logo" src={halloween} className="w-full mb-1" />
                <Label
                  icon={SUNNYSIDE.icons.stopwatch}
                  type="vibrant"
                  className="mx-auto"
                >
                  Halloween event!
                </Label>
              </>
            ) : (
              <img id="logo" src={logo} className="w-full" />
            )}
          </div>
        </div>
        <Panel className="pb-1">
          {loading && <Loading />}
          {authState.matches("welcome") && <Welcome />}
          {authState.matches("createWallet") && <CreateWallet />}
          {authState.matches({ connected: "offer" }) && <Offer />}
          {/* {authState.matches({ connected: "selectPaymentMethod" }) && (
          <SelectPaymentMethod />
        )} */}
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
            <ErrorMessage
              errorCode={authState.context.errorCode as ErrorCode}
            />
          )}
        </Panel>
      </Modal>
    </>
  );
};
