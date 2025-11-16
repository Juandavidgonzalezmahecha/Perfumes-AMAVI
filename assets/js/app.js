// assets/js/app.js 

import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// 🛒 Carrito local
export function getCart() {
  return JSON.parse(localStorage.getItem("amavi_cart") || "[]");
}

export function saveCart(cart) {
  localStorage.setItem("amavi_cart", JSON.stringify(cart));
}

// 🛒 Agregar al carrito
export function addToCart(prod) {
  const cart = getCart();
  const found = cart.find(i => i.id === prod.id);

  if (found) {
    found.qty++;
  } else {
    cart.push({ ...prod, qty: 1 });
  }

  saveCart(cart);
  alert(`🛍️ ${prod.name} fue agregado al carrito`);
  updateCartCount();
}

// 🔢 Contador de carrito
export function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;

  const total = getCart().reduce((s, i) => s + i.qty, 0);
  el.textContent = total;
}

// 🖼️ Renderizar productos desde Firebase en index.html y products.html
export function renderProducts() {
  const grid = document.getElementById("productsGrid") || document.getElementById("productGrid");
  if (!grid) return;

  const productsRef = ref(db, "products");

  onValue(productsRef, (snapshot) => {
    const data = snapshot.val() || {};

    grid.innerHTML = Object.entries(data)
      .filter(([, p]) => p.active !== false)
      .map(([id, p]) => `
        <div class="product-card">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="text-muted">${p.notes}</p>
          <p class="price">$${Number(p.price).toLocaleString()}</p>

          <button class="btn-primary"
            onclick='addToCart(${JSON.stringify({ id, ...p })})'>
            Agregar al carrito
          </button>

          <button class="btn-secondary"
            onclick="location.href='views/product.html?id=${id}'">
            Ver más
          </button>
        </div>
      `).join("");
  });
}

// Render automático
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartCount();
});








