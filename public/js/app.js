const CITIES=["Meerut","Delhi","Noida","Ghaziabad","Lucknow","Kanpur","Agra","Jaipur","Mumbai","Pune","Bengaluru","Hyderabad","Chennai","Kolkata","Patna","Bhopal","Indore","Chandigarh","Dehradun","Ahmedabad"];
const CATS=[["📘","School (Class 1-12)"],["🎯","JEE / NEET"],["🏛️","UPSC / Govt Exams"],["💻","Engineering"],["🩺","Medical"],["📊","Commerce & CA"],["⚖️","Law"],["📖","Fiction & Novels"],["🧠","Self-Help"],["💼","Business & Finance"],["🚀","Science & Tech"],["🧒","Kids & Children"],["🦸","Comics & Manga"],["🕉️","Religion & Spiritual"],["🎨","Art & Design"],["🍳","Cooking & Lifestyle"],["📜","History & Biography"],["🇮🇳","Hindi & Regional"],["🗣️","Languages"],["📚","Other"]];
let S={user:null,books:[],wants:[],tab:'buy',cat:''};
try{S=Object.assign(S,JSON.parse(localStorage.getItem('bb2')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('bb2',JSON.stringify(S))}catch(e){}};
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const price=m=>Math.round(m/2),hue=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return`linear-gradient(150deg,hsl(${h} 50% 38%),hsl(${(h+40)%360} 55% 25%))`};
if(!S.books.length){S.books=[
{id:1,t:"Concepts of Physics Vol 1",a:"H.C. Verma",c:"JEE / NEET",mrp:450,cond:"Good",city:"Meerut",loc:"Shastri Nagar",upi:"demo@upi",seller:"Aman",phone:"9999900001",ex:true},
{id:2,t:"Atomic Habits",a:"James Clear",c:"Self-Help",mrp:599,cond:"Like new",city:"Meerut",loc:"Abu Lane",upi:"demo@upi",seller:"Riya",phone:"9999900002",ex:true},
{id:3,t:"Lucent General Knowledge",a:"Lucent",c:"UPSC / Govt Exams",mrp:320,cond:"Fair",city:"Delhi",loc:"Laxmi Nagar",upi:"demo@upi",seller:"Karan",phone:"9999900003"},
{id:4,t:"Harry Potter and the Philosopher's Stone",a:"J.K. Rowling",c:"Fiction & Novels",mrp:499,cond:"Good",city:"Meerut",loc:"Garh Road",upi:"demo@upi",seller:"Neha",phone:"9999900004"},
{id:5,t:"Gray's Anatomy for Students",a:"Drake",c:"Medical",mrp:1800,cond:"Good",city:"Meerut",loc:"Medical College",upi:"demo@upi",seller:"Dev",phone:"9999900005"}];
S.wants=[{id:11,t:"Rich Dad Poor Dad",c:"Business & Finance",give:"Wings of Fire",note:"Any edition",loc:"Civil Lines",city:"Meerut",name:"Sana",phone:"9999900006"}]}
function init(){
$('city').innerHTML='<option value="">All cities</option>'+CITIES.map(c=>`<option>${c}</option>`).join('');
$('cities').innerHTML=CITIES.map(c=>`<option>${c}</option>`).join('');
const co=CATS.map(c=>`<option>${c[1]}</option>`).join('');$('sCat').innerHTML=co;$('wCat').innerHTML=co;
if(S.user)$('city').value=CITIES.includes(S.user.city)?S.user.city:'';
head();setTab(S.tab=='mine'?'mine':S.tab=='ex'?'ex':'buy')}
function head(){$('who').textContent=S.user?`${S.user.name} · ${S.user.city}`:'';$('loginBtn').textContent=S.user?'Logout':'Login'}
function setTab(t){if(t=='mine'&&!S.user)return openLogin();S.tab=t;document.querySelectorAll('.tabb').forEach(b=>b.classList.toggle('on',b.dataset.t==t));
$('buyView').hidden=t=='ex';$('exView').hidden=t!='ex';render()}
function openLogin(){if(S.user){S.user=null;save();head();render();return}dLogin.showModal()}
function login(){const n=lName.value.trim(),p=lPhone.value.trim(),c=lCity.value.trim();
if(!n||!/^\d{10}$/.test(p)||!c)return alert('Enter name, 10-digit phone and city');
S.user={name:n,phone:p,city:c};save();dLogin.close();$('city').value=CITIES.includes(c)?c:'';head();render()}
const need=()=>{if(!S.user){openLogin();return false}return true};
function openSell(){if(need())dSell.showModal()}
function openWant(){if(need())dWant.showModal()}
function calc(){const m=+sMrp.value;sPrice.textContent=m?`Selling price: ₹${price(m)} (50% off ₹${m})`:'Selling price will be 50% of MRP'}
function sell(){const t=sTitle.value.trim(),m=+sMrp.value,u=sUpi.value.trim();
if(!t||!m||!/^[\w.\-]+@\w+$/.test(u)||!sLoc.value.trim())return alert('Fill title, MRP, valid UPI ID and locality');
const add=img=>{S.books.unshift({id:Date.now(),t,a:sAuth.value.trim(),c:sCat.value,mrp:m,cond:sCond.value,city:S.user.city,loc:sLoc.value.trim(),upi:u,seller:S.user.name,phone:S.user.phone,img,ex:sEx.checked,owner:S.user.phone});save();dSell.close();render()};
const f=sImg.files[0];if(f&&f.size<600000){const r=new FileReader();r.onload=()=>add(r.result);r.readAsDataURL(f)}else add()}
function want(){if(!wTitle.value.trim()||!wGive.value.trim()||!wLoc.value.trim())return alert('Fill the book you need, what you offer and locality');
S.wants.unshift({id:Date.now(),t:wTitle.value.trim(),c:wCat.value,give:wGive.value.trim(),note:wNote.value.trim(),loc:wLoc.value.trim(),city:S.user.city,name:S.user.name,phone:S.user.phone,owner:S.user.phone});save();dWant.close();render()}
function pickCat(c){S.cat=S.cat==c?'':c;render();document.getElementById('list').scrollIntoView()}
function card(x){return`<div class="card">
${x.img?`<img class="cover" src="${x.img}" alt="">`:`<div class="cover" style="background:${hue(x.t)}">${esc(x.t)}<i>${x.cond}</i></div>`}
<b>${esc(x.t)}</b><span class="tag">${esc(x.a||'Unknown')} · ${x.c}</span>
<div class="price"><b>₹${price(x.mrp)}</b><s>₹${x.mrp}</s><span class="off">50% OFF</span> ${x.ex?'<span class="ex">Exchange ok</span>':''}</div>
<span class="tag">📍 ${esc(x.loc)}, ${x.city}</span>
<div style="display:flex;gap:6px"><button class="btn g" style="flex:1" onclick="buy(${x.id})">Buy</button>${x.ex?`<button class="btn p" onclick="swapBook(${x.id})">Swap</button>`:''}${S.tab=='mine'?`<button class="btn alt" onclick="del(${x.id})">✕</button>`:''}</div></div>`}
function render(){
const city=$('city').value,q=$('q').value.toLowerCase();
$('stB').textContent=S.books.length;$('stX').textContent=S.wants.length;
$('cats').innerHTML=CATS.map(c=>`<div class="cat ${S.cat==c[1]?'on':''}" onclick="pickCat('${c[1].replace(/'/g,"\\'")}')"><span>${c[0]}</span>${c[1]}</div>`).join('');
let b=S.books.filter(x=>!x.sold&&(!city||x.city==city)&&(!S.cat||x.c==S.cat)&&(x.t+x.a+x.c).toLowerCase().includes(q));
if(S.tab=='mine')b=b.filter(x=>S.user&&x.owner==S.user.phone);
const so=$('sort').value;if(so=='lo')b.sort((x,y)=>x.mrp-y.mrp);if(so=='hi')b.sort((x,y)=>y.mrp-x.mrp);
$('listTitle').textContent=S.tab=='mine'?'My listings':(S.cat||'Latest books')+(city?' in '+city:'');
$('list').innerHTML=b.length?b.map(card).join(''):'<div class="empty">No books here yet. Try another category or city — or sell one!</div>';
const w=S.wants.filter(x=>(!city||x.city==city)&&(x.t+x.give).toLowerCase().includes(q));
$('reqs').innerHTML=w.length?w.map(x=>`<div class="req"><b>Wants: ${esc(x.t)}</b><span class="tag">${x.c} · 📍 ${esc(x.loc)}, ${x.city}</span><span>Can give: <b>${esc(x.give)}</b></span>${x.note?`<span class="tag">${esc(x.note)}</span>`:''}<span class="tag">by ${esc(x.name)}</span><div style="display:flex;gap:6px"><button class="btn p" style="flex:1" onclick="haveIt(${x.id})">I have this book</button>${S.user&&x.owner==S.user.phone?`<button class="btn alt" onclick="delW(${x.id})">✕</button>`:''}</div></div>`).join(''):'<div class="empty">No exchange requests yet. Post the first one!</div>';
const e=S.books.filter(x=>x.ex&&!x.sold&&(!city||x.city==city)&&(x.t+x.a).toLowerCase().includes(q));
$('exBooks').innerHTML=e.length?e.map(card).join(''):'<div class="empty">No books open for exchange in this city.</div>'}
function del(id){S.books=S.books.filter(x=>x.id!=id);save();render()}
function delW(id){S.wants=S.wants.filter(x=>x.id!=id);save();render()}
function wa(phone,msg){return`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`}
function sameCity(c){if(c.toLowerCase()!=S.user.city.toLowerCase()){alert(`This is in ${c}. BookBecho trades within the same city — you're in ${S.user.city}.`);return false}return true}
function buy(id){if(!need())return;const x=S.books.find(b=>b.id==id);if(!sameCity(x.city))return;const p=price(x.mrp);
const link=`upi://pay?pa=${encodeURIComponent(x.upi)}&pn=${encodeURIComponent(x.seller)}&am=${p}&cu=INR&tn=${encodeURIComponent('BookBecho: '+x.t)}`;
dealBody.innerHTML=`<h3>${esc(x.t)}</h3><div class="hint">Pay <b>₹${p}</b> to <b>${esc(x.seller)}</b><br>UPI ID: <b>${esc(x.upi)}</b></div>
<a class="btn g" href="${link}">Pay ₹${p} with UPI app</a>
<div class="or">or scan with any UPI app</div><div class="qr" id="qr"></div>
<button class="btn rz" onclick="payRzp(${x.id})">Pay by Card / NetBanking / UPI (Razorpay)</button>
<div class="hint">📍 Meet at <b>${esc(x.loc)}, ${x.city}</b><br>📞 <a href="tel:${x.phone}">${x.phone}</a> · <a target="_blank" href="${wa(x.phone,'Hi, I want to buy "'+x.t+'" on BookBecho')}">WhatsApp</a></div>
<button class="btn" onclick="markSold(${x.id})">I've paid – mark as sold</button>
<button class="btn alt" onclick="dDeal.close()">Close</button>`;dDeal.showModal();
try{new QRCode($('qr'),{text:link,width:170,height:170})}catch(e){$('qr').textContent='QR unavailable offline'}}
function markSold(id){const x=S.books.find(b=>b.id==id);x.sold=true;save();dDeal.close();render()}
async function payRzp(id){const x=S.books.find(b=>b.id==id);
try{const o=await (await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bookId:x.id,title:x.t})})).json();
if(o.error)throw new Error(o.error);
await new Promise((ok,no)=>{if(window.Razorpay)return ok();const s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)});
new Razorpay({key:o.key,amount:o.amount,currency:'INR',order_id:o.id,name:'BookBecho',description:x.t,prefill:{name:S.user.name,contact:S.user.phone},
handler:async r=>{const v=await (await fetch('/api/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(r)})).json();
if(v.ok){markSold(id);alert('Payment successful! Contact the seller to collect your book.')}else alert('Payment verification failed')}}).open()
}catch(e){alert('Online payment needs the server running with Razorpay keys (see README). Use UPI instead.\n'+e.message)}}
function swapBook(id){if(!need())return;const x=S.books.find(b=>b.id==id);if(!sameCity(x.city))return;
dealBody.innerHTML=`<h3>Propose a swap</h3><div class="hint">You'd like <b>${esc(x.t)}</b> from <b>${esc(x.seller)}</b>. Message them what you can offer in return — if they agree, swap at <b>${esc(x.loc)}</b>.</div>
<a class="btn p" target="_blank" href="${wa(x.phone,'Hi, I saw "'+x.t+'" on BookBecho (open for exchange). I can give you: ')}">Message on WhatsApp</a><button class="btn alt" onclick="dDeal.close()">Close</button>`;dDeal.showModal()}
function haveIt(id){if(!need())return;const x=S.wants.find(w=>w.id==id);if(!sameCity(x.city))return;
dealBody.innerHTML=`<h3>Great — you can help ${esc(x.name)}</h3><div class="hint">They need <b>${esc(x.t)}</b> and offer <b>${esc(x.give)}</b>. If you agree, meet at <b>${esc(x.loc)}, ${x.city}</b> and swap.</div>
<a class="btn p" target="_blank" href="${wa(x.phone,'Hi '+x.name+', I have "'+x.t+'" and I agree to exchange for "'+x.give+'" (BookBecho)')}">Accept on WhatsApp</a>
<div class="hint">📞 <a href="tel:${x.phone}">${x.phone}</a></div><button class="btn alt" onclick="dDeal.close()">Close</button>`;dDeal.showModal()}
init();