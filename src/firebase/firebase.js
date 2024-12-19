// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIc7SnhKLcKnXrd7SiMBv3qJAeUCOVC28",
  authDomain: "survey-app-server-6ef65.firebaseapp.com",
  projectId: "survey-app-server-6ef65",
  storageBucket: "survey-app-server-6ef65.appspot.com",
  messagingSenderId: "777600249477",
  appId: "1:777600249477:web:7c1c180a67c9833d1f03ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// İhtiyacınıza göre Firestore veya Realtime Database'i burada da başlatabilirsiniz
// Örneğin Firestore kullanıyorsanız:
import { getFirestore } from "firebase/firestore";
const db = getFirestore(app);


export {app, db, auth}; // Uygulama örneğini dışarı aktar
