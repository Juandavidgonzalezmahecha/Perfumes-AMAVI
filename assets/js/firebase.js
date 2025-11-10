// assets/js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

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

// Exportar módulos
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// 📧 Función para registrar usuario con correo y verificar email
export async function registerUser(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  return userCredential;
}

// 🔑 Función para iniciar sesión con correo
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  if (!userCredential.user.emailVerified) {
    throw new Error("Por favor, verifica tu correo antes de iniciar sesión.");
  }
  return userCredential;
}

// 🔄 Recuperar contraseña
export async function recoverPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// 🔵 Iniciar sesión con Google
export async function loginWithGoogle() {
  return await signInWithPopup(auth, googleProvider);
}

export { onAuthStateChanged };


