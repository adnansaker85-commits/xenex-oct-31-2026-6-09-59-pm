import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCAWg2IzVg7527Hzfvo4FUYP9pq_cLYWGY",
  authDomain: "xenexapp.firebaseapp.com",
  databaseURL: "https://xenexapp-default-rtdb.firebaseio.com",
  projectId: "xenexapp",
  storageBucket: "xenexapp.firebasestorage.app",
  messagingSenderId: "22715281267",
  appId: "1:22715281267:web:4f2cae0439fb457132df06",
  measurementId: "G-M76EYHPGNF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
