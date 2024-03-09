// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2vnt4fszwFMltCxAl8oa8n86d9uZq0po",
  authDomain: "examen-api-39794.firebaseapp.com",
  databaseURL: "https://examen-api-39794-default-rtdb.firebaseio.com",
  projectId: "examen-api-39794",
  storageBucket: "examen-api-39794.appspot.com",
  messagingSenderId: "850854220421",
  appId: "1:850854220421:web:4cc06a50f9bab34f550fec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);