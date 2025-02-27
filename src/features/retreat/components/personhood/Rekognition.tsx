import React, { useContext } from "react";
import {
  FaceLivenessDetector,
  FaceLivenessDetectorCore,
} from "@aws-amplify/ui-react-liveness";
import { Loader, ThemeProvider } from "@aws-amplify/ui-react";
import { startRekognition } from "features/game/actions/startRekognition";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { useGame } from "features/game/GameProvider";

export function LivenessQuickStartReact() {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameState } = useGame();

  const [loading, setLoading] = React.useState(true);
  const [sessionId, setSessionId] = React.useState<string>();
  const [credentials, setCredentials] = React.useState<{
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
    expiration: string;
  }>();

  React.useEffect(() => {
    const fetchCreateLiveness = async () => {
      /*
       * This should be replaced with a real call to your own backend API
       */
      await new Promise((r) => setTimeout(r, 2000));
      const response = await startRekognition({
        token: authState.context.user.rawToken as string,
        transactionId: gameState.context.transactionId as string,
      });

      setSessionId(response.sessionId);
      setLoading(false);
    };

    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete = async () => {
    console.log("handleAnalysisComplete");
  };

  return (
    <ThemeProvider>
      {!sessionId ? (
        <Loader />
      ) : (
        <FaceLivenessDetectorCore
          sessionId={sessionId}
          region="us-east-1"
          onAnalysisComplete={handleAnalysisComplete}
          onError={console.log}
          config={{
            credentialProvider: async () => {
              console.log("Fetch credentials");

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
      )}
    </ThemeProvider>
  );
}
