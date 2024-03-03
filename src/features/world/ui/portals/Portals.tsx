import React, { useContext, useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import * as AuthProvider from "features/auth/lib/Provider";
import { portal } from "../community/actions/portal";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { SUPPORTED_PORTALS } from "features/game/types/portals";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";

export const Portals: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string>();
  const { t } = useAppTranslation();

  // Function to handle messages from the iframe
  const handleMessage = (event: any) => {
    // Check the message content
    if (event.data === "closePortal") {
      // Close the modal when the message is received
      setLoading(false);
      setUrl("");

      // TODO - refresh game state?
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

  const travel = async (portalId: string) => {
    setLoading(true);

    const { token } = await portal({
      portalId,
      token: authState.context.user.rawToken as string,
      farmId: gameState.context.farmId,
    });

    // Change route
    // setUrl(`https://${portalId}.sunflower-land.com?jwt=${token}`);
    setUrl(`http://localhost:3001?jwt=${token}`);
  };

  if (url) {
    return (
      <Modal fullscreen show>
        <iframe
          src={url}
          className="w-full h-full rounded-lg shadow-md absolute"
        />
      </Modal>
    );
  }

  if (loading) {
    return <span className="loading">{t("loading")}</span>;
  }

  return (
    <>
      {SUPPORTED_PORTALS.map((id) => (
        <Button key={id} onClick={() => travel(id)}>
          {id}
        </Button>
      ))}
    </>
  );
};
