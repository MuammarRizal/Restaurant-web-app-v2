import { addDoc, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import app from './init'
import { getDatabase } from "firebase/database";
import { CartItem } from "@/types/cart";
import { User } from "@/types/user";
import { PayloadAction } from "@reduxjs/toolkit";

const firestore = getFirestore(app);
const realtimeDb = getDatabase(app)

export async function retrieveData(collectionName: string){
    const snapshot = await getDocs(collection(firestore, collectionName))
    const data = snapshot.docs.map((doc) =>({
        id: doc.id,
        ...doc.data()
    }));
    return data;
}

interface MenuItem {
  id?: string;
  name: string;
  quantity: number;
  category: "makanan" | "minuman";
  image: string;
  createdAt?: Date;
}

export async function addMenu(
  collectionName: string = "menus",
  menuData: Omit<MenuItem, "id" | "createdAt"> // Exclude these as they'll be auto-generated
): Promise<string> {
  try {
    // Create a new document reference with auto-generated ID
    const newDocRef = doc(collection(firestore, collectionName));
    
    // Prepare the complete menu data
    const completeMenuData: MenuItem = {
      ...menuData,

      createdAt: new Date(),
    };

    // Add the document to Firestore
    await setDoc(newDocRef, completeMenuData);
    
    return newDocRef.id;
  } catch (error) {
    console.error("Error adding menu:", error);
    throw new Error("Failed to add menu");
  }
}

export async function retrieveDataMenusById(collectionName: string, id: string){
    const snapshot = await getDoc(doc(firestore, collectionName, id))
    const data = snapshot.data()
    return data 
}

export async function addDataFirebase(collectionName: string, payload: {cart?: CartItem, user?: User, code?: number | string, id?: string}) {
    const newDocRef = doc(collection(firestore, collectionName));
    
    await setDoc(newDocRef, {
        ...payload,
        id: newDocRef.id,  // Gunakan ID yang sudah dibuat
        isReady: false,
        createdAt: new Date()
    });
    
    return newDocRef.id;
}

export async function updateOrderStatus(collectionName: string, docId: string, isReady: boolean): Promise<boolean> {
    try {
        const orderRef = doc(firestore, collectionName, docId);
        await updateDoc(orderRef, {
            isReady: isReady,
            updatedAt: new Date()
        });
        return true;
    } catch (error) {
        console.error("Error updating order status:", error);
        return false;
    }
}


// export async function deleteAllDataQR(collectionName: string){
//     const docRef = await delete
// }