import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAUv4mDaTr3XY5qnLT08hx8eECGtsP3beE",
  authDomain: "bus-teknologi-a772c.firebaseapp.com",
  databaseURL: "https://bus-teknologi-a772c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bus-teknologi-a772c",
  storageBucket: "bus-teknologi-a772c.appspot.com",
  messagingSenderId: "11058095143",
  appId: "1:11058095143:web:e49a26bf0aa1b5e84f9a02",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

export { auth, db };
