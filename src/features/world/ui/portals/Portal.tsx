import { createPortal } from "react-dom";
import React, { useContext, useEffect, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { portal } from "../community/actions/portal";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { PortalName } from "features/game/types/portals";

interface Props {
  portalName: PortalName;
  onClose: () => void;
}
export const Portal: React.FC<Props> = ({ portalName, onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState<string>();
  const { t } = useAppTranslation();

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { token } = await portal({
        portalId: portalName,
        token: authState.context.user.rawToken as string,
        farmId: gameState.context.farmId,
      });

      // Change route
      setUrl(`https://${portalName}.sunflower-land.com?jwt=${token}`);
      // setUrl(`http://localhost:3001?jwt=${token}`);

      setLoading(false);
    };

    load();
  }, []);

  // Function to handle messages from the iframe
  const handleMessage = (event: any) => {
    // Check the message content
    if (event.data === "closePortal") {
      // Close the modal when the message is received
      setLoading(false);
      setUrl("");
      onClose();
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

  if (loading) {
    return <span className="loading">{t("loading")}</span>;
  }

  console.log({ url });

  return createPortal(
    <div
      data-html2canvas-ignore="true"
      aria-label="Hud"
      className="fixed inset-safe-area z-50"
    >
      <iframe
        src={url}
        className="w-full h-full rounded-lg shadow-md absolute"
      />
    </div>,
    document.body
  );
};
