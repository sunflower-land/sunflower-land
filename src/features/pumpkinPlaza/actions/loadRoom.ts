import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { Player } from "../lib/types";

type Request = {
  roomId: string;
  token: string;
};

const API_URL = CONFIG.API_URL;

export async function loadRoom(request: Request) {
  // Uses same autosave event driven endpoint
  const response = await window.fetch(`${API_URL}/room/${request.roomId}`, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
    },
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.RESET_SERVER_ERROR);
  }

  const data: { players: Player[]; isFull: boolean } = await response.json();

  return data;
}
