import { Panel } from "components/ui/Panel";
import {
  Coordinates,
  MapPlacement,
} from "features/game/expansion/components/MapPlacement";
import { Bumpkin } from "features/game/types/game";
import {
  DynamicMiniNFT,
  NPC,
} from "features/island/bumpkin/components/DynamicMiniNFT";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { chatMachine, MachineInterpreter } from "./chatMachine";

type LiveBumpkin = {
  bumpkinId: number;
  coordinates: Coordinates;
};

export type Message = {
  id: string;

  bumpkinId: number;
  text: string;
  createdAt: number;
};

interface Props {
  messages: Message[];
  bumpkin: Bumpkin;
  chatService: MachineInterpreter;
  position?: Coordinates;
  bumpkins: LiveBumpkin[];
}

export const Chat: React.FC<Props> = ({
  messages,
  bumpkin,
  position,
  bumpkins,
}) => {
  const [selectedBumpkin, setSelectedBumpkin] = useState<string>();
  const freshMessages = messages
    .filter((m) => Date.now() - m.createdAt < 5 * 1000)
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

  console.log({ messages, freshMessages });
  const myMessage = freshMessages.find((m) => m.bumpkinId === bumpkin.id);
  return (
    <>
      <Modal
        show={!!selectedBumpkin}
        centered
        onHide={() => setSelectedBumpkin(undefined)}
      >
        <Panel>
          <span>{selectedBumpkin}</span>
        </Panel>
      </Modal>

      <div className="absolute w-full h-full translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute inset-0" style={{ zIndex: 99999 }}>
        {position && (
          <MapPlacement
            x={position?.x as number}
            y={position?.y as number}
            height={1}
            width={1}
          >
            {myMessage && (
              <span
                className="absolute  text-white text-xs"
                style={{
                  bottom: "29px",
                  left: "-58px",
                  width: "158px",
                  textAlign: "center",
                }}
              >
                {myMessage.text}
              </span>
            )}

            <NPC
              body="Beige Farmer Potion"
              hair="Basic Hair"
              pants="Blue Suspenders"
              shirt="Project Dignity Hoodie"
            />
          </MapPlacement>
        )}

        {bumpkins
          .filter((b) => !!b.coordinates)
          .map((otherBumpkin) => (
            <MapPlacement
              x={otherBumpkin.coordinates?.x as number}
              y={otherBumpkin.coordinates?.y as number}
              height={1}
              width={1}
            >
              <span
                className="absolute  text-white text-xs"
                style={{
                  bottom: "29px",
                  left: "-58px",
                  width: "158px",
                  textAlign: "center",
                }}
              >
                {
                  freshMessages.find(
                    (m) => m.bumpkinId === otherBumpkin.bumpkinId
                  )?.text
                }
              </span>
              <NPC
                body="Beige Farmer Potion"
                hair="Basic Hair"
                pants="Blue Suspenders"
                shirt="Project Dignity Hoodie"
                onClick={() => setSelectedBumpkin(otherBumpkin.bumpkinId)}
              />
            </MapPlacement>
          ))}
      </div>
    </>
  );
};
