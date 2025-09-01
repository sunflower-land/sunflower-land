import { createPortal } from "react-dom";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";

import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";
import { MinigameName } from "features/game/types/minigames";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CONFIG } from "lib/config";

import { portal } from "../community/actions/portal";
import { Loading } from "features/auth/components";
import { Box } from "components/ui/Box";

import sflIcon from "assets/icons/flower_token.webp";
import { IPortalDonation, PortalDonation } from "./PortalDonation";
import { getCachedFont } from "lib/utils/fonts";

interface Props {
  portalName: MinigameName;
  onClose: () => void;
  onComplete: () => void;
}

type PortalPurchase = {
  sfl: number;
  custom?: object;
};

/**
 * For minigames where the key is different to the hosted domain name
 */
const DOMAIN_MAP: Partial<Record<MinigameName, string>> = {
  "festival-of-colors-2025": "festival-of-colors",
};

export const Portal: React.FC<Props> = ({
  portalName,
  onClose,
  onComplete,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const [url, setUrl] = useState<string>();

  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState<PortalPurchase | undefined>(
    undefined,
  );
  const [donation, setDonation] = useState<IPortalDonation | undefined>();

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

      let baseUrl = `https://${DOMAIN_MAP[portalName] ?? portalName}.sunflower-land.com`;

      // If testing a local portal, uncomment this line
      baseUrl = `http://localhost:3001`;

      const language = localStorage.getItem("language") || "en";
      const font = getCachedFont();

      const url = `${baseUrl}?jwt=${token}&network=${CONFIG.NETWORK}&language=${language}&font=${font}`;

      setUrl(url);

      setLoading(false);
    };

    load();
  }, []);

  // Function to handle messages from the iframe
  const handleMessage = (event: any) => {
    console.log({ state: gameState.value });

    if (event.data?.event === "closePortal") {
      // Close the modal when the message is received
      setLoading(false);
      setUrl("");
      onClose();
    }

    if (event.data?.event === "claimPrize") {
      // Close the modal when the message is received
      setLoading(false);
      onComplete();
      return;
    }

    if (event.data.event === "purchase") {
      // Purchase the item
      setPurchase(event.data);
      return;
    }

    if (event.data.event === "donated") {
      setDonation(event.data);
      return;
    }

    if (event.data.event === "attemptStarted") {
      // Start the minigame attempt
      gameService.send("minigame.attemptStarted", {
        effect: { type: "minigame.attemptStarted", id: portalName },
      });
      return;
    }

    if (event.data.event === "scoreSubmitted") {
      console.log("scoreSubmitted", event.data);
      // Submit the minigame score
      gameService.send("minigame.scoreSubmitted", {
        effect: {
          type: "minigame.scoreSubmitted",
          score: event.data.score,
          id: portalName,
          custom: event.data.custom,
        },
      });
      return;
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
    gameService.send("minigame.spent", {
      effect: {
        type: "minigame.spent",
        id: portalName,
        sfl: purchase?.sfl,
        custom: purchase?.custom,
      },
    });

    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          event: "purchased",
          sfl: purchase?.sfl,
          custom: purchase?.custom,
        },
        "*",
      );
    }

    setPurchase(undefined);
  };

  if (loading) {
    return <Loading />;
  }

  // If we are in error state, return nothing
  if (gameState.matches("error")) {
    return null;
  }

  return (
    <>
      {createPortal(
        <div
          data-html2canvas-ignore="true"
          aria-label="Hud"
          className="fixed inset-0 z-50"
        >
          <iframe
            src={url}
            className="w-full h-full absolute z-10"
            ref={iframeRef} // Set ref to the iframe
          />
        </div>,
        document.body,
      )}
      {purchase &&
        createPortal(
          <div
            data-html2canvas-ignore="true"
            aria-label="Hud"
            className="fixed inset-safe-area z-[60] flex items-center justify-center"
            style={{
              background: "rgb(0 0 0 / 56%)",
            }}
          >
            <CloseButtonPanel
              className="w-[500px]"
              onClose={() => setPurchase(undefined)}
            >
              <div className="p-1">
                <Label type="default" className="mb-2">
                  {t("minigame.purchase")}
                </Label>
                <p className="text-sm">{`${t("minigame.confirm")}`}</p>
                {!!purchase.sfl && (
                  <div className="flex mb-1 items-center">
                    <Box image={sflIcon} />
                    <span className="ml-1">{`${purchase.sfl} x FLOWER`}</span>
                  </div>
                )}
              </div>
              <Button onClick={confirmPurchase}> {t("confirm")}</Button>
            </CloseButtonPanel>
          </div>,
          document.body,
        )}

      {!!donation &&
        createPortal(
          <div
            data-html2canvas-ignore="true"
            aria-label="Hud"
            className="fixed inset-safe-area z-[60] flex items-center justify-center"
            style={{
              background: "rgb(0 0 0 / 56%)",
            }}
          >
            <CloseButtonPanel
              className="w-[500px]"
              onClose={() => setDonation(undefined)}
            >
              <PortalDonation
                donation={donation}
                portalName={portalName}
                onClose={() => setDonation(undefined)}
              />
            </CloseButtonPanel>
          </div>,
          document.body,
        )}
      <Loading className="z-10 left-0 top-0" />
    </>
  );
};
