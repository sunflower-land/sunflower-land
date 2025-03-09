import React, { useContext, useEffect, useRef, useState } from "react";
import "./amplifyStyles.css";

import {
  FaceLivenessDetector,
  FaceLivenessDetectorCore,
} from "@aws-amplify/ui-react-liveness";
import { Loader, ThemeProvider } from "@aws-amplify/ui-react";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { useGame } from "features/game/GameProvider";
import { Loading } from "features/auth/components";
import { Button } from "components/ui/Button";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "../auctioneer/AuctionDetails";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { FaceRecognitionEvent } from "features/game/types/game";
import { Label } from "components/ui/Label";

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

export function LivenessQuickStartReact() {
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
    console.log("handleAnalysisComplete");

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
          <Button onClick={start}>Try Again</Button>
        </div>
      );
    }

    return (
      <div>
        <Button onClick={start}>Start Face Recognition</Button>
      </div>
    );
  }

  // Has expired (after 3 minutes)
  if (faceRecognition.session.createdAt + 3 * 60 * 1000 < Date.now()) {
    return <Button onClick={start}>Retry Face Recognition (Expired)</Button>;
  }

  const { id: sessionId, credentials } = faceRecognition.session;

  if (showIntro) {
    return (
      <>
        <p>{t("photosensitivityWarningBodyText")}</p>
        <p>{t("photosensitivityWarningInfoText")}</p>
        <p>{t("photosensitivityWarningLabelText")}</p>
        <Button onClick={() => setShowIntro(false)}>Continue</Button>
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
          console.log("Error", e);
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
            console.log("Fetch credentials", {
              accessKeyId: credentials!.accessKeyId,
              secretAccessKey: credentials!.secretAccessKey,
              sessionToken: credentials!.sessionToken,
              expiration: new Date(credentials!.expiration),
            });

            await new Promise((r) => setTimeout(r, 1000));

            console.log("DONE");
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
}

export const RecognitionAttempt: React.FC<FaceRecognitionEvent> = (event) => {
  if (event.event === "duplicate") {
    return (
      <Label type="danger" className="my-2">
        Duplciate Found
      </Label>
    );
  }

  if (event.event === "failed") {
    return (
      <Label type="danger" className="my-2">
        Failed
      </Label>
    );
  }

  if (event.event === "succeeded") {
    return (
      <Label type="success" className="my-2">
        Success
      </Label>
    );
  }

  return null;
};
