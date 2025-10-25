// 🟣 Datos base de productos
const perfumes = [
  { id: 1, name: "AMAVI Bleu", price: 79, notes: "Aromas cítricos y madera.", image: "p1.png" },
  { id: 2, name: "AMAVI Noir", price: 89, notes: "Notas intensas y ambaradas.", image: "p2.png" },
  { id: 3, name: "AMAVI Pure", price: 69, notes: "Fresco, floral y limpio.", image: "p3.png" }
];

// 🧩 Renderizar productos dinámicamente
function renderProducts() {
  const grid = document.getElementById("productsGrid") || document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = perfumes.map(p => `
    <div class="product-card">
      <img src="/Perfumes-AMAVI/assets/img/${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p class="text-muted">${p.notes}</p>
      <p class="price">$${p.price.toFixed(2)}</p>
      <button class="btn-primary" onclick="addToCart(${p.id})">Agregar al carrito</button>
    </div>
  `).join("");
}

// 🛒 FUNCIONES DEL CARRITO
function getCart() {
  return JSON.parse(localStorage.getItem("amavi_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("amavi_cart", JSON.stringify(cart));
}

function addToCart(id) {
  const perfume = perfumes.find(p => p.id === id);
  if (!perfume) return;

  const cart = getCart();
  const found = cart.find(i => i.id === id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ id: perfume.id, name: perfume.name, price: perfume.price, qty: 1 });
  }

  saveCart(cart);
  updateCartCount();
  alert(`🛍️ ${perfume.name} fue agregado al carrito`);
}

function updateCartCount() {
  const countSpan = document.getElementById("cartCount");
  if (!countSpan) return;
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  countSpan.textContent = totalItems;
}

// 🟡 EVENTOS AUTOMÁTICOS
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartCount();
});







