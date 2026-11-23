/* Pupilla ve RAPD simülatörü · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-rapd'); if (!K || !root || root.querySelector('canvas')) return;
  var D = {
    normal: ['Normal', 'Işık hangi göze tutulursa tutulsun iki pupilla birlikte ve eşit daralır (direkt ve konsensüel yanıt). Sallanan ışıkta pupilla çapı değişmez.'],
    rapd1: ['RAPD (hafif)', 'Işık etkilenen göze geçtiğinde iki pupilla birlikte hafifçe <b>genişler</b>: o gözden beyne daha az sinyal gider. Pupillalar loşta ve aydınlıkta eşittir; RAPD anizokori yapmaz.'],
    rapd2: ['RAPD (belirgin)', 'Işık etkilenen göze geçtiğinde iki pupilla belirgin biçimde genişler. Optik nörit, iskemik optik nöropati, ağır glokom asimetrisi, geniş retina dekolmanı gibi tek taraflı ya da asimetrik afferent hasarı düşündürür.'],
    horner: ['Horner sendromu', 'Etkilenen pupilla küçüktür, hafif pitoz eşlik eder. Anizokori <b>loşta artar</b>, çünkü küçük pupilla geç ve az genişler (dilatasyon gecikmesi). Işık yanıtı iki gözde de korunur.'],
    ucuncu: ['Üçüncü sinir felci', 'Etkilenen pupilla geniştir, ışığa direkt de konsensüel de yanıt vermez; belirgin pitoz vardır, göz dışa ve aşağı bakar. Anizokori <b>aydınlıkta artar</b>. Pupilla tutulumlu ağrılı tablo anevrizma açısından acildir.'],
    adie: ['Tonik (Adie) pupilla', 'Etkilenen pupilla geniştir, ışığa yanıtı çok az ve segmentaldir; yakına bakışta yavaş ve tonik daralır (ışık-yakın ayrışması). Anizokori aydınlıkta artar.'],
    ilac: ['Farmakolojik midriyazis', 'Etkilenen pupilla çok geniş ve sabittir; ışığa ve yakına yanıt vermez, %1 pilokarpinle daralmaz. Pitoz ve göz hareket kısıtlılığı yoktur.']
  };
  var S = { dur: 'rapd2', goz: 'sag', isik: 'sal' }, P = { sag: 5, sol: 5 }, T0 = 0, LIT = 'sag';
  root.innerHTML = '<p class="cgt-lead">Sallanan ışık testini ve sık görülen pupilla bozukluklarını canlandırın: durumu ve etkilenen gözü seçin, ışığı sağ göze, sol göze tutun ya da iki göz arasında sallayın.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="rpP"></div><div class="cgt-col">' + K.stage('rp', 'min(56vh,440px)', '#2a1f1a') + '<div class="cgt-info" id="rpI"></div></div></div>' +
    '<p class="cgt-note">Pupilla çapları ve tepki hızları öğretim amacıyla sadeleştirilmiştir. Gerçekte fizyolojik pupilla oynamaları (hippus), ışığın açısı ve akomodasyon sonucu etkiler; sallanan ışık testi loş odada, hasta uzağa bakarken, parlak ışıkla yapılır.</p>' + K.dr;
  function panel() {
    K.$('rpP').innerHTML = '<div><p class="cgt-h">Durum</p>' + K.chips('d', Object.keys(D).map(function (k) { return [k, D[k][0]]; }), S.dur) + '</div>' +
      (S.dur !== 'normal' ? '<div><p class="cgt-h">Etkilenen göz</p>' + K.chips('g', [['sag', 'Sağ (OD)'], ['sol', 'Sol (OS)']], S.goz) + '</div>' : '') +
      '<div><p class="cgt-h">Işık</p>' + K.chips('i', [['yok', 'Kapalı (loş)'], ['sag', 'Sağ göze'], ['sol', 'Sol göze'], ['sal', 'Sallanan ışık'], ['oda', 'Aydınlık oda']], S.isik) + '</div>' +
      '<div><div class="cgt-row"><span>Sağ pupilla</span><b id="rpR">–</b></div><div class="cgt-row"><span>Sol pupilla</span><b id="rpL">–</b></div><div class="cgt-row"><span>Fark</span><b id="rpF">–</b></div></div>';
  }
  function info() { K.$('rpI').innerHTML = '<b>' + D[S.dur][0] + (S.dur !== 'normal' ? ' · ' + (S.goz === 'sag' ? 'sağ' : 'sol') + ' göz' : '') + ':</b> ' + D[S.dur][1]; }
  function hedef(lit) {
    var gain = { sag: 1, sol: 1 }, c = 0; if (S.dur === 'rapd1') gain[S.goz] = .55; if (S.dur === 'rapd2') gain[S.goz] = .2;
    if (lit === 'oda') c = Math.max(gain.sag, gain.sol) * .85; else if (lit === 'sag' || lit === 'sol') c = gain[lit];
    var base = 6.5 - 3.7 * c, t = { sag: base, sol: base }, e = S.goz;
    if (S.dur === 'horner') t[e] = 2.6 + (base - 2.6) * .45; else if (S.dur === 'ucuncu') t[e] = 7.6; else if (S.dur === 'adie') t[e] = 6.6 - .5 * c; else if (S.dur === 'ilac') t[e] = 8.2;
    return t;
  }
  function goz(g, cx, cy, s, e, lit) {
    var af = e === S.goz && S.dur !== 'normal', pt = af && S.dur === 'ucuncu' ? .62 : af && S.dur === 'horner' ? .22 : 0, dx = af && S.dur === 'ucuncu' ? (e === 'sag' ? -4.5 : 4.5) : 0, dy = af && S.dur === 'ucuncu' ? 2 : 0;
    g.save(); g.beginPath(); g.moveTo(cx - 15 * s, cy + s); g.quadraticCurveTo(cx, cy - (12.5 - pt * 13) * s, cx + 15 * s, cy + s); g.quadraticCurveTo(cx, cy + 9.5 * s, cx - 15 * s, cy + s); g.closePath(); g.fillStyle = lit ? '#fffdf2' : '#d9d2c8'; g.fill(); g.clip();
    var ix = cx + dx * s, iy = cy + dy * s, gr = g.createRadialGradient(ix, iy, 1.5 * s, ix, iy, 6 * s); gr.addColorStop(0, lit ? '#9a6a35' : '#6f4a22'); gr.addColorStop(.8, '#4a2d12'); gr.addColorStop(1, '#22140a'); g.fillStyle = gr; g.beginPath(); g.arc(ix, iy, 6 * s, 0, 7); g.fill();
    g.fillStyle = '#050505'; g.beginPath(); g.arc(ix, iy, P[e] / 2 * s, 0, 7); g.fill(); if (lit) { g.fillStyle = '#fff'; g.beginPath(); g.arc(ix + .9 * s, iy - .8 * s, .7 * s, 0, 7); g.fill(); }
    g.restore();
    g.strokeStyle = '#3d2618'; g.lineWidth = Math.max(1.5, .55 * s); g.beginPath(); g.moveTo(cx - 15 * s, cy + s); g.quadraticCurveTo(cx, cy - (12.5 - pt * 13) * s, cx + 15 * s, cy + s); g.stroke();
    g.lineWidth = 2.2 * s; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 15 * s, cy - 13 * s); g.quadraticCurveTo(cx, cy - 19 * s, cx + 15 * s, cy - 14 * s); g.stroke();
    if (lit) { var lg = g.createRadialGradient(cx, cy, 2 * s, cx, cy, 30 * s); lg.addColorStop(0, 'rgba(255,240,170,.42)'); lg.addColorStop(1, 'rgba(255,240,170,0)'); g.fillStyle = lg; g.beginPath(); g.arc(cx, cy, 30 * s, 0, 7); g.fill(); g.fillStyle = '#ffe38a'; g.beginPath(); g.moveTo(cx - 3 * s, cy + 30 * s); g.lineTo(cx + 3 * s, cy + 30 * s); g.lineTo(cx + 5 * s, cy + 42 * s); g.lineTo(cx - 5 * s, cy + 42 * s); g.fill(); }
    g.fillStyle = '#e9d9c9'; g.font = '800 ' + Math.max(12, 3 * s) + 'px Arial'; g.textAlign = 'center'; g.fillText((e === 'sag' ? 'Sağ' : 'Sol') + ' · ' + K.tr(P[e]) + ' mm', cx, cy - 23 * s);
  }
  function draw(g, w, h) {
    var oda = S.isik === 'oda'; g.fillStyle = oda ? '#e9c9b1' : '#3a2a22'; g.fillRect(0, 0, w, h); var s = Math.min(w / 110, h / 78), cy = h * .46;
    goz(g, w / 2 - 31 * s, cy, s, 'sag', oda || LIT === 'sag'); goz(g, w / 2 + 31 * s, cy, s, 'sol', oda || LIT === 'sol');
    g.fillStyle = oda ? 'rgba(61,38,24,.75)' : 'rgba(255,255,255,.6)'; g.font = '700 12px Arial'; g.textAlign = 'center'; g.fillText('Muayene edenin gözünden: hastanın sağ gözü solda görünür', w / 2, 20);
  }
  panel(); info();
  var cv = K.$('rpC'), redraw = K.fit(cv, draw);
  function tick(ts) {
    if (!document.body.contains(cv)) return; if (!T0) T0 = ts;
    LIT = S.isik === 'sal' ? (Math.floor((ts - T0) / 1900) % 2 ? 'sol' : 'sag') : S.isik === 'sag' || S.isik === 'sol' ? S.isik : '';
    var t = hedef(S.isik === 'oda' ? 'oda' : LIT);['sag', 'sol'].forEach(function (e) { var slow = e === S.goz && S.dur === 'horner' && t[e] > P[e] ? .012 : .07; P[e] += (t[e] - P[e]) * slow; });
    redraw(); var r = K.$('rpR'); if (r) { r.textContent = K.tr(P.sag) + ' mm'; K.$('rpL').textContent = K.tr(P.sol) + ' mm'; K.$('rpF').textContent = K.tr(Math.abs(P.sag - P.sol)) + ' mm'; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  K.$('rpP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var d = b.getAttribute('data-d'), g = b.getAttribute('data-g'), i = b.getAttribute('data-i'); if (d) S.dur = d; else if (g) S.goz = g; else if (i) { S.isik = i; T0 = 0; } else return; panel(); info(); });
})();
