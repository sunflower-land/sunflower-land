import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { acknowledgeIntroduction } from "features/announcements/announcementsStorage";
import { Context } from "features/game/GameProvider";

import { SpeakingText } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { gameAnalytics } from "lib/gameAnalytics";

export const Introduction: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState, send] = useActor(gameService);

  return (
    <Modal centered show={gameState.matches("introduction")}>
      <Panel bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}>
        {/* <Content /> */}
        <SpeakingText
          onClose={() => {
            acknowledgeIntroduction();
            send("ACKNOWLEDGE");

            gameAnalytics.trackMilestone({ event: "Tutorial:Intro:Completed" });
          }}
          message={[
            {
              text: "Howdy there, Bumpkin! Welcome to Sunflower Land, the bountiful farming paradise where anything is possible!",
            },
            {
              text: "What a beautiful island you have set up on! I'm Pumpkin Pete, your neighboring farmer.",
            },
            {
              text: "Right now the players are celebrating a festival in the plaza with fantastic rewards and magical items.",
            },
            {
              text: "Before you can join the fun, you will need to grow your farm and gather some resources. You don't want to turn up empty handed!",
            },
            {
              text: "To get started, you will want to chop down those trees and grow your island.",
            },
          ]}
        />
      </Panel>
    </Modal>
  );
};
