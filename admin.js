let editingId=null;
async function login(){
 if(!sb)return msg("loginMsg","config.js එක setup කරන්න.","red");
 const {error}=await sb.auth.signInWithPassword({email:email.value,password:password.value});
 if(error)return msg("loginMsg",error.message,"red");
 showAdmin();
}
async function showAdmin(){
 const {data}=await sb.auth.getSession();
 if(!data.session)return;
 loginBox.hidden=true;adminApp.hidden=false;loadProducts();
}
async function logout(){await sb.auth.signOut();location.reload()}
function msg(id,t,c){const e=document.getElementById(id);e.textContent=t;e.style.color=c==="red"?"#d71920":"#16834b"}
async function loadProducts(){
 const {data,error}=await sb.from("products").select("*").order("created_at",{ascending:false});
 if(error)return msg("saveMsg",error.message,"red");
 document.getElementById("adminProducts").innerHTML=(data||[]).map(p=>`
 <div class="adminItem"><div>${p.image_url?`<img src="${p.image_url}">`:"🛍️"}</div><div class="grow"><b>${escapeHtml(p.name)}</b><small>${p.category} · Rs. ${Number(p.price).toLocaleString()} · Stock ${p.stock}</small></div>
 <button onclick='editProduct(${JSON.stringify(p)})'>Edit</button><button class="danger" onclick="deleteProduct('${p.id}')">Delete</button></div>`).join("")||"<p>No products yet.</p>";
}
function editProduct(p){editingId=p.id;pname.value=p.name;price.value=p.price;category.value=p.category;desc.value=p.description||"";stock.value=p.stock;preview.hidden=!p.image_url;preview.src=p.image_url||"";window.scrollTo({top:0,behavior:"smooth"})}
function clearForm(){editingId=null;pname.value="";price.value="";desc.value="";stock.value=10;image.value="";preview.hidden=true;saveMsg.textContent=""}
async function saveProduct(){
 if(!sb)return msg("saveMsg","config.js එක setup කරන්න.","red");
 const name=pname.value.trim(), pr=Number(price.value), cat=category.value;
 if(!name||!pr)return msg("saveMsg","Name සහ Price අවශ්‍යයි.","red");
 let imageUrl=null;
 if(editingId){const {data}=await sb.from("products").select("image_url").eq("id",editingId).single();imageUrl=data?.image_url||null}
 const file=image.files[0];
 if(file){
   const ext=file.name.split(".").pop().toLowerCase();const path=`${crypto.randomUUID()}.${ext}`;
   const up=await sb.storage.from("products").upload(path,file,{upsert:false});
   if(up.error)return msg("saveMsg",up.error.message,"red");
   imageUrl=sb.storage.from("products").getPublicUrl(path).data.publicUrl;
 }
 const payload={name,price:pr,category:cat,description:desc.value.trim(),stock:Number(stock.value)||0,image_url:imageUrl,active:true};
 const result=editingId?await sb.from("products").update(payload).eq("id",editingId):await sb.from("products").insert(payload);
 if(result.error)return msg("saveMsg",result.error.message,"red");
 msg("saveMsg",editingId?"Product updated!":"Product added!","green");clearForm();loadProducts();
}
async function deleteProduct(id){if(!confirm("Delete this product?"))return;const {error}=await sb.from("products").delete().eq("id",id);if(error)return alert(error.message);loadProducts()}
function escapeHtml(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
sb?.auth.getSession().then(showAdmin);