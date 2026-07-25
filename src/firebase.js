// Firebase ulanishi — baza (Firestore) va login (Auth).
// DIQQAT: bu config MAXFIY EMAS — u baribir sayt kodida ochiq turadi (Firebase shunday ishlaydi).
// Haqiqiy himoya Firestore qoidalari + Auth (parol) orqali bo'ladi.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpalFdQxtPuT9XhGXEsS5NUItTIhAeOgI",
  authDomain: "combo-star-28c9e.firebaseapp.com",
  projectId: "combo-star-28c9e",
  storageBucket: "combo-star-28c9e.firebasestorage.app",
  messagingSenderId: "952049169216",
  appId: "1:952049169216:web:5b3efc70b98804de3d40a5",
  measurementId: "G-45BP8TE04M",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
