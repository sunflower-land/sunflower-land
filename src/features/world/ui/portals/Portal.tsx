import { createPortal } from "react-dom";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";

import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";
import { MinigameName } from "features/game/types/minigames";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CONFIG } from "lib/config";

import { portal } from "../community/actions/portal";

interface Props {
  portalName: MinigameName;
  onClose: () => void;
}

export const Portal: React.FC<Props> = ({ portalName, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const [url, setUrl] = useState<string>();

  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [purchase, setPurchase] = useState<number | undefined>(undefined);

  const { t } = useAppTranslation();

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      let token = "";
      if (CONFIG.API_URL) {
        const { token: portalToken } = await portal({
          portalId: portalName,
          token: authState.context.user.rawToken as string,
          farmId: gameState.context.farmId,
        });
        token = portalToken;
      }

      const baseUrl = `https://${portalName}.sunflower-land.com`;

      // If testing a local portal, uncomment this line
      // baseUrl = `http://localhost:3001`;

      const language = localStorage.getItem("language") || "en";

      const url = `${baseUrl}?jwt=${token}&network=${CONFIG.NETWORK}&language=${language}`;

      setUrl(url);

      setLoading(false);
    };

    load();
  }, []);

  // Function to handle messages from the iframe
  const handleMessage = (event: any) => {
    if (event.data?.event === "closePortal") {
      // Close the modal when the message is received
      setLoading(false);
      setUrl("");
      onClose();
    }

    if (event.data?.event === "claimPrize") {
      // Close the modal when the message is received
      setLoading(false);
      setIsComplete(true);
    }

    if (event.data.event === "purchase") {
      // Purchase the item
      setPurchase(event.data.sfl);
    }

    if (event.data.event === "played") {
      // Purchase the item
      gameService.send("minigame.played", {
        score: event.data.score,
        id: portalName,
      });
      gameService.send("SAVE");
    }
  };

  useEffect(() => {
    // Add event listener to listen for messages from any origin
    window.addEventListener("message", handleMessage);

    return () => {
      // Remove the event listener when the component is unmounted
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const confirmPurchase = () => {
    gameService.send("minigame.itemPurchased", {
      id: portalName,
      sfl: purchase,
    });
    gameService.send("SAVE");

    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          event: "purchased",
          sfl: url,
        },
        "*"
      );
    }

    setPurchase(undefined);
  };

  const onClaim = () => {
    gameService.send("minigame.prizeClaimed", {
      id: portalName,
    });

    onClose();
  };

  if (loading) {
    return <span className="loading">{t("loading")}</span>;
  }

  if (isComplete) {
    return (
      <ClaimReward
        onClaim={onClaim}
        reward={{
          message:
            "Congratulations, you rescued the chickens! Here is your reward.",
          createdAt: Date.now(),
          factionPoints: 10,
          id: "discord-bonus",
          items: {},
          wearables: {},
          sfl: 0,
          coins: 0,
        }}
      />
    );
  }

  return (
    <>
      {createPortal(
        <div
          data-html2canvas-ignore="true"
          aria-label="Hud"
          className="fixed inset-safe-area z-50"
        >
          <iframe
            src={url}
            className="w-full h-full rounded-lg shadow-md absolute z-10"
            ref={iframeRef} // Set ref to the iframe
          />
        </div>,
        document.body
      )}
      {purchase &&
        createPortal(
          <div
            data-html2canvas-ignore="true"
            aria-label="Hud"
            className="fixed inset-safe-area z-[60] flex items-center justify-center"
          >
            <CloseButtonPanel onClose={() => setPurchase(undefined)}>
              <div className="p-1">
                <Label type="default" className="mb-2">
                  {t("minigame.purchase")}
                </Label>
                <p className="text-sm">
                  {`${t("minigame.confirm")} ${purchase} SFL`}
                </p>
              </div>
              <Button onClick={confirmPurchase}> {t("confirm")}</Button>
            </CloseButtonPanel>
          </div>,
          document.body
        )}
      <span className="loading  z-10 left-0 top-0">{t("loading")}</span>
    </>
  );
};
