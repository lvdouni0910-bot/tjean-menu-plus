const TOKEN='tjean_menu_token';
const getToken=()=>localStorage.getItem(TOKEN)||'';
const api=async(url,opt={})=>{opt.headers={...(opt.headers||{}),...(getToken()?{'x-menu-token':getToken()}:{})};const r=await fetch(url,opt);const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'Có lỗi xảy ra');return j};
const qs=(k)=>new URLSearchParams(location.search).get(k);
async function paintOwner(){const el=document.querySelector('[data-owner]');if(!el)return;try{const m=await api('/api/me');el.textContent=m.active?m.model:'Khách'}catch{el.textContent='Khách'}}
function card(r){return `<a class="card" href="/recipe/?slug=${encodeURIComponent(r.slug)}">${r.locked?'<span class="lock">🔒 Menu+</span>':''}<div class="photo">${r.emoji||'🍽️'}</div><div class="ct"><b>${r.name}</b><div class="tag">${r.people||''}${r.update_month?' · '+r.update_month:''}</div></div></a>`}
paintOwner();
