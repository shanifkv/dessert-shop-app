/**
 * src/app/firebase.ts
 * Replace the firebaseConfig values with the real values from
 * Firebase Console → Project settings → SDK setup & config
 */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// analytics is optional
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey:"AIzaSyBcz3rCf6ZZfyel3yqGnvnbMAeLCB8B1vw",
  authDomain:"dessert-shop-app-e71f2.firebaseapp.com",
  projectId: "dessert-shop-app-e71f2",
  storageBucket: "dessert-shop-app-e71f2.firebasestorage.app",
  messagingSenderId:"434635307806",
  appId:"1:434635307806:web:175f4c015d15226b60e70f",
  // measurementId:"G-23779Y7N51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional analytics (only if you added measurementId)
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // analytics may fail in some environments; safe to ignore for now
}

// IMPORTANT: named exports used by the rest of the app
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
