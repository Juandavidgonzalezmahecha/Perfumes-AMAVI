// assets/js/admin.js
import { auth, db, isAdmin, logoutUser } from "./firebase.js";
import {
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  ref,
  push,
  set,
  onValue,
  update,
  remove,
  get,
  child
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

/* -----------------------------------
   REFERENCIAS DEL DOM
----------------------------------- */
const form = document.getElementById("addProductForm");
const nameInput = document.getElementById("name");
const notesInput = document.getElementById("notes");
const aromaInput = document.getElementById("aroma");
const ocasionInput = document.getElementById("ocasion");
const duracionInput = document.getElementById("duracion");
const generoInput = document.getElementById("genero");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");

const adminProducts = document.getElementById("adminProducts");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");

const adminName = document.getElementById("adminName");
const adminEmail = document.getElementById("adminEmail");
const statProducts = document.getElementById("statProducts");
const statOrders = document.getElementById("statOrders");
const statRevenue = document.getElementById("statRevenue");

/* -----------------------------------
   VARIABLES
----------------------------------- */
let editProductId = null;
const productsRef = ref(db, "products");
const ordersRef = ref(db, "orders");

/* -----------------------------------
   AUTH + VALIDACIÓN ADMIN
----------------------------------- */
onAuthStateChanged(auth, async user => {
  if (!user) {
    alert("Debes iniciar sesión.");
    return location.href = "login.html";
  }

  const admin = await isAdmin(user.uid);
  if (!admin) {
    alert("No tienes permisos de administrador.");
    await logoutUser();
    return location.href = "login.html";
  }

  adminName.textContent = user.displayName || "Admin";
  adminEmail.textContent = user.email;

  loadProducts();
  loadOrders();
});

/* -----------------------------------
   AGREGAR / EDITAR PRODUCTO
----------------------------------- */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const productData = {
    name: nameInput.value.trim(),
    notes: notesInput.value.trim(),
    aroma: aromaInput.value.trim().toLowerCase(),
    ocasion: ocasionInput.value.trim().toLowerCase(),
    duracion: duracionInput.value.trim().toLowerCase(),
    genero: generoInput.value.trim().toLowerCase(),
    price: Number(priceInput.value),
    image: imageInput.value.trim(),
    active: true
  };

  if (editProductId) {
    await update(ref(db, `products/${editProductId}`), productData);
    alert("Producto actualizado");
  } else {
    await set(push(productsRef), productData);
    alert("Producto agregado");
  }

  form.reset();
  editProductId = null;
});

/* -----------------------------------
   CARGAR PRODUCTOS EN TIEMPO REAL
----------------------------------- */
function loadProducts() {
  onValue(productsRef, (snap) => {
    const data = snap.val() || {};
    renderProducts(data);
  });
}

/* -----------------------------------
   RENDERIZAR PRODUCTOS
----------------------------------- */
function renderProducts(data) {
  const arr = Object.entries(data).map(([id, p]) => ({ id, ...p }));
  statProducts.textContent = arr.length;

  const query = searchInput.value.toLowerCase();
  const filter = typeFilter.value;

  const filtered = arr.filter(p => {
    const matchName = p.name.toLowerCase().includes(query);
    const matchType = filter === "all" || p.aroma.includes(filter);
    return matchName && matchType;
  });

  adminProducts.innerHTML = filtered.map(p => `
    <div class="product-card" style="max-width:420px;">
      <img class="product-thumb" src="${p.image}" />

      <h3>${p.name}</h3>
      <p class="muted">${p.notes}</p>
      <p>Aroma: ${p.aroma}</p>
      <p>Ocasión: ${p.ocasion}</p>
      <p>Duración: ${p.duracion}</p>
      <p>Género: ${p.genero}</p>
      <p class="price">$${p.price.toLocaleString()}</p>

      <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
        <button class="btn-primary" onclick="editProduct('${p.id}')">Editar</button>
        <button class="btn-ghost" onclick="toggleActive('${p.id}', ${p.active})">
          ${p.active ? "Desactivar" : "Activar"}
        </button>
        <button class="btn-ghost" onclick="deleteProduct('${p.id}')">Eliminar</button>
      </div>
    </div>
  `).join("");
}

/* -----------------------------------
   EDITAR PRODUCTO
----------------------------------- */
window.editProduct = async function (id) {
  const snap = await get(child(ref(db), `products/${id}`));
  if (!snap.exists()) return alert("Producto no encontrado");

  const p = snap.val();
  editProductId = id;

  nameInput.value = p.name;
  notesInput.value = p.notes;
  aromaInput.value = p.aroma;
  ocasionInput.value = p.ocasion;
  duracionInput.value = p.duracion;
  generoInput.value = p.genero;
  priceInput.value = p.price;
  imageInput.value = p.image;

  window.scrollTo({ top: 0, behavior: "smooth" });
};

/* -----------------------------------
   ELIMINAR PRODUCTO
----------------------------------- */
window.deleteProduct = async function (id) {
  if (!confirm("¿Eliminar producto?")) return;
  await remove(ref(db, `products/${id}`));
};

/* -----------------------------------
   ACTIVAR / DESACTIVAR
----------------------------------- */
window.toggleActive = async function (id, current) {
  await update(ref(db, `products/${id}`), { active: !current });
};

/* -----------------------------------
   CARGAR PEDIDOS
----------------------------------- */
function loadOrders() {
  onValue(ordersRef, snap => {
    const data = snap.val() || {};
    const arr = Object.values(data);

    statOrders.textContent = arr.length;

    let total = 0;
    arr.forEach(o => total += o.total || 0);

    statRevenue.textContent = "$" + total.toLocaleString();
  });
}

/* -----------------------------------
   LOGOUT
----------------------------------- */
logoutBtn.addEventListener("click", async () => {
  await logoutUser();
  location.href = "../index.html";
});

/* -----------------------------------
   FILTROS
----------------------------------- */
searchInput.addEventListener("input", loadProducts);
typeFilter.addEventListener("change", loadProducts);
refreshBtn.addEventListener("click", loadProducts);
