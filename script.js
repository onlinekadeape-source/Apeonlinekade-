const WHATSAPP_NUMBER = "94781471365"; // Replace with your WhatsApp number later.

const products = [
  {id:1,name:"Premium Couple T-Shirt",price:5900,cat:"Fashion",icon:"👕",desc:"Stylish couple wear"},
  {id:2,name:"Red & White Couple Set",price:6500,cat:"Fashion",icon:"❤️",desc:"Matching premium set"},
  {id:3,name:"Oversized Street T-Shirt",price:4200,cat:"Fashion",icon:"👚",desc:"Modern street style"},
  {id:4,name:"Smart Casual Shirt",price:4800,cat:"Fashion",icon:"👔",desc:"Clean everyday look"},
  {id:5,name:"Wireless Headphones",price:8900,cat:"Electronics",icon:"🎧",desc:"Clear sound & comfort"},
  {id:6,name:"Smart Watch",price:7500,cat:"Electronics",icon:"⌚",desc:"Smart everyday companion"},
  {id:7,name:"Home Organizer",price:2900,cat:"Home",icon:"🧺",desc:"Keep your home tidy"},
  {id:8,name:"Premium Water Bottle",price:2200,cat:"Home",icon:"🧴",desc:"Reusable daily bottle"},
  {id:9,name:"Kids Toy Set",price:3500,cat:"Kids",icon:"🧸",desc:"Fun for little ones"},
  {id:10,name:"Kids Backpack",price:3900,cat:"Kids",icon:"🎒",desc:"Cute & practical"}
];

let category="All";
let cart=[];

function money(n){return n.toLocaleString("en-LK");}

function renderProducts(){
  const q=document.getElementById("search").value.toLowerCase().trim();
  const list=products.filter(p=>(category==="All"||p.cat===category) && (p.name.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q)));
  document.getElementById("products").innerHTML=list.map(p=>`
    <article class="product">
      <div class="product-pic">${p.icon}</div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price">Rs. ${money(p.price)}</div>
        <div class="actions"><button class="add" onclick="addToCart(${p.id})">🛒 Add to Cart</button></div>
      </div>
    </article>`).join("") || "<p>No products found.</p>";
}

function setCategory(cat){
  category=cat;
  document.querySelectorAll(".cat").forEach(b=>b.classList.toggle("active",b.dataset.cat===cat));
  renderProducts();
}

function addToCart(id){
  const p=products.find(x=>x.id===id);
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;
  else cart.push({...p,qty:1});
  renderCart();
}

function removeFromCart(id){
  cart=cart.filter(x=>x.id!==id);
  renderCart();
}

function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML="<p style='color:#66748a'>Your cart is empty.</p>";document.getElementById("cartTotal").textContent="0";return;}
  box.innerHTML=cart.map(x=>`
    <div class="cart-item">
      <div><b>${x.name}</b><small>Qty: ${x.qty} × Rs. ${money(x.price)}</small></div>
      <button class="remove" onclick="removeFromCart(${x.id})">Remove</button>
    </div>`).join("");
  document.getElementById("cartTotal").textContent=money(cart.reduce((a,x)=>a+x.price*x.qty,0));
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}

function openWhatsApp(){
  const msg=encodeURIComponent("Hello අපේ Online Kade, I would like to place an order. Please send me the details.");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank");
}

function checkout(){
  if(!cart.length){alert("Please add a product first.");return;}
  const lines=cart.map(x=>`• ${x.name} × ${x.qty} = Rs. ${money(x.price*x.qty)}`).join("\n");
  const total=cart.reduce((a,x)=>a+x.price*x.qty,0);
  const msg=encodeURIComponent(`Hello අපේ Online Kade!\n\nI want to order:\n${lines}\n\nTotal: Rs. ${money(total)}\n\nPlease confirm my order.`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank");
}

renderProducts();
renderCart();