// firebase.js

// Import the necessary functions from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"; // <-- UPDATED LINE

const firebaseConfig = {
  apiKey: "AIzaSyDNAtg7HR9-AsXtARV_xnztFhrWHvtbJz0",
  authDomain: "optimal-human.firebaseapp.com",
  databaseURL: "https://optimal-human-default-rtdb.firebaseio.com",
  projectId: "optimal-human",
  storageBucket: "optimal-human.appspot.com",
  messagingSenderId: "90069176733",
  appId: "1:90069176733:web:c75cf0fd7c5c21be2a1f74",
  measurementId: "G-WFMNY0SWL8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export everything you'll need in other files
export { 
  auth, 
  provider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut, 
  db, 
  doc, 
  setDoc, 
  getDoc,
  collection,    // <-- ADDED
  getDocs,       // <-- ADDED
  updateDoc      // <-- ADDED
};