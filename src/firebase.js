
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "spendsmart-f627d.firebaseapp.com",
  projectId: "spendsmart-f627d",
  storageBucket: "spendsmart-f627d.appspot.com",
  messagingSenderId: "288719077783",
  appId: "1:288719077783:web:672c81562a868f2fe384d2",
  measurementId: "G-S15CGCVCLQ"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
