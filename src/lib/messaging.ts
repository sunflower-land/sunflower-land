import { app } from "./firebase";
import {
  getMessaging,
  getToken,
  isSupported,
  Messaging,
  onMessage,
} from "firebase/messaging";
import { CONFIG } from "lib/config";

let messaging: Messaging;

export const requestForToken = async () => {
  if (!messaging) {
    // eslint-disable-next-line no-console
    console.log(`Messaging not initialized`);
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const currentToken = await getToken(messaging, {
      vapidKey: CONFIG.FIREBASE_VAPID_KEY,
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

const initializeFirebaseMessaging = async () => {
  // Firebase Messaging
  const supported = await isSupported();

  // eslint-disable-next-line no-console
  console.log(
    "[firebase-messaging-sw.js] Firebase Messaging supported",
    supported,
  );

  if (supported) {
    messaging = getMessaging(app);

    // In game notifications are currently handled by the game using the game machine and modals
    // so this is not currently implemented but required for firebase
    onMessage(messaging, (payload) => {
      return void payload;
    });
  }
};

initializeFirebaseMessaging().catch((error) =>
  // eslint-disable-next-line no-console
  console.error("[ERROR] Failed to initialize firebase messaging", error),
);
