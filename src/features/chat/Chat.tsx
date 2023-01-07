import { Panel } from "components/ui/Panel";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Bumpkin } from "features/game/types/game";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Player, MachineInterpreter, ChatMessage } from "./chatMachine";

interface Props {
  messages: ChatMessage[];
  bumpkin: Bumpkin;
  chatService: MachineInterpreter;
  position?: Coordinates;
  bumpkins: Player[];
}

export const Chat: React.FC<Props> = ({
  messages,
  bumpkin,
  position,
  bumpkins,
}) => {
  const [selectedBumpkin, setSelectedBumpkin] = useState<string>();
  const freshMessages = messages;

  console.log({ freshMessages });
  console.log({ bumpkin: bumpkin.id });
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
      <div>
        {position && (
          <div
            key={bumpkin.id}
            className="absolute runner"
            style={{
              top: `50%`,
              left: `50%`,
              transform: `translate(${GRID_WIDTH_PX * position.x}px,${
                -GRID_WIDTH_PX * position.y
              }px)`,
              height: `${GRID_WIDTH_PX}px`,
              width: `${GRID_WIDTH_PX}px`,
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
                  top: `50%`,
                  left: `50%`,
                  transform: `translate(${
                    GRID_WIDTH_PX * otherBumpkin.coordinates.x
                  }px,${-GRID_WIDTH_PX * otherBumpkin.coordinates.y}px)`,
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
      </div>
    </>
  );
};
