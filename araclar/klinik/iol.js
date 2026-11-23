/* Göz içi mercek (IOL) görüş simülatörü ve teknik şema · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-iol'); if (!K || !root || root.querySelector('canvas')) return;
  var W = 960, H = 540;
  /* b: uzak, orta, yakın bulanıklık (px, 960 genişlikte) · h: hale şiddeti · r: halka sayısı · e: defokus eğrisi (0…−4 D, 0,5 D adım, logMAR) */
  var T = {
    mono: { ad: 'Monofokal', b: [0, 2.4, 6.5], h: .12, r: 0, e: [0, .05, .15, .3, .42, .52, .62, .7, .78], t: 'Tek odak, genellikle uzak için hedeflenir. Uzak görüş keskin, kontrast yüksek, hale ve parlama en azdır; orta ve yakın için gözlük gerekir.' },
    plus: { ad: 'Artırılmış monofokal', b: [0, 1.2, 4.8], h: .15, r: 0, e: [0, .02, .08, .18, .3, .42, .54, .64, .74], t: 'Monofokale yakın optik kalite; orta mesafede (gösterge paneli, bilgisayar) bir miktar ek netlik sağlar. Yakın için gözlük gereksinimi sürer.' },
    edof: { ad: 'EDOF (uzatılmış odak derinliği)', b: [.2, .3, 2.6], h: .34, r: 1, e: [0, .0, .03, .1, .2, .32, .44, .56, .68], t: 'Odak uzatılarak uzaktan ortaya kesintisiz görüş hedeflenir. Yakın okuma için ince yazıda gözlük gerekebilir; gece hale ve yıldızlanma monofokalden biraz fazladır.' },
    tri: { ad: 'Trifokal', b: [.3, .5, .5], h: .8, r: 3, e: [0, .05, .1, .1, .12, .08, .1, .2, .34], t: 'Işık uzak, orta ve yakın odaklara bölünür; gözlük bağımsızlığı en yüksek gruptur. Bedeli, gece ışık kaynaklarının çevresinde halkalı haleler ve düşük ışıkta bir miktar kontrast kaybıdır.' },
    kat: { ad: 'Katarakt (ameliyat öncesi)', b: [2.6, 2.8, 3.2], h: .95, r: 0, e: [.4, .42, .46, .52, .58, .64, .7, .76, .82], t: 'Karşılaştırma için: saydamlığını yitirmiş mercek ışığı saçar; görüntü soluk, sarımsı ve bulanıktır, karşıdan gelen farlar göz kamaştırır.' }
  };
  var S = { sek: 'sim', tip: 'mono', pup: 4, torik: false };
  root.innerHTML = '<p class="cgt-lead">Farklı göz içi mercek tasarımlarında gece araç kullanırken uzak, orta ve yakın görüşün ve ışık halelerinin nasıl değiştiğini karşılaştırın; teknik şemada optik tasarımı, ışın yolunu ve defokus eğrisini görün.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="ioP"></div><div class="cgt-col"><div class="cgt-stage cgk-stage" id="ioS" style="aspect-ratio:16/9;background:#05080f"><canvas id="ioF" width="' + W + '" height="' + H + '"></canvas><canvas id="ioM" width="' + W + '" height="' + H + '"></canvas><canvas id="ioN" width="' + W + '" height="' + H + '"></canvas><canvas id="ioH" width="' + W + '" height="' + H + '"></canvas><button type="button" class="cgk-fs" data-fs="ioS">Tam ekran</button></div><div class="cgt-info" id="ioI"></div></div></div>' +
    '<p class="cgt-note">Görüntüler ve eğriler <b>temsilîdir</b>; belirli bir marka ya da modelin ölçülmüş performansını göstermez. Gerçek sonuç mercek modeline, pupilla çapına, korneal astigmatizmaya, biyometri doğruluğuna ve nöroadaptasyona göre değişir. Hasta bilgilendirmesinde yardımcı görsel olarak kullanılabilir, mercek seçimi kararının yerini tutmaz.</p>' + K.dr;
  var cF = K.$('ioF'), cM = K.$('ioM'), cN = K.$('ioN'), cH = K.$('ioH');
  function panel() {
    K.$('ioP').innerHTML = '<div><p class="cgt-h">Görünüm</p>' + K.chips('s', [['sim', 'Görüş simülasyonu'], ['sema', 'Teknik şema']], S.sek) + '</div>' +
      '<div><p class="cgt-h">Mercek</p>' + K.chips('t', Object.keys(T).filter(function (k) { return S.sek === 'sim' || k !== 'kat'; }).map(function (k) { return [k, T[k].ad]; }), S.tip) + '</div>' +
      (S.sek === 'sim' ? K.range('pup', 'Pupilla çapı', S.pup, 2, 7, .5, ' mm', K.tr(S.pup)) : '<label class="cgt-tog"><input type="checkbox" id="ioT"' + (S.torik ? ' checked' : '') + '> Torik (astigmat düzeltmeli)</label>');
  }
  function info() { var t = T[S.tip]; K.$('ioI').innerHTML = '<b>' + t.ad + ':</b> ' + t.t + (S.sek === 'sema' && S.torik ? ' <b>Torik</b> seçenekte optiğin üzerindeki eksen işaretleri korneanın dik meridyenine hizalanır; her 1° rotasyon silindir etkisinin yaklaşık %3,3’ünü kaybettirir.' : ''); }
  var LP = [[250, 262, 15], [292, 262, 15], [560, 250, 8], [582, 250, 8], [150, 110, 12], [800, 95, 12], [705, 150, 7]];
  function uzak() {
    var g = cF.getContext('2d'), i, gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#060b1c'); gr.addColorStop(.5, '#111a33'); gr.addColorStop(.52, '#0a0d14'); gr.addColorStop(1, '#14161b');
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.fillStyle = '#17191f'; g.beginPath(); g.moveTo(470, 280); g.lineTo(490, 280); g.lineTo(1100, H); g.lineTo(-140, H); g.fill();
    g.strokeStyle = '#d8d8c8'; g.lineWidth = 3; g.setLineDash([26, 22]); g.beginPath(); g.moveTo(480, 284); g.lineTo(480, H); g.stroke(); g.setLineDash([]);
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(471, 282); g.lineTo(-60, H); g.moveTo(489, 282); g.lineTo(1020, H); g.stroke();
    g.fillStyle = '#0b0f1a'; for (i = 0; i < 14; i++) g.fillRect(i * 72 - 10, 250 - (i * 37 % 60), 60, 34 + (i * 37 % 60));
    g.fillStyle = '#0d6b3a'; g.fillRect(610, 150, 200, 74); g.strokeStyle = '#fff'; g.lineWidth = 3; g.strokeRect(614, 154, 192, 66); g.fillStyle = '#fff'; g.font = '700 26px Arial'; g.textAlign = 'center'; g.fillText('TEKİRDAĞ', 710, 184); g.font = '700 17px Arial'; g.fillText('Çıkış 2 km', 710, 208);
    g.fillStyle = '#394050'; g.fillRect(703, 224, 6, 60); g.fillRect(148, 110, 4, 172); g.fillRect(798, 95, 4, 187);
    LP.forEach(function (p) { g.fillStyle = '#fffbe6'; g.beginPath(); g.arc(p[0], p[1], p[2] * .45, 0, 7); g.fill(); });
  }
  function orta() {
    var g = cM.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
    g.fillStyle = '#06070a'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, 440); g.quadraticCurveTo(480, 372, W, 440); g.lineTo(W, H); g.fill();
    g.strokeStyle = '#2a2f3a'; g.lineWidth = 16; g.beginPath(); g.arc(300, 560, 150, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
    g.fillStyle = '#0c1220'; g.beginPath(); if (g.roundRect) g.roundRect(420, 430, 250, 92, 12); else g.rect(420, 430, 250, 92); g.fill();
    g.fillStyle = '#7fe3ff'; g.font = '700 40px Arial'; g.textAlign = 'left'; g.fillText('90', 440, 492); g.font = '600 15px Arial'; g.fillText('km/sa', 492, 492); g.fillStyle = '#e9eef7'; g.font = '600 15px Arial'; g.fillText('21:45  ·  12°C', 548, 462); g.fillText('Yakıt 380 km', 548, 486); g.fillStyle = '#ffd400'; g.font = '600 12px Arial'; g.fillText('400 m sonra sağa dönün', 440, 512);
  }
  function yakin() {
    var g = cN.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
    g.fillStyle = '#1c1f26'; g.beginPath(); if (g.roundRect) g.roundRect(724, 330, 196, 200, 18); else g.rect(724, 330, 196, 200); g.fill(); g.fillStyle = '#f4f6fa'; g.fillRect(734, 346, 176, 176);
    g.fillStyle = '#14233b'; g.font = '700 13px Arial'; g.textAlign = 'left'; g.fillText('Mesajlar', 744, 366); g.font = '400 11px Arial';
    ['Eve gelirken ekmek ve', 'süt alır mısın? Eczane', 'de açıkmış, damlayı', 'unutma. Akşam yemeği', 'saat sekizde hazır.'].forEach(function (s, i) { g.fillText(s, 744, 388 + i * 16); });
    g.font = '400 8px Arial'; g.fillStyle = '#5b6b82'; g.fillText('İnce yazı: prospektüsü okuyunuz, 5 mg', 744, 478); g.fillText('günde iki kez, yemeklerden sonra.', 744, 490);
  }
  function hale() {
    var g = cH.getContext('2d'), t = T[S.tip], k = t.h * (S.pup / 4); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); g.globalCompositeOperation = 'lighter';
    LP.forEach(function (p) {
      var R = p[2] * (2.2 + 7 * k), gr = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], R), i; gr.addColorStop(0, 'rgba(255,248,215,' + Math.min(1, .35 + k * .6) + ')'); gr.addColorStop(.25, 'rgba(255,240,190,' + (.12 + k * .3) + ')'); gr.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = gr; g.beginPath(); g.arc(p[0], p[1], R, 0, 7); g.fill();
      for (i = 1; i <= t.r; i++) { g.strokeStyle = 'rgba(255,245,210,' + (.34 * k / i) + ')'; g.lineWidth = Math.max(1.2, p[2] * .28); g.beginPath(); g.arc(p[0], p[1], p[2] * (1.6 + i * 1.5) * (.8 + S.pup / 10), 0, 7); g.stroke(); }
      if (S.tip === 'edof' || S.tip === 'kat') { g.strokeStyle = 'rgba(255,245,210,' + (.22 * k) + ')'; g.lineWidth = 1.4; for (i = 0; i < 10; i++) { var a = i * Math.PI / 5 + p[0]; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[0] + Math.cos(a) * R * 1.25, p[1] + Math.sin(a) * R * 1.25); g.stroke(); } }
    });
    g.globalCompositeOperation = 'source-over';
    if (S.tip === 'kat') { g.fillStyle = 'rgba(190,160,90,.2)'; g.fillRect(0, 0, W, H); }
    g.fillStyle = 'rgba(255,255,255,.85)'; g.font = '700 15px Arial'; g.textAlign = 'left'; g.fillText(t.ad + ' · pupilla ' + K.tr(S.pup) + ' mm', 16, 28); g.font = '600 12px Arial'; g.fillStyle = 'rgba(255,255,255,.6)'; g.fillText('Uzak: tabela ve farlar · Orta: gösterge paneli · Yakın: telefon', 16, 48);
  }
  function sema() {
    var g = cH.getContext('2d'), t = T[S.tip], i, cx = 190, cy = 200; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.fillStyle = '#0b1730'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#cfe3ff'; g.font = '800 13px Arial'; g.textAlign = 'left'; g.fillText('ÖNDEN GÖRÜNÜM', 24, 30); g.fillText('IŞIN YOLU', 400, 30); g.fillText('DEFOKUS EĞRİSİ (temsilî)', 400, 300);
    g.strokeStyle = '#8fc0ff'; g.lineWidth = 5; g.lineCap = 'round';[0, Math.PI].forEach(function (r) { g.save(); g.translate(cx, cy); g.rotate(r); g.beginPath(); g.moveTo(58, -52); g.bezierCurveTo(120, -110, 170, -40, 150, 40); g.stroke(); g.restore(); });
    var gr = g.createRadialGradient(cx - 25, cy - 25, 5, cx, cy, 80); gr.addColorStop(0, 'rgba(210,235,255,.55)'); gr.addColorStop(1, 'rgba(120,180,255,.2)'); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, 78, 0, 7); g.fill(); g.strokeStyle = '#8fc0ff'; g.lineWidth = 3; g.stroke();
    var nr = { mono: 0, plus: 1, edof: 3, tri: 9 }[S.tip] || 0; g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1.3; for (i = 1; i <= nr; i++) { g.beginPath(); g.arc(cx, cy, S.tip === 'plus' ? 14 : 78 * Math.sqrt(i / (nr + 1)), 0, 7); g.stroke(); }
    if (S.torik) { g.fillStyle = '#ffd400';[-1, 1].forEach(function (s) { for (i = 0; i < 3; i++) { g.beginPath(); g.arc(cx + s * (58 + i * 7), cy, 2.2, 0, 7); g.fill(); } }); g.strokeStyle = 'rgba(255,212,0,.5)'; g.setLineDash([5, 5]); g.beginPath(); g.moveTo(cx - 110, cy); g.lineTo(cx + 110, cy); g.stroke(); g.setLineDash([]); }
    g.fillStyle = '#cfe3ff'; g.font = '600 12.5px Arial'; g.textAlign = 'center'; g.fillText('Optik çapı ≈ 6,0 mm · toplam boy ≈ 13,0 mm', cx, 330); g.fillText(nr ? (S.tip === 'plus' ? 'Santralde güç artışı bölgesi' : nr + ' halka: ' + (S.tip === 'tri' ? 'difraktif basamaklar' : 'odak uzatma bölgeleri')) : 'Düz, tek güçlü optik', cx, 350); if (S.torik) g.fillText('Sarı noktalar: düz eksen işaretleri', cx, 370);
    /* ışın yolu */
    var lx = 440, ly = 150, fx = { mono: [900], plus: [880, 900], edof: [840, 900], tri: [770, 840, 900] }[S.tip] || [900];
    g.fillStyle = 'rgba(160,205,255,.35)'; g.beginPath(); g.ellipse(lx, ly, 12, 70, 0, 0, 7); g.fill(); g.strokeStyle = '#8fc0ff'; g.lineWidth = 2; g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 1; g.beginPath(); g.moveTo(400, ly); g.lineTo(930, ly); g.stroke(); g.strokeStyle = '#ffb4a0'; g.lineWidth = 3; g.beginPath(); g.arc(1010, ly, 110, Math.PI * .8, Math.PI * 1.2); g.stroke();
    var col = ['#7dffb0', '#ffd400', '#ff8fa3']; fx.forEach(function (f, j) { g.strokeStyle = col[(fx.length - 1 - j) % 3]; g.lineWidth = 1.4; g.globalAlpha = .85;[-56, -30, 30, 56].forEach(function (y) { g.beginPath(); g.moveTo(400, ly + y); g.lineTo(lx, ly + y); g.lineTo(f, ly); g.stroke(); }); g.globalAlpha = 1; g.fillStyle = col[(fx.length - 1 - j) % 3]; g.beginPath(); g.arc(f, ly, 4, 0, 7); g.fill(); });
    if (S.tip === 'edof') { g.strokeStyle = '#7dffb0'; g.lineWidth = 6; g.globalAlpha = .5; g.beginPath(); g.moveTo(840, ly); g.lineTo(900, ly); g.stroke(); g.globalAlpha = 1; }
    g.fillStyle = '#cfe3ff'; g.font = '600 12.5px Arial'; g.textAlign = 'left'; g.fillText({ mono: 'Tek odak retinada (uzak).', plus: 'Ana odak retinada; hafif uzatılmış odak.', edof: 'Odak bir nokta değil, uzatılmış bir bölge.', tri: 'Üç odak: yakın, orta ve uzak.' }[S.tip], 400, 250);
    /* defokus eğrisi */
    var x0 = 440, y0 = 320, pw = 480, ph = 180; g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; g.font = '600 11px Arial'; g.fillStyle = '#9db4d6';
    for (i = 0; i <= 4; i++) { var yy = y0 + ph * i / 4; g.beginPath(); g.moveTo(x0, yy); g.lineTo(x0 + pw, yy); g.stroke(); g.textAlign = 'right'; g.fillText(K.tr(i * .2), x0 - 8, yy + 4); }
    for (i = 0; i <= 8; i++) { g.textAlign = 'center'; g.fillText(i ? '−' + K.tr(i * .5) : '0', x0 + pw * i / 8, y0 + ph + 16); }
    g.fillText('Defokus (D): 0 uzak · −1,5 ≈ 66 cm · −2,5 ≈ 40 cm', x0 + pw / 2, y0 + ph + 34); g.save(); g.translate(x0 - 40, y0 + ph / 2); g.rotate(-Math.PI / 2); g.fillText('logMAR', 0, 0); g.restore();
    ['mono', 'plus', 'edof', 'tri'].forEach(function (k) { var on = k === S.tip; g.strokeStyle = on ? '#ffd400' : 'rgba(160,190,230,.35)'; g.lineWidth = on ? 3.5 : 1.5; g.beginPath(); T[k].e.forEach(function (v, j) { var x = x0 + pw * j / 8, y = y0 + ph * Math.min(v, .8) / .8; if (j) g.lineTo(x, y); else g.moveTo(x, y); }); g.stroke(); });
  }
  function render() {
    var t = T[S.tip], st = K.$('ioS'), k = st.clientWidth / W || 1, sim = S.sek === 'sim';
    [cF, cM, cN].forEach(function (c, i) { c.style.display = sim ? '' : 'none'; c.style.filter = t.b[i] ? 'blur(' + (t.b[i] * k).toFixed(2) + 'px)' : 'none'; });
    if (sim) hale(); else sema();
  }
  panel(); uzak(); orta(); yakin(); render(); info();
  if (window.ResizeObserver) new ResizeObserver(render).observe(K.$('ioS')); else window.addEventListener('resize', render);
  K.$('ioP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var s = b.getAttribute('data-s'), t = b.getAttribute('data-t'); if (s) { S.sek = s; if (s === 'sema' && S.tip === 'kat') S.tip = 'mono'; } else if (t) S.tip = t; else return; panel(); render(); info(); });
  K.$('ioP').addEventListener('input', function (e) { if (e.target.getAttribute('data-k') !== 'pup') return; S.pup = +e.target.value; K.$('ioP').querySelector('[data-v="pup"]').textContent = K.tr(S.pup) + ' mm'; render(); });
  K.$('ioP').addEventListener('change', function (e) { if (e.target.id === 'ioT') { S.torik = e.target.checked; render(); info(); } });
})();
