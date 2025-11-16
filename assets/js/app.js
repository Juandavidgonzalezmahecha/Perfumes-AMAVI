// assets/js/app.js
import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// 🛒 Carrito local (esto sí puede seguir en localStorage)
function getCart() {
  return JSON.parse(localStorage.getItem("amavi_cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("amavi_cart", JSON.stringify(cart));
}

// 🛒 Agregar al carrito
function addToCart(prod) {
  const cart = getCart();
  const found = cart.find(i => i.id === prod.id);

  if (found) found.qty++;
  else cart.push({ ...prod, qty: 1 });

  saveCart(cart);
  alert(`🛍️ ${prod.name} fue agregado al carrito`);
  updateCartCount();
}

// 🔢 Contador de carrito
function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;

  const total = getCart().reduce((s, i) => s + i.qty, 0);
  el.textContent = total;
}

// 🖼️ Renderizar productos desde Firebase
function renderProducts() {
  const grid = document.getElementById("productsGrid");
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
          <p class="price">$${p.price}</p>
          <button class="btn-primary" onclick='(${JSON.stringify(p)}) && null'>Agregar al carrito</button>
        </div>
      `).join("");
  });
}

// Render al cargar
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartCount();
});








