// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2WvA1KZzJ36gnZ4daWWlzoe3BVaFt6c8",
  authDomain: "compiadp12.firebaseapp.com",
  projectId: "compiadp12",
  storageBucket: "compiadp12.appspot.com",
  messagingSenderId: "488466842446",
  appId: "1:488466842446:web:878b40d24cffcba5ed141f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)