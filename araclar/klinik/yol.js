/* Optik yol ve görme alanı defekti simülatörü · cagataygulumser.com */
(function () {
  'use strict';
  var K = window.CGK, root = document.getElementById('cgt-yol'); if (!K || !root || root.querySelector('canvas')) return;
  /* Sağ taraflı lezyon için tanımlar. f: [sol göz, sağ göz] alan defekti; h: yarı (L/R), q: kadran (U/D), t: total, m: makula korunur, c: santral skotom */
  var L = {
    sinir: { ad: 'Optik sinir', p: [.69, .2], f: [null, { t: 1 }], d: 'aynı gözde tek taraflı görme kaybı; ağır lezyonda total, hafif lezyonda santral skotom', n: 'Lezyon tarafında RAPD beklenir. Diğer gözün alanı normaldir.' },
    bileske: { ad: 'Sinir-kiazma bileşkesi', p: [.59, .31], f: [{ h: 'L', q: 'U' }, { t: 1 }], d: 'aynı gözde görme kaybı, karşı gözde üst temporal defekt (bileşke skotomu)', n: 'Karşı gözün alt nazal liflerinin kiazmada öne doğru yaptığı kıvrımla açıklanır; bu anatomik kıvrımın varlığı tartışmalıdır. Kliniği kitle lezyonu açısından uyarıcıdır.' },
    kiazma: { ad: 'Kiazma (orta hat)', p: [.5, .34], f: [{ h: 'L' }, { h: 'R' }], d: 'bitemporal hemianopsi', n: 'Çaprazlaşan nazal retina lifleri etkilenir. En sık neden hipofiz adenomudur; defekt çoğu kez üst kadranlardan başlar.', orta: 1 },
    traktus: { ad: 'Optik traktus', p: [.63, .45], f: [{ h: 'L' }, { h: 'L' }], d: 'karşı tarafta homonim hemianopsi (çoğu kez inkongrü)', n: 'İki gözdeki defekt birbirine tam benzemeyebilir; karşı gözde hafif RAPD ve bant atrofisi görülebilir.' },
    meyer: { ad: 'Temporal lob (Meyer halkası)', p: [.83, .6], f: [{ h: 'L', q: 'U' }, { h: 'L', q: 'U' }], d: 'karşı tarafta üst homonim kadranopsi', n: 'Alt retina liflerini taşıyan Meyer halkası temporal lobda öne doğru döner. Temporal lobektomi sonrası tipiktir.' },
    parietal: { ad: 'Parietal lob (üst radyasyo)', p: [.68, .66], f: [{ h: 'L', q: 'D' }, { h: 'L', q: 'D' }], d: 'karşı tarafta alt homonim kadranopsi', n: 'Üst retina liflerini taşıyan radyasyo etkilenir. Lezyon tarafına doğru optokinetik yanıt azalabilir.' },
    oksipital: { ad: 'Oksipital korteks', p: [.6, .87], f: [{ h: 'L', m: 1 }, { h: 'L', m: 1 }], d: 'karşı tarafta kongrü homonim hemianopsi, makula korunabilir', n: 'Arka serebral arter tıkanıklığında oksipital ucun orta serebral arterden de beslenmesi makula korunmasını açıklar. Defektler iki gözde birbirinin aynısıdır.' }
  };
  var KEYS = Object.keys(L), S = { mod: 'gos', lez: 'kiazma', yan: 'sag', soru: null, cvp: null, sk: { ok: 0, n: 0 } }, HIT = [];
  root.innerHTML = '<p class="cgt-lead">Görme yolunda lezyonun yerini seçin, iki gözde oluşan görme alanı defektini görün. Soru modunda defekt verilir, lezyonun yerini siz bulursunuz.</p>' +
    '<div class="cgt-main"><div class="cgt-panel" id="yoP"></div><div class="cgt-col">' + K.stage('yo', 'min(78vh,680px)', '#0b1730') + '<div class="cgt-info" id="yoI"></div></div></div>' +
    '<p class="cgt-note">Şema yukarıdan bakışla çizilmiştir; turuncu lifler sol görme alanını, mavi lifler sağ görme alanını taşır. Görme alanları hastanın gördüğü gibi (sol göz solda) gösterilir. Defektler tipik, tam lezyonlar içindir; gerçekte kısmi ve karışık tablolar sıktır.</p>' + K.dr;
  function akt() { return S.mod === 'soru' ? S.soru : { lez: S.lez, yan: S.yan }; }
  function yeniSoru() { S.soru = { lez: KEYS[Math.floor(Math.random() * KEYS.length)], yan: Math.random() < .5 ? 'sag' : 'sol' }; S.cvp = null; }
  function panel() {
    var h = '<div><p class="cgt-h">Mod</p>' + K.chips('m', [['gos', 'Gösterim'], ['soru', 'Soru']], S.mod) + '</div>';
    if (S.mod === 'gos') h += '<div><p class="cgt-h">Lezyon yeri</p>' + K.chips('l', KEYS.map(function (k) { return [k, L[k].ad]; }), S.lez) + '</div><div><p class="cgt-h">Taraf</p>' + K.chips('y', [['sag', 'Sağ'], ['sol', 'Sol']], S.yan) + '</div>';
    else h += '<div><p class="cgt-h">Lezyon nerede?</p>' + K.chips('c', KEYS.map(function (k) { return [k, L[k].ad]; }), S.cvp) + '<div style="font-size:12.5px;color:#5b6b82;margin-top:6px">Alttaki görme alanlarına bakıp yeri seçin; şemadaki noktalara da dokunabilirsiniz.</div></div><div class="cgt-chips"><button type="button" class="cgt-btn y" data-a="yeni">Yeni soru</button></div><div style="font-size:20px;font-weight:800;color:#004aad">' + S.sk.ok + ' / ' + S.sk.n + '</div>';
    K.$('yoP').innerHTML = h;
  }
  function info() {
    var a = akt(), l = L[a.lez], kar = a.yan === 'sag' ? 'sol' : 'sağ', ay = a.yan === 'sag' ? 'sağ' : 'sol', el = K.$('yoI');
    if (S.mod === 'soru' && S.cvp == null) { el.innerHTML = '<b>Soru:</b> Bu görme alanı defektine yol açan lezyon nerededir?'; return; }
    var t = '<b>' + (l.orta ? '' : ay.charAt(0).toUpperCase() + ay.slice(1) + ' ') + (l.orta ? l.ad : l.ad.charAt(0).toLowerCase() + l.ad.slice(1)) + ':</b> ' + l.d.replace(/karşı tarafta/g, kar + ' tarafta').replace(/aynı gözde/g, ay + ' gözde').replace(/karşı gözde/g, kar + ' gözde') + '. ' + l.n;
    if (S.mod === 'soru') t = (S.cvp === a.lez ? '<b style="color:#0a7a3d">Doğru.</b> ' : '<b style="color:#b3261e">Tutmadı.</b> ') + t;
    el.innerHTML = t;
  }
  function alan(g, cx, cy, r, d, ad) {
    g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fillStyle = '#f4f7fc'; g.fill(); g.clip();
    if (d) { g.fillStyle = '#10151f'; if (d.t) g.fillRect(cx - r, cy - r, 2 * r, 2 * r); else { var x = d.h === 'L' ? cx - r : cx, y = d.q === 'D' ? cy : cy - r; g.fillRect(x, y, r, d.q ? r : 2 * r); if (d.m) { g.fillStyle = '#f4f7fc'; g.beginPath(); g.arc(cx, cy, r * .2, 0, 7); g.fill(); } } }
    g.restore(); g.strokeStyle = '#9db4d6'; g.lineWidth = 1.5; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke(); g.strokeStyle = 'rgba(120,150,190,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - r, cy); g.lineTo(cx + r, cy); g.moveTo(cx, cy - r); g.lineTo(cx, cy + r); g.stroke();
    g.fillStyle = '#cfe3ff'; g.font = '700 13px Arial'; g.textAlign = 'center'; g.fillText(ad, cx, cy + r + 18);
  }
  function draw(g, w, h) {
    g.fillStyle = '#0b1730'; g.fillRect(0, 0, w, h);
    var dh = h * .64, s = Math.min(w / 520, dh / 400), ox = w / 2 - 260 * s, oy = (dh - 400 * s) / 2 + 6, a = akt(), sg = a.yan === 'sag' ? 1 : -1, O = '#ff9f43', B = '#4da3ff';
    function X(x) { return ox + x * 520 * s; } function Y(y) { return oy + y * 400 * s; }
    function yol(c, pts, lw) { g.strokeStyle = c; g.lineWidth = lw || 3.2; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(X(pts[0]), Y(pts[1])); for (var i = 2; i < pts.length; i += 6) g.bezierCurveTo(X(pts[i]), Y(pts[i + 1]), X(pts[i + 2]), Y(pts[i + 3]), X(pts[i + 4]), Y(pts[i + 5])); g.stroke(); }
    /* beyin hatları */
    g.strokeStyle = 'rgba(160,190,230,.22)'; g.lineWidth = 2; g.beginPath(); g.ellipse(X(.5), Y(.6), 215 * s, 150 * s, 0, 0, 7); g.stroke();
    /* gözler */
    [.31, .69].forEach(function (x) { g.fillStyle = '#eef3fb'; g.beginPath(); g.arc(X(x), Y(.08), 24 * s, 0, 7); g.fill(); g.fillStyle = '#3b5d7a'; g.beginPath(); g.arc(X(x), Y(.08) - 15 * s, 9 * s, 0, 7); g.fill(); });
    /* lifler: turuncu = sol alan (sağ traktus), mavi = sağ alan (sol traktus) */
    yol(B, [.295, .135, .30, .22, .40, .28, .43, .34, .44, .40, .40, .44, .37, .47]);            /* sol göz temporal retina → sol traktus */
    yol(O, [.325, .135, .33, .22, .44, .29, .5, .34, .56, .39, .60, .43, .63, .47]);              /* sol göz nazal retina → çapraz */
    yol(O, [.705, .135, .70, .22, .60, .28, .57, .34, .56, .40, .60, .44, .63, .47]);            /* sağ göz temporal retina → sağ traktus */
    yol(B, [.675, .135, .67, .22, .56, .29, .5, .34, .44, .39, .40, .43, .37, .47]);              /* sağ göz nazal retina → çapraz */
    [[.37, B, -1], [.63, O, 1]].forEach(function (t) {
      var x = t[0], c = t[1], k = t[2];
      g.fillStyle = c; g.beginPath(); g.ellipse(X(x), Y(.5), 13 * s, 9 * s, 0, 0, 7); g.fill();
      yol(c, [x, .52, x + k * .03, .6, x + k * .05, .74, .5 + k * .1, .9]);                     /* üst (parietal) radyasyo */
      yol(c, [x + k * .02, .51, x + k * .26, .5, x + k * .24, .72, .5 + k * .13, .9]);          /* Meyer halkası */
      g.fillStyle = c; g.globalAlpha = .85; g.beginPath(); g.ellipse(X(.5 + k * .1), Y(.92), 34 * s, 13 * s, 0, 0, 7); g.fill(); g.globalAlpha = 1;
    });
    g.fillStyle = 'rgba(207,227,255,.8)'; g.font = '600 ' + Math.max(10, 11.5 * s) + 'px Arial'; g.textAlign = 'center';
    g.fillText('Sol göz', X(.31), Y(.08) + 42 * s); g.fillText('Sağ göz', X(.69), Y(.08) + 42 * s); g.fillText('Kiazma', X(.5), Y(.34) - 22 * s); g.fillText('LGN', X(.37) - 26 * s, Y(.5) + 4); g.fillText('LGN', X(.63) + 26 * s, Y(.5) + 4); g.fillText('Oksipital korteks', X(.5), Y(.99));
    /* lezyon noktaları */
    HIT = [];
    KEYS.forEach(function (k) {
      [1, -1].forEach(function (yn) {
        var l = L[k]; if (l.orta && yn === -1) return; var px = X(.5 + (l.p[0] - .5) * yn), py = Y(l.p[1]), on = S.mod === 'gos' ? (k === a.lez && (l.orta || yn === sg)) : (S.cvp != null && k === a.lez && (l.orta || yn === sg));
        HIT.push([px, py, k, yn === 1 ? 'sag' : 'sol']);
        if (on) { g.strokeStyle = '#ff3b3b'; g.lineWidth = 5; g.beginPath(); g.moveTo(px - 13 * s, py - 13 * s); g.lineTo(px + 13 * s, py + 13 * s); g.moveTo(px + 13 * s, py - 13 * s); g.lineTo(px - 13 * s, py + 13 * s); g.stroke(); }
        else { g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(px, py, 5.5 * s, 0, 7); g.fill(); g.strokeStyle = '#0b1730'; g.lineWidth = 1.5; g.stroke(); }
      });
    });
    /* görme alanları */
    var f = L[a.lez].f, sol = f[0], sag = f[1];
    function ayna(d) { return d && !d.t ? { h: d.h === 'L' ? 'R' : 'L', q: d.q, m: d.m } : d; }
    if (a.yan === 'sol') { var t = sol; sol = ayna(sag); sag = ayna(t); }
    var r = Math.min(h * .13, w * .16), fy = dh + (h - dh) / 2 - 6;
    alan(g, w / 2 - r * 1.5, fy, r, sol, 'Sol göz alanı'); alan(g, w / 2 + r * 1.5, fy, r, sag, 'Sağ göz alanı');
  }
  yeniSoru(); panel();
  var cv = K.$('yoC'), redraw = K.fit(cv, draw); info();
  function cevap(k) { if (S.cvp != null) return; S.cvp = k; S.sk.n++; if (k === S.soru.lez) S.sk.ok++; }
  cv.addEventListener('pointerdown', function (e) {
    var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, best = null, bd = 30 * 30;
    HIT.forEach(function (p) { var d = (p[0] - x) * (p[0] - x) + (p[1] - y) * (p[1] - y); if (d < bd) { bd = d; best = p; } });
    if (!best) return; if (S.mod === 'gos') { S.lez = best[2]; S.yan = best[3]; } else cevap(best[2]); panel(); info(); redraw();
  });
  K.$('yoP').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var m = b.getAttribute('data-m'), l = b.getAttribute('data-l'), y = b.getAttribute('data-y'), c = b.getAttribute('data-c');
    if (m) { S.mod = m; if (m === 'soru') yeniSoru(); } else if (l) S.lez = l; else if (y) S.yan = y; else if (c) cevap(c); else if (b.getAttribute('data-a') === 'yeni') yeniSoru(); else return;
    panel(); info(); redraw();
  });
})();
