/*! لوحة عضو الفريق التنفيذي — © 2026 / 1448هـ عبدالله خالد العتيبي. جميع الحقوق محفوظة — All Rights Reserved. انظر ملف LICENSE. */
const V='sup-1.0.0',F=['./','index.html','styles.css','app.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','fonts/Tajawal-400.ttf','fonts/Tajawal-700.ttf','fonts/Tajawal-800.ttf','vendor/xlsx.full.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(F.map(u=>fetch(u,{cache:'no-store'}).then(r=>{if(r.ok)return c.put(u,r)}).catch(()=>{})))))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET'||new URL(q.url).origin!==location.origin)return;
 e.respondWith(fetch(q,{cache:'no-store'}).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(q,cp))}return r})
 .catch(()=>caches.match(q,{ignoreSearch:true}).then(r=>r||(q.mode==='navigate'?caches.match('index.html'):Response.error()))))});
