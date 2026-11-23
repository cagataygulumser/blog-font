/* Şaşılık ve örtme testi simülatörü · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-sasilik'); if (!K || !root || root.querySelector('canvas')) return;
  var S = { tur: 'tropya', tip: 'ezo', goz: 'sag', mik: 25, ort: 'yok', refle: true, son: '' }, E = { sag: 0, sol: 0 };
  var TA = { ezo: 'ezo', ekzo: 'ekzo', hiper: 'hiper', hipo: 'hipo' };
  root.innerHTML = '<p class="cgt-lead">Kayma tipini ve miktarını seçin, gözleri sırayla örtüp açın: tropya ile foryada örtme-açma testinde hangi gözün hangi yöne hareket ettiğini ve Hirschberg reflesinin nasıl kaydığını izleyin.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="ssP"></div><div class="cgt-col">' + K.stage('ss', 'min(56vh,440px)', '#e9c9b1') + '<div class="cgt-info" id="ssI"></div></div></div>' +
    '<p class="cgt-note">Gösterim konkomitan kaymayı varsayar: örtülen gözün arkasındaki sekonder sapma primer sapmaya eşit çizilir. Örtücü, arkasındaki hareket görülebilsin diye yarı saydamdır. Refle kayması için 1 mm ≈ 21 prizma diyoptri (yaklaşık 12°) oranı kullanılmıştır; klasik kaynaklarda 1 mm ≈ 15 Δ (7°) verilir. Hirschberg kaba bir tahmindir, ölçüm prizma-örtme testiyle yapılır.</p>' + K.dr;
  function panel() {
    var v = S.tip === 'hiper' || S.tip === 'hipo';
    K.$('ssP').innerHTML = '<div><p class="cgt-h">Tür</p>' + K.chips('u', [['tropya', 'Tropya (manifest)'], ['forya', 'Forya (latent)']], S.tur) + '</div>' +
      '<div><p class="cgt-h">Yön</p>' + K.chips('t', [['ezo', 'Ezo'], ['ekzo', 'Ekzo'], ['hiper', 'Hiper'], ['hipo', 'Hipo']], S.tip) + '</div>' +
      (S.tur === 'tropya' ? '<div><p class="cgt-h">Kayan göz</p>' + K.chips('g', [['sag', 'Sağ (OD)'], ['sol', 'Sol (OS)']], S.goz) + '</div>' : v ? '<div style="font-size:12.5px;color:#5b6b82">Vertikal foryada yön sağ göze göre adlandırılır: sağ hiperforya, sol hipoforyayla aynı durumdur.</div>' : '') +
      K.range('mik', 'Kayma miktarı', S.mik, 0, 60, 1, ' Δ') +
      '<div><p class="cgt-h">Örtme testi</p>' + K.chips('o', [['sag', 'Sağı ört'], ['sol', 'Solu ört'], ['yok', 'Örtüyü kaldır']], S.ort) + '<div style="height:8px"></div><div class="cgt-chips"><button type="button" class="cgt-btn y" data-a="alt">Alternan örtme</button></div></div>' +
      '<label class="cgt-tog"><input type="checkbox" id="ssR"' + (S.refle ? ' checked' : '') + '> Kornea ışık reflesi (Hirschberg)</label>';
  }
  function hedef() { var t = { sag: 0, sol: 0 }, d = S.goz, f = d === 'sag' ? 'sol' : 'sag'; if (S.tur === 'tropya') { if (S.ort === f) { t[f] = 1; t[d] = 0; } else t[d] = 1; } else if (S.ort !== 'yok') t[S.ort] = 1; return t; }
  function yon(e) { var ref = S.tur === 'tropya' ? S.goz : 'sag', nz = e === 'sag' ? 1 : -1, s = e === ref ? 1 : -1; return S.tip === 'ezo' ? [nz, 0] : S.tip === 'ekzo' ? [-nz, 0] : S.tip === 'hiper' ? [0, -s] : [0, s]; }
  function har(tip, geri) { var a = { ezo: ['içe doğru', 'dışa doğru'], ekzo: ['dışa doğru', 'içe doğru'], hiper: ['yukarı', 'aşağı'], hipo: ['aşağı', 'yukarı'] }[tip]; return a[geri ? 1 : 0]; }
  function info() {
    var ad = { sag: 'sağ', sol: 'sol' }, d = S.goz, f = d === 'sag' ? 'sol' : 'sag', t, deg = Math.atan(S.mik / 100) * 180 / Math.PI;
    if (S.mik === 0) t = 'Kayma yok: örtme ve açmada hiçbir gözde hareket görülmez (ortotropya, ortoforya).';
    else if (S.tur === 'tropya') {
      if (S.ort === 'yok') t = S.son ? 'Örtü kaldırıldı; fiksasyon tercih edilen ' + ad[f] + ' göze döner, ' + ad[d] + ' göz yeniden kayar (' + S.tip + 'tropya).' : ad[d].charAt(0).toUpperCase() + ad[d].slice(1) + ' göz kayık duruyor (' + S.tip + 'tropya); fiksasyon ' + ad[f] + ' gözde.';
      else if (S.ort === f) t = '<b>Fikse eden ' + ad[f] + ' göz örtüldü:</b> açıkta kalan ' + ad[d] + ' göz fiksasyonu almak için <b>' + har(S.tip, true) + '</b> hareket eder. Açık gözde hareket görülmesi <b>tropyayı</b> gösterir. Örtünün altındaki göz aynı miktarda sapar.';
      else t = '<b>Kayan ' + ad[d] + ' göz örtüldü:</b> açıkta kalan ' + ad[f] + ' göz zaten fiksasyonda olduğu için hareket etmez.';
    } else {
      if (S.ort === 'yok') t = S.son ? '<b>Örtü kaldırıldı:</b> ' + ad[S.son] + ' göz füzyonu yeniden kurmak için <b>' + har(S.son === 'sag' || S.tip === 'ezo' || S.tip === 'ekzo' ? S.tip : (S.tip === 'hiper' ? 'hipo' : 'hiper'), true) + '</b> döner. Örtü kaldırılınca görülen bu düzeltme hareketi <b>foryayı</b> gösterir.' : 'İki göz açıkken füzyon kaymayı gizler; gözler düz durur.';
      else t = '<b>' + ad[S.ort].charAt(0).toUpperCase() + ad[S.ort].slice(1) + ' göz örtüldü:</b> füzyon bozulur, örtünün altındaki göz sapar; açıkta kalan gözde hareket olmaz.';
    }
    K.$('ssI').innerHTML = t + (S.mik ? ' Kayma ' + S.mik + ' Δ ≈ ' + K.tr(deg) + '°; beklenen refle kayması yaklaşık ' + K.tr(S.mik / 21) + ' mm.' : '');
  }
  function goz(g, cx, cy, s, e, isR) {
    var th = Math.atan(S.mik / 100), fr = E[e], v = yon(e), sh = 12 * Math.sin(th * fr), ix = cx + v[0] * sh * s, iy = cy + v[1] * sh * s, nz = isR ? 1 : -1;
    g.save(); g.beginPath(); g.moveTo(cx - 15 * s, cy + s); g.quadraticCurveTo(cx, cy - 12.5 * s, cx + 15 * s, cy + s); g.quadraticCurveTo(cx, cy + 9.5 * s, cx - 15 * s, cy + s); g.closePath();
    g.fillStyle = '#f8f5f0'; g.fill(); g.clip();
    var gr = g.createRadialGradient(ix, iy, 1.5 * s, ix, iy, 6 * s); gr.addColorStop(0, '#8a5a2b'); gr.addColorStop(.8, '#5a3716'); gr.addColorStop(1, '#2c1a09'); g.fillStyle = gr; g.beginPath(); g.arc(ix, iy, 6 * s, 0, 7); g.fill();
    g.fillStyle = '#060606'; g.beginPath(); g.arc(ix, iy, 2 * s, 0, 7); g.fill();
    if (S.refle) { var k = S.mik * fr / 21; g.fillStyle = '#fff'; g.beginPath(); g.arc(ix + (nz * .4 - v[0] * k) * s, iy - v[1] * k * s, .65 * s, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(120,60,40,.18)'; g.fillRect(cx - 16 * s, cy - 13 * s, 32 * s, 4.5 * s);
    g.restore();
    g.strokeStyle = '#5b3a2a'; g.lineWidth = Math.max(1.5, .5 * s); g.beginPath(); g.moveTo(cx - 15 * s, cy + s); g.quadraticCurveTo(cx, cy - 12.5 * s, cx + 15 * s, cy + s); g.stroke();
    g.strokeStyle = 'rgba(91,58,42,.5)'; g.lineWidth = Math.max(1, .3 * s); g.beginPath(); g.moveTo(cx + 15 * s, cy + s); g.quadraticCurveTo(cx, cy + 9.5 * s, cx - 15 * s, cy + s); g.stroke();
    g.strokeStyle = '#3d2618'; g.lineWidth = 2.2 * s; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 15 * s, cy - 13 * s); g.quadraticCurveTo(cx, cy - 19 * s, cx + 15 * s, cy - 14 * s); g.stroke();
    if (S.ort === e) { g.fillStyle = 'rgba(15,25,45,.72)'; var x = cx - 20 * s, y = cy - 22 * s, w = 40 * s, h = 38 * s; g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, 3 * s); else g.rect(x, y, w, h); g.fill(); g.fillStyle = 'rgba(255,255,255,.8)'; g.font = '700 ' + Math.max(11, 2.6 * s) + 'px Arial'; g.textAlign = 'center'; g.fillText('örtücü', cx, y + h - 2.5 * s); }
    g.fillStyle = '#3d2618'; g.font = '800 ' + Math.max(12, 3 * s) + 'px Arial'; g.textAlign = 'center'; g.fillText(isR ? 'Sağ göz (OD)' : 'Sol göz (OS)', cx, cy + 24 * s);
  }
  function draw(g, w, h) {
    g.fillStyle = '#e9c9b1'; g.fillRect(0, 0, w, h); var s = Math.min(w / 110, h / 62), cy = h * .46;
    g.strokeStyle = 'rgba(120,70,50,.35)'; g.lineWidth = 1.2 * s; g.lineCap = 'round'; g.beginPath(); g.moveTo(w / 2 - 5 * s, cy - 6 * s); g.quadraticCurveTo(w / 2 - 8 * s, cy + 16 * s, w / 2 - 3 * s, cy + 22 * s); g.stroke();
    goz(g, w / 2 - 31 * s, cy, s, 'sag', true); goz(g, w / 2 + 31 * s, cy, s, 'sol', false);
    g.fillStyle = 'rgba(61,38,24,.7)'; g.font = '700 12px Arial'; g.textAlign = 'center'; g.fillText('Muayene edenin gözünden: hastanın sağ gözü solda görünür', w / 2, h - 10);
  }
  panel();
  var cv = K.$('ssC'), redraw = K.fit(cv, draw), alt = null; info();
  function tick() { if (!document.body.contains(cv)) return; var t = hedef(), ch = false;['sag', 'sol'].forEach(function (e) { var d = t[e] - E[e]; if (Math.abs(d) > .002) { E[e] += d * .16; ch = true; } else E[e] = t[e]; }); if (ch) redraw(); requestAnimationFrame(tick); }
  requestAnimationFrame(tick);
  function ort(v) { S.son = S.ort !== 'yok' ? S.ort : ''; S.ort = v; panel(); info(); redraw(); }
  K.$('ssP').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var u = b.getAttribute('data-u'), t = b.getAttribute('data-t'), g = b.getAttribute('data-g'), o = b.getAttribute('data-o'), a = b.getAttribute('data-a');
    if (alt) { clearInterval(alt); alt = null; }
    if (o) { ort(o); return; }
    if (a === 'alt') { var n = 0; ort('sag'); alt = setInterval(function () { n++; if (n > 5) { clearInterval(alt); alt = null; ort('yok'); } else ort(n % 2 ? 'sol' : 'sag'); }, 1300); return; }
    if (u) S.tur = u; else if (t) S.tip = TA[t]; else if (g) S.goz = g; else return; S.ort = 'yok'; S.son = ''; panel(); info(); redraw();
  });
  K.$('ssP').addEventListener('input', function (e) { if (e.target.getAttribute('data-k') !== 'mik') return; S.mik = +e.target.value; K.$('ssP').querySelector('[data-v="mik"]').textContent = S.mik + ' Δ'; info(); redraw(); });
  K.$('ssP').addEventListener('change', function (e) { if (e.target.id === 'ssR') { S.refle = e.target.checked; redraw(); } });
})();
