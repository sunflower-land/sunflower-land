type Request = {
  sessionId: string;
  farmId: number;
  sender: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function sync(request: Request) {
  const response = await window.fetch(`${API_URL}/session`, {
    // learn more about this API here: https://graphql-pokemon2.vercel.app/
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
