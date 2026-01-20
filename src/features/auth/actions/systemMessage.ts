import { CONFIG } from "lib/config";

export async function getSystemMessage(): Promise<string | null> {
  if (!CONFIG.API_URL) {
    return null;
  }

  try {
    const response = await window.fetch(
      `${CONFIG.API_URL}/support?action=systemMessage`,
      {
        method: "GET",
      },
    );

    // If no file exists, return null
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const message = data?.data?.message ?? null;

    // Validate message is a string and not empty
    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }

    return null;
  } catch (error) {
    return null;
  }
}
