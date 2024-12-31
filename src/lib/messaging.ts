import { app } from "./firebase";
import {
  getMessaging,
  getToken,
  MessagePayload,
  onMessage,
} from "firebase/messaging";

export const FIREBASE_VAPID_PUBLIC_KEY = import.meta.env
  .VITE_FIREBASE_PUBLIC_VAPID_KEY;

const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: FIREBASE_VAPID_PUBLIC_KEY,
    });

    if (!currentToken) {
      alert(
        "No registration token available. Request permission to generate one.",
      );

      return null;
    }

    return currentToken;
  } catch (error) {
    alert(`Error requesting for token: ${error}`);

    return null;
  }
};

onMessage(messaging, ({ notification }: MessagePayload) => {
  if (!notification) return;

  new Notification(notification.title as string, {
    body: notification.body,
    icon: notification.icon,
  });
});
