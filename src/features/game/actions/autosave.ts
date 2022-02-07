import { PastAction } from "../lib/gameMachine";

type Request = {
  actions: PastAction[];
  farmId: number;
  sender: string;
  sessionId: string;
  signature: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function autosave(request: Request) {
  // Serialize values before sending
  const actions = request.actions.map((action) => ({
    ...action,
    createdAt: action.createdAt.toUTCString(),
  }));

  const response = await window.fetch(`${API_URL}/actions`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      ...request,
      actions,
    }),
  });

  if (response.status !== 200 || !response.ok) {
    throw new Error("Could not save game");
  }

  const data = await response.json();

  return data;
}
