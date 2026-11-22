/* Atölye Simülatörü — merkezleme ve ham cam çapı alıştırması · cagataygulumser.com */
(function () {
  'use strict';
  var root = document.getElementById('cgt-atolye'); if (!root || root.querySelector('canvas')) return;
  var J = null, sc = { ok: 0, n: 0 }, res = null, W = 900, H = 470;
  function $(i) { return document.getElementById(i); }
  function f1(v) { return v.toFixed(1).replace('.', ',').replace('-', '−'); }
  function num(v) { return parseFloat(String(v).replace(',', '.').replace('−', '-')); }
  function job() { var A = 46 + 2 * Math.floor(Math.random() * 6), B = Math.round(A * (0.62 + Math.random() * 0.3)), D = 15 + Math.floor(Math.random() * 6), pd = 28 + Math.floor(Math.random() * 13) * .5, h = Math.round(B / 2 + (Math.random() * 7 - 1)), s = Math.round((Math.random() * 12 - 7) * 4) / 4 || -2; J = { A: A, B: B, D: D, pd: pd, h: h, s: s, ED: A + 1 + Math.floor(Math.random() * 3) }; J.dx = (A + D) / 2 - pd; J.dy = h - B / 2; J.min = J.ED + 2 * Math.sqrt(J.dx * J.dx + J.dy * J.dy) + 2; res = null; }
  root.innerHTML = '<p class="cgt-lead">Montaj öncesi hesabı çalışın: verilen çerçeve ve ölçülere göre optik merkezin ne kadar ve hangi yöne kaydırılacağını, gereken en küçük ham cam çapını bulun. Her soruda yeni bir iş emri gelir.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="atP"></div><div class="cgt-col"><div class="cgt-stage"><canvas id="atC" width="' + W + '" height="' + H + '" style="background:#0b1730"></canvas></div><div class="cgt-info" id="atI"></div></div></div>' +
    '<p class="cgt-note">Hesap kutu (boxing) sistemine göredir. Yatay desantrasyon = (A + köprü) / 2 − tek göz PD. Dikey desantrasyon = montaj yüksekliği − B / 2. En küçük ham cam çapı = etkin çap + 2 × toplam desantrasyon + 2 mm işleme payı. Alıştırma eğitim amaçlıdır; atölyenizin payı ve yöntemi farklı olabilir.</p>';
  var cv = $('atC'), g = cv.getContext('2d');
  function draw() {
    g.fillStyle = '#0b1730'; g.fillRect(0, 0, W, H); var k = Math.min(5.2, 300 / J.B, 520 / J.A), cx = W / 2, cy = H / 2 + 6, a = J.A * k / 2, b = J.B * k / 2, i;
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.setLineDash([7, 6]); g.lineWidth = 1.5; g.strokeRect(cx - a, cy - b, 2 * a, 2 * b); g.beginPath(); g.moveTo(cx - a - 20, cy); g.lineTo(cx + a + 20, cy); g.moveTo(cx, cy - b - 20); g.lineTo(cx, cy + b + 20); g.stroke(); g.setLineDash([]);
    g.strokeStyle = '#9fd0ff'; g.lineWidth = 5; g.fillStyle = 'rgba(120,190,255,.18)'; g.beginPath(); for (i = 0; i <= 72; i++) { var t = i / 72 * Math.PI * 2, c = Math.cos(t), s = Math.sin(t), e = 2 / 3, x = cx + a * (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), e), y = cy + b * (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), e); if (i) g.lineTo(x, y); else g.moveTo(x, y); } g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#cfe3ff'; g.font = '700 17px Arial'; g.textAlign = 'center'; g.fillText('A = ' + J.A + ' mm', cx, cy - b - 28); g.save(); g.translate(cx + a + 34, cy); g.rotate(Math.PI / 2); g.fillText('B = ' + J.B + ' mm', 0, 0); g.restore(); g.fillText('SAĞ CAM · önden bakış', cx, H - 16); g.textAlign = 'left'; g.fillText('burun tarafı →', cx + a - 110, cy + b + 26); g.fillStyle = '#fff'; g.beginPath(); g.arc(cx, cy, 5, 0, 7); g.fill(); g.font = '600 14px Arial'; g.fillText('geometrik merkez', cx + 10, cy - 10);
    if (res) { var ox = cx + J.dx * k, oy = cy - J.dy * k; g.strokeStyle = '#ffd400'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy); g.lineTo(ox, oy); g.stroke(); g.fillStyle = '#ffd400'; g.beginPath(); g.arc(ox, oy, 8, 0, 7); g.fill(); g.font = '700 15px Arial'; g.fillText('optik merkez', ox + 12, oy + 5); g.strokeStyle = 'rgba(255,212,0,.6)'; g.setLineDash([8, 6]); g.beginPath(); g.arc(ox, oy, J.min * k / 2, 0, 7); g.stroke(); g.setLineDash([]); }
  }
  function panel() {
    var h = '<div><p class="cgt-h">İş emri</p><div style="font-size:14.5px;line-height:1.8">Cam: <b>' + (J.s > 0 ? '+' : '−') + Math.abs(J.s).toFixed(2).replace('.', ',') + ' D</b><br>Çerçeve: <b>' + J.A + ' □ ' + J.D + '</b> · B <b>' + J.B + ' mm</b><br>Etkin çap (ED): <b>' + J.ED + ' mm</b><br>Sağ göz PD: <b>' + f1(J.pd) + ' mm</b><br>Montaj yüksekliği: <b>' + J.h + ' mm</b></div></div>';
    h += '<div><p class="cgt-h">Cevabınız</p><div style="display:grid;gap:8px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px"><input type="text" inputmode="decimal" id="at1" placeholder="Yatay (mm)" aria-label="Yatay desantrasyon"><select id="at1d" aria-label="Yatay yön"><option value="ic">içe (nazal)</option><option value="dis">dışa (temporal)</option></select></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px"><input type="text" inputmode="decimal" id="at2" placeholder="Dikey (mm)" aria-label="Dikey desantrasyon"><select id="at2d" aria-label="Dikey yön"><option value="yu">yukarı</option><option value="as">aşağı</option></select></div><input type="text" inputmode="decimal" id="at3" placeholder="En küçük ham cam çapı (mm)" aria-label="En küçük ham cam çapı"></div><div style="height:8px"></div><div class="cgt-chips"><button type="button" class="cgt-btn y" data-a="chk">Kontrol et</button><button type="button" class="cgt-btn" data-a="new">Yeni iş emri</button></div></div>';
    h += '<div><p class="cgt-h">Skor</p><div style="font-size:22px;font-weight:800;color:#004aad">' + sc.ok + ' / ' + sc.n + '</div></div>'; $('atP').innerHTML = h;
  }
  function info() { $('atI').innerHTML = res ? res : '<b>Soru:</b> Sağ camda optik merkez geometrik merkeze göre yatayda ve dikeyde kaç milimetre, hangi yöne kaydırılmalı? Bu iş için gereken en küçük ham cam çapı kaç milimetre? Sıfır kayma için 0 yazın.'; }
  function check() {
    var a = num($('at1').value), b = num($('at2').value), c = num($('at3').value); if (isNaN(a) || isNaN(b) || isNaN(c)) { res = '<b>Üç kutuyu da doldurun.</b>'; info(); return; }
    var sa = $('at1d').value === 'ic' ? a : -a, sb = $('at2d').value === 'yu' ? b : -b, o1 = Math.abs(sa - J.dx) <= .26, o2 = Math.abs(sb - J.dy) <= .26, o3 = Math.abs(c - J.min) <= 1.2, all = o1 && o2 && o3; sc.n++; if (all) sc.ok++;
    function t(ok) { return ok ? '<b style="color:#0a7a3d">doğru</b>' : '<b style="color:#b3261e">yanlış</b>'; }
    res = (all ? '<b style="color:#0a7a3d">Hepsi doğru.</b> ' : '') + 'Yatay: ' + t(o1) + ' → (' + J.A + ' + ' + J.D + ') / 2 − ' + f1(J.pd) + ' = <b>' + f1(Math.abs(J.dx)) + ' mm ' + (J.dx > 0 ? 'içe' : J.dx < 0 ? 'dışa' : '') + '</b>. Dikey: ' + t(o2) + ' → ' + J.h + ' − ' + J.B + ' / 2 = <b>' + f1(Math.abs(J.dy)) + ' mm ' + (J.dy > 0 ? 'yukarı' : J.dy < 0 ? 'aşağı' : '') + '</b>. Ham cam: ' + t(o3) + ' → ' + J.ED + ' + 2 × ' + f1(Math.sqrt(J.dx * J.dx + J.dy * J.dy)) + ' + 2 = <b>' + f1(J.min) + ' mm</b>; bir üst standart çap seçilir. Kesikli sarı daire bu çapı gösterir.';
    panel(); draw(); info();
  }
  $('atP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; if (b.getAttribute('data-a') === 'new') { job(); panel(); draw(); info(); } else check(); });
  window.CGATOLYE = { job: function () { return J; } };
  job(); panel(); draw(); info();
})();
