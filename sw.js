// 오프라인에서도 앱이 열리도록 파일을 저장해 두는 서비스 워커
const CACHE = 'saessak-v1';
const SHELL = ['./', './index.html', './app.js', './firebase-config.js', './manifest.webmanifest', './icons/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Firebase 데이터 통신은 건드리지 않음 (Firestore가 자체 오프라인 저장을 함)
  if (url.hostname.endsWith('googleapis.com') && !url.hostname.startsWith('fonts')) return;
  if (url.hostname.includes('firebaseapp.com') || url.hostname.includes('google.com')) return;

  const sameOrigin = url.origin === self.location.origin;
  if (sameOrigin) {
    // 내 앱 파일: 인터넷 먼저(업데이트 반영), 안 되면 저장본
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
  } else if (url.hostname === 'www.gstatic.com' || url.hostname.startsWith('fonts.')) {
    // Firebase 라이브러리, 글꼴: 저장본 먼저
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
  }
});
