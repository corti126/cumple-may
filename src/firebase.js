import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importamos la base de datos

const firebaseConfig = {
  apiKey: "AIzaSyAafIZCnaUR6H6mkj7t4uMJEb5eQQ2iles",
  authDomain: "cumple-may.firebaseapp.com",
  projectId: "cumple-may",
  storageBucket: "cumple-may.firebasestorage.app",
  messagingSenderId: "838863432747",
  appId: "1:838863432747:web:a7485192466fa757240e6e",
  measurementId: "G-1LX3KNGK5G"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos Firestore y lo exportamos para usarlo en otros archivos
export const db = getFirestore(app);