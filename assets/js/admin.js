// assets/js/admin.js
import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  ref,
  push,
  set,
  onValue,
  remove,
  update,
  child,
  get
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

/* ------------------------------
   DOM ELEMENTS
--------------------------------*/
const productForm = document.getElementById("productForm");
const editIdInput = document.getElementById("editId");
const pName = document.getElementById("p-name");
const pNotes = document.getElementById("p-notes");
const pType = document.getElementById("p-type");
const pPrice = document.getElementById("p-price");
const pImage = document.getElementById("p-image");
const pStock = document.getElementById("p-stock");
const productsList = document.getElementById("productsList");
const searchAdmin = document.getElementById("searchAdmin");
const filterType = document.getElementById("filterType");
const ordersList = document.getElementById("ordersList");
const adminName = document.getElementById("adminName");
const adminEmail = document.getElementById("adminEmail");
const statProducts = document.getElementById("statProducts");
const statOrders = document.getElementById("statOrders");
const statRevenue = document.getElementById("statRevenue");
const refreshBtn = document.getElementById("refreshBtn");
const resetFormBtn = document.getElementById("resetFormBtn");
const logoutBtn = document.getElementById("logoutBtn");

/* ------------------------------
   REFS
--------------------------------*/
const productsRef = ref(db, "products");
const ordersRef = ref(db, "orders");

/* ------------------------------
   UTILS
--------------------------------*/
function formatCurrency(n) {
  return `$${Number(n).toLocaleString()}`;
}

function emptyForm() {
  editIdInput.value = "";
  pName.value = "";
  pNotes.value = "";
  pType.value = "";
  pPrice.value = "";
  pImage.value = "";
  pStock.value = "";
}

/* ------------------------------
   AUTH CHECK
--------------------------------*/
onAuthStateChanged(auth, async user => {
  if (!user) {
    alert("Debes iniciar sesión para acceder al panel administrativo.");
    window.location.href = "/views/login.html";
    return;
  }

  const roleSnap = await get(child(ref(db), `roles/${user.uid}`));
  const role = roleSnap.exists() ? roleSnap.val() : null;

  if (role !== "admin") {
    alert("Acceso denegado.");
    await signOut(auth);
    window.location.href = "/views/login.html";
    return;
  }

  adminName.textContent = user.displayName || "Admin";
  adminEmail.textContent = user.email;

  initAdmin();
});

/* ------------------------------
   INIT PANEL
--------------------------------*/
function initAdmin() {
  productForm.addEventListener("submit", handleSaveProduct);
  searchAdmin.addEventListener("input", renderProductsOnce);
  filterType.addEventListener("change", renderProductsOnce);
  refreshBtn.addEventListener("click", () => {
    renderProductsOnce();
    renderOrdersOnce();
  });

  resetFormBtn.addEventListener("click", emptyForm);

  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "/index.html";
  });

  renderProductsOnce();
  renderOrdersOnce();
}

/* ------------------------------
   SAVE / EDIT PRODUCT
--------------------------------*/
async function handleSaveProduct(ev) {
  ev.preventDefault();

  const data = {
    name: pName.value.trim(),
    notes: pNotes.value.trim(),
    type: pType.value.trim().toLowerCase(),
    price: Number(pPrice.value || 0),
    image: pImage.value.trim(),
    active: true
  };

  try {
    data.stock = pStock.value ? JSON.parse(pStock.value) : {};
  } catch {
    alert("Stock inválido. Usa JSON válido.");
    return;
  }

  const id = editIdInput.value;

  if (id) {
    await update(child(ref(db), `products/${id}`), data);
    alert("Producto actualizado");
  } else {
    const newRef = push(productsRef);
    await set(newRef, data);
    alert("Producto creado");
  }

  emptyForm();
  renderProductsOnce();
}

/* ------------------------------
   RENDER PRODUCTS
--------------------------------*/
function renderProductsOnce() {
  get(productsRef).then(snap => {
    renderProducts(snap.exists() ? snap.val() : {});
  });
}

function renderProducts(data) {
  const arr = Object.entries(data || {}).map(([id, p]) => ({ id, ...p }));

  const q = (searchAdmin.value || "").toLowerCase();
  const t = filterType.value;

  const filtered = arr.filter(p => {
    const matchName = p.name.toLowerCase().includes(q);
    const matchType = t === "all" || p.type === t;
    return matchName && matchType;
  });

  statProducts.textContent = arr.length;

  productsList.innerHTML = filtered.length
    ? filtered.map(p => `
      <div class="product-card" style="width:100%;max-width:420px;">
        <img class="product-thumb" src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p class="muted">${p.notes}</p>
        <p class="small">Tipo: ${p.type}</p>
        <p class="price">${formatCurrency(p.price)}</p>
        <p class="small">Stock: ${JSON.stringify(p.stock || {})}</p>

        <div style="margin-top:8px;display:flex;gap:8px;">
          <button class="btn-primary" onclick="window.admin_editProduct('${p.id}')">Editar</button>
          <button class="btn-ghost" onclick="window.admin_toggleActive('${p.id}')">
            ${p.active === false ? "Activar" : "Desactivar"}
          </button>
          <button class="btn-ghost" onclick="window.admin_deleteProduct('${p.id}')">Eliminar</button>
        </div>
      </div>
    `).join("")
    : `<p class="center text-muted">No hay productos.</p>`;
}

/* ------------------------------
   EDIT PRODUCT
--------------------------------*/
window.admin_editProduct = async function (id) {
  const snap = await get(child(ref(db), `products/${id}`));
  if (!snap.exists()) return alert("Producto no encontrado");

  const p = snap.val();

  editIdInput.value = id;
  pName.value = p.name;
  pNotes.value = p.notes;
  pType.value = p.type;
  pPrice.value = p.price;
  pImage.value = p.image;
  pStock.value = JSON.stringify(p.stock || {});
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/* ------------------------------
   DELETE PRODUCT
--------------------------------*/
window.admin_deleteProduct = async function (id) {
  if (!confirm("Eliminar producto?")) return;
  await remove(child(ref(db), `products/${id}`));
  alert("Producto eliminado");
  renderProductsOnce();
};

/* ------------------------------
   TOGGLE ACTIVE
--------------------------------*/
window.admin_toggleActive = async function (id) {
  const snap = await get(child(ref(db), `products/${id}`));
  if (!snap.exists()) return;
  const current = snap.val().active;

  await update(child(ref(db), `products/${id}`), { active: !current });

  renderProductsOnce();
};

/* ------------------------------
   ORDERS
--------------------------------*/
function renderOrdersOnce() {
  get(ordersRef).then(snap => {
    renderOrders(snap.exists() ? snap.val() : {});
  });
}

function renderOrders(data) {
  const arr = Object.entries(data || {}).map(([id, o]) => ({ id, ...o }))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  statOrders.textContent = arr.length;

  let revenue = 0;
  arr.forEach(o => revenue += (o.total || 0));
  statRevenue.textContent = formatCurrency(revenue);

  ordersList.innerHTML = arr.length
    ? arr.map(o => `
      <div class="product-card">
        <strong>Pedido ${o.id}</strong>
        <p class="small muted">${o.email}</p>
        <p class="small muted">Total: ${formatCurrency(o.total)}</p>

        <select id="status-${o.id}">
          <option value="pendiente">pendiente</option>
          <option value="preparando">preparando</option>
          <option value="enviado">enviado</option>
          <option value="entregado">entregado</option>
        </select>

        <button class="btn-primary" onclick="window.admin_changeOrderStatus('${o.id}')">Guardar</button>
        <button class="btn-ghost" onclick="window.admin_deleteOrder('${o.id}')">Eliminar</button>
      </div>
    `).join("")
    : `<p>No hay pedidos.</p>`;
}

window.admin_changeOrderStatus = async function (id) {
  const sel = document.getElementById(`status-${id}`);
  await update(child(ref(db), `orders/${id}`), { status: sel.value });
  alert("Estado actualizado");
};

window.admin_deleteOrder = async function (id) {
  if (!confirm("¿Eliminar pedido?")) return;
  await remove(child(ref(db), `orders/${id}`));
  alert("Pedido eliminado");
  renderOrdersOnce();
};
