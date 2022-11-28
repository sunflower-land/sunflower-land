import React, { useState } from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import farmerNpc from "assets/npcs/idle.gif";
import shadow from "assets/npcs/shadow.png";
import close from "assets/icons/close.png";
import island from "assets/land/islands/farmer_island.webp";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { FarmerQuestProgress } from "./components/FarmerQuestProgress";

export const FarmerQuest: React.FC = () => {
  const [state, setState] = useState<"closed" | "introduction" | "progress">(
    "closed"
  );

  const ModalContent = () => {
    if (state === "introduction") {
      return (
        <div className="p-1">
          <p>Howdy farmer!</p>
          <p className="mt-4">
            {`I'm looking for expert farmers to trial some free Bumpkin clothing.`}
          </p>
          <p className="mt-4 mb-2">
            If you prove you are a hardworking Bumpkin, I will give you rare
            Farmer clothing.
          </p>
          <Button disabled onClick={() => setState("progress")}>
            Continue
          </Button>
        </div>
      );
    }

    if (state === "progress") {
      return <FarmerQuestProgress />;
    }

    // Empty div
    return <div className="h-60" />;
  };
  return (
    <>
      <img
        src={island}
        className="absolute"
        style={{
          left: `${GRID_WIDTH_PX * -4}px`,
          top: `${GRID_WIDTH_PX * -4}px`,
          width: `${PIXEL_SCALE * 94}px`,
        }}
      />
      <div
        className="absolute cursor-pointer hover:img-highlight"
        onClick={() => setState("introduction")}
        style={{
          left: `${GRID_WIDTH_PX * -1.5}px`,
          top: `${GRID_WIDTH_PX * -2}px`,
          width: `${PIXEL_SCALE * 15}px`,
        }}
      >
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 0}px`,
            top: `${PIXEL_SCALE * -4}px`,
          }}
        />
        <img
          src={farmerNpc}
          className="absolute left-0 bottom-0"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
          }}
        />
      </div>
      <Modal
        show={state !== "closed"}
        centered
        onHide={() => setState("closed")}
      >
        <Panel
          bumpkinParts={{
            body: "Beige Farmer Potion",
            hair: "Basic Hair",
            pants: "Blue Suspenders",
            shirt: "Red Farmer Shirt",
            tool: "Farmer Pitchfork",
          }}
        >
          <img
            src={close}
            className="absolute cursor-pointer z-20"
            onClick={() => setState("closed")}
            style={{
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
          {ModalContent()}
        </Panel>
      </Modal>
    </>
  );
};
