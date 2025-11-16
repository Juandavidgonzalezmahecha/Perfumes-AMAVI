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
   ELEMENTOS DOM
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
   UTILS
--------------------------------*/
const productsRef = ref(db, "products");
const ordersRef = ref(db, "orders");
const rolesRef = ref(db, "roles");

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
   AUTH => validar admin
--------------------------------*/
onAuthStateChanged(auth, async user => {
  if (!user) {
    // No autenticado
    alert("Debes iniciar sesión para acceder al panel administrativo.");
    window.location.href = "/views/login.html";
    return;
  }

  // Revisar rol en Realtime DB: roles/{uid} === 'admin'
  const roleSnap = await get(child(ref(db), `roles/${user.uid}`));
  const role = roleSnap.exists() ? roleSnap.val() : null;

  if (role !== "admin") {
    alert("Acceso denegado: no tienes permisos de administrador.");
    await signOut(auth);
    window.location.href = "/views/login.html";
    return;
  }

  // Si llegó hasta aquí es admin
  adminName.textContent = user.displayName || "Admin";
  adminEmail.textContent = user.email;
  initAdmin();
});

/* ------------------------------
   INICIALIZADOR
--------------------------------*/
function initAdmin() {
  // Eventos
  productForm.addEventListener("submit", handleSaveProduct);
  searchAdmin.addEventListener("input", renderProductsOnce);
  filterType.addEventListener("change", renderProductsOnce);
  refreshBtn.addEventListener("click", () => { renderProductsOnce(); renderOrdersOnce(); });
  resetFormBtn.addEventListener("click", emptyForm);
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "/index.html";
  });

  // Cargas iniciales
  renderProductsOnce();
  renderOrdersOnce();
}

/* ------------------------------
   GUARDAR / EDITAR PRODUCTO
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

  // Stock parse
  try {
    data.stock = pStock.value ? JSON.parse(pStock.value) : {};
  } catch (err) {
    alert("Stock inválido. Usa JSON válido: {\"grande\":10,\"mediano\":5}");
    return;
  }

  const id = editIdInput.value;
  if (id) {
    // editar
    await update(child(ref(db), `products/${id}`), data);
    alert("✅ Producto actualizado");
  } else {
    // crear -> push
    const newRef = push(productsRef);
    await set(newRef, data);
    alert("✅ Producto creado");
  }

  emptyForm();
  renderProductsOnce();
}

/* ------------------------------
   RENDER LISTA DE PRODUCTOS (UNA VEZ)
--------------------------------*/
let lastProductsSnapshot = null;
function renderProductsOnce() {
  // Usamos onValue para escuchar cambios en products, pero aquí hacemos una lectura puntual
  get(productsRef).then(snap => {
    const data = snap.exists() ? snap.val() : {};
    lastProductsSnapshot = data;
    renderProducts(data);
  });
}

function renderProducts(data) {
  const arr = Object.entries(data || {}).map(([id, p]) => ({ id, ...p }));

  // filtros
  const q = (searchAdmin.value || "").toLowerCase();
  const t = filterType.value || "all";

  const filtered = arr.filter(p => {
    const matchName = p.name.toLowerCase().includes(q);
    const matchType = t === "all" || (p.type && p.type.toLowerCase() === t);
    return matchName && matchType;
  });

  // stats
  statProducts.textContent = arr.length;

  productsList.innerHTML = filtered.length ? filtered.map(p => {
    return `
      <div class="product-card" style="width:100%;max-width:420px;">
        <img class="product-thumb" src="${p.image || '/assets/img/default-product.png'}" alt="${p.name}" />
        <h3 style="margin-top:8px;">${p.name}</h3>
        <p class="muted">${p.notes}</p>
        <p class="small">Tipo: ${p.type || '-'}</p>
        <p class="price">${formatCurrency(p.price)}</p>
        <p class="small">Stock: ${p.stock ? JSON.stringify(p.stock) : "{}"}</p>
        <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn-primary" onclick="window.admin_editProduct('${p.id}')">Editar</button>
          <button class="btn-ghost" onclick="window.admin_toggleActive('${p.id}')">${p.active === false ? 'Activar' : 'Desactivar'}</button>
          <button class="btn-ghost" style="background:transparent;" onclick="window.admin_deleteProduct('${p.id}')">Eliminar</button>
        </div>
      </div>
    `;
  }).join("") : `<p class="center text-muted">No hay productos.</p>`;
}

/* ------------------------------
   EXPORTS AL WINDOW (para onclick html)
--------------------------------*/
window.admin_editProduct = async function (id) {
  const snap = await get(child(ref(db), `products/${id}`));
  if (!snap.exists()) { alert("Producto no encontrado"); return; }
  const p = snap.val();
  editIdInput.value = id;
  pName.value = p.name || "";
  pNotes.value = p.notes || "";
  pType.value = p.type || "";
  pPrice.value = p.price || "";
  pImage.value = p.image || "";
  pStock.value = p.stock ? JSON.stringify(p.stock) : "";
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.admin_deleteProduct = async function (id) {
  if (!confirm("Eliminar producto permanentemente?")) return;
  await remove(child(ref(db), `products/${id}`));
  alert("🗑️ Producto eliminado");
  renderProductsOnce();
};

window.admin_toggleActive = async function (id) {
  const snap = await get(child(ref(db), `products/${id}`));
  if (!snap.exists()) return;
  const current = snap.val().active;
  await update(child(ref(db), `products/${id}`), { active: !!(!current === true ? false : !current) });
  // simpler: set to opposite
  await update(child(ref(db), `products/${id}`), { active: current === false ? true : false });
  renderProductsOnce();
};

/* ------------------------------
   PEDIDOS: render y acciones
   (espera que la app frontend empuje pedidos a /orders)
--------------------------------*/
let lastOrdersSnapshot = null;
function renderOrdersOnce() {
  get(ordersRef).then(snap => {
    const data = snap.exists() ? snap.val() : {};
    lastOrdersSnapshot = data;
    renderOrders(data);
  });
}

function renderOrders(data) {
  const arr = Object.entries(data || {}).map(([id, o]) => ({ id, ...o })).sort((a,b)=> (b.createdAt||0)-(a.createdAt||0));
  statOrders.textContent = arr.length;

  let revenue = 0;
  arr.forEach(o => {
    revenue += (o.total || 0);
  });
  statRevenue.textContent = formatCurrency(revenue);

  ordersList.innerHTML = arr.length ? arr.map(o => {
    const status = o.status || "pendiente";
    const badgeClass = `status-badge ${status==='pendiente'?'status-pendiente':status==='preparando'?'status-preparando':status==='enviado'?'status-enviado':'status-entregado'}`;
    return `
      <div class="product-card" style="margin-bottom:10px;">
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <div style="flex:1;">
            <strong>Pedido: ${o.id || '(sin id)'}</strong>
            <div class="small muted">Cliente: ${o.customerName || o.email || '—'}</div>
            <div class="small muted">Total: ${formatCurrency(o.total || 0)}</div>
            <div class="small muted">Creado: ${new Date(o.createdAt || Date.now()).toLocaleString()}</div>
            <div style="margin-top:8px;">
              <details>
                <summary class="small">Ver productos (${o.items ? Object.keys(o.items).length : 0})</summary>
                <div style="margin-top:8px;">
                  ${(o.items ? Object.entries(o.items).map(([pid, it]) => `<div style="margin-bottom:6px;">
                    <strong>${it.name}</strong> x${it.qty} — ${formatCurrency(it.price)}
                  </div>`).join('') : '<div class="small muted">No hay items</div>')}
                </div>
              </details>
            </div>
          </div>
          <div style="width:160px;text-align:right;">
            <div class="${badgeClass}">${status}</div>
            <div style="margin-top:8px;">
              <select id="status-${o.id}">
                <option value="pendiente">pendiente</option>
                <option value="preparando">preparando</option>
                <option value="enviado">enviado</option>
                <option value="entregado">entregado</option>
              </select>
              <div style="margin-top:8px;">
                <button class="btn-primary" onclick="window.admin_changeOrderStatus('${o.id}')">Guardar estado</button>
                <button class="btn-ghost" onclick="window.admin_deleteOrder('${o.id}')">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('') : `<p class="center text-muted">No hay pedidos aún.</p>`;
}

/* ------------------------------
  Cambiar estado y eliminar pedido
--------------------------------*/
window.admin_changeOrderStatus = async function (id) {
  const sel = document.getElementById(`status-${id}`);
  if (!sel) return alert("select not found");
  const newStatus = sel.value;
  await update(child(ref(db), `orders/${id}`), { status: newStatus });
  alert("Estado actualizado");
  renderOrdersOnce();
};

window.admin_deleteOrder = async function (id) {
  if (!confirm("Eliminar pedido?")) return;
  await remove(child(ref(db), `orders/${id}`));
  alert("Pedido eliminado");
  renderOrdersOnce();
};

/* ------------------------------
   Escucha en tiempo real (opcional)
   También puedes usar polling con renderProductsOnce()
--------------------------------*/
onValue(productsRef, (snap) => {
  const d = snap.exists() ? snap.val() : {};
  lastProductsSnapshot = d;
  renderProducts(d);
});

onValue(ordersRef, (snap) => {
  const d = snap.exists() ? snap.val() : {};
  lastOrdersSnapshot = d;
  renderOrders(d);
});
