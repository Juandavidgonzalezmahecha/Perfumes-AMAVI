import { db } from "./firebase.js";
import {
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

/* ------------------------------
   DOM
--------------------------------*/
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchProducts");
const filterType = document.getElementById("filterType");

/* ------------------------------
   DB Reference
--------------------------------*/
const productsRef = ref(db, "products");

/* ------------------------------
   Renderizado
--------------------------------*/
let allProducts = {};

onValue(productsRef, snap => {
  allProducts = snap.exists() ? snap.val() : {};
  renderProducts();
});

function renderProducts() {
  const arr = Object.entries(allProducts).map(([id, p]) => ({ id, ...p }));

  // FILTROS
  const query = (searchInput.value || "").toLowerCase();
  const type = filterType.value;

  const filtered = arr.filter(p => {
    if (p.active === false) return false; // solo activos
    const matchName = p.name.toLowerCase().includes(query);
    const matchType = type === "all" || p.type === type;
    return matchName && matchType;
  });

  productsGrid.innerHTML = filtered.length
    ? filtered.map(p => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.notes}</p>
        <p class="price">$${Number(p.price).toLocaleString()}</p>

        <button class="btn-primary" onclick='addToCart("${p.id}")'>
          Agregar al carrito
        </button>
      </div>
    `).join("")
    : `<p class="center text-muted">No se encontraron productos.</p>`;
}

/* ------------------------------
   Eventos
--------------------------------*/
searchInput.addEventListener("input", renderProducts);
filterType.addEventListener("change", renderProducts);

/* ------------------------------
   CARRITO LOCAL
--------------------------------*/
window.addToCart = function (id) {
  const cart = JSON.parse(localStorage.getItem("cart") || "{}");

  if (!cart[id]) cart[id] = 1;
  else cart[id]++;

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Producto agregado al carrito 🛍️");
};
