import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB35J2znRvn2neTryNHsB1JJjBwQyEo9ag",
  authDomain: "flatly-8b57f.firebaseapp.com",
  projectId: "flatly-8b57f",
  storageBucket: "flatly-8b57f.firebasestorage.app",
  messagingSenderId: "114892916718",
  appId: "1:114892916718:web:6822694fedfd5caeaeb0ff",
  measurementId: "G-HDZWS2YQWR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);