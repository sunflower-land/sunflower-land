import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "components/ui/Modal";

import logo from "assets/brand/logo_v2.png";
import easterlogo from "assets/brand/easterlogo.png";
import sparkle from "assets/fx/sparkle2.gif";

import * as AuthProvider from "features/auth/lib/Provider";

import { ErrorMessage } from "./ErrorMessage";
import { Panel } from "components/ui/Panel";
import { Loading } from "./components";

import { ErrorCode } from "lib/errors";
import { PIXEL_SCALE, TEST_FARM } from "features/game/lib/constants";
import { Verifying } from "./components/Verifying";
import { Welcome } from "./components/Welcome";
import classNames from "classnames";
import { SignIn, SignUp } from "./components/SignIn";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { NoAccount } from "./components/NoAccount";
import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";
import { WalletInUse } from "./components/WalletInUse";
import { LoginSettings } from "./components/LoginSettings";

type Props = {
  showOfflineModal: boolean;
};

export const Auth: React.FC<Props> = ({ showOfflineModal }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { t } = useAppTranslation();

  return (
    <>
      <Modal
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
            <>
              {hasFeatureAccess(TEST_FARM, "EASTER") ? (
                <img id="logo" src={easterlogo} className="w-full" />
              ) : (
                <img id="logo" src={logo} className="w-full" />
              )}

              <div className="flex justify-center">
                <Label type="default" className="font-secondary text-sm">
                  {CONFIG.RELEASE_VERSION?.split("-")[0]}
                </Label>

                {hasFeatureAccess(TEST_FARM, "EASTER") && (
                  <Label
                    secondaryIcon={SUNNYSIDE.icons.stopwatch}
                    type="vibrant"
                    className="ml-2"
                  >
                    {t("event.Easter")}
                  </Label>
                )}
              </div>
            </>
          </div>
        </div>
        {!showOfflineModal ? (
          <Panel className="pb-1 relative">
            {authState.matches("welcome") && <Welcome />}
            {authState.matches("noAccount") && <NoAccount />}
            {authState.matches("walletInUse") && <WalletInUse />}
            {authState.matches("authorising") && <Loading />}
            {authState.matches("verifying") && <Verifying />}
            {(authState.matches("idle") || authState.matches("signIn")) && (
              <SignIn type="signin" />
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
        ) : (
          <Panel>
            <div className="text-sm p-1 mb-1">{t("welcome.offline")}</div>
          </Panel>
        )}
      </Modal>

      {!authState.matches("connected") && !authState.matches("visiting") && (
        <LoginSettings />
      )}
    </>
  );
};
