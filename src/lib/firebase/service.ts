import { toTitleCase } from "@/utils/func";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import app from "./init";
import { getDatabase } from "firebase/database";
import { CartItem } from "@/types/cart";
import { User } from "@/types/user";
import { MenuItemApi } from "@/types/menus";
const firestore = getFirestore(app);
const realtimeDb = getDatabase(app);

export async function retrieveData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
}

export async function addMenu(
  collectionName: string = "menus",
  menuData: Omit<MenuItemApi, "id" | "createdAt">
): Promise<string> {
  try {
    menuData = { ...menuData, name: toTitleCase(menuData.name) }; // cuma mengubah agar nama nya jadi title case
    const newDocRef = doc(collection(firestore, collectionName));
    const completeMenuData: MenuItemApi = {
      ...menuData,
      createdAt: new Date(),
    };

    await setDoc(newDocRef, completeMenuData);
    return newDocRef.id;
  } catch (error) {
    console.error("Error adding menu:", error);
    throw new Error("Failed to add menu");
  }
}

export async function retrieveDataMenusById(
  collectionName: string,
  id: string
) {
  const snapshot = await getDoc(doc(firestore, collectionName, id));
  const data = snapshot.data();
  return data;
}

export async function addDataFirebase(
  collectionName: string,
  payload: { cart?: CartItem; user?: User; code?: number | string; id?: string }
) {
  const newDocRef = doc(collection(firestore, collectionName));

  await setDoc(newDocRef, {
    ...payload,
    id: newDocRef.id, // Gunakan ID yang sudah dibuat
    isReady: false,
    createdAt: new Date(),
  });

  return newDocRef.id;
}

export async function updateOrderStatus(
  collectionName: string,
  docId: string,
  isReady: boolean
): Promise<boolean> {
  try {
    const orderRef = doc(firestore, collectionName, docId);
    await updateDoc(orderRef, {
      isReady: isReady,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
}

export async function deleteMenu(collectionName: string, id: string) {
  try {
    const docRef = doc(firestore, collectionName, id);
    const response = await getDoc(docRef);
    if (response.exists()) {
      await deleteDoc(docRef);
      return response.data();
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error delete doc");
    return false;
  }
}

// export async function deleteAllDataQR(collectionName: string){
//     const docRef = await delete
// }

export const findDataFirebaseByName = async (c: string, name: string) => {
  const q = query(collection(firestore, c), where("name", "==", name));
  const querySnapshot = await getDocs(q);

  const result: MenuItemApi[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    result.push({
      id: doc.id,
      name: data.name,
      quantity: data.quantity,
      category: data.category,
      image: data.image,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
    });
  });

  return result;
};
