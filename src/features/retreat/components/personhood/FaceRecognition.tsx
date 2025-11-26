import React, { useContext, useState } from "react";
import "./amplifyStyles.css";

import { FaceLivenessDetectorCore } from "@aws-amplify/ui-react-liveness";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { useGame } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "../auctioneer/AuctionDetails";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { FaceRecognitionEvent, GameState } from "features/game/types/game";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  faceCooldownUntil,
  getFaceRecognitionAttemptsLeft,
} from "./lib/faceRecognition";
import { isMobile } from "mobile-device-detect";
import { HudContainer } from "components/ui/HudContainer";
import { secondsToString } from "lib/utils/time";
import { InstallAppModal } from "features/island/hud/components/settings-menu/general-settings/InstallAppModal";
import { useNow } from "lib/utils/hooks/useNow";

// Text keys embedded in the liveness detector
const TRANSLATION_KEYS: TranslationKeys[] = [
  "errorLabelText",
  "connectionTimeoutHeaderText",
  "connectionTimeoutMessageText",
  "timeoutHeaderText",
  "timeoutMessageText",
  "faceDistanceHeaderText",
  "faceDistanceMessageText",
  "multipleFacesHeaderText",
  "multipleFacesMessageText",
  "clientHeaderText",
  "clientMessageText",
  "serverHeaderText",
  "serverMessageText",
  "landscapeHeaderText",
  "landscapeMessageText",
  "portraitMessageText",
  "tryAgainText",
  "cameraMinSpecificationsHeadingText",
  "cameraMinSpecificationsMessageText",
  "cameraNotFoundHeadingText",
  "cameraNotFoundMessageText",
  "a11yVideoLabelText",
  "cancelLivenessCheckText",
  "goodFitCaptionText",
  "goodFitAltText",
  "hintCenterFaceText",
  "hintCenterFaceInstructionText",
  "hintFaceOffCenterText",
  "hintMoveFaceFrontOfCameraText",
  "hintTooManyFacesText",
  "hintFaceDetectedText",
  "hintCanNotIdentifyText",
  "hintTooCloseText",
  "hintTooFarText",
  "hintConnectingText",
  "hintVerifyingText",
  "hintCheckCompleteText",
  "hintIlluminationTooBrightText",
  "hintIlluminationTooDarkText",
  "hintIlluminationNormalText",
  "hintHoldFaceForFreshnessText",
  "hintMatchIndicatorText",
  "photosensitivityWarningBodyText",
  "photosensitivityWarningHeadingText",
  "photosensitivityWarningInfoText",
  "photosensitivityWarningLabelText",
  "photosensitivyWarningBodyText",
  "photosensitivyWarningHeadingText",
  "photosensitivyWarningInfoText",
  "photosensitivyWarningLabelText",
  "retryCameraPermissionsText",
  "recordingIndicatorText",
  "startScreenBeginCheckText",
  "tooFarCaptionText",
  "tooFarAltText",
  "waitingCameraPermissionText",
];

export const FaceRecognition: React.FC<{ skipIntro?: boolean }> = ({
  skipIntro = false,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [showIntro, setShowIntro] = useState(!skipIntro);
  const [showMobileInstall, setShowMobileInstall] = useState(false);
  const { t } = useAppTranslation();

  const now = useNow();

  const { gameState, gameService } = useGame();

  const { faceRecognition } = gameState.context.state;

  const expiresAt =
    faceRecognition?.session?.createdAt &&
    faceRecognition?.session.createdAt + 3 * 60 * 1000;
  const expires = useCountdown(expiresAt ?? 0);

  const handleAnalysisComplete = async () => {
    // Go off to the server and check the session ID if it has completed
    gameService.send("faceRecognition.completed", {
      effect: {
        type: "faceRecognition.completed",
      },
      authToken: authState.context.user.rawToken as string,
    });
  };

  const start = () => {
    gameService.send("faceRecognition.started", {
      effect: {
        type: "faceRecognition.started",
      },
      authToken: authState.context.user.rawToken as string,
    });
  };

  if (showMobileInstall) {
    return <InstallAppModal />;
  }

  if (showIntro) {
    return (
      <>
        <div className="p-2">
          <Label type="info" icon={SUNNYSIDE.icons.search} className="mb-1">
            {t("faceRecognition.label")}
          </Label>
          <p className="text-sm">{t("faceRecognition.introText")}</p>
        </div>
        <Button onClick={() => setShowIntro(false)}>
          {t("faceRecognition.startButton")}
        </Button>
      </>
    );
  }

  if (!faceRecognition?.session) {
    if (faceRecognition?.history.length) {
      const lastAttempt =
        faceRecognition.history[faceRecognition.history.length - 1];

      const cooldownUntil = faceCooldownUntil({
        game: gameState.context.state,
      });

      const isOnCooldown = now < cooldownUntil;

      return (
        <div>
          <RecognitionAttempt
            game={gameState.context.state}
            event={lastAttempt}
          />
          <Button disabled={isOnCooldown} onClick={start}>
            {t("faceRecognition.tryAgain")}
          </Button>
        </div>
      );
    }

    return (
      <>
        <Label type="info">{t("photosensitivityWarningHeadingText")}</Label>
        <p className="my-1 ml-2">{t("photosensitivityWarningBodyText")}</p>
        <p className="my-2 ml-2">{t("photosensitivityWarningInfoText")}</p>
        <Button className="mt-1" onClick={start}>
          {t("continue")}
        </Button>
      </>
    );
  }

  // Has expired (after 3 minutes)
  if (faceRecognition.session.createdAt + 3 * 60 * 1000 < now) {
    return (
      <div>
        <Label type="danger">{t("faceRecognition.expiredTitle")}</Label>
        <p className="text-sm my-2 ml-1">
          {t("faceRecognition.expiredDescription")}
        </p>
        <Button onClick={start}>{t("faceRecognition.retryButton")}</Button>
      </div>
    );
  }

  const { id: sessionId, token } = faceRecognition.session;

  return (
    <div>
      <TimerDisplay time={expires} />

      {isMobile && (
        <HudContainer zIndex={"z-[100]"}>
          <div id="timer" className="absolute top-2 left-2">
            <TimerDisplay time={expires} />
          </div>
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute top-2 right-2 w-8"
            onClick={() => {
              // Check the analysis in case of timeout or error
              handleAnalysisComplete();
              // Back to beginning
              setShowIntro(true);
            }}
          />
        </HudContainer>
      )}

      {/* https://ui.docs.amplify.aws/react/connected-components/liveness/customization */}
      <FaceLivenessDetectorCore
        sessionId={sessionId}
        region="us-east-1"
        onAnalysisComplete={handleAnalysisComplete}
        onError={(e) => {
          throw e;
        }}
        displayText={TRANSLATION_KEYS.reduce(
          (acc, key) => {
            acc[key] = t(key);
            return acc;
          },
          {} as Record<TranslationKeys, string>,
        )}
        disableStartScreen
        config={{
          credentialProvider: async () => {
            await new Promise((r) => setTimeout(r, 1000));

            // Decode base 64 encoded token
            const credentials = JSON.parse(atob(token));

            return {
              accessKeyId: credentials!.accessKeyId,
              secretAccessKey: credentials!.secretAccessKey,
              sessionToken: credentials!.sessionToken,
              expiration: new Date(credentials!.expiration),
            };
          },
        }}
      />

      {!isMobile && (
        <div className="my-2 text-center">
          <span className="text-xs my-1 mr-2">
            {t("faceRecognition.mobile")}
          </span>
          <span
            className="text-xs my-1 underline cursor-pointer"
            onClick={() => setShowMobileInstall(true)}
          >
            {t("faceRecognition.mobile.two")}
          </span>
        </div>
      )}
    </div>
  );
};

export const FaceRecognitionSettings: React.FC = () => {
  return (
    <div>
      <FaceRecognition />
    </div>
  );
};

export const RecognitionAttempt: React.FC<{
  game: GameState;
  event: FaceRecognitionEvent;
}> = ({ game, event }) => {
  const { t } = useAppTranslation();

  const now = useNow();

  if (event.event === "succeeded") {
    return (
      <div>
        <Label type="success" className="my-2">
          {t("faceRecognition.successTitle")}
        </Label>
        <p className="text-sm my-2 ml-1">
          {t("faceRecognition.successDescription")}
        </p>
      </div>
    );
  }

  const cooldownUntil = faceCooldownUntil({ game });
  const isOnCooldown = now < cooldownUntil;

  if (isOnCooldown) {
    return (
      <div>
        <div className="flex justify-between">
          <Label type="danger" className="my-2">
            {t("faceRecognition.cooldownTitle")}
          </Label>
          <Label type="info" className="my-2">
            {secondsToString((cooldownUntil - now) / 1000, {
              length: "medium",
            })}
          </Label>
        </div>
        <p className="text-sm my-2 ml-1">
          {t("faceRecognition.cooldownDescription")}
        </p>
      </div>
    );
  }

  const attemptsLeft = getFaceRecognitionAttemptsLeft({
    game,
  });

  if (event.event === "duplicate") {
    return (
      <div>
        <div className="flex justify-between">
          <Label type="danger" className="my-2">
            {t("faceRecognition.duplicateTitle")}
          </Label>
          <Label type="info" className="my-2">
            {t("faceRecognition.attemptsLeft", {
              attempts: attemptsLeft,
            })}
          </Label>
        </div>
        <p className="text-sm my-2 ml-1">
          {t("faceRecognition.duplicateDescription")}
        </p>
      </div>
    );
  }

  if (event.event === "failed") {
    return (
      <div>
        <div className="flex justify-between">
          <Label type="danger" className="my-2">
            {t("faceRecognition.failedTitle")}
          </Label>
          <Label type="info" className="my-2">
            {t("faceRecognition.attemptsLeft", {
              attempts: attemptsLeft,
            })}
          </Label>
        </div>
        <p className="text-sm my-2 ml-1">
          {t("faceRecognition.failedDescription")}
        </p>
      </div>
    );
  }

  return null;
};
