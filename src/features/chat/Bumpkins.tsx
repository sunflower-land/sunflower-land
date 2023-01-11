import { Panel } from "components/ui/Panel";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Bumpkin } from "features/game/types/game";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Player, MachineInterpreter, ChatMessage } from "./chatMachine";

interface Props {
  messages: ChatMessage[];
  bumpkin: Bumpkin;
  chatService: MachineInterpreter;
  position?: Coordinates;
  bumpkins: Player[];
  path: Coordinates[];
}

export const Bumpkins: React.FC<Props> = ({
  messages,
  bumpkin,
  position,
  bumpkins,
  path,
}) => {
  const [selectedBumpkin, setSelectedBumpkin] = useState<string>();
  const freshMessages = messages;
  const myMessage = freshMessages.find((m) => m.bumpkinId === bumpkin.id);

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
        <Panel>
          <span>{selectedBumpkin}</span>
        </Panel>
      </Modal>

      {position && (
        <div
          key={bumpkin.id}
          className="absolute runner"
          style={{
            transform: `translate(${position.x}px,${position.y}px)`,
            height: `${GRID_WIDTH_PX}px`,
            width: `${GRID_WIDTH_PX}px`,
            left: "-27px",
            top: "-47px",
          }}
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

          <NPC {...bumpkin.equipped} />
        </div>
      )}

      {bumpkins
        .filter((b) => !!b.coordinates)
        .map((otherBumpkin) => {
          return (
            <div
              key={otherBumpkin.bumpkinId}
              className="absolute runner"
              style={{
                transform: `translate(${otherBumpkin.coordinates.x}px,${otherBumpkin.coordinates.y}px)`,
                height: `${GRID_WIDTH_PX}px`,
                width: `${GRID_WIDTH_PX}px`,
              }}
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
                {...otherBumpkin.wearables}
                onClick={() =>
                  setSelectedBumpkin(otherBumpkin.bumpkinId.toString())
                }
              />
            </div>
          );
        })}
    </>
  );
};
