import { useActor } from "@xstate/react";
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
import { ChatPlaceable } from "./Placeable";

const URL = "wss://6yh0w2g4jb.execute-api.us-east-1.amazonaws.com/hannigan";

type LiveBumpkin = {
  id: number;
  coordinates: Coordinates;
};

export const Chat: React.FC = () => {
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [bumpkins, setBumpkins] = useState<LiveBumpkin[]>([]);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const start = () => {
    gameService.send("EDIT", {
      placeable: "Chicken",
      action: "chicken.placed",
    });
  };
  const onSocketOpen = useCallback((dataStr, doubles) => {
    console.log("Opened");
    setIsConnected(true);
    console.log({ dataStr, doubles });
    // const name = prompt("Enter your name");
    // socket.current?.send(JSON.stringify({ action: "setName", name }));
  }, []);

  const onSocketClose = useCallback(() => {
    setIsConnected(false);
  }, []);

  const onSocketMessage = useCallback((dataStr) => {
    console.log("onSocketMessage");
    // const data = JSON.parse(dataStr);
    console.log({ dataStr });
  }, []);

  useEffect(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      socket.current = new WebSocket(URL);
      socket.current.addEventListener("open", onSocketOpen);
      socket.current.addEventListener("close", onSocketClose);
      socket.current.addEventListener("message", (event) => {
        onSocketMessage(event.data);
      });
    }

    return () => {
      if (isConnected) {
        socket.current?.close();
      }
    };
  }, [isConnected]);

  const onSendPublicMessage = useCallback(() => {
    const message = prompt("Enter public message");
    socket.current?.send(
      JSON.stringify({
        action: "sendPublic",
        message,
        bumpkinId: 1,
        coordinates: {
          x: 1,
          y: 1,
        },
      })
    );
  }, []);

  const coords = new Array(5).fill(null);

  return (
    <div className="absolute inset-0" style={{ zIndex: 999999 }}>
      <div className="fixed left-0 top-0" style={{ zIndex: 999999 }}>
        <Button className="" onClick={onSendPublicMessage}>
          Click
        </Button>
      </div>
      <div className="fixed left-0 top-0" style={{ zIndex: 999999 }}>
        <Button className="" onClick={start}>
          Start
        </Button>
      </div>
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
      {bumpkins.map((bumpkin) => (
        <MapPlacement
          x={bumpkin.coordinates.x}
          y={bumpkin.coordinates.y}
          height={1}
          width={1}
        >
          <DynamicMiniNFT
            body="Beige Farmer Potion"
            hair="Basic Hair"
            pants="Blue Suspenders"
            shirt="Project Dignity Hoodie"
          />
        </MapPlacement>
      ))}
    </div>
  );
};
