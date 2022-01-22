type Request = {
  sessionId: string;
  farmId: number;
  sender: string;
  signature: string;
  hash: string;
};

export async function loadSession(request: Request) {
  const response = await window.fetch(
    "https://dkltlwg8p5.execute-api.us-east-1.amazonaws.com/session",
    {
      // learn more about this API here: https://graphql-pokemon2.vercel.app/
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        ...request,
      }),
    }
  );

  const { farm } = await response.json();
  console.log({ farm });
  return farm;
}
