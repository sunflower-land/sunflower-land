type Request = {
  sessionId: string;
  farmId: number;
  sender: string;
};

export async function sync(request: Request) {
  const response = await window.fetch(
    "https://dkltlwg8p5.execute-api.us-east-1.amazonaws.com/save",
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

  const data = await response.json();
  console.log({ data });

  return data;
}
