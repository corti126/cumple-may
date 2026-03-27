import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAafIZCnaUR6H6mkj7t4uMJEb5eQQ2iles",
  authDomain: "cumple-may.firebaseapp.com",
  projectId: "cumple-may",
  storageBucket: "cumple-may.firebasestorage.app",
  messagingSenderId: "838863432747",
  appId: "1:838863432747:web:a7485192466fa757240e6e",
  measurementId: "G-1LX3KNGK5G"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);