import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

type SubscriptionName = "seasonal-events";

type SubscribeToNotificationsProps = {
  authToken: string;
  fcmToken: string;
  farmId: number;
  subscriptionName: SubscriptionName;
};

export async function subscribeToNotifications({
  authToken,
  fcmToken,
  farmId,
  subscriptionName,
}: SubscribeToNotificationsProps): Promise<{
  success: boolean;
  message: string;
}> {
  // Append the `type` query parameter to the URL
  const url = new URL(`${API_URL}/notifications/subscribe`);

  const response = await window.fetch(url.toString(), {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      token: fcmToken,
      farmId,
      subscriptionName,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  return await response.json();
}
