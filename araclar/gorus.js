/* "Böyle Görüyor" — görme durumu canlandırıcı · cagataygulumser.com */
(function () {
  'use strict';
  var root = document.getElementById('cgt-gorus'); if (!root || root.firstChild && root.querySelector('canvas')) return;
  var W = 960, H = 540, WW = 640, WH = 360;
  var C = [['miy', 'Miyop'], ['ast', 'Astigmat'], ['kat', 'Katarakt'], ['glo', 'Glokom'], ['sar', 'Sarı nokta'], ['diy', 'Diyabetik retinopati'], ['pro', 'Kırmızı renk körlüğü'], ['deu', 'Yeşil renk körlüğü'], ['tri', 'Mavi renk körlüğü'], ['akr', 'Tam renk körlüğü']];
  var T = {
    miy: ['Miyop', 'Yakın net, uzak bulanık görülür. Numara büyüdükçe bulanıklık artar; gözlük ya da kontakt lensle düzeltilir.', function (v) { return '−' + (0.5 + v * 7.5).toFixed(2).replace('.', ',') + ' D'; }],
    ast: ['Astigmat', 'Görüntü her yönde eşit bulanıklaşmaz; tek bir doğrultuda uzar ve gölgelenir. Işıklar çizgi gibi görünebilir.', function (v) { return '−' + (0.5 + v * 3.5).toFixed(2).replace('.', ',') + ' D'; }],
    kat: ['Katarakt', 'Göz merceği saydamlığını yitirdikçe görüntü puslanır, renkler sararır, ışık kaynakları kamaşma yapar.', function (v) { return v < .34 ? 'başlangıç' : v < .67 ? 'orta' : 'ileri'; }],
    glo: ['Glokom', 'Görme alanı çevreden içeri doğru daralır; merkez uzun süre net kaldığı için kayıp geç fark edilir. Kaybedilen alan geri gelmez.', function (v) { return v < .34 ? 'erken' : v < .67 ? 'orta' : 'ileri'; }],
    sar: ['Sarı nokta hastalığı', 'Bakılan yerin tam ortasında bulanık ya da karanlık bir alan oluşur; çevre görüş korunur. Düz çizgiler eğri görünebilir.', function (v) { return v < .34 ? 'erken' : v < .67 ? 'orta' : 'ileri'; }],
    diy: ['Diyabetik retinopati', 'Görme alanında dağınık koyu lekeler ve bulanık bölgeler oluşabilir. Şeker hastalarında düzenli göz dibi muayenesi bu yüzden önemlidir.', function (v) { return v < .34 ? 'hafif' : v < .67 ? 'orta' : 'ileri'; }],
    pro: ['Kırmızı renk körlüğü (protan)', 'Kırmızı tonlar soluk ve koyu görünür; kırmızı ile yeşil birbirine karışır.', function (v) { return '%' + Math.round(v * 100); }],
    deu: ['Yeşil renk körlüğü (döteran)', 'En sık görülen tiptir; yeşil ile kırmızı tonları ayırt etmek zorlaşır.', function (v) { return '%' + Math.round(v * 100); }],
    tri: ['Mavi renk körlüğü (tritan)', 'Nadir görülür; mavi ile yeşil, sarı ile pembe birbirine karışır.', function (v) { return '%' + Math.round(v * 100); }],
    akr: ['Tam renk körlüğü', 'Çok nadirdir; dünya gri tonlarında görülür ve ışığa hassasiyet eşlik eder.', function (v) { return '%' + Math.round(v * 100); }]
  };
  var MX = { pro: [.567, .433, 0, .558, .442, 0, 0, .242, .758], deu: [.625, .375, 0, .7, .3, 0, 0, .3, .7], tri: [.95, .05, 0, 0, .433, .567, 0, .475, .525], akr: [.299, .587, .114, .299, .587, .114, .299, .587, .114] };
  var S = { c: 'miy', v: .35, ax: 90, src: 'ornek', split: .5, cmp: true }, img = null, user = null, camOn = false, tmr = null, facing = 'environment';
  root.innerHTML = '<p class="cgt-lead">Miyop, astigmat, katarakt ya da renk körlüğü olan biri dünyayı nasıl görür? Kameranızı açın ya da bir fotoğraf seçin; aynı sahneyi onun gözünden görün.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="gvP"></div><div class="cgt-col"><div class="cgt-stage"><canvas id="gvC" width="' + W + '" height="' + H + '" style="touch-action:pan-y"></canvas></div><div class="cgt-info" id="gvI"></div></div></div>' +
    '<p class="cgt-note">Bu sayfa temsili bir canlandırmadır; her gözde durum farklı seyreder ve tanı koymaz. Görme şikâyetinde göz hekimine başvurun. Kamera görüntüsü cihazınızdan çıkmaz, kaydedilmez. Örnek fotoğraf: Unsplash (Ben Garratt).</p>' +
    '<video id="gvV" playsinline muted style="display:none"></video><input type="file" id="gvF" accept="image/*" style="display:none">';
  function $(i) { return document.getElementById(i); }
  var cv = $('gvC'), g = cv.getContext('2d'), vid = $('gvV'), wk = document.createElement('canvas'), wg = wk.getContext('2d'); wk.width = WW; wk.height = WH;
  function mk(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function cl(x, a, b) { return x < a ? a : x > b ? b : x; }
  function cover(G, s, sw, sh, w, h) { var k = Math.max(w / sw, h / sh); G.drawImage(s, (w - sw * k) / 2, (h - sh * k) / 2, sw * k, sh * k); }
  function blur(src, r) { if (r < .5) return src; var s = 1 / (1 + r * .55), tw = Math.max(6, Math.round(WW * s)), th = Math.max(4, Math.round(WH * s)), cur = src, cw = WW, n; while (cw / 2 > tw) { n = mk(Math.round(cw / 2), Math.round(n ? n.height / 2 : WH / 2)); n.getContext('2d').drawImage(cur, 0, 0, n.width, n.height); cur = n; cw = n.width; } n = mk(tw, th); var G = n.getContext('2d'); G.imageSmoothingQuality = 'high'; G.drawImage(cur, 0, 0, tw, th); var o = mk(WW, WH), O = o.getContext('2d'); O.imageSmoothingQuality = 'high'; O.drawImage(n, 0, 0, WW, WH); return o; }
  function dirBlur(src, len, ang) { if (len < 1) return src; var o = mk(WW, WH), G = o.getContext('2d'), n = Math.max(14, Math.round(len / 2)), dx = Math.cos(ang), dy = -Math.sin(ang); for (var i = 0; i < n; i++) { var t = (i / (n - 1) - .5) * len; G.globalAlpha = 1 / (i + 1); G.drawImage(src, dx * t, dy * t); } return o; }
  function rng(s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  function fx(src) {
    var c = S.c, v = S.v, o = mk(WW, WH), G = o.getContext('2d'), gr, i;
    if (c === 'miy') return blur(src, 1 + v * 17);
    if (c === 'ast') return dirBlur(blur(src, .6 + v), 5 + v * 34, S.ax * Math.PI / 180);
    if (c === 'kat') { G.drawImage(blur(src, 1.5 + v * 9), 0, 0); G.globalCompositeOperation = 'lighter'; G.globalAlpha = .1 + v * .3; G.drawImage(blur(src, 26), 0, 0); G.globalCompositeOperation = 'multiply'; G.globalAlpha = 1; G.fillStyle = 'rgb(255,' + Math.round(244 - v * 48) + ',' + Math.round(225 - v * 105) + ')'; G.fillRect(0, 0, WW, WH); G.globalCompositeOperation = 'source-over'; G.fillStyle = 'rgba(214,200,170,' + (.12 + v * .34) + ')'; G.fillRect(0, 0, WW, WH); return o; }
    if (c === 'glo') { G.drawImage(blur(src, 10), 0, 0); G.fillStyle = 'rgba(20,22,26,.78)'; G.fillRect(0, 0, WW, WH); var r = WH * (.98 - v * .8), m = mk(WW, WH), M = m.getContext('2d'); M.drawImage(src, 0, 0); M.globalCompositeOperation = 'destination-in'; gr = M.createRadialGradient(WW / 2, WH / 2, r * .45, WW / 2, WH / 2, r); gr.addColorStop(0, '#000'); gr.addColorStop(1, 'rgba(0,0,0,0)'); M.fillStyle = gr; M.fillRect(0, 0, WW, WH); G.drawImage(m, 0, 0); return o; }
    if (c === 'sar') { G.drawImage(src, 0, 0); var r2 = WH * (.12 + v * .34), m2 = mk(WW, WH), M2 = m2.getContext('2d'); M2.drawImage(blur(src, 9 + v * 10), 0, 0); M2.fillStyle = 'rgba(40,36,34,' + (.3 + v * .55) + ')'; M2.fillRect(0, 0, WW, WH); M2.globalCompositeOperation = 'destination-in'; gr = M2.createRadialGradient(WW / 2, WH / 2, r2 * .35, WW / 2, WH / 2, r2); gr.addColorStop(0, '#000'); gr.addColorStop(1, 'rgba(0,0,0,0)'); M2.fillStyle = gr; M2.fillRect(0, 0, WW, WH); G.drawImage(m2, 0, 0); return o; }
    if (c === 'diy') { G.drawImage(blur(src, 1 + v * 4), 0, 0); var R = rng(11), n = Math.round(6 + v * 22); for (i = 0; i < n; i++) { var x = R() * WW, y = R() * WH, rr = 14 + R() * (30 + v * 60); gr = G.createRadialGradient(x, y, rr * .2, x, y, rr); gr.addColorStop(0, 'rgba(22,14,12,' + (.55 + v * .4) + ')'); gr.addColorStop(1, 'rgba(22,14,12,0)'); G.fillStyle = gr; G.beginPath(); G.ellipse(x, y, rr * (1 + R() * .6), rr, R() * 3, 0, 7); G.fill(); } return o; }
    G.drawImage(src, 0, 0); var im = G.getImageData(0, 0, WW, WH), d = im.data, M3 = MX[c], k = v, q = 1 - k;
    for (i = 0; i < d.length; i += 4) { var r3 = d[i], g3 = d[i + 1], b3 = d[i + 2]; d[i] = r3 * q + k * (M3[0] * r3 + M3[1] * g3 + M3[2] * b3); d[i + 1] = g3 * q + k * (M3[3] * r3 + M3[4] * g3 + M3[5] * b3); d[i + 2] = b3 * q + k * (M3[6] * r3 + M3[7] * g3 + M3[8] * b3); }
    G.putImageData(im, 0, 0); return o;
  }
  function pill(t, x, y, al, on) { g.font = '700 19px Arial'; var w = g.measureText(t).width + 28, x0 = al === 'r' ? x - w : x; g.fillStyle = on ? '#ffd400' : 'rgba(8,20,45,.8)'; g.beginPath(); if (g.roundRect) g.roundRect(x0, y - 18, w, 36, 18); else g.rect(x0, y - 18, w, 36); g.fill(); g.fillStyle = on ? '#14233b' : '#fff'; g.textBaseline = 'middle'; g.fillText(t, x0 + 14, y + 1); }
  function render() {
    wg.fillStyle = '#1b2a44'; wg.fillRect(0, 0, WW, WH);
    if (S.src === 'kamera' && camOn && vid.videoWidth) { if (facing === 'user') { wg.save(); wg.translate(WW, 0); wg.scale(-1, 1); cover(wg, vid, vid.videoWidth, vid.videoHeight, WW, WH); wg.restore(); } else cover(wg, vid, vid.videoWidth, vid.videoHeight, WW, WH); }
    else if (S.src === 'foto' && user) cover(wg, user, user.width, user.height, WW, WH);
    else if (img) cover(wg, img, img.width, img.height, WW, WH);
    var out = fx(wk), sx = S.cmp ? Math.round(S.split * W) : 0;
    g.imageSmoothingQuality = 'high'; g.drawImage(out, 0, 0, W, H);
    if (S.cmp) { g.save(); g.beginPath(); g.rect(0, 0, sx, H); g.clip(); g.drawImage(wk, 0, 0, W, H); g.restore(); g.fillStyle = '#fff'; g.fillRect(sx - 2, 0, 4, H); g.beginPath(); g.arc(sx, H / 2, 24, 0, 7); g.fillStyle = '#ffd400'; g.fill(); g.fillStyle = '#14233b'; g.beginPath(); g.moveTo(sx - 6, H / 2 - 8); g.lineTo(sx - 15, H / 2); g.lineTo(sx - 6, H / 2 + 8); g.moveTo(sx + 6, H / 2 - 8); g.lineTo(sx + 15, H / 2); g.lineTo(sx + 6, H / 2 + 8); g.fill(); pill('Sağlıklı göz', 16, 32, 'l'); }
    pill(T[S.c][0] + ' · ' + T[S.c][2](S.v), W - 16, 32, 'r', true);
    $('gvI').innerHTML = '<b>' + T[S.c][0] + ':</b> ' + T[S.c][1] + (S.cmp ? ' Ortadaki tutamacı sürükleyerek sağlıklı görüşle kıyaslayın.' : '');
  }
  var raf = 0; function draw() { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; render(); }); }
  function chips(k, a, cur) { var h = '<div class="cgt-chips">'; a.forEach(function (x) { h += '<button type="button" class="cgt-chip' + (x[0] === cur ? ' on' : '') + '" data-k="' + k + '" data-v="' + x[0] + '">' + x[1] + '</button>'; }); return h + '</div>'; }
  function panel() {
    $('gvP').innerHTML = '<div><p class="cgt-h">Görme durumu</p>' + chips('c', C, S.c) + '</div>' +
      '<div><div class="cgt-row"><span>Şiddet</span><b id="gvV1">' + T[S.c][2](S.v) + '</b></div><input type="range" data-k="v" min="0" max="1" step="0.01" value="' + S.v + '"></div>' +
      (S.c === 'ast' ? '<div><div class="cgt-row"><span>Aks</span><b id="gvV2">' + S.ax + '°</b></div><input type="range" data-k="ax" min="0" max="180" step="5" value="' + S.ax + '"></div>' : '') +
      '<div><p class="cgt-h">Sahne</p>' + chips('src', [['ornek', 'Örnek fotoğraf'], ['kamera', 'Kamera'], ['foto', 'Fotoğraf yükle']], S.src) + (S.src === 'kamera' ? '<div style="height:8px"></div><button type="button" class="cgt-btn" data-a="flip">Kamerayı çevir</button>' : '') + '</div>' +
      '<label class="cgt-tog"><input type="checkbox" data-k="cmp"' + (S.cmp ? ' checked' : '') + '>Sağlıklı görüşle kıyasla</label>' +
      '<button type="button" class="cgt-btn y" data-a="save">Görüntüyü kaydet</button>';
  }
  function stopCam() { camOn = false; if (tmr) { clearInterval(tmr); tmr = null; } if (vid.srcObject) { vid.srcObject.getTracks().forEach(function (t) { t.stop(); }); vid.srcObject = null; } }
  function startCam() { stopCam(); if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { S.src = 'ornek'; panel(); draw(); return; } navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false }).then(function (st) { vid.srcObject = st; vid.play(); camOn = true; tmr = setInterval(draw, 90); }).catch(function () { S.src = 'ornek'; panel(); draw(); $('gvI').insertAdjacentHTML('beforeend', ' <b>Kamera açılamadı;</b> tarayıcıdan kamera izni verin ya da fotoğraf yükleyin.'); }); }
  $('gvP').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var a = b.getAttribute('data-a'), k = b.getAttribute('data-k'), v = b.getAttribute('data-v');
    if (a === 'flip') { facing = facing === 'user' ? 'environment' : 'user'; startCam(); return; }
    if (a === 'save') { render(); cv.toBlob(function (bl) { if (!bl) return; var l = document.createElement('a'); l.href = URL.createObjectURL(bl); l.download = 'boyle-goruyor-' + S.c + '.png'; document.body.appendChild(l); l.click(); setTimeout(function () { URL.revokeObjectURL(l.href); l.parentNode.removeChild(l); }, 1500); }, 'image/png'); return; }
    if (!k) return; if (k === 'src') { if (v === 'foto') { $('gvF').click(); return; } S.src = v; if (v === 'kamera') startCam(); else stopCam(); } else S[k] = v;
    panel(); draw();
  });
  $('gvP').addEventListener('input', function (e) { var el = e.target, k = el.getAttribute('data-k'); if (!k) return; if (el.type === 'checkbox') S[k] = el.checked; else { S[k] = +el.value; if (k === 'v') $('gvV1').textContent = T[S.c][2](S.v); if (k === 'ax') $('gvV2').textContent = S.ax + '°'; } draw(); });
  $('gvF').addEventListener('change', function (e) { var f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return; var im = new Image(); im.onload = function () { user = im; stopCam(); S.src = 'foto'; panel(); draw(); }; im.src = URL.createObjectURL(f); });
  var drag = false; function mv(e) { var r = cv.getBoundingClientRect(); S.split = cl((e.clientX - r.left) / r.width, .04, .96); draw(); }
  cv.addEventListener('pointerdown', function (e) { if (!S.cmp) return; drag = true; try { cv.setPointerCapture(e.pointerId); } catch (x) {} mv(e); });
  cv.addEventListener('pointermove', function (e) { if (drag) { e.preventDefault(); mv(e); } });
  ['pointerup', 'pointercancel'].forEach(function (n) { cv.addEventListener(n, function () { drag = false; }); });
  var im0 = new Image(); im0.crossOrigin = 'anonymous'; im0.onload = function () { img = im0; draw(); }; im0.src = 'https://images.unsplash.com/photo-1587227172142-a0b19efd6f91?auto=format&fit=crop&w=1280&h=720&q=70';
  panel(); draw();
})();
