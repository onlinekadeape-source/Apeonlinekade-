let products=[], cart=[], category="All";

async function loadProducts(){
  if(!sb){ document.getElementById("products").innerHTML="<p>Please complete config.js first.</p>"; return; }
  const {data,error}=await sb.from("products").select("*").eq("active",true).order("created_at",{ascending:false});
  if(error){console.error(error);document.getElementById("products").innerHTML="<p>Products could not be loaded.</p>";return;}
  products=data||[]; buildCats(); renderProducts();
}
function buildCats(){
  const cats=["All",...new Set(products.map(p=>p.category))];
  document.getElementById("cats").innerHTML=cats.map(c=>`<button class="${c===category?'active':''}" onclick="setCategory('${c.replaceAll("'","\\'")}')">${c}</button>`).join("");
}
function setCategory(c){category=c;buildCats();renderProducts()}
function money(n){return Number(n).toLocaleString("en-LK")}
function renderProducts(){
 const q=(document.getElementById("search").value||"").toLowerCase();
 const list=products.filter(p=>(category==="All"||p.category===category)&&(p.name.toLowerCase().includes(q)||(p.description||"").toLowerCase().includes(q)));
 document.getElementById("products").innerHTML=list.map(p=>`
 <article class="card"><div class="pic">${p.image_url?`<img src="${p.image_url}" alt="">`:"🛍️"}</div>
 <div class="info"><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description||"")}</p><div class="price">Rs. ${money(p.price)}</div>
 <small>Stock: ${p.stock}</small><button ${p.stock<=0?"disabled":""} onclick="addCart('${p.id}')">🛒 Add to Cart</button></div></article>`).join("") || "<p>No products found.</p>";
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function addCart(id){const p=products.find(x=>x.id===id);let x=cart.find(x=>x.id===id);if(x)x.qty++;else cart.push({...p,qty:1});renderCart()}
function renderCart(){document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);document.getElementById("cartItems").innerHTML=cart.map(x=>`<div class="cartItem"><b>${escapeHtml(x.name)}</b><span>${x.qty} × Rs. ${money(x.price)} <button onclick="removeCart('${x.id}')">✕</button></span></div>`).join("")||"<p>Your cart is empty.</p>";document.getElementById("cartTotal").textContent=money(cart.reduce((a,x)=>a+x.price*x.qty,0))}
function removeCart(id){cart=cart.filter(x=>x.id!==id);renderCart()}
function toggleCart(){document.getElementById("cart").classList.toggle("open");document.getElementById("overlay").classList.toggle("show")}
function openWhatsApp(){window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello අපේ Online Kade, I would like to place an order.")}`,"_blank")}
function checkout(){if(!cart.length)return alert("Please add a product first.");const lines=cart.map(x=>`• ${x.name} × ${x.qty} = Rs. ${money(x.price*x.qty)}`).join("\n");const total=cart.reduce((a,x)=>a+x.price*x.qty,0);window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello අපේ Online Kade!\n\nI want to order:\n"+lines+"\n\nTotal: Rs. "+money(total))}`,"_blank")}
loadProducts();renderCart();