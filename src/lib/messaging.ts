import { app } from "./firebase";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export const FIREBASE_VAPID_PUBLIC_KEY = import.meta.env
  .VITE_FIREBASE_PUBLIC_VAPID_KEY;

const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const currentToken = await getToken(messaging, {
      vapidKey: FIREBASE_VAPID_PUBLIC_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!currentToken) {
      return null;
    }

    return currentToken;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Error requesting for token: ${error}`);

    return null;
  }
};

onMessage(messaging, (payload) => {
  // eslint-disable-next-line no-console
  console.log(
    "[firebase-messaging-sw.js] Received foreground message ",
    payload,
  );
});
