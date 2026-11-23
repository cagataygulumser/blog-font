/* Yakın okuma kartı · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-yakin'); if (!K || !root || root.querySelector('.cgk-yk')) return;
  var M = [4, 2.5, 2, 1.6, 1.25, 1, .8, .63, .5, .4, .32];
  var T = ['Sabah erkenden yola çıktık.', 'Deniz kenarında uzun bir yürüyüş yaptık, hava çok güzeldi.', 'Bahçedeki elma ağacı bu yıl her zamankinden daha çok meyve verdi.', 'Kütüphanenin en sessiz köşesinde, pencerenin yanındaki masada oturmayı severdi.', 'Çarşıdaki eski fırın her sabah mahalleye taze ekmek kokusu yayar, önünde küçük bir kuyruk oluşurdu.', 'Yağmur dindikten sonra çocuklar sokağa çıktı; su birikintilerinin üzerinden atlayarak okula doğru koşmaya başladılar.', 'Dedem her akşam radyoyu açar, haberleri dinlerken bir yandan da balkondaki çiçekleri sular, sonra bize eski günleri anlatırdı.', 'Trenin penceresinden bakarken tarlaların, küçük köylerin ve uzaktaki dağların birbiri ardına geçişini izlemek ona her zaman huzur verirdi.', 'Usta, saatin arka kapağını dikkatle açtı; içindeki küçük dişlileri tek tek temizledi, yayı yeniden kurdu ve saati kulağına götürüp bir süre dinledi.', 'Kasabanın pazarı cumartesi günleri kurulur; köylüler sabahın ilk ışıklarıyla tezgâhlarını açar, öğleye doğru meydan alışveriş edenlerle dolup taşar, akşamüstü yavaş yavaş boşalırdı.', 'Eski defterin sararmış sayfaları arasında, yıllar önce yazılmış kısa notlar, bir yolculuğun bilet koçanı ve kurutulmuş bir yaprak buldu; hepsini masaya dizip uzun süre baktı.'];
  var R = ['7 2 9 4', '3 8 5 6 2', '9 4 7 3 8 5', '6 2 5 9 3 7 4', '8 3 7 2 6 4 9 5', '5 9 2 8 4 7 3 6 2', '4 7 3 6 9 2 5 8 3 7', '2 8 5 3 7 4 9 6 2 5 8', '7 3 9 5 2 8 4 6 3 9 5 2', '6 4 8 2 9 5 3 7 4 8 2 6 9', '3 9 5 7 2 6 8 4 9 3 5 7 2 6'];
  var S = { tip: 'metin', mes: 40 }, XH = .45;
  (function () { try { var c = document.createElement('canvas').getContext('2d'); c.font = '200px "Times New Roman", Times, serif'; var m = c.measureText('x'); if (m.actualBoundingBoxAscent) XH = m.actualBoundingBoxAscent / 200; } catch (e) { } })();
  root.innerHTML = '<p class="cgt-lead">Ekranı gerçek ölçekli yakın okuma kartına çevirin: M birimi, N (punto) karşılığı ve seçtiğiniz mesafedeki görme keskinliğiyle Türkçe okuma metinleri ya da rakam dizileri.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="ykP"></div><div class="cgt-col"><div class="cgt-panel cgk-yk" id="ykK" style="gap:0;padding:6px 16px"></div><div class="cgt-info" id="ykI"></div></div></div>' +
    '<p class="cgt-note">Harf boyu M birimine göre hesaplanır: 1 M, küçük harf yüksekliği (x yüksekliği) 1,454 mm olan yazıdır ve 1 metreden 5 açı dakikası görür. N değeri yaklaşık punto karşılığıdır (N ≈ 8 × M). Jaeger numaraları kartlar arasında standart olmadığı için verilmemiştir. Doğruluk ekran kalibrasyonuna bağlıdır; en küçük satırlar düşük çözünürlüklü ekranlarda net basılmaz.</p>' + K.dr;
  function panel() { K.$('ykP').innerHTML = '<div><p class="cgt-h">İçerik</p>' + K.chips('t', [['metin', 'Okuma metni'], ['rakam', 'Rakam']], S.tip) + '</div>' + K.range('mes', 'Okuma mesafesi', S.mes, 25, 60, 1, ' cm') + '<div id="ykC"></div>'; K.calib(K.$('ykC'), render); }
  function render() {
    var mm = K.pxmm(), dpr = window.devicePixelRatio || 1, kucuk = 0;
    K.$('ykK').innerHTML = M.map(function (m, i) {
      var xh = m * 1.454 * mm, fs = xh / XH, va = S.mes / 100 / m; if (xh * dpr < 5) kucuk++;
      return '<div style="display:grid;grid-template-columns:86px minmax(0,1fr);gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid #e3eaf5"><div style="font:700 12px/1.5 Arial,sans-serif;color:#5b6b82"><b style="display:block;font-size:15px;color:#004aad">' + String(m).replace('.', ',') + ' M</b>N' + Math.round(m * 8) + ' · ' + K.tr(va, va < .1 ? 3 : 2) + '</div><div style="font-family:\'Times New Roman\',Times,serif;font-size:' + fs.toFixed(2) + 'px;line-height:1.25;color:#000;overflow-wrap:anywhere">' + (S.tip === 'metin' ? T[i] : R[i]) + '</div></div>';
    }).join('');
    K.$('ykI').innerHTML = '<b>Okuma:</b> Sol sütunda M birimi, N karşılığı ve <b>' + S.mes + ' cm</b> için ondalık görme keskinliği yazar (görme keskinliği = mesafe (m) ÷ M). Hastanın rahatça okuduğu en küçük satırı kaydedin; mesafeyi mutlaka not edin.' + (kucuk ? ' <b style="color:#b3261e">Bu ekranda en küçük ' + kucuk + ' satır çözünürlük sınırının altında; sonuçları o satırlar için güvenilir saymayın.</b>' : '') + (K.calibrated() ? '' : ' <b>Ekran henüz kalibre edilmedi.</b>');
  }
  panel(); render();
  K.$('ykP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b || !b.getAttribute('data-t')) return; S.tip = b.getAttribute('data-t'); panel(); render(); });
  K.$('ykP').addEventListener('input', function (e) { if (e.target.getAttribute('data-k') !== 'mes') return; S.mes = +e.target.value; K.$('ykP').querySelector('[data-v="mes"]').textContent = S.mes + ' cm'; render(); });
})();
