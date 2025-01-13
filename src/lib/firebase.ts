import { initializeApp } from "firebase/app";
import { CONFIG } from "lib/config";

const firebaseConfig = {
  apiKey: CONFIG.FIREBASE_API_KEY,
  authDomain: "sunflower-land.firebaseapp.com",
  projectId: "sunflower-land",
  storageBucket: "sunflower-land.appspot.com",
  messagingSenderId: CONFIG.FIREBASE_MESSAGING_SENDER_ID,
  appId: CONFIG.FIREBASE_APP_ID,
  measurementId: "G-EM6CNBH1F8",
};

export const app = initializeApp(firebaseConfig);
