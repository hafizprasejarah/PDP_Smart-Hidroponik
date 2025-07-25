import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // Realtime DB
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDJraJtvDpZu543sbJ6GP1ruxQDif8H1O8",
    authDomain: "smarthidroudb.firebaseapp.com",
    databaseURL: "https://smarthidroudb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smarthidroudb",
    storageBucket: "smarthidroudb.firebasestorage.app",
    messagingSenderId: "179097944974",
    appId: "1:179097944974:web:f09b5dbbc3cacb521c9adf",
    measurementId: "G-TMV69XJHYG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);         // Firestore
export const rtdb = getDatabase(app);        // Realtime DB (jika pakai)
export const auth = getAuth(app);            // Auth (jika pakai)

