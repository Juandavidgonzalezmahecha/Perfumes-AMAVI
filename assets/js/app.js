const products = [
  {id:1,name:'AMAVI Bleu',price:79,desc:'Aromas cítricos y madera.',img:'assets/img/p1.png'},
  {id:2,name:'AMAVI Noir',price:89,desc:'Notas intensas y ambaradas.',img:'assets/img/p2.png'},
  {id:3,name:'AMAVI Pure',price:69,desc:'Fresco, floral y limpio.',img:'assets/img/p3.png'}
];

function renderProducts(){
  const grid = document.getElementById('productsGrid');
  if(!grid) return;
  grid.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p class="text-muted">${p.desc}</p>
      <div class="price">$${p.price.toFixed(2)}</div>
      <div style="margin-top:10px">
        <button class="btn-primary" onclick="addToCart(${p.id})">Agregar</button>
      </div>
    `;
    grid.appendChild(card);
  })
}

function getCart(){
  return JSON.parse(localStorage.getItem('amavi_cart')||'[]');
}
function saveCart(cart){
  localStorage.setItem('amavi_cart',JSON.stringify(cart));
}
function addToCart(id){
  const product = products.find(p=>p.id===id);
  if(!product) return;
  const cart = getCart();
  const found = cart.find(i=>i.id===id);
  if(found) found.qty +=1; else cart.push({id:product.id,name:product.name,price:product.price,qty:1});
  saveCart(cart);
  alert(`Agregado: ${product.name}`);
}

document.addEventListener('DOMContentLoaded',()=>{ renderProducts(); });





