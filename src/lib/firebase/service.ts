import { addDoc, collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore"
import app from './init'
import { getDatabase } from "firebase/database";
import { CartItem } from "@/types/cart";

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

export async function retrieveDataById(collectionName: string, id: string){
    const snapshot = await getDoc(doc(firestore, collectionName, id))
    const data = snapshot.data()
    return data 
}

export async function addDataFirebase(payload: CartItem) {
    const docRef = await addDoc(collection(firestore,"carts"),{
        ...payload,
        createdAt: new Date()
    })
}