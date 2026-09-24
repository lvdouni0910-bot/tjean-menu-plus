const TOKEN='tjean_menu_token';
const getToken=()=>localStorage.getItem(TOKEN)||'';
const api=async(url,opt={})=>{opt.headers={...(opt.headers||{}),...(getToken()?{'x-menu-token':getToken()}:{})};const r=await fetch(url,opt);const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'Có lỗi xảy ra');return j};
const qs=(k)=>new URLSearchParams(location.search).get(k);
const LANGS={zh:'简体中文',zht:'繁體中文',vi:'Tiếng Việt',th:'ภาษาไทย',ms:'Bahasa Melayu',en:'English'};
function initLanguage(){const header=document.querySelector('.top');if(!header||document.querySelector('.lang-select'))return;const saved=localStorage.getItem('tjean_lang')||'vi';const wrap=document.createElement('select');wrap.className='lang-select';Object.entries(LANGS).forEach(([k,v])=>{const o=document.createElement('option');o.value=k;o.textContent=v;if(k===saved)o.selected=true;wrap.appendChild(o)});wrap.onchange=()=>{localStorage.setItem('tjean_lang',wrap.value);location.reload()};header.appendChild(wrap)}
async function paintOwner(){const el=document.querySelector('[data-owner]');if(!el)return;try{const m=await api('/api/me');el.textContent=m.active?m.model:'Khách'}catch{el.textContent='Khách'}}
function card(r){return `<a class="card" href="/recipe/?slug=${encodeURIComponent(r.slug)}">${r.locked?'<span class="lock">🔒 Menu+</span>':''}<div class="photo">${r.emoji||'🍽️'}</div><div class="ct"><b>${r.name}</b><div class="tag">${r.people||''}${r.update_month?' · '+r.update_month:''}</div></div></a>`}
initLanguage();
paintOwner();
