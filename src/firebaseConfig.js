// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDiiMd5KEgOLYydu0r_IdNtwGzihh5_HMU",
  authDomain: "test-share-83cde.firebaseapp.com",
  projectId: "test-share-83cde",
  storageBucket: "test-share-83cde.firebasestorage.app",
  messagingSenderId: "292726347403",
  appId: "1:292726347403:web:a4eb386ecb8b53493ee68e",
  measurementId: "G-HLG1QVJMTD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db, ref, uploadBytes, getDownloadURL, collection, addDoc, getDocs };
