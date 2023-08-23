// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgdjja6fICZW-lI60Xn18LBQg4wY-13Qw",
  authDomain: "stackruit-assignment.firebaseapp.com",
  projectId: "stackruit-assignment",
  storageBucket: "stackruit-assignment.appspot.com",
  messagingSenderId: "546024913842",
  appId: "1:546024913842:web:a55fca46aa1c9ce81102ab",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;
