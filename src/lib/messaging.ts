/* eslint-disable no-console */
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "./firebase";
import { CONFIG } from "./config";

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);

export const generateToken = async (
  registration: ServiceWorkerRegistration
) => {
  try {
    const token = await getToken(messaging, {
      vapidKey: CONFIG.FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log("getToken: ", token);
    return token;
  } catch (error) {
    console.error("Error while getting token: ", error);
  }
};
