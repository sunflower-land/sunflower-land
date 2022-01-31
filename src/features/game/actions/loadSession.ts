type Request = {
  sessionId: string;
  farmId: number;
  sender: string;
  signature: string;
  hasV1Tokens: boolean;
  hasV1Farm: boolean;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function loadSession(request: Request) {
  const response = await window.fetch(`${API_URL}/session`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      ...request,
    }),
  });

  const { farm } = await response.json();
  return farm;
}
