/* Görme alanı taraması (eşik üstü) · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-alan'); if (!K || !root || root.querySelector('canvas')) return;
  var S = { goz: 'sag', mes: 30 }, T = null, RES = null, W = 0, H = 0;
  root.innerHTML = '<p class="cgt-lead">Santral görme alanı için hızlı, eşik üstü tarama: hasta ortadaki işarete bakar, çevrede kısa süre beliren ışığı her gördüğünde boşluk tuşuna basar ya da ekrana dokunur. Kör nokta kontrolü ve yalancı pozitif denemeleri içerir.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="gaP"></div><div class="cgt-col">' + K.stage('ga', 'min(74vh,640px)', '#1c1c1c') + '<div class="cgt-info" id="gaI"></div></div></div>' +
    '<p class="cgt-note">Bu bir perimetri cihazı değildir: ekran parlaklığı kalibre edilmez, eşik ölçülmez, yalnızca parlak uyaranın görülüp görülmediği kaydedilir. Sonuç kaba bir taramadır; şüpheli her bulgu standart otomatik perimetriyle doğrulanmalıdır. En geniş alan için önce tam ekrana geçin, odayı loşlaştırın ve diğer gözü kapatın.</p>' + K.dr;
  function d2p(deg) { return S.mes * 10 * Math.tan(deg * Math.PI / 180) * K.pxmm(); }
  function pts(w, h) { var a = [], xs = [-27, -21, -15, -9, -3, 3, 9, 15, 21, 27], ys = [-21, -15, -9, -3, 3, 9, 15, 21], m = 14; xs.forEach(function (x) { ys.forEach(function (y) { if (Math.abs(d2p(x)) < w / 2 - m && Math.abs(d2p(y)) < h / 2 - m && Math.sqrt(x * x + y * y) < 31) a.push({ x: x, y: y, n: 0, r: '' }); }); }); return a; }
  function kn() { var x = S.goz === 'sag' ? 15 : -15; return { x: x, y: 1.5 }; }
  function panel() {
    var run = !!T;
    K.$('gaP').innerHTML = '<div><p class="cgt-h">Test edilen göz</p>' + K.chips('g', [['sag', 'Sağ (OD)'], ['sol', 'Sol (OS)']], S.goz) + '</div>' + K.range('mes', 'Göz-ekran mesafesi', S.mes, 20, 60, 1, ' cm') +
      '<div class="cgt-row"><span>Taranacak alan</span><b id="gaAl"></b></div><div class="cgt-row"><span>Nokta sayısı</span><b id="gaN"></b></div>' +
      '<div class="cgt-chips"><button type="button" class="cgt-btn y" data-a="' + (run ? 'dur' : 'bas') + '">' + (run ? 'Testi durdur' : 'Testi başlat') + '</button></div>' +
      '<div id="gaPr" style="font-size:13.5px;font-weight:700;color:#004aad"></div><div id="gaK"></div>';
    if (!run) K.calib(K.$('gaK'), function () { ozet(); redraw(); });
    ozet();
  }
  function ozet() { var P = pts(W, H), mx = 0, my = 0, a = K.$('gaAl'), b = K.$('gaP').querySelector('[data-a="bas"]'); if (!a) return; P.forEach(function (p) { mx = Math.max(mx, Math.abs(p.x)); my = Math.max(my, Math.abs(p.y)); }); a.textContent = P.length ? '±' + mx + '° × ±' + my + '°' : 'sığmıyor'; K.$('gaN').textContent = P.length; if (b) b.disabled = P.length < 8; }
  function info() {
    var el = K.$('gaI');
    if (T) { el.innerHTML = '<b>Test sürüyor.</b> Ortadaki sarı işarete bakın; çevrede ışık gördüğünüz her an <b>boşluk</b> tuşuna basın ya da ekrana dokunun.'; return; }
    if (!RES) { el.innerHTML = '<b>Hazırlık:</b> Kalibrasyonu yapın, hastayı ekrana ' + S.mes + ' cm uzağa oturtun, test edilmeyen gözü kapatın. Uyaran Goldmann III boyutuna (0,43°) denktir, 200 ms görünür; kaçırılan noktalar bir kez daha sorulur.' + (pts(W, H).length < 20 ? ' <b>Bu ekran dar bir alanı tarayabiliyor;</b> tam ekrana geçin, mümkünse tablet ya da bilgisayar kullanın.' : ''); return; }
    var k = RES.p.filter(function (p) { return p.r === 'k'; }), y = RES.p.filter(function (p) { return p.r === 'y'; }); var sr = RES.p.filter(function (p) { return p.r; });
    function ad(p) { var t = (S.goz === 'sag') === (p.x > 0) ? 'temporal' : 'nazal'; return Math.abs(p.x) + '° ' + t + ', ' + Math.abs(p.y) + '° ' + (p.y < 0 ? 'üst' : 'alt'); }
    el.innerHTML = '<b>Sonuç (' + (RES.goz === 'sag' ? 'sağ' : 'sol') + ' göz, ' + RES.mes + ' cm):</b> ' + (RES.done ? RES.p.length : sr.length) + ' ' + (RES.done ? '' : 'test edilen ') + 'noktanın <b>' + (sr.length - k.length) + '</b> tanesi görüldü' + (y.length ? ' (' + y.length + ' tanesi ikinci denemede)' : '') + ', <b>' + k.length + '</b> nokta iki denemede de görülmedi' + (k.length ? ': ' + k.slice(0, 12).map(ad).join(' · ') + (k.length > 12 ? ' …' : '') : '') + '.<br><b>Güvenilirlik:</b> yalancı pozitif ' + RES.fp + '/' + RES.fpN + ', fiksasyon kaybı (kör noktada görülen uyaran) ' + RES.fl + '/' + RES.flN + '.' + (RES.fpN && RES.fp / RES.fpN > .33 || RES.flN && RES.fl / RES.flN > .33 ? ' <b style="color:#b3261e">Güvenilirlik düşük; testi tekrarlayın.</b>' : '') + (RES.done ? '' : ' <b>Test erken durduruldu; ' + (RES.p.length - sr.length) + ' nokta sorulmadı.</b>');
  }
  function draw(g, w, h) {
    W = w; H = h; g.fillStyle = '#1c1c1c'; g.fillRect(0, 0, w, h); var cx = w / 2, cy = h / 2, r = Math.max(2, d2p(.215)), now = performance.now();
    function dot(p, col, rr) { g.fillStyle = col; g.beginPath(); g.arc(cx + d2p(p.x), cy + d2p(p.y), rr || r, 0, 7); g.fill(); }
    if (!T) {
      var list = RES ? RES.p : pts(w, h);
      g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, cy); g.lineTo(w, cy); g.moveTo(cx, 0); g.lineTo(cx, h); g.stroke();
      [10, 20, 30].forEach(function (d) { g.beginPath(); g.arc(cx, cy, d2p(d), 0, 7); g.stroke(); });
      list.forEach(function (p) { if (!RES) dot(p, 'rgba(255,255,255,.3)', 3); else if (p.r === 'k') { g.fillStyle = '#ff4d4d'; g.fillRect(cx + d2p(p.x) - 7, cy + d2p(p.y) - 7, 14, 14); } else dot(p, p.r === 'y' ? '#ffd400' : p.r === 'g' ? '#39d98a' : 'rgba(255,255,255,.25)', 5); });
      var b = kn(); g.strokeStyle = 'rgba(120,190,255,.8)'; g.setLineDash([4, 4]); g.beginPath(); g.ellipse(cx + d2p(b.x), cy + d2p(b.y), d2p(2.75), d2p(3.75), 0, 0, 7); g.stroke(); g.setLineDash([]);
      g.fillStyle = 'rgba(255,255,255,.75)'; g.font = '700 12.5px Arial'; g.textAlign = 'center';
      g.fillText(RES ? 'Yeşil: görüldü · Sarı: ikinci denemede görüldü · Kırmızı kare: görülmedi · Kesikli: kör nokta' : 'Açık noktalar taranacak konumlar · Kesikli elips beklenen kör nokta', cx, h - 12);
      g.fillText((S.goz === 'sag' ? 'Nazal ←   → Temporal' : 'Temporal ←   → Nazal'), cx, 20);
    } else if (T.cur && now >= T.cur.on && now < T.cur.on + 200 && T.cur.t !== 'fp') dot(T.cur.p, '#fff');
    g.strokeStyle = '#ffd400'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 7, cy); g.lineTo(cx + 7, cy); g.moveTo(cx, cy - 7); g.lineTo(cx, cy + 7); g.stroke();
  }
  var cv = K.$('gaC'), redraw = K.fit(cv, function (g, w, h) { var ch = (w !== W || h !== H) && !T; draw(g, w, h); if (ch) ozet(); });
  function bitir(done) { RES = { p: T.all, fp: T.fp, fpN: T.fpN, fl: T.fl, flN: T.flN, goz: S.goz, mes: S.mes, done: done }; T = null; panel(); info(); redraw(); }
  function sonraki() {
    var now = performance.now(), b = kn(), bsOk = Math.abs(d2p(b.x)) < W / 2 - 10, c;
    if (!T.q.length) { bitir(true); return; }
    T.i++;
    if (T.i % 7 === 3) c = { t: 'fp', p: null }; else if (T.i % 7 === 6 && bsOk) c = { t: 'bs', p: b }; else c = { t: 'n', p: T.q.shift() };
    c.on = now + 900 + Math.random() * 900; T.cur = c;
    var left = T.q.length, el = K.$('gaPr'); if (el) el.textContent = 'Kalan nokta: ' + left;
  }
  function kapat(seen) {
    var c = T.cur; T.cur = null;
    if (c.t === 'fp') { T.fpN++; if (seen) T.fp++; } else if (c.t === 'bs') { T.flN++; if (seen) T.fl++; }
    else if (seen) c.p.r = c.p.n ? 'y' : 'g'; else if (c.p.n === 0) { c.p.n = 1; T.q.splice(Math.min(T.q.length, 3 + Math.floor(Math.random() * 4)), 0, c.p); } else c.p.r = 'k';
    sonraki();
  }
  function tick() { if (!document.body.contains(cv)) return; if (T && T.cur) { var now = performance.now(); if (T.cur.hit) kapat(true); else if (now > T.cur.on + 1100) kapat(false); } if (T) redraw(); requestAnimationFrame(tick); }
  requestAnimationFrame(tick);
  function yanit() { if (!T || !T.cur) return; var now = performance.now(); if (now >= T.cur.on + 120 && now <= T.cur.on + 1100) T.cur.hit = true; }
  document.addEventListener('keydown', function (e) { if (T && (e.code === 'Space' || e.key === ' ')) { e.preventDefault(); yanit(); } });
  cv.addEventListener('pointerdown', yanit);
  K.$('gaP').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var gz = b.getAttribute('data-g'), a = b.getAttribute('data-a');
    if (gz && !T) { S.goz = gz; RES = null; }
    else if (a === 'bas') { var all = pts(W, H), q = all.slice().sort(function () { return Math.random() - .5; }); RES = null; T = { all: all, q: q, i: 0, fp: 0, fpN: 0, fl: 0, flN: 0, cur: null }; panel(); sonraki(); info(); redraw(); return; }
    else if (a === 'dur' && T) { bitir(false); return; } else return;
    panel(); info(); redraw();
  });
  K.$('gaP').addEventListener('input', function (e) { if (e.target.getAttribute('data-k') !== 'mes' || T) return; S.mes = +e.target.value; RES = null; K.$('gaP').querySelector('[data-v="mes"]').textContent = S.mes + ' cm'; ozet(); info(); redraw(); });
  panel(); info();
})();
