// Inicialización de Firebase para AMAVI
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB18GxR5Yc_gkpomNWyrKcx4NNNorcsiic",
  authDomain: "amavi-c8278.firebaseapp.com",
  projectId: "amavi-c8278",
  storageBucket: "amavi-c8278.firebasestorage.app",
  messagingSenderId: "1001997166005",
  appId: "1:1001997166005:web:cbc2db2fdd3408a60825fc"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);

// Inicializa la autenticación
export const auth = getAuth(app);

