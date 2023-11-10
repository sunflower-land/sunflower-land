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
      <Panel bumpkinParts={NPC_WEARABLES["otis"]}>
        {/* <Content /> */}
        <SpeakingText
          onClose={() => {
            acknowledgeIntroduction();
            send("ACKNOWLEDGE");

            gameAnalytics.trackMilestone({ event: "Tutorial:Intro:Completed" });
          }}
          message={[
            {
              text: "Howdy there, partner! Welcome to Sunflower Land, the bountiful farming paradise!",
            },
            {
              text: "I'm Otis, an old Bumpkin farmer who's been tending to these lands for longer than I can remember. Truth be told, I could use a little help from a fresh face like you.",
            },
            {
              text: "You see, our little island has so much potential, and with your determination and hard work, we can transform it into a thriving empire!",
            },
            {
              text: "Looks like our little island is getting crowded. If we want to craft buildings and rare NFTs, we'll need more space.",
            },
            {
              text: "Let's first chop down these trees, gather some wood and expand the island.",
            },
          ]}
        />
      </Panel>
    </Modal>
  );
};
