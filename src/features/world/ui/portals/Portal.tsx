import { createPortal } from "react-dom";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { portal } from "../community/actions/portal";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { MinigameName } from "features/game/types/minigames";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { CONFIG } from "lib/config";
import { Label } from "components/ui/Label";

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
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState<string>();
  const [purchase, setPurchase] = useState<number | undefined>(undefined);
  const { t } = useAppTranslation();

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      let token = "";
      if (CONFIG.API_URL) {
        const { token } = await portal({
          portalId: portalName,
          token: authState.context.user.rawToken as string,
          farmId: gameState.context.farmId,
        });
      }

      // Change route
      // setUrl(`https://${portalName}.sunflower-land.com?jwt=${token}`);
      setUrl(`http://localhost:3001?jwt=${token}`);

      setLoading(false);
    };

    load();
  }, []);

  // Function to handle messages from the iframe
  const handleMessage = (event: any) => {
    console.log({ event });

    if (event.data?.event === "closePortal") {
      // Close the modal when the message is received
      setLoading(false);
      setUrl("");
      onClose();
    }

    if (event.data.event === "purchase") {
      // Purchase the item
      console.log("Purchasing item", event.data.sfl);
      setPurchase(event.data.sfl);
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
    console.log("Confirm purchase");
    gameService.send("minigame.itemPurchased", {
      id: portalName,
      sfl: purchase,
    });

    console.log("iframe purchase", { iframeRef });
    if (iframeRef.current) {
      console.log("SEND IT OFF!", iframeRef.current.contentWindow);
      iframeRef.current.contentWindow.postMessage(
        {
          event: "purchased",
          sfl: url,
        },
        "*"
      );
    }
  };

  if (loading) {
    return <span className="loading">{t("loading")}</span>;
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
                  Purchase
                </Label>
                <p className="text-sm">
                  Are you sure you want to spend {purchase} SFL?
                </p>
              </div>
              <Button onClick={confirmPurchase}>Confirm</Button>
            </CloseButtonPanel>
          </div>,
          document.body
        )}
    </>
  );
};
