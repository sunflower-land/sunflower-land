import { Panel } from "components/ui/Panel";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Equipped } from "features/game/types/bumpkin";
import { Bumpkin } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import token from "assets/icons/token_2.png";

import {
  Player,
  MachineInterpreter,
  ChatMessage,
  BumpkinDiscovery,
} from "../exploreMachine";
import { ReactionName, REACTIONS } from "../lib/reactions";
import { BumpkinPreview } from "./BumpkinPreview";
import { getKeys } from "features/game/types/craftables";

interface Props {
  messages: ChatMessage[];
  bumpkin: Bumpkin;
  chatService: MachineInterpreter;
  discoveries: BumpkinDiscovery[];
  position: Coordinates;
  bumpkins: Player[];
  path: Coordinates[];
  onVisit: (id: number) => void;
}

const Message: React.FC<ChatMessage> = ({ text, reaction }) => {
  if (text) {
    return (
      <span
        className="absolute  text-white text-xs"
        style={{
          bottom: "29px",
          left: "-58px",
          width: "158px",
          textAlign: "center",
        }}
      >
        {text}
      </span>
    );
  }

  if (reaction) {
    return (
      <img
        src={REACTIONS.find((r) => r.name === reaction)?.icon}
        className="absolute"
        style={{
          bottom: "29px",
          left: "12px",
          width: `${PIXEL_SCALE * 8}px`,
          textAlign: "center",
        }}
      />
    );
  }

  return null;
};

const Discovery: React.FC<BumpkinDiscovery> = ({ items, sfl }) => {
  if (sfl) {
    return (
      <div
        className="absolute flex  items-center"
        style={{
          bottom: "29px",
          left: "8px",
          textAlign: "center",
        }}
      >
        <img src={token} className="h-8  img-highlight-heavy mr-2" />
        <span className=" text-white">{sfl}</span>
      </div>
    );
  }

  const names = getKeys(items);
  if (names.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute flex items-center"
      style={{
        bottom: "29px",
        left: "8px",
        textAlign: "center",
      }}
    >
      <span className=" text-white mr-2">+</span>
      <img
        src={ITEM_DETAILS[names[0]].image}
        className="h-8 img-highlight-heavy"
      />
    </div>
  );
};

export const Bumpkins: React.FC<Props> = ({
  messages,
  bumpkin,
  position,
  bumpkins,
  path,
  discoveries,
  onVisit,
}) => {
  const [selectedBumpkin, setSelectedBumpkin] = useState<Player>();
  const freshMessages = messages;
  const myMessage = freshMessages.find((m) => m.bumpkinId === bumpkin.id);
  const myDiscovery = discoveries.find((m) => m.bumpkinId === bumpkin.id);

  console.log({ freshMessages, myMessage, bumpkin, bumpkins });
  useEffect(() => {
    if (path.length) {
      const pathIndex = path.find(
        (coords) => coords.x === position?.x && coords.y === position?.y
      );
      console.log({ pathIndex });
    }
  }, [path]);
  if (path) {
  }
  return (
    <>
      <Modal
        show={!!selectedBumpkin}
        centered
        onHide={() => setSelectedBumpkin(undefined)}
      >
        {selectedBumpkin && (
          <BumpkinPreview
            accountId={selectedBumpkin?.accountId as number}
            bumpkinId={selectedBumpkin?.bumpkin.id as number}
            wearables={selectedBumpkin?.bumpkin.equipped as Equipped}
            experience={100}
            onVisit={(id) => onVisit(id)}
          />
        )}
      </Modal>

      {bumpkin && (
        <div
          key={bumpkin.id}
          className="absolute runner"
          style={{
            transform: `translate(${position?.x}px,${position?.y}px)`,
            height: `${GRID_WIDTH_PX}px`,
            width: `${GRID_WIDTH_PX}px`,
            left: "-27px",
            top: "-47px",
          }}
        >
          {myMessage && <Message {...myMessage} />}

          {myDiscovery && <Discovery {...myDiscovery} />}

          <NPC {...bumpkin.equipped} />
        </div>
      )}

      {bumpkins
        .filter((b) => !!b.coordinates)
        .map((otherBumpkin) => {
          const message = freshMessages.find(
            (m) => m.bumpkinId === otherBumpkin.bumpkin.id
          );

          const discovery = discoveries.find(
            (d) => d.bumpkinId === otherBumpkin.bumpkin.id
          );

          return (
            <div
              key={otherBumpkin.bumpkin.id}
              className="absolute runner"
              style={{
                transform: `translate(${otherBumpkin.coordinates.x}px,${otherBumpkin.coordinates.y}px)`,
                height: `${GRID_WIDTH_PX}px`,
                width: `${GRID_WIDTH_PX}px`,
              }}
            >
              {message && <Message {...message} />}
              {discovery && <Discovery {...discovery} />}

              <NPC
                {...otherBumpkin.bumpkin.equipped}
                onClick={() => setSelectedBumpkin(otherBumpkin)}
              />
            </div>
          );
        })}
    </>
  );
};
