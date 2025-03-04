import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";

import mailIcon from "assets/icons/letter.png";

import * as AuthProvider from "features/auth/lib/Provider";

import { ErrorMessage } from "./ErrorMessage";
import { Panel } from "components/ui/Panel";
import { Loading } from "./components";

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
import { NPC_WEARABLES } from "lib/npcs";
import { pixelGrayBorderStyle } from "features/game/lib/style";
import { AuthMachineState } from "./lib/authMachine";
import { ErrorCode } from "lib/errors";

type Props = {
  showOfflineModal: boolean;
};

const _isConnected = (state: AuthMachineState) => state.matches("connected");
const _isVisiting = (state: AuthMachineState) => state.matches("visiting");
const _isUnauthorised = (state: AuthMachineState) =>
  state.matches("unauthorised");
const _isWelcome = (state: AuthMachineState) => state.matches("welcome");
const _isNoAccount = (state: AuthMachineState) => state.matches("noAccount");
const _isWalletInUse = (state: AuthMachineState) =>
  state.matches("walletInUse");
const _isAuthorising = (state: AuthMachineState) =>
  state.matches("authorising");
const _isVerifying = (state: AuthMachineState) => state.matches("verifying");
const _isIdle = (state: AuthMachineState) => state.matches("idle");
const _isSignIn = (state: AuthMachineState) => state.matches("signIn");
const _isSignUp = (state: AuthMachineState) => state.matches("signUp");
const _isCreating = (state: AuthMachineState) => state.matches("creating");
const _isClaiming = (state: AuthMachineState) => state.matches("claiming");
const _errorCode = (state: AuthMachineState) => state.context.errorCode;

export const Auth: React.FC<Props> = ({ showOfflineModal }) => {
  const { authService } = useContext(AuthProvider.Context);
  const isConnected = useSelector(authService, _isConnected);
  const isVisiting = useSelector(authService, _isVisiting);
  const isUnauthorised = useSelector(authService, _isUnauthorised);
  const isWelcome = useSelector(authService, _isWelcome);
  const isNoAccount = useSelector(authService, _isNoAccount);
  const isWalletInUse = useSelector(authService, _isWalletInUse);
  const isAuthorising = useSelector(authService, _isAuthorising);
  const isVerifying = useSelector(authService, _isVerifying);
  const isIdle = useSelector(authService, _isIdle);
  const isSignIn = useSelector(authService, _isSignIn);
  const isSignUp = useSelector(authService, _isSignUp);
  const isCreating = useSelector(authService, _isCreating);
  const isClaiming = useSelector(authService, _isClaiming);
  const errorCode = useSelector(authService, _errorCode);

  const [showMessage, setShowMessage] = useState(true);
  const { t } = useAppTranslation();

  return (
    <>
      <Modal show={!isConnected && !isVisiting} backdrop={false}>
        <div
          className={classNames(
            "relative flex items-center justify-center mb-4 w-full -mt-12 max-w-xl transition-opacity duration-500 opacity-100",
          )}
        >
          <div className="w-[90%] relative">
            <img
              src={SUNNYSIDE.fx.sparkle}
              className="absolute animate-pulse"
              style={{
                width: `${PIXEL_SCALE * 8}px`,
                top: `${PIXEL_SCALE * 0}px`,
                right: `${PIXEL_SCALE * 0}px`,
              }}
            />
            <>
              {hasFeatureAccess(TEST_FARM, "EASTER") ? (
                <img
                  id="logo"
                  src={SUNNYSIDE.brand.easterlogo}
                  className="w-full"
                />
              ) : (
                <img id="logo" src={SUNNYSIDE.brand.logo} className="w-full" />
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
        {showOfflineModal ? (
          <Panel>
            <div className="text-sm p-1 mb-1">{t("welcome.offline")}</div>
          </Panel>
        ) : (
          <Panel
            bumpkinParts={
              isUnauthorised ? NPC_WEARABLES["worried pete"] : undefined
            }
            className="pb-1 relative"
          >
            {isWelcome && <Welcome />}
            {isNoAccount && <NoAccount />}
            {isWalletInUse && <WalletInUse />}
            {isAuthorising && <Loading />}
            {isVerifying && <Verifying />}
            {(isIdle || isSignIn) && <SignIn type="signin" />}
            {isSignUp && <SignUp />}
            {isCreating && <Loading text={t("creating")} />}
            {isClaiming && <Loading text={t("claiming")} />}
            {isUnauthorised && (
              <ErrorMessage errorCode={errorCode as ErrorCode} />
            )}
          </Panel>
        )}
        {showMessage && (
          <div
            className={classNames(
              `w-full justify-center items-center flex  text-xs p-1 pr-4 mt-1 relative`,
            )}
            style={{
              background: "#c0cbdc",
              color: "#181425",
              ...pixelGrayBorderStyle,
            }}
            onClick={() => setShowMessage(false)}
          >
            <img src={mailIcon} className="w-8 mr-2" />
            <p className="text-xs flex-1">{t("news.flowerSoon")}</p>
            <img
              src={SUNNYSIDE.icons.close}
              className="absolute right-2 top-1 w-5 cursor-pointer"
            />
          </div>
        )}
      </Modal>

      {!isConnected && !isVisiting && <LoginSettings />}
    </>
  );
};
