/* ===== ПРОДУКТЫ ===== */

const products = [
  {id:1,title:'Круассан',price:120,cat:'buns',img:'images/1.jpg'},
  {id:2,title:'Булочка с корицей',price:140,cat:'buns',img:'images/2.jpg'},
  {id:3,title:'Шоколадный торт',price:3600,cat:'cakes',img:'images/3.jpg'},
  {id:4,title:'Пудинг',price:220,cat:'pastry',img:'images/4.jpg'},
  {id:5,title:'Шоколадное печенье',price:80,cat:'cookies',img:'images/5.jpg'},
  {id:6,title:'Яблочный пирог',price:450,cat:'cakes',img:'images/6.jpg'}
];

let cart = JSON.parse(localStorage.getItem('bakery_cart') || '{}');


/* ===== СОХРАНЕНИЕ КОРЗИНЫ ===== */

function saveCart(){
  localStorage.setItem('bakery_cart', JSON.stringify(cart));
  updateCartUI();
}


/* ===== ОТОБРАЖЕНИЕ КОРЗИНЫ ===== */

function updateCartUI(){
  const count = Object.values(cart).reduce((s,q)=>s+q,0);
  document.getElementById('cartCount').textContent = count;

  const list = document.getElementById('cartList');
  list.innerHTML = '';

  let total = 0;

  for(const idStr of Object.keys(cart)){
    const id = +idStr;
    const qty = cart[id];
    const p = products.find(x=>x.id === id);
    if(!p) continue;

    total += p.price * qty;

    const div = document.createElement('div');
    div.className = 'cart-item';

    div.innerHTML = `
      <div style="width:54px;height:54px;border-radius:8px;background:#fff4ea;display:flex;align-items:center;justify-content:center">🍞</div>

      <div class="meta">
        <div style="font-weight:700">${p.title}</div>
        <div style="font-size:13px;color:var(--muted)">x${qty}</div>
      </div>

      <div>
        <div class="qty">
          <button onclick="changeQty(${id}, -1)">−</button>
          <div style="padding:6px 8px;background:#f5f5f5;border-radius:6px">${qty}</div>
          <button onclick="changeQty(${id}, 1)">+</button>
        </div>
        <div style="margin-top:8px;color:var(--accent);font-weight:700">${p.price * qty} ₽</div>
      </div>
    `;

    list.appendChild(div);
  }

  document.getElementById('cartTotal').textContent = total + ' ₽';
}


/* ===== +/- В КОРЗИНЕ ===== */

function changeQty(id, delta){
  cart[id] = (cart[id] || 0) + delta;

  if(cart[id] <= 0){
    delete cart[id];
  }

  saveCart();
  updateProductQtyUI(id);
}


/* ===== ОЧИСТКА КОРЗИНЫ ===== */

function clearCart(){
  cart = {};
  saveCart();
  products.forEach(p => updateProductQtyUI(p.id));
}


/* ===== РЕНДЕР ТОВАРОВ ===== */

const grid = document.getElementById('grid');

for(const p of products){
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <div class="thumb">
      <img src="${p.img}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">
    </div>

    <div class="title">${p.title}</div>

    <div class="actions" style="display:flex;justify-content:space-between;align-items:center;">

      <div class="price">${p.price} ₽</div>

      <!-- Блок количества -->
      <div id="qty-${p.id}" style="display:none;align-items:center;gap:6px">
        <button onclick="changeProductQty(${p.id}, -1)" 
          style="background:#f1f1f1;border:0;padding:6px;border-radius:6px;cursor:pointer">−</button>

        <div id="qty-num-${p.id}" 
          style="padding:6px 8px;background:#f5f5f5;border-radius:6px">1</div>

        <button onclick="changeProductQty(${p.id}, 1)" 
          style="background:#f1f1f1;border:0;padding:6px;border-radius:6px;cursor:pointer">+</button>
      </div>

      <!-- Кнопка Добавить -->
      <button class="add-btn" id="add-${p.id}" onclick="addToCart(${p.id})">Добавить</button>
    </div>
  `;

  grid.appendChild(card);
}


/* ======================================================
      КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ UI,
      ИЗ-ЗА КОТОРОГО ПРОПАДАЛИ КНОПКИ
   ====================================================== */

function updateProductQtyUI(id){
  const addBtn = document.getElementById("add-" + id);
  const qtyBlock = document.getElementById("qty-" + id);
  const qtyNum = document.getElementById("qty-num-" + id);

  if(!addBtn || !qtyBlock || !qtyNum) return;

  const qty = cart[id] || 0;

  // ВСЕГДА показываем кнопку "Добавить"
  addBtn.style.display = "inline-block";

  if(qty > 0){
    qtyBlock.style.display = "flex";
    qtyNum.textContent = qty;
  } else {
    qtyBlock.style.display = "none";
    qtyNum.textContent = 1;
  }
}


/* ===== +/- В КАРТОЧКЕ ===== */

function changeProductQty(id, delta){
  cart[id] = (cart[id] || 0) + delta;

  if(cart[id] <= 0){
    delete cart[id];
  }

  saveCart();
  updateProductQtyUI(id);
}


/* ===== АНИМАЦИЯ КОРЗИНЫ ===== */

function animateCart(){
  const el = document.getElementById('cartCount');
  el.style.transition = "0.15s";
  el.style.transform = "scale(1.25)";
  setTimeout(()=> el.style.transform = "scale(1)", 150);
}


/* ===== ДОБАВИТЬ ТОВАР ===== */

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;

  saveCart();
  animateCart();
  updateProductQtyUI(id);

  // автоматически открыть корзину
  toggleDrawer(true);
}


/* ===== ФИЛЬТРЫ ===== */

document.querySelectorAll('.cat').forEach(c=>{
  c.addEventListener('click',()=>{
    const cat = c.getAttribute('data-cat');

    document.querySelectorAll('#grid .card').forEach(card=>{
      const title = card.querySelector('.title').textContent;
      const p = products.find(x=>x.title === title);

      if(cat === 'all' || p.cat === cat)
        card.style.display = 'block';
      else
        card.style.display = 'none';
    });
  });
});


/* ===== ОТКРЫТИЕ / ЗАКРЫТИЕ КОРЗИНЫ ===== */

function toggleDrawer(open=true){
  const d = document.getElementById('cartDrawer');
  open ? d.classList.add('open') : d.classList.remove('open');
}

document.getElementById('openCart').addEventListener('click',()=>toggleDrawer(true));
document.getElementById('orderNow').addEventListener('click',()=>openCheckout());


/* ===== ОФОРМЛЕНИЕ ЗАКАЗА ===== */

function openCheckout(){
  const totalItems = Object.values(cart).reduce((s,q)=>s+q,0);

  if(totalItems === 0){
    alert("Корзина пуста");
    return;
  }

  const dateInput = document.getElementById('date');
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
  dateInput.value = today;

  document.getElementById('checkoutModal').style.display='flex';
}


/* ===== ВАЛИДАЦИЯ ЗАКАЗА ===== */

function submitOrder(){
  const addr = document.getElementById('addr').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const date = document.getElementById('date').value;

  if(addr.length < 5){
    alert("Введите корректный адрес (минимум 5 символов)");
    return;
  }

  if(!/^(\+7\d{10}|8\d{10})$/.test(phone)){
    alert("Телефон должен быть в формате +7XXXXXXXXXX или 8XXXXXXXXXX");
    return;
  }

  if(!date){
    alert("Выберите дату доставки");
    return;
  }

  alert(`Заказ принят!
Адрес: ${addr}
Телефон: ${phone}
Дата: ${date}
Сумма: ${document.getElementById('cartTotal').textContent}`);

  cart = {};
  saveCart();
  document.getElementById('checkoutModal').style.display='none';
  toggleDrawer(false);

  products.forEach(p => updateProductQtyUI(p.id));
}


/* ===== ПЛАВНЫЙ СКРОЛЛ ===== */

document.querySelectorAll('nav a[data-scroll]').forEach(a=>{
  a.addEventListener('click',()=>{
    document
      .querySelector(a.getAttribute('data-scroll'))
      .scrollIntoView({behavior:'smooth'});
  });
});


/* ===== ИНИЦИАЛИЗАЦИЯ ===== */

updateCartUI();
products.forEach(p => updateProductQtyUI(p.id));
