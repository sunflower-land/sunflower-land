import { PastAction } from "../lib/gameMachine";

type Request = {
  actions: PastAction[];
  farmId: number;
  sender: string;
  sessionId: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function autosave(request: Request) {
  const response = await window.fetch(`${API_URL}/actions`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      ...request,
    }),
  });

  if (response.status !== 200 || !response.ok) {
    throw new Error("Could not save game");
  }

  const data = await response.json();

  return data;
}
