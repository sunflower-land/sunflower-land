import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { acknowledgeIntroduction } from "features/announcements/announcementsStorage";
import { Context } from "features/game/GameProvider";
import React, { useContext, useState } from "react";

import welcome from "assets/tutorials/welcome.png";
import locals from "assets/tutorials/locals.png";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";

export const Introduction: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState, send] = useActor(gameService);

  const [page, setPage] = useState(0);

  const Content = () => {
    if (page === 0) {
      return (
        <>
          <div className="p-2">
            <p className="mb-2 text-sm">
              {`After navigating treacherous waters I've finally found the perfect
              island.`}
            </p>
            <p className="text-sm">
              {`With a little hard work and some seeds, we can turn this land into
              a farming paradise!`}
            </p>
          </div>
          <img src={welcome} className="w-full rounded-md my-2" />
          <Button onClick={() => setPage(1)}>Continue</Button>
        </>
      );
    }

    return (
      <>
        <div className="p-2">
          <p className="text-sm">
            {`Let’s meet the local Bumpkins & figure out how to get started.`}
          </p>
        </div>
        <img src={locals} className="w-full rounded-md my-2" />
        <Button
          onClick={() => {
            acknowledgeIntroduction();
            send("ACKNOWLEDGE");
          }}
        >
          Continue
        </Button>
      </>
    );
  };
  return (
    <Modal centered show={gameState.matches("introduction")}>
      <Panel bumpkinParts={NPC_WEARABLES["otis"]}>
        {/* <Content /> */}
        <SpeakingText
          onClose={() => {
            acknowledgeIntroduction();
            send("ACKNOWLEDGE");
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
