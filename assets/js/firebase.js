// assets/js/firebase.js
// SDK Firebase 12.6
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
  getDatabase,
  ref,
  set,
  get,
  child
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBR7Z2LoBCphMZaE2UYdeqZZ-VWSWfdKvA",
  authDomain: "amavi-d04ab.firebaseapp.com",
  projectId: "amavi-d04ab",
  storageBucket: "amavi-d04ab.firebasestorage.app",
  messagingSenderId: "491388565048",
  appId: "1:491388565048:web:4d6a7211db76cf97fc58cd"
};

const app = initializeApp(firebaseConfig);

// EXPORTS
export const auth = getAuth(app);
export const db = getDatabase(app);

// -----------------------------
// LISTA DE ADMINS (por correo)
// -----------------------------
const ADMINS = [
  "est.juand.gonzalezm@unimilitar.edu.co",
  "Cristianj244488@gmail.com",
  "est.cristian.ferna1@unimilitar.edu.co ",
  "est.eybar.viasus@unimilitar.edu.co "
];

// -----------------------------
// 📌 Identificar si un usuario es admin
// -----------------------------
export async function isAdmin(uid) {
  const dbRef = ref(db);

  const roleSnap = await get(child(dbRef, `roles/${uid}`));
  const role = roleSnap.exists() ? roleSnap.val() : null;

  return role === "admin";
}

// -----------------------------
// 📌 Asignar rol admin automáticamente
// -----------------------------
async function assignAdminRoleIfNeeded(user) {
  if (!user) return;

  if (ADMINS.includes(user.email)) {
    await set(ref(db, `roles/${user.uid}`), "admin");
  }
}

// -----------------------------
// 📌 REGISTRAR USUARIO
// -----------------------------
export async function registerUser(name, email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (name) await updateProfile(user, { displayName: name });

  await sendEmailVerification(user);
  await signOut(auth);

  return { ok: true };
}

// -----------------------------
// 📌 LOGIN
// -----------------------------
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (!user.emailVerified) {
    await signOut(auth);
    throw new Error("Debes verificar tu correo antes de iniciar sesión.");
  }

  await assignAdminRoleIfNeeded(user);

  return { ok: true, user };
}

// -----------------------------
// 📌 GOOGLE LOGIN
// -----------------------------
const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  await assignAdminRoleIfNeeded(user);

  return { ok: true, user };
}

// -----------------------------
// 📌 RECUPERAR CONTRASEÑA
// -----------------------------
export async function recoverPassword(email) {
  await sendPasswordResetEmail(auth, email);
  return { ok: true };
}

// -----------------------------
// 📌 LOGOUT
// -----------------------------
export async function logoutUser() {
  await signOut(auth);
  return { ok: true };
}







