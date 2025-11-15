// assets/js/firebase.js
// Importar SDKs de Firebase versión 12.6.0
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Tu configuración (la que te dio Firebase)
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

// Auth y Firestore exportados
export const auth = getAuth(app);
export const db = getFirestore(app);

// -----------------------------
// 📌 REGISTRAR USUARIO (correo + contraseña)
//    - crea cuenta
//    - setea displayName
//    - envía email de verificación
//    - cierra sesión para que el usuario verifique desde su correo
// -----------------------------
export async function registerUser(name, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar displayName
    if (name && name.trim() !== "") {
      try {
        await updateProfile(user, { displayName: name });
      } catch (err) {
        // no crítico; sigue adelante
        console.warn("No se pudo actualizar displayName:", err);
      }
    }

    // Enviar correo de verificación
    await sendEmailVerification(user);

    // Cerrar sesión para evitar sesiones de cuentas no verificadas
    await signOut(auth);

    return { ok: true };
  } catch (error) {
    // lanzar para que el caller use try/catch
    throw new Error(error.message || "Error al registrar usuario");
  }
}

// -----------------------------
// 📌 INICIAR SESIÓN (correo + contraseña)
//    - Solo permite si emailVerified === true
// -----------------------------
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      // Cerrar sesión y avisar
      await signOut(auth);
      throw new Error("Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja y confirma el enlace.");
    }

    return { ok: true, user };
  } catch (error) {
    throw new Error(error.message || "Error al iniciar sesión");
  }
}

// -----------------------------
// 📌 LOGIN CON GOOGLE (solo login — no registro por Google separado)
//    - Google cuenta como verificado
// -----------------------------
const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // result.user es un usuario verificado por Google
    return { ok: true, user: result.user };
  } catch (error) {
    throw new Error(error.message || "Error al iniciar sesión con Google");
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
    throw new Error(error.message || "Error al solicitar recuperación de contraseña");
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
    throw new Error(error.message || "Error al cerrar sesión");
  }
}





