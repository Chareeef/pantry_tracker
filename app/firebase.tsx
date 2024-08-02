import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// The web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC51uWw9kHwfBHEZ76zM_KpIcyH7f3dfL4",
  authDomain: "pantry-tracker-84937.firebaseapp.com",
  projectId: "pantry-tracker-84937",
  storageBucket: "pantry-tracker-84937.appspot.com",
  messagingSenderId: "923194547443",
  appId: "1:923194547443:web:4509bb27cf9f06040b2b86",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize firestore database
export const db = getFirestore(app);
