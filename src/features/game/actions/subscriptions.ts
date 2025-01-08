import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

export type SubscriptionName = "seasonal-events";

export type Subscriptions = {
  [key in SubscriptionName]: boolean;
};

export const DEFAULT_SUBSCRIPTIONS: Subscriptions = {
  "seasonal-events": false,
};

type SubscribeToNotificationsProps = {
  authToken: string;
  fcmToken: string;
  farmId: number;
  subscriptions: Subscriptions;
  deviceType: "ios" | "android" | "browser" | "unknown";
};

export async function subscribeToNotifications({
  authToken,
  fcmToken,
  farmId,
  subscriptions,
  deviceType,
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
      subscriptions,
      deviceType,
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

export const getSubscriptionsForFarmId = async (
  farmId: number,
  token: string,
) => {
  const url = new URL(`${API_URL}/notifications/subscriptions/${farmId}`);
  const response = await window.fetch(url.toString(), {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  return await response.json();
};
