const TJEAN_LANGS={zh:'简体中文',zt:'繁體中文',vi:'Tiếng Việt',th:'ไทย',ms:'Bahasa Melayu',en:'English'};
const TJEAN_LANG_KEY='tjean_language';
function setLanguage(lang){localStorage.setItem(TJEAN_LANG_KEY,lang);location.reload();}
function getLanguage(){return localStorage.getItem(TJEAN_LANG_KEY)||'vi';}
function languageSwitcher(){const wrap=document.createElement('div');wrap.className='language-switcher';wrap.innerHTML=`🌐 <select>${Object.entries(TJEAN_LANGS).map(([k,v])=>`<option value="${k}" ${k===getLanguage()?'selected':''}>${v}</option>`).join('')}</select>`;wrap.querySelector('select').onchange=e=>setLanguage(e.target.value);document.querySelector('.top')?.appendChild(wrap);}
document.addEventListener('DOMContentLoaded',languageSwitcher);