/* Klinik araçlar ortak yardımcıları · cagataygulumser.com */
(function () {
  'use strict';
  if (window.CGK) return;
  var K = window.CGK = {};
  K.$ = function (i) { return document.getElementById(i); };
  K.get = function (k, d) { try { var v = localStorage.getItem('cgk-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  K.set = function (k, v) { try { localStorage.setItem('cgk-' + k, JSON.stringify(v)); } catch (e) { } };
  K.pxmm = function () { return K.get('pxmm', 96 / 25.4); };
  K.calibrated = function () { return K.get('pxmm', 0) > 0; };
  K.cl = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  K.tr = function (v, n) { return v.toFixed(n == null ? 1 : n).replace('.', ','); };
  K.chips = function (attr, list, cur) { return '<div class="cgt-chips">' + list.map(function (o) { return '<button type="button" class="cgt-chip' + (o[0] === cur ? ' on' : '') + '" data-' + attr + '="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>'; };
  K.range = function (key, label, val, min, max, step, unit, disp) { return '<div><div class="cgt-row"><span>' + label + '</span><b data-v="' + key + '">' + (disp == null ? val : disp) + (unit || '') + '</b></div><input type="range" data-k="' + key + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>'; };
  K.dr = '<p class="cgt-note">Bu sayfa göz hekimleri ve klinik eğitim için hazırlanmıştır. Tıbbi cihaz değildir; ekran parlaklığı, renk ve boyut cihaza göre değişir. Tanı ve tedavi kararı klinik muayeneye dayanır.</p>';
  var st = document.createElement('style');
  st.textContent = '.cgk-stage{position:relative}.cgk-stage canvas{position:absolute;left:0;top:0;width:100%!important;height:100%!important;touch-action:none;object-fit:contain}' +
    '.cgk-fs{position:absolute;right:10px;top:10px;z-index:3;border:0;border-radius:999px;padding:7px 12px;font:700 12.5px Arial,sans-serif;background:rgba(8,20,45,.78);color:#fff;cursor:pointer}' +
    '.cgk-full{position:fixed!important;left:0;top:0;width:100vw!important;height:100vh!important;height:100dvh!important;z-index:2147483000;border-radius:0!important;margin:0!important}' +
    '.cgk-card{height:26px;background:linear-gradient(90deg,#004aad,#2f86ff);border-radius:4px;margin:6px 0;max-width:100%}' +
    '.cgk-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.cgk-m{border:1px solid #d7e0ee;border-radius:12px;padding:10px 6px;text-align:center;font-weight:800;font-size:14px;background:#fff}.cgk-m small{display:block;font-weight:600;font-size:11px;color:#5b6b82}.cgk-m.off{opacity:.25;text-decoration:line-through}.cgk-m.hit{background:#004aad;color:#fff;border-color:#004aad}.cgk-m.hit small{color:#cfe3ff}' +
    '.cgk-tbl{width:100%;border-collapse:collapse;font-size:14px}.cgk-tbl td,.cgk-tbl th{border-bottom:1px solid #d7e0ee;padding:8px 6px;text-align:left;vertical-align:top}.cgk-tbl th{font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:#004aad}.cgk-tbl td:first-child{font-weight:800;color:#004aad;white-space:nowrap}';
  document.head.appendChild(st);
  /* Tam ekran: gerçek tam ekran desteklenmiyorsa (iPhone) sabit konumlu kaplama kullanılır */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-fs]'); if (!b) return;
    var s = K.$(b.getAttribute('data-fs')); if (!s) return;
    var on = !s.classList.contains('cgk-full'); s.classList.toggle('cgk-full', on); b.textContent = on ? 'Kapat' : 'Tam ekran';
    try { if (on && s.requestFullscreen) { var p = s.requestFullscreen(); if (p && p.catch) p.catch(function () { }); } else if (!on && document.fullscreenElement) document.exitFullscreen(); } catch (x) { }
  });
  document.addEventListener('fullscreenchange', function () {
    if (document.fullscreenElement) return;
    [].forEach.call(document.querySelectorAll('.cgk-full'), function (s) { s.classList.remove('cgk-full'); var b = s.querySelector('.cgk-fs'); if (b) b.textContent = 'Tam ekran'; });
  });
  K.stage = function (id, h, bg) { return '<div class="cgt-stage cgk-stage" id="' + id + 'S" style="height:' + (h || 'min(72vh,600px)') + ';background:' + (bg || '#000') + '"><canvas id="' + id + 'C"></canvas><button type="button" class="cgk-fs" data-fs="' + id + 'S">Tam ekran</button></div>'; };
  /* Tuvali görünen boyuta ve piksel yoğunluğuna oturtur; draw(g,w,h) CSS pikseliyle çizer */
  K.fit = function (cv, draw) {
    var g = cv.getContext('2d');
    function r() { var d = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return; if (cv.width !== Math.round(w * d) || cv.height !== Math.round(h * d)) { cv.width = Math.round(w * d); cv.height = Math.round(h * d); } g.setTransform(d, 0, 0, d, 0, 0); draw(g, w, h); }
    if (window.ResizeObserver) new ResizeObserver(r).observe(cv); else window.addEventListener('resize', r);
    r(); return r;
  };
  /* Kart ile ekran kalibrasyonu (piksel/mm) */
  K.calib = function (host, cb) {
    function ui() {
      var v = K.pxmm();
      host.innerHTML = '<p class="cgt-h">Ekran kalibrasyonu</p><div style="font-size:12.5px;color:#5b6b82">Bir banka ya da kimlik kartının <b>kısa kenarını</b> mavi şeride dayayın; şerit kartla aynı boya gelene kadar kaydırın.</div><div class="cgk-card" style="width:' + (53.98 * v).toFixed(1) + 'px"></div><input type="range" min="2" max="12" step="0.01" value="' + v + '" aria-label="Kalibrasyon"><div class="cgt-row" style="margin-top:4px"><span>' + (K.calibrated() ? 'Kalibre edildi' : 'Henüz kalibre edilmedi') + '</span><b>' + K.tr(v, 2) + ' px/mm</b></div>';
    }
    ui();
    host.addEventListener('input', function (e) { if (e.target.type !== 'range') return; var v = +e.target.value; K.set('pxmm', v); host.querySelector('.cgk-card').style.width = (53.98 * v).toFixed(1) + 'px'; host.querySelector('.cgt-row').innerHTML = '<span>Kalibre edildi</span><b>' + K.tr(v, 2) + ' px/mm</b>'; if (cb) cb(v); });
  };
})();
