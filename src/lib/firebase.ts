// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-YC3SBvPZ8T7R9m5KtbLWyKOjl39iiag",
  authDomain: "duuit-3a6e4.firebaseapp.com",
  databaseURL:
    "https://duuit-3a6e4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "duuit-3a6e4",
  storageBucket: "duuit-3a6e4.firebasestorage.app",
  messagingSenderId: "390408688242",
  appId: "1:390408688242:web:f2e7264e18f8d1aa82e8eb",
  measurementId: "G-XN9KQE5QSX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the required services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();
