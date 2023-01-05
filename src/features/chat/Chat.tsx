import { useActor, useInterpret } from "@xstate/react";
import WidgetBot from "@widgetbot/react-embed";
import { Client } from "@widgetbot/embed-api";

import { Button } from "components/ui/Button";
import {
  Coordinates,
  MapPlacement,
} from "features/game/expansion/components/MapPlacement";
import { Context } from "features/game/GameProvider";
import { DynamicMiniNFT } from "features/island/bumpkin/components/DynamicMiniNFT";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import { chatMachine, MachineInterpreter } from "./chatMachine";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

const URL = "wss://40f11abuhg.execute-api.us-east-1.amazonaws.com/hannigan";

type Connection = {
  id: string;
  bumpkinId?: number;
  coordinates?: Coordinates;
};

type LiveBumpkin = {
  bumpkinId: number;
  coordinates: Coordinates;
};

type WebSocketMessage =
  | {
      action: "loadPlayers";
    }
  | {
      action: "sendLocation";
      data: LiveBumpkin;
    };

export type Message = {
  id: string;

  bumpkinId: number;
  text: string;
  createdAt: number;
};

interface Props {
  messages: Message[];
  bumpkinId: number;
}

export const Chat: React.FC<Props> = ({ messages, bumpkinId }) => {
  const [isConnected, setIsConnected] = useState(false);
  // const [bumpkins, setBumpkins] = useState<LiveBumpkin[]>([]);

  const [position, setPosition] = useState<Coordinates>({ x: 0, y: 0 });
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const chatService = useInterpret(chatMachine, {
    context: {
      bumpkinId,
    },
  }) as unknown as MachineInterpreter;

  const [chatState] = useActor(chatService);

  const keyDownListener = (event: KeyboardEvent) => {
    setPosition((old) => {
      const coordinates = { ...old };
      const key = event.key.toLowerCase();

      if (key === "arrowup") {
        coordinates.y += 1;
      } else if (key === "arrowleft") {
        coordinates.x -= 1;
      } else if (key === "arrowdown") {
        coordinates.y -= 1;
      } else if (key === "arrowright") {
        coordinates.x += 1;
      }

      chatService.send("SEND_LOCATION", {
        coordinates,
      });

      return coordinates;
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", keyDownListener);

    return () => {
      window.removeEventListener("keydown", keyDownListener);
    };
  }, []);

  const freshMessages = messages
    .filter((m) => Date.now() - m.createdAt < 5 * 1000)
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

  return (
    <>
      <Modal show={chatState.matches("connecting")} centered>
        <Panel>
          <span className="loading">Connecting</span>
        </Panel>
      </Modal>

      <Modal show={chatState.matches("loadingPlayers")} centered>
        <Panel>
          <span className="loading">Loading Players</span>
        </Panel>
      </Modal>

      <Modal show={chatState.matches("disconnected")} centered>
        <Panel>
          <span>Disconnected</span>
        </Panel>
      </Modal>
      <Modal show={chatState.matches("error")} centered>
        <Panel>
          <span>Error</span>
        </Panel>
      </Modal>
      <div className="absolute w-full h-full translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute inset-0" style={{ zIndex: 99999 }}>
        <MapPlacement
          x={position?.x as number}
          y={position?.y as number}
          height={1}
          width={1}
        >
          <div id={`bumpkin: ${bumpkinId}`} />
          <DynamicMiniNFT
            body="Beige Farmer Potion"
            hair="Basic Hair"
            pants="Blue Suspenders"
            shirt="Project Dignity Hoodie"
          />
        </MapPlacement>

        {chatState.context.bumpkins
          .filter((b) => !!b.coordinates)
          .map((bumpkin) => (
            <MapPlacement
              x={bumpkin.coordinates?.x as number}
              y={bumpkin.coordinates?.y as number}
              height={1}
              width={1}
            >
              <div id={`bumpkin: ${bumpkin.bumpkinId}`} />
              <span className="absolute top-0 h-4">
                {
                  freshMessages.find((m) => m.bumpkinId === bumpkin.bumpkinId)
                    ?.text
                }
              </span>
              <DynamicMiniNFT
                body="Beige Farmer Potion"
                hair="Basic Hair"
                pants="Blue Suspenders"
                shirt="Project Dignity Hoodie"
              />
            </MapPlacement>
          ))}
      </div>
    </>
  );
};
