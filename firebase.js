// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEt0jMDTBi-wlxHJCLoieDMhV761vZRw4",
  authDomain: "flashcard-f8c8e.firebaseapp.com",
  projectId: "flashcard-f8c8e",
  storageBucket: "flashcard-f8c8e.appspot.com",
  messagingSenderId: "968956458049",
  appId: "1:968956458049:web:43a09395485448665542c0",
  measurementId: "G-MPZ4LTPVQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export{db}