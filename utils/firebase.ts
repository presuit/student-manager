import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore, collection, addDoc, WithFieldValue, DocumentData, getDocs, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { TFBCollection } from '../types/firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyBsnyFFxywldPIylLaTSfZ4PrOJLQ22i5M',
  authDomain: 'students-manager-13336.firebaseapp.com',
  projectId: 'students-manager-13336',
  storageBucket: 'students-manager-13336.appspot.com',
  messagingSenderId: '784186781356',
  appId: '1:784186781356:web:85c0eb117a0e43301bf909',
}

const app = initializeApp(firebaseConfig)
const fbAuth = getAuth(app)
const googleProvider = new GoogleAuthProvider()
const fbDb = getFirestore(app)

export async function loginWithGoogle() {
  return signInWithPopup(fbAuth, googleProvider)
}

// firestore utility func
export function getCollection(_collection: TFBCollection) {
  return collection(fbDb, _collection)
}

export function getCollectionData(colleciton: TFBCollection) {
  return getDocs(getCollection(colleciton))
}

export function createCollectionData<T extends WithFieldValue<DocumentData>>(collection: TFBCollection, data: T) {
  return addDoc(getCollection(collection), data)
}

export function getSingleCollectionData(collection: TFBCollection, query: string) {
  const docRef = doc(fbDb, collection, query)
  return getDoc(docRef)
}

export function updateCollectionData(collection: TFBCollection, id: string, updateData: unknown) {
  const docRef = doc(fbDb, collection, id)
  return setDoc(docRef, updateData)
}

export function deleteCollectionData(collection: TFBCollection, id: string) {
  const docRef = doc(fbDb, collection, id)
  return deleteDoc(docRef)
}
