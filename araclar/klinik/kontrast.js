/* Kontrast duyarlılık kartı (Pelli-Robson düzeni) · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-kontrast'); if (!K || !root || root.querySelector('canvas')) return;
  var SET = 'CDHKNORSVZ', S = { sec: -1, seq: [] }, HIT = [], HMM = 0;
  function karistir() { var a = [], p = ''; while (a.length < 48) { var c = SET.charAt(Math.floor(Math.random() * 10)); if (c !== p) { a.push(c); p = c; } } S.seq = a; S.sec = -1; }
  root.innerHTML = '<p class="cgt-lead">Harfler aynı boyda kalır, kontrast üçlü gruplar hâlinde adım adım azalır. Hastanın en az iki harfini doğru okuduğu son üçlüye dokunun; log kontrast duyarlılığı hesaplansın.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="knP"></div><div class="cgt-col">' + K.stage('kn', 'min(78vh,680px)', '#fff') + '<div class="cgt-info" id="knI"></div></div></div>' +
    '<p class="cgt-note">Her üçlü bir öncekinden 0,15 log birim daha düşük kontrasttadır (0,00’dan 2,25’e 16 üçlü). Kontrast, standart sRGB gama eğrisi varsayılarak hesaplanır; ekranın gerçek parlaklık eğrisi ölçülmediği ve 8 bit ekranlar en düşük kontrastları ayrı ayrı gösteremediği için 1,65’in üzerindeki değerler güvenilir değildir. Sonuç kaba bir taramadır; basılı kart ya da kalibre cihazla doğrulanmalıdır. Ekran parlaklığını en yükseğe alın, gece modu ve otomatik parlaklığı kapatın.</p>' + K.dr;
  function panel() { K.$('knP').innerHTML = '<div><div class="cgt-row"><span>Harf yüksekliği</span><b id="knH">–</b></div><div class="cgt-row"><span>Önerilen mesafe</span><b id="knM">–</b></div><div class="cgt-row"><span>Sonuç (log KD)</span><b id="knS">' + (S.sec < 0 ? '–' : K.tr(S.sec * .15, 2)) + '</b></div></div><div class="cgt-chips"><button type="button" class="cgt-btn y" data-a="kar">Harfleri değiştir</button><button type="button" class="cgt-btn" data-a="sil">Seçimi sil</button></div><div id="knK"></div>'; K.calib(K.$('knK'), function () { redraw(); }); olcu(); }
  function olcu() { var h = K.$('knH'); if (!h) return; h.textContent = K.tr(HMM, 0) + ' mm'; K.$('knM').textContent = K.tr(HMM / Math.tan(2.8 * Math.PI / 180) / 10, 0) + ' cm'; }
  function info() { K.$('knI').innerHTML = S.sec < 0 ? '<b>Uygulama:</b> Hastayı önerilen mesafeye oturtun (harfler yaklaşık 2,8° görme açısı yapar), her gözü ayrı test edin ve harfleri soldan sağa, yukarıdan aşağıya okutun. Soluk harflerde tahmin etmesi için en az 20 saniye bekleyin.' : '<b>Log kontrast duyarlılığı: ' + K.tr(S.sec * .15, 2) + '</b> (kontrast eşiği %' + K.tr(100 * Math.pow(10, -S.sec * .15), S.sec > 8 ? 2 : 1) + '). Sağlıklı genç erişkinde beklenen değer yaklaşık 1,80–1,95’tir; 1,50’nin altı azalmış, 1,05’in altı belirgin azalmış kabul edilir.' + (S.sec > 11 ? ' <b style="color:#b3261e">Bu düzey ekranın güvenilir biçimde gösterebildiği sınırın üzerinde.</b>' : ''); }
  function draw(g, w, h) {
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); var cols = 6, rows = 8, mx = w * .06, cw = (w - 2 * mx) / cols, rh = (h - 16) / rows, H = Math.min(cw * .6, rh * .62), f = 200; HIT = [];
    g.font = '700 200px Arial, Helvetica, sans-serif'; var cap = (g.measureText('H').actualBoundingBoxAscent || 143) / 200; f = H / cap; g.font = '700 ' + f + 'px Arial, Helvetica, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; HMM = H / K.pxmm();
    for (var t = 0; t < 16; t++) {
      var r = Math.floor(t / 2), c0 = (t % 2) * 3, C = Math.pow(10, -t * .15), v = Math.round(255 * Math.pow(1 - C, 1 / 2.2)), x0 = mx + c0 * cw, y0 = 8 + r * rh;
      if (t === S.sec) { g.fillStyle = 'rgba(255,212,0,.22)'; g.fillRect(x0 + 2, y0 + 2, 3 * cw - 4, rh - 4); g.strokeStyle = '#e6bf00'; g.lineWidth = 2; g.strokeRect(x0 + 2, y0 + 2, 3 * cw - 4, rh - 4); }
      g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; for (var i = 0; i < 3; i++) g.fillText(S.seq[t * 3 + i], x0 + (i + .5) * cw, y0 + rh / 2 + H / 2);
      g.fillStyle = '#9aa7b8'; g.font = '600 10.5px Arial'; g.textAlign = 'left'; g.fillText(K.tr(t * .15, 2), x0 + 5, y0 + 13); g.font = '700 ' + f + 'px Arial, Helvetica, sans-serif'; g.textAlign = 'center';
      HIT.push([x0, y0, 3 * cw, rh, t]);
    }
    olcu();
  }
  karistir(); panel(); info();
  var cv = K.$('knC'), redraw = K.fit(cv, draw);
  cv.addEventListener('pointerdown', function (e) { var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; HIT.forEach(function (b) { if (x >= b[0] && x < b[0] + b[2] && y >= b[1] && y < b[1] + b[3]) S.sec = b[4]; }); K.$('knS').textContent = S.sec < 0 ? '–' : K.tr(S.sec * .15, 2); info(); redraw(); });
  K.$('knP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var a = b.getAttribute('data-a'); if (a === 'kar') karistir(); else if (a === 'sil') S.sec = -1; else return; K.$('knS').textContent = '–'; info(); redraw(); });
})();
