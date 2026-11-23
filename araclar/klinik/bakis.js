/* Dokuz bakış pozisyonu simülatörü · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-bakis'); if (!K || !root || root.querySelector('canvas')) return;
  var D = {
    normal: ['Normal', 'Dokuz bakış pozisyonunda iki göz birlikte ve tam hareket eder; hiçbir yönde kayma ya da kısıtlılık yoktur.'],
    n6: ['Altıncı sinir felci', 'Etkilenen göz <b>dışa bakamaz</b> (lateral rektus). Primer pozisyonda ezotropya vardır ve kayma felçli tarafa bakışta artar; hasta başını felçli tarafa çevirir. Diğer yönler normaldir.'],
    n3: ['Üçüncü sinir felci', 'Etkilenen göz <b>dışa ve aşağı</b> bakar; içe, yukarı ve aşağı hareketi kısıtlıdır, yalnızca dışa bakış (6. sinir) ve içe dönerek aşağı bakış (4. sinir) korunur. Pitoz vardır; pupilla tutulmuşsa geniştir.'],
    n4: ['Dördüncü sinir felci', 'Etkilenen göz <b>yukarıdadır</b> (üst oblik). Hipertropya karşı tarafa bakışta ve içe-aşağı bakışta artar; hasta başını karşı omuza eğer. Okuma ve merdiven inme sırasında çift görme tipiktir.'],
    ino: ['İnternükleer oftalmopleji', 'Lezyon tarafındaki göz karşıya bakışta <b>içe gelemez</b> (medial longitudinal fasikül); dışa bakan diğer gözde nistagmus görülür. Konverjans çoğunlukla korunur. Gençte demiyelinizan hastalık, yaşlıda beyin sapı iskemisi düşünülür.'],
    duane: ['Duane sendromu (tip 1)', 'Etkilenen göz <b>dışa bakamaz</b>; içe bakışta göz küresi geri çekilir ve kapak aralığı daralır. Primer pozisyonda kayma azdır ya da yoktur; bu, altıncı sinir felcinden ayırt ettirir.'],
    brown: ['Brown sendromu', 'Etkilenen göz <b>içe bakarken yukarı kaldırılamaz</b> (üst oblik tendon kılıfı). Dışa bakışta yukarı bakış normaldir; primer pozisyonda genellikle kayma yoktur.']
  };
  var S = { dur: 'n6', goz: 'sag' };
  var AD = [['Sağ üst', 'Yukarı', 'Sol üst'], ['Sağa', 'Primer', 'Sola'], ['Sağ alt', 'Aşağı', 'Sol alt']];
  root.innerHTML = '<p class="cgt-lead">Sinir felci ya da kısıtlayıcı sendrom seçin; gözlerin dokuz bakış pozisyonundaki duruşunu tek ekranda görün ve hangi yönde kısıtlılık olduğunu karşılaştırın.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="bkP"></div><div class="cgt-col">' + K.stage('bk', 'min(74vh,620px)', '#e9c9b1') + '<div class="cgt-info" id="bkI"></div></div></div>' +
    '<p class="cgt-note">Görünüm muayene edenin gözündendir: hastanın sağ gözü ekranda soldadır, hastanın sağa bakışı sol sütundadır. Tablolar tam ve izole felçler için sadeleştirilmiştir; kısmi felçlerde ve uzun süreli olgularda görünüm değişir.</p>' + K.dr;
  function panel() { K.$('bkP').innerHTML = '<div><p class="cgt-h">Durum</p>' + K.chips('d', Object.keys(D).map(function (k) { return [k, D[k][0]]; }), S.dur) + '</div>' + (S.dur !== 'normal' ? '<div><p class="cgt-h">Etkilenen göz</p>' + K.chips('g', [['sag', 'Sağ (OD)'], ['sol', 'Sol (OS)']], S.goz) + '</div>' : ''); }
  function info() { K.$('bkI').innerHTML = '<b>' + D[S.dur][0] + (S.dur !== 'normal' ? ' · ' + (S.goz === 'sag' ? 'sağ' : 'sol') + ' göz' : '') + ':</b> ' + D[S.dur][1]; }
  /* hd, vd: hastanın bakış yönü (+1 sağ, +1 yukarı). Dönüş: gözün [yatay, dikey, pitoz, daralma, nistagmus] konumu */
  function poz(e, hd, vd) {
    var sg = e === 'sag' ? 1 : -1, ab = hd * sg, v = vd, pt = 0, nar = 0, nis = 0, af = e === S.goz, d = S.dur;
    if (d === 'ino' && !af && ab > 0) nis = 1;
    if (af) {
      if (d === 'n6') ab = ab > 0 ? -.1 : ab === 0 ? -.28 : -1;
      else if (d === 'n3') { ab = ab > 0 ? 1 : .45; v = K.cl(v, -.4, -.25); pt = .7; }
      else if (d === 'n4') { v = v + .14 + (ab < 0 ? .2 : 0); if (vd < 0) v += ab < 0 ? .5 : .12; v = Math.min(v, 1.1); }
      else if (d === 'ino') ab = Math.max(ab, 0);
      else if (d === 'duane') { if (ab > 0) ab = .08; if (ab < 0) nar = .45; }
      else if (d === 'brown') { if (ab < 0 && vd > 0) v = .05; else if (ab === 0 && vd > 0) v = .55; }
    }
    return [ab * sg, v, pt, nar, nis];
  }
  function goz(g, cx, cy, s, e, hd, vd) {
    var p = poz(e, hd, vd), ix = cx - p[0] * 7.2 * s, iy = cy - p[1] * 4.6 * s, up = 12.5 - p[2] * 13 - p[3] * 5, lo = 9.5 - p[3] * 4, big = e === S.goz && S.dur === 'n3';
    g.save(); g.beginPath(); g.moveTo(cx - 15 * s, cy + s); g.quadraticCurveTo(cx, cy - up * s, cx + 15 * s, cy + s); g.quadraticCurveTo(cx, cy + lo * s, cx - 15 * s, cy + s); g.closePath(); g.fillStyle = '#f8f5f0'; g.fill(); g.clip();
    var gr = g.createRadialGradient(ix, iy, 1.5 * s, ix, iy, 6 * s); gr.addColorStop(0, '#8a5a2b'); gr.addColorStop(.8, '#5a3716'); gr.addColorStop(1, '#2c1a09'); g.fillStyle = gr; g.beginPath(); g.arc(ix, iy, 6 * s, 0, 7); g.fill(); g.fillStyle = '#060606'; g.beginPath(); g.arc(ix, iy, (big ? 3.4 : 2) * s, 0, 7); g.fill();
    g.restore(); g.strokeStyle = '#5b3a2a'; g.lineWidth = Math.max(1.2, .5 * s); g.beginPath(); g.moveTo(cx - 15 * s, cy + s); g.quadraticCurveTo(cx, cy - up * s, cx + 15 * s, cy + s); g.stroke(); g.strokeStyle = 'rgba(91,58,42,.45)'; g.beginPath(); g.moveTo(cx + 15 * s, cy + s); g.quadraticCurveTo(cx, cy + lo * s, cx - 15 * s, cy + s); g.stroke();
    if (p[4]) { g.strokeStyle = '#b3261e'; g.lineWidth = Math.max(1.5, .6 * s); var y = cy + 13 * s; g.beginPath(); g.moveTo(cx - 8 * s, y); g.lineTo(cx + 8 * s, y); g.moveTo(cx - 8 * s, y); g.lineTo(cx - 5 * s, y - 2.5 * s); g.moveTo(cx - 8 * s, y); g.lineTo(cx - 5 * s, y + 2.5 * s); g.moveTo(cx + 8 * s, y); g.lineTo(cx + 5 * s, y - 2.5 * s); g.moveTo(cx + 8 * s, y); g.lineTo(cx + 5 * s, y + 2.5 * s); g.stroke(); }
  }
  function draw(g, w, h) {
    g.fillStyle = '#e9c9b1'; g.fillRect(0, 0, w, h); var cw = w / 3, ch = h / 3, s = Math.min(cw / 84, ch / 46), r, c;
    for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) {
      var x = c * cw, y = r * ch, hd = 1 - c, vd = 1 - r, cx = x + cw / 2, cy = y + ch * .5;
      g.fillStyle = (r + c) % 2 ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,0)'; g.fillRect(x, y, cw, ch);
      goz(g, cx - 19 * s, cy, s, 'sag', hd, vd); goz(g, cx + 19 * s, cy, s, 'sol', hd, vd);
      g.fillStyle = 'rgba(61,38,24,.8)'; g.font = '700 ' + Math.max(10.5, 3 * s) + 'px Arial'; g.textAlign = 'center'; g.fillText(AD[r][c], cx, y + ch - 8);
    }
    g.strokeStyle = 'rgba(91,58,42,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(cw, 0); g.lineTo(cw, h); g.moveTo(2 * cw, 0); g.lineTo(2 * cw, h); g.moveTo(0, ch); g.lineTo(w, ch); g.moveTo(0, 2 * ch); g.lineTo(w, 2 * ch); g.stroke();
  }
  panel(); info();
  var redraw = K.fit(K.$('bkC'), draw);
  K.$('bkP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var d = b.getAttribute('data-d'), g = b.getAttribute('data-g'); if (d) S.dur = d; else if (g) S.goz = g; else return; panel(); info(); redraw(); });
})();
