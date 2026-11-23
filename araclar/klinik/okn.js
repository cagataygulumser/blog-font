/* OKN tamburu · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-okn'); if (!K || !root || root.querySelector('canvas')) return;
  var S = { dir: 'sag', hiz: 120, gen: 15, desen: 'sb', run: true }, off = 0, last = 0;
  var DES = { sb: ['#000', '#fff'], kb: ['#d01818', '#fff'], sy: ['#000', '#ffd400'] };
  root.innerHTML = '<p class="cgt-lead">Ekranı optokinetik tambur olarak kullanın: çizgilerin yönünü, hızını ve genişliğini ayarlayın, tam ekrana alıp hastanın takip ve hızlı faz yanıtını izleyin.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="okP"></div><div class="cgt-col">' + K.stage('ok') + '<div class="cgt-info" id="okI"></div></div></div>' + K.dr;
  function panel() {
    K.$('okP').innerHTML = '<div><p class="cgt-h">Yön</p>' + K.chips('d', [['sag', 'Sağa'], ['sol', 'Sola'], ['yuk', 'Yukarı'], ['asa', 'Aşağı']], S.dir) + '</div>' +
      K.range('hiz', 'Hız', S.hiz, 20, 400, 10, ' mm/sn') + K.range('gen', 'Çizgi genişliği', S.gen, 3, 40, 1, ' mm') +
      '<div><p class="cgt-h">Desen</p>' + K.chips('p', [['sb', 'Siyah-beyaz'], ['kb', 'Kırmızı-beyaz'], ['sy', 'Siyah-sarı'], ['res', 'Şekilli (çocuk)']], S.desen) + '</div>' +
      '<div class="cgt-chips"><button type="button" class="cgt-btn y" data-a="run">' + (S.run ? 'Duraklat' : 'Başlat') + '</button><button type="button" class="cgt-btn" data-a="ters">Yönü ters çevir</button></div><div id="okK"></div>';
    K.calib(K.$('okK'));
  }
  function info() {
    var y = { sag: 'sağa', sol: 'sola', yuk: 'yukarı', asa: 'aşağı' }[S.dir], t = { sag: 'sola', sol: 'sağa', yuk: 'aşağı', asa: 'yukarı' }[S.dir];
    K.$('okI').innerHTML = '<b>Beklenen yanıt:</b> Çizgiler ' + y + ' akarken yavaş faz ' + y + ', düzeltici hızlı faz ' + t + ' doğru olur. İki yöne yanıtı karşılaştırın; belirgin asimetri ya da yanıt alınamaması ileri değerlendirme gerektirir. Bebeklerde ve işbirliği kuramayan hastalarda görme varlığının kaba göstergesi olarak, ayrıca hızlı faz (sakkad) değerlendirmesinde kullanılır.';
  }
  var SH = ['#e23', '#1a7fe0', '#16a34a', '#f59e0b'];
  function draw(g, w, h) {
    var mm = K.pxmm(), bw = S.gen * mm, per = bw * 2, hor = S.dir === 'sag' || S.dir === 'sol', L = hor ? w : h, o = ((off % per) + per) % per, i, n = 0;
    var c = DES[S.desen] || ['#fff', '#fff']; g.fillStyle = c[1]; g.fillRect(0, 0, w, h);
    for (i = -per + o; i < L; i += per, n++) {
      if (S.desen === 'res') {
        var k = Math.round((i - o) / per), col = SH[((k % 4) + 4) % 4], r = Math.min(bw * .8, (hor ? h : w) * .12), a = i + bw / 2, m, cnt = Math.max(1, Math.floor((hor ? h : w) / (r * 4)));
        g.fillStyle = col;
        for (m = 0; m < cnt; m++) { var b = ((m + .5) / cnt) * (hor ? h : w), x = hor ? a : b, y = hor ? b : a; g.beginPath(); if ((k + m) % 2) g.arc(x, y, r, 0, 7); else { g.moveTo(x, y - r); g.lineTo(x + r, y + r); g.lineTo(x - r, y + r); } g.fill(); }
      } else { g.fillStyle = c[0]; if (hor) g.fillRect(i, 0, bw, h); else g.fillRect(0, i, w, bw); }
    }
  }
  panel(); info();
  var cv = K.$('okC'), redraw = K.fit(cv, draw);
  function tick(t) {
    if (!document.body.contains(cv)) return;
    var dt = Math.min(.1, (t - last) / 1000 || 0); last = t;
    if (S.run) { var v = S.hiz * K.pxmm() * dt; off += (S.dir === 'sag' || S.dir === 'asa') ? v : -v; redraw(); }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  K.$('okP').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var d = b.getAttribute('data-d'), p = b.getAttribute('data-p'), a = b.getAttribute('data-a');
    if (d) S.dir = d; else if (p) S.desen = p; else if (a === 'run') S.run = !S.run; else if (a === 'ters') S.dir = { sag: 'sol', sol: 'sag', yuk: 'asa', asa: 'yuk' }[S.dir]; else return;
    panel(); info(); redraw();
  });
  K.$('okP').addEventListener('input', function (e) { var k = e.target.getAttribute('data-k'); if (!k) return; S[k] = +e.target.value; K.$('okP').querySelector('[data-v="' + k + '"]').textContent = S[k] + (k === 'hiz' ? ' mm/sn' : ' mm'); redraw(); });
})();
