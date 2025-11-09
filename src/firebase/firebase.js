// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🔁 paste your own config here from Firebase settings
const firebaseConfig = {
  apiKey: "AIzaSyAGaPPsyxfDMAauGNRZCPAPPO1T91pWWsM",
  authDomain: "blogverse-1f0f3.firebaseapp.com",
  projectId: "blogverse-1f0f3",
  storageBucket: "blogverse-1f0f3.firebasestorage.app",
  messagingSenderId: "643631715449",
  appId: "1:643631715449:web:e66d97fff93e9f3dd9f0a8",
  measurementId: "G-VV885NKX9E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
