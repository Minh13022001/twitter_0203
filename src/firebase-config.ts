import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC29Ca-GIp5-lSvPCNz-QghftCcaoJ86FA",
  authDomain: "my-twitter-250dd.firebaseapp.com",
  projectId: "my-twitter-250dd",
  storageBucket: "my-twitter-250dd.appspot.com",
  messagingSenderId: "747662931023",
  appId: "1:747662931023:web:11c3d86eedc64ccb5aa63a",
  measurementId: "G-38P594VP2W",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage();

export const db = getFirestore(app);
