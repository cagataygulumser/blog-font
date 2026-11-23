/* Worth 4 nokta testi · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-worth'); if (!K || !root || root.querySelector('canvas')) return;
  var S = { cap: 8, acik: 35, mes: 33, gor: 'test' };
  var G = {
    test: ['Test görüntüsü', 'Hastaya kırmızı-yeşil gözlüğü takın (kırmızı cam sağ gözde) ve kaç nokta gördüğünü, renklerini sorun. Aşağıdaki seçeneklerle olası yanıtların görünümünü ve yorumunu inceleyebilirsiniz.'],
    f4: ['4 nokta', '<b>Füzyon.</b> Alttaki beyaz nokta kırmızı, yeşil ya da ikisinin karışımı olarak tarif edilebilir. Manifest şaşılığı olan hastada 4 nokta görülmesi anormal retinal korespondansı düşündürür.'],
    r2: ['2 kırmızı nokta', '<b>Sol göz supresyonu.</b> Yalnızca kırmızı camın arkasındaki sağ gözün gördükleri algılanıyor.'],
    g3: ['3 yeşil nokta', '<b>Sağ göz supresyonu.</b> Yalnızca yeşil camın arkasındaki sol gözün gördükleri algılanıyor.'],
    d5u: ['5 nokta · kırmızılar sağda', '<b>Çaprazlanmamış (unkros) diplopi.</b> Sağ gözün görüntüsü sağda kalıyor; ezodeviasyonla uyumludur.'],
    d5c: ['5 nokta · kırmızılar solda', '<b>Çaprazlanmış (kros) diplopi.</b> Sağ gözün görüntüsü solda kalıyor; ekzodeviasyonla uyumludur.'],
    alt: ['Dönüşümlü 2 ve 3 nokta', '<b>Alternan supresyon.</b> Hasta bir an 2 kırmızı, bir an 3 yeşil nokta görür; iki göz dönüşümlü olarak baskılanır.']
  };
  root.innerHTML = '<p class="cgt-lead">Kırmızı-yeşil gözlükle yapılan Worth 4 nokta testinin ekran sürümü: nokta boyutunu ve test mesafesini ayarlayın, hastanın tarif ettiği görüntüyü seçip yorumunu görün.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="woP"></div><div class="cgt-col">' + K.stage('wo') + '<div class="cgt-info" id="woI"></div></div></div>' +
    '<p class="cgt-note">Kabul: kırmızı cam sağ gözün önünde. Gözlük ters takılırsa sağ/sol yorumları yer değiştirir. Ekrandaki kırmızı ve yeşilin gözlük filtreleriyle tam ayrışması ekrana ve gözlüğe göre değişir; her filtrenin karşı rengi söndürdüğünü önce kendi gözünüzle doğrulayın.</p>' + K.dr;
  function aci() { return 2 * Math.atan(S.acik / 2 / (S.mes * 10)) * 180 / Math.PI; }
  function panel() {
    K.$('woP').innerHTML = '<div><p class="cgt-h">Hazır ayar</p><div class="cgt-chips"><button type="button" class="cgt-chip" data-h="y">Yakın · 33 cm</button><button type="button" class="cgt-chip" data-h="u">Uzak · 6 m</button></div></div>' +
      K.range('cap', 'Nokta çapı', S.cap, 3, 40, 1, ' mm') + K.range('acik', 'Dış açıklık', S.acik, 15, 180, 1, ' mm') + K.range('mes', 'Test mesafesi', S.mes, 20, 600, 1, ' cm') +
      '<div class="cgt-row"><span>Görme açısı</span><b id="woA">' + K.tr(aci()) + '°</b></div>' +
      '<div><p class="cgt-h">Hasta ne görüyor?</p><div class="cgt-chips">' + Object.keys(G).map(function (k) { return '<button type="button" class="cgt-chip' + (S.gor === k ? ' on' : '') + '" data-g="' + k + '">' + G[k][0] + '</button>'; }).join('') + '</div></div><div id="woK"></div>';
    K.calib(K.$('woK'), function () { redraw(); });
  }
  function info() { K.$('woI').innerHTML = (S.gor === 'test' ? '<b>Uygulama:</b> ' : '<b>Yorum:</b> ') + G[S.gor][1] + (S.gor === 'test' ? ' Bu ayarda noktaların toplam açıklığı ' + S.mes + ' cm’den <b>' + K.tr(aci()) + '°</b> görme açısı yapar; açı küçüldükçe (uzak test) santral füzyon, büyüdükçe (yakın test) periferik füzyon sınanır.' : ''); }
  var R = '#ff1a1a', Y = '#12e04a', W = '#ffffff';
  function dots(g, cx, cy, list) { var mm = K.pxmm(), r = S.cap * mm / 2, a = S.acik * mm / 2 - r; list.forEach(function (d) { g.fillStyle = d[2]; g.beginPath(); g.arc(cx + d[0] * a, cy + d[1] * a, r, 0, 7); g.fill(); }); }
  function draw(g, w, h) {
    g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
    var cx = w / 2, cy = h / 2, mm = K.pxmm(), sh = Math.min(w * .22, S.acik * mm * .6), t = (Date.now() / 1400) % 2 < 1;
    var red = [[0, -1, R], [0, 1, R]], grn = [[-1, 0, Y], [1, 0, Y], [0, 1, Y]];
    if (S.gor === 'test') dots(g, cx, cy, [[0, -1, R], [-1, 0, Y], [1, 0, Y], [0, 1, W]]);
    else if (S.gor === 'f4') dots(g, cx, cy, [[0, -1, R], [-1, 0, Y], [1, 0, Y], [0, 1, '#d8c23a']]);
    else if (S.gor === 'r2') dots(g, cx, cy, red);
    else if (S.gor === 'g3') dots(g, cx, cy, grn);
    else if (S.gor === 'alt') dots(g, cx, cy, t ? red : grn);
    else { var s = S.gor === 'd5u' ? 1 : -1; dots(g, cx - s * sh, cy, grn); dots(g, cx + s * sh, cy, red); }
    if (S.gor !== 'test') { g.fillStyle = 'rgba(255,255,255,.6)'; g.font = '700 13px Arial'; g.textAlign = 'center'; g.fillText('Hastanın algıladığı görüntü (temsilî)', cx, h - 14); }
  }
  panel(); info();
  var cv = K.$('woC'), redraw = K.fit(cv, draw);
  setInterval(function () { if (S.gor === 'alt') redraw(); }, 350);
  K.$('woP').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var hh = b.getAttribute('data-h'), gg = b.getAttribute('data-g');
    if (hh === 'y') { S.cap = 8; S.acik = 35; S.mes = 33; } else if (hh === 'u') { S.cap = 30; S.acik = 131; S.mes = 600; } else if (gg) S.gor = gg; else return;
    panel(); info(); redraw();
  });
  K.$('woP').addEventListener('input', function (e) { var k = e.target.getAttribute('data-k'); if (!k) return; S[k] = +e.target.value; K.$('woP').querySelector('[data-v="' + k + '"]').textContent = S[k] + (k === 'mes' ? ' cm' : ' mm'); K.$('woA').textContent = K.tr(aci()) + '°'; info(); redraw(); });
})();
