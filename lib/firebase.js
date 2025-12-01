import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhs5x4d6ZVG133yFsEqr0Heql0Plqxvts",
  authDomain: "shortenit-49479.firebaseapp.com",
  projectId: "shortenit-49479",
  storageBucket: "shortenit-49479.firebasestorage.app",
  messagingSenderId: "503357978707",
  appId: "1:503357978707:web:ad4b0eff532aaf48fe6ea6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)