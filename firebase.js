// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "@firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEliGBkEL8RF_c958HK91g_Dzo1wBk6y0",
  authDomain: "tyto-admin-web.firebaseapp.com",
  projectId: "tyto-admin-web",
  storageBucket: "tyto-admin-web.appspot.com",
  messagingSenderId: "773027938100",
  appId: "1:773027938100:web:bc6c8925981880c00eef61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);