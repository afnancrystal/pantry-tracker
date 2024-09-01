import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyAK0HvZfunecO2c7KckfttRo8e8U6RJy9U",
    authDomain: "inventory-a75dd.firebaseapp.com",
    projectId: "inventory-a75dd",
    storageBucket: "inventory-a75dd.appspot.com",
    messagingSenderId: "724646748767",
    appId: "1:724646748767:web:466243489b1b4dfae031ea"
 };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };