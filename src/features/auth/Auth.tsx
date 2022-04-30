import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import Modal from "react-bootstrap/esm/Modal";

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

import jumpingGoblin from "assets/npcs/goblin_jump.gif";
import curly from "assets/npcs/curly_hair.png";
import { Signing } from "./components/Signing";
import { ErrorCode } from "lib/errors";
import { SupplyReached } from "./components/SupplyReached";
import { Countdown } from "./components/Countdown";
import { Minimized } from "./components/Minimized";
import { Blacklisted } from "features/game/components/Blacklisted";

export const Auth: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState, send] = useActor(authService);

  // TODO - refine full screens system
  // useEffect(() => {
  //   const resized = async () => {
  //     await new Promise((res) => setTimeout(res, 2000));
  //     const isFullScreen = window.screenTop === 0 && window.screenY === 0;

  //     // Minimised and gone full screen
  //     if (authState.matches("minimised") && isFullScreen) {
  //       send("REFRESH");
  //     }

  //     // Was playing and then minimised
  //     if (!authState.matches("minimised") && !isFullScreen) {
  //       send("REFRESH");
  //     }
  //   };

  //   window.addEventListener("resize", resized);

  //   return () => {
  //     window.removeEventListener("resize", resized);
  //   };
  // }, [authState]);

  return (
    <Modal
      centered
      show={
        !authState.matches({ connected: "authorised" }) &&
        !authState.matches("visiting")
      }
      backdrop={false}
    >
      <div className="relative">
        <img
          id="curly"
          src={curly}
          className="absolute w-54 -top-11 right-20 -z-10 scale-[4]"
        />
        <img src={jumpingGoblin} className="absolute w-52 -top-[83px] -z-10" />
        <Panel>
          {(authState.matches({ connected: "loadingFarm" }) ||
            authState.matches("checkFarm") ||
            authState.matches({ connected: "checkingSupply" }) ||
            authState.matches({ connected: "checkingAccess" })) && <Loading />}
          {authState.matches("connecting") && <Loading text="Connecting" />}
          {authState.matches("signing") && <Signing />}
          {authState.matches({ connected: "noFarmLoaded" }) && <NoFarm />}
          {authState.matches({ connected: "supplyReached" }) && (
            <SupplyReached />
          )}
          {authState.matches("oauthorising") && <Loading />}
          {authState.matches({ connected: "oauthorised" }) && <CreateFarm />}
          {authState.matches({ connected: "countdown" }) && <Countdown />}
          {authState.matches({ connected: "creatingFarm" }) && <CreatingFarm />}
          {authState.matches({ connected: "readyToStart" }) && <StartFarm />}
          {(authState.matches({ connected: "blacklisted" }) ||
            authState.matches("blacklisted")) && <Blacklisted />}
          {authState.matches("exploring") && <VisitFarm />}
          {authState.matches("minimised") && <Minimized />}
          {authState.matches("unauthorised") && (
            <ErrorMessage
              errorCode={authState.context.errorCode as ErrorCode}
            />
          )}
        </Panel>
      </div>
    </Modal>
  );
};
