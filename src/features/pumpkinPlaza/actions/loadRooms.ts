import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { Room } from "../websocketMachine";

type Request = {
  token: string;
};

export type Rooms = Record<Room, number>;

const API_URL = CONFIG.API_URL;

export async function loadRooms(request: Request) {
  // Uses same autosave event driven endpoint
  const response = await window.fetch(`${API_URL}/rooms`, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
    },
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.RESET_SERVER_ERROR);
  }

  const data: { rooms: Rooms } = await response.json();

  return data;
}
