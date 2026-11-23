/* Parks-Bielschowsky üç adım testi · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-parks'); if (!K || !root || root.querySelector('.cgk-grid')) return;
  var M = { RSR: ['Sağ üst rektus', 'OD · SR'], RIR: ['Sağ alt rektus', 'OD · IR'], RSO: ['Sağ üst oblik', 'OD · SO'], RIO: ['Sağ alt oblik', 'OD · IO'], LSR: ['Sol üst rektus', 'OS · SR'], LIR: ['Sol alt rektus', 'OS · IR'], LSO: ['Sol üst oblik', 'OS · SO'], LIO: ['Sol alt oblik', 'OS · IO'] };
  var ORD = ['RSR', 'RIR', 'RSO', 'RIO', 'LSR', 'LIR', 'LSO', 'LIO'];
  var A = [{ sag: ['RIR', 'RSO', 'LSR', 'LIO'], sol: ['RSR', 'RIO', 'LIR', 'LSO'] }, { sag: ['RSR', 'RIR', 'LSO', 'LIO'], sol: ['LSR', 'LIR', 'RSO', 'RIO'] }, { sag: ['RSR', 'RSO', 'LIR', 'LIO'], sol: ['LSR', 'LSO', 'RIR', 'RIO'] }];
  var Q = [['1. adım · Primer pozisyonda hangi göz yukarıda?', [['sag', 'Sağ hipertropya'], ['sol', 'Sol hipertropya']]], ['2. adım · Kayma hangi bakışta artıyor?', [['sag', 'Sağa bakışta'], ['sol', 'Sola bakışta']]], ['3. adım · Kayma baş hangi omuza eğilince artıyor?', [['sag', 'Sağ omuza'], ['sol', 'Sol omuza']]]];
  var S = [null, null, null];
  root.innerHTML = '<p class="cgt-lead">Tek kas felcine bağlı vertikal şaşılıkta paretik kası bulmak için üç adımlı eleme: her yanıtta sekiz siklovertikal kastan dışlananlar soluklaşır, sonunda tek kas kalır.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="pkP"></div><div class="cgt-col"><div class="cgt-panel"><p class="cgt-h">Sekiz siklovertikal kas</p><div class="cgk-grid" id="pkG"></div></div><div class="cgt-info" id="pkI"></div></div></div>' +
    '<p class="cgt-note">Üç adım testi yalnızca <b>tek bir siklovertikal kasın</b> parezisinde geçerlidir. Restriktif şaşılık (tiroid orbitopati, orbita tabanı kırığı), skew deviasyon, miyastenia gravis, dissosiye vertikal deviasyon, iki taraflı dördüncü sinir felci ve geçirilmiş şaşılık cerrahisinde yanıltıcı sonuç verir. Skew deviasyonu ayırmak için yatar-oturur test (dördüncü adım) eklenebilir.</p>' + K.dr;
  function kalan() { var r = ORD.slice(); S.forEach(function (v, i) { if (v) r = r.filter(function (m) { return A[i][v].indexOf(m) >= 0; }); }); return r; }
  function render() {
    K.$('pkP').innerHTML = Q.map(function (q, i) { return '<div><p class="cgt-h">' + q[0] + '</p>' + K.chips('q' + i, q[1], S[i]) + '</div>'; }).join('') + '<div class="cgt-chips"><button type="button" class="cgt-btn" data-a="sil">Sıfırla</button></div>';
    var r = kalan(), n = S.filter(Boolean).length, tek = n === 3 && r.length === 1;
    K.$('pkG').innerHTML = ORD.map(function (m) { return '<div class="cgk-m' + (r.indexOf(m) < 0 ? ' off' : tek ? ' hit' : '') + '">' + M[m][0] + '<small>' + M[m][1] + '</small></div>'; }).join('');
    var t;
    if (!n) t = '<b>Başlangıç:</b> Sekiz kasın hepsi olası. İlk adımda hipertropik gözü seçin; o gözün depresörleri ya da diğer gözün elevatörleri zayıftır.';
    else if (!tek) t = '<b>Kalan olasılıklar (' + r.length + '):</b> ' + r.map(function (m) { return M[m][0].toLowerCase(); }).join(', ') + '.' + (n === 1 ? ' İkinci adımda kaymanın arttığı yatay bakış yönünü seçin: rektuslar abduksiyonda, oblikler adduksiyonda en etkili vertikal kaslardır.' : n === 2 && S[0] && S[1] ? ' Üçüncü adımda baş eğme yanıtını seçin: eğilen taraftaki gözde intorsiyon (üst rektus, üst oblik), karşı gözde ekstorsiyon (alt rektus, alt oblik) kasları devreye girer.' : ' Kalan adımları da yanıtlayın.');
    else { var m = r[0]; t = '<b>Paretik kas: ' + M[m][0] + ' (' + M[m][1] + ').</b> ' + (m.charAt(1) === 'S' && m.charAt(2) === 'O' ? 'Üst oblik felci (dördüncü sinir) klinikte en sık karşılaşılan tablodur; hasta başını genellikle karşı omuza eğer.' : 'İzole ' + M[m][0].toLowerCase() + ' parezisi üst oblik felcine göre seyrektir; restriktif ve nöromusküler nedenleri dışlayın.'); }
    K.$('pkI').innerHTML = t;
  }
  K.$('pkP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; if (b.getAttribute('data-a') === 'sil') S = [null, null, null]; else for (var i = 0; i < 3; i++) { var v = b.getAttribute('data-q' + i); if (v) S[i] = v; } render(); });
  render();
})();
