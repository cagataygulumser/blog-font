/* Kırmızı refle (Brückner) simülatörü · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-refle'); if (!K || !root || root.querySelector('canvas')) return;
  var D = {
    normal: ['Normal', 'İki gözde refle eşit parlaklıkta, aynı renkte ve simetriktir; kornea ışık yansıması iki pupillada da aynı yerdedir.'],
    katarakt: ['Katarakt / ortam opasitesi', 'Etkilenen gözde reflenin içinde koyu leke ya da gölge görülür; yoğun opasitede refle tümüyle sönükleşir. Bebekte görme aksını kapatan opasite ambliyopi açısından acildir.'],
    kirma: ['Anizometropi / kırma kusuru', 'Refle iki gözde farklı parlaklıktadır ve etkilenen gözde pupillanın bir kenarında parlak hilal görülür. Sikloplejik refraksiyon gerekir.'],
    sasilik: ['Şaşılık', 'Kayan gözde refle daha <b>parlak ve açık renkli</b> görünür, kornea ışık yansıması pupilla merkezinden kaymıştır. Fikse eden gözde refle daha koyudur.'],
    lokokori: ['Lökokori (beyaz refle)', 'Etkilenen gözde refle beyaz ya da sarımsı beyazdır. Retinoblastom, konjenital katarakt, Coats hastalığı, prematüre retinopatisi ve kalıcı fetal damarlanma ayırıcı tanıdadır. <b>Acil göz muayenesi gerektirir.</b>'],
    kornea: ['Kornea opasitesi', 'Etkilenen gözde reflenin önünde sınırları belirgin koyu bir alan görülür; hasta bakışını değiştirdiğinde opasite pupillaya göre yer değiştirir.']
  };
  var S = { dur: 'sasilik', goz: 'sol' };
  root.innerHTML = '<p class="cgt-lead">Direkt oftalmoskopla bir kol boyu uzaktan iki göze birlikte bakıldığında görülen kırmızı reflenin normalde ve sık karşılaşılan bozukluklarda nasıl göründüğünü karşılaştırın.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="rfP"></div><div class="cgt-col">' + K.stage('rf', 'min(56vh,440px)', '#1a1310') + '<div class="cgt-info" id="rfI"></div></div></div>' +
    '<p class="cgt-note">Reflenin rengi fundus pigmentasyonuna göre açık turuncudan koyu kırmızı-kahveye değişir; önemli olan iki göz arasındaki <b>fark</b>tır. Görüntüler şematiktir. Test loş odada, yaklaşık 50–75 cm uzaktan, çocuk ışığa bakarken yapılır; kuşkulu her bulgu pupilla genişletilerek değerlendirilmelidir.</p>' + K.dr;
  function panel() { K.$('rfP').innerHTML = '<div><p class="cgt-h">Durum</p>' + K.chips('d', Object.keys(D).map(function (k) { return [k, D[k][0]]; }), S.dur) + '</div>' + (S.dur !== 'normal' ? '<div><p class="cgt-h">Etkilenen göz</p>' + K.chips('g', [['sag', 'Sağ (OD)'], ['sol', 'Sol (OS)']], S.goz) + '</div>' : ''); }
  function info() { K.$('rfI').innerHTML = '<b>' + D[S.dur][0] + ':</b> ' + D[S.dur][1]; }
  function goz(g, cx, cy, s, e) {
    var af = e === S.goz && S.dur !== 'normal', d = af ? S.dur : 'normal', nz = e === 'sag' ? 1 : -1, sh = d === 'sasilik' ? nz * 3.2 : 0, ix = cx + sh * s, pr = 3.3 * s;
    g.save(); g.beginPath(); g.moveTo(cx - 15 * s, cy + s); g.quadraticCurveTo(cx, cy - 12.5 * s, cx + 15 * s, cy + s); g.quadraticCurveTo(cx, cy + 9.5 * s, cx - 15 * s, cy + s); g.closePath(); g.fillStyle = '#8f8880'; g.fill(); g.clip();
    g.fillStyle = '#2e1d10'; g.beginPath(); g.arc(ix, cy, 6 * s, 0, 7); g.fill();
    var c = { normal: ['#ff8a3c', '#d6401e'], katarakt: ['#c9632c', '#8f2f18'], kirma: ['#ff9b4a', '#c93a1a'], sasilik: ['#ffd9a0', '#ff8f45'], lokokori: ['#ffffff', '#e9e3c8'], kornea: ['#ff8a3c', '#d6401e'] }[d], gr = g.createRadialGradient(ix, cy, 0, ix, cy, pr); gr.addColorStop(0, c[0]); gr.addColorStop(1, c[1]);
    g.save(); g.beginPath(); g.arc(ix, cy, pr, 0, 7); g.clip(); g.fillStyle = gr; g.fillRect(ix - pr, cy - pr, 2 * pr, 2 * pr);
    if (d === 'katarakt') { g.fillStyle = 'rgba(20,10,5,.82)'; g.beginPath(); g.arc(ix + .3 * s, cy + .2 * s, 1.5 * s, 0, 7); g.fill(); for (var i = 0; i < 7; i++) { g.beginPath(); g.moveTo(ix, cy); g.arc(ix, cy, pr, i * .9, i * .9 + .16); g.fill(); } }
    if (d === 'kirma') { g.fillStyle = '#fff3b0'; g.beginPath(); g.arc(ix, cy + pr * .95, pr * .95, 0, 7); g.fill(); g.fillStyle = 'rgba(120,30,10,.45)'; g.beginPath(); g.arc(ix, cy - pr * .9, pr, 0, 7); g.fill(); }
    if (d === 'kornea') { g.fillStyle = 'rgba(25,18,14,.88)'; g.beginPath(); g.ellipse(ix - 1.1 * s, cy + .7 * s, 1.6 * s, 1.2 * s, .5, 0, 7); g.fill(); }
    g.restore();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(ix + (nz * .4 - (d === 'sasilik' ? nz * 1.5 : 0)) * s, cy - .3 * s, .55 * s, 0, 7); g.fill();
    g.restore();
    g.strokeStyle = '#0d0907'; g.lineWidth = Math.max(1.5, .55 * s); g.beginPath(); g.moveTo(cx - 15 * s, cy + s); g.quadraticCurveTo(cx, cy - 12.5 * s, cx + 15 * s, cy + s); g.stroke();
    g.lineWidth = 2.2 * s; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 15 * s, cy - 13 * s); g.quadraticCurveTo(cx, cy - 19 * s, cx + 15 * s, cy - 14 * s); g.stroke();
    g.fillStyle = '#b9a99a'; g.font = '800 ' + Math.max(12, 3 * s) + 'px Arial'; g.textAlign = 'center'; g.fillText(e === 'sag' ? 'Sağ göz (OD)' : 'Sol göz (OS)', cx, cy + 24 * s);
  }
  function draw(g, w, h) {
    var gr = g.createRadialGradient(w / 2, h * .45, 20, w / 2, h * .45, Math.max(w, h) * .7); gr.addColorStop(0, '#5b4336'); gr.addColorStop(1, '#17100c'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    var s = Math.min(w / 110, h / 62), cy = h * .46; goz(g, w / 2 - 31 * s, cy, s, 'sag'); goz(g, w / 2 + 31 * s, cy, s, 'sol');
    g.fillStyle = 'rgba(255,255,255,.55)'; g.font = '700 12px Arial'; g.textAlign = 'center'; g.fillText('Muayene edenin gözünden: hastanın sağ gözü solda görünür', w / 2, h - 10);
  }
  panel(); info();
  var redraw = K.fit(K.$('rfC'), draw);
  K.$('rfP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var d = b.getAttribute('data-d'), g = b.getAttribute('data-g'); if (d) S.dur = d; else if (g) S.goz = g; else return; panel(); info(); redraw(); });
})();
