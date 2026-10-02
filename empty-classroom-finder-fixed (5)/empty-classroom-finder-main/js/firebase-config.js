// Firebase Configuration & Initialization

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Day 1-er config (apiKey, authDomain, etc.)
const firebaseConfig = {
  apiKey: "AIzaSyCpcEMgfV58A6tPlm3urK519Lv6XBHNCcY",
  authDomain: "empty-classroom-finder-e86cd.firebaseapp.com",
  projectId: "empty-classroom-finder-e86cd",
  storageBucket: "empty-classroom-finder-e86cd.firebasestorage.app",
  messagingSenderId: "628282212531",
  appId: "1:628282212531:web:4b2c6ad28ad7cc21b370c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

console.log("✅ Firebase connected successfully!", app);