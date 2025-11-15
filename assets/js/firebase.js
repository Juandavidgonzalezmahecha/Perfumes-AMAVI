// Importar SDKs de Firebase versión 12.6.0
import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Configuración de tu proyecto (la que Firebase te dio)
const firebaseConfig = {
  apiKey: "AIzaSyBR7Z2LoBCphMZaE2UYdeqZZ-VWSWfdKvA",
  authDomain: "amavi-d04ab.firebaseapp.com",
  projectId: "amavi-d04ab",
  storageBucket: "amavi-d04ab.firebasestorage.app",
  messagingSenderId: "491388565048",
  appId: "1:491388565048:web:4d6a7211db76cf97fc58cd"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// -----------------------------
// 📌 REGISTRAR USUARIO
// -----------------------------
export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { ok: true, user: userCredential.user };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

// -----------------------------
// 📌 INICIAR SESIÓN
// -----------------------------
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { ok: true, user: userCredential.user };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

// -----------------------------
// 📌 GOOGLE SIGN-IN
// -----------------------------
const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { ok: true, user: result.user };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

// -----------------------------
// 📌 RECUPERAR CONTRASEÑA
// -----------------------------
export async function recoverPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

// -----------------------------
// 📌 CERRAR SESIÓN
// -----------------------------
export async function logoutUser() {
  try {
    await signOut(auth);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}




