import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnzY4H_WbLCydn5zpCipJ66reZuavp5UI",
  authDomain: "portfolio-33e86.firebaseapp.com",
  projectId: "portfolio-33e86",
  storageBucket: "portfolio-33e86.appspot.com",
  messagingSenderId: "970883992752",
  appId: "1:970883992752:web:0fa84b8d9eecd504717f75",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default db;
export { auth };
