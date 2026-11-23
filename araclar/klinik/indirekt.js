/* İndirekt oftalmoskopi simülatörü · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-indirekt'); if (!K || !root || root.querySelector('canvas')) return;
  var FS = 1200, PD = 10; /* fundus haritası: 1200 px = 120°, 10 px/derece */
  var LN = { 14: [36, '4,2'], 20: [46, '3,1'], 28: [55, '2,3'] };
  var LZ = { yirtik: 'At nalı yırtık', lattice: 'Lattice dejenerasyonu', kanama: 'Retina içi kanama', nevus: 'Koroid nevüsü', chrpe: 'RPE hipertrofisi (CHRPE)' };
  var S = { goz: 'sag', lens: 20, ters: true, harita: false, vx: 0, vy: 0, cvp: null, sk: { ok: 0, n: 0 }, res: '' }, C = null, F = document.createElement('canvas'); F.width = F.height = FS;
  root.innerHTML = '<p class="cgt-lead">Kondansasyon merceğinde fundus görüntüsü ters ve yan dönmüş oluşur. Görüntüyü sürükleyerek periferiyi tarayın, gizlenmiş lezyonu bulun ve gerçekte hangi saat kadranında olduğunu işaretleyin.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="inP"></div><div class="cgt-col">' + K.stage('in', 'min(72vh,600px)', '#05070c') + '<div class="cgt-info" id="inI"></div></div></div>' +
    '<p class="cgt-note">Saat kadranı muayene edenin baktığı yöne göredir: 12 üst, 6 alt; sağ gözde saat 3 nazal, sol gözde saat 3 temporaldir. Görüş alanı ve büyütme değerleri yaklaşıktır. Fundus çizimi şematiktir; skleral çökertme, stereopsis ve hasta-hekim hizalaması taklit edilmez.</p>' + K.dr;
  function yeni() { var t = Object.keys(LZ); C = { tip: t[Math.floor(Math.random() * t.length)], saat: 1 + Math.floor(Math.random() * 12), ek: 30 + Math.random() * 18 }; S.vx = S.vy = 0; S.res = ''; S.cvp = null; fundus(); }
  function lpos() { var a = C.saat * Math.PI / 6; return [Math.sin(a) * C.ek, -Math.cos(a) * C.ek]; }
  function fundus() {
    var g = F.getContext('2d'), m = FS / 2, nz = S.goz === 'sag' ? 1 : -1, dx = m + nz * 15 * PD, dy = m - 1.5 * PD, i, gr;
    gr = g.createRadialGradient(m, m, 40, m, m, m); gr.addColorStop(0, '#d9632b'); gr.addColorStop(.55, '#c9542a'); gr.addColorStop(.9, '#9c4526'); gr.addColorStop(1, '#5b2a1a'); g.fillStyle = '#000'; g.fillRect(0, 0, FS, FS); g.fillStyle = gr; g.beginPath(); g.arc(m, m, m - 4, 0, 7); g.fill();
    g.strokeStyle = 'rgba(120,40,20,.12)'; g.lineWidth = 7; for (i = 0; i < 40; i++) { var a = i * .157; g.beginPath(); g.moveTo(m + Math.cos(a) * 260, m + Math.sin(a) * 260); g.lineTo(m + Math.cos(a + .08) * 590, m + Math.sin(a + .08) * 590); g.stroke(); }
    g.strokeStyle = 'rgba(60,25,15,.55)'; g.lineWidth = 5; g.setLineDash([14, 9]); g.beginPath(); g.arc(m, m, m - 22, 0, 7); g.stroke(); g.setLineDash([]);
    gr = g.createRadialGradient(m, m, 2, m, m, 42); gr.addColorStop(0, 'rgba(90,30,15,.75)'); gr.addColorStop(1, 'rgba(90,30,15,0)'); g.fillStyle = gr; g.beginPath(); g.arc(m, m, 42, 0, 7); g.fill();
    function dal(x1, y1, x2, y2, x3, y3, x4, y4, c, w) { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x1, y1); g.bezierCurveTo(x2, y2, x3, y3, x4, y4); g.stroke(); }
    [-1, 1].forEach(function (v) {
      [['#8e1f1f', 6, 0], ['#c8402e', 4, 9]].forEach(function (d) {
        var o = d[2]; dal(dx, dy + o * .3, dx - nz * 60, dy + v * 150 + o, m - nz * 150, m + v * 200 + o, m - nz * 430, m + v * 120 + o, d[0], d[1]);
        dal(dx, dy, dx + nz * 80 + o, dy + v * 90, dx + nz * 200 + o, dy + v * 200, dx + nz * 330 + o, dy + v * 330, d[0], d[1] * .8);
        dal(dx - nz * 40, dy + v * 110 + o, m - nz * 20, m + v * 250, m - nz * 60 + o, m + v * 400, m - nz * 120 + o, m + v * 540, d[0], d[1] * .6);
        dal(m - nz * 110, m + v * 185 + o, m - nz * 110, m + v * 120, m - nz * 80, m + v * 80, m - nz * 55 + o * .3, m + v * 55, d[0], d[1] * .45);
      });
    });
    gr = g.createRadialGradient(dx, dy, 2, dx, dy, 9 * PD / 2); gr.addColorStop(0, '#fff6d8'); gr.addColorStop(.35, '#ffe2a8'); gr.addColorStop(.85, '#f3b877'); gr.addColorStop(1, '#d9763a'); g.fillStyle = gr; g.beginPath(); g.ellipse(dx, dy, 7.5 * PD / 2, 9 * PD / 2, 0, 0, 7); g.fill();
    var p = lpos(), x = m + p[0] * PD, y = m + p[1] * PD, ra = Math.atan2(p[1], p[0]); g.save(); g.translate(x, y); g.rotate(ra);
    if (C.tip === 'yirtik') { g.fillStyle = 'rgba(255,235,220,.35)'; g.beginPath(); g.ellipse(0, 0, 46, 40, 0, 0, 7); g.fill(); g.fillStyle = '#a3261c'; g.beginPath(); g.moveTo(-22, -26); g.quadraticCurveTo(34, -34, 34, 0); g.quadraticCurveTo(34, 34, -22, 26); g.quadraticCurveTo(6, 16, 6, 0); g.quadraticCurveTo(6, -16, -22, -26); g.fill(); g.fillStyle = 'rgba(245,225,210,.8)'; g.beginPath(); g.moveTo(-20, -18); g.quadraticCurveTo(2, -10, 2, 0); g.quadraticCurveTo(2, 10, -20, 18); g.closePath(); g.fill(); }
    else if (C.tip === 'lattice') { g.fillStyle = 'rgba(70,35,25,.5)'; g.beginPath(); g.ellipse(0, 0, 16, 62, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 2; for (i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(-12, i * 15 - 8); g.lineTo(12, i * 15 + 8); g.stroke(); g.beginPath(); g.moveTo(12, i * 15 - 8); g.lineTo(-12, i * 15 + 8); g.stroke(); } }
    else if (C.tip === 'kanama') { g.fillStyle = '#6e0f0f';[[0, 0, 26], [22, 12, 14], [-16, 18, 12], [8, -22, 11]].forEach(function (b) { g.beginPath(); g.arc(b[0], b[1], b[2], 0, 7); g.fill(); }); }
    else if (C.tip === 'nevus') { g.fillStyle = 'rgba(70,85,80,.75)'; g.beginPath(); g.ellipse(0, 0, 34, 26, .4, 0, 7); g.fill(); g.fillStyle = 'rgba(255,230,150,.7)';[[-8, -6], [10, 4], [0, 10]].forEach(function (b) { g.beginPath(); g.arc(b[0], b[1], 3, 0, 7); g.fill(); }); }
    else { g.fillStyle = '#1b1410'; g.beginPath(); g.arc(0, 0, 30, 0, 7); g.fill(); g.strokeStyle = 'rgba(240,220,200,.8)'; g.lineWidth = 3; g.stroke(); g.fillStyle = 'rgba(240,220,200,.75)';[[-8, -8, 6], [10, 6, 5]].forEach(function (b) { g.beginPath(); g.arc(b[0], b[1], b[2], 0, 7); g.fill(); }); }
    g.restore();
  }
  function panel() {
    K.$('inP').innerHTML = '<div><p class="cgt-h">Göz</p>' + K.chips('g', [['sag', 'Sağ (OD)'], ['sol', 'Sol (OS)']], S.goz) + '</div>' +
      '<div><p class="cgt-h">Kondansasyon merceği</p>' + K.chips('l', [[14, '14 D'], [20, '20 D'], [28, '28 D']], S.lens) + '<div style="font-size:12.5px;color:#5b6b82;margin-top:6px">Alan ≈ ' + LN[S.lens][0] + '° · büyütme ≈ ' + LN[S.lens][1] + '×</div></div>' +
      '<div><p class="cgt-h">Görüntü</p>' + K.chips('v', [['t', 'İndirekt (ters)'], ['d', 'Düz (karşılaştırma)']], S.ters ? 't' : 'd') + '</div>' +
      '<label class="cgt-tog"><input type="checkbox" id="inH"' + (S.harita ? ' checked' : '') + '> Gerçek yön haritasını göster</label>' +
      '<div><p class="cgt-h">Lezyon hangi saat kadranında?</p><div class="cgt-chips">' + [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (n) { return '<button type="button" class="cgt-chip' + (S.cvp === n ? ' on' : '') + '" data-c="' + n + '" style="min-width:44px">' + n + '</button>'; }).join('') + '</div></div>' +
      '<div class="cgt-chips"><button type="button" class="cgt-btn y" data-a="yeni">Yeni olgu</button><button type="button" class="cgt-btn" data-a="orta">Arka kutba dön</button></div><div style="font-size:20px;font-weight:800;color:#004aad">' + S.sk.ok + ' / ' + S.sk.n + '</div>';
  }
  function info() {
    var e = Math.sqrt(S.vx * S.vx + S.vy * S.vy), yer = e < 12 ? 'arka kutup' : (S.vy < -8 ? 'üst' : S.vy > 8 ? 'alt' : '') + (Math.abs(S.vx) > 8 ? ((S.vx > 0) === (S.goz === 'sag') ? ' nazal' : ' temporal') : '') + ' periferi';
    K.$('inI').innerHTML = '<b>Bakılan bölge:</b> ' + yer.trim() + ' (' + Math.round(e) + '° eksantrisite). ' + (S.ters ? 'Mercekteki görüntü 180° dönmüştür: merceğin üst yarısında gördüğünüz yapı, bakılan bölgenin alt kısmıdır; sağ-sol da yer değiştirir. Çizim yaparken kâğıdı ters çevirip gördüğünüzü aynen çizmek bu yüzden işe yarar.' : 'Düz görüntü: yapılar gerçek yönleriyle görünür.') + (S.res ? '<br>' + S.res : '');
  }
  function draw(g, w, h) {
    var cx = w / 2, cy = h / 2, R = Math.min(w, h) * .42, k = R / (LN[S.lens][0] / 2 * PD);
    g.fillStyle = '#05070c'; g.fillRect(0, 0, w, h);
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.clip(); g.fillStyle = '#000'; g.fillRect(cx - R, cy - R, 2 * R, 2 * R); g.translate(cx, cy); if (S.ters) g.rotate(Math.PI); g.scale(k, k); g.drawImage(F, -FS / 2 - S.vx * PD, -FS / 2 - S.vy * PD); g.restore();
    var gr = g.createRadialGradient(cx, cy, R * .82, cx, cy, R); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill();
    g.strokeStyle = '#9aa7b8'; g.lineWidth = 5; g.beginPath(); g.arc(cx, cy, R + 2, 0, 7); g.stroke(); g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.ellipse(cx - R * .38, cy - R * .5, R * .1, R * .035, -.6, 0, 7); g.fill(); g.beginPath(); g.ellipse(cx + R * .3, cy + R * .55, R * .06, R * .02, -.6, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,.7)'; g.font = '700 12.5px Arial'; g.textAlign = 'center'; g.fillText(S.lens + ' D · ' + (S.ters ? 'ters ve yan dönmüş görüntü' : 'düz görüntü') + ' · sürükleyerek tarayın', cx, h - 12);
    if (S.harita) { var ms = Math.min(150, w * .26), mx = 12, my = 12; g.drawImage(F, mx, my, ms, ms); g.strokeStyle = '#ffd400'; g.lineWidth = 2; g.beginPath(); g.arc(mx + ms / 2 + S.vx * PD * ms / FS, my + ms / 2 + S.vy * PD * ms / FS, LN[S.lens][0] / 2 * PD * ms / FS, 0, 7); g.stroke(); g.fillStyle = '#fff'; g.font = '700 11px Arial'; g.textAlign = 'left'; g.fillText('Gerçek yön (12 üstte)', mx, my + ms + 14); }
  }
  yeni(); panel();
  var cv = K.$('inC'), redraw = K.fit(cv, draw), dr = null; info();
  function sinir() { var e = Math.sqrt(S.vx * S.vx + S.vy * S.vy); if (e > 52) { S.vx *= 52 / e; S.vy *= 52 / e; } }
  cv.addEventListener('pointerdown', function (e) { try { cv.setPointerCapture(e.pointerId); } catch (x) { } dr = [e.clientX, e.clientY]; });
  cv.addEventListener('pointermove', function (e) { if (!dr) return; var R = Math.min(cv.clientWidth, cv.clientHeight) * .42, k = R / (LN[S.lens][0] / 2 * PD), s = S.ters ? 1 : -1; S.vx += s * (e.clientX - dr[0]) / k / PD; S.vy += s * (e.clientY - dr[1]) / k / PD; dr = [e.clientX, e.clientY]; sinir(); redraw(); info(); });
  cv.addEventListener('pointerup', function () { dr = null; }); cv.addEventListener('pointercancel', function () { dr = null; });
  K.$('inP').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var gz = b.getAttribute('data-g'), l = b.getAttribute('data-l'), v = b.getAttribute('data-v'), c = b.getAttribute('data-c'), a = b.getAttribute('data-a');
    if (gz) { S.goz = gz; yeni(); } else if (l) S.lens = +l; else if (v) S.ters = v === 't'; else if (a === 'yeni') yeni(); else if (a === 'orta') S.vx = S.vy = 0;
    else if (c) { if (S.cvp != null) return; S.cvp = +c; S.sk.n++; var ok = S.cvp === C.saat, yk = Math.abs(S.cvp - C.saat) === 1 || Math.abs(S.cvp - C.saat) === 11; if (ok) S.sk.ok++; S.res = (ok ? '<b style="color:#0a7a3d">Doğru.</b> ' : yk ? '<b style="color:#b8860b">Yakın.</b> ' : '<b style="color:#b3261e">Tutmadı.</b> ') + 'Lezyon: <b>' + LZ[C.tip] + '</b>, saat <b>' + C.saat + '</b> kadranında, yaklaşık ' + Math.round(C.ek) + '° eksantrisitede. Haritayı açıp gerçek konumu görebilirsiniz.'; }
    else return; panel(); info(); redraw();
  });
  K.$('inP').addEventListener('change', function (e) { if (e.target.id === 'inH') { S.harita = e.target.checked; redraw(); } });
})();
