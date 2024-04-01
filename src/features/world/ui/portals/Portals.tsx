import React, { useContext, useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import * as AuthProvider from "features/auth/lib/Provider";
import { portal } from "../community/actions/portal";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import {
  MinigameName,
  SUPPORTED_MINIGAMES,
} from "features/game/types/minigames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

import chickenRescueBanner from "assets/portals/chicken_rescue_preview.png";
import chickenRescueThumbnail from "assets/portals/chicken_rescue_thumbnail.png";

const VALID_PORTALS: MinigameName[] = ["chicken-rescue"];

export const Portals: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [selected, setSelected] = useState<MinigameName>();

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

  const travel = async (portalId: MinigameName) => {
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

  if (selected) {
    return (
      <>
        <div className="mb-1">
          <Label type="default" className="mb-1">
            {selected}
          </Label>
          <p className="text-xs my-1">Lorem ipsum</p>
          <img
            src={chickenRescueBanner}
            className="w-full rounded-md mb-1"
            alt=""
          />

          <OuterPanel>
            <span className="text-xs mb-1">Mission: Rescue 50 chickens</span>
            <div className="flex justify-between">
              <Label type="info">3 Hrs Left</Label>
              <Label type="warning">2.2</Label>
            </div>
          </OuterPanel>
        </div>
        <Button onClick={() => travel(selected)}>Play now</Button>
      </>
    );
  }

  return (
    <>
      {VALID_PORTALS.map((portal) => {
        return (
          <OuterPanel
            className="hover:bg-brown-300 cursor-pointer "
            onClick={() => {
              setSelected(portal);
            }}
          >
            <div className="flex">
              <img
                src={chickenRescueThumbnail}
                className="w-20 h-20 rounded-md"
                alt="Chicken Rescue"
              />
              <div className="px-1 flex-1">
                <div className="flex justify-between">
                  <Label type="default">{portal}</Label>
                  <Label type="warning">5</Label>
                </div>
                <span className="text-xs">
                  Rescue the chickens from the hungry goblins.
                </span>
              </div>
            </div>
          </OuterPanel>
        );
      })}
    </>
  );
};
