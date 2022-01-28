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

  const data = await response.json();

  return data;
}
