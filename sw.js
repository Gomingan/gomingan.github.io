const CACHE='pawlight-v58';
const FILES=['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./audio/bgm.mp3','./audio/meow1.ogg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const isDoc=e.request.mode==='navigate'||e.request.url.endsWith('/index.html')||e.request.url.includes('cats/manifest.json');
  if(isDoc){ // 게임 본체는 항상 최신을 먼저 받고, 오프라인일 때만 캐시 사용
    e.respondWith(fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res})));
});
