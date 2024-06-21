import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { claimPrize, purchase } from "features/portal/lib/portalUtil";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
}
export const PortalNPCExample: React.FC<Props> = ({ onClose }) => {
  const [showIntro, setShowIntro] = useState(true);
  const { t } = useAppTranslation();

  /**
   * Below is how we can listen to messages from the parent window
   * Comment events include Purchase Confirmed ("purchased")
   */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Optional: Extra security check to ensure that the message came from the parent window
      const isValidOrigin = true;

      // Check if the origin of the message is trusted
      if (isValidOrigin) {
        // Handle the received message
        if (event.data.event === "purchased") {
          // Put in your handlers here
          alert("Purchase confirmed");
        }
      } else {
        // eslint-disable-next-line no-console
        console.error("Received message from untrusted origin:", event.origin);
      }
    };

    // Add event listener to listen for messages from the parent window
    window.addEventListener("message", handleMessage);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (showIntro) {
    return (
      <SpeakingModal
        message={[
          {
            text: t("portal.example.intro"),
          },
        ]}
        onClose={() => setShowIntro(false)}
        bumpkinParts={NPC_WEARABLES.portaller}
      />
    );
  }

  return (
    <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES.portaller}>
      <Button
        onClick={() => {
          // What it costs
          purchase({
            items: {
              Sunflower: 10,
            },
            sfl: 10,
          });
          onClose();
        }}
      >
        {t("portal.example.purchase")}
      </Button>
      <Button
        onClick={() => {
          // Once a user has finished a mission - let's them claim a prize
          claimPrize();
          onClose();
        }}
      >
        {t("portal.example.claimPrize")}
      </Button>
    </CloseButtonPanel>
  );
};
