import { RoomAvailable } from "colyseus.js";
import { RoomId } from "../roomMachine";

const WORLD_COUNT = 5;
const MAX_PLAYERS = 2;

export function chooseRoom(roomId: RoomId, rooms: RoomAvailable[]) {
  let chosenRoom: RoomId | undefined = roomId;

  let capacity = rooms.find((r) => r.name === chosenRoom)?.clients ?? 0;

  let worldId = 1;
  while (capacity >= MAX_PLAYERS) {
    worldId += 1;
    if (worldId > WORLD_COUNT) {
      chosenRoom = undefined;
      break;
    }

    chosenRoom = `${roomId}_${worldId}` as RoomId;
    capacity = rooms.find((r) => r.name === chosenRoom)?.clients ?? 0;
  }

  console.log({ roomId });

  return chosenRoom;
}
