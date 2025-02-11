import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBj5Ec8XNj9qSH-QXW4uaCugbMJeFzSBDA",
  authDomain: "bhaw-bhaw.firebaseapp.com",
  projectId: "bhaw-bhaw",
  storageBucket: "bhaw-bhaw.appspot.com",
  messagingSenderId: "560201072377",
  appId: "1:560201072377:web:e6de079fd4ecf076c5ac28",
  measurementId: "G-8H9K8L77X6"
};
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
