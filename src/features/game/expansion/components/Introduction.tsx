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
              text: "I'm Pumpkin Pete...Grow your land and prepare for the festival!",
            },
            {
              text: "If you need help, come back to me!",
            },
          ]}
        />
      </Panel>
    </Modal>
  );
};
