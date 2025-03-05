// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5BWQ-KW4dDdxITs55wTYPgVyIPEtpg9k",
  authDomain: "journal-now-9e40c.firebaseapp.com",
  projectId: "journal-now-9e40c",
  storageBucket: "journal-now-9e40c.firebasestorage.app",
  messagingSenderId: "929756858655",
  appId: "1:929756858655:web:50b7f4eef1e32becd0c82a",
  measurementId: "G-D5W1EGQW0P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);