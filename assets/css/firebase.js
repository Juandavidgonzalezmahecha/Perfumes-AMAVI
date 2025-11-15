// Importar Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBR7Z2LoBCphMZaE2UYdeqZZ-VWSWfdKvA",
  authDomain: "amavi-d04ab.firebaseapp.com",
  projectId: "amavi-d04ab",
  storageBucket: "amavi-d04ab.firebasestorage.app",
  messagingSenderId: "491388565048",
  appId: "1:491388565048:web:4d6a7211db76cf97fc58cd"
};

// Inicializar la app
const app = initializeApp(firebaseConfig);

// Inicializar autenticación
export const auth = getAuth(app);

// Proveedor de Google
export const provider = new GoogleAuthProvider();

