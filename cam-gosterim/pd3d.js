/* Gözlük Camı Simülatörü — 3B önizleme köprüsü
   cagataygulumser.com · Sayfanın kendi hesabını (window.PDSIM) cgs3d.js modeline aktarır. */
(function () {
  'use strict';
  var root = document.getElementById('pdsim-app'), D = window.PDSIM; if (!root || !D || root.querySelector('.pd3-sw')) return;
  var cs = document.currentScript, BASE = cs && cs.src ? cs.src.replace(/[^\/]*$/, '') : '';

  /* ---------- tam ekran (uygulama) modu ---------- */
  (function () {
    var head = root.querySelector('.pdsim-head'), ref = root.querySelector('[data-print]'); if (!head) return;
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'pdsim-btn pd-fsb'; btn.textContent = 'Tam ekran'; btn.setAttribute('aria-pressed', 'false');
    if (ref && ref.parentNode) ref.parentNode.insertBefore(btn, ref.nextSibling); else head.appendChild(btn);
    var st = document.createElement('style');
    st.textContent = '.pdsim .pd-fsb{background:#ffd400;border-color:#e6bf00;color:#14233b}' +
      '#pdsim-app.pd-fs{position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483000;margin:0;max-width:none;width:auto;height:auto;border:0;border-radius:0;box-shadow:none;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;box-sizing:border-box;padding:12px 16px;padding-top:calc(12px + env(safe-area-inset-top));padding-bottom:calc(16px + env(safe-area-inset-bottom))}' +
      'html.pd-fs-on,html.pd-fs-on body{overflow:hidden!important}' +
      '@media print{.pd-fsb{display:none!important}}body.pdsim-printing .pd-fsb{display:none!important}';
    document.head.appendChild(st);
    var on = false, mark = null, sy = 0, de = document.documentElement;
    function fsEl() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
    function enter() {
      if (on) return; on = true; sy = window.pageYOffset || 0;
      var bg = getComputedStyle(root).backgroundColor; if (!bg || /rgba\(0, 0, 0, 0\)|transparent/.test(bg)) bg = getComputedStyle(document.body).backgroundColor; root.style.backgroundColor = bg;
      mark = document.createComment('pdsim'); root.parentNode.insertBefore(mark, root); document.body.appendChild(root);
      root.classList.add('pd-fs'); de.classList.add('pd-fs-on'); root.scrollTop = 0; btn.textContent = 'Tam ekrandan çık'; btn.setAttribute('aria-pressed', 'true');
      var rq = de.requestFullscreen || de.webkitRequestFullscreen; if (rq) { try { var pr = rq.call(de); if (pr && pr.catch) pr.catch(function () {}); } catch (x) {} }
    }
    function leave() {
      if (!on) return; on = false; root.classList.remove('pd-fs'); de.classList.remove('pd-fs-on'); root.style.backgroundColor = '';
      if (mark && mark.parentNode) { mark.parentNode.insertBefore(root, mark); mark.parentNode.removeChild(mark); } mark = null;
      btn.textContent = 'Tam ekran'; btn.setAttribute('aria-pressed', 'false');
      if (fsEl()) { var ex = document.exitFullscreen || document.webkitExitFullscreen; if (ex) { try { var pr = ex.call(document); if (pr && pr.catch) pr.catch(function () {}); } catch (x) {} } }
      window.scrollTo(0, sy);
    }
    btn.addEventListener('click', function () { if (on) leave(); else enter(); });
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (n) { document.addEventListener(n, function () { if (on && !fsEl() && entered) leave(); entered = !!fsEl(); }); });
    var entered = false;
    document.addEventListener('keydown', function (ev) { if (on && ev.key === 'Escape' && !fsEl()) leave(); });
    if (ref) ref.addEventListener('click', function () { if (on) leave(); }, true);
  })();
  var stage = root.querySelector('.pdsim-stage'), svg = stage && stage.querySelector('svg'); if (!svg) return;
  var on = false, ready = false, loading = false, head = true, vname = 'capraz', tmr = 0;
  function el(t, c, h) { var e = document.createElement(t); e.className = c; if (h) e.innerHTML = h; return e; }
  function fmt(v) { return v.toFixed(1).replace('.', ',') + ' mm'; }

  var css = document.createElement('style');
  css.textContent = '.pdsim-stage{position:relative}' +
    '.pd3-sw{position:absolute;left:8px;top:8px;z-index:4;display:inline-flex;gap:2px;padding:3px;border-radius:999px;background:#fff;border:1px solid #d3dbe8;box-shadow:0 2px 8px rgba(20,35,59,.10)}' +
    '.pd3-sw button,.pd3-bar button{border:0;background:none;font-weight:700;font-size:12px;line-height:1;font-family:inherit;padding:7px 12px;border-radius:999px;color:#44506a;cursor:pointer}' +
    '.pd3-sw button.on{background:#0f3fa6;color:#fff}' +
    '.pd3-box{position:absolute;left:0;top:0;right:0;bottom:0;z-index:3;border-radius:inherit;overflow:hidden;background:linear-gradient(#eef4fb,#cddaec)}' +
    '.pd3-box[hidden]{display:none}.pd3-cv{position:absolute;left:0;top:0;right:0;bottom:0}' +
    '.pd3-msg{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font-weight:600;font-size:13px;line-height:1.4;color:#44506a;padding:0 16px;pointer-events:none}' +
    '.pd3-bar{position:absolute;left:6px;right:6px;bottom:8px;z-index:2;display:flex;gap:4px;justify-content:center;flex-wrap:wrap}' +
    '.pd3-bar button{background:rgba(255,255,255,.86);border:1px solid #d3dbe8;padding:6px 10px;font-size:11.5px}' +
    '.pd3-bar button.on{background:#14233b;border-color:#14233b;color:#fff}' +
    '.pd3-hint{position:absolute;right:10px;top:12px;z-index:2;font-weight:600;font-size:11px;line-height:1.3;color:#5a6780;max-width:46%;text-align:right;pointer-events:none}' +
    '@media (pointer:coarse){.pd3-sw button{padding:10px 14px}.pd3-bar{gap:3px;flex-wrap:nowrap}.pd3-bar button{padding:10px 9px;font-size:12px;white-space:nowrap}}' +
    '@media (max-width:600px){.pd3-hint{display:none}}' +
    '@media print{.pd3-sw,.pd3-box{display:none!important}}';
  document.head.appendChild(css);

  var sw = el('div', 'pd3-sw', '<button type="button" data-m="2" class="on">Çizim</button><button type="button" data-m="3">3B</button>');
  var box = el('div', 'pd3-box', '<div class="pd3-cv"></div><div class="pd3-msg">3B model yükleniyor…</div><div class="pd3-hint">Döndürmek için sürükleyin</div>' +
    '<div class="pd3-bar"><button type="button" data-v="capraz" class="on">Çapraz</button><button type="button" data-v="on">Önden</button><button type="button" data-v="yan">Yandan</button><button type="button" data-v="ust">Üstten</button><button type="button" data-h="1" class="on">Baş</button></div>');
  box.hidden = true; sw.setAttribute('role', 'group'); sw.setAttribute('aria-label', 'Görünüm');
  stage.appendChild(box); stage.appendChild(sw);
  var cv = box.querySelector('.pd3-cv'), msg = box.querySelector('.pd3-msg');

  function params() {
    var S = D.S, P = { A: S.A, dbl: S.DBL, pd: S.R.pd + S.L.pd, shape: 'ozel', frame: 'metal', color: 'siyah', head: head, auto: false, zoom: 0.74 };
    [['r', 'R'], ['l', 'L']].forEach(function (a) {
      var e = a[1], o = S[e], oc = D.oc(e), T = D.thick(e, oc), b = D.boxC(e), n, loc = D.rimPts(e).map(function (q) { return [q.x - b.x, q.y - b.y]; }); n = loc.length;
      P[a[0]] = { s: o.sph, c: o.cyl, a: o.ax, n: S.idx, oc: [oc.x - b.x, oc.y - b.y], g: T.w, label: fmt(Math.max(T.tc, T.max)),
        contour: function (phi) { var f = phi / (2 * Math.PI) * n, i0 = Math.floor(f), u = f - i0, i = i0 % n, k = (i0 + 1) % n; return [loc[i][0] * (1 - u) + loc[k][0] * u, loc[i][1] * (1 - u) + loc[k][1] * u]; },
        thk: function (x, y) { return T.tc - T.sag(x + b.x, y + b.y); } };
    });
    return P;
  }
  function push() { if (on && ready) { try { window.CGS3D.set(params()); } catch (x) {} } }
  function later() { clearTimeout(tmr); tmr = setTimeout(push, 70); }
  function load() {
    if (ready || loading) return; loading = true;
    function go() { window.CGS3D.mount(cv, BASE, function (err) { loading = false; if (err) { msg.textContent = '3B model yüklenemedi. Bağlantınızı kontrol edip yeniden deneyin.'; return; }
      ready = true; msg.style.display = 'none'; window.CGS3D.show(on); push(); window.CGS3D.view(vname); }); }
    if (window.CGS3D) return go();
    var s = document.createElement('script'); s.src = BASE + 'cgs3d.js'; s.charset = 'utf-8'; s.onload = go; s.onerror = function () { loading = false; msg.textContent = '3B model yüklenemedi. Bağlantınızı kontrol edip yeniden deneyin.'; }; document.head.appendChild(s);
  }
  function mode(m) {
    on = m === '3'; box.hidden = !on; var sw0 = stage.clientWidth; stage.style.minHeight = on && sw0 < 560 ? Math.round(Math.min(sw0 * 0.86, (window.innerHeight || 700) * 0.62)) + 'px' : ''; [].forEach.call(sw.querySelectorAll('button'), function (b) { b.classList.toggle('on', b.getAttribute('data-m') === m); b.setAttribute('aria-pressed', b.getAttribute('data-m') === m ? 'true' : 'false'); });
    if (on) { load(); if (ready) { window.CGS3D.show(true); push(); } } else if (ready) window.CGS3D.show(false);
  }
  sw.addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (b) mode(b.getAttribute('data-m')); });
  box.querySelector('.pd3-bar').addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-h')) { head = !head; b.classList.toggle('on', head); push(); return; }
    vname = b.getAttribute('data-v'); [].forEach.call(box.querySelectorAll('[data-v]'), function (x) { x.classList.toggle('on', x === b); }); if (ready) window.CGS3D.view(vname);
  });
  if (window.MutationObserver) new MutationObserver(later).observe(svg, { attributes: true, childList: true, subtree: true });
  if (window.ResizeObserver) new ResizeObserver(function () { if (on && ready) window.CGS3D.resize(); }).observe(stage);
})();
