/* Fundus çizim şablonu · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-cizim'); if (!K || !root || root.querySelector('canvas')) return;
  var R = [['#d62828', 'Kırmızı', 'yatışık retina, arterler, retina kanaması, yırtığın içi'], ['#1d5fd6', 'Mavi', 'dekole retina, venler, yırtık kenarı, lattice sınırı'], ['#1a8f3c', 'Yeşil', 'vitreus opasitesi ve kanaması, ortam bulanıklığı'], ['#e0a800', 'Sarı', 'eksüda, ödem, drusen'], ['#111111', 'Siyah', 'pigment, koryoretinal skar, lazer izi'], ['#7a4a1e', 'Kahverengi', 'koroid pigmentasyonu, nevüs']];
  var S = { goz: 'sag', renk: 0, kal: 3, silgi: false, not: '' }, ST = [], cur = null, W = 0, H = 0;
  root.innerHTML = '<p class="cgt-lead">Periferik retina muayenesi için saat kadranlı fundus şablonu: standart renk koduyla ekranda çizin, göz ve not ekleyip PNG olarak indirin ya da yazdırın.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="czP"></div><div class="cgt-col">' + K.stage('cz', 'min(78vh,700px)', '#fff') + '<div class="cgt-info" id="czI"></div></div></div>' +
    '<p class="cgt-note">Halkalar içten dışa ekvatoru, ora serratayı ve pars planayı gösterir; saat kadranı muayene edenin baktığı yöne göredir. İndirekt oftalmoskopide görüntü ters olduğundan kâğıdı (ekranı) hastanın ayak ucuna doğru ters tutup gördüğünüzü aynen çizmek yönleri doğru verir. Çizim yalnızca cihazınızda tutulur ve sayfa kapanınca silinir; nota hasta adı yerine protokol numarası yazın.</p>' + K.dr;
  function panel() {
    K.$('czP').innerHTML = '<div><p class="cgt-h">Göz</p>' + K.chips('g', [['sag', 'Sağ (OD)'], ['sol', 'Sol (OS)']], S.goz) + '</div>' +
      '<div><p class="cgt-h">Renk kodu</p>' + R.map(function (r, i) { return '<button type="button" data-r="' + i + '" style="display:flex;gap:9px;align-items:flex-start;width:100%;text-align:left;border:1px solid ' + (!S.silgi && S.renk === i ? '#004aad' : '#d7e0ee') + ';background:' + (!S.silgi && S.renk === i ? '#eef5ff' : '#fff') + ';border-radius:10px;padding:7px 9px;margin-bottom:5px;cursor:pointer;font:inherit"><span style="flex:0 0 18px;height:18px;border-radius:50%;background:' + r[0] + ';margin-top:1px"></span><span style="font-size:13px;line-height:1.3"><b>' + r[1] + '</b><br><span style="color:#5b6b82">' + r[2] + '</span></span></button>'; }).join('') + '</div>' +
      K.range('kal', 'Kalem kalınlığı', S.kal, 1, 14, 1, ' px') +
      '<div class="cgt-chips"><button type="button" class="cgt-chip' + (S.silgi ? ' on' : '') + '" data-a="silgi">Silgi</button><button type="button" class="cgt-btn" data-a="geri">Geri al</button><button type="button" class="cgt-btn" data-a="temiz">Temizle</button></div>' +
      '<div><p class="cgt-h">Not (isteğe bağlı)</p><input type="text" id="czN" maxlength="70" placeholder="Örn. protokol no, tarih" value="' + S.not.replace(/"/g, '&quot;') + '"></div>' +
      '<div class="cgt-chips"><button type="button" class="cgt-btn b" data-a="png">PNG indir</button><button type="button" class="cgt-btn" data-a="yaz">Yazdır</button></div>';
  }
  function info() { K.$('czI').innerHTML = '<b>İpucu:</b> Parmağınızla ya da kalemle doğrudan şablonun üzerine çizin. Tam ekranda çizim alanı büyür; çizgiler ekran boyutu değişse de yerinde kalır. Şu ana kadar <b>' + ST.length + '</b> çizgi var.'; }
  function sablon(g, w, h) {
    var cx = w / 2, cy = h / 2, R3 = Math.min(w, h) * .45, R2 = R3 * .86, R1 = R3 * .6, i, nz = S.goz === 'sag' ? 1 : -1;
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8a96a8'; g.lineWidth = 1.2;
    [R1, R2, R3].forEach(function (r, j) { g.setLineDash(j === 1 ? [] : j === 0 ? [7, 5] : [2, 4]); g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke(); }); g.setLineDash([]);
    g.strokeStyle = '#c3ccd9'; g.lineWidth = 1; g.fillStyle = '#5b6b82'; g.font = '700 ' + Math.max(11, R3 * .055) + 'px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (i = 1; i <= 12; i++) { var a = i * Math.PI / 6, sx = Math.sin(a), sy = -Math.cos(a); g.beginPath(); g.moveTo(cx + sx * R1 * .28, cy + sy * R1 * .28); g.lineTo(cx + sx * R3, cy + sy * R3); g.stroke(); g.fillText(i, cx + sx * (R3 + R3 * .06), cy + sy * (R3 + R3 * .06)); }
    g.strokeStyle = '#8a96a8'; g.lineWidth = 1.4; g.beginPath(); g.ellipse(cx + nz * R1 * .3, cy - R1 * .02, R1 * .075, R1 * .09, 0, 0, 7); g.stroke(); g.beginPath(); g.arc(cx, cy, R1 * .03, 0, 7); g.stroke(); g.beginPath(); g.moveTo(cx - R1 * .06, cy); g.lineTo(cx + R1 * .06, cy); g.moveTo(cx, cy - R1 * .06); g.lineTo(cx, cy + R1 * .06); g.stroke();
    g.textBaseline = 'alphabetic'; g.fillStyle = '#14233b'; g.font = '800 ' + Math.max(13, R3 * .07) + 'px Arial'; g.textAlign = 'left'; g.fillText(S.goz === 'sag' ? 'Sağ göz (OD)' : 'Sol göz (OS)', 12, 24);
    g.font = '600 ' + Math.max(10.5, R3 * .045) + 'px Arial'; g.fillStyle = '#5b6b82'; g.fillText(S.goz === 'sag' ? 'Temporal ←   → Nazal' : 'Nazal ←   → Temporal', 12, 42); if (S.not) g.fillText(S.not, 12, h - 12);
    g.textAlign = 'right'; g.fillText('Kesikli: ekvator · Düz: ora serrata · Noktalı: pars plana', w - 12, h - 12);
    return [cx, cy, R3];
  }
  function draw(g, w, h) {
    W = w; H = h; var m = sablon(g, w, h); g.lineCap = 'round'; g.lineJoin = 'round';
    ST.concat(cur ? [cur] : []).forEach(function (s) { g.strokeStyle = s.c; g.lineWidth = s.w * m[2] / 300; g.beginPath(); s.p.forEach(function (p, i) { var x = m[0] + p[0] * m[2], y = m[1] + p[1] * m[2]; if (i) g.lineTo(x, y); else g.moveTo(x, y); }); if (s.p.length === 1) g.lineTo(m[0] + s.p[0][0] * m[2] + .1, m[1] + s.p[0][1] * m[2]); g.stroke(); });
  }
  panel(); info();
  var cv = K.$('czC'), redraw = K.fit(cv, draw);
  function nk(e) { var r = cv.getBoundingClientRect(), R3 = Math.min(W, H) * .45; return [(e.clientX - r.left - W / 2) / R3, (e.clientY - r.top - H / 2) / R3]; }
  cv.addEventListener('pointerdown', function (e) { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) { } cur = { c: S.silgi ? '#ffffff' : R[S.renk][0], w: S.silgi ? S.kal * 4 : S.kal, p: [nk(e)] }; redraw(); });
  cv.addEventListener('pointermove', function (e) { if (!cur) return; cur.p.push(nk(e)); redraw(); });
  function bit() { if (!cur) return; ST.push(cur); cur = null; info(); redraw(); }
  cv.addEventListener('pointerup', bit); cv.addEventListener('pointercancel', bit);
  function cikti() { var c = document.createElement('canvas'), g; c.width = 1600; c.height = 1600; g = c.getContext('2d'); var w0 = W, h0 = H; draw(g, 1600, 1600); W = w0; H = h0; return c.toDataURL('image/png'); }
  K.$('czP').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var g = b.getAttribute('data-g'), r = b.getAttribute('data-r'), a = b.getAttribute('data-a');
    if (g) S.goz = g; else if (r != null) { S.renk = +r; S.silgi = false; } else if (a === 'silgi') S.silgi = !S.silgi; else if (a === 'geri') ST.pop(); else if (a === 'temiz') ST = [];
    else if (a === 'png') { var l = document.createElement('a'), d = new Date(); l.href = cikti(); l.download = 'fundus-' + (S.goz === 'sag' ? 'OD' : 'OS') + '-' + d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) + '.png'; document.body.appendChild(l); l.click(); l.remove(); return; }
    else if (a === 'yaz') { var wn = window.open('', '_blank'); if (wn) { wn.document.write('<title>Fundus çizimi</title><body style="margin:0;text-align:center"><img src="' + cikti() + '" style="max-width:100%;max-height:100vh" onload="window.print()">'); wn.document.close(); } return; }
    else return; panel(); info(); redraw();
  });
  K.$('czP').addEventListener('input', function (e) { if (e.target.id === 'czN') { S.not = e.target.value; redraw(); } else if (e.target.getAttribute('data-k') === 'kal') { S.kal = +e.target.value; K.$('czP').querySelector('[data-v="kal"]').textContent = S.kal + ' px'; } });
})();
