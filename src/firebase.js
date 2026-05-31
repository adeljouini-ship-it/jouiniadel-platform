import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAxklWr7a3uXbPNQTPeffQuL5WcDG3hI0",
  authDomain: "jouiniadel-platform.firebaseapp.com",
  projectId: "jouiniadel-platform",
  storageBucket: "jouiniadel-platform.firebasestorage.app",
  messagingSenderId: "657612465993",
  appId: "1:657612465993:web:bd8eb4b17dc91c2ab35c98"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;