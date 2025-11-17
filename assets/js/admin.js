// ---------------------------------------------
// admin.js — Gestión completa del panel admin
// ---------------------------------------------

import { auth, db, logoutUser, isAdmin } from "./firebase.js";
import {
  ref,
  push,
  set,
  onValue,
  update,
  remove
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// -------------------------------
// ELEMENTOS DEL DOM
// -------------------------------
const form = document.getElementById("addProductForm");
const adminGrid = document.getElementById("adminProducts");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const authSection = document.getElementById("user-info");

// -------------------------------
// CONTROL DE ACCESO
// -------------------------------
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("⚠️ Debes iniciar sesión para acceder al panel.");
    window.location.href = "login.html";
    return;
  }

  const admin = await isAdmin(user.uid);
  if (!admin) {
    alert("⛔ No tienes permiso para acceder a esta sección.");
    window.location.href = "../index.html";
    return;
  }

  const name = user.displayName || "Administrador";
  const photo = user.photoURL || "../assets/img/user.png";

  authSection.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <img src="${photo}" class="user-photo">
      <span>${name}</span>
      <button id="logoutBtn" class="btn-ghost">Salir</button>
    </div>
  `;

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await logoutUser();
    window.location.href = "../index.html";
  });

  loadProducts();
});

// -------------------------------
// CARGAR PRODUCTOS
// -------------------------------
function loadProducts() {
  const productsRef = ref(db, "products");

  onValue(productsRef, (snap) => {
    const data = snap.val() || {};
    const searchTerm = searchInput.value.toLowerCase();
    const filterType = typeFilter.value;

    const list = Object.entries(data)
      .map(([id, p]) => ({ id, ...p }))
      .filter((p) => {
        const matchName = p.name.toLowerCase().includes(searchTerm);
        const matchType =
          filterType === "all" || p.aroma?.toLowerCase() === filterType;

        return matchName && matchType;
      });

    adminGrid.innerHTML = list.length
      ? list
          .map(
            (p) => `
        <div class="product-card">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.notes}</p>
          <small>${p.aroma} • ${p.ocasion} • ${p.duracion}</small>
          <p class="price">$${Number(p.price).toLocaleString()}</p>

          <div class="center" style="margin-top:10px;display:flex;gap:8px;">
            <button class="btn-ghost" onclick="editProduct('${p.id}')">Editar</button>
            <button class="btn-ghost" onclick="deleteProduct('${p.id}')">Eliminar</button>
          </div>
        </div>
      `
          )
          .join("")
      : "<p class='center text-muted'>No se encontraron productos.</p>";
  });
}

// -------------------------------
// AGREGAR PRODUCTO
// -------------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value.trim(),
    notes: form.notes.value.trim(),
    aroma: form.aroma.value.trim(),
    ocasion: form.ocasion.value.trim(),
    duracion: form.duracion.value.trim(),
    genero: form.genero.value.trim(),
    price: Number(form.price.value),
    image: form.image.value.trim(),
    active: true
  };

  const productsRef = ref(db, "products");
  await push(productsRef, data);

  alert("✅ Producto agregado");
  form.reset();
});

// -------------------------------
// ELIMINAR
// -------------------------------
window.deleteProduct = async (id) => {
  if (!confirm("¿Eliminar este producto?")) return;
  await remove(ref(db, "products/" + id));
};

// -------------------------------
// EDITAR
// -------------------------------
window.editProduct = (id) => {
  const card = document.querySelector(`#edit-${id}`);

  const productRef = ref(db, "products/" + id);

  onValue(productRef, (snap) => {
    const p = snap.val();
    if (!p) return;

    adminGrid.innerHTML = `
      <div class="form-card" style="max-width:400px;margin:auto;">
        <h3>Editar Perfume</h3>
        
        <label>Nombre</label>
        <input id="edit-name" value="${p.name}">

        <label>Descripción</label>
        <input id="edit-notes" value="${p.notes}">

        <label>Aroma</label>
        <input id="edit-aroma" value="${p.aroma}">

        <label>Ocasión</label>
        <input id="edit-ocasion" value="${p.ocasion}">

        <label>Duración</label>
        <input id="edit-duracion" value="${p.duracion}">

        <label>Género</label>
        <input id="edit-genero" value="${p.genero}">

        <label>Precio</label>
        <input id="edit-price" type="number" value="${p.price}">

        <label>Imagen (URL)</label>
        <input id="edit-image" value="${p.image}">

        <div class="center" style="margin-top:16px;display:flex;gap:10px;">
          <button class="btn-primary" onclick="saveEdit('${id}')">Guardar</button>
          <button class="btn-ghost" onclick="loadProducts()">Cancelar</button>
        </div>
      </div>
    `;
  });
};

// -------------------------------
// GUARDAR EDICIÓN
// -------------------------------
window.saveEdit = async (id) => {
  const updated = {
    name: document.getElementById("edit-name").value.trim(),
    notes: document.getElementById("edit-notes").value.trim(),
    aroma: document.getElementById("edit-aroma").value.trim(),
    ocasion: document.getElementById("edit-ocasion").value.trim(),
    duracion: document.getElementById("edit-duracion").value.trim(),
    genero: document.getElementById("edit-genero").value.trim(),
    price: Number(document.getElementById("edit-price").value),
    image: document.getElementById("edit-image").value.trim()
  };

  await update(ref(db, "products/" + id), updated);

  alert("✅ Cambios guardados");
  loadProducts();
};

// -------------------------------
// FILTROS
// -------------------------------
searchInput.addEventListener("input", loadProducts);
typeFilter.addEventListener("change", loadProducts);

