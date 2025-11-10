// Importar funciones necesarias desde el SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Configuración de tu aplicación Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB18GxR5Yc_gkpomNWyrKcx4NNNorcsiic",
  authDomain: "amavi-c8278.firebaseapp.com",
  projectId: "amavi-c8278",
  storageBucket: "amavi-c8278.firebasestorage.app",
  messagingSenderId: "1001997166005",
  appId: "1:1001997166005:web:cbc2db2fdd3408a60825fc"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);



