import { db, storage } from "@/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

export async function getAllUsersFromFireStore() {
    try {
      const tagsCollection = collection(db, "users");
      const tagsQuery = query(tagsCollection);
  
      const querySnapshot = await getDocs(tagsQuery);
  
      const tags = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      tags.sort((a, b) => {
        //@ts-ignore
        return b.updatedAt - a.updatedAt;
      });
      return tags;
    } catch (error) {
      console.error("Error fetching all tags:", error);
      return [];
    }
}


