// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-68008.firebaseapp.com",
    projectId: "mern-blog-68008",
    storageBucket: "mern-blog-68008.appspot.com",
    messagingSenderId: "892930636195",
    appId: "1:892930636195:web:288ad6c07e6c6a8b46c216"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);