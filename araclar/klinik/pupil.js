/* Muayene ışığı ve pupilla cetveli · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-pupil'); if (!K || !root || root.querySelector('canvas')) return;
  var S = { mod: 'cetvel', renk: 'beyaz', sekil: 'tam', boy: 20 }, A = { odL: '', osL: '', odD: '', osD: '' };
  var RN = { beyaz: ['Beyaz', '#ffffff'], mavi: ['Kobalt mavisi', '#0a2cff'], yesil: ['Yeşil (kırmızısız)', '#00ff3c'], kirmizi: ['Kırmızı', '#ff0000'], sari: ['Sarı', '#ffe600'] };
  root.innerHTML = '<p class="cgt-lead">Telefon ya da tableti muayene yardımcısına çevirin: gerçek ölçekli pupilla cetveli, renkli ışık kaynağı ve anizokori değerlendirme yardımcısı tek sayfada.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="puP"></div><div class="cgt-col">' + K.stage('pu', 'min(72vh,600px)', '#fff') + '<div class="cgt-info" id="puI"></div></div></div>' +
    '<p class="cgt-note">Cetvelin doğruluğu ekran kalibrasyonuna bağlıdır; ilk kullanımda kartla kalibre edin. Ekran ışığı gerçek bir muayene ışığının şiddetine ulaşmaz ve filtreleri tam karşılamaz (ör. kobalt mavisi floresein için yalnızca kaba fikir verir); en yüksek parlaklıkta kullanın.</p>' + K.dr;
  function num(v) { v = parseFloat(String(v).replace(',', '.')); return isNaN(v) ? null : v; }
  function aniz() {
    var a = num(A.odL), b = num(A.osL), c = num(A.odD), d = num(A.osD); if (a == null || b == null || c == null || d == null) return 'Dört değeri de girin (mm).';
    var L = Math.abs(a - b), D = Math.abs(c - d), s = 'Aydınlıkta fark <b>' + K.tr(L) + ' mm</b>, loş ışıkta fark <b>' + K.tr(D) + ' mm</b>. ';
    if (L < .4 && D < .4) return s + 'Anlamlı anizokori yok.';
    if (D > L + .3) return s + 'Fark <b>loş ışıkta artıyor</b>: küçük olan pupilla (' + (c < d ? 'sağ' : 'sol') + ') yeterince genişleyemiyor olabilir. Horner sendromu akla gelir; fizyolojik anizokori de loşta hafif belirginleşebilir.';
    if (L > D + .3) return s + 'Fark <b>aydınlıkta artıyor</b>: büyük olan pupilla (' + (a > b ? 'sağ' : 'sol') + ') yeterince daralamıyor olabilir. Üçüncü sinir tutulumu, tonik pupilla, farmakolojik midriyazis ve iris hasarı ayırıcı tanıdadır.';
    return s + 'Fark iki ışık koşulunda benzer: fizyolojik anizokoriyle uyumlu olabilir (çoğunlukla 1 mm’nin altındadır).';
  }
  function panel() {
    var h = '<div><p class="cgt-h">Mod</p>' + K.chips('m', [['cetvel', 'Pupilla cetveli'], ['isik', 'Işık']], S.mod) + '</div>';
    if (S.mod === 'isik') h += '<div><p class="cgt-h">Renk</p>' + K.chips('r', Object.keys(RN).map(function (k) { return [k, RN[k][0]]; }), S.renk) + '</div><div><p class="cgt-h">Biçim</p>' + K.chips('s', [['tam', 'Tüm ekran'], ['nokta', 'Nokta'], ['yarik', 'Yarık']], S.sekil) + '</div>' + (S.sekil !== 'tam' ? K.range('boy', S.sekil === 'nokta' ? 'Nokta çapı' : 'Yarık genişliği', S.boy, 1, 60, 1, ' mm') : '');
    h += '<div><p class="cgt-h">Anizokori yardımcısı (mm)</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">' + [['odL', 'Sağ · aydınlık'], ['osL', 'Sol · aydınlık'], ['odD', 'Sağ · loş'], ['osD', 'Sol · loş']].map(function (f) { return '<input type="text" inputmode="decimal" data-n="' + f[0] + '" placeholder="' + f[1] + '" aria-label="' + f[1] + '" value="' + A[f[0]] + '">'; }).join('') + '</div><div id="puA" style="font-size:13.5px;margin-top:8px">' + aniz() + '</div></div><div id="puK"></div>';
    K.$('puP').innerHTML = h; K.calib(K.$('puK'), function () { redraw(); });
  }
  function info() { K.$('puI').innerHTML = S.mod === 'cetvel' ? '<b>Kullanım:</b> Tam ekrana alın, cihazın sol kenarını hastanın gözünün yanına tutun ve pupillayı en yakın yarım daireyle eşleştirin. Ölçümü hem aydınlıkta hem loş ışıkta, hasta uzağa bakarken yapın.' : '<b>Kullanım:</b> Ekran parlaklığını en yükseğe alın. Nokta ve yarık biçimleri ışık refleksi, ön kamara derinliği için yandan aydınlatma ve kaba transillüminasyon denemelerinde yardımcı olur.'; }
  function draw(g, w, h) {
    var mm = K.pxmm(), i;
    if (S.mod === 'isik') {
      var c = RN[S.renk][1]; if (S.sekil === 'tam') { g.fillStyle = c; g.fillRect(0, 0, w, h); return; }
      g.fillStyle = '#000'; g.fillRect(0, 0, w, h); g.fillStyle = c;
      if (S.sekil === 'nokta') { g.beginPath(); g.arc(w / 2, h / 2, S.boy * mm / 2, 0, 7); g.fill(); } else g.fillRect(w / 2 - S.boy * mm / 2, 0, S.boy * mm, h);
      return;
    }
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); var n = 8, st = h / n; g.textBaseline = 'middle';
    for (i = 0; i < n; i++) {
      var d = 2 + i, y = st * (i + .5), r = d * mm / 2;
      g.fillStyle = '#000'; g.beginPath(); g.arc(0, y, r, -Math.PI / 2, Math.PI / 2); g.fill();
      g.beginPath(); g.arc(w * .5, y, r, 0, 7); g.fill();
      g.fillStyle = '#14233b'; g.font = '800 18px Arial'; g.textAlign = 'left'; g.fillText(d + ' mm', Math.max(r + 12, 9 * mm / 2 + 12), y);
      g.strokeStyle = '#d7e0ee'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, st * (i + 1)); g.lineTo(w, st * (i + 1)); g.stroke();
    }
    g.fillStyle = '#5b6b82'; g.font = '700 12.5px Arial'; g.textAlign = 'right'; g.fillText(K.calibrated() ? 'Gerçek ölçek' : 'Kalibre edilmedi: ölçek yaklaşık', w - 12, h - 14);
  }
  panel(); info();
  var redraw = K.fit(K.$('puC'), draw);
  K.$('puP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var m = b.getAttribute('data-m'), r = b.getAttribute('data-r'), s = b.getAttribute('data-s'); if (m) S.mod = m; else if (r) S.renk = r; else if (s) S.sekil = s; else return; panel(); info(); redraw(); });
  K.$('puP').addEventListener('input', function (e) { var k = e.target.getAttribute('data-k'), n = e.target.getAttribute('data-n'); if (k) { S[k] = +e.target.value; K.$('puP').querySelector('[data-v="' + k + '"]').textContent = S[k] + ' mm'; redraw(); } else if (n) { A[n] = e.target.value; K.$('puA').innerHTML = aniz(); } });
})();
