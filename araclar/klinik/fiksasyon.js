/* Fiksasyon hedefi · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-fiks'); if (!K || !root || root.querySelector('canvas')) return;
  var S = { hedef: 'yildiz', har: 'sabit', hiz: 5, boy: 30, zemin: 'k', ses: false }, t = 0, last = 0, P = { x: .5, y: .5 }, J = { x: .5, y: .5, n: 0 }, ac = null;
  root.innerHTML = '<p class="cgt-lead">Çocuk ve erişkin muayenesinde dikkat çeken, hareketli ve sesli fiksasyon hedefi. Hedefi, hareket biçimini ve hızını seçin; tam ekrana alıp fiksasyonu, takibi ve sakkadları izleyin.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="fxP"></div><div class="cgt-col">' + K.stage('fx') + '<div class="cgt-info" id="fxI"></div></div></div>' + K.dr;
  function panel() {
    K.$('fxP').innerHTML = '<div><p class="cgt-h">Hedef</p>' + K.chips('t', [['yildiz', 'Yıldız'], ['yuz', 'Gülen yüz'], ['firil', 'Fırıldak'], ['hedef', 'Halka'], ['nokta', 'Nokta'], ['harf', 'Harf']], S.hedef) + '</div>' +
      '<div><p class="cgt-h">Hareket</p>' + K.chips('m', [['sabit', 'Sabit'], ['yatay', 'Yatay'], ['dikey', 'Dikey'], ['daire', 'Daire'], ['sekiz', 'Sekiz'], ['sicra', 'Sıçrama'], ['yak', 'Yaklaş-uzaklaş']], S.har) + '</div>' +
      K.range('hiz', 'Hız', S.hiz, 1, 10, 1, '') + K.range('boy', 'Hedef boyu', S.boy, 4, 80, 1, ' mm') +
      '<div><p class="cgt-h">Zemin</p>' + K.chips('z', [['k', 'Siyah'], ['b', 'Beyaz'], ['g', 'Gri']], S.zemin) + '</div>' +
      '<label class="cgt-tog"><input type="checkbox" id="fxSes"' + (S.ses ? ' checked' : '') + '> Ses (dikkat çekici bip)</label><div id="fxK"></div>';
    K.calib(K.$('fxK'), function () { });
  }
  function info() {
    var m = { sabit: 'Sabit hedefte fiksasyonun santral, sabit ve sürdürülebilir olup olmadığına bakın.', yatay: 'Yatay harekette düzgün takibi (pursuit) ve iki gözün birlikte hareketini izleyin.', dikey: 'Dikey harekette düzgün takibi ve kapak-göz uyumunu izleyin.', daire: 'Dairesel harekette tüm bakış yönlerinde takibi izleyin.', sekiz: 'Sekiz hareketi takibi çapraz yönlerde de sınar.', sicra: 'Sıçrayan hedefte sakkadların isabetine ve gecikmesine bakın; hedef her yer değiştirdiğinde bip sesi verilebilir.', yak: 'Büyüyüp küçülen hedef akomodasyon ve yakın refleksi uyarmak için dikkat çekici bir hedef sağlar; gerçek konverjans değerlendirmesi için hedefi fiziksel olarak yaklaştırmak gerekir.' };
    K.$('fxI').innerHTML = '<b>İpucu:</b> ' + m[S.har] + ' Ekrana dokunursanız hedef dokunduğunuz yere gider.';
  }
  function bip(f) { if (!S.ses) return; try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); var o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f || 880; o.connect(g); g.connect(ac.destination); g.gain.setValueAtTime(.18, ac.currentTime); g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .18); o.start(); o.stop(ac.currentTime + .2); } catch (e) { } }
  function star(g, r) { g.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .45 : r; g.lineTo(Math.cos(a) * q, Math.sin(a) * q); } g.closePath(); g.fill(); }
  function hedef(g, r) {
    var i, dark = S.zemin === 'k';
    if (S.hedef === 'yildiz') { g.rotate(t * .8); g.fillStyle = '#ffd400'; star(g, r); g.fillStyle = '#ff7a00'; star(g, r * .45); }
    else if (S.hedef === 'yuz') { g.fillStyle = '#ffd400'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.fillStyle = '#14233b'; var bl = Math.sin(t * 3) > .93 ? .15 : 1; g.beginPath(); g.ellipse(-r * .35, -r * .2, r * .11, r * .16 * bl, 0, 0, 7); g.ellipse(r * .35, -r * .2, r * .11, r * .16 * bl, 0, 0, 7); g.fill(); g.strokeStyle = '#14233b'; g.lineWidth = Math.max(1.5, r * .09); g.lineCap = 'round'; g.beginPath(); g.arc(0, r * .05, r * .55, .15 * Math.PI, .85 * Math.PI); g.stroke(); }
    else if (S.hedef === 'firil') { g.rotate(t * 3); var c = ['#e23', '#1a7fe0', '#16a34a', '#f59e0b']; for (i = 0; i < 8; i++) { g.fillStyle = c[i % 4]; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, i * Math.PI / 4, (i + 1) * Math.PI / 4); g.fill(); } g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, r * .14, 0, 7); g.fill(); }
    else if (S.hedef === 'hedef') { for (i = 4; i > 0; i--) { g.fillStyle = i % 2 ? '#e23' : '#fff'; g.beginPath(); g.arc(0, 0, r * i / 4, 0, 7); g.fill(); } }
    else if (S.hedef === 'nokta') { g.fillStyle = dark ? '#fff' : '#000'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.fillStyle = '#e23'; g.beginPath(); g.arc(0, 0, Math.max(1, r * .2), 0, 7); g.fill(); }
    else { g.fillStyle = dark ? '#fff' : '#000'; g.font = '800 ' + (r * 2) + 'px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('EHVOTAZN'.charAt(J.n % 8), 0, r * .08); }
  }
  function draw(g, w, h) {
    g.fillStyle = { k: '#000', b: '#fff', g: '#808080' }[S.zemin]; g.fillRect(0, 0, w, h);
    var r = S.boy * K.pxmm() / 2, mx = Math.max(.02, r / w + .02), my = Math.max(.02, r / h + .02), a = t * S.hiz * .35, x = P.x, y = P.y, k = 1;
    if (S.har === 'yatay') { x = .5 + (0.5 - mx) * Math.sin(a); y = .5; }
    else if (S.har === 'dikey') { x = .5; y = .5 + (0.5 - my) * Math.sin(a); }
    else if (S.har === 'daire') { x = .5 + (0.5 - mx) * Math.cos(a); y = .5 + (0.5 - my) * Math.sin(a); }
    else if (S.har === 'sekiz') { x = .5 + (0.5 - mx) * Math.sin(a); y = .5 + (0.5 - my) * Math.sin(2 * a) * .8; }
    else if (S.har === 'sicra') { x = J.x; y = J.y; }
    else if (S.har === 'yak') { k = 1 + .7 * Math.sin(a); }
    g.save(); g.translate(x * w, y * h); hedef(g, Math.max(2, r * k)); g.restore();
  }
  panel(); info();
  var cv = K.$('fxC'), redraw = K.fit(cv, draw), acc = 0;
  function tick(ts) {
    if (!document.body.contains(cv)) return; var dt = Math.min(.1, (ts - last) / 1000 || 0); last = ts; t += dt;
    if (S.har === 'sicra') { acc += dt; if (acc > 3.2 - S.hiz * .28) { acc = 0; J = { x: .12 + Math.random() * .76, y: .15 + Math.random() * .7, n: J.n + 1 }; bip(660 + Math.random() * 500); } }
    redraw(); requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  cv.addEventListener('pointerdown', function (e) { var r = cv.getBoundingClientRect(); P = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; J = { x: P.x, y: P.y, n: J.n + 1 }; acc = 0; bip(990); });
  K.$('fxP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var a = b.getAttribute('data-t'), m = b.getAttribute('data-m'), z = b.getAttribute('data-z'); if (a) S.hedef = a; else if (m) { S.har = m; P = { x: .5, y: .5 }; } else if (z) S.zemin = z; else return; panel(); info(); });
  K.$('fxP').addEventListener('input', function (e) { var k = e.target.getAttribute('data-k'); if (k) { S[k] = +e.target.value; K.$('fxP').querySelector('[data-v="' + k + '"]').textContent = S[k] + (k === 'boy' ? ' mm' : ''); } });
  K.$('fxP').addEventListener('change', function (e) { if (e.target.id === 'fxSes') { S.ses = e.target.checked; bip(880); } });
})();
