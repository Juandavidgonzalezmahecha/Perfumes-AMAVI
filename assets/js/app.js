// assets/js/app.js 

import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

/* -----------------------------------------
   💰 PRECIOS POR TAMAÑO (OPCIÓN A)
------------------------------------------*/
export const SIZE_PRICES = {
  5: 5000,
  10: 10000,
  50: 30000,
  100: 50000
};

export function getSelectedSize() {
  const stored = Number(localStorage.getItem("amavi_size_ml"));
  return SIZE_PRICES[stored] ? stored : 5; // por defecto 5 ml
}

export function setSelectedSize(ml) {
  if (SIZE_PRICES[ml]) {
    localStorage.setItem("amavi_size_ml", String(ml));
  }
}

/* -----------------------------------------
   🛒 CARRITO LOCAL
------------------------------------------*/
export function getCart() {
  return JSON.parse(localStorage.getItem("amavi_cart") || "[]");
}

export function saveCart(cart) {
  localStorage.setItem("amavi_cart", JSON.stringify(cart));
}

/* -----------------------------------------
   🛒 AGREGAR AL CARRITO
   - Usa tamaño seleccionado (o 5 ml por defecto)
   - Calcula precio según tabla SIZE_PRICES
   - Diferencia por perfume + ml (key)
------------------------------------------*/
export function addToCart(prod) {
  const cart = getCart();

  const sizeMl = prod.sizeMl || getSelectedSize();
  const unitPrice = SIZE_PRICES[sizeMl] ?? Number(prod.price || 0);

  const key = `${prod.id}_${sizeMl}`;

  const found = cart.find(i => i.key === key);

  if (found) {
    found.qty += 1;
  } else {
    cart.push({
      key,
      id: prod.id,
      name: prod.name,
      image: prod.image,
      sizeMl,
      price: unitPrice,
      qty: 1
    });
  }

  saveCart(cart);
  alert(`🛍️ ${prod.name} (${sizeMl} ml) fue agregado al carrito`);
  updateCartCount();
}

/* -----------------------------------------
   🔢 CONTADOR CARRITO (HEADER)
------------------------------------------*/
export function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;

  const total = getCart().reduce((s, i) => s + i.qty, 0);
  el.textContent = total;
}

/* -----------------------------------------
   🖼️ RENDER DESTACADOS (INDEX)
   - Usa precio "desde $5.000"
   - SIN botón de carrito (solo info)
------------------------------------------*/
export function renderProducts() {
  const grid = document.getElementById("productsGrid") || document.getElementById("productGrid");
  if (!grid) return;

  const productsRef = ref(db, "products");

  onValue(productsRef, (snapshot) => {
    const data = snapshot.val() || {};

    const minPrice = SIZE_PRICES[5] || 5000;

    grid.innerHTML = Object.entries(data)
      .filter(([, p]) => p.active !== false)
      .map(([, p]) => `
        <div class="product-card">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="text-muted">${p.notes}</p>
          <p class="price">Desde $${minPrice.toLocaleString()} (5 ml)</p>
        </div>
      `).join("");
  });
}

/* -----------------------------------------
   🔁 INICIALIZACIÓN GLOBAL
------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  // En index.html (que tiene productsGrid), esto mostrará destacados.
  renderProducts();
  updateCartCount();
});

// (Opcional) Exponer addToCart en window por si lo necesitas en algún HTML inline
if (typeof window !== "undefined") {
  window.addToCart = addToCart;
}








