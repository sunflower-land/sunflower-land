import React, { useState } from "react";
import { MapPlacement } from "./MapPlacement";

import partyIsland from "assets/land/party_island.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "react-bootstrap";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { upcomingParty } from "features/pumpkinPlaza/lib/streaming";
import { useNavigate, useParams } from "react-router-dom";

export const PartyIsland: React.FC = () => {
  const [showSharkModal, setshowSharkModal] = useState(false);
  const [showTigerModal, setShowTigerModal] = useState(false);
  const [showPirateModal, setShowPirateModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const party = upcomingParty();

  const isPartyActive = Date.now() > party.startAt && Date.now() < party.endAt;

  const goToParty = () => {
    navigate(`/land/${id}/plaza`);
  };

  return (
    <>
      <Modal
        show={showSharkModal}
        centered
        onHide={() => setshowSharkModal(false)}
      >
        <CloseButtonPanel
          onClose={() => setshowSharkModal(false)}
          bumpkinParts={{
            body: "Dark Brown Farmer Potion",
            onesie: "Shark Onesie",
            hair: "Buzz Cut",
          }}
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
              {`The Pumpkin Plaza is hosting a special party!`}
            </p>
            <p className="text-sm mb-3">
              Meet the team and interact with other Bumpkins.
            </p>
            <p className="text-sm italic">
              Coming soon. This is an experimental feature being tested.
            </p>
            {/* <div className="flex flex-wrap">
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
            </div> */}
          </div>
          {/* <Button disabled={!isPartyActive} onClick={goToParty}>
            Go to Pumpkin Plaza
          </Button> */}
        </CloseButtonPanel>
      </Modal>

      <Modal
        show={showTigerModal}
        centered
        onHide={() => setShowTigerModal(false)}
      >
        <CloseButtonPanel
          onClose={() => setShowTigerModal(false)}
          bumpkinParts={{
            body: "Beige Farmer Potion",
            onesie: "Tiger Onesie",
            hair: "Red Long Hair",
          }}
        >
          <div className="p-2">
            <p className="mb-3">Rooooooar!</p>
            <p className="mb-3">{`I hope there are other tigers at the party.`}</p>
          </div>
        </CloseButtonPanel>
      </Modal>
      <Modal
        show={showPirateModal}
        centered
        onHide={() => setShowPirateModal(false)}
      >
        <CloseButtonPanel
          onClose={() => setShowPirateModal(false)}
          bumpkinParts={{
            body: "Goblin Potion",
            hat: "Pirate Hat",
            hair: "Buzz Cut",
            shirt: "SFL T-Shirt",
            pants: "Farmer Pants",
            tool: "Pirate Scimitar",
          }}
        >
          <div className="p-2">
            <p className="mb-3">Ahoy!</p>
            <p className="mb-3">{`I can't wait to pillage treasure at the Pumpkin Plaza.`}</p>
          </div>
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
            onClick={() => setshowSharkModal(true)}
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
            left: `${GRID_WIDTH_PX * 5}px`,
            bottom: `${GRID_WIDTH_PX * 3.5}px`,
            transform: "scaleX(-1)",
          }}
        >
          <NPC
            body="Goblin Potion"
            hat="Pirate Hat"
            hair="Buzz Cut"
            onClick={() => setShowPirateModal(true)}
          />
        </div>
        <div
          className="absolute"
          style={{
            left: `${GRID_WIDTH_PX * 2.5}px`,
            bottom: `${GRID_WIDTH_PX * 3.5}px`,
          }}
        >
          <NPC
            body="Beige Farmer Potion"
            onesie="Tiger Onesie"
            hair="Red Long Hair"
            onClick={() => setShowTigerModal(true)}
          />
        </div>
      </MapPlacement>
    </>
  );
};
