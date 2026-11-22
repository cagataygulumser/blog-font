/* Torik lens rotasyon alıştırması · cagataygulumser.com */
(function () {
  'use strict';
  var root = document.getElementById('cgt-torik'); if (!root || root.querySelector('canvas')) return;
  var S = { mode: 'gos', ax: 180, rot: 15, dir: 'sol', res: '' }, sc = { ok: 0, n: 0 }, W = 720, H = 520;
  function $(i) { return document.getElementById(i); }
  function norm(a) { a = ((a % 180) + 180) % 180; return a === 0 ? 180 : a; }
  function ans() { return norm(S.ax + (S.dir === 'sol' ? S.rot : -S.rot)); }
  root.innerHTML = '<p class="cgt-lead">Torik kontakt lens gözde döndüğünde reçetedeki aks nasıl telafi edilir? Lens işaretini çevirin ve “sola ekle, sağa çıkar” kuralının nasıl çalıştığını görün; alıştırma modunda kendinizi sınayın.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="trP"></div><div class="cgt-col"><div class="cgt-stage"><canvas id="trC" width="' + W + '" height="' + H + '" style="max-height:70vh;object-fit:contain;background:#0b1730"></canvas></div><div class="cgt-info" id="trI"></div></div></div>' +
    '<p class="cgt-note">Kural (LARS): lensin 6 hizasındaki işareti, karşıdan bakan kişiye göre <b>sola</b> dönmüşse dönme miktarı aksa <b>eklenir</b>, <b>sağa</b> dönmüşse <b>çıkarılır</b>. Bu sayfa eğitim amaçlıdır; kontakt lens uygulaması ve reçetesi göz hekiminin işidir.</p>';
  var cv = $('trC'), g = cv.getContext('2d');
  function draw() {
    var cx = W / 2, cy = H / 2, R = 190, i; g.fillStyle = '#0b1730'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#f4efe9'; g.beginPath(); g.ellipse(cx, cy, 300, 205, 0, 0, 7); g.fill(); g.fillStyle = '#6b4020'; g.beginPath(); g.arc(cx, cy, 120, 0, 7); g.fill(); g.fillStyle = '#05070b'; g.beginPath(); g.arc(cx, cy, 46, 0, 7); g.fill();
    g.strokeStyle = 'rgba(120,200,255,.9)'; g.lineWidth = 5; g.fillStyle = 'rgba(120,200,255,.16)'; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill(); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 2; g.setLineDash([6, 6]); g.beginPath(); g.moveTo(cx, cy + R - 46); g.lineTo(cx, cy + R + 18); g.stroke(); g.setLineDash([]);
    var a = (S.dir === 'sol' ? 1 : -1) * S.rot * Math.PI / 180; g.save(); g.translate(cx, cy); g.rotate(a); g.strokeStyle = '#ffd400'; g.lineWidth = 6; [-0.16, 0, 0.16].forEach(function (o) { g.beginPath(); g.moveTo(Math.sin(o) * (R - 40), Math.cos(o) * (R - 40)); g.lineTo(Math.sin(o) * (R - 8), Math.cos(o) * (R - 8)); g.stroke(); }); g.restore();
    g.fillStyle = '#cfe3ff'; g.font = '700 17px Arial'; g.textAlign = 'center'; g.fillText('Karşıdan bakış · işaretin olması gereken yer: saat 6', cx, 34);
    g.font = '800 22px Arial'; g.fillStyle = '#ffd400'; g.fillText(S.rot === 0 ? 'Lens dönmemiş' : S.rot + '° ' + (S.dir === 'sol' ? 'sola' : 'sağa') + ' dönmüş', cx, H - 20);
    g.fillStyle = 'rgba(255,255,255,.75)'; g.font = '700 15px Arial'; g.fillText('← sizin solunuz', 80, cy); g.fillText('sizin sağınız →', W - 80, cy);
  }
  function panel() {
    var h = '<div><p class="cgt-h">Mod</p><div class="cgt-chips"><button type="button" class="cgt-chip' + (S.mode === 'gos' ? ' on' : '') + '" data-m="gos">Gösterim</button><button type="button" class="cgt-chip' + (S.mode === 'alis' ? ' on' : '') + '" data-m="alis">Alıştırma</button></div></div>';
    if (S.mode === 'gos') h += '<div><div class="cgt-row"><span>Reçetedeki aks</span><b id="trV1">' + S.ax + '°</b></div><input type="range" data-k="ax" min="5" max="180" step="5" value="' + S.ax + '"><div style="height:10px"></div><div class="cgt-row"><span>Dönme miktarı</span><b id="trV2">' + S.rot + '°</b></div><input type="range" data-k="rot" min="0" max="40" step="5" value="' + S.rot + '"><div style="height:10px"></div><div class="cgt-chips"><button type="button" class="cgt-chip' + (S.dir === 'sol' ? ' on' : '') + '" data-d="sol">Sola dönmüş</button><button type="button" class="cgt-chip' + (S.dir === 'sag' ? ' on' : '') + '" data-d="sag">Sağa dönmüş</button></div></div>';
    else h += '<div><p class="cgt-h">Soru</p><div style="font-size:14.5px;line-height:1.7">Reçetedeki aks: <b>' + S.ax + '°</b><br>Lens işareti şekildeki gibi durdu.<br>Sipariş edilecek aks kaç derece?</div><div style="height:8px"></div><input type="text" inputmode="numeric" id="trA" placeholder="Aks (derece)" aria-label="Sipariş aksı"><div style="height:8px"></div><div class="cgt-chips"><button type="button" class="cgt-btn y" data-a="chk">Kontrol et</button><button type="button" class="cgt-btn" data-a="new">Yeni soru</button></div><div style="height:10px"></div><div style="font-size:20px;font-weight:800;color:#004aad">' + sc.ok + ' / ' + sc.n + '</div></div>';
    $('trP').innerHTML = h;
  }
  function info() { $('trI').innerHTML = S.mode === 'gos' ? '<b>Telafi:</b> Reçetedeki aks <b>' + S.ax + '°</b>. Lens ' + (S.rot === 0 ? 'dönmediği için aks değişmez.' : '<b>' + S.rot + '° ' + (S.dir === 'sol' ? 'sola' : 'sağa') + '</b> döndü; kurala göre dönme miktarı ' + (S.dir === 'sol' ? 'eklenir: ' + S.ax + ' + ' + S.rot : 'çıkarılır: ' + S.ax + ' − ' + S.rot) + ' = <b>' + ans() + '°</b>. Bu aksla sipariş edilen lens gözde aynı miktarda döndüğünde silindir doğru meridyene oturur.') + ' Sonuç 180’i aşarsa 180 çıkarılır, sıfırın altına inerse 180 eklenir.' : '<b>Alıştırma:</b> Şekildeki dönmeyi okuyun (her işaret aralığı tahmini değil, alttaki yazıda derece verilir) ve sipariş aksını yazın. ' + S.res; }
  function rnd() { S.ax = 5 * (1 + Math.floor(Math.random() * 36)); S.rot = 5 * (1 + Math.floor(Math.random() * 6)); S.dir = Math.random() < .5 ? 'sol' : 'sag'; S.res = ''; }
  $('trP').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var m = b.getAttribute('data-m'), d = b.getAttribute('data-d'), a = b.getAttribute('data-a'); if (m) { S.mode = m; if (m === 'alis') rnd(); else S.res = ''; } else if (d) S.dir = d; else if (a === 'new') rnd(); else if (a === 'chk') { var v = parseFloat($('trA').value); if (isNaN(v)) S.res = '<b>Önce bir değer yazın.</b>'; else { sc.n++; if (norm(v) === ans()) { sc.ok++; S.res = '<b style="color:#0a7a3d">Doğru: ' + ans() + '°.</b>'; } else S.res = '<b style="color:#b3261e">Tutmadı.</b> ' + (S.dir === 'sol' ? 'Sola dönmüş: eklenir. ' + S.ax + ' + ' + S.rot : 'Sağa dönmüş: çıkarılır. ' + S.ax + ' − ' + S.rot) + ' = <b>' + ans() + '°</b>.'; } } panel(); draw(); info(); });
  $('trP').addEventListener('input', function (e) { var k = e.target.getAttribute('data-k'); if (!k) return; S[k] = +e.target.value; $('trV1').textContent = S.ax + '°'; $('trV2').textContent = S.rot + '°'; draw(); info(); });
  panel(); draw(); info();
})();
