/* Ekran Mesafesi Ölçer · cagataygulumser.com */
(function () {
  'use strict';
  var root = document.getElementById('cgt-mesafe'); if (!root || root.querySelector('canvas')) return;
  var cs = document.currentScript, BASE = cs && cs.src ? cs.src.replace(/[^\/]*$/, '') : '';
  var MODES = { tel: ['Telefon / tablet', 30, 35, 'Telefon ve tablet için en az 30–35 cm önerilir.'], pc: ['Bilgisayar', 45, 50, 'Bilgisayar ekranı için 50–70 cm (bir kol boyu) önerilir.'], kit: ['Kitap / defter', 28, 33, 'Okuma ve yazma için 33–40 cm (dirsek-yumruk mesafesi) önerilir.'] };
  var S = { mode: 'tel', snd: true, fr: 0.87, run: false }, lm = null, vid, cv, g, tmr = null, hist = [], st = { n: 0, sum: 0, min: 1e9, near: 0, t0: 0, last: 0, nearT: 0 }, ac = null, lastBeep = 0, cur = null, msg = '';
  try { var f0 = +localStorage.getItem('cgMesafeFr'); if (f0 > .3 && f0 < 3) S.fr = f0; } catch (x) {}
  function $(i) { return document.getElementById(i); }
  root.innerHTML = '<p class="cgt-lead">Ekrana kaç santimetreden bakıyorsunuz? Kamera yüzünüzü görür, mesafeyi canlı ölçer ve fazla yaklaştığınızda uyarır. Çocukların ekran ve kitap mesafesini izlemek için kullanabilirsiniz.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="msP"></div><div class="cgt-col"><div class="cgt-stage"><canvas id="msC" width="960" height="540"></canvas></div><div class="cgt-info" id="msI"></div></div></div>' +
    '<p class="cgt-note">Ölçüm, göz bebeği çevresindeki renkli halkanın (iris) ortalama çapından hesaplanır ve yaklaşık ±3–5 cm sapabilir; kalibrasyon sonucu iyileştirir. Görüntünüz cihazınızdan çıkmaz, kaydedilmez. Bu araç bilgilendirme amaçlıdır, muayenenin yerini tutmaz.</p><video id="msV" playsinline muted style="display:none"></video>';
  vid = $('msV'); cv = $('msC'); g = cv.getContext('2d');
  function panel() {
    var h = '<div><p class="cgt-h">Ne için ölçüyorsunuz?</p><div class="cgt-chips">' + Object.keys(MODES).map(function (k) { return '<button type="button" class="cgt-chip' + (S.mode === k ? ' on' : '') + '" data-m="' + k + '">' + MODES[k][0] + '</button>'; }).join('') + '</div></div>';
    h += '<button type="button" class="cgt-btn ' + (S.run ? '' : 'b') + '" data-a="run">' + (S.run ? 'Ölçümü durdur' : 'Kamerayı aç ve ölç') + '</button>';
    h += '<label class="cgt-tog"><input type="checkbox" data-k="snd"' + (S.snd ? ' checked' : '') + '>Çok yaklaşınca sesle uyar</label>';
    h += '<div><p class="cgt-h">Kalibrasyon (isteğe bağlı)</p><div style="font-size:13px;color:#5b6b82;margin-bottom:8px">Yüzünüzü ekrandan bir cetvelle ölçtüğünüz mesafede tutun, değeri yazıp düğmeye basın.</div><div style="display:grid;grid-template-columns:1fr auto;gap:6px"><input type="number" id="msK" min="15" max="120" value="40" aria-label="Gerçek mesafe (cm)"><button type="button" class="cgt-btn" data-a="cal">Kalibre et</button></div></div>';
    h += '<div><p class="cgt-h">Bu oturum</p><div id="msS" style="font-size:13.5px;line-height:1.7"></div><div style="height:6px"></div><button type="button" class="cgt-btn" data-a="rst">Sıfırla</button></div>';
    $('msP').innerHTML = h; stats();
  }
  function stats() { var e = $('msS'); if (!e) return; e.innerHTML = st.n ? 'Ortalama mesafe: <b>' + Math.round(st.sum / st.n) + ' cm</b><br>En yakın: <b>' + Math.round(st.min) + ' cm</b><br>Çok yakın geçen süre: <b>' + Math.round(st.near) + ' sn</b> / ' + Math.round((st.last - st.t0) / 1000) + ' sn' : 'Henüz ölçüm yok.'; }
  function beep() { if (!S.snd) return; var now = Date.now(); if (now - lastBeep < 5000) return; lastBeep = now; try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); var o = ac.createOscillator(), ga = ac.createGain(); o.frequency.value = 660; ga.gain.value = .12; o.connect(ga); ga.connect(ac.destination); o.start(); o.stop(ac.currentTime + .22); if (navigator.vibrate) navigator.vibrate(120); } catch (x) {} }
  function draw() {
    var W = cv.width, H = cv.height, M = MODES[S.mode]; g.fillStyle = '#0b1730'; g.fillRect(0, 0, W, H);
    if (S.run && vid.videoWidth) { var k = Math.max(W / vid.videoWidth, H / vid.videoHeight), w = vid.videoWidth * k, h = vid.videoHeight * k; g.save(); g.translate(W, 0); g.scale(-1, 1); g.drawImage(vid, (W - w) / 2, (H - h) / 2, w, h); g.restore(); g.fillStyle = 'rgba(8,20,45,.35)'; g.fillRect(0, 0, W, H); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    if (!S.run) { g.fillStyle = '#cfe3ff'; g.font = '700 30px Arial'; g.fillText(msg || 'Ölçmek için “Kamerayı aç ve ölç” düğmesine basın', W / 2, H / 2); return; }
    if (cur == null) { g.fillStyle = '#fff'; g.font = '700 30px Arial'; g.fillText(msg || 'Yüz aranıyor… Ekrana doğru bakın', W / 2, H / 2); return; }
    var col = cur < M[1] ? '#ff5a4d' : cur < M[2] ? '#ffd400' : '#3ddc84', lab = cur < M[1] ? 'ÇOK YAKIN' : cur < M[2] ? 'SINIRDA' : 'UYGUN';
    g.fillStyle = 'rgba(8,20,45,.78)'; g.beginPath(); if (g.roundRect) g.roundRect(W / 2 - 210, H / 2 - 120, 420, 240, 28); else g.rect(W / 2 - 210, H / 2 - 120, 420, 240); g.fill();
    g.fillStyle = col; g.font = '800 130px Arial'; g.fillText(String(Math.round(cur)), W / 2 - 34, H / 2 - 16); g.font = '700 44px Arial'; g.fillText('cm', W / 2 + 34 + g.measureText(String(Math.round(cur))).width * 1.05, H / 2 + 8); g.font = '800 30px Arial'; g.fillText(lab, W / 2, H / 2 + 78);
    var bx = 80, bw = W - 160, by = H - 46, mx = 90; g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(bx, by, bw, 12); g.fillStyle = '#ff5a4d'; g.fillRect(bx, by, bw * M[1] / mx, 12); g.fillStyle = '#ffd400'; g.fillRect(bx + bw * M[1] / mx, by, bw * (M[2] - M[1]) / mx, 12); g.fillStyle = '#3ddc84'; g.fillRect(bx + bw * M[2] / mx, by, bw * (mx - M[2]) / mx, 12);
    var px = bx + bw * Math.min(1, cur / mx); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(px, by - 4); g.lineTo(px - 10, by - 20); g.lineTo(px + 10, by - 20); g.closePath(); g.fill();
  }
  function info() { var M = MODES[S.mode]; $('msI').innerHTML = '<b>' + M[0] + ':</b> ' + M[3] + ' Ekrana ya da kitaba uzun süre çok yakından bakmak gözü yorar; çocuklarda yakın mesafede geçen süre miyopi riskiyle ilişkilendirilir. 20 dakikada bir 20 saniye uzağa bakmak ve gün ışığında vakit geçirmek önerilir.' + (cur != null && S.run ? '' : ' Kamera izni yalnızca ölçüm için istenir.'); }
  function tick() {
    if (!S.run || !lm || !vid.videoWidth) return; var r; try { r = lm.detectForVideo(vid, performance.now()); } catch (x) { return; }
    var now = Date.now(), f = r && r.faceLandmarks && r.faceLandmarks[0];
    if (f && f.length > 477) {
      var vw = vid.videoWidth, vh = vid.videoHeight; function d(a, b) { var dx = (f[a].x - f[b].x) * vw, dy = (f[a].y - f[b].y) * vh; return Math.sqrt(dx * dx + dy * dy); }
      var ir = (d(469, 471) + d(470, 472) + d(474, 476) + d(475, 477)) / 4; st.ir = ir; var mm = S.fr * vw * 11.7 / ir; hist.push(mm / 10); if (hist.length > 6) hist.shift(); cur = hist.reduce(function (a, b) { return a + b; }, 0) / hist.length; msg = '';
      if (!st.t0) st.t0 = now; var dt = st.last ? Math.min(1, (now - st.last) / 1000) : 0; st.last = now; st.n++; st.sum += cur; st.min = Math.min(st.min, cur);
      if (cur < MODES[S.mode][1]) { st.near += dt; st.nearT += dt; if (st.nearT > 3) beep(); } else st.nearT = 0;
    } else { cur = null; hist = []; st.nearT = 0; }
    draw(); if (st.n % 8 === 0) stats();
  }
  function stop() { S.run = false; if (tmr) { clearInterval(tmr); tmr = null; } if (vid.srcObject) { vid.srcObject.getTracks().forEach(function (t) { t.stop(); }); vid.srcObject = null; } cur = null; panel(); draw(); info(); }
  function start() {
    S.run = true; msg = 'Ölçüm modeli yükleniyor…'; panel(); draw();
    function go() { window.CGYUZ.load().then(function (m) { lm = m; return navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false }); }).then(function (s) { if (!S.run) { s.getTracks().forEach(function (t) { t.stop(); }); return; } vid.srcObject = s; vid.play(); msg = ''; tmr = setInterval(tick, 130); info(); }).catch(function (e) { S.run = false; msg = e && /Permission|NotAllowed|denied/i.test(String(e.name || e)) ? 'Kamera izni verilmedi' : 'Ölçüm başlatılamadı; bağlantınızı ve kamera iznini kontrol edin'; panel(); draw(); }); }
    if (window.CGYUZ) go(); else { var s = document.createElement('script'); s.src = BASE + 'yuz.js'; s.onload = go; s.onerror = function () { S.run = false; msg = 'Ölçüm modeli yüklenemedi'; panel(); draw(); }; document.head.appendChild(s); }
  }
  $('msP').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var m = b.getAttribute('data-m'), a = b.getAttribute('data-a');
    if (m) { S.mode = m; panel(); info(); draw(); }
    else if (a === 'run') { if (S.run) stop(); else start(); }
    else if (a === 'rst') { st = { n: 0, sum: 0, min: 1e9, near: 0, t0: 0, last: 0, nearT: 0 }; stats(); }
    else if (a === 'cal') { var v = +$('msK').value; if (S.run && st.ir && v >= 15 && v <= 120 && vid.videoWidth) { S.fr = v * 10 * st.ir / 11.7 / vid.videoWidth; try { localStorage.setItem('cgMesafeFr', String(S.fr)); } catch (x) {} hist = []; b.textContent = 'Kalibre edildi'; } else b.textContent = 'Önce ölçümü başlatın'; }
  });
  $('msP').addEventListener('input', function (e) { var k = e.target.getAttribute('data-k'); if (k && e.target.type === 'checkbox') S[k] = e.target.checked; });
  window.CGMESAFE = { state: function () { return { cur: cur, n: st.n, ir: st.ir }; } };
  panel(); draw(); info();
})();
