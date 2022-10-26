import React, { useState } from "react";

import femaleGoblin from "assets/npcs/goblin_female.gif";
import femaleHuman from "assets/npcs/human_female.gif";

import close from "assets/icons/close.png";

import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { PAST_ANNOUNCEMENTS } from "features/announcements/announcementsStorage";
import { Announcement } from "features/announcements/Announcement";
import { MapPlacement } from "../../components/MapPlacement";

const CONTENT_HEIGHT = 400;

interface Props {
  side: "human" | "goblin";
}
export const WarMessenger: React.FC<Props> = ({ side }) => {
  const [showModal, setShowModal] = useState(false);

  const announcements = PAST_ANNOUNCEMENTS.filter(
    (announcement) => announcement.type === "war"
  );

  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <div className="flex flex-col items-center">
            <img
              src={close}
              className="h-6 top-4 right-4 absolute cursor-pointer z-10"
              onClick={() => setShowModal(false)}
            />
            <span>War messenger</span>
            <div
              style={{ maxHeight: CONTENT_HEIGHT }}
              className="overflow-y-auto p-2 mt-2 divide-brown-600 scrollable divide-y-2 divide-dashed divide-brown-600"
            >
              {announcements.map((announcement, index) => (
                <Announcement key={index} announcement={announcement} />
              ))}
            </div>
          </div>
        </Panel>
      </Modal>
      <MapPlacement x={4} y={-13.5}>
        <img
          src={side === "human" ? femaleHuman : femaleGoblin}
          className="cursor-pointer hover:img-highlight"
          style={{
            width: `${PIXEL_SCALE * (side === "human" ? 14 : 16)}px`,
            transform: "scaleX(-1)",
          }}
          onClick={() => setShowModal(true)}
        />
      </MapPlacement>
    </>
  );
};
