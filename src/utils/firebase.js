// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "bizfeasibility.firebaseapp.com",
  projectId: "bizfeasibility",
  storageBucket: "bizfeasibility.appspot.com",
  messagingSenderId: "203249320985",
  appId: "1:203249320985:web:ad4a71469e5fb03a979688",
  measurementId: "G-CW3X41FZYD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
