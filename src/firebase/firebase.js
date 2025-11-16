// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔁 paste your own config here from Firebase settings
const firebaseConfig = {
  apiKey: "AIzaSyCIkPHKZW4pJg54f4_Z0_zg0f633pzrat0",
  authDomain: "blogverse-dev.firebaseapp.com",
  projectId: "blogverse-dev",
  storageBucket: "blogverse-dev.firebasestorage.app",
  messagingSenderId: "600724426039",
  appId: "1:600724426039:web:d0e63420a7350ba85b5eb2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
