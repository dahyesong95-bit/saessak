import { firebaseConfig } from './firebase-config.js';

const FB_VER = '10.14.1';
const CONFIGURED = !!(firebaseConfig && firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('YOUR'));

// ---------- 유틸 ----------
const $ = s => document.querySelector(s);
const pad = n => String(n).padStart(2, '0');
const dkey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = parse(k); d.setDate(d.getDate() + n); return dkey(d); };
const todayKey = () => dkey(new Date());
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const SLOTS = { morning: ['아침', 'var(--m)'], afternoon: ['낮', 'var(--a)'], evening: ['저녁', 'var(--e)'], any: ['언제든', 'var(--any)'] };
const SLOT_ORDER = ['morning', 'afternoon', 'evening', 'any'];
const EMOJIS = ['💧', '🌿', '📖', '🏃', '🧘', '💊', '🛏️', '🍳', '🇯🇵', '✍️', '🧹', '🐱', '💪', '🎧', '📝', '☀️', '🪴', '🍵'];
const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const LEAF_ICON = '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 19C5 10 11 5 20 4c0 9-5 15-15 15z" fill="var(--leaf2)"/><path d="M5 19L14 10" stroke="var(--leaf)" stroke-width="1.6" stroke-linecap="round"/></svg>';

function relLabel(k) {
  const t = todayKey();
  if (k === t) return '오늘';
  if (k === addDays(t, 1)) return '내일';
  if (k === addDays(t, -1)) return '어제';
  const d = parse(k);
  return `${d.getMonth() + 1}/${d.getDate()} (${DOW[d.getDay()]})`;
}

// ---------- 일러스트 ----------
function leaf(x, y, rot, s, fill, flip = false) {
  return `<path d="M0 0C6-10 20-12 30-6C21 3 9 4 0 0Z" fill="${fill}" transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${rot})"/>`;
}
function plantSVG(p, any) {
  // p: 0~1 오늘 루틴 달성률
  const stage = !any ? 2 : p >= 1 ? 3 : p >= .5 ? 2 : p > 0 ? 1 : 0;
  const h = [7, 24, 38, 44][stage];
  const top = 88 - h;
  let g = `<path class="grow" d="M56 88V${top}" stroke="var(--leaf)" stroke-width="3" stroke-linecap="round"/>`;
  if (stage === 0) g += leaf(56, top + 1, -25, .32, 'var(--leaf2)') + leaf(56, top + 1, -25, .32, 'var(--leaf)', true);
  if (stage >= 1) g += `<g class="grow">${leaf(56, top + 2, -28, .8, 'var(--leaf2)')}${leaf(56, top + 4, -22, .72, 'var(--leaf)', true)}</g>`;
  if (stage >= 2) g += `<g class="grow">${leaf(56, top + 20, -12, .78, 'var(--leaf)')}${leaf(56, top + 17, -18, .85, 'var(--leaf2)', true)}</g>`;
  if (stage === 3) {
    let petals = '';
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; petals += `<circle cx="${56 + Math.cos(a) * 6}" cy="${top - 4 + Math.sin(a) * 6}" r="5" fill="#fff"/>`; }
    g += `<g class="grow">${petals}<circle cx="56" cy="${top - 4}" r="4" fill="#f4cf72"/></g>
      <g fill="var(--hl)"><path d="M24 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M90 46l1.4 3.4 3.4 1.4-3.4 1.4L90 56l-1.4-3.4-3.4-1.4 3.4-1.4z"/></g>`;
  }
  return `<svg viewBox="0 0 112 122" aria-hidden="true">
    <ellipse cx="56" cy="119" rx="34" ry="3" fill="rgba(0,0,0,.06)"/>
    ${g}
    <path d="M35 94h42l-5 24a3 3 0 0 1-3 2H43a3 3 0 0 1-3-2z" fill="var(--pot)"/>
    <rect x="31" y="86" width="50" height="10" rx="4" fill="var(--pot2)"/>
    <ellipse cx="56" cy="88" rx="22" ry="2.6" fill="#8a6a4f" opacity=".55"/>
  </svg>`;
}
const EMPTY_ART = `<svg viewBox="0 0 80 60" aria-hidden="true"><path d="M14 50h52" stroke="var(--line)" stroke-width="2" stroke-linecap="round"/><path d="M40 50V30" stroke="var(--leaf)" stroke-width="2.4" stroke-linecap="round"/><path d="M40 34c0-9-7-14-16-13 0 9 7 14 16 13z" fill="var(--leaf2)"/><path d="M40 31c0-8 7-12 15-11 0 8-7 12-15 11z" fill="var(--leaf)" opacity=".8"/><circle cx="60" cy="14" r="2.5" fill="var(--hl)"/><circle cx="20" cy="12" r="1.8" fill="var(--leaf2)" opacity=".6"/></svg>`;
const SPROUT_BIG = `<svg viewBox="0 0 200 170" aria-hidden="true"><ellipse cx="100" cy="150" rx="70" ry="10" fill="var(--mint)"/><path d="M100 148V80" stroke="var(--leaf)" stroke-width="6" stroke-linecap="round"/><path d="M100 92c0-26-22-40-50-37 0 26 22 41 50 37z" fill="var(--leaf2)"/><path d="M100 82c0-24 20-37 46-34 0 24-20 37-46 34z" fill="var(--leaf)"/><path d="M100 148c-6-10-18-12-28-6" stroke="var(--leaf2)" stroke-width="4" fill="none" stroke-linecap="round"/><g fill="var(--hl)"><path d="M40 40l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><path d="M160 24l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></g><circle cx="168" cy="96" r="4" fill="var(--sky)"/><circle cx="30" cy="100" r="5" fill="var(--sky)"/></svg>`;

// ---------- 데이터 ----------
// S.todos: Map(id → {id,title,due,done,doneAt,ts})
// S.routines: Map(id → {id,title,emoji,days,slot,created,archived,ts})
// S.log: Map('YYYY-MM-DD' → [routineId...])
const S = { todos: new Map(), routines: new Map(), log: new Map() };
let ui = { tab: 'today', day: todayKey(), showDone: false };
const h0 = location.hash.slice(1); if (['today', 'todos', 'routines', 'stats'].includes(h0)) ui.tab = h0;
let api = null;          // 저장 방식(로컬 / 파이어베이스)
let account = null;      // 로그인 정보

// --- 로컬 저장 (Firebase 설정 전 미리보기용) ---
function localApi() {
  const KEY = 'saessak-local-v1';
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (d) { d.todos.forEach(t => S.todos.set(t.id, t)); d.routines.forEach(r => S.routines.set(r.id, r)); Object.entries(d.log).forEach(([k, v]) => S.log.set(k, v)); }
  } catch (e) { }
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify({ todos: [...S.todos.values()], routines: [...S.routines.values()], log: Object.fromEntries(S.log) })); } catch (e) { }
    render();
  };
  return {
    upsertTodo(t) { S.todos.set(t.id, t); save(); },
    deleteTodo(id) { S.todos.delete(id); save(); },
    upsertRoutine(r) { S.routines.set(r.id, r); save(); },
    deleteRoutine(id) { S.routines.delete(id); for (const [k, v] of S.log) { const n = v.filter(x => x !== id); n.length ? S.log.set(k, n) : S.log.delete(k); } save(); },
    setLog(k, id, on) { const v = (S.log.get(k) || []).filter(x => x !== id); if (on) v.push(id); v.length ? S.log.set(k, v) : S.log.delete(k); save(); },
  };
}

// --- Firebase ---
let FB = null;
async function loadFirebase() {
  const base = `https://www.gstatic.com/firebasejs/${FB_VER}/`;
  const [app, auth, fs] = await Promise.all([import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')]);
  const fbApp = app.initializeApp(firebaseConfig);
  const a = auth.getAuth(fbApp);
  try { await auth.setPersistence(a, auth.indexedDBLocalPersistence); } catch (e) { }
  let db;
  try { db = fs.initializeFirestore(fbApp, { localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }) }); }
  catch (e) { db = fs.getFirestore(fbApp); }
  FB = { auth, fs, a, db };
}

let unsubs = [];
function firebaseApi(user) {
  const { fs, db } = FB;
  const base = ['users', user.uid];
  const col = name => fs.collection(db, ...base, name);
  const ref = (name, id) => fs.doc(db, ...base, name, id);
  const strip = o => { const c = { ...o }; delete c.id; return c; };
  const fail = e => { console.error(e); toast('저장 실패: ' + (e.code || e.message)); };
  const pending = new Set();
  const status = (key, meta) => { meta.hasPendingWrites ? pending.add(key) : pending.delete(key); setSync(meta.fromCache && !navigator.onLine ? 'off' : pending.size ? 'busy' : 'ok'); };

  const listen = (q, map, key, toVal) => unsubs.push(fs.onSnapshot(q, { includeMetadataChanges: true }, snap => {
    snap.docChanges().forEach(ch => {
      if (ch.type === 'removed') map.delete(ch.doc.id);
      else map.set(ch.doc.id, toVal(ch.doc));
    });
    status(key, snap.metadata); render();
  }, err => { console.error(err); setSync('off'); toast('동기화 오류: ' + (err.code || '')); }));

  listen(col('todos'), S.todos, 'todos', d => ({ id: d.id, ...d.data() }));
  listen(col('routines'), S.routines, 'routines', d => ({ id: d.id, ...d.data() }));
  listen(fs.query(col('log'), fs.where('d', '>=', addDays(todayKey(), -400))), S.log, 'log', d => d.data().ids || []);

  return {
    upsertTodo: t => fs.setDoc(ref('todos', t.id), strip(t)).catch(fail),
    deleteTodo: id => fs.deleteDoc(ref('todos', id)).catch(fail),
    upsertRoutine: r => fs.setDoc(ref('routines', r.id), strip(r)).catch(fail),
    deleteRoutine: id => {
      const b = fs.writeBatch(db);
      b.delete(ref('routines', id));
      for (const [k, v] of S.log) if (v.includes(id)) b.set(ref('log', k), { d: k, ids: fs.arrayRemove(id) }, { merge: true });
      b.commit().catch(fail);
    },
    setLog: (k, id, on) => fs.setDoc(ref('log', k), { d: k, ids: on ? fs.arrayUnion(id) : fs.arrayRemove(id) }, { merge: true }).catch(fail),
  };
}

function setSync(s) {
  const el = $('#sync'); if (!el) return;
  el.className = 'sync ' + s;
  el.querySelector('span').textContent = { ok: '동기화됨', busy: '저장 중', off: '오프라인', local: '이 기기에만 저장', loading: '연결 중' }[s] || s;
}
window.addEventListener('online', () => api && setSync(CONFIGURED ? 'ok' : 'local'));
window.addEventListener('offline', () => CONFIGURED && setSync('off'));

// ---------- 화면 전환 ----------
function show(view) {
  $('#splash').classList.toggle('hidden', view !== 'splash');
  $('#login').classList.toggle('hidden', view !== 'login');
  $('#appView').classList.toggle('hidden', view !== 'app');
}

function renderLogin(mode = 'main', msg = '') {
  show('login');
  const L = $('#login');
  if (mode === 'main') {
    L.innerHTML = `<div class="art">${SPROUT_BIG}</div>
      <h2>새싹</h2><p>할 일과 루틴을 매일 조금씩.<br>폰·아이패드·갤탭 어디서든 이어서 써요.</p>
      <button class="gbtn" id="gLogin"><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>Google로 시작하기</button>
      <div class="or">또는</div>
      <button class="linkbtn" id="eLogin">이메일로 로그인</button>
      <div class="err">${esc(msg)}</div>`;
    $('#gLogin').onclick = async () => {
      try { await FB.auth.signInWithPopup(FB.a, new FB.auth.GoogleAuthProvider()); }
      catch (e) {
        const m = { 'auth/popup-blocked': '팝업이 막혔어요. 다시 눌러 주세요.', 'auth/popup-closed-by-user': '', 'auth/cancelled-popup-request': '', 'auth/unauthorized-domain': '이 주소가 Firebase 승인 도메인에 없어요 (가이드 확인)', 'auth/network-request-failed': '인터넷 연결을 확인해 주세요' }[e.code];
        renderLogin('main', m ?? ('로그인 실패: ' + e.code + ' — 안 되면 이메일 로그인을 써 보세요'));
      }
    };
    $('#eLogin').onclick = () => renderLogin('email');
  } else {
    L.innerHTML = `<div class="art" style="width:120px">${SPROUT_BIG}</div>
      <h2>이메일로 로그인</h2><p>처음이면 '가입하기'를 눌러 주세요.<br>모든 기기에서 같은 방법으로 로그인해야 같은 기록이 보여요.</p>
      <form id="ef"><input class="field" type="email" id="em" placeholder="이메일" autocomplete="email" required>
      <input class="field" type="password" id="pw" placeholder="비밀번호 (6자 이상)" autocomplete="current-password" required minlength="6">
      <div style="display:flex;gap:8px;margin-top:4px"><button class="btn ghost" type="button" id="su">가입하기</button><button class="btn" type="submit">로그인</button></div></form>
      <div class="err">${esc(msg)}</div><button class="linkbtn" id="back">← 돌아가기</button>`;
    const go = async signup => {
      const em = $('#em').value.trim(), pw = $('#pw').value;
      if (!em || pw.length < 6) { renderLogin('email', '이메일과 6자 이상 비밀번호를 입력해 주세요'); return; }
      try { signup ? await FB.auth.createUserWithEmailAndPassword(FB.a, em, pw) : await FB.auth.signInWithEmailAndPassword(FB.a, em, pw); }
      catch (e) {
        const m = { 'auth/invalid-credential': '이메일 또는 비밀번호가 맞지 않아요', 'auth/email-already-in-use': '이미 가입된 이메일이에요. 로그인을 눌러 주세요', 'auth/weak-password': '비밀번호가 너무 짧아요', 'auth/invalid-email': '이메일 형식을 확인해 주세요', 'auth/operation-not-allowed': 'Firebase에서 이메일 로그인이 꺼져 있어요 (가이드 확인)', 'auth/network-request-failed': '인터넷 연결을 확인해 주세요' }[e.code];
        renderLogin('email', m || ('실패: ' + e.code));
        $('#em').value = em;
      }
    };
    $('#ef').onsubmit = e => { e.preventDefault(); go(false); };
    $('#su').onclick = () => go(true);
    $('#back').onclick = () => renderLogin('main');
  }
}

// ---------- 루틴 계산 ----------
const routines = () => [...S.routines.values()].sort((a, b) => (a.ts || 0) - (b.ts || 0));
const todos = () => [...S.todos.values()].sort((a, b) => (a.ts || 0) - (b.ts || 0));
const isScheduled = (r, k) => (r.days || []).includes(parse(k).getDay()) && (!r.created || k >= r.created);
const isDoneR = (r, k) => (S.log.get(k) || []).includes(r.id);
function streak(r) {
  let k = todayKey(), n = 0, guard = 0;
  if (isScheduled(r, k) && !isDoneR(r, k)) k = addDays(k, -1);
  while (guard++ < 400) {
    if (r.created && k < r.created) break;
    if (isScheduled(r, k)) { if (isDoneR(r, k)) n++; else break; }
    k = addDays(k, -1);
  }
  return n;
}

// ---------- 렌더링 ----------
function routineRow(r, k) {
  const d = isDoneR(r, k), s = streak(r), sl = SLOTS[r.slot || 'any'];
  return `<div class="row ${d ? 'done' : ''}">
    <button class="chk" data-act="rtoggle" data-id="${r.id}" aria-label="완료">${CHECK}</button>
    <button class="body" data-act="redit" data-id="${r.id}">
      <div class="title"><span>${esc(r.emoji || '')} ${esc(r.title)}</span></div>
      <div class="meta"><span><i class="slot-dot" style="background:${sl[1]}"></i>${sl[0]}</span></div>
    </button>
    ${s > 0 ? `<div class="streak">${LEAF_ICON}<b>${s}</b>일</div>` : ''}
  </div>`;
}
function todoRow(t) {
  const late = !t.done && t.due && t.due < todayKey();
  return `<div class="row ${t.done ? 'done' : ''}">
    <button class="chk" data-act="ttoggle" data-id="${t.id}" aria-label="완료">${CHECK}</button>
    <button class="body" data-act="tedit" data-id="${t.id}">
      <div class="title"><span>${esc(t.title)}</span></div>
      ${t.due ? `<div class="meta"><span class="${late ? 'late' : ''}">${late ? '밀림 · ' : ''}${relLabel(t.due)}</span></div>` : ''}
    </button>
  </div>`;
}
const listOr = (rows, msg) => `<div class="list">${rows.length ? rows.join('') : `<div class="empty">${EMPTY_ART}<span>${msg}</span></div>`}</div>`;
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;

function renderToday() {
  const k = ui.day, isToday = k === todayKey();
  const rs = routines().filter(r => !r.archived && isScheduled(r, k)).sort((a, b) => SLOT_ORDER.indexOf(a.slot || 'any') - SLOT_ORDER.indexOf(b.slot || 'any'));
  const rDone = rs.filter(r => isDoneR(r, k)).length;
  const ts = todos().filter(t => t.done ? (t.doneAt === k || t.due === k) : (isToday ? t.due && t.due <= k : t.due === k))
    .sort((a, b) => (a.done - b.done) || (a.due || '').localeCompare(b.due || ''));
  const tDone = ts.filter(t => t.done).length;
  const someday = isToday ? todos().filter(t => !t.done && !t.due) : [];
  const p = rs.length ? rDone / rs.length : 0;
  const cheer = !rs.length ? '' : p >= 1 ? '오늘 루틴 완료! 꽃이 피었어요 🌼' : p >= .5 ? '절반 넘었어요. 잎이 무성해지는 중 🌿' : p > 0 ? '새싹이 자라기 시작했어요' : '루틴을 체크하면 화분이 자라요';
  return `
  <div class="hero">
    <div class="plant">${plantSVG(p, rs.length > 0)}</div>
    <div class="stats">
      <div class="stat"><div class="top"><span>루틴</span><div><b>${rDone}</b><span> / ${rs.length}</span></div></div><div class="bar"><div style="width:${pct(rDone, rs.length)}%"></div></div></div>
      <div class="stat"><div class="top"><span>할 일</span><div><b>${tDone}</b><span> / ${ts.length}</span></div></div><div class="bar"><div style="width:${pct(tDone, ts.length)}%"></div></div></div>
    </div>
  </div>
  ${cheer ? `<div class="cheer">${cheer}</div>` : ''}
  <section><div class="sec-h"><h2>루틴</h2><button data-act="newr">+ 루틴</button></div>
    ${listOr(rs.map(r => routineRow(r, k)), S.routines.size ? '이 날은 예정된 루틴이 없어요' : '첫 루틴을 심어 볼까요? 물 한 잔부터 시작해도 좋아요')}
  </section>
  <section><div class="sec-h"><h2>${isToday ? '오늘 할 일' : relLabel(k) + ' 할 일'}</h2><button data-act="newt">+ 할 일</button></div>
    ${listOr(ts.map(todoRow), '할 일이 없어요')}
  </section>
  ${someday.length ? `<section><div class="sec-h"><h2>언제든</h2></div>${listOr(someday.map(todoRow), '')}</section>` : ''}`;
}
function renderTodos() {
  const t = todayKey(), open = todos().filter(x => !x.done);
  const groups = [
    ['밀린 일', open.filter(x => x.due && x.due < t)],
    ['오늘', open.filter(x => x.due === t)],
    ['예정', open.filter(x => x.due && x.due > t).sort((a, b) => a.due.localeCompare(b.due))],
    ['언제든', open.filter(x => !x.due)],
  ].filter(g => g[1].length);
  const done = todos().filter(x => x.done).sort((a, b) => (b.doneAt || '').localeCompare(a.doneAt || ''));
  let html = groups.map(g => `<section><div class="sec-h"><h2>${g[0]} · ${g[1].length}</h2></div>${listOr(g[1].map(todoRow), '')}</section>`).join('');
  if (!groups.length) html = `<section>${listOr([], '할 일을 모두 끝냈어요 ✨')}</section>`;
  if (done.length) html += `<section><div class="sec-h"><h2>완료 · ${done.length}</h2>${ui.showDone ? '<button data-act="cleardone">완료 항목 비우기</button>' : ''}</div>
    <div class="list">${ui.showDone ? done.slice(0, 150).map(todoRow).join('') : ''}<button class="fold" data-act="fold">${ui.showDone ? '접기' : '펼치기'}</button></div></section>`;
  return html;
}
function daysLabel(days = []) {
  const s = [...days].sort().join('');
  if (s === '0123456') return '매일'; if (s === '12345') return '평일'; if (s === '06') return '주말';
  return [1, 2, 3, 4, 5, 6, 0].filter(d => days.includes(d)).map(d => DOW[d]).join('·');
}
function renderRoutines() {
  const all = routines(), active = all.filter(r => !r.archived), paused = all.filter(r => r.archived);
  const week = r => { let o = ''; for (let i = 6; i >= 0; i--) { const k = addDays(todayKey(), -i); o += `<i class="${!isScheduled(r, k) ? 'off' : isDoneR(r, k) ? 'y' : ''}"></i>`; } return `<div class="week">${o}</div>`; };
  const row = r => { const sl = SLOTS[r.slot || 'any']; return `<div class="row">
    <div class="emoji">${esc(r.emoji || '•')}</div>
    <button class="body" data-act="redit" data-id="${r.id}">
      <div class="title">${esc(r.title)}</div>
      <div class="meta"><span>${daysLabel(r.days)}</span><span><i class="slot-dot" style="background:${sl[1]}"></i>${sl[0]}</span></div>
      ${week(r)}
    </button>
    <div class="streak">${LEAF_ICON}<b>${streak(r)}</b>일</div></div>`; };
  return `<section><div class="sec-h"><h2>내 루틴 · ${active.length}</h2><button data-act="newr">+ 루틴</button></div>${listOr(active.map(row), '루틴을 추가해 보세요')}</section>
    ${paused.length ? `<section><div class="sec-h"><h2>쉬는 중</h2></div>${listOr(paused.map(row), '')}</section>` : ''}`;
}
function renderStats() {
  const t = todayKey();
  let k = addDays(t, -34); while (parse(k).getDay() !== 1) k = addDays(k, -1);
  let cells = '', S1 = 0, D1 = 0;
  const act = routines().filter(r => !r.archived);
  while (true) {
    const future = k > t;
    if (future && parse(k).getDay() === 1) break;
    const sch = act.filter(r => isScheduled(r, k)), dn = sch.filter(r => isDoneR(r, k)).length;
    if (!future) { S1 += sch.length; D1 += dn; }
    const p = sch.length ? dn / sch.length : 0;
    const bg = future ? 'transparent' : sch.length && dn ? `color-mix(in srgb, var(--leaf) ${Math.round(20 + p * 80)}%, var(--bg2))` : 'var(--bg2)';
    const flower = !future && sch.length && p >= 1 ? '<span style="position:absolute;right:2px;top:0;font-size:9px">✿</span>' : '';
    cells += `<button data-act="goday" data-k="${k}" ${future ? 'disabled' : ''} style="background:${bg};color:${p > .55 && !future ? '#fff' : 'var(--sub)'};${k === t ? 'outline:2px solid var(--hl);' : ''}">${future ? '' : parse(k).getDate()}${flower}</button>`;
    k = addDays(k, 1);
  }
  const done30 = todos().filter(x => x.done && x.doneAt && x.doneAt >= addDays(t, -29)).length;
  const best = act.map(r => [r, streak(r)]).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return `<div class="hero"><div class="stats" style="flex-direction:row">
      <div class="stat"><span>5주 루틴 달성률</span><div><b>${pct(D1, S1)}</b><span>%</span></div></div>
      <div class="stat"><span>30일간 끝낸 일</span><div><b>${done30}</b><span>개</span></div></div></div></div>
  <section><div class="sec-h"><h2>루틴 달력</h2></div>
    <div class="list" style="padding:14px">
      <div class="cal" style="font-size:11px;color:var(--sub);text-align:center;margin-bottom:6px">${['월', '화', '수', '목', '금', '토', '일'].map(d => `<div>${d}</div>`).join('')}</div>
      <div class="cal">${cells}</div>
      <div style="font-size:12px;color:var(--sub);margin-top:10px">진할수록 많이 지킨 날 · ✿ 모두 완료 · 날짜를 누르면 그날로 이동</div>
    </div></section>
  ${best.length ? `<section><div class="sec-h"><h2>연속 기록</h2></div>${listOr(best.map(([r, s]) => `<div class="row"><div class="emoji">${esc(r.emoji || '•')}</div><div class="body"><div class="title">${esc(r.title)}</div></div><div class="streak">${LEAF_ICON}<b>${s}</b>일</div></div>`), '')}</section>` : ''}`;
}
function render() {
  if (!api) return;
  const k = ui.day, d = parse(k), onToday = ui.tab === 'today';
  $('#prevDay').style.display = $('#nextDay').style.display = onToday ? '' : 'none';
  if (onToday) {
    $('#hTitle').innerHTML = `<span class="mark">${relLabel(k).replace(/ \(.+\)/, '')}</span>`;
    $('#hSub').innerHTML = `${d.getMonth() + 1}월 ${d.getDate()}일 ${DOW[d.getDay()]}요일${k !== todayKey() ? ' <button class="today-btn" data-act="gotoday">오늘로</button>' : ''}`;
  } else {
    $('#hTitle').innerHTML = `<span class="mark">${{ todos: '할 일', routines: '루틴', stats: '기록' }[ui.tab]}</span>`;
    const t = new Date(); $('#hSub').textContent = `${t.getMonth() + 1}월 ${t.getDate()}일 ${DOW[t.getDay()]}요일`;
  }
  $('#main').innerHTML = { today: renderToday, todos: renderTodos, routines: renderRoutines, stats: renderStats }[ui.tab]();
  document.querySelectorAll('nav .t').forEach(b => b.classList.toggle('on', b.dataset.tab === ui.tab));
}

// ---------- 시트(입력창) ----------
let ctx = null;
function openSheet(html) { $('#sheet').innerHTML = '<div class="grab"></div>' + html; $('#sheet').classList.add('on'); $('#scrim').classList.add('on'); }
function closeSheet() { $('#sheet').classList.remove('on'); $('#scrim').classList.remove('on'); ctx = null; }
$('#scrim').onclick = closeSheet;
function keepTitle(fn) { const v = $('#ttl')?.value; fn(); if (v != null && $('#ttl')) $('#ttl').value = v; }

function todoSheet(t) {
  const isNew = !t;
  ctx = { kind: 'todo', id: t?.id, due: t ? t.due : (ui.tab === 'today' ? ui.day : ui.tab === 'todos' ? null : todayKey()) };
  const draw = () => {
    const tk = todayKey(), c = ctx.due, custom = c && c !== tk && c !== addDays(tk, 1);
    openSheet(`${isNew ? '<div class="seg"><button class="on">할 일</button><button data-act="switchr">루틴</button></div>' : '<h3>할 일 수정</h3>'}
      <form id="f"><input class="field" id="ttl" placeholder="무엇을 할까요?" autocomplete="off" enterkeyhint="done" value="${esc(t?.title || '')}">
      <div class="lbl">언제</div>
      <div class="chips">
        <button type="button" class="chip ${c === tk ? 'on' : ''}" data-due="${tk}">오늘</button>
        <button type="button" class="chip ${c === addDays(tk, 1) ? 'on' : ''}" data-due="${addDays(tk, 1)}">내일</button>
        <button type="button" class="chip ${!c ? 'on' : ''}" data-due="">언제든</button>
        <label class="chip ${custom ? 'on' : ''}"><input type="date" id="dpick" value="${custom ? c : ''}"></label>
      </div>
      <div class="actions">${!isNew ? '<button type="button" class="btn del" data-act="askdel">삭제</button>' : ''}
        <button type="button" class="btn ghost" data-act="close">닫기</button><button class="btn" type="submit">${isNew ? '추가' : '저장'}</button></div>
      <div class="confirm" id="cf"><span>이 할 일을 삭제할까요?</span><button type="button" class="btn del" data-act="dodel">삭제</button></div></form>`);
    $('#dpick').onchange = e => { if (e.target.value) { ctx.due = e.target.value; keepTitle(draw); } };
    $('#f').onsubmit = e => { e.preventDefault(); saveTodo(); };
    if (isNew) setTimeout(() => $('#ttl')?.focus(), 280);
  };
  ctx.redraw = draw; draw();
}
function saveTodo() {
  const title = $('#ttl').value.trim(); if (!title) { $('#ttl').focus(); return; }
  if (ctx.id) { api.upsertTodo({ ...S.todos.get(ctx.id), title, due: ctx.due || null }); closeSheet(); }
  else { api.upsertTodo({ id: uid(), title, due: ctx.due || null, done: false, doneAt: null, ts: Date.now() }); $('#ttl').value = ''; $('#ttl').focus(); toast('추가했어요 🌱'); }
}
function routineSheet(r) {
  const isNew = !r;
  ctx = { kind: 'routine', id: r?.id, days: r ? [...r.days] : [0, 1, 2, 3, 4, 5, 6], slot: r?.slot || 'morning', emoji: r?.emoji || '💧', archived: !!r?.archived };
  const draw = () => {
    const c = ctx;
    openSheet(`${isNew ? '<div class="seg"><button data-act="switcht">할 일</button><button class="on">루틴</button></div>' : '<h3>루틴 수정</h3>'}
      <form id="f"><input class="field" id="ttl" placeholder="예: 물 한 잔 마시기" autocomplete="off" enterkeyhint="done" value="${esc(r?.title || '')}">
      <div class="lbl">아이콘</div>
      <div class="emojis">${EMOJIS.map(e => `<button type="button" class="${e === c.emoji ? 'on' : ''}" data-emoji="${e}">${e}</button>`).join('')}</div>
      <div class="lbl">반복 요일</div>
      <div class="chips" style="margin-bottom:8px">${[['매일', [0, 1, 2, 3, 4, 5, 6]], ['평일', [1, 2, 3, 4, 5]], ['주말', [0, 6]]].map(([n, a]) => `<button type="button" class="chip ${[...c.days].sort().join() === a.join() ? 'on' : ''}" data-preset="${a.join(',')}">${n}</button>`).join('')}</div>
      <div class="chips">${[1, 2, 3, 4, 5, 6, 0].map(d => `<button type="button" class="chip sq ${c.days.includes(d) ? 'on' : ''}" data-day="${d}">${DOW[d]}</button>`).join('')}</div>
      <div class="lbl">시간대</div>
      <div class="chips">${Object.entries(SLOTS).map(([k, [n, col]]) => `<button type="button" class="chip ${c.slot === k ? 'on' : ''}" data-slot="${k}"><i class="slot-dot" style="background:${col}"></i>${n}</button>`).join('')}</div>
      ${!isNew ? `<div class="lbl">상태</div><div class="chips"><button type="button" class="chip ${c.archived ? '' : 'on'}" data-arch="0">진행 중</button><button type="button" class="chip ${c.archived ? 'on' : ''}" data-arch="1">쉬는 중</button></div>` : ''}
      <div class="actions">${!isNew ? '<button type="button" class="btn del" data-act="askdel">삭제</button>' : ''}
        <button type="button" class="btn ghost" data-act="close">닫기</button><button class="btn" type="submit">${isNew ? '심기' : '저장'}</button></div>
      <div class="confirm" id="cf"><span>루틴과 체크 기록을 모두 지울까요? 잠시 멈추려면 '쉬는 중'을 쓰세요.</span><button type="button" class="btn del" data-act="dodel">삭제</button></div></form>`);
    $('#f').onsubmit = e => { e.preventDefault(); saveRoutine(); };
    if (isNew) setTimeout(() => $('#ttl')?.focus(), 280);
  };
  ctx.redraw = draw; draw();
}
function saveRoutine() {
  const title = $('#ttl').value.trim(); if (!title) { $('#ttl').focus(); return; }
  const c = ctx; if (!c.days.length) { toast('요일을 하나 이상 골라 주세요'); return; }
  if (c.id) api.upsertRoutine({ ...S.routines.get(c.id), title, days: c.days, slot: c.slot, emoji: c.emoji, archived: c.archived });
  else api.upsertRoutine({ id: uid(), title, days: c.days, slot: c.slot, emoji: c.emoji, created: todayKey(), archived: false, ts: Date.now() });
  closeSheet();
}
function accountSheet() {
  ctx = { kind: 'account' };
  openSheet(`<h3>설정</h3>
    <div class="list" style="box-shadow:none;background:var(--bg2)">
      <div class="row"><div class="body"><div class="title">${CONFIGURED ? esc(account?.email || '로그인됨') : '이 기기에만 저장 중'}</div>
      <div class="meta">${CONFIGURED ? '모든 기기에서 같은 계정으로 로그인하면 실시간으로 이어져요' : 'firebase-config.js를 채우면 기기 간 동기화가 켜져요'}</div></div></div>
    </div>
    <div class="actions">${CONFIGURED ? '<button class="btn ghost" style="flex:1" data-act="logout">로그아웃</button>' : ''}<button class="btn" data-act="close">닫기</button></div>
    <div style="text-align:center;color:var(--sub);font-size:12px;margin-top:14px">새싹 v1</div>`);
}

$('#sheet').addEventListener('click', async e => {
  const b = e.target.closest('button'); if (!b || !ctx) return;
  const c = ctx;
  if (b.dataset.due !== undefined) { c.due = b.dataset.due || null; keepTitle(c.redraw); return; }
  if (b.dataset.emoji) { c.emoji = b.dataset.emoji; keepTitle(c.redraw); return; }
  if (b.dataset.day) { const d = +b.dataset.day; c.days = c.days.includes(d) ? c.days.filter(x => x !== d) : [...c.days, d]; keepTitle(c.redraw); return; }
  if (b.dataset.preset) { c.days = b.dataset.preset.split(',').map(Number); keepTitle(c.redraw); return; }
  if (b.dataset.slot) { c.slot = b.dataset.slot; keepTitle(c.redraw); return; }
  if (b.dataset.arch) { c.archived = b.dataset.arch === '1'; keepTitle(c.redraw); return; }
  const a = b.dataset.act;
  if (a === 'close') closeSheet();
  if (a === 'switchr') { const v = $('#ttl').value; routineSheet(null); $('#ttl').value = v; }
  if (a === 'switcht') { const v = $('#ttl').value; todoSheet(null); $('#ttl').value = v; }
  if (a === 'askdel') $('#cf').classList.add('on');
  if (a === 'dodel') {
    if (c.kind === 'todo') { const t = S.todos.get(c.id); api.deleteTodo(c.id); closeSheet(); toast('삭제했어요', () => api.upsertTodo(t)); }
    else { api.deleteRoutine(c.id); closeSheet(); toast('루틴을 삭제했어요'); }
  }
  if (a === 'logout') { closeSheet(); unsubs.forEach(u => u()); unsubs = []; await FB.auth.signOut(FB.a); }
});

// ---------- 메인 조작 ----------
const buzz = () => { try { navigator.vibrate && navigator.vibrate(8); } catch (e) { } };
document.addEventListener('click', e => {
  if (e.target.closest('#sheet') || e.target.closest('#login')) return;
  const b = e.target.closest('button'); if (!b || !api) return;
  if (b.dataset.tab) { ui.tab = b.dataset.tab; if (ui.tab !== 'today') ui.day = todayKey(); try { history.replaceState(null, '', '#' + ui.tab); } catch (_) { } render(); scrollTo(0, 0); return; }
  const a = b.dataset.act, id = b.dataset.id;
  if (a === 'rtoggle') { const k = ui.tab === 'today' ? ui.day : todayKey(); api.setLog(k, id, !isDoneR(S.routines.get(id), k)); buzz(); }
  if (a === 'ttoggle') { const t = S.todos.get(id); const done = !t.done; api.upsertTodo({ ...t, done, doneAt: done ? todayKey() : null }); buzz(); }
  if (a === 'tedit') todoSheet(S.todos.get(id));
  if (a === 'redit') routineSheet(S.routines.get(id));
  if (a === 'newt') todoSheet(null);
  if (a === 'newr') routineSheet(null);
  if (a === 'fold') { ui.showDone = !ui.showDone; render(); }
  if (a === 'cleardone') { const old = todos().filter(x => x.done); old.forEach(x => api.deleteTodo(x.id)); toast('완료 항목을 비웠어요', () => old.forEach(x => api.upsertTodo(x))); }
  if (a === 'gotoday') { ui.day = todayKey(); render(); }
  if (a === 'goday') { ui.tab = 'today'; ui.day = b.dataset.k; render(); scrollTo(0, 0); }
});
$('#fab').onclick = () => ui.tab === 'routines' ? routineSheet(null) : todoSheet(null);
$('#prevDay').onclick = () => { ui.day = addDays(ui.day, -1); render(); };
$('#nextDay').onclick = () => { ui.day = addDays(ui.day, 1); render(); };
$('#sync').onclick = accountSheet;

let toastT;
function toast(msg, undo) {
  const el = $('#toast');
  el.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button>되돌리기</button>' : ''}`;
  if (undo) el.querySelector('button').onclick = () => { undo(); el.classList.remove('on'); };
  el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 3200);
}

// 날짜가 바뀌면 갱신 (앱을 켜둔 채 자정을 넘기거나, 다시 열었을 때)
let lastToday = todayKey();
const dayCheck = () => { const t = todayKey(); if (t !== lastToday) { if (ui.day === lastToday) ui.day = t; lastToday = t; render(); } };
setInterval(dayCheck, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) dayCheck(); });

// ---------- 시작 ----------
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('./sw.js').catch(() => { });

(async function start() {
  if (!CONFIGURED) { api = localApi(); show('app'); setSync('local'); render(); return; }
  try { await loadFirebase(); }
  catch (e) { console.error(e); show('login'); $('#login').innerHTML = `<div class="art">${SPROUT_BIG}</div><h2>연결할 수 없어요</h2><p>처음 한 번은 인터넷 연결이 필요해요.<br>연결 후 다시 열어 주세요.</p>`; return; }
  FB.auth.onAuthStateChanged(FB.a, user => {
    unsubs.forEach(u => u()); unsubs = [];
    S.todos.clear(); S.routines.clear(); S.log.clear();
    if (!user) { api = null; account = null; renderLogin(); return; }
    account = user; show('app'); setSync('loading');
    api = firebaseApi(user); render();
  });
})();
