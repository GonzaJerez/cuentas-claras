import 'firebase/firestore';
import 'firebase/auth';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBX0u1mqveILXYZTpAk7IYYZ1LpETpP-XQ",
    authDomain: "cuentas-claras-react.firebaseapp.com",
    projectId: "cuentas-claras-react",
    storageBucket: "cuentas-claras-react.appspot.com",
    messagingSenderId: "668234537938",
    appId: "1:668234537938:web:1e1d45c820953a6fd3860b",
    measurementId: "G-GZG5TZLLN9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore();
const googleAuthProvider = new GoogleAuthProvider()

export {
    db,
    googleAuthProvider,
    analytics
}