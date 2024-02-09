import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import Modal from "react-bootstrap/esm/Modal";

import logo from "assets/brand/logo_v2.png";
import winterLogo from "assets/brand/winter_logo.png";
import sparkle from "assets/fx/sparkle2.gif";

import * as AuthProvider from "features/auth/lib/Provider";

import { ErrorMessage } from "./ErrorMessage";
import { Panel } from "components/ui/Panel";
import { Loading } from "./components";

import { ErrorCode } from "lib/errors";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Verifying } from "./components/Verifying";
import { Welcome } from "./components/Welcome";
import classNames from "classnames";
import { SignIn, SignUp } from "./components/SignIn";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NoAccount } from "./components/NoAccount";
import { CONFIG } from "lib/config";

export const Auth: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { t } = useAppTranslation();

  return (
    <>
      <Modal
        centered
        show={!authState.matches("connected") && !authState.matches("visiting")}
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
            {Date.now() > new Date("2023-12-10").getTime() &&
            Date.now() < new Date("2023-12-27").getTime() ? (
              <>
                <img id="logo" src={winterLogo} className="w-full mb-1" />
                <div className="flex items-center justify-center">
                  <Label icon={SUNNYSIDE.icons.stopwatch} type="vibrant">
                    Christmas event!
                  </Label>
                  <Label type="default" className="ml-2">
                    {CONFIG.RELEASE_VERSION?.split("-")[0]}
                  </Label>
                </div>
              </>
            ) : (
              <>
                <img id="logo" src={logo} className="w-full" />

                <div className="flex justify-center">
                  <Label type="default">
                    {CONFIG.RELEASE_VERSION?.split("-")[0]}
                  </Label>

                  {Date.now() > new Date("2024-02-09").getTime() &&
                    Date.now() < new Date("2024-02-16").getTime() && (
                      <Label
                        secondaryIcon={SUNNYSIDE.icons.stopwatch}
                        type="vibrant"
                        className="ml-2"
                      >
                        Lunar New Year Event
                      </Label>
                    )}
                </div>
              </>
            )}
          </div>
        </div>
        <Panel className="pb-1 relative">
          {authState.matches("welcome") && <Welcome />}
          {authState.matches("noAccount") && <NoAccount />}
          {authState.matches("authorising") && <Loading />}
          {authState.matches("verifying") && <Verifying />}
          {(authState.matches("idle") || authState.matches("signIn")) && (
            <SignIn />
          )}
          {authState.matches("signUp") && <SignUp />}
          {authState.matches("oauthorising") && <Loading />}
          {authState.matches("creating") && <Loading text="Creating" />}
          {authState.matches("claiming") && <Loading text="Claiming" />}
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
