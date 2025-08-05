import { CONFIG } from "lib/config";

export async function getSystemMessage(): Promise<string | null> {
  const response = await window.fetch(
    `https://sunflower-land.com/system-message.txt?v=${CONFIG.RELEASE_VERSION}`,
    {
      method: "GET",
    },
  );

  // If no file exists, return null
  if (response.status === 404) {
    return null;
  }

  // Transport .txt based response
  const text = await response.text();

  return text;
}
