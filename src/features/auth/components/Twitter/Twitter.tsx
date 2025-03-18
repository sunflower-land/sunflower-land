import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext } from "react";
import { useGame } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { CONFIG } from "lib/config";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Twitter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameService, gameState } = useGame();
  const telegram = gameState.context.state.telegram;

  const { t } = useAppTranslation();

  const twitter = gameState.context.state.twitter;

  return (
    <CloseButtonPanel onClose={onClose} container={OuterPanel}>
      <InnerPanel className="p-1">
        <div className="flex mb-2 ">
          <Label type="default" className="mr-2">
            {t("twitter.title")}
          </Label>
          <Label type="info" className="mr-2">
            {t("beta")}
          </Label>
          {twitter?.isAuthorised && (
            <Label type="success" className="mr-2">
              {t("twitter.connected")}
            </Label>
          )}
        </div>
        <p className="text-xs p-2">{t("twitter.description")}</p>
      </InnerPanel>
      <TwitterConnect />
    </CloseButtonPanel>
  );
};

const TwitterConnect: React.FC = () => {
  const { gameService, gameState } = useGame();
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { t } = useAppTranslation();

  const twitter = gameState.context.state.twitter;

  if (!twitter?.isAuthorised) {
    return (
      <InnerPanel className="p-1  mt-1">
        <Button
          onClick={() => {
            const redirectUrl = `${CONFIG.API_URL}/oauth/twitter`;
            const nonce = gameState.context.oauthNonce;

            const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${CONFIG.TWITTER_CLIENT_ID}&redirect_uri=${redirectUrl}&scope=tweet.read%20users.read%20follows.read%20offline.access&state=${nonce}&code_challenge=challenge&code_challenge_method=plain`;

            window.location.href = url;
          }}
        >
          {t("twitter.connect")}
        </Button>
      </InnerPanel>
    );
  }

  if (!twitter.followedAt) {
    return (
      <InnerPanel className="p-1  mt-1">
        <div className="flex flex-wrap">
          <Button
            onClick={() => {
              // Navigate to official twitter account
              window.open("https://x.com/0xsunflowerland", "_blank");

              gameService.send("twitter.followed", {
                effect: {
                  type: "twitter.followed",
                },
                authToken: authState.context.user.rawToken as string,
              });
            }}
          >
            {t("twitter.follow")}
          </Button>
        </div>
      </InnerPanel>
    );
  }

  return null;

  // Stage 2 - testing only
  // return (
  //   <InnerPanel className="p-1  mt-1">
  //     <TextInput value={url} onValueChange={(e) => setUrl(e)} />
  //     <div className="flex flex-wrap">
  //       <Button
  //         disabled={!url}
  //         onClick={() => {
  //           gameService.send("twitter.posted", {
  //             effect: {
  //               type: "twitter.posted",
  //               url,
  //             },
  //             authToken: authState.context.user.rawToken as string,
  //           });
  //         }}
  //       >
  //         Verify Tweet
  //       </Button>
  //     </div>
  //   </InnerPanel>
  // );
};
