import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCozYr5S8ahU0WSoTS13ctjtFrleD5rZB8",
  authDomain: "sunflower-land.firebaseapp.com",
  projectId: "sunflower-land",
  storageBucket: "sunflower-land.appspot.com",
  messagingSenderId: "1061537811936",
  appId: "1:1061537811936:web:4357cbb765c9c990f66f85",
  measurementId: "G-EM6CNBH1F8",
};

export const app = initializeApp(firebaseConfig);
