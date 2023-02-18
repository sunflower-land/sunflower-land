import React, { useState } from "react";
import { MapPlacement } from "./MapPlacement";

import partyIsland from "assets/land/party_island.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { upcomingParty } from "features/pumpkinPlaza/lib/streaming";
import { useNavigate, useParams } from "react-router-dom";

export const PartyIsland: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const party = upcomingParty();

  const isPartyActive = Date.now() > party.startAt && Date.now() < party.endAt;

  const goToParty = () => {
    navigate(`/land/${id}/plaza`);
  };

  return (
    <>
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          onClose={() => setShowModal(false)}
          title={
            <div className="flex justify-center">
              <img src={CROP_LIFECYCLE.Pumpkin.crop} className="h-8 mr-2" />
              <p>Pumpkin Party</p>
              <img src={CROP_LIFECYCLE.Pumpkin.crop} className="h-8 ml-2" />
            </div>
          }
        >
          <div className="p-2">
            <p className="text-sm mb-3">
              {`The Pumpkin Plaza is hosting an event that you won't want to miss.`}
            </p>
            <p className="text-sm mb-3">
              Meet the team, collect rewards and interact with other Bumpkins.
            </p>
            <div className="flex flex-wrap">
              <p className="text-sm mr-2 mb-2">Next party:</p>
              <div className="flex mb-2 items-center justify-center bg-blue-600 text-white text-xxs px-1.5 pb-1 pt-0.5 border rounded-md">
                <img
                  src={SUNNYSIDE.icons.stopwatch}
                  className="w-3 left-0 mr-1"
                />
                <span>{`${new Date(
                  party.startAt
                ).toLocaleString()} - ${new Date(
                  party.endAt
                ).toLocaleTimeString()}`}</span>
              </div>
            </div>
          </div>
          <Button disabled={!isPartyActive} onClick={goToParty}>
            Go to Pumpkin Plaza
          </Button>
        </CloseButtonPanel>
      </Modal>
      <MapPlacement x={20} y={15} width={6}>
        <img
          src={partyIsland}
          style={{
            width: `${PIXEL_SCALE * 86}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            left: `${GRID_WIDTH_PX * 1}px`,
            bottom: `${GRID_WIDTH_PX * 5}px`,
          }}
        >
          <NPC
            body="Dark Brown Farmer Potion"
            onesie="Shark Onesie"
            hair="Buzz Cut"
            onClick={() => setShowModal(true)}
          />
        </div>

        <img
          src={SUNNYSIDE.icons.expression_chat}
          className="absolute animate-float"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            top: `${PIXEL_SCALE * -4}px`,
            left: `${PIXEL_SCALE * 22}px`,
          }}
        />

        <div
          className="absolute"
          style={{
            left: `${GRID_WIDTH_PX * 4}px`,
            bottom: `${GRID_WIDTH_PX * 3}px`,
            transform: "scaleX(-1)",
          }}
        >
          <NPC
            body="Light Brown Farmer Potion"
            hat="Pirate Hat"
            hair="Buzz Cut"
          />
        </div>
      </MapPlacement>
    </>
  );
};
