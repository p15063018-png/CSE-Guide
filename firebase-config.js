// Import Firebase functions from CDN (correct URLs)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAf7nnX9K2K0ReopcfqziqzP5mul7kWz-4",
  authDomain: "polytechnic-video-guide.firebaseapp.com",
  projectId: "polytechnic-video-guide",
  storageBucket: "polytechnic-video-guide.firebasestorage.app",
  messagingSenderId: "382404994358",
  appId: "1:382404994358:web:9b9a896194f745ec647f97",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore for use in other files
export const auth = getAuth(app);
export const db = getFirestore(app);
