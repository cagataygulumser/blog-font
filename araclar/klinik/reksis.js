/* Kapsüloreksis alıştırması · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-reksis'); if (!K || !root || root.querySelector('canvas')) return;
  var S = { kilavuz: true, titreme: 0, hedef: 5.25 }, P = [], cur = null, tgt = null, down = false, R = null, best = K.get('reksis', 0), sc = 1, CX = 0, CY = 0;
  root.innerHTML = '<p class="cgt-lead">Ön kapsülde sürekli, dairesel ve merkezde bir kapsüloreksis çizmeyi deneyin: parmağınızla ya da fareyle basılı tutup yırtığı bir tur dolandırın, bıraktığınızda çap, dairesellik ve merkezleme puanlanır.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="rkP"></div><div class="cgt-col">' + K.stage('rk', 'min(72vh,600px)', '#f1ece6') + '<div class="cgt-info" id="rkI"></div></div></div>' +
    '<p class="cgt-note">Bu bir el-göz koordinasyon alıştırmasıdır; kapsülün gerçek yırtılma davranışını, viskoelastik etkisini, derinlik algısını ve alet tutuşunu taklit etmez. Cerrahi eğitim, simülatör ve wet-lab çalışmasının yerini tutmaz.</p>' + K.dr;
  function panel() {
    K.$('rkP').innerHTML = K.range('hedef', 'Hedef çap', S.hedef, 4.5, 6, .25, ' mm', K.tr(S.hedef, 2)) +
      '<div><p class="cgt-h">Zorluk</p>' + K.chips('z', [[0, 'Titreme yok'], [1, 'Hafif titreme'], [2, 'Belirgin titreme']], S.titreme) + '</div>' +
      '<label class="cgt-tog"><input type="checkbox" id="rkK"' + (S.kilavuz ? ' checked' : '') + '> Kılavuz halkayı göster</label>' +
      '<div class="cgt-chips"><button type="button" class="cgt-btn y" data-a="yeni">Yeniden dene</button></div>' +
      '<div><div class="cgt-row"><span>Son puan</span><b>' + (R ? R.puan : '–') + '</b></div><div class="cgt-row"><span>En iyi puan</span><b>' + (best || '–') + '</b></div></div>';
  }
  function info() {
    if (!R) { K.$('rkI').innerHTML = '<b>Hedef:</b> ' + K.tr(S.hedef, 2) + ' mm çapında, pupilla merkezinde, kapalı bir daire. Optik kenarını her yönden örten bir reksis, merceğin santralizasyonu ve arka kapsül opasifikasyonunun azaltılması açısından önemlidir.'; return; }
    K.$('rkI').innerHTML = '<b>Puan: ' + R.puan + '/100.</b> Çap <b>' + K.tr(R.cap, 2) + ' mm</b> (hedef ' + K.tr(S.hedef, 2) + '), dairesellik <b>%' + Math.round(R.dai * 100) + '</b>, merkezden kayma <b>' + K.tr(R.dec, 2) + ' mm</b>, ' + (R.kapali ? 'yırtık kapandı.' : '<b style="color:#b3261e">yırtık kapanmadı.</b>') + (R.kacis ? ' <b style="color:#b3261e">Yırtık perifere uzandı (en uzak nokta ' + K.tr(R.max, 1) + ' mm): gerçek cerrahide ekvatora kaçış riski.</b>' : '') + (R.cap < S.hedef - .5 ? ' Küçük reksis: kapsül kontraksiyonu ve nükleus manipülasyonunda zorluk riski.' : R.cap > S.hedef + .5 ? ' Büyük reksis: optik kenarı örtülmeyebilir.' : '');
  }
  function deger() {
    var n = P.length, i, mx = 0, my = 0, m = 0, sd = 0, max = 0, rr = [], ang = 0; if (n < 12) { R = null; return; }
    P.forEach(function (p) { mx += p[0]; my += p[1]; }); mx /= n; my /= n;
    P.forEach(function (p) { var r = Math.sqrt((p[0] - mx) * (p[0] - mx) + (p[1] - my) * (p[1] - my)); rr.push(r); m += r; max = Math.max(max, Math.sqrt(p[0] * p[0] + p[1] * p[1])); }); m /= n; rr.forEach(function (r) { sd += (r - m) * (r - m); }); sd = Math.sqrt(sd / n);
    for (i = 1; i < n; i++) { var a = Math.atan2(P[i][1] - my, P[i][0] - mx) - Math.atan2(P[i - 1][1] - my, P[i - 1][0] - mx); if (a > Math.PI) a -= 2 * Math.PI; if (a < -Math.PI) a += 2 * Math.PI; ang += a; }
    var gap = Math.sqrt(Math.pow(P[0][0] - P[n - 1][0], 2) + Math.pow(P[0][1] - P[n - 1][1], 2)), kap = gap < .8 && Math.abs(ang) > 5.6, cap = 2 * m, dec = Math.sqrt(mx * mx + my * my), dai = Math.max(0, 1 - sd / m);
    var puan = 100 - Math.max(0, Math.abs(cap - S.hedef) - .15) * 28 - (1 - dai) * 220 - Math.max(0, dec - .15) * 32 - (kap ? 0 : 30) - (max > 3.6 ? 20 : 0);
    R = { cap: cap, dai: dai, dec: dec, kapali: kap, kacis: max > 3.6, max: max, puan: Math.round(K.cl(puan, 0, 100)), mx: mx, my: my };
    if (R.puan > best) { best = R.puan; K.set('reksis', best); }
  }
  function draw(g, w, h) {
    sc = Math.min(w, h) * .82 / 12; CX = w / 2; CY = h / 2; var i;
    g.fillStyle = '#f1ece6'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(190,60,50,.35)'; g.lineWidth = 1.2; for (i = 0; i < 14; i++) { var a = i * .45 + .2; g.beginPath(); g.moveTo(CX + Math.cos(a) * 6.3 * sc, CY + Math.sin(a) * 6.3 * sc); g.quadraticCurveTo(CX + Math.cos(a + .1) * 8 * sc, CY + Math.sin(a + .1) * 8 * sc, CX + Math.cos(a - .05) * 10 * sc, CY + Math.sin(a - .05) * 10 * sc); g.stroke(); }
    var gr = g.createRadialGradient(CX, CY, 4 * sc, CX, CY, 6 * sc); gr.addColorStop(0, '#3b5d7a'); gr.addColorStop(.7, '#2a4560'); gr.addColorStop(1, '#16283a'); g.fillStyle = gr; g.beginPath(); g.arc(CX, CY, 6 * sc, 0, 7); g.fill();
    gr = g.createRadialGradient(CX - sc, CY - sc, .5 * sc, CX, CY, 4 * sc); gr.addColorStop(0, '#ff9a5c'); gr.addColorStop(.7, '#e2552a'); gr.addColorStop(1, '#a8301a'); g.fillStyle = gr; g.beginPath(); g.arc(CX, CY, 4 * sc, 0, 7); g.fill();
    if (S.kilavuz) { g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 1.5; g.setLineDash([6, 6]); g.beginPath(); g.arc(CX, CY, S.hedef / 2 * sc, 0, 7); g.stroke(); g.setLineDash([]); g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.arc(CX, CY, 2, 0, 7); g.fill(); }
    if (P.length > 1) {
      g.beginPath(); P.forEach(function (p, j) { var x = CX + p[0] * sc, y = CY + p[1] * sc; if (j) g.lineTo(x, y); else g.moveTo(x, y); });
      if (R && R.kapali) { g.closePath(); g.fillStyle = 'rgba(255,225,190,.38)'; g.fill(); }
      g.strokeStyle = R ? (R.puan >= 80 ? '#39d98a' : R.puan >= 55 ? '#ffd400' : '#ff5c5c') : '#fff'; g.lineWidth = 2.6; g.lineJoin = 'round'; g.stroke();
      if (R) { g.strokeStyle = 'rgba(20,35,59,.8)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(CX + R.mx * sc - 6, CY + R.my * sc); g.lineTo(CX + R.mx * sc + 6, CY + R.my * sc); g.moveTo(CX + R.mx * sc, CY + R.my * sc - 6); g.lineTo(CX + R.mx * sc, CY + R.my * sc + 6); g.stroke(); }
    }
    if (down && cur) { g.strokeStyle = '#d7dde6'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(CX + cur[0] * sc, CY + cur[1] * sc); g.lineTo(CX + cur[0] * sc + 9 * sc, CY + cur[1] * sc + 7 * sc); g.stroke(); }
    if (!P.length) { g.fillStyle = 'rgba(255,255,255,.9)'; g.font = '700 14px Arial'; g.textAlign = 'center'; g.fillText('Basılı tutup yırtığı bir tur dolandırın', CX, CY + 5.2 * sc); }
  }
  panel(); info();
  var cv = K.$('rkC'), redraw = K.fit(cv, draw);
  function mm(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left - CX) / sc, (e.clientY - r.top - CY) / sc]; }
  cv.addEventListener('pointerdown', function (e) { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) { } down = true; R = null; tgt = mm(e); cur = tgt.slice(); P = [cur.slice()]; panel(); info(); });
  cv.addEventListener('pointermove', function (e) { if (down) tgt = mm(e); });
  function birak() { if (!down) return; down = false; deger(); panel(); info(); redraw(); }
  cv.addEventListener('pointerup', birak); cv.addEventListener('pointercancel', birak);
  function tick() {
    if (!document.body.contains(cv)) return;
    if (down && tgt) { var j = S.titreme * .035; cur[0] += (tgt[0] - cur[0]) * .3 + (Math.random() - .5) * j; cur[1] += (tgt[1] - cur[1]) * .3 + (Math.random() - .5) * j; var l = P[P.length - 1]; if (Math.abs(cur[0] - l[0]) + Math.abs(cur[1] - l[1]) > .03) P.push(cur.slice()); redraw(); }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  K.$('rkP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var z = b.getAttribute('data-z'); if (z != null) S.titreme = +z; else if (b.getAttribute('data-a') !== 'yeni') return; P = []; R = null; panel(); info(); redraw(); });
  K.$('rkP').addEventListener('input', function (e) { if (e.target.getAttribute('data-k') !== 'hedef') return; S.hedef = +e.target.value; K.$('rkP').querySelector('[data-v="hedef"]').textContent = K.tr(S.hedef, 2) + ' mm'; info(); redraw(); });
  K.$('rkP').addEventListener('change', function (e) { if (e.target.id === 'rkK') { S.kilavuz = e.target.checked; redraw(); } });
})();
