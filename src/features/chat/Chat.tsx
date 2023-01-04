import { useActor } from "@xstate/react";
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
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [bumpkins, setBumpkins] = useState<LiveBumpkin[]>([]);

  const [position, setPosition] = useState<Coordinates>({ x: 0, y: 0 });
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const sendMessage = (message: WebSocketMessage) => {
    socket.current?.send(JSON.stringify(message));
  };
  const onSocketOpen = useCallback((dataStr, doubles) => {
    setIsConnected(true);

    sendMessage({
      action: "loadPlayers",
    });
    // const name = prompt("Enter your name");
    // socket.current?.send(JSON.stringify({ action: "setName", name }));
  }, []);

  const closeSocket = useCallback(() => {
    if (socket.current) {
      socket.current.close();
      socket.current = null;
    }
  }, [socket]);

  const onSocketMessage = useCallback((data) => {
    console.log("onSocketMessage");
    // const data = JSON.parse(dataStr);
    console.log({ data });
    const converted: LiveBumpkin[] = JSON.parse(data).connections;

    console.log({ all: converted.length, bumpkinId });

    const otherBumpkins = converted.filter(
      (c) => !!c.bumpkinId && c.bumpkinId !== bumpkinId
    );
    console.log({ otherBumpkins: otherBumpkins.length });
    setBumpkins(otherBumpkins);
  }, []);

  const keyDownListener = (event: KeyboardEvent) => {
    setPosition((old) => {
      const coordinates = { ...old };
      const key = event.key.toLowerCase();

      console.log({ key });
      if (key === "arrowup") {
        coordinates.y += 1;
      } else if (key === "arrowleft") {
        coordinates.x -= 1;
      } else if (key === "arrowdown") {
        coordinates.y -= 1;
      } else if (key === "arrowright") {
        coordinates.x += 1;
      }

      console.log({ coordinatesSet: coordinates });
      sendMessage({
        action: "sendLocation",
        data: {
          bumpkinId: bumpkinId,
          coordinates,
        },
      });

      return coordinates;
    });
  };

  useEffect(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      socket.current = new WebSocket(URL);
      socket.current.addEventListener("open", onSocketOpen);
      socket.current.addEventListener("close", closeSocket);
      socket.current.addEventListener("message", (event) => {
        console.log({ event });
        onSocketMessage(event.data);
      });
    }

    window.addEventListener("keydown", keyDownListener);

    return () => {
      closeSocket();

      window.removeEventListener("keydown", keyDownListener);
    };
  }, []);

  const coords = new Array(5).fill(null);

  if (!isConnected) {
    return null;
  }
  const freshMessages = messages
    .filter((m) => Date.now() - m.createdAt < 5 * 1000)
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  console.log({ position });
  return (
    <>
      <div className="absolute w-full h-full translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute inset-0" style={{ zIndex: 99999 }}>
        {coords.map((_, y) =>
          coords.map((_, x) => (
            <MapPlacement x={x} y={y} height={1} width={1}>
              <div
                id={`x: ${x},y:${y}`}
                className="absolute inset-0 bg-red-300 cursor-pointer hover:bg-red-400"
              />
            </MapPlacement>
          ))
        )}

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

        {bumpkins
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
