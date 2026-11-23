/* Görme eşeli (ayarlanabilir mesafe) · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-esel'); if (!K || !root || root.querySelector('canvas')) return;
  var L = [[.05, '6/120', '20/400'], [.063, '6/95', '20/320'], [.08, '6/75', '20/250'], [.1, '6/60', '20/200'], [.125, '6/48', '20/160'], [.16, '6/38', '20/125'], [.2, '6/30', '20/100'], [.25, '6/24', '20/80'], [.32, '6/19', '20/63'], [.4, '6/15', '20/50'], [.5, '6/12', '20/40'], [.63, '6/9,5', '20/32'], [.8, '6/7,5', '20/25'], [1, '6/6', '20/20'], [1.25, '6/4,8', '20/16'], [1.6, '6/3,8', '20/12,5']];
  var S = { tip: 'E', mes: 3, i: 6, ayna: false, zemin: 'b' }, SEQ = [], N = 0, WARN = '';
  var SET = { harf: 'CDHKNORSVZ', rakam: '2345679' };
  root.innerHTML = '<p class="cgt-lead">Ekranı istediğiniz mesafeye göre ölçeklenen görme eşeline çevirin: E, Landolt C, harf ya da rakam optotipleri; ondalık, Snellen ve logMAR karşılıkları; ayna odaları için ters görüntü ve duokrom zemin.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="esP"></div><div class="cgt-col">' + K.stage('es', 'min(64vh,520px)', '#fff') + '<div class="cgt-info" id="esI"></div></div></div>' +
    '<p class="cgt-note">Optotip yüksekliği, seçilen mesafede 1,0 görme keskinliği için 5 açı dakikası olacak biçimde hesaplanır; doğruluk ekran kalibrasyonuna ve mesafenin doğru girilmesine bağlıdır. E ve Landolt C standart 5×5 ızgarayla çizilir; harf ve rakamlar ekran yazı tipiyle gösterildiği için çizgi kalınlığı standart optotipten biraz farklıdır. Ekran parlaklığı ve kontrastı standardize değildir.</p>' + K.dr;
  function boy() { return S.mes * 1000 * Math.tan(5 / 60 / L[S.i][0] * Math.PI / 180) * K.pxmm(); }
  function karistir() { var n = Math.max(1, N), a = [], p = -1, v, m = S.tip === 'E' || S.tip === 'C' ? 4 : SET[S.tip].length; while (a.length < n) { v = Math.floor(Math.random() * m); if (v !== p || m < 2) { a.push(v); p = v; } } SEQ = a; }
  function panel() {
    K.$('esP').innerHTML = '<div><p class="cgt-h">Optotip</p>' + K.chips('t', [['E', 'E'], ['C', 'Landolt C'], ['harf', 'Harf'], ['rakam', 'Rakam']], S.tip) + '</div>' + K.range('mes', 'Test mesafesi', S.mes, .4, 6, .1, ' m', K.tr(S.mes)) +
      '<div><p class="cgt-h">Satır</p><div class="cgt-chips"><button type="button" class="cgt-btn" data-a="buyut">Büyüt</button><button type="button" class="cgt-btn" data-a="kucult">Küçült</button><button type="button" class="cgt-btn y" data-a="kar">Karıştır</button></div><div style="font-size:12.5px;color:#5b6b82;margin-top:6px">Klavye: ↑ ↓ satır, boşluk karıştır.</div></div>' +
      '<div><p class="cgt-h">Zemin</p>' + K.chips('z', [['b', 'Beyaz'], ['d', 'Duokrom']], S.zemin) + '</div><label class="cgt-tog"><input type="checkbox" id="esAy"' + (S.ayna ? ' checked' : '') + '> Ayna için ters çevir</label><div id="esK"></div>';
    K.calib(K.$('esK'), function () { N = 0; redraw(); info(); });
  }
  function info() { var l = L[S.i], H = boy(); K.$('esI').innerHTML = '<b>Satır:</b> ondalık <b>' + String(l[0]).replace('.', ',') + '</b> · Snellen <b>' + l[1] + '</b> (' + l[2] + ') · logMAR <b>' + K.tr(-Math.log(l[0]) / Math.LN10, 1).replace('-', '−') + '</b> · optotip yüksekliği ' + K.tr(H / K.pxmm(), 1) + ' mm.' + (WARN ? ' <b style="color:#b3261e">' + WARN + '</b>' : '') + (S.zemin === 'd' ? ' Duokromda harfler kırmızı zeminde daha net ise eksi yönde, yeşilde daha net ise artı yönde düzeltme düşünülür.' : ''); }
  function opt(g, H, v) {
    var u = H / 5, i;
    if (S.tip === 'E') { g.rotate(v * Math.PI / 2); g.fillRect(-H / 2, -H / 2, u, H); for (i = 0; i < 3; i++) g.fillRect(-H / 2, -H / 2 + i * 2 * u, H, u); }
    else if (S.tip === 'C') { g.rotate(v * Math.PI / 2); var a = Math.asin(.5 / 2.5); g.beginPath(); g.arc(0, 0, H / 2, a, 2 * Math.PI - a); g.arc(0, 0, H / 2 - u, 2 * Math.PI - Math.asin(.5 / 1.5), Math.asin(.5 / 1.5), true); g.closePath(); g.fill(); }
    else { var ch = SET[S.tip].charAt(v), f = 200; g.font = '700 ' + f + 'px Arial, Helvetica, sans-serif'; var m = g.measureText('H'), cap = (m.actualBoundingBoxAscent || f * .716) / f; f = H / cap; g.font = '700 ' + f + 'px Arial, Helvetica, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillText(ch, 0, H / 2); }
  }
  function draw(g, w, h) {
    var H = boy(), n = K.cl(Math.floor((w - 24 + H) / (2 * H)), 1, 5), i, dpr = window.devicePixelRatio || 1;
    if (n !== N || SEQ.length !== n) { N = n; karistir(); }
    if (S.zemin === 'd') { g.fillStyle = '#e8262a'; g.fillRect(0, 0, w / 2, h); g.fillStyle = '#1fb84a'; g.fillRect(w / 2, 0, w / 2, h); } else { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); }
    var w0 = WARN; WARN = H > h - 16 || H > w - 16 ? 'Bu satır ekrana sığmıyor; mesafeyi azaltın ya da daha küçük satıra geçin.' : H * dpr < 10 ? 'Ekran çözünürlüğü bu satır için yetersiz; mesafeyi artırın.' : '';
    g.fillStyle = '#000'; var tot = n * H + (n - 1) * H, x0 = w / 2 - tot / 2 + H / 2;
    for (i = 0; i < n; i++) { g.save(); g.translate(S.ayna ? w - (x0 + i * 2 * H) : x0 + i * 2 * H, h / 2); if (S.ayna) g.scale(-1, 1); opt(g, H, SEQ[i]); g.restore(); }
    if (w0 !== WARN) info();
  }
  panel();
  var st = K.$('esS'), redraw = K.fit(K.$('esC'), draw); info(); st.tabIndex = 0;
  function sat(d) { S.i = K.cl(S.i + d, 0, L.length - 1); N = 0; redraw(); info(); }
  st.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp') sat(-1); else if (e.key === 'ArrowDown') sat(1); else if (e.key === ' ') { karistir(); redraw(); } else return; e.preventDefault(); });
  K.$('esP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var t = b.getAttribute('data-t'), a = b.getAttribute('data-a'), z = b.getAttribute('data-z'); if (t) { S.tip = t; N = 0; panel(); } else if (z) { S.zemin = z; panel(); } else if (a === 'buyut') { sat(-1); return; } else if (a === 'kucult') { sat(1); return; } else if (a === 'kar') karistir(); else return; redraw(); info(); });
  K.$('esP').addEventListener('input', function (e) { if (e.target.getAttribute('data-k') !== 'mes') return; S.mes = +e.target.value; K.$('esP').querySelector('[data-v="mes"]').textContent = K.tr(S.mes) + ' m'; N = 0; redraw(); info(); });
  K.$('esP').addEventListener('change', function (e) { if (e.target.id === 'esAy') { S.ayna = e.target.checked; redraw(); } });
})();
