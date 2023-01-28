// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZSgOLy7boW5MNZWkXqem9od37KvKu77Q",
  authDomain: "chatties-86bf1.firebaseapp.com",
  projectId: "chatties-86bf1",
  storageBucket: "chatties-86bf1.appspot.com",
  messagingSenderId: "987163153642",
  appId: "1:987163153642:web:cf82dac384c333ea5ef393"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig