// base.js: DOM helper and HTML escaping, used by every other file. Classic script: shares top-level names with the other js/ files (load order in index.html).
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

