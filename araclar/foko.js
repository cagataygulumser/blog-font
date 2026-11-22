/* Fokometre (lensmetre) simülatörü · cagataygulumser.com */
(function () {
  'use strict';
  var root = document.getElementById('cgt-foko'); if (!root || root.querySelector('canvas')) return;
  var W = 720, H = 720, TS = 420;
  var S = { mode: 'ser', s: -2, c: -1, ax: 30, d: 0, w: 90, hint: true, res: '' };
  function $(i) { return document.getElementById(i); }
  function f2(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2).replace('.', ','); }
  function cl(x, a, b) { return x < a ? a : x > b ? b : x; }
  function mk(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  root.innerHTML = '<p class="cgt-lead">Sanal fokometrede camın numarasını okuyun: güç tamburunu ve aks çarkını çevirerek çizgileri netleyin. Alıştırma modunda rastgele bir cam gelir, okuduğunuz değeri yazıp kontrol edin.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="fkP"></div><div class="cgt-col"><div class="cgt-stage"><canvas id="fkC" width="' + W + '" height="' + H + '" style="max-height:78vh;object-fit:contain;background:#0b1730"></canvas></div><div class="cgt-info" id="fkI"></div></div></div>' +
    '<p class="cgt-note">Çapraz çizgili hedefe sahip el fokometresi esas alınmıştır: tek çizgi küre, üçlü çizgiler silindir çizgisidir ve okuma eksi silindir yöntemiyle yapılır. Gösterim eğitim amaçlıdır; cihazınızın hedef tipi ve okuma yönergesi farklı olabilir.</p>';
  var cv = $('fkC'), g = cv.getContext('2d');
  function target() {
    var c = mk(TS, TS), G = c.getContext('2d'), m = TS / 2, a = S.w * Math.PI / 180, i;
    G.fillStyle = '#000'; G.fillRect(0, 0, TS, TS); G.translate(m, m); G.rotate(-a); G.strokeStyle = '#7dffb0'; G.lineCap = 'butt';
    G.lineWidth = 3; for (i = -1; i <= 1; i++) { G.beginPath(); G.moveTo(-150, i * 13); G.lineTo(-22, i * 13); G.moveTo(22, i * 13); G.lineTo(150, i * 13); G.stroke(); }
    G.lineWidth = 2.2; G.beginPath(); G.moveTo(0, -150); G.lineTo(0, -22); G.moveTo(0, 22); G.lineTo(0, 150); G.stroke();
    G.beginPath(); G.arc(0, 0, 5, 0, 7); G.fillStyle = '#7dffb0'; G.fill(); return c;
  }
  function dirBlur(src, len, ang) { if (len < 1) return src; var o = mk(TS, TS), G = o.getContext('2d'), n = Math.max(12, Math.round(len * 1.2)), dx = Math.cos(ang), dy = -Math.sin(ang); G.globalCompositeOperation = 'lighter'; G.globalAlpha = 1 / n; for (var i = 0; i < n; i++) { var t = (i / (n - 1) - .5) * len; G.drawImage(src, dx * t, dy * t); } return o; }
  function render() {
    var al = S.ax * Math.PI / 180, e1 = Math.abs(S.d - S.s), e2 = Math.abs(S.d - S.s - S.c), k = 15, t = target();
    t = dirBlur(t, cl(e1 * k, 0, 150), al); t = dirBlur(t, cl(e2 * k, 0, 150), al + Math.PI / 2);
    g.fillStyle = '#0b1730'; g.fillRect(0, 0, W, H); var cx = W / 2, cy = H / 2, R = 300, i;
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.clip(); g.fillStyle = '#020403'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'lighter'; g.drawImage(t, cx - TS * .7, cy - TS * .7, TS * 1.4, TS * 1.4); g.globalCompositeOperation = 'source-over';
    g.strokeStyle = 'rgba(255,255,255,.28)'; g.lineWidth = 1.2; for (i = 1; i <= 4; i++) { g.beginPath(); g.arc(cx, cy, i * 52, 0, 7); g.stroke(); }
    g.beginPath(); g.moveTo(cx - R, cy); g.lineTo(cx + R, cy); g.moveTo(cx, cy - R); g.lineTo(cx, cy + R); g.stroke(); g.restore();
    g.strokeStyle = '#3b4c6b'; g.lineWidth = 16; g.beginPath(); g.arc(cx, cy, R + 8, 0, 7); g.stroke();
    g.fillStyle = '#cfd9ea'; g.font = '600 15px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (i = 0; i < 360; i += 5) { var a = i * Math.PI / 180, r1 = R + 16, r2 = R + (i % 30 === 0 ? 30 : 23); g.strokeStyle = '#cfd9ea'; g.lineWidth = i % 30 === 0 ? 2 : 1; g.beginPath(); g.moveTo(cx + Math.cos(a) * r1, cy - Math.sin(a) * r1); g.lineTo(cx + Math.cos(a) * r2, cy - Math.sin(a) * r2); g.stroke(); if (i % 30 === 0 && i <= 180) g.fillText(String(i), cx + Math.cos(a) * (R + 44), cy - Math.sin(a) * (R + 44)); }
    var wa = S.w * Math.PI / 180; g.fillStyle = '#ffd400'; g.beginPath(); g.arc(cx + Math.cos(wa) * (R + 8), cy - Math.sin(wa) * (R + 8), 7, 0, 7); g.fill();
    g.textAlign = 'left'; g.font = '700 16px Arial'; g.fillStyle = '#9fb2d1'; g.fillText('GÜÇ TAMBURU', 22, 30); g.fillText('AKS ÇARKI', W - 150, 30); g.font = '800 30px Arial'; g.fillStyle = '#ffd400'; g.fillText(f2(S.d) + ' D', 22, 62); g.fillText(S.w + '°', W - 150, 62);
    var sh1 = e1 < .07, sh2 = e2 < .07, alg = Math.min(Math.abs(((S.w - S.ax) % 180 + 180) % 180), 180 - Math.abs(((S.w - S.ax) % 180 + 180) % 180)) <= 2 || Math.abs(S.c) < .01, msg;
    if (S.mode === 'ser') msg = '<b>Cam: ' + f2(S.s) + ' / ' + f2(S.c) + ' × ' + S.ax + '°.</b> ' + (sh1 && alg ? 'Tek çizgi net: tamburdaki değer küredir (' + f2(S.s) + ' D). ' + (Math.abs(S.c) > .01 ? 'Şimdi tamburu eksi yöne çevirip üçlü çizgileri netleyin.' : 'Çizgilerin hepsi aynı anda net: bu camda silindir yok.') : sh2 && alg ? 'Üçlü çizgiler net: tambur ' + f2(S.s + S.c) + ' D gösteriyor. İki okuma arasındaki fark silindirdir (' + f2(S.c) + ' D), aks çarkındaki değer akstır.' : !alg && (e1 < .6 || e2 < .6) ? 'Çizgiler kırık ya da çift görünüyor: aks çarkını çevirerek çizgileri düzgün hale getirin.' : 'Tamburu artı taraftan başlayarak çevirin ve önce tek (ince) çizgiyi netleyin.');
    else msg = '<b>Alıştırma:</b> Bu camın değerleri gizli. Önce tek çizgiyi, sonra üçlü çizgileri netleyip küre, silindir ve aksı soldaki kutulara yazın. ' + S.res;
    if (S.hint) msg += '<br><br><b>Okuma sırası:</b> 1) Tamburu artı taraftan çevirip tek çizgiyi netleyin; çizgi kırıksa aks çarkını çevirin. Tamburdaki değer <b>küre</b>dir. 2) Tamburu eksi yöne çevirip üçlü çizgileri netleyin. İki okuma arasındaki fark <b>silindir</b>dir (eksi işaretli). 3) Aks çarkındaki değer <b>aks</b>tır.';
    $('fkI').innerHTML = msg;
  }
  function row(k, lab, mn, mx, st, val, txt) { return '<div><div class="cgt-row"><span>' + lab + '</span><b id="fkV_' + k + '">' + txt + '</b></div><input type="range" data-k="' + k + '" min="' + mn + '" max="' + mx + '" step="' + st + '" value="' + val + '"></div>'; }
  function nud(k, a) { return '<div class="cgt-chips">' + a.map(function (x) { return '<button type="button" class="cgt-chip" data-n="' + k + '" data-v="' + x + '">' + (x > 0 ? '+' : '−') + String(Math.abs(x)).replace('.', ',') + '</button>'; }).join('') + '</div>'; }
  function panel() {
    var h = '<div><p class="cgt-h">Mod</p><div class="cgt-chips"><button type="button" class="cgt-chip' + (S.mode === 'ser' ? ' on' : '') + '" data-m="ser">Serbest</button><button type="button" class="cgt-chip' + (S.mode === 'alis' ? ' on' : '') + '" data-m="alis">Alıştırma</button></div></div>';
    h += '<div><p class="cgt-h">Güç tamburu</p>' + row('d', 'Tambur', -20, 20, 0.125, S.d, f2(S.d) + ' D') + '<div style="height:8px"></div>' + nud('d', [-1, -0.125, 0.125, 1]) + '</div>';
    h += '<div><p class="cgt-h">Aks çarkı</p>' + row('w', 'Aks', 0, 180, 1, S.w, S.w + '°') + '<div style="height:8px"></div>' + nud('w', [-5, -1, 1, 5]) + '</div>';
    if (S.mode === 'ser') h += '<div><p class="cgt-h">Takılan cam</p>' + row('s', 'Küre', -12, 10, 0.25, S.s, f2(S.s) + ' D') + '<div style="height:8px"></div>' + row('c', 'Silindir', -6, 0, 0.25, S.c, f2(S.c) + ' D') + '<div style="height:8px"></div>' + row('ax', 'Aks', 0, 180, 5, S.ax, S.ax + '°') + '</div>';
    else h += '<div><p class="cgt-h">Okumanız</p><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px"><input type="text" inputmode="decimal" id="fkA1" placeholder="Küre" aria-label="Küre"><input type="text" inputmode="decimal" id="fkA2" placeholder="Silindir" aria-label="Silindir"><input type="text" inputmode="numeric" id="fkA3" placeholder="Aks" aria-label="Aks"></div><div style="height:8px"></div><div class="cgt-chips"><button type="button" class="cgt-btn y" data-a="chk">Kontrol et</button><button type="button" class="cgt-btn" data-a="new">Yeni cam</button><button type="button" class="cgt-btn" data-a="show">Cevabı göster</button></div></div>';
    h += '<label class="cgt-tog"><input type="checkbox" data-k="hint"' + (S.hint ? ' checked' : '') + '>Okuma sırasını göster</label>';
    $('fkP').innerHTML = h;
  }
  function rnd() { S.s = Math.round((Math.random() * 14 - 8) * 4) / 4; S.c = Math.random() < .2 ? 0 : -Math.round((0.5 + Math.random() * 2.5) * 4) / 4; S.ax = S.c ? 5 * Math.round(1 + Math.random() * 35) : 180; S.d = Math.min(20, Math.round(S.s + 3)); S.w = 90; S.res = ''; }
  function num(v) { return parseFloat(String(v).replace(',', '.').replace('−', '-')); }
  function check() {
    var a = num($('fkA1').value), b = num($('fkA2').value), c = num($('fkA3').value); if (isNaN(a)) { S.res = '<b>Önce okuduğunuz küre değerini yazın.</b>'; return; } if (isNaN(b)) b = 0; if (isNaN(c)) c = S.ax;
    function ok(s, cy, ax) { var da = Math.abs(((c - ax) % 180 + 180) % 180); da = Math.min(da, 180 - da); return Math.abs(a - s) <= .13 && Math.abs(b - cy) <= .13 && (Math.abs(cy) < .01 || da <= 5); }
    var good = ok(S.s, S.c, S.ax) || ok(S.s + S.c, -S.c, (S.ax + 90) % 180);
    S.res = good ? '<b style="color:#0a7a3d">Doğru.</b> Cam: ' + f2(S.s) + ' / ' + f2(S.c) + ' × ' + S.ax + '°. “Yeni cam” ile devam edin.' : '<b style="color:#b3261e">Tutmadı.</b> Çizgilerin tam net olduğu iki tambur değerini yeniden okuyun; silindir, ikinci okumadan birinciyi çıkarınca bulunur.';
  }
  $('fkP').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var m = b.getAttribute('data-m'), n = b.getAttribute('data-n'), a = b.getAttribute('data-a');
    if (m) { S.mode = m; if (m === 'alis') rnd(); else S.res = ''; panel(); }
    else if (n) { var v = +b.getAttribute('data-v'); if (n === 'd') S.d = cl(Math.round((S.d + v) * 8) / 8, -20, 20); else S.w = ((S.w + v) % 181 + 181) % 181; var i = root.querySelector('[data-k=' + n + ']'); if (i) i.value = S[n]; $('fkV_' + n).textContent = n === 'd' ? f2(S.d) + ' D' : S.w + '°'; }
    else if (a === 'new') { rnd(); panel(); } else if (a === 'chk') check(); else if (a === 'show') S.res = 'Cevap: <b>' + f2(S.s) + ' / ' + f2(S.c) + ' × ' + S.ax + '°</b>.';
    render();
  });
  $('fkP').addEventListener('input', function (e) { var el = e.target, k = el.getAttribute('data-k'); if (!k) return; if (el.type === 'checkbox') S[k] = el.checked; else { S[k] = +el.value; var o = $('fkV_' + k); if (o) o.textContent = (k === 'w' || k === 'ax') ? S[k] + '°' : f2(S[k]) + ' D'; } render(); });
  panel(); render();
})();
