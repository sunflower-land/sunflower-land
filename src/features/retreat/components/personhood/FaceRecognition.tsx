import React, { useContext, useRef, useState } from "react";
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
import { FaceRecognitionEvent } from "features/game/types/game";
import { Label } from "components/ui/Label";

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

export const FaceRecognition: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const ref = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(true);

  const { t } = useAppTranslation();

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

  if (!faceRecognition?.session) {
    if (faceRecognition?.history.length) {
      const lastAttempt =
        faceRecognition.history[faceRecognition.history.length - 1];

      return (
        <div>
          <RecognitionAttempt {...lastAttempt} />
          <Button onClick={start}>{t("faceRecognition.tryAgain")}</Button>
        </div>
      );
    }

    return (
      <div>
        <p className="text-sm">{t("faceRecognition.introText")}</p>
        <Button onClick={start}>{t("faceRecognition.startButton")}</Button>
      </div>
    );
  }

  // Has expired (after 3 minutes)
  if (faceRecognition.session.createdAt + 3 * 60 * 1000 < Date.now()) {
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

  const { id: sessionId, credentials } = faceRecognition.session;

  if (showIntro) {
    return (
      <>
        <Label type="info">{t("photosensitivityWarningHeadingText")}</Label>
        <p className="my-1 ml-2">{t("photosensitivityWarningBodyText")}</p>
        <p className="my-2 ml-2">{t("photosensitivityWarningInfoText")}</p>
        <Button className="mt-1" onClick={() => setShowIntro(false)}>
          {t("continue")}
        </Button>
      </>
    );
  }

  return (
    <div>
      <TimerDisplay time={expires} />

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

            return {
              accessKeyId: credentials!.accessKeyId,
              secretAccessKey: credentials!.secretAccessKey,
              sessionToken: credentials!.sessionToken,
              expiration: new Date(credentials!.expiration),
            };
          },
        }}
      />
    </div>
  );
};

export const RecognitionAttempt: React.FC<FaceRecognitionEvent> = (event) => {
  const { t } = useAppTranslation();
  if (event.event === "duplicate") {
    return (
      <div>
        <Label type="danger" className="my-2">
          {t("faceRecognition.duplicateTitle")}
        </Label>
        <p className="text-sm my-2 ml-1">
          {t("faceRecognition.duplicateDescription")}
        </p>
      </div>
    );
  }

  if (event.event === "failed") {
    return (
      <div>
        <Label type="danger" className="my-2">
          {t("faceRecognition.failedTitle")}
        </Label>
        <p className="text-sm my-2 ml-1">
          {t("faceRecognition.failedDescription")}
        </p>
      </div>
    );
  }

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

  return null;
};
