/* Göz Anatomisi Bulmacası — parçaları sürükleyip yerine koyma · cagataygulumser.com */
(function () {
  'use strict';
  var root = document.getElementById('cgt-anatomi'); if (!root || root.firstChild) return;
  /* [ad, x, y, görev] — kesit: göz sola bakıyor, viewBox 0 0 640 420 */
  var P = [
    ['Kornea', 149, 210, 'Gözün en öndeki saydam tabakası. Işığı ilk ve en güçlü kıran yüzeydir; gözün toplam kırma gücünün yaklaşık üçte ikisini sağlar.'],
    ['Ön kamara', 186, 232, 'Kornea ile iris arasındaki, göz sıvısıyla (aköz hümör) dolu boşluk. Bu sıvının dışa akışı göz içi basıncını belirler.'],
    ['İris', 221, 152, 'Göze rengini veren kas dokusu. Göz bebeğini büyütüp küçülterek göze giren ışık miktarını ayarlar.'],
    ['Göz bebeği', 231, 210, 'İrisin ortasındaki açıklık (pupil). Karanlıkta büyür, aydınlıkta küçülür.'],
    ['Mercek', 264, 210, 'İrisin arkasındaki esnek, saydam yapı. Biçim değiştirerek yakına odaklanmayı (akomodasyon) sağlar; yaşla sertleşir.'],
    ['Silier cisim', 228, 106, 'Merceği lifleriyle taşıyan halka biçimli kas. Kasılarak merceğin biçimini değiştirir ve göz sıvısını üretir.'],
    ['Vitreus', 372, 196, 'Göz küresinin içini dolduran saydam, jel kıvamında madde. Gözün biçimini korur.'],
    ['Sklera', 306, 53, 'Gözün beyaz, sağlam dış tabakası. Göz küresini korur; göz kasları buraya tutunur.'],
    ['Retina', 436, 105, 'Gözün arkasını döşeyen ışığa duyarlı sinir tabakası. Işığı sinir sinyaline çevirir.'],
    ['Sarı nokta', 478, 210, 'Retinanın merkezi (makula). Okuma ve yüz tanıma gibi ince, keskin görmeden sorumludur.'],
    ['Optik sinir', 524, 292, 'Retinadan gelen sinyalleri beyne taşıyan sinir demeti. Gözden çıktığı yerde ışığa duyarlı hücre yoktur; kör nokta burada oluşur.']
  ];
  var done, sel, order, miss, t0, drag = null;
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function reset() { done = {}; sel = -1; miss = 0; t0 = Date.now(); order = shuffle(P.map(function (_, i) { return i; })); last = null; render(); }
  var last = null;
  function svg() {
    var s = '<svg viewBox="0 0 640 420" style="display:block;width:100%;height:auto;touch-action:none;user-select:none;-webkit-user-select:none" role="img" aria-label="Göz küresinin yatay kesiti">' +
      '<rect width="640" height="420" fill="#f3f7fd"/>' +
      /* optik sinir */ '<path d="M462 252 L560 300 L548 330 L448 280 Z" fill="#f0d98a" stroke="#b8982e" stroke-width="2"/><path d="M470 262 L552 303 M464 271 L546 312" stroke="#b8982e" stroke-width="1.3" opacity=".7"/>' +
      /* sklera */ '<circle cx="330" cy="210" r="160" fill="#fff" stroke="#8fa3c2" stroke-width="3"/>' +
      /* koroid + retina */ '<path d="M252 75 A156 156 0 1 1 252 345" fill="none" stroke="#c0564b" stroke-width="5"/><path d="M257 82 A149 149 0 1 1 257 338" fill="none" stroke="#f0a43c" stroke-width="7"/>' +
      /* vitreus */ '<path d="M262 90 A142 142 0 1 1 262 330 Q300 210 262 90 Z" fill="#e4f1ff"/>' +
      /* makula */ '<path d="M476 196 Q466 210 476 224" fill="none" stroke="#c98a00" stroke-width="5" stroke-linecap="round"/>' +
      /* kornea + ön kamara */ '<path d="M204 111.5 A112 112 0 0 0 204 308.5 L214 300 A102 102 0 0 1 214 120 Z" fill="#bfe0ff" stroke="#5b8fd0" stroke-width="2"/><path d="M214 120 A102 102 0 0 0 214 300 L232 240 L232 180 Z" fill="#eaf5ff"/>' +
      /* silier cisim */ '<path d="M206 112 L246 104 L238 136 Z" fill="#b5651d"/><path d="M206 308 L246 316 L238 284 Z" fill="#b5651d"/>' +
      /* zonüller */ '<path d="M240 130 L262 152 M236 134 L256 160 M240 290 L262 268 M236 286 L256 260" stroke="#8fa3c2" stroke-width="1.4"/>' +
      /* iris */ '<path d="M212 122 L236 180 L228 182 L206 128 Z" fill="#3b7a57"/><path d="M212 298 L236 240 L228 238 L206 292 Z" fill="#3b7a57"/>' +
      /* mercek */ '<ellipse cx="264" cy="210" rx="25" ry="60" fill="#fff6c9" stroke="#c9a93a" stroke-width="2.5"/>' +
      /* ışık yönü */ '<path d="M30 210 H104 M92 200 L106 210 L92 220" fill="none" stroke="#5b6b82" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="30" y="194" font-size="14" font-weight="700" fill="#5b6b82">Işık</text>';
    P.forEach(function (p, i) {
      var d = done[i];
      s += '<g data-t="' + i + '" style="cursor:pointer">' + (last === i ? '<circle cx="' + p[1] + '" cy="' + p[2] + '" r="15" fill="none" stroke="#0a7a3d" stroke-width="3"><animate attributeName="r" from="15" to="30" dur=".7s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur=".7s" fill="freeze"/></circle>' : '') +
        '<circle cx="' + p[1] + '" cy="' + p[2] + '" r="24" fill="transparent"/><circle cx="' + p[1] + '" cy="' + p[2] + '" r="14" fill="' + (d ? '#0a7a3d' : '#004aad') + '" stroke="#fff" stroke-width="3"/><text x="' + p[1] + '" y="' + (p[2] + 5) + '" text-anchor="middle" font-size="14" font-weight="800" fill="#fff" pointer-events="none">' + (d ? '✓' : (i + 1)) + '</text>';
      if (d) { var w = p[0].length * 8.2 + 16, tx = Math.min(640 - w / 2 - 4, Math.max(w / 2 + 4, p[1])), ty = p[2] < 80 ? p[2] + 36 : p[2] - 24; s += '<rect x="' + (tx - w / 2) + '" y="' + (ty - 14) + '" width="' + w + '" height="20" rx="10" fill="#0a7a3d" pointer-events="none"/><text x="' + tx + '" y="' + ty + '" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" pointer-events="none">' + p[0] + '</text>'; }
      s += '</g>';
    });
    return s + '</svg>';
  }
  function render() {
    var n = Object.keys(done).length, fin = n === P.length, sec = Math.round((Date.now() - t0) / 1000);
    var chips = order.filter(function (i) { return !done[i]; }).map(function (i) { return '<button type="button" class="cgt-chip' + (sel === i ? ' on' : '') + '" data-p="' + i + '" style="touch-action:none;font-size:15px;padding:10px 15px">' + P[i][0] + '</button>'; }).join('');
    root.innerHTML = '<p class="cgt-lead">Göz küresinin kesitinde ' + P.length + ' numaralı nokta var. Parça adını doğru noktaya sürükleyin; telefonda önce ada, sonra noktaya dokunmanız da yeter.</p>' +
      '<div class="cgt-main" style="grid-template-columns:minmax(0,1fr) 320px"><div class="cgt-panel" style="padding:8px;order:0" id="anS">' + svg() + '</div>' +
      '<div class="cgt-col" style="display:flex;flex-direction:column;gap:12px;order:0"><div class="cgt-panel"><div class="cgt-row" style="margin:0"><span>Yerleştirilen</span><b>' + n + ' / ' + P.length + (miss ? ' · ' + miss + ' hata' : '') + '</b></div>' +
      (fin ? '<div style="font-size:16px"><b style="color:#0a7a3d">Bulmaca tamamlandı.</b> ' + (miss ? miss + ' hatayla, ' : 'Hatasız, ') + sec + ' saniyede bitirdiniz.</div><button type="button" class="cgt-btn y" data-a="again" style="align-self:flex-start;padding:10px 18px">Yeniden karıştır</button>' : '<div class="cgt-chips" id="anC">' + chips + '</div>') + '</div>' +
      '<div class="cgt-info" style="margin-top:0" id="anI">' + (last != null ? '<b>' + P[last][0] + ':</b> ' + P[last][3] : msg || '<b>Nasıl oynanır?</b> Bir parça adı seçip kesitteki numaralı noktaya bırakın. Doğru yerleştirdiğiniz parçanın görevi burada yazar.') + '</div>' +
      (n ? '<div class="cgt-panel" style="gap:8px"><p class="cgt-h" style="margin:0">Yerleştirdikleriniz</p>' + P.map(function (p, i) { return done[i] ? '<button type="button" data-r="' + i + '" style="text-align:left;border:0;background:none;padding:2px 0;font:inherit;font-size:14px;cursor:pointer;color:#14233b"><b style="color:#0a7a3d">' + (i + 1) + '.</b> ' + p[0] + '</button>' : ''; }).join('') + '</div>' : '') + '</div></div>' +
      '<p class="cgt-note">Çizim şematiktir; oranlar anlatım kolaylığı için basitleştirilmiştir. Parçaları kendi gözünüzde canlı görmek için <a href="/p/canl-goz-atlas.html">Canlı Göz Atlası</a>, terimler için <a href="/p/optik-sozluk.html">Optik Sözlük</a>.</p>';
    msg = '';
  }
  var msg = '';
  function place(pi, ti) {
    if (pi < 0 || done[ti]) return;
    if (pi === ti) { done[ti] = 1; last = ti; sel = -1; }
    else { miss++; last = null; msg = '<b style="color:#b3261e">Olmadı.</b> ' + (ti + 1) + ' numaralı nokta <b>' + P[pi][0] + '</b> değil. İpucu: ' + P[pi][3].split('.')[0] + '.'; }
    render();
  }
  function tAt(x, y) { var e = document.elementFromPoint(x, y); e = e && e.closest ? e.closest('[data-t]') : null; return e ? +e.getAttribute('data-t') : -1; }
  root.addEventListener('pointerdown', function (e) {
    var b = e.target.closest('button[data-p]'); if (!b) return; var r = b.getBoundingClientRect(), g = b.cloneNode(true);
    g.style.cssText += ';position:fixed;z-index:9999;pointer-events:none;margin:0;left:' + r.left + 'px;top:' + r.top + 'px;background:#004aad;color:#fff;border-color:#004aad;box-shadow:0 8px 20px rgba(0,40,110,.35);display:none';
    document.body.appendChild(g); drag = { i: +b.getAttribute('data-p'), x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, g: g, mv: false, id: e.pointerId };
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return; if (!drag.mv && Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 8) return;
    drag.mv = true; drag.g.style.display = ''; drag.g.style.left = (e.clientX - drag.dx) + 'px'; drag.g.style.top = (e.clientY - drag.dy) + 'px'; e.preventDefault();
  }, { passive: false });
  function end(e) {
    if (!drag || (e.pointerId != null && e.pointerId !== drag.id)) return; var d = drag; drag = null; d.g.remove();
    if (e.type === 'pointercancel') return;
    if (d.mv) { var t = tAt(e.clientX, e.clientY); if (t >= 0) place(d.i, t); }
    else { sel = sel === d.i ? -1 : d.i; last = null; render(); }
  }
  window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (b && b.getAttribute('data-a') === 'again') return reset();
    if (b && b.hasAttribute('data-r')) { last = +b.getAttribute('data-r'); return render(); }
    var g = e.target.closest('[data-t]'); if (!g) return; var ti = +g.getAttribute('data-t');
    if (done[ti]) { last = ti; render(); } else if (sel >= 0) place(sel, ti); else { msg = '<b>Önce bir parça adı seçin,</b> sonra bu noktaya dokunun.'; last = null; render(); }
  });
  reset();
})();
